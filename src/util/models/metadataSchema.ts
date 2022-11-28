import { RxJsonSchema } from 'rxdb';
import { Static, Type } from '@sinclair/typebox';

import { convertNumericTypeV6ToV4 } from '~util/typeboxExtensions';
import hash from './hash';

const properties = {
  album: Type.String({ maxLength: 255 }),
  artists: Type.Array(Type.String({ maxLength: 1023 })),
  artist: Type.String({ maxLength: 65535 }),
  duration: convertNumericTypeV6ToV4(
    Type.Number({
      multipleOf: 0.001,
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
    }),
  ),
  genres: Type.Array(Type.String({ maxLength: 255 })),
  genre: Type.String({ maxLength: 255 }),
  hash,
  lastModified: convertNumericTypeV6ToV4(
    Type.Number({
      multipleOf: 1,
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
    }),
  ),
  name: Type.String({ maxLength: 1023 }),
  path: Type.String({ maxLength: 65535 }),
  size: convertNumericTypeV6ToV4(
    Type.Integer({
      multipleOf: 1,
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
    }),
  ),
  title: Type.String({ maxLength: 1023 }),
  trackNumber: convertNumericTypeV6ToV4(
    Type.Integer({ multipleOf: 1, minimum: 0, maximum: 65535 }),
  ),
  type: Type.String({ maxLength: 255 }),
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
  indexes: fields.filter((k) => !['handle', 'artists', 'genres'].includes(k)),
  additionalProperties: false,
};
