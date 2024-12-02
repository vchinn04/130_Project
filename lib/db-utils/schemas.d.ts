import { UserId, GroupId } from "@types/globals";

export type TeamId = number;
export type TeamUniqueId = string;

export type GroupItemMap = {
  info: GroupInfoSubtable;
  members: GroupMembersSubtable;
  teams: TeamSubtable;
};

export type GroupTable = GroupInfoSubtable | GroupMemberSubtable | TeamSubtable;

// ------------------------------------------------------------------------------------------------

export type Team = {
  teamUniqueId: TeamUniqueId; // unique identifier for the team
  members: UserId[]; // simple list of the members in the team
};

export interface TeamSubtable {
  groupId: GroupId; // dynamodb hash key (primary index)
  subTable: "teams"; // dynamodb sort key (secondary index)
  generatedAt: Date; // the date and time the teams were last generated
  teams: Team[]; // list of the teams in the group (team numbers derived from index in array)
}

// properties that are immutable for TeamSubtable entries after they are created
export type ImmutableTeamSubtableProperties = Omit<
  TeamSubtable,
  typeof TeamSubtable.prototype.groupId | typeof TeamSubtable.prototype.subTable
>;

// ------------------------------------------------------------------------------------------------

export interface GroupInfoSubtable {
  groupId: GroupId; // dynamodb hash key (primary index)
  subTable: "info"; // dynamodb sort key (secondary index)
  createdAt: Date; // the date and time the group was created
  displayName: string; // optionally-settable name of the group
  owner: UserId; // the user id of the group owner, who can make changes and manage the group
  locked: boolean; // whether new people can join a group.
  prompt: string; // the prompt that the group owner sets for new members to join the group
  memberCount: number; // the target number of members per-team in the group
  teamCount: number; // the target number of teams to generate in the group
}

// properties that are immutable for GroupInfoSubtable entries after they are created
export type ImmutableGroupInfoProperties = Omit<
  GroupInfoSubtable,
  | typeof GroupInfoSubtable.prototype.groupId
  | typeof GroupInfoSubtable.prototype.subTable
  | typeof GroupInfoSubtable.prototype.createdAt
>;

// ------------------------------------------------------------------------------------------------

export type Member = {
  ready: boolean; // indicates if the user is ready to be matched to a team
  promptAnswer: string; // link to an s3 object where the user's prompt answer is stored
};

export interface GroupMembersSubtable {
  groupId: GroupId; // dynamodb hash key (primary index)
  subTable: "members"; // dynamodb sort key (secondary index)
  members: Record<UserId, Member>; // json object of the members in the group
}

// properties that are immutable for GroupMembersSubtable entries after they are created
export type ImmutableGroupMembersProperties = Omit<
  GroupMembersSubtable,
  | typeof GroupMembersSubtable.prototype.groupId
  | typeof GroupMembersSubtable.prototype.subTable
>;
