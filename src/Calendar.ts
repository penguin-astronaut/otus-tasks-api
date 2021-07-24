import { AbstractCalendarService } from "./AbstractCalendarService";
import { LocalStoarageService } from "./LocalStorageService";

export class Calendar {
  storage: AbstractCalendarService;

  constructor(storage?: string) {
    if (!storage) {
      this.storage = new LocalStoarageService();
    }
  }
}
