"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

const PromptAnswerButton = ({ selectedCollective }: { selectedCollective: any }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn || !user) return null;

  const [promptAnswer, setPromptAnswer] = useState(() => {
    const storedAnswer = localStorage.getItem(`promptAnswer_${selectedCollective}_${user.id}`);
    return storedAnswer || "";
  });

  const [isChecked, setIsChecked] = useState(() => {
    const storedChecked = localStorage.getItem(`isChecked_${selectedCollective}_${user.id}`);
    return storedChecked === "true";
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Persist `isChecked` to localStorage always
  useEffect(() => {
    localStorage.setItem(`isChecked_${selectedCollective}_${user.id}`, String(isChecked));
  }, [isChecked, selectedCollective, user.id]);

  // Persist `promptAnswer` to localStorage when dialog is closed or checkbox changes to true
  useEffect(() => {
    if (!isDialogOpen || isChecked) {
      localStorage.setItem(`promptAnswer_${selectedCollective}_${user.id}`, promptAnswer);
    }
  }, [isDialogOpen, isChecked, promptAnswer, selectedCollective, user.id]);

  const handleRequest = async () => {
    try {
      if (isChecked) {
        const response = await fetch(`ready-user-prompt-response/${selectedCollective}/${promptAnswer}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch ready-user-prompt-response");
        console.log(`ready with prompt ${promptAnswer}!!!!`);
      } else {
        const response = await fetch(`disable-user-ready/${selectedCollective}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch disable ready");
        console.log("disable!!!!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    handleRequest();
  }, [isChecked, selectedCollective]);

  const { isPending, isError, data } = useQuery({
    queryKey: ["groups", selectedCollective],
    enabled: !!selectedCollective,
    queryFn: async () => {
      const response = await fetch(`get-group/${selectedCollective}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false); // Close dialog on submit
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
          // Persist promptAnswer when dialog is closed
          localStorage.setItem(`promptAnswer_${selectedCollective}_${user.id}`, promptAnswer);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Answer Prompt</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Answer the prompt:</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {(isPending || isError) ? "Answer the prompt to join the group." : (data?.info?.prompt || "No prompt found")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              id="promptAnswer"
              name="promptAnswer"
              placeholder="Prompt Answer"
              className="mt-1 block w-full"
              onChange={(e) => setPromptAnswer(e.target.value)}
              disabled={isChecked}
              value={promptAnswer}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ready"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(!!checked)}
            />
            <label htmlFor="ready" className="text-gray-600">
              Ready to be matched
            </label>
          </div>
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PromptAnswerButton;
