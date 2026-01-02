import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";
import type { RequestHandler, WebSocketHandler } from "msw";

export const createHttpServer = (...handlers: (RequestHandler | WebSocketHandler)[]) => {
  const server = setupServer(...handlers);

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
};
