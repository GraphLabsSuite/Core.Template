import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer, { RootState } from './rootReducer';
import { init } from 'graphlabs.core.notifier';
import hostconfigJson from '../../hostconfig.json';

init({
  protocol: hostconfigJson.protocol,
  host: hostconfigJson.host,
  port: hostconfigJson.port,
  path: hostconfigJson.path
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
