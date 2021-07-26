import { filterObj, insertObj } from "./AbstractCalendarService";

export const dummyData: insertObj[] = [
  {
    date: new Date("12.30.2021"),
    desc: "Some desc 1",
    status: "active",
  },
  {
    date: new Date("12.28.2021"),
    desc: "Some desc 2",
    status: "closed",
    tags: ["name"],
  },
  {
    date: new Date("11.27.2021"),
    desc: "Some desc 2",
    status: "closed",
    tags: ["test", "fix"],
  },
  {
    date: new Date("03.18.2020"),
    desc: "Some desc 1",
    status: "active",
    tags: ["test"],
  },
  {
    date: new Date("01.01.2010"),
    desc: "Some desc 2",
    status: "active",
  },
  {
    date: new Date("02.02.2007"),
    desc: "Some desc 3",
    status: "closed",
    tags: ["test", "fix"],
  },
];

export const dummyFilter: [filterObj, number][] = [
  [{ dateStart: new Date("12.26.2021") }, 2],
  [
    {
      dateStart: new Date("01.01.2007"),
      dateEnd: new Date("04.18.2020"),
    },
    3,
  ],
  [
    {
      dateStart: new Date("01.01.2007"),
      dateEnd: new Date("04.18.2020"),
      status: "active",
    },
    2,
  ],
  [
    {
      dateStart: new Date("01.01.2007"),
      dateEnd: new Date("04.18.2020"),
      status: "closed",
    },
    1,
  ],
  [{ text: "dEsc 1" }, 2],
  [{ text: "no" }, 0],
  [{ tags: ["test"] }, 2],
  [{ tags: ["test", "name"] }, 3],
  [{ tags: ["nope"] }, 0],
];
