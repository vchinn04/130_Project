"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
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
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function GenerateTeamsButton({
  selectedCollective,
}: {
  selectedCollective: any;
}) {
  let id_split = selectedCollective.split("_");

  const [isOpen, setIsOpen] = React.useState(false); // State to control the Dialog (popup)

  //states for the checkboxes
  const [IncludeOnlyPromptCompleted, setIncludeOnlyPromptCompleted] =
    React.useState(false);
  const [IncludeAll, setIncludeAll] = React.useState(false);

  //function to handle form submission
  const handleGenerateTeams = () => {
    console.log("Generating teams with settings:");
    console.log("Include Only Prompt Completed:", IncludeOnlyPromptCompleted);
    console.log("Include All Users:", IncludeAll);

    // Add OpenAI API call or other logic here
    //if include all is true, send all users to openai api
    //if include only prompt completed is true, send only those who have completed the prompt

    // Close the dialog after submission
    setIsOpen(false);
  };

  //function to handle opening the popup
  const handleOnOpen = () => {
    setIsOpen(true);
    //maybe these get added to group settings within the db so they get saved?
    //or we can have it just always be false when reopened
    setIncludeOnlyPromptCompleted(false);
    setIncludeAll(false);
  };

  return (
    id_split[0] != "" && (
      <div className="animate-appear">
        {/* Button to open the popup */}
        <Button onClick={() => handleOnOpen()}> Generate Teams</Button>

        {/* Dialog (popup) */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Teams</DialogTitle>
              <DialogDescription>
                Customize your preferences below:
              </DialogDescription>
            </DialogHeader>

            {/* Checkboxes */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="includeOnlyPromptCompleted"
                  checked={IncludeOnlyPromptCompleted}
                  onCheckedChange={(checked) =>
                    setIncludeOnlyPromptCompleted(checked === true)
                  } // Updates state
                  className="h-5 w-5"
                />
                <label
                  htmlFor="includeOnlyPromptCompleted"
                  className="text-md font-large flex-1 leading-tight"
                >
                  Include only those who have completed the prompt
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="includeAll"
                  checked={IncludeAll}
                  onCheckedChange={(checked) => setIncludeAll(checked === true)} // Updates state
                  className="h-5 w-5"
                />
                <label
                  htmlFor="includeAll"
                  className="text-md font-large flex-1 leading-tight" // max-w-[75%]
                >
                  Include all users (regardless of team's locked status)
                </label>
              </div>
            </div>

            {/* Confirm/Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button
                id="ConfirmGenerateTeams"
                variant="outline"
                onClick={() => handleGenerateTeams()}
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  );
}

//with the people that have saved prompts, send those to openai api to be matched
// add option to mix even if that person hasnt filled out prompt    (Toggle1)

//depending on setting: (include locked teams) (Toggle2)
// no matter who are locked,they are either mixed in or not depending on selected setting

//people who are locked into a team dont have their team erased, every other team in the group gets deleted

//get back data from openai api call (with dummy data rn)

//insert created teams into database (group and users)
