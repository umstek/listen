import { Static, Type } from '@sinclair/typebox';

import { convertNumericTypeV6ToV4 } from '~util/typeboxExtensions';
import hash from './hash';

export const metadataProxyProperties = {
  name: Type.String({ maxLength: 1023 }),
  title: Type.String({ maxLength: 1023 }),
  artist: Type.String({ maxLength: 1023 }),
  duration: convertNumericTypeV6ToV4(
    Type.Number({
      multipleOf: 0.001,
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
    }),
  ),
  path: Type.String({ maxLength: 65535 }),
  hash,
  handle: Type.Any(),
};

export const metadataProxyJsonSchema = Type.Object(metadataProxyProperties, {
  title: 'playlist',
  $id: 'playlist',
  additionalProperties: false,
});

export type MetadataProxy = Static<typeof metadataProxyJsonSchema>;
