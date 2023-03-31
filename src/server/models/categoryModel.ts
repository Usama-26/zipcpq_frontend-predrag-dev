import {getJoinsString, getSelectFieldsString} from 'server/utils/db-helper';
import {TCategory} from '_types/types';
import {baseFindFirst, baseFind} from '../db';
import {TModel} from './types';
const tableName = 'categories';
const columns = [
  'id',
  'parent_id',
  'lft',
  'rgt',
  'depth',
  'name',
  'description',
  'image',
  'long_description',
  'active',
  'locked',
  'created_at',
  'updated_at',
];
const joins: any[] = [];

const findFirst = async (where: string): Promise<any> => {
  return await baseFindFirst({
    licenseDb: true,
    query: `select * from custom_forms where ${where}`,
    values: [],
  });
};

const find = async ({
  where,
  withJoins = [],
}: {
  where?: {};
  withJoins?: string[];
}): Promise<TCategory[] | []> => {
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);
  let query = `select ${fields} from ${tableName} ${joinsQuery}`;

  if (where) {
  }
  
  console.log(query);
  return await baseFind<TCategory>({
    licenseDb: true,
    query: query,
    values: [],
  });
};

const categoryModel: TModel & {
  findFirst: ({}: any) => Promise<any>;
  find: ({}: any) => Promise<TCategory[] | []>;
} = {
  tableName,
  columns,
  findFirst,
  find,
};
export default categoryModel;
