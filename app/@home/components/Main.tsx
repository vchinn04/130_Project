"use client";
import React from "react";
import { useState } from "react";
import PopUp from "./PopUp";
import { Button } from "@/components/ui/button";
import CreateGroupButton from "./create-group-button";
import GenerateTeamsButton from "./generate-teams-button";
import LeaveGroup from "./leave-group";
const Main = ({
  selectedCollective,
  handleCreateGroup,
}: {
  selectedCollective: any;
  handleCreateGroup: any;
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <main className={selectedCollective == "" ? "relative w-full" : "relative"}>
      <div className="flex absolute bottom-0 left-* right-0 right-200 space-x-2 mr-2 mb-2">
        <LeaveGroup selectedCollective={selectedCollective} />
        <GenerateTeamsButton selectedCollective={selectedCollective} />
        <CreateGroupButton onCreateGroup={handleCreateGroup} />
        <Button className="" onClick={() => setIsPopupOpen(!isPopupOpen)}>
          Join Group
        </Button>
      </div>
      {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen} />}
    </main>
  );
};

export default Main;
