"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { loginWithBluesky } from "@/lib/actions.ts";

export default function LoginPage() {
  const router = useRouter();
  const [ handle, setHandle ] = useState("");

  // Remove the @ symbol from the handle
  useEffect(() => {
    setHandle(handle.replace("@", ""));
  }, [ handle ]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!handle) {
      return;
    }

    const loginURL: string = await loginWithBluesky(handle);

    router.push(loginURL);
  };

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
        <div>
          <label
            htmlFor="handle"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Bluesky Handle
          </label>
          <div className="mt-2">
            <input
              id="handle"
              name="handle"
              type="text"
              placeholder="handle.bsky.social"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Sign in with Bluesky
        </button>
      </form>
    </main>
  );
}
