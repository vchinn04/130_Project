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

    // Function to handle form submission
    const handleGenerateTeams = () => {
        console.log("Generating teams with settings:");
        console.log("Include Only Prompt Completed:", IncludeOnlyPromptCompleted);
        console.log("Include All Users:", IncludeAll);

        // Add OpenAI API call or other logic here

        // Close the dialog after submission
        setIsOpen(false);
    };
    const handleOnOpen = () => {
        setIsOpen(true);
        setIncludeOnlyPromptCompleted(false);
        setIncludeAll(false); 
        //maybe these get added to group settings within the db so they get saved?
        //or we can have it just always be false when reopened
    }

    return (
      <div>
        {/* Button to open the popup */}
        <Button onClick={() => handleOnOpen()}> Generate Teams</Button>
  
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
                   id="includeOnlyPromptCompleted"
                   checked={IncludeOnlyPromptCompleted} // Controlled by state
                   onCheckedChange={(checked) => setIncludeOnlyPromptCompleted(checked === true)} // Updates state
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Include all users (regardless of team's locked status)</span>
                <Checkbox
                    id="includeAll"
                    checked = {IncludeAll}
                    onCheckedChange={(checked) => setIncludeAll(checked === true)}
                />
              </div>
            </div>
  
            {/* Confirm/Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => handleGenerateTeams()}>
                Confirm
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
