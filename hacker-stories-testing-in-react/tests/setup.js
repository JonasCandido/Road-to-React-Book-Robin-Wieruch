import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

// extends Vitest's expect method with methoods from react-testing-library

expect.extend(matchers);

// runs a cleanup after each test case(e. g. clearing jsdom)

afterEach(() => {
    cleanup();
});
