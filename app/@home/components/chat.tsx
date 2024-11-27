"use client";
import React, { useState } from "react";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";

export type MessageEntry = {
  message: string;
  sender: string;
  timestamp: Date;
};

export default function Chat({
  selectedCollective,
  setSelectedCollective,
}: {
  selectedCollective: string;
  setSelectedCollective: any;
}) {
  const [msg, setMsg] = useState("");

  var messages: Record<string, MessageEntry> = {};
  if (selectedCollective != "") {
    messages = {
      messageid1: {
        message: "Hello!",
        sender: "userid1",
        timestamp: new Date(),
      },
      messageid2: {
        message: "Hi!",
        sender: "userid2",
        timestamp: new Date(),
      },
      messageid3: {
        message: "How are u?",
        sender: "userid3",
        timestamp: new Date(),
      },
    };
  }

  function closeFunc() {
    setSelectedCollective("");
  }

  function sendMessage() {
    console.log("Sent!");
    console.log(msg);
  }

  function onChange(e: any) {
    setMsg(e.target.value);
  }

  function onKeyPress(e: any) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {selectedCollective == "" ? (
        <></>
      ) : (
        <div className="animate-appear flex flex-col grow justify-center rounded-md mx-7 mt-7 mb-[3.5rem] p-0 bg-white shadow-md">
          <div className="flex justify-between items-center px-1 border-b border-gray-400">
            <h2 className="text-lg pl-1">Chat Name</h2>
            <Button
              variant={"ghost"}
              size="icon"
              className="rounded-full my-1"
              onClick={closeFunc}
            >
              <X />
            </Button>
          </div>

          <div className="grow overflow-y-auto">
            <ChatMessageList>
              {Object.keys(messages).map((key: string) => {
                return (
                  <ChatBubble
                    key={key}
                    variant={
                      "userid1" == messages[key].sender ? "sent" : "received"
                    }
                  >
                    <ChatBubbleAvatar fallback={messages[key].sender[0]} />
                    <ChatBubbleMessage>
                      {messages[key].message}
                    </ChatBubbleMessage>
                    <ChatBubbleTimestamp
                      timestamp={messages[key].timestamp.toLocaleString()}
                    />
                  </ChatBubble>
                );
              })}
            </ChatMessageList>
          </div>

          <div className="flex justify-center mb-3">
            <ChatInput
              id="MessageInput"
              placeholder="Type your message..."
              className="max-w-[575px] min-h-5  rounded-full bg-background resize-none  px-4"
              onChange={onChange}
              onKeyDown={onKeyPress}
            ></ChatInput>
            <Button
              variant={"ghost"}
              size="icon"
              className="rounded-full mt-1"
              onClick={sendMessage}
            >
              <Send />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
