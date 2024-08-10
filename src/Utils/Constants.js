import {PRODUCT_IMG_URL} from "../env";
import {SUBCAT_IMAGE_URL} from "../env";

export const BasicFilterDataConstant = [{
    text: 'FAD', value: 'FirstActiveDate'
}, {
    text: 'TotalRPT', value: 'TotalRPT'
}, {
    text: 'ST', value: 'TotalST'
}, {
    text: 'Total Impressions', value: 'TotalImpressions'
}, {
    text: 'MRP', value: 'MRP'
}, {
    text: 'CTR', value: 'CTR'
}, {
    text: 'Revenue', value: 'TotalPriceSales'
}, {
    text: 'Highest SR%', value: 'StyleSRPercent'
},]
export const StaticMainFilterDataConstant = [{
    "id": 1,
    "name": "Category Name",
    "keyID": "CategoryID",
    "keyName": "CategoryName",
    "isStatic": false,
    isKeyRequired: true
}, {
    "id": 2,
    "name": "SubCategory Name",
    "keyID": "SubCategoryID",
    "keyName": "SubCategoryName",
    "isStatic": false,
    isKeyRequired: true
},
    {
        "id": 3, "name": "Gender", "keyID": null, "isStatic": false, keyName: 'Gender'
    }, {
        "id": 4, "name": "Type", "isStatic": false, keyName: 'ProductType', "keyID": null,
    }]
export const StaticMainFilterDataConstant1 = [{
    "id": 5, "name": "Brand Type", "keyName": "BrandType", "isStatic": false, keyID: null, isKeyRequired: true
}, {
    "id": 6, "name": "Brand Name", keyName: 'BrandName', "isStatic": false, "keyID": 'BrandID',
}, {
    "id": 7, "name": "Color", keyName: 'Color', "isStatic": false, keyID: null
}, {
    "id": 9, "name": "FAD Year", "keyID": null, "isStatic": false, keyName: "FADYear",
}, {
    "id": 10, "name": "FAD Month", "keyID": null, "isStatic": false, keyName: "FADMonth",
}, {
    "id": 11, "name": "LID Year", "keyID": null, "isStatic": true, keyName: "InwardYear",
}, {
    "id": 12, "name": "LID Month", "keyID": null, "isStatic": true, keyName: "InwardMonth",
}, {
    "id": 13, "name": "Live Style", "keyID": null, "isStatic": false, keyName: 'LiveStyle'
}, {
    "id": 15, "name": "Performance Bucket1", "keyID": null, "isStatic": false, keyName: 'CondiFinalSourcing1'
}, {
    "id": 16, "name": "Performance Bucket2", "keyID": null, "isStatic": false, keyName: 'CondiFinalSourcing2'
},
    /* Price Range Filter Keys*/
    {
        "id": 60, "name": "Age Group", "keyID": "AgeFrom", "isStatic": true, isRange: true
    }, {
        "id": 61, "name": "Sold Qty", "keyID": "TotalB2CSoldQty", "isStatic": false, isRange: true
    },
    {
        "id": 14, "name": "Ageing Buckets", "keyID": "Ageing", "isStatic": true, isRange: true
    }, {
        "id": 17, "name": "MRP Range", "keyID": "MRP", "isStatic": false, isRange: true
    }, {
        "id": 18, "name": "SP Range", "keyID": "SellingPrice", "isStatic": false, isRange: true
    }, {
        "id": 19, "name": "30 Days RPT", "keyID": "30daysRPT", "isStatic": false, isRange: true
    }, {
        "id": 20, "name": "30 Days ST", "keyID": "30DaysST", "isStatic": false, isRange: true
    }, {
        "id": 21, "name": "90 Days RPT", "keyID": "90daysRPT", "isStatic": false, isRange: true
    }, {
        "id": 22, "name": "90 Days ST", "keyID": "90DaysST", "isStatic": false, isRange: true
    }, {
        "id": 23, "name": "Top/Bottom Styles", "keyID": "topbottom", keyName: "topbottom", "isStatic": true,
    }, {
        "id": 24, "name": "Replenishment Styles", "keyID": null, "isStatic": true, keyName: 'Replainshment'
    },  {
        "id": 25, "name": "Ind Margin Bucket", "keyID": "IndMargin", "isStatic": true, isRange: true
    }, {
        "id": 26, "name": "Discount Bucket", "keyID": "Discount", "isStatic": true, isRange: true
    }, {
        "id": 27, "name": "Stock Type", "keyID": null, "isStatic": false, keyName: 'StockType'
    }, {
        "id": 28, "name": "Final NGM Bucket", "keyID": "NGM", "isStatic": true, isRange: true
    }, {
        "id": 29, "name": "Current SC Bucket", "keyID": "StockCover", "isStatic": true, isRange: true
    }, {
        "id": 30, "name": "SR% Bucket", "keyID": "SRPercent", "isStatic": true, isRange: true
    }, {
        "id": 32, "name": "Total Intake Bucket", "keyID": "TotalIntakeBucket", "isStatic": true, isRange: true
    }, {
        "id": 34, "name": "CTR Bucket", "keyID": "CTR", "isStatic": true, isRange: true
    },{
        "id": 33, "name": "Styles with >70% B2B Mix", "keyID": null, "isStatic": true, keyName: 'B2BMixPercent'
    }, {
        "id": 31, "name": "Vendor Name", "keyID": null, "isStatic": false, keyName: 'Vendors'
    },]
