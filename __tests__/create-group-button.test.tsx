import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateGroupButton from "../app/@home/components/create-group-button";

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isSignedIn: true,
    user: { id: "user123", name: "Test User" },
    isLoaded: true,
  }),
}));

global.fetch = jest.fn();

window.alert = jest.fn();

describe("CreateGroupButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Create Group button", () => {
    render(<CreateGroupButton onCreateGroup={() => {}} />);
    expect(screen.getByText("Create Group")).toBeInTheDocument();
  });

  it("opens the dialog when the Create Group button is clicked", () => {
    render(<CreateGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Create Group"));
    expect(
      screen.getByText("Fill out the form to create a new group.")
    ).toBeInTheDocument();
  });

  it("shows the form fields in the dialog", () => {
    render(<CreateGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Create Group"));
    expect(screen.getByLabelText("Group Name")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Enter a prompt or select a preset:")
    ).toBeInTheDocument();
  });

  it("submits the form successfully with default prompt", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<CreateGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Create Group"));

    fireEvent.change(screen.getByLabelText("Group Name"), {
      target: { value: "Test Group" },
    });

    const dialogContent = screen.getByRole("dialog");
    const submitButton = within(dialogContent).getByRole("button", {
      name: "Create Group",
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("create-group/Test Group", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Group created with ID:")
    );
  });

  it("handles custom prompt selection", () => {
    render(<CreateGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Create Group"));

    fireEvent.change(
      screen.getByLabelText("Enter a prompt or select a preset:"),
      {
        target: { value: "custom" },
      }
    );

    expect(
      screen.getByPlaceholderText("Your Custom Prompt")
    ).toBeInTheDocument();
  });

  it("submits the form successfully with a custom prompt", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<CreateGroupButton onCreateGroup={() => {}} />);
    fireEvent.click(screen.getByText("Create Group"));

    fireEvent.change(screen.getByLabelText("Group Name"), {
      target: { value: "Custom Prompt Group" },
    });

    fireEvent.change(
      screen.getByLabelText("Enter a prompt or select a preset:"),
      {
        target: { value: "custom" },
      }
    );

    fireEvent.change(screen.getByPlaceholderText("Your Custom Prompt"), {
      target: { value: "Custom prompt text" },
    });

    const dialogContent = screen.getByRole("dialog");
    const submitButton = within(dialogContent).getByRole("button", {
      name: "Create Group",
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "create-group/Custom Prompt Group",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    });

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Group created with ID:")
    );
  });
});
