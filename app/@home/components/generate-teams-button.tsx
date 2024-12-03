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
import {Input} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {GroupId} from "@/types/globals";
import { GroupItemMap } from "@/lib/db-utils/schemas";

export default function GenerateTeamsButton({
  selectedCollective,
  groups
}: {
  selectedCollective: any;
  groups: Record<GroupId, GroupItemMap>;
}) {
  let id_split = selectedCollective.split("_");
  let groupId = "";
  let prompt = "";
  let collective_data: GroupItemMap  | undefined = groups[id_split[0]];
  if (collective_data !== undefined) {
    groupId = collective_data.info.groupId;
    prompt = collective_data.info.prompt;
  }
  console.log(collective_data);

 

  const [isOpen, setIsOpen] = React.useState(false); // State to control the Dialog (popup)
  const [teamSize, setTeamSize] = React.useState(0);

  //states for the checkboxes
  const [IncludeOnlyPromptCompleted, setIncludeOnlyPromptCompleted] =
    React.useState(false);
  const [IncludeAll, setIncludeAll] = React.useState(false);

  //function to handle form submission
  const handleGenerateTeams = async () => {
    // console.log("Generating teams with settings:");
    // console.log("Include Only Prompt Completed:", IncludeOnlyPromptCompleted);
    // console.log("Include All Users:", IncludeAll);
    // console.log("Team Size:", teamSize);
    // Add OpenAI API call or other logic here
    //if include all is true, send all users to openai api
    //if include only prompt completed is true, send only those who have completed the prompt
    const url = `generate-teams/${groupId}/${teamSize.toString()}/${prompt}`
    console.log(url);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
        //parse response
      });
      console.log(response);
    } catch (error) {
      console.error("Error with response from server:", error);
    }
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

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let parseint =parseInt(event.target.value)
    if (isNaN(parseint)) {
      setTeamSize(0);
    } else{
      setTeamSize(parseint);
    }
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

            {/* Settings */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-3">
              {/* <TextField placeholder="Number of teams to generate" type= "number" onChange={handleTextChange}/> */}
              <Textarea
                  placeholder="Number of teams to generate" 
                  // type= "number"
                  className="h-full"
                  value={teamSize}
                  onChange={handleTextChange}
                />
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
// add option to mix even if that person hasn't filled out prompt    (Toggle1)

//depending on setting: (include locked teams) (Toggle2)
// no matter who are locked,they are either mixed in or not depending on selected setting

//people who are locked into a team don't have their team erased, every other team in the group gets deleted

//get back data from openai api call (with dummy data rn)

//insert created teams into database (group and users)
