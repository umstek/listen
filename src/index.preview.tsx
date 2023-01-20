import React from 'react';
import ReactDOM from 'react-dom';

import MiniPlayerPreview from './components/Player/MiniPlayer.preview';

import './index.preview.css';
import checkboard from './checkboard.svg';

const BreakpointsWidget = () => {
  return (
    <div className="fixed top-0 m-1 p-1 rounded bg-black dark:bg-white text-xs text-white dark:text-black shadow-md">
      <div className="block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
        SMALL
      </div>
      <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
        MEDIUM
      </div>
      <div className="hidden sm:hidden md:block lg:hidden xl:hidden 2xl:hidden">
        LARGE
      </div>
      <div className="hidden sm:hidden md:hidden lg:block xl:hidden 2xl:hidden">
        X-LARGE
      </div>
      <div className="hidden sm:hidden md:hidden lg:hidden xl:block 2xl:hidden">
        2X-LARGE
      </div>
      <div className="hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:block">
        NX-LARGE
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <div
      style={{
        backgroundImage: `url(${checkboard})`,
        backgroundSize: '3em 3em',
      }}
      className="bg-repeat"
    >
      <div className="h-screen w-full"></div>
      <MiniPlayerPreview />
    </div>
    <BreakpointsWidget />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
