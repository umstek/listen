import { RxJsonSchema } from 'rxdb';
import { Static, Type } from '@sinclair/typebox';

import { convertNumericTypeV6ToV4 } from '~util/typeboxExtensions';
import { metadataProxyJsonSchema } from './metadataProxySchema';

const properties = {
  name: Type.String({ maxLength: 1023 }),
  items: Type.Array(metadataProxyJsonSchema),
  lastPlayedItem: Type.String(),
  lastPlayedPosition: convertNumericTypeV6ToV4(Type.Number()),
};

const fields = Object.keys(properties) as (keyof typeof properties)[];

const jsonSchema = Type.Object(properties, {
  title: 'playlist',
  $id: 'playlist',
  additionalProperties: false,
});

export const playlistSchema: RxJsonSchema<Static<typeof jsonSchema>> = {
  ...jsonSchema,
  version: 0,
  primaryKey: { key: 'name', fields: ['name'], separator: '' },
  required: fields,
  indexes: [],
  additionalProperties: false,
};
