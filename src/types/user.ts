export type User = {
  id: string;
  /** Display name (the account's username). */
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};
