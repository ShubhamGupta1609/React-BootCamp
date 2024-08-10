import {
    GENDER_FILTER,
    APPLIED_GENDER_FILTER,
    APPLIED_BRAND_FILTER,
    APPLIED_FADMONTH_FILTER,
    APPLIED_FADYEAR_FILTER,
    APPLIED_COLOR_FILTER, 
    APPLIED_PERFORMANNCE_BUCKET_FILTER,
    SAVED_LIKED_STYLE
} from './types/index'

export const GenderFilterData = (payload) => ({
    type: GENDER_FILTER,
    payload,
});
export const AppliedGenderFilter = (payload) => ({
    type: APPLIED_GENDER_FILTER,
    payload,
});
export const AppliedColorFilter = (payload) => ({
    type: APPLIED_COLOR_FILTER,
    payload,
});
export const AppliedBrandFilter = (payload) => ({
    type: APPLIED_BRAND_FILTER,
    payload,
});
export const AppliedFadMonthFilter = (payload) => ({
    type: APPLIED_FADMONTH_FILTER,
    payload,
});
export const AppliedFadYearFilter = (payload) => ({
    type: APPLIED_FADYEAR_FILTER,
    payload,
});
export const AppliedPerformanceBucketFilter = (payload) => ({
    type: APPLIED_PERFORMANNCE_BUCKET_FILTER,
    payload,
});
export const SavedLikedStyle = (payload) => ({
    type: SAVED_LIKED_STYLE,
    payload,
});