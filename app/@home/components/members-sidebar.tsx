"use client";
import React from "react";
import { UserCircle } from "lucide-react";
import {
  GroupEntry,
  GroupId,
  TeamGroupEntry,
} from "../../types/dynamo-schemas";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { GroupSettingsModal } from "./group-settings-modal";

export default function MembersSidebar({
  groups,
  selectedCollective,
}: {
  groups: Record<GroupId, GroupEntry>;
  selectedCollective: string;
}) {
  let id_split = selectedCollective.split("_");
  let collective_data: GroupEntry | TeamGroupEntry | undefined =
    groups[id_split[0]];
  let member_id_arr: string[] = [];
  if (collective_data !== undefined) {
    member_id_arr = Object.keys(collective_data.members);
  }

  if (id_split.length > 1) {
    collective_data = collective_data.teams[selectedCollective];
    member_id_arr = collective_data.members;
  }

  return (
    <Sidebar side="right" className="dark w-64 bg-gray-300 text-gray-100">
      <SidebarHeader>
        <div className="p-4 border-b border-gray-700">
          {selectedCollective == "" ? (
            "None Selected"
          ) : (
            <div>
              <GroupSettingsModal/>
              Members - {member_id_arr.length}
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
                  className="flex p-4 justify-items-start	items-center text-gray-200 py-2"
                >
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
