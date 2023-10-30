export interface Contact {
	first: string;
	last: string;
	phone: string;
	email: string;
	id: string;

	errors: Record<string, string>;
}

export type Contacts = Record<string, Contact>;

export interface State {
	contacts: Contacts;
	count: number;
	page: number;
	q?: string;
}
