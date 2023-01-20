import { filter, scan, share, Subject, tap } from 'rxjs';

import type { Action } from './actionTypes';
import createActions from './actions';
import initialState from './initialState';
import reducer from './reducer';
import rootMiddleware from './middleware';
import rootEpic from './epics';

const action$ = new Subject<Action<any>>();
export const state$ = action$.pipe(
  rootMiddleware,
  filter(Boolean),
  tap((action) => {
    console.log(
      '%c %s',
      'background: steelblue; color: black; font-weight: bold;',
      `${action.type} `,
      action.payload,
    );
  }),
  scan(reducer, initialState),
  tap((state) => {
    console.dir(state);
  }),
  share(),
);
rootEpic(action$.pipe(filter(Boolean)), state$).subscribe(action$);
export const actions = createActions(action$);

// Container components -> Actions Creators -> Middleware -> Reducer -> State -> Epics (e.g.: Effect) -> Actions
