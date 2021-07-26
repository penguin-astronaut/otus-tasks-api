import { AbstractCalendarService } from "./AbstractCalendarService";
import { JsonDBService } from "./JsonDBService";
import { LocalStoarageService } from "./LocalStorageService";

export class Calendar {
  public storage: AbstractCalendarService;

  constructor(storage: string) {
    if (storage === "local") {
      this.storage = new LocalStoarageService();
    } else {
      this.storage = new JsonDBService();
    }
  }
}
