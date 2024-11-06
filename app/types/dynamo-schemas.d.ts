type UserId = string;

export type UserEntry = {
  Id: UserId;
  Username: string;
  Email: string;

  // Key is the group id and value is true if owner, else false
  Groups: { [key: string]: boolean };

  // We can extract what group team belongs to from the team id since
  // it is a composite of group id and team id
  Teams: string[];
  Preferences: string[];
};

export type MemberGroupEntry = {
  PromptAnswer: string;
  Ready: boolean;
};

export type TeamGroupEntry = {
  Locked: boolean;
  Members: UserId[];
};

export type GroupEntry = {
  GroupId: string;
  JoinId: string;
  GroupOwner: UserId;
  Prompt: string;
  PreferencesEnabled: boolean;
  Teams: { [key: string]: TeamGroupEntry };
  Members: { [key: UserId]: MemberGroupEntry };
};

export type MessageEntry = {
  Id: string;
  Sender: UserId;
  DateSent: Date;
  MessageContent: string;
};
