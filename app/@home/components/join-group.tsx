"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

const JoinGroupButton = ({ onCreateGroup }: { onCreateGroup: any }) => {
  const [ID, setID] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn || !user) return null;

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setID(event.target.value);
  };

  const handleSubmit = async () => {
    if (ID && ID.trim() !== "") {
      try {
        const response = await fetch(`join-group/${ID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          await user.reload();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    // Reset ID and close dialog
    setID("");
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Join Group</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Join Group</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Enter the group ID to join an existing group.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="groupId"
              className="block text-sm font-medium text-gray-700"
            >
              Group ID
            </label>
            <Input
              id="groupId"
              name="groupId"
              placeholder="Group ID"
              required
              onChange={handleIdChange}
              value={ID}
              className="mt-1 block w-full"
            />
          </div>
          <Button type="button" className="w-full" onClick={handleSubmit}>
            Join Group
          </Button>
        </div>
        <DialogClose asChild>
          <Button className="mt-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupButton;
