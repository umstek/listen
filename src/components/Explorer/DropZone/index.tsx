import { addToPlaylist, newPlaylist, scan } from './icons';
import { DropBox } from './DropBox';

interface DropZoneProps {
  onDropZoneVisibilityChange: (visible: boolean) => void;
  onDragOver: React.DragEventHandler<HTMLDivElement>;
  onDragLeave: React.DragEventHandler<HTMLDivElement>;
  onDropNew: React.DragEventHandler<HTMLDivElement>;
  onDropExisting: React.DragEventHandler<HTMLDivElement>;
  onDropScan: React.DragEventHandler<HTMLDivElement>;
}

export function DropZone({
  onDragLeave: handleDragLeave,
  onDragOver: handleDragOver,
  onDropZoneVisibilityChange: setDropZoneVisible,
  onDropNew: handleDropNew,
  onDropExisting: handleDropExisting,
  onDropScan: handleDropScan,
}: DropZoneProps) {
  return (
    <div
      className="z-20 grid grid-cols-2 gap-8 p-8 absolute bg-white rounded-3xl shadow-2xl mx-auto transition-all"
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      <div
        className="absolute right-0 top-0 p-1 bg-white rounded-full"
        onClick={(ev) => setDropZoneVisible(false)}
      >
        <div className="rounded-full transition-all bg-red-100 text-red-600 hover:text-red-100 hover:bg-red-600">
          <svg
            className="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
          </svg>
        </div>
      </div>

      <DropBox
        name="new"
        icon={newPlaylist}
        description="Make a new playlist"
        onDrop={handleDropNew}
      />

      <DropBox
        name="existing"
        icon={addToPlaylist}
        description="Add to current playlist"
        onDrop={handleDropExisting}
      />

      <DropBox
        name="scan"
        icon={scan}
        description="Scan folder and make playlists automatically"
        onDrop={handleDropScan}
      />
    </div>
  );
}
