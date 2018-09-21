import { combineReducers } from 'redux';

import {
    dashboard,
    blockchain
} from './ducks';

const rootReducer = combineReducers({
    dashboard,
    blockchain
});

export default rootReducer