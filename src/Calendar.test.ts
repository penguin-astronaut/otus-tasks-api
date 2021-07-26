import { Calendar } from "./Calendar";
import { JsonDBService } from "./JsonDBService";
import { LocalStoarageService } from "./LocalStorageService";

describe("test Calendar init", () => {
  it("should be ok", () => {
    const lsCalendar = new Calendar("local");
    const jsonCalendar = new Calendar("json");

    expect(lsCalendar.storage instanceof LocalStoarageService).toBeTruthy();
    expect(jsonCalendar.storage instanceof JsonDBService).toBeTruthy();
  });

  it("should be error", () => {
    expect(() => new Calendar("oops")).toThrow("Unsupported storage");
  });
});
