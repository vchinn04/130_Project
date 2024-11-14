"use client";
import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import Link from "next/link";
import { GroupEntry, GroupId } from "../../types/dynamo-schemas";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";

export default function MembersSidebar({
  groups,
}: {
  groups: Record<GroupId, GroupEntry>;
}) {
  return (
    <>
      <Sidebar side="right" className="dark w-64 bg-gray-300 text-gray-100">
        <SidebarHeader>
          <div className="p-4 border-b border-gray-700">
            <div>
              <Link href="/" className="text-center">
                {" "}
                Members - 5{" "}
              </Link>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex items-center">
          <div className="flex items-center text-gray-200 py-2">
            <UserCircle className="mr-2" />
            <span>John Doe</span>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
