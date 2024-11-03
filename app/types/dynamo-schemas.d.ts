type UserId = string;

export type UserEntry = {
  UUID: UserId;
  Username: string;
  Email: string;

  // Key is the group id and value is true if owner, else false
  Groups: { [key: string]: boolean };

  // We can extract what group team belongs to from the team id since
  // it is a composite of group id and team id
  Teams: [string];
  Preferences: [string];
};

export type MemberGroupEntry = {
  PromptAnswer: string;
  Ready: boolean;
};

export type GroupEntry = {
  GroupId: string;
  GroupOwner: UserId;
  Prompt: string;
  PreferencesEnabled: boolean;
  Teams: [string];
  Members: { [key: UserId]: MemberGroupEntry };
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
