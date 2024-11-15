"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export enum View {
  Groups,
  Teams,
}
export default function ViewButton({
  selectedView,
  setSelectedView,
  setSelectedCollective,
}: {
  selectedView: any;
  setSelectedView: any;
  setSelectedCollective: any;
}) {
  function handleClick(newView: View) {
    setSelectedCollective("");
    setSelectedView(newView);
  }
  return (
    <>
      <div className="flex">
        <Button
          variant={selectedView == View.Groups ? "secondary" : "ghost"}
          className="grow"
          onClick={() => {
            handleClick(View.Groups);
          }}
        >
          Groups
        </Button>
        <Button
          variant={selectedView == View.Teams ? "secondary" : "ghost"}
          className="grow"
          onClick={() => {
            handleClick(View.Teams);
          }}
        >
          Teams
        </Button>
      </div>
    </>
  );
}
