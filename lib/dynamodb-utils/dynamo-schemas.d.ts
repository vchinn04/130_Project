export type UserId = string; // from cognito
export type GroupId = string; // UUID v4, generated at creation time
export type TeamId = number;

export type FullGroupTable = GroupInfoSubtable &
  GroupMembersSubtable &
  TeamSubtable;

export type Team = {
  members: UserId[]; // simple list of the members in the team
};

export type TeamSubtable = {
  groupId: GroupId; // dynamodb hash key (primary index)
  subTable: "teams" | ""; // dynamodb sort key (secondary index)
  generatedAt: Date; // the date and time the teams were last generated
  teams: Team[]; // list of the teams in the group (team numbers derived from index in array)
};

export type GroupInfoSubtable = {
  groupId: GroupId; // dynamodb hash key (primary index)
  subTable: "info" | ""; // dynamodb sort key (secondary index)
  displayName: string; // optionally-settable name of the group
  owner: UserId; // the user id of the group owner, who can make changes and manage the group
  locked: boolean; // whether new people can join a group.
  prompt: string; // the prompt that the group owner sets for new members to join the group
  memberCount: number; // the number of members in the group
  teamCount: number; // the number of teams in the group
  createdAt: Date; // the date and time the group was created
};

export type Member = {
  ready: boolean; // indicates if the user is ready to be matched to a team
  promptAnswer: string; // link to an s3 object where the user's prompt answer is stored
};

export type GroupMembersSubtable = {
  groupId: GroupId; // dynamodb hash key (primary index)
  subTable: "members" | ""; // dynamodb sort key (secondary index)
  members: Record<UserId, Member>; // json object of the members in the group
};
