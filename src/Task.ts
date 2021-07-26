export class Task {
  public id: number;

  public desc: string;

  public date: Date;

  public status: string;

  public tags?: string[];

  constructor(task: Task) {
    this.id = task.id;
    this.desc = task.desc;
    this.status = task.status;
    this.tags = task.tags ?? [];

    if (task.date.toString() === "Invalid Date") {
      throw new Error("Incorrect date value");
    }

    this.date = task.date;
  }
}
