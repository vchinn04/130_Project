// chat.test.tsx

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from '../app/@home/components/chat';
import { useUser, useAuth } from '@clerk/nextjs';
import { signInWithCustomToken } from 'firebase/auth';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import getClerkUserList from '../lib/chat-utils';
import {
  GroupItemMap,
  Member,
  GroupInfoSubtable,
  GroupMembersSubtable,
  TeamSubtable,
  Team,
} from '../lib/db-utils/schemas';
import { GroupId, UserId } from '@/types/globals';

// Mock necessary modules and functions

jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  useAuth: jest.fn(),
}));

jest.mock('../lib/firebase', () => ({
    db: {},
    auth: {},
  }));

jest.mock('firebase/auth', () => ({
  signInWithCustomToken: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  onSnapshot: jest.fn(),
  query: jest.fn(),
  collection: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  serverTimestamp: jest.fn(),
  Timestamp: {
    now: jest.fn(),
  },
}));

jest.mock('../lib/chat-utils', () => jest.fn());

// Mock child components
jest.mock('@/components/ui/chat/chat-message-list', () => ({
  ChatMessageList: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/ui/chat/chat-bubble', () => ({
  ChatBubble: ({ children }: any) => <div>{children}</div>,
  ChatBubbleAction: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  ChatBubbleActionWrapper: ({ children }: any) => <div>{children}</div>,
  ChatBubbleAvatar: ({ fallback }: any) => <div>{fallback}</div>,
  ChatBubbleMessage: ({ children }: any) => <div>{children}</div>,
  ChatBubbleTimestamp: ({ timestamp }: any) => <div>{timestamp}</div>,
}));

