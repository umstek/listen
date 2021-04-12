import React, { useState } from 'react';

import './App.css';
import Explorer from './components/Explorer';
import Player from './components/Player';
import PlayerControls, {
  PlayStatus,
  PlayMode,
} from './components/PlayerControls';

interface IAppProps {}

function App({}: IAppProps) {
  const [audioSource, setAudioSource] = useState<string | undefined>(undefined);

  return (
    <div className="w-[640px] h-[480px]">
      <Player src={audioSource} />
      <PlayerControls
        playStatus={PlayStatus.STOPPED}
        playMode={PlayMode.IN_ORDER}
      />
      <Explorer onFileOpen={setAudioSource} />
    </div>
  );
}

export default App;
