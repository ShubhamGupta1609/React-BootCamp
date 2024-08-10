import { combineReducers } from "redux";

import ProductFilter from "./ProductFilterReducer";
import ProductSaveFilter from "./ProductSaveData";
import TestPageReducer from "./TestPageReducer";



const appReducer = combineReducers({
    ProductFilter, ProductSaveFilter, TestPageReducer
    
});

const reducers = (state, action) => {
    return appReducer(state, action);
};

export default reducers;
