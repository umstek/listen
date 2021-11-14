import { scan, share, Subject, tap } from 'rxjs';

import type { Action } from './actionTypes';
import createActions from './actions';
import initialState, { State } from './initialState';
import reducer from './reducer';
import rootEpic from './epics';

const action$ = new Subject<Action<any>>();
export const state$ = action$.pipe(
  tap((action) => {
    console.groupCollapsed('action', action.type);
    console.log(action.payload);
  }),
  scan(reducer, initialState),
  tap((state) => {
    console.log(state);
    console.groupEnd();
  }),
  share(),
);
rootEpic(action$, state$).subscribe(action$);
export const actions = createActions(action$);

// Container components -> Actions Creators -> Middleware -> Reducer -> State -> Epics (e.g.: Effect) -> Actions
