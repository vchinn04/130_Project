import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import JoinGroupButton from "../app/@home/components/join-group";
import { useUser } from "@clerk/nextjs";

// Mock the useUser hook from @clerk/nextjs
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
}));

describe("JoinGroupButton", () => {
  const mockReload = jest.fn();

  beforeEach(() => {
    // Default mock implementation for a signed-in user
    (useUser as jest.Mock).mockReturnValue({
      isSignedIn: true,
      user: {
        id: "user123",
        name: "Test User",
        reload: mockReload,
      },
      isLoaded: true,
    });

    // Mock global.fetch
    global.fetch = jest.fn();

    // Mock window.alert to prevent actual alerts during tests
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the Join Group button when user is signed in", () => {
    render(<JoinGroupButton onCreateGroup={() => {}} />);
    expect(screen.getByText("Join Group")).toBeInTheDocument();
  });

  it("does not render the Join Group button when user is not signed in", () => {
    (useUser as jest.Mock).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    });
    const { container } = render(<JoinGroupButton onCreateGroup={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the dialog when Join Group button is clicked", () => {
    render(<JoinGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Join Group"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Enter the group ID to join an existing group.")).toBeInTheDocument();
  });

  it("submits the form with valid Group ID and reloads user", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
    });
    global.fetch = mockFetch;

    render(<JoinGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Join Group"));

    // Enter a valid Group ID
    fireEvent.change(screen.getByPlaceholderText("Group ID"), {
      target: { value: "group123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Join Group" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("join-group/group123", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(mockReload).toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("does not submit the form when Group ID is empty", async () => {
    render(<JoinGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Join Group"));

    // Leave Group ID empty
    fireEvent.change(screen.getByPlaceholderText("Group ID"), {
      target: { value: "" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Join Group" }));

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("does not submit the form when Group ID is only whitespace", async () => {
    render(<JoinGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Join Group"));

    // Enter only whitespace in Group ID
    fireEvent.change(screen.getByPlaceholderText("Group ID"), {
      target: { value: "   " },
    });

    fireEvent.click(screen.getByRole("button", { name: "Join Group" }));

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("handles API failure gracefully", async () => {
    console.error = jest.fn(); // Suppress console.error output

    const mockFetch = jest.fn().mockRejectedValue(new Error("API Error"));
    global.fetch = mockFetch;

    render(<JoinGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Join Group"));

    // Enter a valid Group ID
    fireEvent.change(screen.getByPlaceholderText("Group ID"), {
      target: { value: "group123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Join Group" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("join-group/group123", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error submitting form:",
        expect.any(Error)
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});