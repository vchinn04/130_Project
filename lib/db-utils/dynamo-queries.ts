import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Resource } from "sst";
import {
  GroupId,
  UserId,
  GroupInfoSubtable,
  GroupMembersSubtable,
  TeamSubtable,
  Member,
  ImmutableGroupInfoProperties,
  ImmutableTeamSubtableProperties,
  Team,
} from "./schemas";

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = Resource.GroupsTable.name; // Bind the table name to the resource defined in sst.config.ts

/**
  Creates a new group info entry and adds it to the database.
  @param owner - The user ID of the group owner.
  @param data - The data for the group info entry.
  @returns the Group info entry object that was added to the database.
  @throws any errors that occur during the database operation.
*/
export async function createGroupInfo(
  owner: UserId,
  displayName?: string
): Promise<GroupInfoSubtable> {
  const item: GroupInfoSubtable = {
    groupId: uuidv4(),
    subTable: "info",
    displayName: displayName ?? "",
    owner: owner,
    locked: false,
    prompt: "",
    memberCount: 1,
    teamCount: 0,
    createdAt: new Date(),
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

/**
  Retrieves a GroupInfoSubtable entry from the database.
  @param groupId - The ID of the group to retrieve.
  @returns the GroupInfoSubtable entry that was retrieved from the database, or null if it does not exist.
  @throws any errors that occur during the database operation.
*/
export async function getGroupInfo(groupId: GroupId): Promise<GroupInfoSubtable | null> {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "info",
    },
  }).promise();

  return (result.Item as GroupInfoSubtable) || null;
}

/**
  Updates a GroupInfoSubtable entry in the database with the provided field update values.
  @param groupId - The ID of the group to update.
  @param fieldUpdates - the values of a GroupInfoSubtable object that are to be updated. Only these fields are updated. Immutable properties are not allowed to be updated and are not valid args.
  @throws any errors that occur during the database operation.
*/
export async function updateGroupInfo(
  groupId: GroupId,
  fieldUpdates: Partial<Omit<GroupInfoSubtable, keyof ImmutableGroupInfoProperties>>
) {
  // initialize containers for the update expression, attribute names, and attribute values
  const updateExpressions: string[] = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  // build the dynamodb update expression from the argument
  Object.entries(fieldUpdates).forEach(([key, value], index) => {
    updateExpressions.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = value;
  });

  // execute the update operation
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "info",
    },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  }).promise();
}

/**
  Retrieves the set of members in a given group from the database.
  @param groupId - The ID of the group to retrieve the members from.
  @returns the GroupMembersSubtable entry that was retrieved from the database, or null if it does not exist.
  @throws any errors that occur during the database operation.
*/
export async function getGroupMembers(groupId: GroupId): Promise<GroupMembersSubtable | null> {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "members",
    },
  }).promise();

  return (result.Item as GroupMembersSubtable) || null;
}

/**
  Initializes a new GroupMembersSubtable entry for a given group in the database.
  @param groupId - The ID of the group to initialize the members for.
  @returns the GroupMembersSubtable entry that was initialized in the database.
  @throws any errors that occur during the database operation.
*/
export async function initializeGroupMembers(groupId: GroupId): Promise<GroupMembersSubtable> {
  const item: GroupMembersSubtable = {
    groupId: groupId,
    subTable: "members",
    members: {},
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

/**
  Adds a new member to the set of members in a given group in the database.
  @param groupId - The ID of the group to add the member to.
  @param userId - The ID of the user to add to the group.
  @param memberData - The data of the member being added to the group.
  @throws any errors that occur during the database operation.
*/
export async function addOrUpdateGroupMember(
  groupId: GroupId,
  userId: UserId,
  memberData: Member
) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "members",
    },
    UpdateExpression: "SET #members.#userId = :memberData",
    ExpressionAttributeNames: {
      "#members": "members",
      "#userId": userId,
    },
    ExpressionAttributeValues: {
      ":memberData": memberData,
    },
  }).promise();
}

/**
  Removes a member from the set of members in a given group in the database.
  @param groupId - The ID of the group to remove the member from.
  @param userId - The ID of the user to remove from the group.
  @throws any errors that occur during the database operation.
*/
export async function removeGroupMember(groupId: GroupId, userId: UserId) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "members",
    },
    UpdateExpression: "REMOVE #members.#userId",
    ExpressionAttributeNames: {
      "#members": "members",
      "#userId": userId,
    },
  }).promise();
}

