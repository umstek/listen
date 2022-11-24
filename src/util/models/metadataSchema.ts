import { RxJsonSchema } from 'rxdb';
import { Static, Type } from '@sinclair/typebox';

import { convertNumericTypeV6ToV4 } from '~util/typeboxExtensions';
import hash from './hash';

const properties = {
  album: Type.String(),
  artists: Type.Array(Type.String()),
  duration: convertNumericTypeV6ToV4(Type.Number()),
  genre: Type.Array(Type.String()),
  hash,
  lastModified: convertNumericTypeV6ToV4(Type.Number()),
  name: Type.String(),
  path: Type.String(),
  size: convertNumericTypeV6ToV4(Type.Integer()),
  title: Type.String(),
  trackNumber: convertNumericTypeV6ToV4(Type.Integer()),
  type: Type.String(),
  handle: Type.Any(),
};

const fields = Object.keys(properties) as (keyof typeof properties)[];

const jsonSchema = Type.Object(properties, {
  title: 'metadata',
  $id: 'metadata',
});

export const metadataSchema: RxJsonSchema<Static<typeof jsonSchema>> = {
  ...jsonSchema,
  version: 0,
  primaryKey: { key: 'hash', fields: [], separator: '' },
  required: fields,
  indexes: fields.filter((k) => k !== 'handle'),
  additionalProperties: false,
};
