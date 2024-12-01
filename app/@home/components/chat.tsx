"use client";
import React, { useEffect, useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";

import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  GroupTable,
  GroupId,
  Team,
  TeamSubtable,
  GroupItemMap,
} from "../../../lib/db-utils/schemas";
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
import { auth, db } from "../../../lib/firebase";

import { signInWithCustomToken } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";

// Remove this if you do not have Firestore set up
// for your Firebase app
const getFirestoreData = async () => {
  const docRef = doc(db, "messages", "CE85vjSVzuhXx6oXkwbB");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

export type MessageEntry = {
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
    return null;
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

  let id_split = selectedCollective.split("_");
  let UID = id_split[0];
  let collective_data: GroupItemMap | Team | undefined = groups[id_split[0]];
  if (collective_data !== undefined && id_split.length > 1) {
    collective_data = collective_data.teams.teams[
      parseInt(id_split[1])
    ] as Team;
    UID += "_" + collective_data.teamUniqueId;
  }

  console.log(selectedCollective);
  // var messages: Record<string, MessageEntry> = {};
  // if (selectedCollective != "") {
  //   messages = {
  //     messageid1: {
  //       message: "Hello!",
  //       sender: "userid1",
  //       timestamp: new Date(),
  //     },
  //     messageid2: {
  //       message: "Hi!",
  //       sender: "userid2",
  //       timestamp: new Date(),
  //     },
  //     messageid3: {
  //       message: "How are u?",
  //       sender: "userid3",
  //       timestamp: new Date(),
  //     },
  //   };
  // }
  const [messages, setMessages] = useState([] as MessageEntry[]);

  console.log("UID: ", UID);
  // const result = useQuery({
  //   queryKey: ["messages"],
  //   queryFn: () => {
  //     const q = query(
  //       collection(db, "messages"),
  //       where("collectionId", "==", UID),
  //       orderBy("timestamp", "desc"),
  //       limit(50)
  //     );

  //     const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
  //       const fetchedMessages: MessageEntry[] = [];
  //       QuerySnapshot.forEach((doc) => {
  //         let data = doc.data();
  //         fetchedMessages.push({
  //           collectionId: data.collectionId,
  //           messageContent: data.messageContent,
  //           senderId: data.senderId,
  //           timestamp: data.timestamp,
  //           id: doc.id,
  //         });
  //       });
  //       const sortedMessages = fetchedMessages.sort(
  //         (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
  //       );
  //       setMessages(sortedMessages);
  //     });
  //     return () => unsubscribe;
  //   },
  // });

  // if (UID != "") {
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("collectionId", "==", UID),
      orderBy("timestamp", "desc"),
      limit(50)
    );
    console.log("QUERY!!");

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages: MessageEntry[] = [];
      QuerySnapshot.forEach((doc) => {
        let data = doc.data();
        fetchedMessages.push({
          collectionId: data.collectionId,
          messageContent: data.messageContent,
          senderId: data.senderId,
          timestamp: data.timestamp,
          id: doc.id,
        });
      });

      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
      );
      console.log("CHANGE!");

      setMessages(sortedMessages);

      return unsubscribe;
    });

    return unsubscribe;
  }, [selectedCollective]);
  // }
  function closeFunc() {
    setSelectedCollective("");
  }

  function onChange(e: any) {
    setMsg(e.target.value);
  }

  const sendMessage = async (event: any) => {
    event.preventDefault();
    if (msg.trim() === "") {
      alert("Enter valid message");
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

  function onKeyPress(e: any) {
    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }

  // console.log("MESSAGES: ", messages);
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
              {messages.map((val: MessageEntry) => {
                return (
                  <ChatBubble
                    key={val.id}
                    variant={val.senderId == user.id ? "sent" : "received"}
                  >
                    <ChatBubbleAvatar fallback={val.senderId} />
                    <ChatBubbleMessage>{val.messageContent}</ChatBubbleMessage>
                    <ChatBubbleTimestamp
                      timestamp={val.timestamp.toDate().toLocaleString()}
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
