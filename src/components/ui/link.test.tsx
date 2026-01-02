import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TestRouterProvider } from "@/test/helpers/test-router-provider";
import { Link } from "./link";

describe("Link", () => {
  test("renders", () => {
    const { container } = render(
      <TestRouterProvider>
        <Link href="/test">Test</Link>
      </TestRouterProvider>,
    );
    expect(container).not.toBeEmptyDOMElement();
  });
});
