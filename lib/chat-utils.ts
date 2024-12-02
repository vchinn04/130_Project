"use server";
import { clerkClient, User } from "@clerk/nextjs/server";

export default async function getClerkUserList(userIdList: string[]) {
  const userMap: Record<string, (string | undefined)[]> = {};
  const client = await clerkClient();

  const { data } = await client.users.getUserList({
    userId: userIdList,
  });

  data.forEach((element: User) => {
    userMap[element.id] = [
      element.username != null ? element.username : undefined,
      element.imageUrl != null ? element.imageUrl : undefined,
    ];
  });

  return userMap;
}