export const LandingPageJson = [{
    "id": 1,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "166",
    "SubCategoryName": "Sets & Suits",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_166.png?653561"
}, {
    "id": 2,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "26",
    "SubCategoryName": "Tops & T-Shirts",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_26.png?653562"
}, {
    "id": 3,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "168",
    "SubCategoryName": "Frocks & Dresses",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_168.png?653563"
}, {
    "id": 4,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "164",
    "SubCategoryName": "Onesies & Rompers",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_164.png?653564"
}, {
    "id": 5,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "221",
    "SubCategoryName": "Shorts, Skirts & Jeans",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_221.png?653565"
}, {
    "id": 6,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "220",
    "SubCategoryName": "Shirts",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_220.png?653566"
}, {
    "id": 7,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "243",
    "SubCategoryName": "Party Wear",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_243.png?653567"
}, {
    "id": 8,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "246",
    "SubCategoryName": "Ethnic Wear",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_246.png?653568"
}, {
    "id": 9,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "165",
    "SubCategoryName": "Nightwear",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_165.png?653569"
}, {
    "id": 10,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "269",
    "SubCategoryName": "Pajamas & Leggings",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_269.png?6535610"
}, {
    "id": 11,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "219",
    "SubCategoryName": "Sweaters",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_219.png?6535611"
}, {
    "id": 12,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "267",
    "SubCategoryName": "Sweat Shirts & Jackets",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_267.png?6535612"
}, {
    "id": 13,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "276",
    "SubCategoryName": "Swim Wear",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_276.png?6535613"
}, {
    "id": 14,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "172",
    "SubCategoryName": "Rainwear",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_172.png?6535614"
}, {
    "id": 15,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "170",
    "SubCategoryName": "Footwear",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_170.png?6535615"
}, {
    "id": 16,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "163",
    "SubCategoryName": "Inner Wear & Thermals",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_163.png?6535616"
}, {
    "id": 17,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "22",
    "SubCategoryName": "Caps, Gloves & Mittens",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_22.png?6535617"
}, {
    "id": 18,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "169",
    "SubCategoryName": "Bath Time",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_169.png?6535618"
}, {
    "id": 19,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "238",
    "SubCategoryName": "Socks & Tights",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_238.png?6535619"
}, {
    "id": 20,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "275",
    "SubCategoryName": "Watches",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_275.png?6535620"
}, {
    "id": 21,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "234",
    "SubCategoryName": "Bags",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_234.png?6535621"
}, {
    "id": 22,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "226",
    "SubCategoryName": "Kids Jewellery",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_226.png?6535622"
}, {
    "id": 23,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "377",
    "SubCategoryName": "Kids Umbrellas",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_377.png?6535623"
}, {
    "id": 24,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "224",
    "SubCategoryName": "Hair Bands",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_244.png?6535624"
}, {
    "id": 25,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "228",
    "SubCategoryName": "Hair Clips & Rubber Bands",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_228.png?6535625"
}, {
    "id": 26,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "245",
    "SubCategoryName": "Ties Belts Suspenders",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_245.png?6535626"
}, {
    "id": 27,
    "CategoryID": 6,
    "CategoryName": "Clothes & Shoes",
    "SubCategoryID": "237",
    "SubCategoryName": "Kids Sunglasses",
    "SubImgName": SUBCAT_IMAGE_URL + "/img_237.png?6535627"
}, {
    "id": 28,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "273",
    "SubCategoryName": "Maternity Lingerie",
    "SubImgName": PRODUCT_IMG_URL + "438x531/8968851a.webp?2345428"
}, {
    "id": 29,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "367",
    "SubCategoryName": "Maternity Personal Care",
    "SubImgName": PRODUCT_IMG_URL + "438x531/8931795a.webp?2345429"
}, {
    "id": 30,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "382",
    "SubCategoryName": "Maternity Bottom Wear",
    "SubImgName": PRODUCT_IMG_URL + "438x531/9102493a.webp?2345430"
}, {
    "id": 31,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "231",
    "SubCategoryName": "Formal Wear",
    "SubImgName": PRODUCT_IMG_URL + "300x364/3630906a.webp?2345431"
}, {
    "id": 32,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "222",
    "SubCategoryName": "Maternity Tops",
    "SubImgName": PRODUCT_IMG_URL + "438x531/9186129a.webp?2345432"
}, {
    "id": 33,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "244",
    "SubCategoryName": "Maternity Support Accessories",
    "SubImgName": PRODUCT_IMG_URL + "438x531/8071039a.webp?2345433"
}, {
    "id": 35,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "229",
    "SubCategoryName": "Nursing/Sleep Wear",
    "SubImgName": PRODUCT_IMG_URL + "438x531/9120170a.webp?2345434"
}, {
    "id": 36,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "382",
    "SubCategoryName": "Maternity Dresses & Skirts",
    "SubImgName": PRODUCT_IMG_URL + "438x531/9003846a.webp?2345434"
}, {
    "id": 37,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "383",
    "SubCategoryName": "Maternity Ethnic Wear",
    "SubImgName": PRODUCT_IMG_URL + "zoom/8489515a.webp?2345435"
}, {
    "id": 38,
    "CategoryID": 21,
    "CategoryName": "Moms & Maternity",
    "SubCategoryID": "396",
    "SubCategoryName": "Nutritional Supplements",
    "SubImgName": PRODUCT_IMG_URL + "438x531/9129597a.webp?2345436"
}]
export const MonthArray = [
    {
        key: 1,
        value: 'JAN'
    },
    {
        key: 2,
        value: 'FEB'
    },
    {
        key: 3,
        value: 'MAR'
    },
    {
        key: 4,
        value: 'APR'
    },
    {
        key: 5,
        value: 'MAY'
    },
    {
        key: 6,
        value: 'JUN'
    },
    {
        key: 7,
        value: 'JUL'
    },
    {
        key: 8,
        value: 'AUG'
    },
    {
        key: 9,
        value: 'SEP'
    },
    {
        key: 10,
        value: 'OCT'
    },
    {
        key: 11,
        value: 'NOV'
    },
    {
        key: 12,
        value: 'DEC'
    }
];
export const TopBottomArr = [
    {
        id: 1,
        doc_count: '',
        topbottom: 'Top 100'
    },
    {
        id: 2,
        doc_count: '',
        topbottom: 'Top 500'
    },
    {
        id: 3,
        doc_count: '',
        topbottom: 'Top 1000'
    },
    {
        id: 4,
        doc_count: '',
        topbottom: 'Bottom 100'
    },
    {
        id: 5,
        doc_count: '',
        topbottom: 'Bottom 500'
    },
    {
        id: 6,
        doc_count: '',
        topbottom: 'Bottom 1000'
    }
];
export const B2BMixPercentArr = [
    {
        doc_count: '',
        B2BMixPercent: ''
    }
];
