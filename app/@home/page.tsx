import React from "react";

import { GroupItemMap, GroupId } from "../../lib/db-utils/schemas";
import CollectiveSidebar from "./components/home-page";
import { SidebarProvider } from "@/components/ui/sidebar";

const groups: Record<GroupId, GroupItemMap> = {
  groupid1: {
    info: {
      groupId: "groupid1",
      owner: "userid1",
      displayName: "CoolGroup",
      prompt: "What you like to do?",
      subTable: "info",
      locked: true,
      memberCount: 2,
      teamCount: 1,
      createdAt: new Date(),
    },
    members: {
      groupId: "groupid1",
      subTable: "members",
      members: {
        userid1: {
          promptAnswer: "Stuff",
          ready: true,
        },
        member1: {
          promptAnswer: "Cool Stuff",
          ready: true,
        },
      },
    },
    teams: {
      groupId: "groupid1",
      subTable: "teams",
      generatedAt: new Date(),
      teams: [
        {
          members: ["member1"],
        },
        // groupid1_teamid1: {
        //   locked: false,
        //   members: ["member1"],
        // },
      ],
    },
  },
  groupid2: {
    info: {
      groupId: "groupid2",
      owner: "userid2",
      displayName: "CoolGroup",
      prompt: "What you like to do?",
      subTable: "info",
      locked: true,
      memberCount: 2,
      teamCount: 1,
      createdAt: new Date(),
    },
    members: {
      groupId: "groupid1",
      subTable: "members",
      members: {
        userid1: {
          promptAnswer: "Stuff",
          ready: true,
        },
        userid2: {
          promptAnswer: "Cool Stuff",
          ready: true,
        },
      },
    },
    teams: {
      groupId: "groupid1",
      subTable: "teams",
      generatedAt: new Date(),
      teams: [
        {
          members: ["userid1"],
        },
        // groupid1_teamid1: {
        //   locked: false,
        //   members: ["member1"],
        // },
      ],
    },
  },
};
export default async function Home() {
  return (
    <div className="flex h-screen bg-gray-200">
      <SidebarProvider>
        {/* Left Sidebar - Channel List */}
        {/* <div className="w-64 bg-gray-900 text-gray-100 flex flex-col"> */}
        <CollectiveSidebar groups={groups} />
        {/* </div> */}
        {/* Hi Victor */}
        {/* Main Content */}
      </SidebarProvider>
    </div>
  );
}
