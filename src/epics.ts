import { EMPTY, merge, mergeMap, Observable, withLatestFrom } from 'rxjs';

import type { Action } from './actionTypes';
import type { State } from './initialState';
import effectsMap from './effects';

const effectsEpic = (
  action$: Observable<Action<any>>,
  state$: Observable<State>,
): Observable<Action<any>> =>
  action$.pipe(
    withLatestFrom(state$),
    mergeMap(
      ([{ type, payload }, state]) =>
        effectsMap[type]?.(state, payload) || EMPTY,
    ),
  );

export default (
  action$: Observable<Action<any>>,
  state$: Observable<State>,
): Observable<Action<any>> =>
  merge(
    effectsEpic(action$, state$),
    // TODO: Add other epics here
  );
