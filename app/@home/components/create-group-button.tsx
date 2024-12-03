"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { GroupInfoSubtable, GroupMembersSubtable, TeamSubtable } from "@/types";
import { useUser } from "@clerk/nextjs";

export default function CreateGroupButton({
  onCreateGroup,
}: {
  onCreateGroup: any;
}) {
  const defaultPrompts = {
    animal: "What is your fav animal",
    color: "What is your fav color",
  };
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [prompt, setPrompt] = useState(defaultPrompts.animal);
  const [customPrompt, setCustomPrompt] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [error, setError] = useState("");
  const [groupId, setGroupId] = useState("");
  const { isSignedIn, user, isLoaded } = useUser();

  const handlePromptOptionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === "custom") {
      setCustomPrompt(true);
      setPrompt(promptText);
    } else {
      setCustomPrompt(false);
      setPrompt(e.target.innerText);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    setPromptText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName) {
      setError("All fields except prompt answer are required.");
      return;
    }

    try {
      const response = await fetch(`create-group/${groupName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName,
          groupDescription,
          prompt,
        }),
        //parse response
      });
    } catch (error) {
      console.error("Error with response from server:", error);
    }

    // Generate a unique group ID -> placeholder for now
    const newGroupId = `group-${Date.now()}`;
    setGroupId(newGroupId);

    const newGroup = isSignedIn && {
      info: {
        groupId: groupId,
        subTable: "info",
        createdAt: new Date(),
        displayName: groupName,
        owner: user.id,
        locked: false,
        prompt: prompt,
        memberCount: 10,
        teamCount: 2,
      },
      members: {
        groupId: groupId,
        subTable: "members",
        members: {
          [user.id]: {
            ready: false,
            promptAnswer: "Example answer",
          },
        },
      },
      teams: {
        groupId: groupId,
        subTable: "teams",
        generatedAt: new Date(),
        teams: [],
      },
    };

    onCreateGroup(newGroup);

    alert(`Group created with ID: ${newGroupId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Group
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill out the form to create a new group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="groupName"
              className="block text-sm font-medium text-gray-700"
            >
              Group Name
            </label>
            <Input
              id="groupName"
              name="groupName"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          {/* <div>
            <label
              htmlFor="groupDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Group Description
            </label>
            <textarea
              id="groupDescription"
              name="groupDescription"
              placeholder="Group Description"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              required
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div> */}
          <div>
            <label
              htmlFor="promptOption"
              className="block text-sm font-medium text-gray-700"
            >
              Enter a prompt or select a preset:
            </label>
            <select
              id="promptOption"
              name="promptOption"
              onChange={handlePromptOptionChange}
              required
              className="mt-1 block w-full p-2 border rounded-md"
            >
              {Object.entries(defaultPrompts).map(([key, value]) => (
                <option key={key}>{value}</option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </div>
          <div>
            {customPrompt && (
              <>
                <label
                  htmlFor="promptValue"
                  className="block text-sm font-medium text-gray-700"
                >
                  Group Prompt
                </label>
                <Input
                  id="promptValue"
                  name="promptValue"
                  placeholder="Your Custom Prompt"
                  value={prompt}
                  onChange={handlePromptChange}
                />
              </>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Create Group
          </Button>
        </form>
        {groupId && (
          <div className="mt-4">
            <p>Group created with ID: {groupId}</p>
          </div>
        )}
        <DialogClose asChild>
          <Button className="mt-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
