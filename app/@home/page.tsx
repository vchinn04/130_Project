import React from "react";

import {
  FullGroupTable,
  GroupId,
} from "../../lib/dynamodb-utils/dynamo-schemas";
import CollectiveSidebar from "./components/home-page";
import { SidebarProvider } from "@/components/ui/sidebar";

const groups: Record<GroupId, FullGroupTable> = {
  groupid1: {
    groupId: "groupid1",
    owner: "userid1",
    displayName: "CoolGroup",
    prompt: "What you like to do?",
    subTable: "",
    locked: true,
    memberCount: 2,
    teamCount: 1,
    createdAt: new Date(),
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
  groupid2: {
    groupId: "groupid2",
    owner: "userid2",
    displayName: "CoolGroup2",
    prompt: "What you like to do?",
    subTable: "",
    locked: true,
    memberCount: 2,
    teamCount: 1,
    createdAt: new Date(),
    generatedAt: new Date(),

    teams: [
      {
        members: ["userid1"],
      },
      // groupid2_team12d: {
      //   locked: false,
      //   members: ["userid1"],
      // },
    ],
    members: {
      userid2: {
        promptAnswer: "Stuff",
        ready: true,
      },
      userid1: {
        promptAnswer: "Cool Stuff",
        ready: true,
      },
    },
  },
  groupid3: {
    groupId: "groupid3",
    owner: "userid3",
    displayName: "CoolGroup3",
    prompt: "What you like to do?",
    subTable: "",
    locked: true,
    memberCount: 2,
    teamCount: 1,
    createdAt: new Date(),
    generatedAt: new Date(),

    teams: [
      { members: ["member3"] },
      // groupid3_team3id: {
      //   locked: false,
      //   members: ["member3"],
      // },
    ],
    members: {
      userid3: {
        promptAnswer: "Stuff",
        ready: true,
      },
      member3: {
        promptAnswer: "Cool Stuff",
        ready: true,
      },
      userid1: {
        promptAnswer: "Cool Stuff",
        ready: true,
      },
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
