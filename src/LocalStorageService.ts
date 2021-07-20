import { ICalendarService } from "./ICalendarService";
import { Task } from "./Task";

export class LocalStoarageService implements ICalendarService {
  сonstructor(): void {
    if (localStorage.getItem("tasks") === null) {
      localStorage.setItem("tasks", "[]");
    }
  }

  async get(): Promise<Task[]> {
    const tasks: Partial<Task>[] = JSON.parse(localStorage.getItem("tasks"));
    return tasks.map((item) => new Task(item));
  }

  async getById(id: number): Promise<Task | false> {
    const tasks: Partial<Task>[] = JSON.parse(localStorage.getItem("tasks"));
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
    const tasks: Partial<Task>[] = JSON.parse(localStorage.getItem("tasks"));
    const taskIndex = tasks.findIndex((item) => item.id === id);
    if (!taskIndex) {
      return false;
    }
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return true;
  }

  async insert(payload: Partial<Task>): Promise<void> {
    const tasks: Partial<Task>[] = JSON.parse(localStorage.getItem("tasks"));
    const lastId = tasks[tasks.length - 1] ? tasks[tasks.length - 1].id : 0;
    payload.id = lastId + 1;
    tasks.push(new Task(payload));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  async filter(fields: Partial<Task>): Promise<Task[]> {
    const tasks: Partial<Task>[] = JSON.parse(localStorage.getItem("tasks"));
    return tasks.map((item) => new Task(item));
  }
}
