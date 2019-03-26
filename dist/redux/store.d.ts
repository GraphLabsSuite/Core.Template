import { Store } from 'redux';
import { RootState } from './rootReducer';
export declare function configureStore(initialState?: RootState): Store<RootState>;
export declare const store: Store;