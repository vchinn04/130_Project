type UserId = string;

export type UserEntry = {
  id: UserId;
  username: string;
  email: string;

  // Key is the group id and value is true if owner, else false
  groups: { [key: string]: boolean };

  // We can extract what group team belongs to from the team id since
  // it is a composite of group id and team id
  teams: string[];
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
  groupId: string;
  joinId: string;
  groupOwner: UserId;
  prompt: string;
  preferencesEnabled: boolean;
  teams: { [key: string]: TeamGroupEntry };
  members: { [key: UserId]: MemberGroupEntry };
};

export type MessageEntry = {
  id: string;
  sender: UserId;
  dateSent: Date;
  messageContent: string;
};
