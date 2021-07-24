import { filterObj, ICalendarService } from "./ICalendarService";
import { Task } from "./Task";

export class LocalStoarageService implements ICalendarService {
  constructor() {
    if (localStorage.getItem("tasks") === null) {
      localStorage.setItem("tasks", "[]");
    }
  }

  async get(): Promise<Task[]> {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks"));
    return tasks.map((item) => new Task(item));
  }

  async getById(id: number): Promise<Task | false> {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find((item) => item.id === id);
    if (!task) {
      return false;
    }

    return new Task(task);
  }

  async update(id: number, payload: Partial<Task>): Promise<boolean> {
    const tasks: Partial<Task>[] = JSON.parse(localStorage.getItem("tasks"));
    const taskIndex = tasks.findIndex((item) => item.id === id);
    if (!taskIndex) {
      return false;
    }
    tasks[taskIndex] = { ...tasks[taskIndex], ...payload };
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks"));
    const taskIndex = tasks.findIndex((item) => item.id === id);
    if (!taskIndex) {
      return false;
    }
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return true;
  }

  async insert(payload: Task): Promise<void> {
    const tasks: Partial<Task>[] = JSON.parse(localStorage.getItem("tasks"));
    const lastId = tasks[tasks.length - 1] ? tasks[tasks.length - 1].id : 0;
    payload.id = lastId + 1;
    tasks.push(new Task(payload));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  async filter(fields: filterObj): Promise<Task[]> {
    const tasks: Task[] = JSON.parse(localStorage.getItem("tasks"));
    const { dateEnd, dateStart, text, status, tags } = fields;
    const filtered: Task[] = [];

    tasks.forEach((item): void => {
      if (dateEnd && new Date(item.date).getTime() >= dateEnd.getTime()) {
        return;
      }
      if (dateStart && new Date(item.date).getTime() <= dateStart.getTime()) {
        return;
      }
      if (text && !item.desc.toLowerCase().includes(text.toLowerCase())) {
        return;
      }
      if (text && !item.desc.toLowerCase().includes(text.toLowerCase())) {
        return;
      }
      if (status && item.status.toLowerCase() !== status) {
        return;
      }
      if (tags && !item.tags.some((tag) => tags.includes(tag))) {
        return;
      }

      filtered.push(new Task(item));
    });

    return filtered;
  }
}
