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

export default function LeaveGroup({
  selectedCollective,
}: {
  selectedCollective: any;
}) {
  let id_split = selectedCollective.split("_");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert(`Left Group ${id_split[0]}`);
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
