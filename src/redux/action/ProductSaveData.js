import {APPLIED_PARENT_JSON, TEST_PAGE_ACTION} from "./types";

export const AppliedParentJson= (payload) => ({
    type: APPLIED_PARENT_JSON,
    payload,
});

export const TestPageAction = (payload) =>({
    type: TEST_PAGE_ACTION,
    payload
})