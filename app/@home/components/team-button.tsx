"use client";
import React, { useState } from "react";

import { TeamId, TeamGroupEntry } from "../../types/dynamo-schemas";
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
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleClick}
            isActive={selectedCollective == teamId}
          >
            {teamId}
          </SidebarMenuButton>
          {owner_id == groupOwner ? (
            <SidebarMenuAction onClick={lockHandler}>
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
