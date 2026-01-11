export type Contact = {
  id: string;
  type: string;
  value: string;
  label: string | null;
};

export type Schedule = {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  note: string | null;
};

export type Building = {
  id: string;
  number: number | null;
};
