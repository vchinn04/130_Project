import "../globals.css";

export default function HomeLayout({
  children,
  chat,
}: Readonly<{ children: React.ReactNode; chat: React.ReactNode }>) {
  return (
    <div>
      {children}
      {/* {chat} */}
    </div>
  );
}
