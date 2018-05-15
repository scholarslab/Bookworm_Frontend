import { LOAD_OPTIONS } from './BookwormActions';

const bookwormReducer = (state = {
    options: {}
}, action) => {
    switch (action.type) {
        case LOAD_OPTIONS:
            return {
                ...state,
                options: action.options
            };
        default:
            return state;
    }
};
export default bookwormReducer;
