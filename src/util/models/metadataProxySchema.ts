import { Static, Type } from '@sinclair/typebox';

import hash from './hash';

export const metadataProxyProperties = {
  path: Type.String(),
  name: Type.String(),
  title: Type.String(),
  artist: Type.String(),
  hash: hash,
  handle: Type.Any(),
};

export const metadataProxyJsonSchema = Type.Object(metadataProxyProperties, {
  title: 'playlist',
  $id: 'playlist',
  additionalProperties: false,
});

export type MetadataProxy = Static<typeof metadataProxyJsonSchema>;
