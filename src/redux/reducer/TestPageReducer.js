import {TEST_PAGE_ACTION} from '../action/types'

const TestPageState = {
    name : 'Defaut',
    phone: '728837283'
}

export default (state = TestPageState, action) => {
    console.log("Check Action Reducer", action)
    switch(action.type) {
        case TEST_PAGE_ACTION:
            return { ...state, data: action.payload };
        default:
            return state;
    }
}
