import { Task } from "./Task";

export interface ICalendarService {
  get(): Promise<Task[]>;
  getById(id: number): Promise<Task | false>;
  update(id: number, payload: Partial<Task>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  insert(payload: Partial<Task>): Promise<void>;
  filter(fields: Partial<Task>): Promise<Task[]>;
}
