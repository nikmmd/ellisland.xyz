import { format, parse } from "date-fns";

const dateRegex =
  /(January|February|March|April|May|June|July|August|September|October|November|December).*?([0-9]{4})/;
const formNumberRegex = /(?<=Form\s).*?(?=,)/;

export const parseCaseToISODateString = (body) => {
  return format(
    parse(dateRegex.exec(body)[0], "MMMM d, yyyy", new Date()),
    "yyyy-MM-dd"
  );
};

export const parseFormName = (body) => {
  return formNumberRegex.exec(body)[0];
};
