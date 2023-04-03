import {getJoinsString, getSelectFieldsString} from 'server/utils/db-helper';
import {TCategory} from '_types/types';
import {baseFindFirst, baseFind} from '../db';
import {TJoin, TModel} from './types';
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
  'slug',
];

const defaultCols = [
  'id',
  'parent_id',
  'name',
  'description',
  'image',
  'long_description',
  'active',
  'slug',
];

const joins: TJoin[] = [
  {
    type: 'LEFT',
    table: tableName,
    as: 'parent',
    on: `parent.id=${tableName}.parent_id`,
    fields: defaultCols!,
  },
];

const findFirst = async ({
  where,
  withJoins = [],
}: {
  where?: {slug?: string};
  withJoins?: string[];
}): Promise<any> => {
  console.log(withJoins)
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);
  const whereCond: string[] = [];

  if (where?.slug) {
    whereCond.push(`${tableName}.slug='${where.slug}'`);
  }

  let query = `select ${fields} from ${tableName} ${joinsQuery} ${
    whereCond.length > 0 ? 'WHERE ' + whereCond.join(' AND ') : ''
  } limit 1`;
  console.log(query);
  return await baseFindFirst<TCategory>({
    licenseDb: true,
    query: query,
    values: [],
  });
};

const find = async ({
  where,
  withJoins = [],
}: {
  where?: {parent_id?: number};
  withJoins?: string[];
}): Promise<TCategory[] | []> => {
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);
  let whereCond = `WHERE ${tableName}.locked=0`;
  if (where) {
    if (where?.parent_id)
      whereCond += ` AND ${tableName}.parent_id=${where?.parent_id}`;
  }
  let query = `select ${fields} from ${tableName} ${joinsQuery} ${whereCond}`;

  console.log(query);
  return await baseFind<TCategory>({
    licenseDb: true,
    query: query,
    values: [],
  });
};

const getCategoriesHierarchy = async (): Promise<TCategory[] | []> => {
  const records = await find({});
  // let hierarchyRecords: TCategory[] = [];
  return records
    .filter(item => item.parent_id === 1)
    .map(item => {
      return {
        ...item,
        ...{
          children: getChildren(item, records),
        },
      };
    });
};

const getChildren = (
  category: TCategory,
  allCategories: TCategory[]
): TCategory[] => {
  return allCategories
    .filter(item => item.parent_id === category.id)
    .map(item => {
      return {
        ...item,
        ...{
          children: getChildren(item, allCategories),
        },
      };
    });
};

const categoryModel: TModel & {
  findFirst: ({}: {
    where?: {slug?: string};
    withJoins?: string[];
  }) => Promise<any>;
  find: ({}: any) => Promise<TCategory[] | []>;
  getCategoriesHierarchy: ({}: any) => Promise<TCategory[] | []>;
} = {
  tableName,
  columns,
  findFirst,
  find,
  getCategoriesHierarchy,
};
export default categoryModel;
