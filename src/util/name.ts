import type { Decision, User } from "../types/data";

export function getName(user: User, currentUser: User, decision: Decision) {
  if (user.id === currentUser.id) {
    return "You";
  }
  if (user.id === decision.creator.id) {
    return "Creator";
  }
  return user.email || "Collaborator";
}
