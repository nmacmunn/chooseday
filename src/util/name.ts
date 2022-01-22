import type { Decision, User } from "../types/data";

type Role = "current" | "creator" | "collaborator";

/**
 * Return a description of the specified user with respect to the specified
 * decision.
 */
export function getName(
  user: User,
  currentUser: User,
  decision: Decision,
  upper = false
) {
  const role = getRole(user, currentUser, decision);
  return getUserTitle(user, role, upper);
}

/**
 * Return a description of the specified group of users with respect to
 * the specified decision.
 */
export function getNames(
  users: User[],
  currentUser: User,
  decision: Decision,
  upper = false
) {
  const userRoles = getUserRoles(users, currentUser, decision);
  return getUserTitles(userRoles, upper);
}

/**
 * Get the possessive form of the specified user's role with respect to the
 * specified decisions.
 *
 * e.g., your, the creator's, a collaborator's, user@gmail.com's
 */
export function getPossessive(
  user: User,
  currentUser: User,
  decision: Decision,
  upper = false
) {
  const role = getRole(user, currentUser, decision);
  const name = getUserTitle(user, role, upper);
  if (role === "current") {
    return `${name}r`;
  }
  return `${name}'s`;
}

/**
 * Is the specified user the current user, the creator, or a collaborator on
 * the specified decision?
 */
function getRole(user: User, currentUser: User, decision: Decision): Role {
  if (user.id === currentUser.id) {
    return "current";
  }
  if (user.id === decision.creator.id) {
    return "creator";
  }
  return "collaborator";
}

/**
 * Return an array of users and their roles with respect to the specified
 * decision. The current user and the creator appear at the beginning of the
 * result if they are present.
 */
function getUserRoles(
  users: User[],
  currentUser: User,
  decision: Decision
): [User, Role][] {
  const roles: Record<Role, User[]> = {
    collaborator: [],
    creator: [],
    current: [],
  };
  for (const user of users) {
    const role = getRole(user, currentUser, decision);
    roles[role].push(user);
  }
  return [
    ...roles.current.map((user) => [user, "current"] as [User, Role]),
    ...roles.creator.map((user) => [user, "creator"] as [User, Role]),
    ...roles.collaborator.map((user) => [user, "collaborator"] as [User, Role]),
  ];
}

/**
 * Given a role, return a user's title
 */
function getUserTitle(user: User, role: Role, upper: boolean) {
  if (role === "current") {
    return upper ? "You" : "you";
  }
  if (role === "creator") {
    return upper ? "The creator" : "the creator";
  }
  return user.email || (upper ? "A collaborator" : "a collaborator");
}

/**
 * Given an array of users and their roles, return a description of the group
 */
function getUserTitles(userRoles: [User, Role][], upper: boolean) {
  if (userRoles.length === 0) {
    return "";
  }
  const name1 = getUserTitle(...userRoles[0], upper);
  if (userRoles.length === 1) {
    return name1;
  }
  const name2 = getUserTitle(...userRoles[1], false);
  if (userRoles.length === 2) {
    return `${name1} and ${name2}`;
  }
  if (userRoles.length === 3) {
    return `${name1}, ${name2}, and 1 other`;
  }
  return `${name1}, ${name2}, and ${userRoles.length - 2} others`;
}
