import {APPLIED_PARENT_JSON} from '../action/types'
const initialState = {
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
        Ageing: [],
        MRP: [],
        _30daysRPT: [],
        _30DaysST: [],
        _90daysRPT: [],
        _90DaysST: [],
        topbottom: [],
        SellingPrice: [],
        Replainshment: [],
        B2BMixPercent: [],
        IndMargin: [],
        Discount: [],
        NGM: [],
        StockCover: [],
        SRPercent: [],
        TotalIntakeBucket: [],
        AgeFrom: [],
        TotalB2CSoldQty: [],
        CTR: [],
        page: 1,
        sort: 'TotalRPT',
        order: 'DESC',
        Potypes: [],
        PoAttributes: [],
        pagesize: 100
    }
};

export default (state = initialState, action) => {
    switch(action.type) {
        case APPLIED_PARENT_JSON:
            return { ...state, data: action.payload.data };
        default:
            return state;
    }
}
