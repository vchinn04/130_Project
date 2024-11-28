"use client";
import React, { useState } from "react";

import {
  GroupId,
  Team,
  TeamId,
} from "../../../lib/dynamodb-utils/dynamo-schemas";
import { LockOpen, Lock } from "lucide-react";

import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function TeamButton({
  teamId,
  groupId,
  groupOwner,
  teamData,
  selectedCollective,
  setSelectedCollective,
}: {
  teamId: TeamId;
  groupId: GroupId;
  groupOwner: string;
  teamData: Team;
  selectedCollective: any;
  setSelectedCollective: any;
}) {
  let teamStringId: string = groupId + "_" + teamId;
  console.log(teamData);
  let owner_id = "userid1";
  function handleClick() {
    setSelectedCollective(teamStringId);
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
            isActive={selectedCollective == teamStringId}
            className="animate-appear"
          >
            {"Team #" + (teamId + 1)}
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
