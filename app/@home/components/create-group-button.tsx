"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [prompt, setPrompt] = useState(defaultPrompts.animal);
  const [customPrompt, setCustomPrompt] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  const handlePromptOptionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (e.target.value === "custom") {
      setCustomPrompt(true);
      setPrompt(promptText);
    } else {
      setCustomPrompt(false);
      setPrompt(e.target.value);
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
      });
      if (!response.ok) {
        //throw new Error("Failed to create group");
      }
    } catch (error) {
      console.error("Error with response from server:", error);
    }

    // Generate a unique group ID -> placeholder for now
    const newGroupId = `group-${Date.now()}`;
    alert(`Group created with ID: ${newGroupId}`);

    // Reset form fields
    setGroupName("");
    setPrompt(defaultPrompts.animal);
    setCustomPrompt(false);
    setPromptText("");

    // Close the dialog
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create Group</DialogTitle>
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
              value={customPrompt ? "custom" : prompt}
            >
              {Object.entries(defaultPrompts).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
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
                  value={promptText}
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
      </DialogContent>
    </Dialog>
  );
}
