"use client";
import React, { useState } from "react";

import { TeamId, TeamGroupEntry } from "../../../lib/dynamodb-utils/dynamo-schemas";
import { LockOpen, Lock } from "lucide-react";

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function TeamButton({
  teamId,
  groupOwner,
  teamData,
  selectedCollective,
  setSelectedCollective,
}: {
  teamId: TeamId;
  groupOwner: string;
  teamData: TeamGroupEntry;
  selectedCollective: any;
  setSelectedCollective: any;
}) {
  console.log(teamData);
  let owner_id = "userid1";
  function handleClick() {
    setSelectedCollective(teamId);
  }

  let [isLocked, setIsLocked] = useState(false);

  function lockHandler() {
    setIsLocked(!isLocked);
  }
  return (
    <>
      {teamData.members.includes(owner_id) || owner_id == groupOwner ? (
        <SidebarMenuItem className="primary primary-foreground">
          <SidebarMenuButton
            onClick={handleClick}
            isActive={selectedCollective == teamId}
            className="animate-appear"
          >
            {teamId}
          </SidebarMenuButton>
          {owner_id == groupOwner ? (
            <SidebarMenuAction className="animate-appear" onClick={lockHandler}>
              {isLocked ? <Lock /> : <LockOpen />}
            </SidebarMenuAction>
          ) : (
            <></>
          )}
        </SidebarMenuItem>
      ) : (
        <></>
      )}
    </>
  );
}
