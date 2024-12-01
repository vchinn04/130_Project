export {}

export type UserId = string; // sourced from clerk
export type GroupId = string; // UUID v4, generated at creation time

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      joinedGroups: GroupId[];
      ownedGroups: GroupId[];
    }
  }
}
