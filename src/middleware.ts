// TODO Middleware such as debouncing the player log.
// These consume actions and produce actions.
// Middleware are executed before the reducer and have no access to the state.
// They are executed in the order they are defined.

import type { Observable } from 'rxjs';

import type { Action } from './actionTypes';

export default ($action: Observable<Action<any>>): Observable<Action<any>> => {
  return $action;
};
