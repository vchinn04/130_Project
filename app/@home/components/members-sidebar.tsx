"use client";
import React from "react";
import { UserCircle } from "lucide-react";
import {
  GroupTable,
  GroupId,
  Team,
  TeamSubtable,
} from "../../../lib/dynamodb-utils/dynamo-schemas";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { GroupSettingsModal } from "./group-settings-modal";
import GenerateTeamsButton from "./generate-teams-button";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * The MembersSidebar component displays a sidebar with information about the currently selected collective.
 *
 * @param {Record<GroupId, GroupEntry>} groups - A mapping of group IDs to their respective GroupEntry objects.
 * @param {string} selectedCollective - The ID of the currently selected collective.
 *
 * @returns A JSX element representing the MembersSidebar component.
 */
/******  679a6ac9-301b-4409-847a-aac36ea9f6f8  *******/
export default function MembersSidebar({
  groups,
  selectedCollective,
}: {
  groups: Record<GroupId, GroupTable[]>;
  selectedCollective: string;
}) {
  let id_split = selectedCollective.split("_");
  let collective_data: GroupTable[] | Team | undefined = groups[id_split[0]];
  let member_id_arr: string[] = [];
  if (collective_data !== undefined) {
    member_id_arr = Object.keys(collective_data[1].members);
  }

  if (collective_data !== undefined && id_split.length > 1) {
    collective_data = collective_data[2].teams[parseInt(id_split[1])] as Team;
    member_id_arr = collective_data.members;
  }

  return (
    <Sidebar side="right" className="w-64 bg-gray-300">
      {" "}
      {/*text-gray-100*/}
      <SidebarHeader>
        <div className="p-4 border-b border-gray-700 primary-foreground">
          {selectedCollective == "" ? (
            "None Selected"
          ) : (
            <div>
              {/* <GroupSettingsModal /> */}
              {/* <div className="mt-4">
                <GenerateTeamsButton />
              </div> */}
              {/* Members - {member_id_arr.length} */}
              <div className="mt-2">Members - {member_id_arr.length}</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="flex items-center">
        <SidebarGroup>
          <SidebarGroupContent>
            {member_id_arr.map((id) => {
              return (
                <div
                  key={id}
                  className="animate-appear flex p-4 justify-items-start	items-center py-2 primary-foreground"
                >
                  {/* text-gray-200*/}
                  <UserCircle className="mr-2" />
                  <span>{id}</span>
                </div>
              );
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
