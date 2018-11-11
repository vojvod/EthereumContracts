import { combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';

import {
    dashboard,
    blockchain
} from './ducks';

const rootReducer = combineReducers({
    dashboard,
    blockchain,
    localize: localizeReducer
});

export default rootReducer