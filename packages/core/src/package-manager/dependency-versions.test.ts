import { describe, expect, it } from "vitest";
import {
  fallbackDependencyVersions,
  resolveDependencyVersion,
  selectStableVersion,
  toCompatibleRange,
} from "./dependency-versions";

const now = new Date("2026-07-01T00:00:00.000Z");

describe("dependency version resolution", () => {
  it("formats versions as compatible semver ranges", () => {
    expect(toCompatibleRange("1.2.3")).toBe("^1.2.3");
    expect(toCompatibleRange("^1.2.3")).toBe("^1.2.3");
  });

  it("uses latest when it is at least seven days old", () => {
    expect(
      selectStableVersion(
        {
          "dist-tags": { latest: "2.0.0" },
          versions: { "1.0.0": {}, "2.0.0": {} },
          time: {
            "1.0.0": "2026-01-01T00:00:00.000Z",
            "2.0.0": "2026-06-20T00:00:00.000Z",
          },
        },
        now,
      ),
    ).toBe("2.0.0");
  });

  it("skips latest when it is newer than seven days", () => {
    expect(
      selectStableVersion(
        {
          "dist-tags": { latest: "2.0.0" },
          versions: { "1.9.0": {}, "2.0.0": {} },
          time: {
            "1.9.0": "2026-06-01T00:00:00.000Z",
            "2.0.0": "2026-06-29T00:00:00.000Z",
          },
        },
        now,
      ),
    ).toBe("1.9.0");
  });

  it("ignores prerelease versions", () => {
    expect(
      selectStableVersion(
        {
          "dist-tags": { latest: "2.0.0-beta.1" },
          versions: { "1.0.0": {}, "2.0.0-beta.1": {} },
          time: {
            "1.0.0": "2026-06-01T00:00:00.000Z",
            "2.0.0-beta.1": "2026-06-01T00:00:00.000Z",
          },
        },
        now,
      ),
    ).toBe("1.0.0");
  });

  it("falls back when metadata fetch fails", async () => {
    await expect(
      resolveDependencyVersion("express", {
        fetchMetadata: async () => {
          throw new Error("offline");
        },
        now,
      }),
    ).resolves.toBe(fallbackDependencyVersions.express);
  });

  it("falls back when no stable version is eligible", async () => {
    await expect(
      resolveDependencyVersion("zod", {
        fetchMetadata: async () => ({
          "dist-tags": { latest: "1.0.0" },
          versions: { "1.0.0": {} },
          time: { "1.0.0": "2026-06-30T00:00:00.000Z" },
        }),
        now,
      }),
    ).resolves.toBe(fallbackDependencyVersions.zod);
  });
});
