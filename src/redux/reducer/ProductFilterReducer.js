import {
    GENDER_FILTER,
    APPLIED_GENDER_FILTER,
    APPLIED_BRAND_FILTER,
    APPLIED_FADMONTH_FILTER,
    APPLIED_FADYEAR_FILTER,
    APPLIED_COLOR_FILTER,
    APPLIED_PARENT_JSON,
    APPLIED_PERFORMANNCE_BUCKET_FILTER, SAVED_LIKED_STYLE
} from '../action/types'

const INIT_STATE = [];
const PARENT_INIT_STATE = {
    data: {
        CategoryID: [],
        SubCategoryID: [],
        Gender: [],
        ProductType: [],
        BrandType: [],
        BrandID: [],

        Color: [],
        SiteColorID: [],

        FADMonth: [],
        FADYear: [],
        InwardYear: [],
        InwardMonth: [],
        LiveStyle: [],
        CondiFinalSourcing1: [],
        CondiFinalSourcing2: [],
        StockType: [],
        Vendors: [],

        /*Price Range Keys Filters*/
        Ageing: [],
        MRP: [],
        SellingPrice: [],
        Replainshment: [],
        B2BMixPercent: [],
        _30daysRPT: [],
        _30DaysST: [],
        _90daysRPT: [],
        _90DaysST: [],
        topbottom: [],
        IndMargin: [],
        Discount: [],
        NGM: [],
        StockCover: [],
        SRPercent: [],
        TotalIntakeBucket: [],
        AgeFrom: [],
        TotalB2CSoldQty: [],
        CTR: [],

        /*Dynamic Values Array*/
        Potypes: [],
        PoAttributes: [],
        /*Dynamic Values Array*/
        sort: 'TotalRPT',
        order: 'DESC',
        page: 1,
        pagesize: 100
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GENDER_FILTER:
            return { ...state, GenderFilters: action.payload.data };
        case APPLIED_GENDER_FILTER:
            return { ...state, AppliedGenderFilter: action.payload.data !== null ? action.payload.data : null };
        case APPLIED_COLOR_FILTER:
            return { ...state, AppliedColorFilter: action.payload.data !== null ? action.payload.data : null };
        case APPLIED_BRAND_FILTER:
            return { ...state, AppliedBrandFilter:  action.payload.data !== null ? action.payload.data : null };
        case APPLIED_FADMONTH_FILTER:
            return { ...state, AppliedFadMonthFilter:  action.payload.data !== null ? action.payload.data : null };
        case APPLIED_FADYEAR_FILTER:
            return { ...state, AppliedFadYearFilter:  action.payload.data !== null ? action.payload.data : null};
        case APPLIED_PERFORMANNCE_BUCKET_FILTER:
            return { ...state, AppliedPerformaceBucketFilter:  action.payload.data !== null ? action.payload.data : null};
        case APPLIED_PARENT_JSON:
            return { ...PARENT_INIT_STATE, AppliedParentFilter: PARENT_INIT_STATE};
        case SAVED_LIKED_STYLE:
            return { ...state, SavedLikedProduct: action.payload.data !== null ? action.payload.data : null};
        default:
            return state;
    }
};
