"use client"

import * as React from "react"
import {Button} from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
    Checkbox,
} from "@/components/ui/checkbox";

export default function GenerateTeamsButton() {
    const [isOpen, setIsOpen] = React.useState(false); // State to control the Dialog (popup)
  
    // States for the checkboxes
    const [IncludeOnlyPromptCompleted, setIncludeOnlyPromptCompleted] = React.useState(false);
    const [IncludeAll, setIncludeAll] = React.useState(false);
  
    return (
      <div>
        {/* Button to open the popup */}
        <Button onClick={() => setIsOpen(true)}>Generate Teams</Button>
  
        {/* Dialog (popup) */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Teams</DialogTitle>
              <DialogDescription>Customize your preferences below:</DialogDescription>
            </DialogHeader>
  
            {/* Checkboxes */}
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span>Include only those who have completed the prompt</span>
                <Checkbox
                  checked={IncludeOnlyPromptCompleted}
                  onCheckedChange={(checked) => setIncludeOnlyPromptCompleted(true)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Include all users (regardless of team's locked status)</span>
                <Checkbox
                  checked={IncludeAll}
                  onCheckedChange={(checked) => setIncludeAll(true)}
                />
              </div>
            </div>
  
            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

//with the people that have saved prompts, send those to openai api to be matched
    // add option to mix even if that person hasnt filled out prompt    (Toggle1)

//depending on setting: (include locked teams) (Toggle2)
    // no matter who are locked,they are either mixed in or not depending on selected setting

//people who are locked into a team dont have their team erased, every other team in the group gets deleted

//get back data from openai api call (with dummy data rn)

//insert created teams into database (group and users)
