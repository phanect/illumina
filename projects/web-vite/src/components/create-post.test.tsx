import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useBlueskyStore } from "@/lib/bluesky/store";
import { TestRouterProvider } from "@/test/helpers/test-router-provider";
import { CreatePost } from "./create-post";

describe("CreatePost", () => {
  test("renders nothing when not authenticated", () => {
    const { container } = render(
      <TestRouterProvider>
        <CreatePost />
      </TestRouterProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders", () => {
    useBlueskyStore.setState({ isAuthenticated: true });
    const { getByRole } = render(
      <TestRouterProvider>
        <CreatePost />
      </TestRouterProvider>,
    );
    expect(getByRole("button")).toHaveTextContent("create post");
  });
});
