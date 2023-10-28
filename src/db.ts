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

export const alphabetizeContacts = async () => {
	const timestamp = ((await kv.get(["alphabetized-contacts-last-sync"])).value as number) || 0;
	const diff = (Date.now() - timestamp) / 1000;

	console.log({ diff });
	if (diff < 10) return;
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

	for (const key of keys) {
	}
};

alphabetizeContacts();

export const getContacts = (start: number, limit: number) => {
	const contacts: Contacts = {};

	const entries = kv.list({ prefix: ["contacts"], start: ["contacts", start] }, { limit });
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
