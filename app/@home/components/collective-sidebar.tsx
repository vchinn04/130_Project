"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GroupEntry, GroupId } from "../../types/dynamo-schemas";
import GroupButton from "./group-button";
import TeamButton from "./team-button";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { View } from "./view-button";
import ViewButton from "./view-button";
import MembersSidebar from "./members-sidebar";
import { UserButton } from "@clerk/nextjs";
import CreateGroupButton from "./create-group-button"; // Import the CreateGroupButton component

export default function CollectiveSidebar({
  groups: initialGroups,
}: {
  groups: Record<GroupId, GroupEntry>;
}) {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedCollective, setSelectedCollective] = useState("");
  const [selectedView, setSelectedView] = useState(View.Groups);

  const handleCreateGroup = (newGroup) => {
    setGroups((prevGroups) => ({
      ...prevGroups,
      [newGroup.groupId]: newGroup,
    }));
  };

  return (
    <>
      <Sidebar className="dark w-64 bg-gray-900 text-gray-100">
        <SidebarHeader>
          <div className="p-4 border-b border-gray-700">
            <div className="flex">
              <UserButton />
              <Link href="/" className="flex ml-3 items-end">
                {" "}
                Match.io{" "}
              </Link>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* Channels Section */}
            {selectedView == View.Groups
              ? Object.keys(groups).map((key) => {
                  return (
                    <GroupButton
                      key={key}
                      groupId={key}
                      groupData={groups[key]}
                      selectedCollective={selectedCollective}
                      setSelectedCollective={setSelectedCollective}
                    />
                  );
                })
              : Object.keys(groups).map((key) => {
                  return Object.keys(groups[key].teams).map((tkey) => {
                    return (
                      <TeamButton
                        key={tkey}
                        teamId={tkey}
                        teamData={groups[key].teams[tkey]}
                        selectedCollective={selectedCollective}
                        setSelectedCollective={setSelectedCollective}
                      />
                    );
                  });
                })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="m-0 py-2 border-t border-gray-700">
            <ViewButton
              selectedView={selectedView}
              setSelectedView={setSelectedView}
              setSelectedCollective={setSelectedCollective}
            />
          </div>
          <div className="p-4">
            <CreateGroupButton onCreateGroup={handleCreateGroup} /> {/* Add the CreateGroupButton component */}
          </div>
        </SidebarFooter>
      </Sidebar>
      <MembersSidebar groups={groups}> </MembersSidebar>
    </>
  );
}