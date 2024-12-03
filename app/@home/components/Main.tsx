"use client";
import React from "react";
import JoinGroupButton from "./join-group";
import CreateGroupButton from "./create-group-button";
import GenerateTeamsButton from "./generate-teams-button";
import LeaveGroup from "./leave-group";
import PromptAnswerButton from "./prompt-answer";
import { UserProfile } from "@/app/@home/use-user";

const Main = ({
  selectedCollective,
  handleCreateGroup,
}: {
  selectedCollective: any;
  handleCreateGroup: any;
}) => {
  const [isOwner, setIsOwner] = React.useState(false);
  const res = UserProfile() as { ownedGroups: string[]; joinedGroups: string[]};
  React.useEffect(() => {
    const isUserOwner = res?.ownedGroups?.includes(selectedCollective);
    setIsOwner(isUserOwner);
  }, [res, selectedCollective]);

  return (
    <main className={selectedCollective == "" ? "relative w-full" : "relative"}>
      <div className="flex absolute bottom-0 left-* right-0 right-200 space-x-2 mr-2 mb-2">
        {!isOwner&&<LeaveGroup selectedCollective={selectedCollective} />}
        <GenerateTeamsButton selectedCollective={selectedCollective} />
        <CreateGroupButton onCreateGroup={handleCreateGroup} />
        <JoinGroupButton onCreateGroup={handleCreateGroup} />
        {selectedCollective.trim()!==""&&<PromptAnswerButton selectedCollective={selectedCollective} />}
      </div>
    </main>
  );
};

export default Main;
