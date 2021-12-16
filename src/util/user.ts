import type { User } from "../types/data";

export function hasEmail(user: User): user is User & { email: string } {
  return typeof user.email === "string";
}
