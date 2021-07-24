import { AbstractCalendarService } from "./AbstractCalendarService";
import { JsonDBService } from "./JsonDBService";
import { LocalStoarageService } from "./LocalStorageService";
import { Task } from "./Task";

class LocalStorageMock {
  public store: {
    [key: string]: string;
  };

  constructor() {
    this.store = {};
  }

  public clear() {
    this.store = {};
  }

  public getItem(key: string) {
    return this.store[key] || null;
  }

  public setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  public removeItem(key: string) {
    delete this.store[key];
  }
}

beforeEach(() => {
  (global as any).localStorage = new LocalStorageMock();
});

[new LocalStoarageService(), new JsonDBService()].forEach((service) => {
  describe(`${service.constructor.name} test`, () => {
    it("test methods", async () => {
      service.insert({
        date: new Date("12.30.2021"),
        desc: "Some desc 1",
        status: "active",
      });
      service.insert({
        date: new Date("12.28.2021"),
        desc: "Some desc 2",
        status: "closed",
      });
      service.insert({
        date: new Date("11.27.2021"),
        desc: "Some desc 2",
        status: "closed",
      });

      const tasks = await service.get();
      expect(tasks.length).toBe(3);

      const taskThird = JSON.parse(JSON.stringify(await service.getById(3)));
      const expectedTaskThird = JSON.parse(
        JSON.stringify({
          date: new Date("11.27.2021"),
          desc: "Some desc 2",
          status: "closed",
          tags: [],
          id: 3,
        })
      );
      expect(taskThird).toEqual(expectedTaskThird);
      expect(await service.delete(3)).toBeTruthy();
      expect(await service.getById(3)).toBeFalsy();

      const taskSecond = (await service.getById(2)) as Task;
      expect(taskSecond.status).toBe("closed");
      expect(taskSecond.desc).toBe("Some desc 2");
      expect(
        await service.update(2, { status: "canceled", desc: "Change desc" })
      ).toBeTruthy();
      const taskSecondChanged = (await service.getById(2)) as Task;
      expect(taskSecondChanged.status).toBe("canceled");
      expect(taskSecondChanged.desc).toBe("Change desc");
    });

    it("test filter", async () => {
      service.insert({
        date: new Date("12.30.2021"),
        desc: "Some desc 1",
        status: "active",
      });
      service.insert({
        date: new Date("12.28.2021"),
        desc: "Some desc 2",
        status: "closed",
        tags: ["name"],
      });
      service.insert({
        date: new Date("11.27.2021"),
        desc: "Some desc 2",
        status: "closed",
        tags: ["test", "fix"],
      });
      service.insert({
        date: new Date("03.18.2020"),
        desc: "Some desc 1",
        status: "active",
        tags: ["test"],
      });
      service.insert({
        date: new Date("01.01.2010"),
        desc: "Some desc 2",
        status: "active",
      });
      service.insert({
        date: new Date("02.02.2007"),
        desc: "Some desc 3",
        status: "closed",
      });

      expect(
        (await service.filter({ dateStart: new Date("12.26.2021") })).length
      ).toBe(2);
      expect(
        (
          await service.filter({
            dateStart: new Date("01.01.2007"),
            dateEnd: new Date("04.18.2020"),
          })
        ).length
      ).toBe(3);
      expect(
        (
          await service.filter({
            dateStart: new Date("01.01.2007"),
            dateEnd: new Date("04.18.2020"),
            status: "active",
          })
        ).length
      ).toBe(2);
      expect(
        (
          await service.filter({
            dateStart: new Date("01.01.2007"),
            dateEnd: new Date("04.18.2020"),
            status: "closed",
          })
        ).length
      ).toBe(1);
      expect((await service.filter({ text: "dEsc 1" })).length).toBe(2);
      expect((await service.filter({ text: "no" })).length).toBe(0);

      expect((await service.filter({ tags: ["test"] })).length).toBe(2);
      expect((await service.filter({ tags: ["test", "name"] })).length).toBe(3);
      expect((await service.filter({ tags: ["nope"] })).length).toBe(0);
    });
  });
});
