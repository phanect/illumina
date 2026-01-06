#!/usr/bin/env -S pnpm exec jiti

import ngrok from "@ngrok/ngrok";
import { sleep } from "@phanect/utils";

if (!process.env.NEXT_PUBLIC_URL) {
  throw new Error("NEXT_PUBLIC_URL environment variable is not set.");
}

console.info("ngrok is waiting for local dev server...");

while (true) {
  await sleep(500);

  try {
    const res = await fetch("http://localhost:3000");

    if (res.ok) {
      break;
    }
  } catch (err) {
    if (err instanceof Error && err.cause instanceof Error && err.cause.name === "AggregateError") {
      continue;
    } else {
      throw err;
    }
  }
}

const listener = await ngrok.forward({
  addr: "http://localhost:3000",
  domain: new URL(process.env.NEXT_PUBLIC_URL).hostname,
  authtoken: process.env.NGROK_AUTHTOKEN,
  proto: "http",
  force_new_session: true,
  onLogEvent: (data) => console.log(data),
});

console.info(`

###############################################################

Connected to ngrok.

http://localhost:3000 is forwarded to
     → ${ listener.url() }

###############################################################

`);

// Required to keep ngrok running with mise
while (true) {
  await sleep(10000);
}
