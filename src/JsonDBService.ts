import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { filterObj, AbstractCalendarService } from "./AbstractCalendarService";
import { Task } from "./Task";

export class JsonDBService extends AbstractCalendarService {
  public db: JsonDB;

  constructor() {
    super();
    this.db = new JsonDB(new Config("myDataBase", true, false, "/"));
    this.db.push("/db", { tasks: [], increment: 0 });
  }

  async get(): Promise<Task[]> {
    return this.db.getData("/db/tasks");
  }

  async getById(id: number): Promise<false | Task> {
    const tasks: Task[] = this.db.getData("/db/tasks");
    const task = tasks.find((item) => item.id === id);
    if (!task) {
      return false;
    }

    return new Task(task);
  }

  async update(id: number, payload: Partial<Task>): Promise<boolean> {
    const tasks: Partial<Task>[] = this.db.getData("/db/tasks");
    const taskIndex = tasks.findIndex((item) => item.id === id);
    if (!taskIndex) {
      return false;
    }
    this.db.push(
      `/db/tasks[${taskIndex}]`,
      { ...tasks[taskIndex], ...payload },
      true
    );
    return true;
  }

  async delete(id: number): Promise<boolean> {
    const tasks: Task[] = this.db.getData("/db/tasks");
    const taskIndex = tasks.findIndex((item) => item.id === id);
    if (!taskIndex) {
      return false;
    }
    this.db.delete(`/db/tasks[${taskIndex}]`);
    return true;
  }

  async insert(payload: Task): Promise<void> {
    const index = this.db.getData("/db/increment") + 1;
    payload.id = index;
    this.db.push("/db/tasks[]", new Task(payload));
    this.db.push("/db/increment", index);
  }

  async filter(fields: filterObj): Promise<Task[]> {
    const tasks: Task[] = this.db.getData("/db/tasks");
    return this.filterTasks(tasks, fields);
  }
}
