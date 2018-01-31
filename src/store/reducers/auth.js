import * as actionfTypes from '../actions/actionTypes';
import { updateObject } from "../utility";

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
};

const authStart = (state, action) => {
    return updateObject(state, {error: null, loading: true});
};

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,
        userId: action.userId,
        error: null,
        loading: false
    });
};

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionfTypes.AUTH_START: return authStart(state, action);
        case actionfTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionfTypes.AUTH_FAIL: return authFail(state, action);
        default:
            return state;
    }
};

export default reducer;