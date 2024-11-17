"use client";
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateGroupButton() {
  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    prompt: "",
    ownerAnswer: "",
  });
  const [error, setError] = useState("");
  const [groupId, setGroupId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { groupName, groupDescription, prompt } = formData;

    if (!groupName || !groupDescription || !prompt) {
      setError("All fields except prompt answer are required.");
      return;
    }

    // Add logic to create the group
    const newGroupId = "12345"; // Replace with actual group ID logic
    setGroupId(newGroupId);
    alert(`Group created with ID: ${newGroupId}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>Fill out the form to create a new group.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            name="groupName"
            placeholder="Group Name"
            value={formData.groupName}
            onChange={handleChange}
            required
          />
          <textarea
            name="groupDescription"
            placeholder="Group Description"
            value={formData.groupDescription}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <select
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a prompt</option>
            <option value="prompt1">Prompt 1</option>
            <option value="prompt2">Prompt 2</option>
          </select>
          <Input
            name="ownerAnswer"
            placeholder="Prompt Answer"
            value={formData.ownerAnswer}
            onChange={handleChange}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">Create Group</Button>
        </form>
        {groupId && (
          <div>
            <p>Group created with ID: {groupId}</p>
          </div>
        )}
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}