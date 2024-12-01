import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { UserId, GroupId } from "@/types/globals";

/**
 * Get the groups that the current user (who initiated this request) has joined
 * @returns a list of group IDs that the user has joined (as a promise)
 * @throws errors if the request headers do not have a valid session
 */
export const clerkGetJoinedGroups = async (): Promise<GroupId[]> => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata?.joinedGroups ?? [];
}

/**
 * Get the groups that the current user (who initiated this request) owns
 * @returns a list of group IDs that the user owns (as a promise)
 * @throws errors if the request headers do not have a valid session
 */
export const clerkGetOwnedGroups = async (): Promise<GroupId[]> => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata?.ownedGroups ?? [];
}

/**
 * Get all groups that the current user (who initiated this request) is a member of
 * @returns a list of group IDs that the user is a member of
 * @throws errors if the request headers do not have a valid session
 */
export const clerkGetAllGroups = async (): Promise<GroupId[]> => {
  const joinedGroups = await clerkGetJoinedGroups();
  const ownedGroups = await clerkGetOwnedGroups();
  return [...joinedGroups, ...ownedGroups];
}

/**
 * Add a group to the current user's joined groups
 * @param groupId - the ID of the group to add
 * @returns the clerk response user object
 * @throws errors if the request headers do not have a valid session or connection to the clerk API fails
 */
export const clerkAddJoinedGroup = async (groupId: GroupId) => {
  const { sessionClaims } = await auth();
  const client = await clerkClient();
  const res = await client.users.updateUserMetadata(sessionClaims?.userId as UserId, {
    publicMetadata: {
      joinedGroups: [...(await clerkGetJoinedGroups()), groupId],
      ownedGroups: await clerkGetOwnedGroups()
    }
  })
  return res;
}

/**
 * Add a group to the current user's owned groups
 * @param groupId - the ID of the group to add
 * @returns the clerk response user object
 * @throws errors if the request headers do not have a valid session or connection to the clerk API fails
 */
export const clerkAddOwnedGroup = async (groupId: GroupId) => {
  const { sessionClaims } = await auth();
  const client = await clerkClient();
  const res = await client.users.updateUserMetadata(sessionClaims?.userId as UserId, {
    publicMetadata: {
      joinedGroups: await clerkGetJoinedGroups(),
      ownedGroups: [...(await clerkGetOwnedGroups()), groupId]
    }
  })
  return res;
}

/**
 * Remove a group from the current user's joined groups
 * @param groupId - the ID of the group to remove
 * @returns the clerk response user object
 * @throws errors if the request headers do not have a valid session or connection to the clerk API fails
 */
export const clerkLeaveGroup = async (groupId: GroupId) => {
  const { sessionClaims } = await auth();
  const client = await clerkClient();
  const res = await client.users.updateUserMetadata(sessionClaims?.userId as UserId, {
    publicMetadata: {
      joinedGroups: (await clerkGetJoinedGroups()).filter((id) => id !== groupId),
      ownedGroups: await clerkGetOwnedGroups()
    }
  })
  return res;
}

/**
 * Remove a group from the current user's owned groups
 * @param groupId - the ID of the group to remove
 * @returns the clerk response user object
 * @throws errors if the request headers do not have a valid session or connection to the clerk API fails
 */
export const clerkRemoveOwnedGroup = async (groupId: GroupId) => {
  const { sessionClaims } = await auth();
  const client = await clerkClient();
  const res = await client.users.updateUserMetadata(sessionClaims?.userId as UserId, {
    publicMetadata: {
      joinedGroups: await clerkGetJoinedGroups(),
      ownedGroups: (await clerkGetOwnedGroups()).filter((id) => id !== groupId)
    }
  })
  return res;
}
