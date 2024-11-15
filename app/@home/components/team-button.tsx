"use client";
import React from "react";

import { TeamId, TeamGroupEntry } from "../../types/dynamo-schemas";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export default function TeamButton({
  teamId,
  teamData,
  selectedCollective,
  setSelectedCollective,
}: {
  teamId: TeamId;
  teamData: TeamGroupEntry;
  selectedCollective: any;
  setSelectedCollective: any;
}) {
  console.log(teamData);

  function handleClick() {
    setSelectedCollective(teamId);
  }

  return (
    <>
      <SidebarMenuButton
        onClick={handleClick}
        isActive={selectedCollective == teamId}
      >
        {teamId}
      </SidebarMenuButton>
    </>
  );
}
