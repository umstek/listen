import { MetadataProxy } from '~models/metadataProxySchema';
import { Item } from './Item';
import { Menu } from './Menu';

export interface PlaylistProps {
  items: (MetadataProxy & { playing: boolean; albumArt: string })[];
}

export function Playlist({ items }: PlaylistProps) {
  return (
    <div>
      {items.map((i) => (
        <Item key={i.hash} {...i}>
          <Menu />
        </Item>
      ))}
    </div>
  );
}
