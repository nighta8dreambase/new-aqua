export type UserByGenderReport = {
  total: number;
  male: number;
  female: number;
};

export type UserByNationalityReport = { title: string; value: number }[];

export type UserByAgeReport = { title: string; value: number }[];

export type LengthOfStayReport = { day: string; total: number }[];

export type GeneralReport = { x: string | number; y: string | number }[];
