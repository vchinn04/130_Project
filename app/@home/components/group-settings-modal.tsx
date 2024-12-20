"use client";

// import React from "react";
import {
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "react-day-picker";
import { Switch } from "@/components/ui/switch";
import { GroupId } from "@/types/globals";
import { useQuery } from "@tanstack/react-query";
import { GroupItemMap } from "@/lib/db-utils/schemas";
import { UserProfile } from "@/app/@home/use-user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React, { useEffect, useState } from "react";
import {Input} from "@/components/ui/input";

export function GroupSettingsModal({ groupId, }: { groupId: GroupId; }) {
  const [open, setOpen] = React.useState(false); // default state of the dialog is closed (false)
  const [unsavedChanges, setUnsavedChanges] = React.useState(false); // replace with a state hooked-up to the query logic
  const [prompt, setPrompt] = React.useState(""); // replace with a state hooked-up to the query logic
  const [isOwner, setIsOwner] = React.useState(false);
  const [allowJoinById, setAllowJoinById] = React.useState(false);
  const [teamAmount, setTeamAmount] = React.useState(0);

  const res = UserProfile() as { ownedGroups: string[]; joinedGroups: string[]};
  // console.log(res.ownedGroups);
  //still a place holder
  // const groupId: string = "958a7ce4-ef60-47e8-afcf-6bf9d112facb"; // replace with the react query "use query when you hook-up the backend"

  React.useEffect(() => {
    const isUserOwner = res?.ownedGroups?.includes(groupId);
    setIsOwner(isUserOwner);
  }, [res, groupId]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["groupId", groupId], // Unique query key
    queryFn: async () => {
      const response = await fetch('/get-group-info/' + groupId);
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
    enabled: !!groupId, // Only run query if groupId is truthy
  });
  // console.log(data);

  React.useEffect(() => {
    if (data) {
      setPrompt(data.prompt);
      setAllowJoinById(data.allowJoinById);
      setTeamAmount(data.teamCount);
    }
  }, [data]);

  if (isLoading) return <SidebarMenuAction><div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500"></div></div></SidebarMenuAction>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
    setUnsavedChanges(true); // trigger unsaved changes flag when the prompt text changes
  };

  const handleSave = () => {
    // Implement save logic here
    const updatedFields = {
      prompt: prompt,
      locked: allowJoinById,
      teamCount: teamAmount,
    };

    fetch(`update-group-info/${groupId}`, {
      method: 'POST',
      body: JSON.stringify(updatedFields),
    })
  }

  // console.log(isOwner, res?.ownedGroups?.includes(groupId), res.ownedGroups)

return (
  <>
    {isOwner ? (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* <Button size="sm">Group Settings</Button> */}
          <SidebarMenuAction>
            <Settings className="animate-appear" />
          </SidebarMenuAction>
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogTitle className="sr-only">Settings</DialogTitle>
          <DialogDescription className="sr-only">
            Customize your settings here.
          </DialogDescription>
          <SidebarProvider className="items-start">
            <Sidebar
              collapsible="none"
              className="hidden md:flex gap-4 border-r border-gray-700"
            >
              <SidebarHeader className="flex font-bold text-lg"
                style={{
                  paddingTop: "20px", // Space from the top
                }}>
                Group Name: {data.displayName}
              </SidebarHeader>
              {/* <SidebarHeader>Group ID: {groupId}</SidebarHeader> */}
              <SidebarContent className="flex gap-2 text-lg">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="flex flex-col gap-4 py-2">
                      <SidebarMenuItem>
                        group ID: {data.groupId}
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        Allow people to join by group ID
                        <Switch checked={allowJoinById} onCheckedChange={setAllowJoinById}/>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">Current Prompt</div>
              </header>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-1">
                <Textarea
                  placeholder="Write a prompt for the group members to base their responses on"
                  className="h-full"
                  value={prompt}
                  onChange={handleTextChange}
                />
              </div>
              <Footer className="flex justify-between p-2 border-t border-gray-700">
                <p className="text-red-500 justify-start">
                  {unsavedChanges ? "Warning - unsaved changes" : ""}
                </p>
                <div className="flex gap-4">
                  <DialogClose asChild>
                    <Button variant="outline" className="justify-end">
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="default" className="justify-end" onClick={handleSave}>
                      Save
                    </Button>
                  </DialogClose>
                </div>
              </Footer>
            </main>
          </SidebarProvider>
        </DialogContent>
      </Dialog>
    ) : (
      <></>
    )}
  </>
);
};