jest.mock('@/components/ui/chat/chat-input', () => ({
  ChatInput: ({ ...props }: any) => <input {...props} />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('lucide-react', () => ({
  Send: () => <svg data-icon="send" />,
  Trash2: () => <svg data-icon="trash" />,
  X: () => <svg data-icon="close" />,
}));

jest.mock('@radix-ui/react-tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}));

describe('Chat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when selectedCollective is empty', () => {
    const setSelectedCollective = jest.fn();
    const groups: Record<GroupId, GroupItemMap> = {};

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'user123',
      },
    });

    const { container } = render(
      <Chat
        selectedCollective=""
        setSelectedCollective={setSelectedCollective}
        groups={groups}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders chat when selectedCollective is provided', async () => {
    const setSelectedCollective = jest.fn();

    // Define the members
    const membersSubtable: GroupMembersSubtable = {
      groupId: 'group1',
      subTable: 'members',
      members: {
        user123: {
          ready: true,
          promptAnswer: 'Answer from user123',
        },
        user456: {
          ready: false,
          promptAnswer: 'Answer from user456',
        },
      },
    };

    // Define teams
    const teamsSubtable: TeamSubtable = {
      groupId: 'group1',
      subTable: 'teams',
      generatedAt: new Date(),
      teams: [
        {
          teamUniqueId: 'team1',
          members: ['user123', 'user456'],
        },
      ],
    };

    const groupInfo: GroupInfoSubtable = {
      groupId: 'group1',
      subTable: 'info',
      createdAt: new Date(),
      displayName: 'Test Group',
      owner: 'user123',
      locked: false,
      prompt: 'Test Prompt',
      memberCount: 5,
      teamCount: 2,
    };

    const groups: Record<GroupId, GroupItemMap> = {
      group1: {
        info: groupInfo,
        teams: teamsSubtable,
        members: membersSubtable,
      },
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'user123',
      },
    });

    (useAuth as jest.Mock).mockReturnValue({
      getToken: jest.fn().mockResolvedValue('mockToken'),
      userId: 'user123',
    });

    (signInWithCustomToken as jest.Mock).mockResolvedValue({});

    // Mock onSnapshot to simulate message retrieval
    const mockOnSnapshot = jest.fn((q, callback) => {
      const docData = [
        {
          data: () => ({
            collectionId: 'group1',
            messageContent: 'Hello, World!',
            senderId: 'user123',
            timestamp: {
              toDate: () => new Date(),
              toMillis: () => Date.now(),
            },
          }),
          id: 'message1',
        },
      ];

      const querySnapshot = {
        forEach: (fn: any) => {
          docData.forEach((doc) => fn(doc));
        },
      };

      callback(querySnapshot);

      return jest.fn(); // Unsubscribe function
    });

    (onSnapshot as jest.Mock).mockImplementation(mockOnSnapshot);

    (getClerkUserList as jest.Mock).mockResolvedValue({
      user123: ['Test User', undefined],
    });

    await act(async () => {
      render(
        <Chat
          selectedCollective="group1"
          setSelectedCollective={setSelectedCollective}
          groups={groups}
        />
      );
    });

    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('sends a message when send button is clicked', async () => {
    const setSelectedCollective = jest.fn();

    const membersSubtable: GroupMembersSubtable = {
      groupId: 'group1',
      subTable: 'members',
      members: {
        user123: {
          ready: true,
          promptAnswer: 'Answer from user123',
        },
      },
    };

    const teamsSubtable: TeamSubtable = {
      groupId: 'group1',
      subTable: 'teams',
      generatedAt: new Date(),
      teams: [],
    };

    const groupInfo: GroupInfoSubtable = {
      groupId: 'group1',
      subTable: 'info',
      createdAt: new Date(),
      displayName: 'Test Group',
      owner: 'user123',
      locked: false,
      prompt: 'Test Prompt',
      memberCount: 5,
      teamCount: 2,
    };

    const groups: Record<GroupId, GroupItemMap> = {
      group1: {
        info: groupInfo,
        teams: teamsSubtable,
        members: membersSubtable,
      },
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'user123',
      },
    });

    (useAuth as jest.Mock).mockReturnValue({
      getToken: jest.fn().mockResolvedValue('mockToken'),
      userId: 'user123',
    });

    (signInWithCustomToken as jest.Mock).mockResolvedValue({});

    (onSnapshot as jest.Mock).mockImplementation((q, callback) => {
      const querySnapshot = {
        forEach: (fn: any) => {},
      };

      callback(querySnapshot);

      return jest.fn(); // Unsubscribe function
    });

    (addDoc as jest.Mock).mockResolvedValue({});

    await act(async () => {
      render(
        <Chat
          selectedCollective="group1"
          setSelectedCollective={setSelectedCollective}
          groups={groups}
        />
      );
    });

    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test Message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        collectionId: 'group1',
        messageContent: 'Test Message',
        timestamp: expect.any(Function),
        senderId: 'user123',
      });
    });
  });

  it('deletes a message when delete button is clicked', async () => {
    const setSelectedCollective = jest.fn();

    const membersSubtable: GroupMembersSubtable = {
      groupId: 'group1',
      subTable: 'members',
      members: {
        user123: {
          ready: true,
          promptAnswer: 'Answer from user123',
        },
      },
    };

    const teamsSubtable: TeamSubtable = {
      groupId: 'group1',
      subTable: 'teams',
      generatedAt: new Date(),
      teams: [],
    };

    const groupInfo: GroupInfoSubtable = {
      groupId: 'group1',
      subTable: 'info',
      createdAt: new Date(),
      displayName: 'Test Group',
      owner: 'user123',
      locked: false,
      prompt: 'Test Prompt',
      memberCount: 5,
      teamCount: 2,
    };

    const groups: Record<GroupId, GroupItemMap> = {
      group1: {
        info: groupInfo,
        teams: teamsSubtable,
        members: membersSubtable,
      },
    };

    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'user123',
      },
    });

    (useAuth as jest.Mock).mockReturnValue({
      getToken: jest.fn().mockResolvedValue('mockToken'),
      userId: 'user123',
    });

    (signInWithCustomToken as jest.Mock).mockResolvedValue({});

    const mockOnSnapshot = jest.fn((q, callback) => {
      const docData = [
        {
          data: () => ({
            collectionId: 'group1',
            messageContent: 'Message to delete',
            senderId: 'user123',
            timestamp: {
              toDate: () => new Date(),
              toMillis: () => Date.now(),
            },
          }),
          id: 'message1',
        },
      ];

      const querySnapshot = {
        forEach: (fn: any) => {
          docData.forEach((doc) => fn(doc));
        },
      };

      callback(querySnapshot);

      return jest.fn(); // Unsubscribe function
    });

    (onSnapshot as jest.Mock).mockImplementation(mockOnSnapshot);

    (getClerkUserList as jest.Mock).mockResolvedValue({
      user123: ['Test User', undefined],
    });

    (deleteDoc as jest.Mock).mockResolvedValue({});
    (getDocs as jest.Mock).mockResolvedValue({
      forEach: (fn: any) => {
        fn({ id: 'message1' });
      },
    });

    await act(async () => {
      render(
        <Chat
          selectedCollective="group1"
          setSelectedCollective={setSelectedCollective}
          groups={groups}
        />
      );
    });

    const deleteButton = screen.getByRole('button', { name: /trash/i });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith(expect.anything());
    });
  });
});
