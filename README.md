# Listen

An online player for your offline music and audio-books

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fumstek%2Flisten.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fumstek%2Flisten?ref=badge_shield)

## About

This is an experimental project to build a simple web based audio player with first-class support for audio books.
When complete, ths should be able to:

- [x] Play all audio files supported by the browser
- [ ] Support/UI for all platforms including mobile
- [ ] Work offline (PWA)
- [ ] Display music metadata
  - [ ] Album art
  - [ ] Lyrics
  - [ ] Other details
- [ ] Sort files semantically
- [ ] Keep a log of files played with start, end times of both the file and the clock so that audio-books can be resumed from anywhere quickly even if the user had fallen asleep in the middle of the book. (This happens to me quite a lot.)
- [x] Save playlists (collections)
- [ ] Basic player functions:
  - [x] Play
  - [x] Pause
  - [x] Resume
  - [x] Stop
  - [x] Play Next File
  - [x] Play Previous File
  - [x] Fast Rewind
  - [x] Fast Forward
  - [ ] Speed Control
  - [ ] Pitch Control
  - [ ] Repeat current song once/forever
  - [ ] Repeat playlist
  - [ ] Shuffle playlist (+altered by repeat option)
  - [ ] Change volume
- [x] Auto-scan folders to create playlists
- [ ] Equalizer and effects

## Setting-up

1. Clone the project and switch to directory
2. Setup `pnpm` globally if not already installed: `npm i -g pnpm`
3. Run `pnpm install`
4. Run `pnpm start`

## Differences from a traditional React project

Some of the tools and design decisions might be different from what you are familiar when working with React. These might be replaced/abandoned in the future depending on how they will match the requirements.

1. Unbundled development: Snowpack is used instead of webpack/parcel and the output is not a single bundled JavaScript file like we used to see.
2. Using PNPM instead of NPM/Yarn.
3. No state management libraries such as Redux/Mobx/XState/...; RxJS is used to create a redux + redux-observable/saga like environment.
4. Using TailwindCSS: trying to minimize CSS use and completely avoiding CSS-in-JS. Utility class names are used and when necessary, class names are combined to make a new selector/class name in a PostCSS file. These class names are used semantically like how interfaces are used in OOP.
5. `components` are organized in a tree based on where they are used. The logic required for each component is stored with the component semantically unless they impact the global state. New components are created to avoid deep prop-drilling, to avoid tree going too deep and when new features are introduced. Logic for cross-cutting concerns are in the `util` folder. `reducer` and `middleware` handle most of the top level application logic and need refactoring. Only `App` has direct access to global state, so there is no presentational vs. container component separation.

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fumstek%2Flisten.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fumstek%2Flisten?ref=badge_large)
