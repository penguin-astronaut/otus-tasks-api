export class Task {
  private _id: number;

  private _desc: string;

  private _date: string;

  private _status: string;

  private _tags: string[];

  constructor(task: Partial<Task>) {
    this._id = task.id;
    this.desc = task.desc;
    this.date = task.date;
    this.status = task.status;
    this.tags = task.tags ?? [];
  }

  public get id(): number {
    return this._id;
  }

  protected set id(id: number) {
    this._id = id;
  }

  public get desc(): string {
    return this._desc;
  }

  public set desc(value: string) {
    this._desc = value;
  }

  public get date(): string {
    return this._date;
  }

  public set date(value: string) {
    const date: Date = new Date(value);
    if (date.toString() === "Invalid Date") {
      throw new Error("Incorrect date value");
    }
    this._date = date.toString();
  }

  public get status(): string {
    return this._status;
  }

  public set status(value: string) {
    this._status = value;
  }

  public get tags(): string[] {
    return this._tags;
  }

  public set tags(value: string[]) {
    this._tags = value;
  }
}
