import { insertObj, filterObj } from "./AbstractCalendarService";
import { Calendar } from "./Calendar";
import { Task } from "./Task";

import { dummyData, dummyFilter } from "./testData";

["local", "json"].forEach((serviceName) => {
  describe(`${serviceName} storage test`, () => {
    const taskCalendar = new Calendar(serviceName);

    it(`${serviceName} test methods`, async () => {
      dummyData.forEach(async (item: insertObj): Promise<void> => {
        await taskCalendar.storage.insert(item);
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
      dummyFilter.forEach(async (item: [filterObj, number]) => {
        expect((await taskCalendar.storage.filter(item[0])).length).toBe(
          item[1]
        );
      });
    });
  });
});
