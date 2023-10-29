const kv = await Deno.openKv();

export interface Contact {
	first: string;
	last: string;
	phone: string;
	email: string;
	id: string;

	errors: Record<string, string>;
}

export type Contacts = Record<string, Contact>;

//should be throttled at 10 minutes using queue
export const alphabetizeContacts = async (force = false) => {
	const timestamp = (await kv.get<number>(["alphabetized-contacts-last-sync"])).value || 0;
	console.log({ timestamp });
	const diff = (Date.now() - timestamp) / 1000;

	console.log({ diff });
	// return;
	if (!force && diff < 60 * 10) return;
	console.log("alphabetizing contacts");
	await kv.set(["alphabetized-contacts-last-sync"], Date.now());

	const contacts: Contacts = {};

	const entries = kv.list<Contact>({ prefix: ["contacts"] });
	for await (const entry of entries) {
		const contact = entry.value;
		contacts[contact.id] = contact;
	}

	const keys = Object.keys(contacts).sort((a, b) =>
		contacts[a].first.localeCompare(contacts[b].first)
	);

	let i = 0;
	const batch = kv.atomic();
	for (const key of keys) {
		batch.set(["alphabetized-contacts", i], key);
		i++;
	}
	batch.set(["contacts-count"], keys.length);

	await batch.commit();
};

alphabetizeContacts();

export const getContacts = async (start: number, limit: number): Promise<[Contacts, number]> => {
	const contacts: Contacts = {};
	const keys: string[] = [];

	const entries = kv.list<string>(
		{ prefix: ["alphabetized-contacts"], start: ["alphabetized-contacts", start] },
		{ limit }
	);

	for await (const entry of entries) {
		// console.log(entry.value);
		keys.push(entry.value);
	}

	const batch = await kv.getMany<Contact[]>(keys.map(key => ["contacts", key]));

	// console.log(batch);

	for (const contact of batch) {
		if (contact.value) {
			contacts[contact.value.id] = contact.value;
		}
	}

	const count = (await kv.get<number>(["contacts-count"])).value || 0;

	return [contacts, count];
};

export const contact_search = (_q: string): Contacts => {
	return {
		"123": {
			first: "John",
			last: "Smith",
			phone: "(123) 456 7890",
			email: "john@example.com",
			id: "123",

			errors: {},
		},
	};
};

export const contact_all = async (): Promise<Contacts> => {
	const contacts: Contacts = {};

	const entries = kv.list({ prefix: ["contacts"] });
	for await (const entry of entries) {
		const contact = entry.value as Contact;
		contacts[contact.id] = contact;
	}

	// const encoder = new TextEncoder();
	// const data = encoder.encode(JSON.stringify(contacts, null, 3));
	// Deno.writeFile("./databackup.json", data);

	return contacts;
	// return {
	// 	"123": {
	// 		first: "John",
	// 		last: "Smith",
	// 		phone: "(123) 456 7890",
	// 		email: "john@example.com",
	// 		id: "123",
	// 	},
	// 	"456": {
	// 		first: "Dana",
	// 		last: "Crandith",
	// 		phone: "(123) 456 7890",
	// 		email: "dcran@example.com",
	// 		id: "456",
	// 	},
	// 	"789": {
	// 		first: "Edith",
	// 		last: "Neutvaar",
	// 		phone: "(123) 456 7890",
	// 		email: "en@example.com",
	// 		id: "789",
	// 	},
	// };
};

export const getContact = async (id: string): Promise<Contact | null> => {
	const entry = await kv.get(["contacts", id]);

	if (entry.value) {
		return entry.value as Contact;
	}
	return null;
};

export const validateEmail = async (email: string, id = ""): Promise<string> => {
	if (!email.includes("@")) {
		return "invalid email format";
	}
	const entries = kv.list({ prefix: ["contacts"] });
	for await (const entry of entries) {
		const contact = entry.value as Contact;
		if (contact.id == id) continue;
		if (contact.email == email) return "email is already registered";
	}

	return "";
};

export const createContact = async (contact: Contact): Promise<Contact> => {
	contact.errors = {};

	if (!contact.first) {
		contact.errors.first = "A first name is required";
	}
	if (!contact.last) {
		contact.errors.last = "A last name is required";
	}
	if (!contact.email) {
		contact.errors.email = "An email is required";
	}
	const email_validation_error = await validateEmail(contact.email);
	if (email_validation_error) {
		contact.errors.email = email_validation_error;
	}

	if (!contact.phone) {
		contact.errors.phone = "A phone number is required";
	}

	for (const _errorType in contact.errors) {
		return contact;
	}

	contact.id = crypto.randomUUID();
	const key = ["contacts", contact.id];

	// no need for atomic when commiting with UUID
	const res = await kv.set(key, contact);
	// const res = await kv.atomic().check({ key, versionstamp: null }).set(key, contact).commit();

	if (res.ok) {
		return contact;
	} else {
		throw new Error("Could not create contact");
	}
};

export const updateContact = async (contact: Contact): Promise<Contact> => {
	const entry = await kv.get(["contacts", contact.id]);

	if (!entry.value) throw new Error("Cannot update contact. Entry does not exist");

	contact.errors = {};

	if (!contact.first) {
		contact.errors.first = "A first name is required";
	}
	if (!contact.last) {
		contact.errors.last = "A last name is required";
	}
	if (!contact.email) {
		contact.errors.email = "An email is required";
	}

	const email_validation_error = await validateEmail(contact.email, contact.id);
	if (email_validation_error) {
		contact.errors.email = email_validation_error;
	}

	if (!contact.phone) {
		contact.errors.phone = "A phone number is required";
	}

	for (const _errorType in contact.errors) {
		return contact;
	}

	const key = ["contacts", contact.id];
	const res = await kv.set(key, contact);

	if (res.ok) {
		return contact;
	} else {
		throw new Error("Could not update contact");
	}
};

export const deleteContact = async (id: string) => {
	await kv.delete(["contacts", id]);
};
