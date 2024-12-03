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

import { useUser, UserButton } from "@clerk/nextjs";

export default function LeaveGroup({
  selectedCollective,
}: {
  selectedCollective: any;
}) {
  let id_split = selectedCollective.split("_");
  const { isSignedIn, user, isLoaded } = useUser();
	if (!isLoaded) return null;
  if (!isSignedIn || !user) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      const response = await fetch(`leave-group/${selectedCollective}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create group");
      }
      // //await user.reload();
    } catch (error) {
      console.error("Error with response from server:", error);
    }
  };

  return (
    id_split[0] != "" && (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="animate-appear">Leave Group</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Leave Group?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Are you sure you want to leave the group?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* <Button type="submit" className="w-full">
              Leave Group
            </Button> */}
            <DialogClose asChild>
              <Button type="submit" className="mt-4 w-full">
                Leave Group
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    )
  );
}
