import { RxJsonSchema } from 'rxdb';
import { Static, Type } from '@sinclair/typebox';

import { convertNumericTypeV6ToV4 } from '~util/typeboxExtensions';
import { metadataProxyProperties } from './metadataProxySchema';

const properties = {
  ...metadataProxyProperties,
  position: convertNumericTypeV6ToV4(Type.Number()),
  time: convertNumericTypeV6ToV4(Type.Number()),
  finished: Type.Boolean(),
};

const fields = Object.keys(properties) as (keyof typeof properties)[];

const jsonSchema = Type.Object(properties, {
  title: 'history',
  $id: 'history',
  additionalProperties: false,
});

export type HistoryRecord = Static<typeof jsonSchema>;

export const historyRecordSchema: RxJsonSchema<HistoryRecord> = {
  ...jsonSchema,
  version: 0,
  primaryKey: { key: 'time', fields: [], separator: '' },
  required: fields,
  indexes: fields.filter((k) => k !== 'handle'),
  additionalProperties: false,
};
