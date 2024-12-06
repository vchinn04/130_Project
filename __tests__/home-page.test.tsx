import React from 'react';
import {
  render,
  screen,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import CollectiveSidebar from '../app/@home/components/home-page';
import { useUser } from '@clerk/nextjs';
import { useQueries } from '@tanstack/react-query';

jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  UserButton: () => <div>UserButton Component</div>,
}));

jest.mock('@tanstack/react-query', () => ({
  useQueries: jest.fn(),
}));

// Mock child components
jest.mock('../app/@home/components/group-button', () => () => <div>GroupButton Component</div>);
jest.mock('../app/@home/components/team-button', () => () => <div>TeamButton Component</div>);
jest.mock('../app/@home/components/members-sidebar', () => () => <div>MembersSidebar Component</div>);
jest.mock('../app/@home/components/Main', () => () => <div>Main Component</div>);
jest.mock('../app/@home/components/chat', () => () => <div>Chat Component</div>);

jest.mock('../app/@home/components/view-button', () => ({
  __esModule: true,
  default: () => <div>ViewButton Component</div>,
  View: {
    Groups: 'Groups',
    Teams: 'Teams',
  },
}));

describe('CollectiveSidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders null when user is not loaded', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: false,
    });

    const { container } = render(<CollectiveSidebar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when user is not signed in', () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });

    const { container } = render(<CollectiveSidebar />);
    expect(container.firstChild).toBeNull();
  });
});
