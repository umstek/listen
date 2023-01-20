import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  HamburgerMenuIcon,
  // DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';

import './styles.css';

export const Menu = () => {
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  // const [urlsChecked, setUrlsChecked] = React.useState(false);
  // const [person, setPerson] = React.useState('pedro');

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="IconButton" aria-label="Customise options">
          <HamburgerMenuIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
          <DropdownMenu.Item className="DropdownMenuItem font-semibold">
            Play Now <div className="RightSlot">⌘+P</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem">
            Play Next <div className="RightSlot">⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="DropdownMenuItem" disabled>
            Add to Queue <div className="RightSlot">⇧+⌘+N</div>
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
              Add to Playlist
              <div className="RightSlot">
                <ChevronRightIcon />
              </div>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="DropdownMenuSubContent"
                sideOffset={2}
                alignOffset={-5}
              >
                <DropdownMenu.Item className="DropdownMenuItem">
                  Current <div className="RightSlot">⌘+T</div>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem">
                  Playlist 1
                </DropdownMenu.Item>
                <DropdownMenu.Item className="DropdownMenuItem">
                  Playlist 2
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="DropdownMenuSeparator" />
                <DropdownMenu.Item className="DropdownMenuItem">
                  New Playlist...
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="DropdownMenuSeparator" />

          <DropdownMenu.CheckboxItem
            className="DropdownMenuCheckboxItem"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Hide <div className="RightSlot">⌘+B</div>
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className="DropdownMenuSeparator" />

          <DropdownMenu.Label className="DropdownMenuLabel">
            Advanced
          </DropdownMenu.Label>
          <DropdownMenu.Item className="DropdownMenuItem">
            Tags <div className="RightSlot">⌘+T</div>
          </DropdownMenu.Item>
          {/* <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
            <DropdownMenu.RadioItem
              className="DropdownMenuRadioItem"
              value="pedro"
            >
              <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                <DotFilledIcon />
              </DropdownMenu.ItemIndicator>
              Pedro Duarte
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem
              className="DropdownMenuRadioItem"
              value="colm"
            >
              <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                <DotFilledIcon />
              </DropdownMenu.ItemIndicator>
              Colm Tuite
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup> */}

          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
