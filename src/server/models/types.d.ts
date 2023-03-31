export type TModel = {
  tableName: string;
  columns: string[];
  defaultCols?: string[];
};

export type TJoin = {
  type: string;
  table: string;
  as: string;
  on: string;
  fields: string[];
};
