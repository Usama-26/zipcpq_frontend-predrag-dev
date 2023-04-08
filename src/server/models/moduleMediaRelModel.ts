import {TModuleMediaRel, TProductIdentifier, TProductIdentifierRel} from '_types/types';
import {TJoin, TModel} from './types';
import {getJoinsString, getSelectFieldsString} from 'server/utils/db-helper';
import {baseFind} from 'server/db';
import mediaModel from './mediaModel';

const tableName = 'module_media_rel';
const columns = [
  'id',
  'record_id',
  'media_id',
  'module_id',
  'table_rel',
  'created_at',
  'updated_at',
];
const defaultCols = ['id', 'record_id', 'media_id', 'module_id', 'table_rel'];
const joins: TJoin[] = [
  {
    type: 'INNER',
    table: mediaModel.tableName,
    as: 'media',
    on: `media.id=${tableName}.media_id`,
    fields: mediaModel.defaultCols!,
  },
];

const find = async ({
  where,
  withJoins = [],
}: {
  where: {record_id: number; table_rel: string};
  withJoins?: string[];
}): Promise<TModuleMediaRel[] | any[]> => {
  const fields = getSelectFieldsString(tableName, {
    cols: columns,
    joins,
    withJoins,
  });
  const joinsQuery = getJoinsString(joins, withJoins);

  let whereCond: string[] = [];
  whereCond.push(
    `${tableName}.record_id=${where.record_id}`
  );
  whereCond.push(
    `${tableName}.table_rel='${where.table_rel}'`
  );

  let query = `select ${fields} from ${tableName} ${joinsQuery} ${
    whereCond.length > 0 ? 'where ' + whereCond.join(' AND ') : ''
  }`;

  return await baseFind<TModuleMediaRel[] | []>({
    licenseDb: true,
    query: query,
    values: [],
  });
};

const moduleMediaRelModel: TModel & {
  find: ({
    where,
    withJoins = [],
  }: {
    where: {record_id: number; table_rel: string};
    withJoins?: string[];
  }) => Promise<TModuleMediaRel[] | []>;
} = {
  tableName,
  columns,
  defaultCols,
  find,
};
export default moduleMediaRelModel;
