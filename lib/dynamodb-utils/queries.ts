import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Resource } from "sst";
import {
  GroupId,
  UserId,
  GroupInfoSubtable,
  GroupMembersSubtable,
  TeamSubtable,
  Member
} from "./dynamo-schemas";

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = Resource.GroupsTable.name; // Bind the table name to the resource defined in sst.config.ts

// Group Info CRUD
export async function createGroupInfo(
  owner: UserId,
  data: Pick<GroupInfoSubtable, "displayName" | "prompt">
): Promise<GroupInfoSubtable> {
  const groupId = uuidv4();
  const item: GroupInfoSubtable = {
    groupId,
    subTable: "info",
    displayName: data.displayName,
    owner,
    locked: false,
    prompt: data.prompt,
    memberCount: 0,
    teamCount: 0,
    createdAt: new Date(),
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

export async function getGroupInfo(groupId: GroupId): Promise<GroupInfoSubtable | null> {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "info",
    },
  }).promise();

  return (result.Item as GroupInfoSubtable) || null;
}

export async function updateGroupInfo(
  groupId: GroupId,
  updates: Partial<Omit<GroupInfoSubtable, "groupId" | "subTable" | "createdAt">>
) {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  Object.entries(updates).forEach(([key, value], index) => {
    updateExpressions.push(`#field${index} = :value${index}`);
    expressionAttributeNames[`#field${index}`] = key;
    expressionAttributeValues[`:value${index}`] = value;
  });

  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "info",
    },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  }).promise();
}

// Group Members CRUD
export async function getGroupMembers(groupId: GroupId): Promise<GroupMembersSubtable | null> {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "members",
    },
  }).promise();

  return (result.Item as GroupMembersSubtable) || null;
}

export async function initializeGroupMembers(groupId: GroupId): Promise<GroupMembersSubtable> {
  const item: GroupMembersSubtable = {
    groupId,
    subTable: "members",
    members: {},
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

export async function addOrUpdateGroupMember(
  groupId: GroupId,
  userId: UserId,
  memberData: Member
) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId,
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

export async function removeGroupMember(groupId: GroupId, userId: UserId) {
  await dynamoDB.update({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "members",
    },
    UpdateExpression: "REMOVE #members.#userId",
    ExpressionAttributeNames: {
      "#members": "members",
      "#userId": userId,
    },
  }).promise();
}

// Teams CRUD
export async function getTeams(groupId: GroupId): Promise<TeamSubtable | null> {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "teams",
    },
  }).promise();

  return (result.Item as TeamSubtable) || null;
}

export async function updateTeams(groupId: GroupId, teams: TeamSubtable["teams"]) {
  const item: TeamSubtable = {
    groupId,
    subTable: "teams",
    generatedAt: new Date(),
    teams,
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

// Delete operations (don't expose these, they're just here for completeness and testing)
export async function deleteGroupInfo(groupId: GroupId) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "info",
    },
  }).promise();
}

export async function deleteGroupMembers(groupId: GroupId) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "members",
    },
  }).promise();
}

export async function deleteTeams(groupId: GroupId) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "teams",
    },
  }).promise();
}
