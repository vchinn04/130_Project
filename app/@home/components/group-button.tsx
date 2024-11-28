"use client";
import React from "react";
import { Settings, ChevronRight } from "lucide-react";
import { GroupEntry, GroupId } from "../../../lib/dynamodb-utils/dynamo-schemas";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import TeamButton from "./team-button";
import { GroupSettingsModal } from "./group-settings-modal";

export default function GroupButton({
  groupId,
  groupData,
  selectedCollective,
  setSelectedCollective,
}: {
  groupId: GroupId;
  groupData: GroupEntry;
  selectedCollective: any;
  setSelectedCollective: any;
}) {
  function handleClick() {
    setSelectedCollective(groupId);
  }

  return (
    <>
      <Collapsible className="group/collapsible">
        <SidebarMenuItem>
          {/*Group Button*/}
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={handleClick}
              isActive={selectedCollective == groupId}
              className="animate-appear"
            >
              {/* className={
                selectedCollective == groupId
                  ? "bg-primary_purple-hover"
                  : "hover:bg-primary_purple-hover"
              } */}
              {groupData.groupName}{" "}
              <ChevronRight className="animate-appear ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {/*Team Buttons*/}
          <CollapsibleContent>
            <SidebarMenuSub>
              {Object.keys(groupData.teams).map((key) => {
                return (
                  <TeamButton
                    key={key}
                    teamId={key}
                    groupOwner={groupData.groupOwner}
                    teamData={groupData.teams[key]}
                    selectedCollective={selectedCollective}
                    setSelectedCollective={setSelectedCollective}
                  />
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
          <GroupSettingsModal />
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}
