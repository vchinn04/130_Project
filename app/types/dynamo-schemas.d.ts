type UserId = string;
type groupId = string;

export type UserEntry = {
  id: UserId;

  // Key is the group id and value is true if owner, else false
  Groups: { [key: string]: boolean };

  // We can extract what group team belongs to from the team id since
  // it is a composite of group id and team id
  Teams: [string];
  Preferences: [string];
};

export type GroupMember = {
  currentTeamId: number; // 0 if not in a team
  suggestedTeamIds: number[];
  PromptAnswer: string;
  Ready: boolean;
};

export type TeamData = {
  locked: boolean;
  members: UserId[];
};

export type GroupEntry = {
  id: groupId;
  GroupOwner: UserId;
  Prompt: string;
  PreferencesEnabled: boolean;
  teams: Record<number, TeamData>;
  members: Record<UserId, GroupMember>;
};













export type TeamEntry = {
  TeamId: string;
  Locked: boolean;
  Members: [UserId];
};

export type MessageEntry = {
  UUID: string;
  Sender: UserId;
  DateSent: Date;
  MessageContent: string;
};
