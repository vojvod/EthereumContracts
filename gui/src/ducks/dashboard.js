const SET_NOTIFICATION = 'map/SET_NOTIFICATION';

// Reducers
const initialState = {
    notification: null
};

export default (state=initialState, action) => {
    switch (action.type) {

        case SET_NOTIFICATION:
            return {
                ...state,
                notification: action.notification.notification
            };

        default:
            return state;
    }
}

export const setNotificationInstance = (notification) => (dispatch) => {
    dispatch({
        type: SET_NOTIFICATION,
        notification
    });
};