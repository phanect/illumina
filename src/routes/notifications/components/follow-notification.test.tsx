import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { followNotification } from "@/lib/bluesky/types.data";
import { TestRouterProvider } from "@/test/helpers/test-router-provider";
import { FollowNotification } from "./follow-notification";

describe("FollowNotification", () => {
  test("renders", () => {
    const notification = followNotification;
    const { container } = render(
      <TestRouterProvider>
        <FollowNotification notification={notification} />
      </TestRouterProvider>,
    );
    expect(container).not.toBeEmptyDOMElement();
  });
});
