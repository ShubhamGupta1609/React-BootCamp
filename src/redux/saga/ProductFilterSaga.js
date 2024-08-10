/*
import { all, takeEvery, put, call } from "redux-saga/effects";
import React from "react";

import {
    GENDER_FILTER,
} from "../action/types";
import {
    GenderFilterData,
} from "../action";
import axios from "axios";

function* addEditCompanyDocumentRequest(action) {
    console.log("========================>>>>>>>>>>>>>>>>>")
    let ColorBaseUrl = 'https://in-buyou.brainbees.com/buyou/index.php/commonFilters'
    let payload = {
        "keyName": "Gender",
    }
    axios.post(ColorBaseUrl, payload).then((response) => {
        if (response.status) {
             put(GenderFilterData(response.data.data));
            /!* SetGenderData(response.data.data)*!/
        }
    }).catch((err => {
        console.log(err)
    }))
}


export function* watchAddEditCompanyDocumentAPI() {
    yield takeEvery(GENDER_FILTER, addEditCompanyDocumentRequest);
}

export default function* rootSaga() {
    yield all([
        watchAddEditCompanyDocumentAPI()
    ]);
}
*/
