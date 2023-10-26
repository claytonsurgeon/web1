const kv = await Deno.openKv();

export interface Contact {}

export type Contacts = Record<string, Contact>;

export const contact_search = (q: String) => {};
export const contact_all = () => {};
