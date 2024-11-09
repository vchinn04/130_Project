export type UserId = string;
export type GroupId = string;
export type TeamId = string;
export type MessageId = string;

export type UserEntry = {
  id: UserId;
  username: string;
  email: string;

  // Key is the group id and value is true if owner, else false
  groups: Record<GroupId, boolean>;

  // We can extract what group team belongs to from the team id since
  // it is a composite of group id and team id
  teams: TeamId[];
  preferences: string[];
};

export type MemberGroupEntry = {
  promptAnswer: string;
  ready: boolean;
};

export type TeamGroupEntry = {
  locked: boolean;
  members: UserId[];
};

export type GroupEntry = {
  groupId: GroupId;
  groupOwner: UserId;
  prompt: string;
  preferencesEnabled: boolean;
  teams: Record<TeamId, TeamGroupEntry>;
  members: Record<UserId, MemberGroupEntry>;
};

export type MessageEntry = {
  id: MessageId;
  sender: UserId;
  dateSent: Date;
  messageContent: string;
};
