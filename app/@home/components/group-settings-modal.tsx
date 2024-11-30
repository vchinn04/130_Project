"use client";

import * as React from "react";
import {
  Settings,
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

export function GroupSettingsModal() {
  const [open, setOpen] = React.useState(false); // default state of the dialog is closed (false)
  const groupId = "group-ID-Placeholder"; // replace with the react query "use query when you hook-up the backend"
  const [unsavedChanges, setUnsavedChanges] = React.useState(false); // replace with a state hooked-up to the query logic
  const [prompt, setPrompt] = React.useState(""); // replace with a state hooked-up to the query logic

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
    setUnsavedChanges(true); // trigger unsaved changes flag when the prompt text changes
  };

  return (
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
            <SidebarHeader>Group ID: {groupId}</SidebarHeader>
            <SidebarContent className="flex gap-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="flex flex-col gap-6">
                    <SidebarMenuItem>
                      Allow people to join by group ID
                      <Switch />
                    </SidebarMenuItem>
                    <SidebarMenuItem>*Other Settings*</SidebarMenuItem>
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
                  <Button variant="default" className="justify-end">
                    Save
                  </Button>
                </DialogClose>
              </div>
            </Footer>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
