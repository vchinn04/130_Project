import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDB = new DynamoDB.DocumentClient();
const TABLE_NAME = "GroupsTable";

// Types for the different subtables
interface GroupInfo {
  groupId: string;
  subTable: "info";
  name: string;
  description?: string;
  createdAt: string;
  // Add other group info fields as needed
}

interface GroupMember {
  groupId: string;
  subTable: "members";
  userId: string;
  role: "admin" | "member";
  joinedAt: string;
}

interface GroupTeam {
  groupId: string;
  subTable: "teams";
  teamId: string;
  name: string;
  description?: string;
  createdAt: string;
}

// Group Info CRUD
export async function createGroupInfo(groupData: Omit<GroupInfo, "groupId" | "subTable" | "createdAt">) {
  const groupId = uuidv4();
  const item: GroupInfo = {
    groupId,
    subTable: "info",
    createdAt: new Date().toISOString(),
    ...groupData,
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

export async function getGroupInfo(groupId: string) {
  const result = await dynamoDB.get({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "info",
    },
  }).promise();

  return result.Item as GroupInfo;
}

export async function updateGroupInfo(groupId: string, updates: Partial<Omit<GroupInfo, "groupId" | "subTable">>) {
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
export async function addGroupMember(groupId: string, memberData: Omit<GroupMember, "groupId" | "subTable" | "joinedAt">) {
  const item: GroupMember = {
    groupId,
    subTable: "members",
    joinedAt: new Date().toISOString(),
    ...memberData,
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

export async function getGroupMembers(groupId: string) {
  const result = await dynamoDB.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: "groupId = :groupId AND subTable = :subTable",
    ExpressionAttributeValues: {
      ":groupId": groupId,
      ":subTable": "members",
    },
  }).promise();

  return result.Items as GroupMember[];
}

// Group Teams CRUD
export async function createTeam(groupId: string, teamData: Omit<GroupTeam, "groupId" | "subTable" | "teamId" | "createdAt">) {
  const item: GroupTeam = {
    groupId,
    subTable: "teams",
    teamId: uuidv4(),
    createdAt: new Date().toISOString(),
    ...teamData,
  };

  await dynamoDB.put({
    TableName: TABLE_NAME,
    Item: item,
  }).promise();

  return item;
}

export async function getGroupTeams(groupId: string) {
  const result = await dynamoDB.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: "groupId = :groupId AND subTable = :subTable",
    ExpressionAttributeValues: {
      ":groupId": groupId,
      ":subTable": "teams",
    },
  }).promise();

  return result.Items as GroupTeam[];
}

// Delete operations
export async function deleteGroupInfo(groupId: string) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "info",
    },
  }).promise();
}

export async function deleteGroupMember(groupId: string, userId: string) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "members",
    },
    ConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  }).promise();
}

export async function deleteTeam(groupId: string, teamId: string) {
  await dynamoDB.delete({
    TableName: TABLE_NAME,
    Key: {
      groupId,
      subTable: "teams",
    },
    ConditionExpression: "teamId = :teamId",
    ExpressionAttributeValues: {
      ":teamId": teamId,
    },
  }).promise();
}
