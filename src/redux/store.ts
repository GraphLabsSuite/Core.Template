import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { RootState } from './rootReducer';
import { init } from 'graphlabs.core.notifier';

// '!': https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
// http://gl-backend.svtz.ru:5000 is default server URL (mostly useful while development)
let serverProtocol: string = 'REACT_APP_SERVER_PROTOCOL' in process.env ? process.env.REACT_APP_SERVER_PROTOCOL! : 'http';
let serverHost: string = 'REACT_APP_SERVER_HOST' in process.env ? process.env.REACT_APP_SERVER_HOST! : 'gl-backend.svtz.ru';
let serverPort: number = 'REACT_APP_SERVER_PORT' in process.env ? parseInt(process.env.REACT_APP_SERVER_PORT!) : 5000;

init({
  protocol: serverProtocol,
  host: serverHost,
  port: serverPort,
  path: 'odata/taskVariantLogs'
});

export function configureStore(initialState?: RootState): Store<RootState> {
  const middlewares: Middleware[] = [
    thunk,
  ];
  const storeObject: Store<RootState> = createStore(rootReducer, initialState, composeWithDevTools(
    applyMiddleware(...middlewares),
  ));
  if ((module as any).hot) {
    // Enable Webpack hot module replacement for reducers
      (module as any).hot.accept(['./graph'], () => {
      store.replaceReducer(rootReducer);
    });
  }
  return storeObject;
}

export const store: Store<RootState> = configureStore();
