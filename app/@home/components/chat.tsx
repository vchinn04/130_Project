"use client";
import React, { useEffect, useState } from "react";

import { useAuth, useUser } from "@clerk/nextjs";
import { Team, GroupItemMap } from "../../../lib/db-utils/schemas";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { Send, Trash2, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import getClerkUserList from "../../../lib/chat-utils";
import { auth, db } from "../../../lib/firebase";

import {
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  getDocs,
  Timestamp,
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { signInWithCustomToken } from "firebase/auth";
import { GroupId } from "@/types/globals";

// Type of message entry in DB
type MessageEntry = {
  collectionId: string;
  messageContent: string;
  senderId: string;
  timestamp: Timestamp;
  id: string;
};

export default function Chat({
  selectedCollective,
  setSelectedCollective,
  groups,
}: {
  selectedCollective: string;
  setSelectedCollective: any;
  groups: Record<GroupId, GroupItemMap>;
}) {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  const [msg, setMsg] = useState("");

  const { getToken, userId } = useAuth();
  const signIntoFirebaseWithClerk = async () => {
    const token = await getToken({ template: "integration_firebase" });
    const userCredentials = await signInWithCustomToken(auth, token || "");
    // The userCredentials.user object can call the methods of
    // the Firebase platform as an authenticated user.
    console.log("User:", userCredentials.user);
    // getFirestoreData();
  };
  signIntoFirebaseWithClerk();

  // Extract whether selected collective is team or group
  let id_split = selectedCollective.split("_");
  let UID = id_split[0];
  let collective_data: GroupItemMap | Team | undefined = groups[id_split[0]];
  let collective_name: string = "";
  if (collective_data !== undefined) {
    collective_name = collective_data.info.displayName;
  }
  if (collective_data !== undefined && id_split.length > 1) {
    collective_data = collective_data.teams.teams[
      parseInt(id_split[1])
    ] as Team;
    collective_name += " Team #" + (parseInt(id_split[1]) + 1);
    UID += "_" + collective_data.teamUniqueId; // Create the team joint UID
  }

  const [messages, setMessages] = useState([] as MessageEntry[]);
  const [queryLimit, setQueryLimit] = useState(10); // How many messages to fetch

  const [userIdMap, setUserIdMap] = useState(
    {} as Record<string, (string | undefined)[]>
  );

  // Fetch messages and update when change occurs
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("collectionId", "==", UID),
      orderBy("timestamp", "desc"),
      limit(queryLimit)
    );

    const unsubscribe = onSnapshot(q, (qSnap) => {
      const newMessages: MessageEntry[] = [];
      const userIdList: Record<string, boolean> = {};

      qSnap.forEach((doc) => {
        let data = doc.data();
        userIdList["+" + data.senderId] = true; // Store senderId, dict helps to deduplicate

        newMessages.push({
          collectionId: data.collectionId,
          messageContent: data.messageContent,
          senderId: data.senderId,
          timestamp: data.timestamp,
          id: doc.id,
        });
      });

      const sortedMessages = newMessages.sort(
        // Sort messages based on time sent
        (ta, tb) =>
          (ta.timestamp != null ? ta.timestamp.toMillis() : Date.now()) -
          (tb.timestamp != null ? tb.timestamp.toMillis() : Date.now())
      );

      getClerkUserList(Object.keys(userIdList)).then((value) => {
        setUserIdMap(value); // Find the users of messages
      });

      setMessages(sortedMessages);

      return unsubscribe;
    });

    return unsubscribe;
  }, [selectedCollective, queryLimit]); // Listen to selectedCollective and queryLimit changes

  // Reset queryLimit to 10 whenever selectedCollective changes
  useEffect(() => {
    setQueryLimit(10);
  }, [selectedCollective]);

  function closeFunc() {
    setSelectedCollective("");
  }

  function onChange(e: any) {
    setMsg(e.target.value); // Current typed message
  }

  // Add message to DB
  const sendMessage = async (event: any) => {
    event.preventDefault();
    if (msg.trim() === "") {
      return;
    }

    await addDoc(collection(db, "messages"), {
      collectionId: UID,
      messageContent: msg,
      timestamp: serverTimestamp(),
      senderId: user.id,
    });

    setMsg("");
  };

  // Delete message from DB
  const deleteMessage = async (event: any, id: string) => {
    event.preventDefault();
    let doc_query = query(
      // Find matching record
      collection(db, "messages"),
      where("senderId", "==", user.id),
      where("__name__", "==", id), // This is a way to compare document id
      where("collectionId", "==", UID)
    );

    const deletionSnapshot = await getDocs(doc_query);
    deletionSnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "messages", docSnapshot.id));
    });
  };

  // Detect 'Enter' press
  function onKeyPress(e: any) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }

  // 'Load More' button handler
  function onLimitIncrease() {
    setQueryLimit(queryLimit + 10);
  }

  return (
    <>
      {selectedCollective == "" ? (
        <></>
      ) : (
        <div className="animate-appear flex flex-col grow justify-center rounded-md mx-7 mt-7 mb-[3.5rem] p-0 bg-white shadow-md">
          <div className="flex justify-between items-center px-1 border-b border-gray-400">
            <h2 className="text-lg pl-1">{collective_name}</h2>
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
              {messages.length >= 10 ? (
                <Button variant={"link"} onClick={onLimitIncrease}>
                  Load More
                </Button>
              ) : (
                <></>
              )}

              {messages.map((val: MessageEntry) => {
                let username: string | undefined =
                  userIdMap[val.senderId] !== undefined
                    ? userIdMap[val.senderId][0] !== undefined
                      ? userIdMap[val.senderId][0]
                      : val.senderId[0]
                    : val.senderId[0];

                let src: string | undefined =
                  userIdMap[val.senderId] !== undefined
                    ? userIdMap[val.senderId][1] !== undefined
                      ? userIdMap[val.senderId][1]
                      : undefined
                    : undefined;

                return (
                  <ChatBubble
                    key={val.id}
                    variant={val.senderId == user.id ? "sent" : "received"}
                    className="animate-appear"
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <ChatBubbleAvatar src={src} fallback={username} />
                      </TooltipTrigger>
                      <TooltipContent>{username}</TooltipContent>
                    </Tooltip>

                    <ChatBubbleMessage>{val.messageContent}</ChatBubbleMessage>

                    {val.timestamp != null ? (
                      <ChatBubbleTimestamp
                        timestamp={val.timestamp.toDate().toLocaleString()}
                      />
                    ) : (
                      <></>
                    )}

                    {val.senderId == user.id ? (
                      <ChatBubbleActionWrapper>
                        <ChatBubbleAction
                          className="size-7"
                          icon={<Trash2 />}
                          onClick={(event) => {
                            deleteMessage(event, val.id);
                          }}
                        />
                      </ChatBubbleActionWrapper>
                    ) : (
                      <></>
                    )}
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
              value={msg}
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
