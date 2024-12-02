"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GroupId } from "@/types/globals";
import { GroupTable, Team, GroupItemMap } from "@/lib/db-utils/schemas";
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
import CreateGroupButton from "./create-group-button";
import Main from "./Main";
import Chat from "./chat";
import { useUser, UserButton } from "@clerk/nextjs";
import { useQueries } from "@tanstack/react-query";

export default function CollectiveSidebar() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn || !user) return null;

  const metaData = user.publicMetadata;
  const groupIds = [...metaData.joinedGroups, ...metaData.ownedGroups];

  const [allGroupsFetched, setAllGroupsFetched] = useState(false);
  const [groups, setGroups] = useState<Record<GroupId, GroupItemMap>>({});
  const [selectedCollective, setSelectedCollective] = useState("");
  const [selectedView, setSelectedView] = useState(View.Groups);

  // Fetch all group data using useQueries
  const groupQueries = useQueries({
    queries: groupIds.map((id) => ({
      queryKey: ["groups", id],
      enabled: !!id,
      queryFn: async () => {
        const response = await fetch(`get-group/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
    })),
  });

  useEffect(() => {
    const allFetched = groupQueries.every((query) => query.isSuccess);
    setAllGroupsFetched(allFetched);

    if (allFetched) {
      const fetchedGroups = groupIds.reduce((acc, id, index) => {
        const query = groupQueries[index];
        if (query?.data) {
          return { ...acc, [id]: query.data };
        }
        return acc;
      }, {});
       setGroups(fetchedGroups); //heyyyyy we need help if you could hop back on call pls
    }
  }, [groupQueries, groupIds]);

  const handleCreateGroup = (newGroup: GroupItemMap) => {
    setGroups((prevGroups) => ({
      ...prevGroups,
      [newGroup.info.groupId]: newGroup,
    }));
  };


  return (
    <>
      <Sidebar className="w-64 bg-gray-900">
        {" "}
        {/*text-gray-100*/}
        <SidebarHeader>
          <div className="p-4 border-b border-gray-700 flex justify-between items-center primary-foreground">
            <div className="flex items-center">
              <UserButton />
              <Link href="/" className="flex ml-3 items-end">
                Match.io
              </Link>
            </div>

            <div className="ml-2">
              {" "}
              {}
              {/* <CreateGroupButton onCreateGroup={handleCreateGroup} /> {} */}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* Channels Section */}
            {allGroupsFetched && selectedView == View.Groups
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
              : allGroupsFetched && Object.keys(groups).map((key) => {
                  return groups[key].teams.teams.map(
                    (team: Team, tkey: number) => {
                      return (
                        <TeamButton
                          key={tkey}
                          teamId={tkey}
                          groupId={key}
                          groupOwner={groups[key].info.owner}
                          teamData={team} //{groups[key].teams[tkey]}
                          selectedCollective={selectedCollective}
                          setSelectedCollective={setSelectedCollective}
                        />
                      );
                    }
                  );
                })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="m-0 py-2 border-t border-gray-700 primary-foreground">
            <ViewButton
              selectedView={selectedView}
              setSelectedView={setSelectedView}
              setSelectedCollective={setSelectedCollective}
            />
          </div>
        </SidebarFooter>
      </Sidebar>
      <Chat
        selectedCollective={selectedCollective}
        setSelectedCollective={setSelectedCollective}
      />
      <Main
        selectedCollective={selectedCollective}
        handleCreateGroup={handleCreateGroup}
      />{" "}
      <MembersSidebar groups={groups} selectedCollective={selectedCollective} />
    </>
  );
}