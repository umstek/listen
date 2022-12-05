import { Static, Type } from '@sinclair/typebox';

import hash from './hash';

export const metadataProxyProperties = {
  path: Type.String({ maxLength: 65535 }),
  name: Type.String({ maxLength: 1023 }),
  title: Type.String({ maxLength: 1023 }),
  artist: Type.String({ maxLength: 1023 }),
  hash,
  handle: Type.Any(),
};

export const metadataProxyJsonSchema = Type.Object(metadataProxyProperties, {
  title: 'playlist',
  $id: 'playlist',
  additionalProperties: false,
});

export type MetadataProxy = Static<typeof metadataProxyJsonSchema>;
