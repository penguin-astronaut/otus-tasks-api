import { Calendar } from "./Calendar";
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

(global as any).localStorage = new LocalStorageMock();

["local", "json"].forEach((serviceName) => {
  describe(`${serviceName} storage test`, () => {
    const taskCalendar = new Calendar(serviceName);
    it(`${serviceName} test methods`, async () => {
      taskCalendar.storage.insert({
        date: new Date("12.30.2021"),
        desc: "Some desc 1",
        status: "active",
      });
      taskCalendar.storage.insert({
        date: new Date("12.28.2021"),
        desc: "Some desc 2",
        status: "closed",
        tags: ["name"],
      });
      taskCalendar.storage.insert({
        date: new Date("11.27.2021"),
        desc: "Some desc 2",
        status: "closed",
        tags: ["test", "fix"],
      });
      taskCalendar.storage.insert({
        date: new Date("03.18.2020"),
        desc: "Some desc 1",
        status: "active",
        tags: ["test"],
      });
      taskCalendar.storage.insert({
        date: new Date("01.01.2010"),
        desc: "Some desc 2",
        status: "active",
      });
      taskCalendar.storage.insert({
        date: new Date("02.02.2007"),
        desc: "Some desc 3",
        status: "closed",
        tags: ["test", "fix"],
      });

      const tasks = await taskCalendar.storage.get();
      expect(tasks.length).toBe(6);

      const taskThird = JSON.parse(
        JSON.stringify(await taskCalendar.storage.getById(3))
      );
      const expectedTaskThird = JSON.parse(
        JSON.stringify({
          date: new Date("11.27.2021"),
          desc: "Some desc 2",
          status: "closed",
          tags: ["test", "fix"],
          id: 3,
        })
      );
      expect(taskThird).toEqual(expectedTaskThird);
      expect(await taskCalendar.storage.delete(3)).toBeTruthy();
      expect(await taskCalendar.storage.getById(3)).toBeFalsy();

      const taskSecond = (await taskCalendar.storage.getById(2)) as Task;
      expect(taskSecond.status).toBe("closed");
      expect(taskSecond.desc).toBe("Some desc 2");
      expect(
        await taskCalendar.storage.update(2, {
          status: "canceled",
          desc: "Change desc",
        })
      ).toBeTruthy();
      const taskSecondChanged = (await taskCalendar.storage.getById(2)) as Task;
      expect(taskSecondChanged.status).toBe("canceled");
      expect(taskSecondChanged.desc).toBe("Change desc");
    });

    it(`${serviceName} test filter`, async () => {
      expect(
        (
          await taskCalendar.storage.filter({
            dateStart: new Date("12.26.2021"),
          })
        ).length
      ).toBe(2);
      expect(
        (
          await taskCalendar.storage.filter({
            dateStart: new Date("01.01.2007"),
            dateEnd: new Date("04.18.2020"),
          })
        ).length
      ).toBe(3);
      expect(
        (
          await taskCalendar.storage.filter({
            dateStart: new Date("01.01.2007"),
            dateEnd: new Date("04.18.2020"),
            status: "active",
          })
        ).length
      ).toBe(2);
      expect(
        (
          await taskCalendar.storage.filter({
            dateStart: new Date("01.01.2007"),
            dateEnd: new Date("04.18.2020"),
            status: "closed",
          })
        ).length
      ).toBe(1);
      expect(
        (await taskCalendar.storage.filter({ text: "dEsc 1" })).length
      ).toBe(2);
      expect((await taskCalendar.storage.filter({ text: "no" })).length).toBe(
        0
      );

      expect(
        (await taskCalendar.storage.filter({ tags: ["test"] })).length
      ).toBe(2);
      expect(
        (await taskCalendar.storage.filter({ tags: ["test", "name"] })).length
      ).toBe(3);
      expect(
        (await taskCalendar.storage.filter({ tags: ["nope"] })).length
      ).toBe(0);
    });
  });
});
