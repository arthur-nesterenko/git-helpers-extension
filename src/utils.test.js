import { describe, it, expect, vi } from "vitest";
import {
  stripDiacritics,
  splitWords,
  toSnakeCase,
  toKebabCase,
  debounce,
  truncate,
} from "./utils.js";

describe("stripDiacritics", () => {
  it("removes accents from Latin characters", () => {
    expect(stripDiacritics("café")).toBe("cafe");
    expect(stripDiacritics("naïve")).toBe("naive");
    expect(stripDiacritics("über")).toBe("uber");
    expect(stripDiacritics("año")).toBe("ano");
  });

  it("passes through plain ASCII unchanged", () => {
    expect(stripDiacritics("hello world")).toBe("hello world");
    expect(stripDiacritics("PROJ-123")).toBe("PROJ-123");
  });

  it("handles mixed content", () => {
    expect(stripDiacritics("PROJ-123 Créer le profil")).toBe(
      "PROJ-123 Creer le profil"
    );
  });

  it("handles empty string", () => {
    expect(stripDiacritics("")).toBe("");
  });
});

describe("splitWords", () => {
  it("splits on spaces", () => {
    expect(splitWords("hello world")).toEqual(["hello", "world"]);
  });

  it("splits on hyphens", () => {
    expect(splitWords("hello-world")).toEqual(["hello", "world"]);
  });

  it("splits on underscores", () => {
    expect(splitWords("hello_world")).toEqual(["hello", "world"]);
  });

  it("splits camelCase", () => {
    expect(splitWords("helloWorld")).toEqual(["hello", "world"]);
  });

  it("handles mixed separators", () => {
    expect(splitWords("PROJ-123 Create user_profile")).toEqual([
      "proj",
      "123",
      "create",
      "user",
      "profile",
    ]);
  });

  it("strips diacritics during split", () => {
    expect(splitWords("Créer le profil")).toEqual(["creer", "le", "profil"]);
  });

  it("filters empty segments from leading/trailing separators", () => {
    expect(splitWords("--hello--")).toEqual(["hello"]);
  });

  it("returns empty array for empty string", () => {
    expect(splitWords("")).toEqual([]);
  });
});

describe("toSnakeCase", () => {
  it("converts basic string", () => {
    expect(toSnakeCase("Hello World")).toBe("hello_world");
  });

  it("converts ticket name", () => {
    expect(toSnakeCase("PROJ-123 Create user profile")).toBe(
      "proj_123_create_user_profile"
    );
  });

  it("handles diacritics", () => {
    expect(toSnakeCase("PROJ-123 Créer le profil")).toBe(
      "proj_123_creer_le_profil"
    );
  });

  it("handles special characters", () => {
    expect(toSnakeCase("hello@world!foo")).toBe("hello_world_foo");
  });

  it("handles empty string", () => {
    expect(toSnakeCase("")).toBe("");
  });
});

describe("toKebabCase", () => {
  it("converts basic string", () => {
    expect(toKebabCase("Hello World")).toBe("hello-world");
  });

  it("converts ticket name", () => {
    expect(toKebabCase("PROJ-123 Create user profile")).toBe(
      "proj-123-create-user-profile"
    );
  });

  it("handles diacritics", () => {
    expect(toKebabCase("BUG-42 Ärger mit Übersicht")).toBe(
      "bug-42-arger-mit-ubersicht"
    );
  });

  it("handles empty string", () => {
    expect(toKebabCase("")).toBe("");
  });
});

describe("debounce", () => {
  it("calls function after delay", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("a");
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith("a");
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("resets timer on rapid calls", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced("a");
    vi.advanceTimersByTime(100);
    debounced("b");
    vi.advanceTimersByTime(100);
    debounced("c");
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");

    vi.useRealTimers();
  });
});

describe("truncate", () => {
  it("returns string unchanged when within limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates at exact limit", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates over limit", () => {
    expect(truncate("hello world", 5)).toBe("hello");
  });

  it("handles empty string", () => {
    expect(truncate("", 10)).toBe("");
  });
});
