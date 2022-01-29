import React from 'react';

import MiniPlayer, { TimeViewerMode } from './MiniPlayer';

const MiniPlayerPreview = () => {
  return (
    <MiniPlayer
      trackType="music"
      position={12 * 60 + 34}
      duration={56 * 60 + 18}
      timeMode={TimeViewerMode.ELAPSED_COMPARISON}
    />
  );
};

export default MiniPlayerPreview;
