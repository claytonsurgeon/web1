const kv = await Deno.openKv();

export interface Contact {
	first: string;
	last: string;
	phone: string;
	email: string;
	id: string;
}

export type Contacts = Record<string, Contact>;

export const contact_search = (q: String): Contacts => {
	return {
		"123": {
			first: "John",
			last: "Smith",
			phone: "(123) 456 7890",
			email: "john@example.com",
			id: "123",
		},
	};
};
export const contact_all = (): Contacts => {
	return {
		"123": {
			first: "John",
			last: "Smith",
			phone: "(123) 456 7890",
			email: "john@example.com",
			id: "123",
		},
		"456": {
			first: "Dana",
			last: "Crandith",
			phone: "(123) 456 7890",
			email: "dcran@example.com",
			id: "456",
		},
		"789": {
			first: "Edith",
			last: "Neutvaar",
			phone: "(123) 456 7890",
			email: "en@example.com",
			id: "789",
		},
	};
};
