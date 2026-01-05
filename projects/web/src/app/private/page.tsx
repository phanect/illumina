import LoginButton from "@/components/LoginButton.tsx";
import LogoutButton from "@/components/LogoutButton.tsx";
import getSession from "@/lib/iron.ts";

export default async function Page() {
  const session = await getSession();

  if (!session.user) {
    return (
      <main className="row-start-2 flex flex-col items-center gap-2 sm:items-start">
        <span>You need to be logged in to view this page.</span>
        <LoginButton />
      </main>
    );
  }

  return (
    <main className="row-start-2 flex flex-col items-center gap-2 sm:items-start">
      <span>Private page, welcome {session.user.name}!</span>
      <LogoutButton />
    </main>
  );
}
