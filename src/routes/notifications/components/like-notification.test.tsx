import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useBlueskyStore } from "@/lib/bluesky/store";
import { likeNotification } from "@/lib/bluesky/types.data";
import { TestRouterProvider } from "@/test/helpers/test-router-provider";
import { LikeNotification } from "./like-notification";

describe("LikeNotification", () => {
  test("renders", () => {
    useBlueskyStore.setState({ session: { did: "did:web:testabc123" } as any });

    const notification = likeNotification;
    const { container } = render(
      <TestRouterProvider>
        <LikeNotification notifications={[ notification ]} />
      </TestRouterProvider>,
    );
    expect(container).not.toBeEmptyDOMElement();
  });
});
