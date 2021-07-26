import { Task } from "./Task";

export interface filterObj {
  text?: string;
  dateStart?: Date;
  dateEnd?: Date;
  status?: string;
  tags?: string[];
}

export interface insertObj {
  desc: string;
  date: Date;
  status: string;
  tags?: string[];
}

export abstract class AbstractCalendarService {
  abstract get(): Promise<Task[]>;

  abstract getById(id: number): Promise<Task | false>;

  abstract update(id: number, payload: Partial<Task>): Promise<boolean>;

  abstract delete(id: number): Promise<boolean>;

  abstract insert(payload: insertObj): Promise<void>;

  abstract filter(fields: filterObj): Promise<Task[]>;

  protected filterTasks(tasks: Task[], fields: filterObj): Task[] {
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
