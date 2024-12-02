"use client";
import React from "react";
import JoinGroupButton from "./join-group";
import CreateGroupButton from "./create-group-button";
import GenerateTeamsButton from "./generate-teams-button";
import LeaveGroup from "./leave-group";
import PromptAnswerButton from "./prompt-answer";
const Main = ({
  selectedCollective,
  handleCreateGroup,
}: {
  selectedCollective: any;
  handleCreateGroup: any;
}) => {
  return (
    <main className={selectedCollective == "" ? "relative w-full" : "relative"}>
      <div className="flex absolute bottom-0 left-* right-0 right-200 space-x-2 mr-2 mb-2">
        <LeaveGroup selectedCollective={selectedCollective} />
        <GenerateTeamsButton selectedCollective={selectedCollective} />
        <CreateGroupButton onCreateGroup={handleCreateGroup} />
        <JoinGroupButton onCreateGroup={handleCreateGroup}/>
        <PromptAnswerButton />
      </div>
    </main>
  );
};

export default Main;
