import {
  getJoinsString,
  getSelectFieldsString,
  makeRelationObject,
} from 'server/utils/db-helper';
import {TProduct, TProductIdentifier} from '_types/types';
import {baseFindFirst, baseFind} from '../db';
import categoryModel from './categoryModel';
import productBrandModel from './productBrandModel';
import productModelModel from './productModelModel';
import productTypeModel from './productTypeModel';
import typeModel from './typeModel';
import {TJoin, TModel} from './types';
import userModel from './userModel';
import productIdentifierModel from './productIdentifierModel';
import productIdentifierRelModel from './productIdentifierRelModel';
import moduleMediaRelModel from './moduleMediaRelModel';
import productRelatedModel from './productRelatedModel';

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
  'short_description',
  'description',
  'status_id',
  'slug',
  'availability',
  'purchasability',
  'product_brand_id',
  'product_model_id',
  'type_id',
  'product_type_id',
  'default_id',
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

const findFirst = async ({
  where,
  withJoins = [],
}: {
  where: {id: number} | {slug: string};
  withJoins?: string[];
}) => {
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);
  const whereCond: string[] = [];

  if ('id' in where) {
    whereCond.push(`${tableName}.id='${where.id}'`);
  } else if ('slug' in where) {
    whereCond.push(`${tableName}.slug='${where.slug}'`);
  }

  const query = `select ${fields} from ${tableName} ${joinsQuery} ${
    whereCond.length > 0 ? 'WHERE ' + whereCond.join(' AND ') : ''
  } limit 1`;
  console.log(query);
  const result = await baseFindFirst<TProduct>({
    licenseDb: true,
    query: query,
    values: [],
  });
  if (result) {
    if (withJoins.includes('product_identifiers')) {
      result['product_identifiers'] = await getProductIdentifiers(result);
    }
    if (withJoins.includes('product_medias')) {
      result['product_medias'] = await getMedias(result);
    }
    if (withJoins.includes('related_products')) {
      result['related_products'] = await find({
        where: {from_related_product: result.id},
      });
    }
  }

  return result;
};

const find = async ({
  where,
  withJoins = [],
}: {
  where?: {
    category_ids?: number[];
    category_slugs?: string[];
    from_related_product?: number;
  };
  withJoins?: string[];
}): Promise<TProduct[]> => {
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);
  const whereCond: string[] = where ? applyWhere(where) : [];

  const query = `select ${fields} from ${tableName} ${joinsQuery} ${
    whereCond.length > 0 ? 'where ' + whereCond.join(' AND ') : ''
  }`;

  const rows = await baseFind<TProduct[] | []>({
    licenseDb: true,
    query: query,
    values: [],
  });

  return await Promise.all(
    rows.map(async row => {
      if (withJoins.includes('product_identifiers')) {
        row['product_identifiers'] = await getProductIdentifiers(row);
      }
      if (withJoins.includes('product_medias')) {
        row['product_medias'] = await getMedias(row);
      }
      if (withJoins.includes('related_products')) {
        row['related_products'] = await find({
          where: {from_related_product: row.id},
        });
      }

      return row;
    })
  );
};

const productModel: TModel & {
  findFirst: ({
    where,
    withJoins = [],
  }: {
    where: {id: number} | {slug: string};
    withJoins?: string[];
  }) => Promise<TProduct | null>;
  find: ({
    where,
    withJoins = [],
  }: {
    where?: {
      category_ids?: number[];
      category_slugs?: string[];
      from_related_product?: number;
    };
    withJoins?: string[];
  }) => Promise<TProduct[] | []>;
} = {
  tableName,
  columns,
  defaultCols,
  findFirst,
  find,
};
export default productModel;

const applyWhere = (where: {
  category_ids?: number[];
  category_slugs?: string[];
  from_related_product?: number;
}) => {
  const whereCond: string[] = [];
  if (where.category_ids) {
    whereCond.push(
      `${tableName}.id IN (SELECT product_id from product_categories_rel where category_id IN (${where.category_ids.join(
        ','
      )})) `
    );
  }
  if (where.category_slugs) {
    whereCond.push(
      `${tableName}.id IN (SELECT product_id from product_categories_rel where category_id IN (SELECT id from categories where slug IN ('${where.category_slugs.join(
        "','"
      )}'))) `
    );
  }
  if (where.from_related_product) {
    whereCond.push(
      `${tableName}.id IN (SELECT rel_product_id from product_related where product_id = ${where.from_related_product})`
    );
  }
  return whereCond;
};

const getProductIdentifiers = async (product: TProduct) =>
  await productIdentifierRelModel.find({
    where: {product_ids: [product.id]},
    withJoins: ['pi'],
  });

const getMedias = async (product: TProduct) =>
  await moduleMediaRelModel.find({
    where: {record_id: product.id, table_rel: tableName},
    withJoins: ['media'],
  });
