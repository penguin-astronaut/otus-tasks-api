import { ICalendarService } from "./ICalendarService";
import { LocalStoarageService } from "./LocalStorageService";

export class Calendar {
  storage: ICalendarService;

  constructor(storage?: string) {
    if (!storage) {
      this.storage = new LocalStoarageService();
    }
  }
}