/**
 * Retrieves the set of teams in a given group from the database.
 * @param groupId - The ID of the group to retrieve the teams from.
 * @returns the TeamSubtable entry that was retrieved from the database, or null if it does not exist.
 * @throws any errors that occur during the database operation.
*/
export async function getTeams(groupId: GroupId): Promise<TeamSubtable | null> {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "teams",
    },
  }).promise();

  return (result.Item as TeamSubtable) || null;
}

/**
 * Updates a TeamSubtable entry in the database with the provided field update values. Generally for adding or removing lots of teams at once.
 * Use the other functions for more specific updates.
 * @param groupId - The ID of the group to update the teams for.
 * @param updates - The set of updates to apply to the team.
 * @returns the TeamSubtable entry that was updated in the database.
 * @throws any errors that occur during the database operation.
*/
export async function updateTeamsTable(
  groupId: GroupId,
  updates: {
    teamId: string;
    fieldUpdates: Partial<Omit<TeamSubtable, keyof ImmutableTeamSubtableProperties>> | Partial<Team>
  }
) {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  Object.entries(updates.fieldUpdates).forEach(([key, value], index) => {
    const fieldPath = updates.teamId
      ? `teams.${updates.teamId}.${key}`  // Update specific team field
      : key;                              // Update top-level field

    updateExpressions.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = fieldPath;
    expressionAttributeValues[`:value${index}`] = value;
  });

  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "teams",
    },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  }).promise();
}

/**
 * Updates the prompt answer for a specific member in the members array
 * @param groupId - The ID of the group to update the members for.
 * @param userId - The ID of the user to update the prompt answer for.
 * @param s3Url - The S3 URL where the prompt answer is stored.
 * @throws any errors that occur during the database operation.
 */
export async function updateMemberPromptAnswer(
  groupId: GroupId,
  userId: UserId,
  s3Url: string
) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "members",
    },
    UpdateExpression: "SET #members.#userId.#promptAnswer = :url",
    ExpressionAttributeNames: {
      "#members": "members",
      "#userId": userId,
      "#promptAnswer": "promptAnswer"
    },
    ExpressionAttributeValues: {
      ":url": s3Url
    },
  }).promise();
}

/**
 * Updates the members of a specific team in the teams array
 * @param groupId - The ID of the group to update the teams for.
 * @param teamIndex - The index of the team to update the members for (team id).
 * @param members - The list of members (UserId) to update the team with.
 * @throws any errors that occur during the database operation.
 */
export async function updateTeamMembers(
  groupId: GroupId,
  teamIndex: number,
  members: UserId[]
) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "teams",
    },
    UpdateExpression: "SET #teams[#index].#members = :members",
    ExpressionAttributeNames: {
      "#teams": "teams",
      "#index": teamIndex.toString(),
      "#members": "members"
    },
    ExpressionAttributeValues: {
      ":members": members
    },
  }).promise();
}

/**
 * Adds a new team to the teams list by appending it to the end of the list
 * @param groupId - The ID of the group to add the team to.
 * @param team - The team to add to the group.
 * @throws any errors that occur during the database operation.
 */
export async function addTeam(
  groupId: GroupId,
  team: Team
) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "teams",
    },
    UpdateExpression: "SET #teams = list_append(if_not_exists(#teams, :empty_list), :newTeam)",
    ExpressionAttributeNames: {
      "#teams": "teams"
    },
    ExpressionAttributeValues: {
      ":newTeam": [team],
      ":empty_list": []
    },
  }).promise();
}

/**
 * Removes a specific team from the teams array at the given index
 * @param groupId - The ID of the group to remove the team from.
 * @param teamIndex - The index of the team to remove from the group (team id).
 * @throws any errors that occur during the database operation.
 */
export async function removeTeam(
  groupId: GroupId,
  teamIndex: number
) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "teams",
    },
    UpdateExpression: "REMOVE #teams[#index]",
    ExpressionAttributeNames: {
      "#teams": "teams",
      "#index": teamIndex.toString()
    },
  }).promise();
}

/**
 * Deletes a GroupInfoSubtable entry from the database.
 * @param groupId - The ID of the group to delete the info for.
 * @throws any errors that occur during the database operation.
*/
export async function deleteGroupInfo(groupId: GroupId) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "info",
    },
  }).promise();
}

/**
 * Deletes a GroupMembersSubtable entry from the database.
 * @param groupId - The ID of the group to delete the members for.
 * @throws any errors that occur during the database operation.
*/
export async function deleteGroupMembers(groupId: GroupId) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "members",
    },
  }).promise();
}

/**
 * Deletes a TeamSubtable entry from the database.
 * @param groupId - The ID of the group to delete the teams for.
 * @throws any errors that occur during the database operation.
*/
export async function deleteTeams(groupId: GroupId) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId: groupId,
      subTable: "teams",
    },
  }).promise();
}