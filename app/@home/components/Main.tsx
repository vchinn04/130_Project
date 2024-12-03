"use client";
import React from "react";
import JoinGroupButton from "./join-group";
import CreateGroupButton from "./create-group-button";
import GenerateTeamsButton from "./generate-teams-button";
import LeaveGroup from "./leave-group";
import PromptAnswerButton from "./prompt-answer";
import { GroupId } from "@/types/globals";
import { GroupItemMap } from "@/lib/db-utils/schemas";
const Main = ({
  selectedCollective,
  handleCreateGroup,
  groups,
}: {
  selectedCollective: any;
  handleCreateGroup: any;
  groups: Record<GroupId, GroupItemMap>;
}) => {
  return (
    <main className={selectedCollective == "" ? "relative w-full" : "relative"}>
      <div className="flex absolute bottom-0 left-* right-0 right-200 space-x-2 mr-2 mb-2">
        <LeaveGroup selectedCollective={selectedCollective} />
        <GenerateTeamsButton selectedCollective={selectedCollective} groups={groups}/>
        <CreateGroupButton onCreateGroup={handleCreateGroup} />
        <JoinGroupButton onCreateGroup={handleCreateGroup} />
        {selectedCollective.trim()!==""&&<PromptAnswerButton selectedCollective={selectedCollective} />}
      </div>
    </main>
  );
};

export default Main;
