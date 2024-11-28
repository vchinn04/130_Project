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

export default function CreateGroupButton({
  onCreateGroup,
}: {
  onCreateGroup: any;
}) {
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    prompt: "",
    ownerAnswer: "",
  });
  const [error, setError] = useState("");
  const [groupId, setGroupId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { groupName, groupDescription, prompt } = formData;

    if (!groupName || !groupDescription || !prompt) {
      setError("All fields except prompt answer are required.");
      return;
    }

    // Generate a unique group ID -> placeholder for now
    const newGroupId = `group-${Date.now()}`;
    setGroupId(newGroupId);

    const newGroup = {
      groupId: newGroupId,
      groupName: formData.groupName,
      groupDescription: formData.groupDescription,
      prompt: formData.prompt,
      ownerAnswer: formData.ownerAnswer,
      teams: {},
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
              value={formData.groupName}
              onChange={handleChange}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
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
              value={formData.groupDescription}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700"
            >
              Prompt
            </label>
            <select
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Select a prompt</option>
              <option value="prompt1">Prompt 1</option>
              <option value="prompt2">Prompt 2</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="ownerAnswer"
              className="block text-sm font-medium text-gray-700"
            >
              Prompt Answer
            </label>
            <Input
              id="ownerAnswer"
              name="ownerAnswer"
              placeholder="Prompt Answer"
              value={formData.ownerAnswer}
              onChange={handleChange}
              className="mt-1 block w-full"
            />
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
