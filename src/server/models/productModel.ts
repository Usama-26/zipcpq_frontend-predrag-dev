import {
  getJoinsString,
  getSelectFieldsString,
  makeRelationObject,
} from 'server/utils/db-helper';
import {TProduct} from '_types/types';
import {baseFindFirst, baseFind} from '../db';
import categoryModel from './categoryModel';
import productBrandModel from './productBrandModel';
import productModelModel from './productModelModel';
import productTypeModel from './productTypeModel';
import typeModel from './typeModel';
import {TJoin, TModel} from './types';
import userModel from './userModel';

const tableName = 'products';
const columns = [
  'id',
  'title',
  'short_description',
  'description',
  'status_id',
  'created_by',
  'modified_by',
  'slug',
  'availability',
  'purchasability',
  'product_brand_id',
  'product_model_id',
  'type_id',
  'product_type_id',
  'default_id',
  'created_at',
  'updated_at',
];

const defaultCols = [
  'id',
  'title',
  'category_id',
  'short_description',
  'description',
  'status_id',
  'created_by',
  'modified_by',
  'slug',
  'availability',
  'purchasability',
  'product_brand_id',
  'product_model_id',
  'type_id',
  'product_type_id',
  'created_at',
  'updated_at',
];

const joins: TJoin[] = [
  {
    type: 'LEFT',
    table: userModel.tableName,
    as: 'created',
    on: `created.id=${tableName}.created_by`,
    fields: userModel.defaultCols!,
  },
  {
    type: 'LEFT',
    table: productTypeModel.tableName,
    as: 'pt',
    on: `pt.id=${tableName}.product_type_id`,
    fields: productTypeModel.defaultCols!,
  },
  {
    type: 'LEFT',
    table: productBrandModel.tableName,
    as: 'pb',
    on: `pb.id=${tableName}.product_brand_id`,
    fields: productBrandModel.defaultCols!,
  },
  {
    type: 'LEFT',
    table: productModelModel.tableName,
    as: 'pm',
    on: `pm.id=${tableName}.product_model_id`,
    fields: productModelModel.columns,
  },
  {
    type: 'LEFT',
    table: typeModel.tableName,
    as: 'type',
    on: `type.id=${tableName}.type_id`,
    fields: typeModel.columns,
  },
];

const findFirst = async () => {
  return await baseFindFirst({
    licenseDb: true,
    query: `select * from ${tableName} where custom_form_id=?`,
    values: [1],
  });
};

const findBySlug = async (slug: string) => {
  const withJoins = ['users', 'product_types'];
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);
  let query = `select ${fields} from ${tableName} ${joinsQuery} limit 1`;
  console.log(
    await baseFindFirst<TProduct>({
      licenseDb: true,
      query: query,
      values: [slug],
    })
  );

  return await baseFindFirst<TProduct>({
    licenseDb: true,
    query: query,
    values: [slug],
  });
};

const find = async ({
  where,
  withJoins = [],
}: {
  where?: {category_ids?: number[]};
  withJoins?: string[];
}): Promise<TProduct[] | any[]> => {
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);
  let query = `select ${fields} from ${tableName} ${joinsQuery}`;

  if (where) {
    if (where.category_ids) {
      query += ` where id IN (SELECT product_id from product_categories_rel where category_id IN (${where.category_ids.join(
        ','
      )}) `;
    }
  }
  console.log(query);
  return await baseFind<TProduct[] | []>({
    licenseDb: true,
    query: query,
    values: [],
  });
};

const productModel: TModel & {
  findFirst: ({}: any) => Promise<TProduct | null>;
  findBySlug: (slug: string) => Promise<TProduct | null>;
  find: ({
    where,
    withJoins = [],
  }: {
    where?: {category_ids?: number[]};
    withJoins?: string[];
  }) => Promise<TProduct[] | []>;
} = {
  tableName,
  columns,
  findFirst,
  findBySlug,
  find,
};
export default productModel;
