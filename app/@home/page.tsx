import React from "react";

import { GroupEntry, GroupId } from "../types/dynamo-schemas";
import CollectiveSidebar from "./components/collective-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const groups: Record<GroupId, GroupEntry> = {
  groupid1: {
    groupId: "groupid1",
    groupOwner: "userid1",
    groupName: "CoolGroup",
    prompt: "What you like to do?",
    teams: {
      groupid1_teamid1: {
        locked: false,
        members: ["member1"],
      },
    },
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
    groupOwner: "userid2",
    groupName: "CoolGroup2",
    prompt: "What you like to do?",
    teams: {
      groupid2_team12d: {
        locked: false,
        members: ["userid1"],
      },
    },
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
    groupOwner: "userid3",
    groupName: "CoolGroup3",
    prompt: "What you like to do?",
    teams: {
      groupid3_team3id: {
        locked: false,
        members: ["member3"],
      },
    },
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
    <div className="flex h-screen bg-gray-800">
      <SidebarProvider>
        {/* Left Sidebar - Channel List */}
        {/* <div className="w-64 bg-gray-900 text-gray-100 flex flex-col"> */}
        <CollectiveSidebar groups={groups} />
        {/* </div> */}

        {/* Main Content */}
      </SidebarProvider>
    </div>
  );
}
