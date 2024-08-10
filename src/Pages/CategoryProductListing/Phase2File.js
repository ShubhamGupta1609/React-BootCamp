import { NavLink, useFetcher, useLocation } from "react-router-dom";
import './index.scss'
import '../../HandBook.scss'
import TopNavbar from "../Navbar";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { LIVE_URL, PRODUCT_IMG_URL } from "../../env";

import Tab from 'react-bootstrap/Tab';
import {
    B2BMixPercentArr,
    BasicFilterDataConstant,
    MonthArray,
    StaticMainFilterDataConstant,
    StaticMainFilterDataConstant1,
    TopBottomArr
} from "../../Utils/Constants";
import {
    AppliedBrandFilter,
    AppliedColorFilter,
    AppliedFadMonthFilter,
    AppliedFadYearFilter,
    AppliedGenderFilter,
    AppliedParentJson,
    AppliedPerformanceBucketFilter,
    GenderFilterData
} from '../../redux/action'
import store from '../../redux/store/index';
import { useDispatch } from "react-redux";
import Spinner from 'react-bootstrap/Spinner';
import ErrorBoundary from "../../Components/ErrorBoundary";
import Pagination from 'react-bootstrap/Pagination';
import Notification from "../../Components/Notification/Notification";
import { flush } from "redux-saga/effects";

export default function CategoryProductListing() {
    const checkboxRefs = useRef([]);

    const handleSpanClick = (index) => {
        checkboxRefs.current[index].click(); // Trigger the checkbox click event for the specific index
    };
    const location = useLocation()
    const dispatch = useDispatch();
    let [loader, setLoader] = useState(false)

    const { CategoryId } = location.state
    const [IsSearchActive, SetIsSearchActive] = useState(false);
    const [SearchKey, SetSearchKey] = useState('');
    const [SourceKey, SetSourceKey] = useState('');
    let [Search, SetSearch] = useState('');



    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [filter, setFilter] = useState(JSON.parse(localStorage.getItem('JsonData')));
    let [ColorDropDown, SetColorDropDown] = useState(false)
    let [BrandTypeDropDown, SetBrandTypeDropDown] = useState(false)
    let [FADYearDropDown, SetFADYearDropDown] = useState(false)
    let [FADMonthDropDown, SetFADMonthDropDown] = useState(false)
    let [PerformanceBucket, SetPerformanceBucket] = useState(false)
    let [GenderDropDown, SetGenderDropDown] = useState(false)
    let [Trigger, SetTrigger] = useState(true)
    let [TriggerDistinctType, SetTriggerDistinctType] = useState(false)
    let [TriggerDistinctTypePO, SetTriggerDistinctTypePO] = useState(false)
    let [MainFilterHideContent, SetMainFilterHideContent] = useState(false)

    let BasicFilterData = BasicFilterDataConstant
    let StaticMainFilterData = StaticMainFilterDataConstant
    let StaticMainFilterData1 = StaticMainFilterDataConstant1
    let [showGenderFilter, SetShowGenderFilter] = useState(false)
    useEffect(() => {
        function handleResize() {
            if ((localStorage.getItem("IsGenderFilterOpen") === 'False')) {
                /*  SetShowGenderFilter(window.innerWidth < 768);*/
            }
        }

        handleResize(); // set the initial value on mount

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    let [showBasicFilter, SetShowBasicFilter] = useState(false)
    let [showMainFilter, SetShowMainFilter] = useState(false)

    let [productData, setProductData] = useState([])
    let [ProductTotalCount, SetProductTotalCount] = useState(0)
    let [BrandData, SetBrandData] = useState([])
    let [ColorData, SetColorData] = useState([])
    let [PerformanceBucketData, SetPerformanceBucketDatas] = useState([])
    let [GenderData, SetGenderData] = useState([])


    let [BrandArr, SetBrandArr] = useState([])
    let [FadArr, SetFadArr] = useState([])
    let [FadMonthArr, SetFadMonthArr] = useState([])
    let [ColorArr, SetColorArr] = useState([])
    let [PerformanceBuckerArr, SetPerformanceBuckerArr] = useState([])

    let [GenderArr, SetGenderArr] = useState([])
    let [GenderStoreArr, SetGenderStoreArr] = useState([store.getState().ProductFilter.GenderFilters])
    let [BasicFilterArr, SetBasicFilterArr] = useState(filter.sort)
    let [BasicOrderFilterArr, SetBasicOrderFilterArr] = useState(filter.order)

    let [FadMonthData, SetFadMonthData] = useState([])
    let [FadYearData, SetFadYearData] = useState([])

    /*Keys For Getting Data After Click On Side Menu Field*/
    let [DynamicFilterStaticValueData, SetDynamicFilterStaticValueData] = useState('')
    let [DynamicFilterStaticValueData1, SetDynamicFilterStaticValueData1] = useState('')

    let [DynamicFilterStaticValueDataDistinctType, SetDynamicFilterStaticValueDataDistinctType] = useState('')
    let [DynamicFilterStaticValueDataDistinctTypePO, SetDynamicFilterStaticValueDataDistinctTypePO] = useState('')

    /*Keys For Getting Data After Click On Side Menu Field*/

    let [StaticFilterRes, SetStaticFilterRes] = useState([])
    const [filteredData, setFilteredData] = useState([]); // Assuming StaticFilterRes is the original list
    let [PriceRangeFilter, SetPriceRangeFilter] = useState('')

    let [DistinctValueArr, SetDistinctValueArr] = useState([])
    let [POAttributesArr, SetPOAttributesArr] = useState([])
    let [SpinnerLoading, SetSpinnerLoading] = useState(false)
    let [SpinnerLoadingIndex, SetSpinnerLoadingIndex] = useState(0)
    let [SpinnerMainFilter, SetSpinnerMainFilter] = useState(false)
    let [SpinnerQuickFilters, SetSpinnerQuickFilters] = useState(true)
    const UpdateLatestLikedProducts = () => {
        let wishlistUrl = LIVE_URL + 'shortlistprodlistbyuser';
        var payload = {
            "userid": localStorage.getItem('userid'),
            "page": 1,
            "pagesize": 1000
        };
        axios.post(wishlistUrl, payload)
            .then((response) => {
                if (response.status === 200) { // Assuming response.status indicates success
                    const styles = response.data.data.map((item) => item.style);
                    localStorage.setItem("LikedProducts", styles)
                    setRefresh(!refresh);
                    SetSpinnerLoading(false)
                } else {
                }
            })
            .catch(() => {

            });
    }
    const SetLikeProductToApi = (data) => {
        SetSpinnerLoading(true)
        const likedProducts = localStorage.getItem("LikedProducts");
        var payload = {
            'userid': localStorage.getItem("userid"),
            'style': data.Style,
            'isactive': likedProducts && likedProducts.split(",").includes(data.Style) ? false : true,
        };

        let LikeUrl = LIVE_URL + 'insertshortlistprod';

        axios.post(LikeUrl, payload)
            .then((response) => {
                if (response.data.status) {
                    UpdateLatestLikedProducts()
                    // Check if data.Style is present in likedProducts and remove it
                    if (likedProducts && likedProducts.includes(data.Style)) {
                        const updatedLikedProducts = likedProducts.split(",").filter(style => style !== data.Style);
                        localStorage.setItem("LikedProduct", updatedLikedProducts.join(","));
                    }
                } else {
                    SetSpinnerLoading(false)
                }
            })
            .catch((err) => {
                SetSpinnerLoading(false)
                console.log(err);
            });
    };

    const [isSubMenuOpen, setIsSubMenuOpen] = React.useState(false);

    /*TOAST MODULES*/
    function getFilterLength(arrayName) {
        /*Case _*/
        if ((arrayName === '30daysRPT' || arrayName === '30DaysST' || arrayName === '90daysRPT' || arrayName === '90DaysST')) {
            if (filter.hasOwnProperty('_' + arrayName)) {
                if (filter['_' + arrayName].length > 0) {
                    return filter['_' + arrayName].length;
                } else {
                    return ''
                }
            } else {
                return '';
            }
        } else {
            if (filter.hasOwnProperty(arrayName)) {
                if (filter[arrayName].length > 0) {
                    return filter[arrayName].length;
                } else {
                    return ''
                }
            } else {
                return '';
            }
        }
    }

    function handleSubMenuToggle() {
        setIsSubMenuOpen(!isSubMenuOpen);
    }

    function findLengthOfType(type) {
        const potypes = filter.Potypes;
        const matchingObject = potypes.find(obj => obj.type === type);
        if (matchingObject) {
            if (matchingObject.value.length > 0) {
                return matchingObject.value.length;
            } else {
                return ''
            }
        }
    }

    function findLengthOfPoAttributes(type) {
        const potypes = filter.PoAttributes;
        const matchingObject = potypes.find(obj => obj.hasOwnProperty(type));
        if (matchingObject) {
            if (matchingObject[type].length > 0) {
                return matchingObject[type].length;
            } else {
                return ''
            }
        }
        // If type is not found, return null or throw an error
        return '';
    }

    /*Non Depended on Functions*/
    const SetTriggerFunction = () => {
        SetTrigger(!Trigger)
        SetMainFilterHideContent(false)
        SetShowGenderFilter(false)
        HideNextFilterFunction('HIDEALL')

    }
    const GetMonthNamebyKey = (key) => {
        for (let i = 0; i <= MonthArray.length; i++) {
            if (MonthArray[i].key === key) {
                return MonthArray[i].value
            }
        }
    }

    const DropDownController = (value) => {
        switch (value) {
            case 'Color':
                GetcolorDataBar()
                SetColorDropDown(!ColorDropDown);
                SetFADYearDropDown(false);
                SetFADMonthDropDown(false);
                SetBrandTypeDropDown(false);
                SetPerformanceBucket(false);
                break;
            case 'FADYear':
                GetFadYearDataBar()
                SetColorDropDown(false);
                SetFADYearDropDown(!FADYearDropDown);
                SetFADMonthDropDown(false);
                SetBrandTypeDropDown(false);
                SetPerformanceBucket(false);
                break;
            case 'FADMonth':
                GetFadMonthDataBar()
                SetColorDropDown(false);
                SetFADYearDropDown(false);
                SetFADMonthDropDown(!FADMonthDropDown);
                SetBrandTypeDropDown(false);
                SetPerformanceBucket(false);

                break;
            case 'BrandType':
                GetBrandTypeDataBar()
                SetColorDropDown(false);
                SetFADYearDropDown(false);
                SetFADMonthDropDown(false);
                SetPerformanceBucket(false);
                SetBrandTypeDropDown(!BrandTypeDropDown);
                break;
            case 'PerformanceBucket':
                GetBucketDataBar()
                SetColorDropDown(false);
                SetFADYearDropDown(false);
                SetFADMonthDropDown(false);
                SetBrandTypeDropDown(false);
                SetPerformanceBucket(!PerformanceBucket);
                break;
            case 'All':
                SetColorDropDown(false);
                SetFADYearDropDown(false);
                SetFADMonthDropDown(false);
                SetBrandTypeDropDown(false);
                SetPerformanceBucket(false);
                break;
        }
    };

    const ClearAllFiltersFunction = () => {
        HideNextFilterFunction('HIDEALL')
        SetMainFilterHideContent(false)
        setFilter({
            CategoryID: [],
            SubCategoryID: [CategoryId],
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
            /*Price Range Arrays*/
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
            sort: BasicFilterArr,
            order: BasicOrderFilterArr,
            page: 1,
            pagesize: 100
        })
        SetTrigger(!Trigger)
    }

    const CancelMainFilterView = () => {
        SetMainFilterHideContent(false)
        HideNextFilterFunction('HIDEALL')
    }


    let rowCount = ProductTotalCount
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = IsSearchActive === true ? 10 : 100;

    const totalPages = Math.ceil(rowCount / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            setCurrentPage(pageNumber);
            filter.page = pageNumber
            SetTrigger(!Trigger)
        }
    };

    // ... rest of the component code

    const getPageItems = () => {
        const pageItems = [];

        // Add previous button
        pageItems.push(
            <Pagination.Prev
                key="prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >Prev</Pagination.Prev>
        );

        // Add page numbers and ellipses
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(currentPage - i) <= 2) {
                pageItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </Pagination.Item>
                );
            } else if (pageItems[pageItems.length - 1].type !== Pagination.Ellipsis) {
                pageItems.push(<Pagination.Ellipsis key={`ellipsis-${i}`} />);
            }
        }

        // Add next button
        pageItems.push(
            <Pagination.Next
                key="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >Next</Pagination.Next>
        );

        return pageItems;
    };

    /*Non Depended on Functions*/
    /*Use Effect For Distinct Attributes*/
    React.useEffect(() => {
        let GetDistinctURL = LIVE_URL + 'getDistinctTypes'
        let payloadDistinct = modifiedFilter
        payloadDistinct.keyName = 'types'
        payloadDistinct.api = 'types'
        /* if (payloadDistinct['Potypes']) {
             delete payloadDistinct['Potypes'] // remove the key from payload if it exists in modifiedFilter
         }*/
        if (IsSearchActive) {
            payloadDistinct.keyword = SearchKey
            payloadDistinct.field = SourceKey
        }
        axios.post(GetDistinctURL, payloadDistinct).then((response) => {
            if (response.status) {
                SetDistinctValueArr(response.data.data)
            }
        }).catch((err => {
            console.log(err)
        }))
    }, [TriggerDistinctType, Trigger])
    React.useEffect(() => {
        let GetDistinctURL = LIVE_URL + 'getDistinctPOAttributes'
        let payloadPO = modifiedFilter
        payloadPO.keyName = 'attributes'
        payloadPO.api = 'attributes'
        /* if (payloadPO['PoAttributes']) {
             delete payloadPO['PoAttributes'] // remove the key from payload if it exists in modifiedFilter
         }*/
        if (IsSearchActive) {
            payloadPO.keyword = SearchKey
            payloadPO.field = SourceKey
        }
        axios.post(GetDistinctURL, payloadPO).then((response) => {
            if (response.status) {
                SetPOAttributesArr(response.data.data)
            }
        }).catch((err => {
            console.log(err)
        }))
    }, [Trigger])
    /*Use Effect For Distinct Attributes*/

    useEffect(() => {
    }, [filter]);
    const handleCheckboxChange = (e, key, DesktopKey) => {

        const { name, checked, value } = e.target;
        if (name.includes("CategoryID") || name.includes("SubCategoryID") || name.includes("BrandID")) {
            setFilter((prevFilter) => {
                const currentValueIndex = prevFilter[name].indexOf(value);
                const currentValueExists = currentValueIndex !== -1;

                if (checked && !currentValueExists) {
                    // Add the value to the array if it's not already there
                    return {
                        ...prevFilter,
                        [name]: [...prevFilter[name], value],
                    };
                } else if (!checked && currentValueExists) {
                    // Remove the value from the array if it's there
                    return {
                        ...prevFilter,
                        [name]: [
                            ...prevFilter[name].slice(0, currentValueIndex),
                            ...prevFilter[name].slice(currentValueIndex + 1),
                        ],
                    };
                } else {
                    // Return the previous filter state if no changes are made
                    return prevFilter;
                }
            });

        } else {
            if (key.hasOwnProperty("range")) {
                let from, to;

                if (key.range.includes("-")) {
                    [from, to] = key.range.split("-").map((v) => v.trim());
                    to = to === "Above" ? "Above" : Number(to);
                } else {
                    from = Number(key.range);
                    to = key.range === "Above" ? "Above" : Number(key.range);
                }

                setFilter((prevFilter) => ({
                    ...prevFilter,
                    [name]: checked
                        ? [...prevFilter[name], { from, to }]
                        : prevFilter[name].filter((item) => item.from !== from || item.to !== to),
                }));
            } else {
                setFilter((prevFilter) => {
                    const currentValueIndex = prevFilter[name].indexOf(value);
                    const currentValueExists = currentValueIndex !== -1;

                    if (checked && !currentValueExists) {
                        // Add the value to the array if it's not already there
                        return {
                            ...prevFilter,
                            [name]: [...prevFilter[name], value],
                        };
                    } else if (!checked && currentValueExists) {
                        // Remove the value from the array if it's there
                        return {
                            ...prevFilter,
                            [name]: [
                                ...prevFilter[name].slice(0, currentValueIndex),
                                ...prevFilter[name].slice(currentValueIndex + 1),
                            ],
                        };
                    } else {
                        // Return the previous filter state if no changes are made
                        return prevFilter;
                    }
                });
            }
        }
        if (DesktopKey === 'Desktop') {
            SetTrigger(!Trigger)
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        SetSearch(query);
        if (query === '') {
            setFilteredData(StaticFilterRes);
        }
        const filteredList = StaticFilterRes.filter((item) => {
            const brandName = item.BrandName.toLowerCase();
            // Modify the following line based on how you want to search (e.g., case-insensitive search)
            return brandName.includes(query); // Assuming the list items have a property named "name"
        });

        setFilteredData(filteredList);
        console.log('search Result ', filteredData);
    };

    const handleSearchClear = () => {
        SetSearch('');
        setFilteredData(StaticFilterRes);
    };


    React.useEffect(()=>{
        console.log('filtered data ', filteredData);
    },[filteredData])

    const handleCheckboxChangeTopBottom = (key, DesktopKey) => {
        const updatedFilter = { ...filter };
        const { topbottom } = key;

        if (topbottom !== updatedFilter.topbottom[0]) {
            updatedFilter.topbottom = [topbottom];
        } else {
            updatedFilter.topbottom = [];
        }

        setFilter(updatedFilter);
        if (DesktopKey = 'Desktop') {
            SetTrigger(!Trigger)
        }
    };


    const GetBucketRangeFunction = (value) => {
        if (value >= 0 && value <= 100) {
            return "0-100";
        } else if (value > 100 && value <= 200) {
            return "100-200";
        } else if (value > 200 && value <= 400) {
            return "200-400";
        } else if (value > 400 && value <= 500) {
            return "400-500";
        } else if (value > 500 && value <= 700) {
            return "500-700";
        } else if (value > 700 && value <= 1000) {
            return "700-1000";
        } else if (value > 1000 && value <= 1500) {
            return "1000-1500";
        } else if (value > 1500 && value <= 2000) {
            return "1500-2000";
        } else if (value > 2000) {
            return "2000-Above";
        } else {
            return "Invalid";
        }
    }
    const handleCheckboxChangeDistinctType = (e, TypeKey, DesktopKey) => {
        if (TypeKey === "Distinct") {
            const { name, checked, value } = e.target;
            const type = name.split("_")[0]; // extract the type from the checkbox name
            const newValue = value;

            // find the index of the type in the Potypes array
            const typeIndex = filter.Potypes.findIndex((item) => item.type === type);

            if (typeIndex === -1) {
                // if the type is not in the Potypes array and newValue is not an empty array, add it
                if (newValue.length > 0) {
                    setFilter((prevState) => ({
                        ...prevState,
                        Potypes: [
                            ...prevState.Potypes,
                            {
                                type,
                                value: [newValue],
                            },
                        ],
                    }));
                }
            } else {
                // if the type is already in the Potypes array and newValue is not an empty array, update the value array
                if (newValue.length > 0) {
                    setFilter((prevState) => ({
                        ...prevState,
                        Potypes: prevState.Potypes.map((item, index) => {
                            if (index === typeIndex) {
                                return {
                                    ...item,
                                    value: checked
                                        ? [...item.value, newValue]
                                        : item.value.filter((val) => val !== newValue),
                                };
                            } else {
                                return item;
                            }
                        }),
                    }));
                }
                // if the type is already in the Potypes array and newValue is an empty array, remove the item from the array
                else {
                    setFilter((prevState) => ({
                        ...prevState,
                        Potypes: prevState.Potypes.filter((item, index) => index !== typeIndex),
                    }));
                }
            }
            /* // Remove empty or [] keys from PoAttributes
             setFilter((prevState) => ({
                 ...prevState,
                 Potypes: Object.keys(prevState.Potypes).reduce((acc, key) => {
                     if (prevState.Potypes[key].length > 0) {
                         acc[key] = prevState.Potypes[key];
                     }
                     return acc;
                 }, {}),
             }));*/
        }

        if (TypeKey === "DistinctPO") {
            const { name, checked, value } = e.target;
            const type = name.split("_")[0]; // extract the type from the checkbox name

            setFilter((prevState) => {
                // find the index of the type in the PoAttributes array
                const typeIndex = prevState.PoAttributes.findIndex(
                    (item) => Object.keys(item)[0] === type
                );

                if (typeIndex === -1) {
                    // if the type is not in the PoAttributes array and newValue is not an empty array, add it
                    if (value.length > 0) {
                        return {
                            ...prevState,
                            PoAttributes: [
                                ...prevState.PoAttributes,
                                {
                                    [type]: [value],
                                },
                            ],
                        };
                    }
                } else {
                    // if the type is already in the PoAttributes array and newValue is not an empty array, update the value array
                    if (value.length > 0) {
                        const updatedValue = checked
                            ? [...prevState.PoAttributes[typeIndex][type], value]
                            : prevState.PoAttributes[typeIndex][type].filter(
                                (val) => val !== value
                            );

                        return {
                            ...prevState,
                            PoAttributes: prevState.PoAttributes.map((item, index) => {
                                if (index === typeIndex) {
                                    return {
                                        ...item,
                                        [type]: updatedValue,
                                    };
                                } else {
                                    return item;
                                }
                            }),
                        };
                    }
                    // if the type is already in the PoAttributes array and newValue is an empty array, remove the item from the array
                    else {
                        return {
                            ...prevState,
                            PoAttributes: prevState.PoAttributes.filter(
                                (item, index) => index !== typeIndex
                            ),
                        };
                    }
                }

                return prevState;
            });
        }

        if (DesktopKey === 'Desktop') {
            SetTrigger(!Trigger)
        }
    }

    const GetDynamicFilterStaticValueData = (key1, key2) => {
        SetDynamicFilterStaticValueData(key1)
        SetDynamicFilterStaticValueData1(key2)
        GetMainDataForFilters(key1, key2)
        /*Setting Up Price Range Value '' */
        SetPriceRangeFilter('')
        SetTriggerDistinctType(false)
        SetTriggerDistinctTypePO(false)
    }
    const GetDynamicFilterStaticValueDataForDistinctTypes = (key1, key2) => {
        SetDynamicFilterStaticValueDataDistinctType(key1)
        SetStaticFilterRes(key2.value)
        SetTriggerDistinctType(true)
        SetTriggerDistinctTypePO(false)

    }
    const GetDynamicFilterStaticValueDataForDistinctTypesPO = (key1, key2) => {
        SetDynamicFilterStaticValueDataDistinctTypePO(key1)
        SetStaticFilterRes(key2.value)
        SetTriggerDistinctType(true)
        SetTriggerDistinctTypePO(true)
    }
    const GetDynamicFilterStaticValueDataRange = (key1) => {
        SetPriceRangeFilter(key1)
        SetDynamicFilterStaticValueData(key1)
        SetDynamicFilterStaticValueData1(key1)
        SetTriggerDistinctType(false)
        GetPriceRangeFunction(key1)
    }
    const SetVisitHistory = (Style) => {
        let VisitUrl = LIVE_URL + 'userVisitHistory'
        let payload = {
            username: localStorage.getItem("emailaddress"),
            Style: Style
        }
        axios.post(VisitUrl, payload).then((response) => {
            if (response.data.status) {

            } else {

            }
        }).catch((err => {

            console.log(err)
        }))
    }
    /*NOTE POP 1S*/
    const GetPriceRangeFunction = (key1) => {
        SetStaticFilterRes([])
        SetSpinnerMainFilter(true)
        let PriceRangeValue = LIVE_URL + 'getPriceRange'
        let payload = modifiedFilter
        payload.key = key1
        if (payload[key1]) {
            delete payload[key1] // remove the key from payload if it exists in modifiedFilter
        }
        if (IsSearchActive) {
            payload.keyword = SearchKey
            payload.field = SourceKey
        }
        DropDownController('All')
        axios.post(PriceRangeValue, payload).then((response) => {
            if (response.status) {
                SetSpinnerMainFilter(false)
                SetStaticFilterRes([])
                SetStaticFilterRes(response.data.data)
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                SetSpinnerMainFilter(false)
            }
        }).catch((err => {
            SetSpinnerMainFilter(false)
            SetStaticFilterRes([])
            console.log(err)
        }))
    }

    /* Gender Filter Effect Function*/
    React.useEffect(() => {
        let GenderBaseUrl = LIVE_URL + 'commonFilters'
        let payload = { ...modifiedFilter } // create a copy of modifiedFilter object
        if (payload['Gender']) {
            delete payload['Gender'] // remove the key from payload if it exists in modifiedFilter
        }
        if (IsSearchActive) {
            payload.keyword = SearchKey
            payload.field = SourceKey
        }
        payload.keyName = "Gender"
        axios.post(GenderBaseUrl, payload).then((response) => {
            if (response.status) {
                SetGenderData(response.data.data)
                dispatch(
                    GenderFilterData({
                        data: response.data.data,
                    })
                );
            }
        }).catch((err => {
            console.log(err)
        }))
    }, [])

    const GetGenderFilterTypeBar = () => {
        if (!GenderDropDown) {
            let GenderBaseUrl = LIVE_URL + 'commonFilters'
            let payload = { ...modifiedFilter } // create a copy of modifiedFilter object
            if (payload["Gender"]) {
                delete payload["Gender"] // remove the key from payload if it exists in modifiedFilter
            }
            if (IsSearchActive) {
                payload.keyword = SearchKey
                payload.field = SourceKey
            }
            payload.keyName = "Gender"
            axios.post(GenderBaseUrl, payload).then((response) => {
                if (response.status) {
                    SetGenderData(response.data.data)
                    dispatch(
                        GenderFilterData({
                            data: response.data.data,
                        })
                    );
                }
            }).catch((err => {
                setLoader(false)
                console.log(err)
            }))
        }
    }

    const GetGenderFilterChecked = (value) => {
        if (filter.Gender.includes(value)) {
            return true
        }
    }
    const GetCatFilterChecked = (value, checked) => {
        if (checked === 'CatKeys') {
            return !!filter[DynamicFilterStaticValueData].includes(JSON.stringify(value));
        } else if (checked === 'BaseKeys') {
            if (DynamicFilterStaticValueData1 === 'Gender' || DynamicFilterStaticValueData1 === 'ProductType' || DynamicFilterStaticValueData1 === 'CondiFinalSourcing1' || DynamicFilterStaticValueData1 === 'CondiFinalSourcing2' || DynamicFilterStaticValueData1 === 'Color' || DynamicFilterStaticValueData1 === 'BrandType' || DynamicFilterStaticValueData1 === 'StockType' || DynamicFilterStaticValueData1 === 'Vendors') {
                return !!filter[DynamicFilterStaticValueData1].includes(value)
            } else if (DynamicFilterStaticValueData1 !== 'Gender' || DynamicFilterStaticValueData1 !== 'ProductType' || DynamicFilterStaticValueData1 !== 'CondiFinalSourcing2' || DynamicFilterStaticValueData1 !== 'CondiFinalSourcing2') {
                return !!filter[DynamicFilterStaticValueData1].includes(JSON.stringify(value));
            }
        }

    }
    const SetGenderFunction = (value) => {
        SetGenderArr(GenderStoreArr)
        setFilter(prevFilter => ({
            ...prevFilter,
            Gender: GenderStoreArr
        }));
        SetTrigger(!Trigger)
        HideNextFilterFunction('HIDEALL')
        localStorage.setItem("IsGenderFilterOpen", 'True')
    }
    const SetGenderFilterData = () => {
        let checkboxes = document.querySelectorAll('input[name="GenderFilterCheckBox"]:checked');
        let values = [];
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
        SetGenderStoreArr(values)
        if (values.length) {
            dispatch(
                AppliedGenderFilter({
                    data: values,
                })
            );
        } else {
            dispatch(
                AppliedGenderFilter({
                    data: null,
                })
            );
        }
        setFilter(prevFilter => ({
            ...prevFilter,
            Gender: values
        }));
    }
    /* Gender Filter Effect Function*/

    /* Color Filter Effect Function*/
    const GetcolorDataBar = () => {
        if (!ColorDropDown) {
            SetSpinnerQuickFilters(true)
            let ColorBaseUrl = LIVE_URL + 'getDistinctColors';
            let payload = { ...modifiedFilter };
            if (payload['Color']) {
                delete payload['Color'];
            }
            payload.keyName = "Color";
            axios.post(ColorBaseUrl, payload)
                .then((response) => {
                    if (response.status) {
                        SetSpinnerQuickFilters(false)
                        const modifiedData = response.data.data.map(item => {
                            const colorHex = item.ColorHex.replace(/#+/g, '#'); // Remove duplicate '#' characters
                            return { ...item, ColorHex: colorHex };
                        });
                        SetColorData(modifiedData);
                        AppliedColorFilter({
                            data: modifiedData,
                        });
                    }
                })
                .catch((err) => {
                    SetSpinnerQuickFilters(false)
                    console.log(err);
                });
        }
    };


    const SetColorFilterData = () => {
        let checkboxes = document.querySelectorAll('input[name="Color"]:checked');
        let values = [];
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
        SetColorArr(values)
        if (values.length) {
            dispatch(
                AppliedColorFilter({
                    data: values,
                })
            );
        } else {
            dispatch(
                AppliedColorFilter({
                    data: null,
                })
            );
        }
        setFilter(prevFilter => ({
            ...prevFilter,
            Color: values
        }));
    }
    const GetColorFilterChecked = (value) => {
        if (filter.Color.includes(value)) {
            return true
        }
    }

    const SetColorForAPI = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            Color: ColorArr
        }));
        SetTrigger(!Trigger)
        DropDownController('All')
    }
    /* Color Filter Effect Function*/

    /* Brand Filter Effect Function*/
    const GetBrandTypeDataBar = () => {
        if (!BrandTypeDropDown) {
            SetSpinnerQuickFilters(true)
            let BrandTypeBaseUrl = LIVE_URL + 'commonFilters'
            let payload = { ...modifiedFilter } // create a copy of modifiedFilter object
            if (payload['BrandType']) {
                delete payload['BrandType'] // remove the key from payload if it exists in modifiedFilter
            }
            if (IsSearchActive) {
                payload.keyword = SearchKey
                payload.field = SourceKey
            }
            payload.keyName = "BrandType"
            axios.post(BrandTypeBaseUrl, payload).then((response) => {
                if (response.status) {
                    SetSpinnerQuickFilters(false)
                    SetBrandData(response.data.data)
                    AppliedBrandFilter(
                        ({
                            data: response.data.data,
                        })
                    );
                }
            }).catch((err => {
                SetSpinnerQuickFilters(false)
                console.log(err)
            }))
        }
    }
    const SetBrandFilterData = () => {
        let checkboxes = document.querySelectorAll('input[name="BrandData"]:checked');
        let values = [];
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
        SetBrandArr(values)
        if (values.length) {
            dispatch(
                AppliedBrandFilter({
                    data: values,
                })
            );
        } else {
            dispatch(
                AppliedBrandFilter({
                    data: null,
                })
            );
        }
        setFilter(prevFilter => ({
            ...prevFilter,
            BrandType: values
        }));
    }    /* Brand Filter Effect Function*/
    const GetBrandFilterChecked = (value) => {
        if (filter.BrandType.includes(value)) {
            return true
        }
    }

    const SetBrandForAPI = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            BrandType: BrandArr
        }));
        SetTrigger(!Trigger)
        DropDownController('All')
    }
    /* Brand Filter Effect Function*/

    /* FAD Month Filter Effect Function*/
    const GetFadMonthDataBar = () => {
        if (!FADMonthDropDown) {
            SetSpinnerQuickFilters(true)
            let ColorBaseUrl = LIVE_URL + 'commonFilters'
            let payload = { ...modifiedFilter } // create a copy of modifiedFilter object
            if (payload['FADMonth']) {
                delete payload['FADMonth'] // remove the key from payload if it exists in modifiedFilter
            }
            if (IsSearchActive) {
                payload.keyword = SearchKey
                payload.field = SourceKey
            }
            payload.keyName = "FADMonth"
            axios.post(ColorBaseUrl, payload).then((response) => {
                if (response.status) {
                    SetSpinnerQuickFilters(false)
                    SetFadMonthData(response.data.data)
                    AppliedFadMonthFilter(
                        ({
                            data: response.data.data,
                        })
                    )
                }
            }).catch((err => {
                SetSpinnerQuickFilters(false)
                console.log(err)
            }))
        }
    }
    const SetFadMonthFilterData = () => {
        let checkboxes = document.querySelectorAll('input[name="fadMonth"]:checked');
        let values = [];
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
        SetFadMonthArr(values)
        if (values.length) {
            dispatch(
                AppliedFadMonthFilter({
                    data: values,
                })
            );
        } else {
            dispatch(
                AppliedFadMonthFilter({
                    data: null,
                })
            );
        }
        setFilter(prevFilter => ({
            ...prevFilter,
            FADMonth: values
        }));
    }
    const GetFadMonthFilterChecked = (value) => {
        if (filter.FADMonth.includes(JSON.stringify(value))) {
            return true
        }
    }

    const SetFadMonthForAPI = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            FADMonth: FadMonthArr
        }));
        SetTrigger(!Trigger)
        DropDownController('All')
    }
    /* FAD Month Filter Effect Function*/


    /* Performance Bucket Month Filter Effect Function*/
    const GetBucketDataBar = () => {
        if (!PerformanceBucket) {
            SetSpinnerQuickFilters(true)
            let ColorBaseUrl = LIVE_URL + 'commonFilters'
            let payload = { ...modifiedFilter } // create a copy of modifiedFilter object
            if (payload['CondiFinalSourcing1']) {
                delete payload['CondiFinalSourcing1'] // remove the key from payload if it exists in modifiedFilter
            }
            if (IsSearchActive) {
                payload.keyword = SearchKey
                payload.field = SourceKey
            }
            payload.keyName = "CondiFinalSourcing1"
            axios.post(ColorBaseUrl, payload).then((response) => {
                if (response.status) {
                    SetSpinnerQuickFilters(false)
                    SetPerformanceBucketDatas(response.data.data)
                    AppliedFadMonthFilter(
                        ({
                            data: response.data.data,
                        })
                    )
                }
            }).catch((err => {
                SetSpinnerQuickFilters(false)
                console.log(err)
            }))
        }

    }
    const SetPerformanceBucketData = () => {
        let checkboxes = document.querySelectorAll('input[name="CondiFinalSourcing1"]:checked');
        let values = [];
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
        SetPerformanceBuckerArr(values);
        if (values.length) {
            dispatch(
                AppliedPerformanceBucketFilter({
                    data: values,
                })
            );
        } else {
            dispatch(
                AppliedPerformanceBucketFilter({
                    data: null,
                })
            );
        }
        setFilter(prevFilter => ({
            ...prevFilter,
            CondiFinalSourcing1: values  // Use the updated 'values' instead of 'PerformanceBuckerArr'
        }));
    };

    const GetPerformanceBucketData = (value) => {
        if (filter.CondiFinalSourcing1.includes(value)) {
            return true
        }
    }

    const SetPerformanceBucketForAPI = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            CondiFinalSourcing1: PerformanceBuckerArr
        }));
        SetTrigger(!Trigger)
        DropDownController('All')
    }
    /*  Performance Bucket Filter Effect Function*/


    /* FAD Year Filter Effect Function*/
    const GetFadYearDataBar = () => {
        if (!FADYearDropDown) {
            SetSpinnerQuickFilters(true)
            let ColorBaseUrl = LIVE_URL + 'commonFilters'
            let payload = { ...modifiedFilter } // create a copy of modifiedFilter object
            if (payload['FADYear']) {
                delete payload['FADYear'] // remove the key from payload if it exists in modifiedFilter
            }
            if (IsSearchActive) {
                payload.keyword = SearchKey
                payload.field = SourceKey
            }
            payload.keyName = "FADYear"
            axios.post(ColorBaseUrl, payload).then((response) => {
                if (response.status) {
                    SetSpinnerQuickFilters(false)
                    SetFadYearData(response.data.data)
                    AppliedFadYearFilter(
                        ({
                            data: response.data.data,
                        })
                    )
                }
            }).catch((err => {
                SetSpinnerQuickFilters(false)
                console.log(err)
            }))
        }
    }
    const SetFadYearFilterData = () => {
        let checkboxes = document.querySelectorAll('input[name="fadCheckboc"]:checked');
        let values = [];
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
        SetFadArr(values)
        if (values.length) {
            dispatch(
                AppliedFadYearFilter({
                    data: values,
                })
            );
        } else {
            dispatch(
                AppliedFadYearFilter({
                    data: null,
                })
            );
        }
        setFilter(prevFilter => ({
            ...prevFilter,
            FADYear: values
        }));
    }
    const GetFadYearFilterChecked = (value) => {
        if (filter.FADYear.includes(JSON.stringify(value))) {
            return true
        }
    }

    const SetFadYearForAPI = () => {
        setFilter(prevFilter => ({
            ...prevFilter,
            FADYear: FadArr
        }));
        SetTrigger(!Trigger)
        DropDownController('All')
    }
    /* FAD Year Filter Effect Function*/


    /*NOTE: VERY IMPORTANT LOGIC FOR FINAL PAYLOAD CARRY WITH CARE*/
    const filteredFilter = Object.entries(filter).reduce((acc, [key, value]) => {
        if (
            (Array.isArray(value) && value.length > 0) ||
            key === 'page' ||
            key === 'pagesize' ||
            key === 'sort' ||
            key === 'order' ||
            key === 'keyword' ||
            key === 'field'
        ) {
            if (key === 'PoAttributes') {
                const filteredPoAttributes = value.filter(obj => {
                    const innerValues = Object.values(obj)[0];
                    return Array.isArray(innerValues) && innerValues.length > 0;
                });

                if (filteredPoAttributes.length > 0) {
                    acc[key] = filteredPoAttributes;
                }
            } else if (key === 'Potypes') {
                const filteredPotypes = value.filter(obj => {
                    const innerValues = Object.values(obj)[1];
                    return Array.isArray(innerValues) && innerValues.length > 0;
                });

                if (filteredPotypes.length > 0) {
                    acc[key] = filteredPotypes;
                }
            } else {
                if (key.startsWith('_')) {
                    const formattedKey = key.substring(1); // Remove the underscore "_" from the key
                    acc[formattedKey] = value;
                } else {
                    acc[key] = value;
                }
            }
        }

        return acc;
    }, {});

    const modifiedFilter = Object.entries(filteredFilter).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
            const modifiedValue = value.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return Object.fromEntries(
                        Object.entries(item).map(([k, v]) => {
                            if (v === 'Above') {
                                return [k, null];
                            }
                            return [k, v];
                        })
                    );
                }
                return item;
            });

            acc[key] = modifiedValue;
        } else {
            acc[key] = value;
        }

        return acc;
    }, {});
    /*NOTE: VERY IMPORTANT LOGIC FOR FINAL PAYLOAD CARRY WITH CARE*/


    React.useEffect(() => {
        dispatch(
            AppliedParentJson({
                data: filter
            })
        )
        localStorage.setItem("JsonData", JSON.stringify(filter))
        setLoader(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (IsSearchActive) {
            // Perform global search
            let searchUrl = LIVE_URL + 'globalSearch';
            const payload = modifiedFilter;
            payload.keyword = SearchKey
            payload.field = SourceKey
            axios
                .post(searchUrl, payload)
                .then((response) => {
                    if (response.data.status) {
                        if (response.data.status_code === '614') {
                            setProductData([]);
                            SetProductTotalCount(0);
                        } else {
                            setProductData(response.data.data);
                            SetProductTotalCount(response.data.rowcount);
                        }
                    } else {
                        if (response.data.status_code == '605') {
                            setProductData([]);
                            setNotificationKey(notificationKey + 1);
                            setNotificationMessage('Exception.');
                            setNotificationType('failed');
                        } else {
                            setProductData([]);
                            setNotificationKey(notificationKey + 1);
                            setNotificationMessage('Failed With Applied Filters!.');
                            setNotificationType('failed');
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoader(false);
                });
        } else {
            // Perform getProducts
            let productUrl = LIVE_URL + 'getProducts';
            const payload = modifiedFilter;
            axios
                .post(productUrl, payload)
                .then((response) => {
                    if (response.data.status) {
                        if (response.data.status_code === '614') {
                            setProductData([]);
                            SetProductTotalCount(0);
                        } else {
                            const likedProducts = localStorage.getItem("LikedProducts");

                            const updatedProductData = response.data.data.map(obj => {
                                const isLiked = likedProducts && likedProducts.split(",").includes(obj.Style);
                                return {
                                    ...obj,
                                    isLiked: isLiked || false
                                };
                            });

                            setProductData(updatedProductData);
                            SetProductTotalCount(response.data.rowcount);
                            if (localStorage.getItem('IsGenderFilterOpen') === 'False') {
                                SetShowGenderFilter(true)
                            }
                        }
                    } else {
                        if (response.data.status_code == '605') {
                            setProductData([]);
                            setNotificationKey(notificationKey + 1);
                            setNotificationMessage('Exception.');
                            setNotificationType('failed');
                        } else {
                            setProductData([]);
                            setNotificationKey(notificationKey + 1);
                            setNotificationMessage('Failed With Applied Filters!.');
                            setNotificationType('failed');
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoader(false);
                });
        }
    }, [
        Trigger,
        GenderArr,
        BasicFilterArr,
        BasicOrderFilterArr,
        IsSearchActive,
        /*  store.getState().ProductSaveFilter.data*/
    ]);
    /* Main Function For Getting Data For Products */
    const SetBasicFilterFunction = (value, sort) => {
        setFilter((prevState) => ({
            ...prevState,
            sort: value,
            order: sort,
        }))
        SetBasicFilterArr(value)
        SetBasicOrderFilterArr(sort)
    }
    const ClearSortFunction = () => {
        setFilter((prevState) => ({
            ...prevState,
            sort: '',
            order: '',
        }))
        SetBasicFilterArr('SORT')
        SetBasicOrderFilterArr('DESC')
    }
    const HideNextFilterFunction = (ext) => {
        if (ext === 'GENDER') {
            SetShowBasicFilter(false)
            SetShowMainFilter(false)
        }
        if (ext === 'BASIC') {
            SetShowGenderFilter(false)
            SetShowMainFilter(false)
        }
        if (ext === 'MAIN') {
            SetShowGenderFilter(false)
            SetShowBasicFilter(false)
        }
        if (ext === 'HIDEALL') {
            SetShowGenderFilter(false)
            SetShowBasicFilter(false)
            SetShowMainFilter(false)
        }
    }
    const GetMainDataForFilters = (key1, key2) => {
        SetDynamicFilterStaticValueData(key1)
        SetDynamicFilterStaticValueData1(key2)
        if (key1 === 'topbottom' || key2 === 'topbottom') {
            SetDynamicFilterStaticValueData('topbottom')
            SetStaticFilterRes(TopBottomArr)
        } else if (key1 === 'B2BMixPercent' || key2 === 'B2BMixPercent') {
            SetStaticFilterRes(B2BMixPercentArr)
        } else {
            SetSpinnerMainFilter(true)
            let ColorBaseUrl = LIVE_URL + 'commonFilters'
            let payload = { ...modifiedFilter } // create a copy of modifiedFilter object
            if (key1 === 'CategoryID' || 'SubCategoryID' || 'BrandID') {
                if (payload[key1]) {
                    delete payload[key1] // remove the key from payload if it exists in modifiedFilter
                } else {
                    if (payload[key2]) {
                        delete payload[key2] // remove the key from payload if it exists in modifiedFilter
                    }
                }
            }

            if (IsSearchActive) {
                payload.keyword = SearchKey
                payload.field = SourceKey
            }
            payload.keyName = key2
            payload.keyID = key1
            axios.post(ColorBaseUrl, payload).then((response) => {
                if (response.status) {
                    SetSpinnerMainFilter(false)
                    console.log('setting data for ', key1);
                    SetStaticFilterRes(response.data.data)
                    if(key1 === 'BrandID'){
                        setFilteredData(response.data.data);
                    }else{
                        setFilteredData([])
                    }

                    window.scrollTo({ top: 0, behavior: 'smooth' })
                } else {
                    SetSpinnerMainFilter(false)
                    // handle error case
                }
            }).catch((err => {
                SetStaticFilterRes([])
                SetSpinnerMainFilter(false)
                console.log(err)
            }))
        }
    }
    const handleOptionChange = (option, Key, Source) => {
        const updatedFilter = { ...filter }; // Create a copy of the filter object
        if (Source === 'B2BMixPercent') {
            if (option === 'Yes') {
                if (updatedFilter.B2BMixPercent[0] === 'Yes') {
                    updatedFilter.B2BMixPercent = [];
                } else {
                    updatedFilter.B2BMixPercent = ['Yes'];
                }
            } else if (option === 'No') {
                if (updatedFilter.B2BMixPercent[0] === 'No') {
                    updatedFilter.B2BMixPercent = [];
                } else {
                    updatedFilter.B2BMixPercent = ['No'];
                }
            }
        } else {
            if (option === 'Yes') {
                if (updatedFilter.LiveStyle[0] === 'Yes') {
                    updatedFilter.LiveStyle = [];
                } else {
                    updatedFilter.LiveStyle = ['Yes'];
                }
            } else if (option === 'No') {
                if (updatedFilter.LiveStyle[0] === 'No') {
                    updatedFilter.LiveStyle = [];
                } else {
                    updatedFilter.LiveStyle = ['No'];
                }
            }
        }
        SetTrigger(!Trigger);
        setFilter(updatedFilter);
    }


    const handleOptionChangeReplishment = (option, Key, Source) => {
        const updatedFilter = { ...filter }; // Create a copy of the filter object
        if (Source === "Replainshment") {
            if (option === 'Yes') {
                if (updatedFilter.Replainshment[0] === 'Yes') {
                    updatedFilter.Replainshment = [];
                } else {
                    updatedFilter.Replainshment = ['Yes'];
                }
            }
            if (option === 'No') {
                if (updatedFilter.Replainshment[0] === 'No') {
                    updatedFilter.Replainshment = [];
                } else {
                    updatedFilter.Replainshment = ['No'];
                }
            }
        }

        if (Source === "LiveStyle") {
            if (option === 'Yes') {
                if (updatedFilter.LiveStyle[0] === 'Yes') {
                    updatedFilter.LiveStyle = [];
                } else {
                    updatedFilter.LiveStyle = ['Yes'];
                }
            }
            if (option === 'No') {
                if (updatedFilter.LiveStyle[0] === 'No') {
                    updatedFilter.LiveStyle = [];
                } else {
                    updatedFilter.LiveStyle = ['No'];
                }
            }
        }

        SetTrigger(!Trigger);
        setFilter(updatedFilter);
    }
    const updateProductData = (data, SearchKey) => {
        if (SearchKey === 'Reset' || SearchKey === '') {
            SetSearchKey('')
            SetSourceKey('')
            SetIsSearchActive(false)
            setFilter({
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
                Potypes: [],
                PoAttributes: [],
                sort: 'TotalRPT',
                order: 'DESC',
                page: 1,
                pagesize: 100
            })
            SetTrigger(!Trigger)
        } else {
            SetSearchKey(SearchKey)
            SetSourceKey(data.sourceKey)
            SetIsSearchActive(true)
            setFilter({
                keyword: SearchKey,
                field: data.sourceKey,
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
                Potypes: [],
                PoAttributes: [],
                sort: 'TotalRPT',
                order: 'DESC',
                page: 1,
                pagesize: 10
            })
            SetTrigger(!Trigger)
        }
    }
    const GetLikedStatusByStyle = (Style) => {
        const likedProducts = localStorage.getItem("LikedProducts");
        return likedProducts && likedProducts.split(",").includes(Style);
    };
    const GetFixedValue = (value) => {
        if (typeof value === "string") {
            if (!isNaN(parseFloat(value))) {
                const floatValue = parseFloat(value);
                return parseFloat(floatValue.toFixed(2));
            }
        } else if (typeof value === "number") {
            if (value.toString().includes(".")) {
                const floatValue = parseFloat(value);
                return parseFloat(floatValue.toFixed(2));
            } else {
                return value;
            }
        }
        return value;
    };
    const GetCodiFinalFilter = (key) => {
        const searchStrings = ['Give More Impressions', 'GiveMoreImpressions', 'GiveMore Impressions'];
        const replaceString = 'GMI';

        for (const searchString of searchStrings) {
            if (key.includes(searchString)) {
                key = key.replace(searchString, replaceString);
                break;
            }
        }
        return key;
    };

    const convertRange = (range) => {
        if (range.includes('Above')) {
            return range; // Return the range value as it is if it includes "Above"
        }

        const [min, max] = range.split('-'); // Split the range values by hyphen

        // Check if the values are valid numbers
        const isValidRange = !isNaN(parseFloat(min)) && !isNaN(parseFloat(max));

        if (isValidRange) {
            const hasDecimal = min.includes('.') || max.includes('.'); // Check if either value has a decimal

            // Convert the range values based on the presence of decimal
            let convertedMin = parseFloat(min) * 100; // Convert to percentage
            let convertedMax = parseFloat(max) * 100; // Convert to percentage

            if (!hasDecimal) {
                convertedMin = parseInt(min); // Convert to integer
                convertedMax = parseInt(max); // Convert to integer
            }

            // Add the appropriate unit
            const unit = hasDecimal ? 'M' : 'Y';

            // Return the formatted range
            return `${convertedMin}-${convertedMax} ${unit}`;
        } else {
            return 'Invalid Range';
        }
    }

    /*Page UI Components*/

    const DropDownComponent = () => {
        // JSX code for the DropDownComponent
        return (
            <div>
                {/*Top DropDown UI*/}
                <div className='dropdown-container'>
                    <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle id="dropdown-autoclose-true" className='FilterButtons'
                                         onClick={(e) => {
                                             DropDownController('Color')
                                             HideNextFilterFunction('HIDEALL')
                                         }}>
                            Color
                        </Dropdown.Toggle>
                    </Dropdown>
                    <Dropdown align='start' className="d-inline mx-2" autoClose='outside'>
                        <Dropdown.Toggle id="dropdown-autoclose-outside" className='FilterButtons'
                                         onClick={(e) => {
                                             DropDownController('BrandType')
                                             HideNextFilterFunction('HIDEALL')
                                         }}>
                            Brand Type
                        </Dropdown.Toggle>
                    </Dropdown>
                    <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle id="dropdown-autoclose-true" className='FilterButtons'
                                         onClick={(e) => {
                                             DropDownController('FADYear')
                                             HideNextFilterFunction('HIDEALL')
                                         }} onDoubleClick={(e) => {
                            DropDownController('All')
                        }}>
                            FAD Year
                        </Dropdown.Toggle>

                    </Dropdown>
                    <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle id="dropdown-autoclose-true" className='FilterButtons'
                                         onClick={(e) => {
                                             DropDownController('FADMonth')
                                             HideNextFilterFunction('HIDEALL')
                                         }} onDoubleClick={(e) => {
                            DropDownController('All')
                        }}>
                            FAD Month
                        </Dropdown.Toggle>
                    </Dropdown>
                    <Dropdown className="d-inline mx-2">
                        <Dropdown.Toggle id="dropdown-autoclose-true" className='FilterButtons'
                                         onClick={(e) => {
                                             DropDownController('PerformanceBucket')
                                             HideNextFilterFunction('HIDEALL')
                                         }} onDoubleClick={(e) => {
                            DropDownController('All')
                        }}>
                            Performance Bucket
                        </Dropdown.Toggle>
                    </Dropdown>
                </div>
                <div>
                    {ColorDropDown === true ? <div className='dropdown_res_class'>
                        <Container style={{ height: '140px', overflowY: 'scroll' }}>
                            <div className='DropDownSetupClass'>
                                {SpinnerQuickFilters === true ? <> <Spinner animation="border" role="status"
                                                                            className='spinnerCustomCSS'>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner></> : <> {ColorData.map((data => {
                                    return (<Col className="p-2 d-flex flex-column col-6" key={data.id}>
                                        <div className='d-flex'>
                                            <input type='checkbox' className='mr-1 basic_margin'
                                                   name='Color'
                                                   value={data.SiteColor}
                                                   onChange={SetColorFilterData}
                                                   checked={GetColorFilterChecked(data.SiteColor)} />
                                            <div
                                                key={data.id}
                                                style={{
                                                    backgroundColor: data.ColorHex,
                                                    height: '15px',
                                                    width: '15px',
                                                    marginRight: '5px'
                                                }}>
                                            </div>
                                            <span style={{
                                                fontSize: '10px',
                                                marginRight: '5px'
                                            }}>{data.SiteColor}</span>
                                            <span style={{
                                                fontSize: '10px',
                                                color: 'blue'
                                            }}>{data.doc_count}</span>
                                        </div>
                                    </Col>)
                                }))}</>}
                            </div>
                        </Container>
                        <div className='Flex_EndClass'>
                            <Button className='DoneActionButton' onClick={SetColorForAPI}
                                    variant="success">APPLY</Button>{' '}
                        </div>
                    </div> : <></>}
                    {BrandTypeDropDown === true ? <div className='dropdown_res_class' style={{ left: '12%' }}>
                        <Container style={{ height: '140px', overflowY: 'scroll' }}>
                            <div className='DropDownSetupClass'>
                                {SpinnerQuickFilters === true ? <> <Spinner animation="border" role="status"
                                                                            className='spinnerCustomCSS'>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner></> : <>    {BrandData.map((data => {
                                    return (<Col className="p-2 d-flex flex-column flex-nowrap col-4"
                                                 key={data.id}>
                                        <div className='d-flex' style={{ alignContent: "baseline" }}>
                                            <input type='checkbox' name='BrandData' value={data.BrandType}
                                                   onChange={SetBrandFilterData}
                                                   checked={GetBrandFilterChecked(data.BrandType)}
                                                   className='mr-1 basic_margin' />
                                            <span style={{
                                                fontSize: '10px',
                                                marginRight: '5px'
                                            }}>{data.BrandType}</span>
                                            <span style={{
                                                fontSize: '10px',
                                                color: 'blue'
                                            }}>{data.doc_count}</span>
                                        </div>
                                    </Col>)
                                }))}</>}
                            </div>
                        </Container>
                        <div className='Flex_EndClass'>
                            <Button className='DoneActionButton' onClick={SetBrandForAPI}
                                    variant="success">APPLY</Button>{' '}
                        </div>
                    </div> : <></>}
                    {FADMonthDropDown === true ? <div className='dropdown_res_class' style={{ left: '48%' }}>
                        <Container style={{ height: '140px', overflowX: 'hidden', overflowY: 'hidden' }}>
                            <div className='DropDownSetupClass'>
                                {SpinnerQuickFilters === true ? <> <Spinner animation="border" role="status"
                                                                            className='spinnerCustomCSS'>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner></> : <> {FadMonthData.map((data => {
                                    return (<Col className="p-2 d-flex flex-column col-4" key={data.id}>
                                        <div className='d-flex'>
                                            <input type='checkbox' className='mr-1 basic_margin'
                                                   name='fadMonth'
                                                   checked={GetFadMonthFilterChecked(data.FADMonth)}
                                                   onChange={SetFadMonthFilterData}
                                                   value={data.FADMonth} />
                                            <span
                                                style={{ fontSize: '14px' }}>{GetMonthNamebyKey(data.FADMonth)}</span>
                                            <span style={{
                                                fontSize: '10px',
                                                marginLeft: '10px',
                                                color: 'blue'
                                            }}>{data.doc_count}</span>
                                        </div>
                                    </Col>)
                                }))}</>}
                            </div>
                        </Container>
                        <div className='Flex_EndClass'>
                            <Button className='DoneActionButton' onClick={SetFadMonthForAPI}
                                    variant="success">APPLY</Button>{' '}
                        </div>
                    </div> : <></>}
                    {FADYearDropDown === true ? <div className='dropdown_res_class' style={{ left: '32%' }}>
                        <Container
                            style={{
                                overflow: 'scroll',
                                overflowX: 'hidden',
                                overflowY: 'hidden',
                                height: '140px'
                            }}>
                            <div className='DropDownSetupClass'>
                                {SpinnerQuickFilters === true ? <> <Spinner animation="border" role="status"
                                                                            className='spinnerCustomCSS'>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner></> : <>{FadYearData.map((data => {
                                    return (<Col className="p-2 d-flex flex-column col-6" key={data.id}>
                                        <div className='d-flex'>
                                            <input type='checkbox' name='fadCheckboc' value={data.FADYear}
                                                   className='mr-1 basic_margin'
                                                   onChange={SetFadYearFilterData}
                                                   checked={GetFadYearFilterChecked(data.FADYear)} />
                                            <div className='d-flex justify-content-between'>
                                                <span style={{ fontSize: '10px' }}>{data.FADYear}</span>
                                                <span style={{
                                                    fontSize: '10px',
                                                    marginLeft: '10px',
                                                    color: 'blue'
                                                }}>{data.doc_count}</span>
                                            </div>
                                        </div>
                                    </Col>)
                                }))}</>}
                            </div>
                        </Container>
                        <div className='Flex_EndClass'>
                            <Button className='DoneActionButton' onClick={SetFadYearForAPI}
                                    variant="success">APPLY</Button>{' '}
                        </div>
                    </div> : <></>}
                    {PerformanceBucket === true ? <div className='dropdown_res_class' style={{ left: '66%' }}>
                        <Container style={{ overflow: 'scroll', overflowX: 'hidden', height: '140px' }}>
                            <div className='DropDownSetupClass'>
                                {SpinnerQuickFilters === true ? <> <Spinner animation="border" role="status"
                                                                            className='spinnerCustomCSS'>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner></> : <>   {PerformanceBucketData.map((data => {
                                    return (<Col className="p-2 d-flex flex-column col-6" key={data.id}>
                                        <div className='d-flex'>
                                            <input type='checkbox' name='CondiFinalSourcing1'
                                                   value={data.CondiFinalSourcing1}
                                                   className='mr-1 basic_margin'
                                                   onChange={SetPerformanceBucketData}
                                                   checked={GetPerformanceBucketData(data.CondiFinalSourcing1)} />
                                            <div className='d-flex justify-content-between'>
                                                    <span
                                                        style={{ fontSize: '10px' }}>{data.CondiFinalSourcing1}</span>
                                                <span style={{
                                                    fontSize: '10px',
                                                    marginLeft: '10px',
                                                    color: 'blue'
                                                }}>{data.doc_count}</span>
                                            </div>
                                        </div>
                                    </Col>)
                                }))}</>}
                            </div>
                        </Container>
                        <div className='Flex_EndClass'>
                            <Button className='DoneActionButton' onClick={SetPerformanceBucketForAPI}
                                    variant="success">APPLY</Button>{' '}
                        </div>
                    </div> : <></>}
                </div>
                {/*Top DropDown UI*/}
            </div>
        );
    };
    const ProductListingComponent = () =>{
        // JSX code for the DropDownComponent
        return (
            <>
                {/*Main Product Listing Section*/}
                <div style={{ minHeight: '90vh' }}>
                    {loader === true ? <><Spinner animation="border" role="status" style={{
                        width: '50px',
                        height: '50px',
                        color: 'blue',
                        position: 'fixed',
                        top: '50%',
                        left: '50%'

                    }}></Spinner></> : <>{productData.length > 0 ? <>
                        <div className='mr-3 ml-3 mb-3 w-100 New_Class' onClick={() => {
                            SetShowMainFilter(false)
                        }}>
                            {productData.map(((data, index) => {
                                /*
                                                                    var imgUrl = PRODUCT_IMG_URL + '300x364/' + data.ProductID[0] + 'a.jpg?' + Math.floor(Math.random() * 90000) + 10000
                                */
                                var imgUrl = PRODUCT_IMG_URL + '300x364/' + data.ProductID[0] + 'a.jpg?'
                                return (
                                    <div
                                        className='d-flex flex-row p-2 p-2 m-2 bg-light hvr-grow card_class-products'
                                        key={data.id}>
                                        <div className='image-container'
                                             style={{ height: '160px', width: '110px' }}>
                                            <img alt="Image" style={{ height: '160px', width: '110px' }}
                                                 src={imgUrl}
                                                 onError={(e) => e.target.src = require('../../assets/images/Default_Image.jpg')} />
                                        </div>
                                        <div style={{ lineHeight: '15px' }}>
                                            <div className='data-container d-flex flex-column p-2 w-100'>
                                                <div className='d-flex justify-content-between'>
                                                    <div>
                                                            <span style={{ fontSize: '10px' }}
                                                                  className='small-text-class'>Style</span>
                                                        <span>{data.Style}</span>
                                                    </div>
                                                    <div className='d-flex align-items-center'>
                                                        {data.LiveStyle === "Yes" ? <> <img alt="Cloud"
                                                                                            className='icon_nav'
                                                                                            src={require('../../assets/images/Online.png')} /></> : <>
                                                            <img alt="Cloud" className='icon_nav'
                                                                 src={require('../../assets/images/Offline.png')} /></>}
                                                        {SpinnerLoading && SpinnerLoadingIndex === index ? (

                                                            <Spinner animation="border" role="status"
                                                                     style={{
                                                                         width: '20px',
                                                                         height: '20px',
                                                                         color: 'blue'
                                                                     }}>
                                                                    <span
                                                                        className="visually-hidden">Loading...</span>
                                                            </Spinner>
                                                        ) : (
                                                            <>
                                                                {GetLikedStatusByStyle(data.Style) ? (
                                                                    <i
                                                                        className="fa fa-heart"
                                                                        style={{
                                                                            fontSize: '20px',
                                                                            color: '#ff3e60',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={(e) => {
                                                                            SetLikeProductToApi(data, index);
                                                                            SetSpinnerLoadingIndex(index)
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i
                                                                        className="fa fa-heart-o"
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            fontSize: '20px'
                                                                        }}
                                                                        onClick={(e) => {
                                                                            SetLikeProductToApi(data, index);
                                                                            SetSpinnerLoadingIndex(index)
                                                                        }}
                                                                    ></i>
                                                                )}
                                                            </>
                                                        )}
                                                        <i className="fa-regular fa-cloud-slash"></i>
                                                    </div>

                                                </div>
                                                <NavLink to="/productinfo"
                                                         style={{ all: 'unset', cursor: 'pointer' }}
                                                         state={{ styleName: data.Style }} onClick={() => {
                                                    localStorage.setItem("IsGenderFilterOpen", 'True');
                                                    SetVisitHistory(data.Style)
                                                }}>
                                                    <h3 className='Product_Name'>{data.ProductName}</h3>


                                                    <div
                                                        className='price-container pl-2 d-flex justify-content-lg-start align-content-center'>
                                                        <strong><span style={{
                                                            fontFamily: 'auto',
                                                            fontSize: '16px'
                                                        }}>₹</span> {data.SellingPrice} |</strong>
                                                        <div className='d-flex align-items-center'>
                                                                <span className='content-card'
                                                                      style={{
                                                                          marginLeft: '5px',
                                                                          textDecorationLine: 'line-through',
                                                                          fontWeight: 'bold'
                                                                      }}>{data.MRP}</span>
                                                            <div className='d-flex align-items-center'>
                                                                    <span className='small-text-class'
                                                                          style={{ marginLeft: '5px' }}> Disc.</span>
                                                                <span className='content-card'
                                                                      style={{
                                                                          fontWeight: 'bold',
                                                                          color: '#ff0000b0'
                                                                      }}>{data.Discount === null || '' ? 0 : GetFixedValue(data.Discount)} % OFF</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className='small-text-class'>Performance Bucket</span>
                                                        <span
                                                            className='content-card'>{GetCodiFinalFilter(data.CondiFinalSourcing2)}</span>
                                                    </div>
                                                    <div
                                                        className='d-flex justify-content-between align-content-center'>
                                                        <div>
                                                            <span className='small-text-class'>FAD</span>
                                                            <span
                                                                className='content-card'>{GetMonthNamebyKey(data.FADMonth)} - {data.FADYear}</span>
                                                        </div>
                                                        <div>
                                                            <span className='small-text-class'>CTR</span>
                                                            <span
                                                                className='content-card'>{GetFixedValue(data.CTR)} %</span>
                                                        </div>
                                                        <div>
                                                            <span className='small-text-class'>NGM</span>
                                                            <span
                                                                className='content-card'>{GetFixedValue(data.NGM)}%</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='d-flex justify-content-between align-content-center'>
                                                        <div>
                                                                <span
                                                                    className='small-text-class'>Total RPT</span>
                                                            <span
                                                                className='content-card'>{data.TotalRPT}</span>
                                                        </div>
                                                        <div>
                                                                <span
                                                                    className='small-text-class'>Total ST</span>
                                                            <span
                                                                className='content-card'>{data.TotalST}</span>
                                                        </div>
                                                        <div>
                                                            <span className='small-text-class'>SR</span>
                                                            <span
                                                                className='content-card'>{data.StyleSRPercent === null ? 0 : GetFixedValue(data.StyleSRPercent)} %</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='d-flex justify-content-between align-content-center'>
                                                        <div className='d-flex'>
                                                            <div>
                                                                <span className='small-text-class'>30 Days ST</span>
                                                                <span
                                                                    className='content-card'>{GetFixedValue(data['30DaysST'])} %</span>
                                                            </div>
                                                            <div>
                                                                    <span className='small-text-class'
                                                                          style={{ marginLeft: '5px' }}>Intake Bucket</span>
                                                                <span
                                                                    className='content-card'>{GetBucketRangeFunction(data.TotalIntakeBucket)}</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {data.OtherStyles.length ?
                                                                <img alt="logo"
                                                                     style={{ height: '20px', width: '20px' }}
                                                                     src={require('../../assets/images/Multicolor_icon.png')} /> : <></>}
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }))}
                        </div>
                        <div>
                            <Pagination
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>{getPageItems()}</Pagination>
                        </div>

                        {/* <DynamicPagination rowCount={10000} filterFilter={modifiedFilter}/>*/}
                    </> : <div style={{ height: '80vh' }}>
                        <div className="center">
                            <span style={{ fontSize: '20px' }}>No Result Found/ Loading Data....!</span>
                            <br />
                            <span style={{ fontSize: '15px' }}>Please try changing one or more filters.</span><span
                            onClick={() => {
                                SetTrigger(!Trigger)
                            }} style={{ color: 'blue', marginLeft: '10px', cursor: 'pointer' }}>Refresh</span>
                        </div>
                    </div>}</>}
                </div>
                {/*Main Product Listing Section*/}
            </>
        )
    }
    const GenderFooterDrop = () =>{
        return(
            <>
                {showGenderFilter === true && localStorage.getItem("IsGenderFilterOpen") === 'False' ?
                    <div className='case_class-1' style={{ position: "sticky", bottom: '0px' }}>
                        <div className='GenderPopUpHeader d-flex justify-content-between'>
                                <span style={{ color: 'blue', cursor: 'pointer', fontSize: '12px' }} onClick={(e) => {
                                    SetShowGenderFilter(!showGenderFilter)
                                    HideNextFilterFunction('GENDER')
                                    DropDownController('All')
                                    localStorage.setItem("IsGenderFilterOpen", 'True')
                                    GetGenderFilterTypeBar()
                                    SetGenderDropDown(!GenderDropDown);
                                }}>CLOSE</span>
                            <span style={{ cursor: 'pointer', fontSize: '12px' }}
                                  onClick={SetGenderFunction}>APPLY</span>
                        </div>
                        <div className='Gender_Footer'>
                            <div className='main-container'>
                                {GenderData !== [] ? <>
                                    {GenderData.map((data, index) => {
                                        return (<div className='d-flex flex-column' key={data.id}>
                                            <div className='d-flex p-2 justify-content-between'>
                                                <div>
                                                    <input type='checkbox' name='GenderFilterCheckBox'
                                                           value={data.Gender}
                                                           ref={(ref) => (checkboxRefs.current[index] = ref)}
                                                           checked={GetGenderFilterChecked(data.Gender)}
                                                           className='' onChange={SetGenderFilterData} />
                                                    <span className='p-2'
                                                          style={{
                                                              fontWeight: 'bold',
                                                              textTransform: 'uppercase',
                                                              cursor: 'pointer',
                                                              fontSize: '12px'
                                                          }}
                                                          onClick={() => handleSpanClick(index)}
                                                    >{data.Gender}</span>
                                                </div>
                                                <span style={{
                                                    fontSize: '12px',
                                                    marginLeft: '10px',
                                                    color: 'blue'
                                                }}>{data.doc_count}</span>
                                            </div>
                                        </div>)
                                    })}</> : <></>}

                            </div>
                        </div>
                    </div> : <></>}
            </>
        )
    }
    const SortFooterFilter = () =>{
        return(
            <>
                {showBasicFilter === true ?
                    <div className='case_class-2' style={{ position: "sticky", bottom: '0px' }}>
                        <div className='GenderPopUpHeader d-flex justify-content-between'>
                                <span style={{ color: 'blue', fontSize: '12px', cursor: 'pointer' }} onClick={(e) => {
                                    SetShowBasicFilter(!showBasicFilter);
                                    HideNextFilterFunction('BASIC')
                                    DropDownController('All')
                                }}>CLOSE</span>
                            <span style={{ cursor: 'pointer', fontSize: '12px' }} onClick={ClearSortFunction}>Clear SORT</span>
                        </div>
                        <div className='Gender_Footer'>
                            <div className='main-container'>
                                {BasicFilterData.map((data => {
                                    return (<div className='d-flex flex-column' key={data.id}>
                                        <div className='d-flex justify-content-between p-2'>
                                                <span className='p-2'
                                                      style={{ fontWeight: 'bold', fontSize: '12px' }}>{data.text}</span>
                                            <div>
                                                    <span className='p-2 fa fa-arrow-down' onClick={(e) => {
                                                        SetBasicFilterFunction(data.value, 'DESC');
                                                        SetShowBasicFilter(false)
                                                    }}></span>
                                                <span className='p-2 fa fa-arrow-up' onClick={(e) => {
                                                    SetBasicFilterFunction(data.value, 'ASC');
                                                    SetShowBasicFilter(false)
                                                }}></span>
                                            </div>
                                        </div>
                                    </div>)
                                }))}
                            </div>
                        </div>
                    </div> : <></>}
            </>
        )
    }







    /* Starting Of Main Filters (Desktop & Mobile) UI Components*/ /*Edit Carefully*/

    /*---------------------------------------------------------------------------------*/
    /*Starting Of Main Filter Mobile UI Components*/

    /*---------------------------------------------------------------------------------*/
    /*-------------------Left Side Bar Components Mobile------------------------------*/

    const BasicCategoryFiltersComponentMobileLeftSideBar = () =>{
        return(
            <>
                {StaticMainFilterData.map((data => {
                    return (
                        <div key={data.id} className='Unset_Nav'>
                            <Nav.Item>
                                {data.keyID !== null ?
                                    <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                    }} eventKey={data.id}>{data.name}
                                        <strong
                                            style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{getFilterLength(data.keyID)}</strong></Nav.Link>
                                    : <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                    }} eventKey={data.id}>{data.name}
                                        <strong
                                            style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{getFilterLength(data.keyName)}</strong></Nav.Link>
                                }
                            </Nav.Item>
                        </div>
                    )
                }))}
            </>
        )
    }
    const DistinctTypesComponentForMobileLeftSideBar = () =>{
        return(
            <>
                {DistinctValueArr !== [] ? <>
                    {DistinctValueArr.map((data => {
                        return (
                            <div key={data.id} className='Unset_Nav'>
                                <Nav.Item>
                                    <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueDataForDistinctTypes(data.key, data)
                                    }} eventKey={data.id}>
                                                                            <span
                                                                                style={{ color: 'blue' }}>{data.key} </span>
                                        <span
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                fontWeight: '100'
                                            }}>{findLengthOfType(data.key)}</span></Nav.Link>
                                </Nav.Item>
                            </div>
                        )
                    }))}
                </> : <></>}
            </>
        )
    }
    const DistinctPoAttributesComponentForMobileLeftSideBar = () =>{
        return(
            <>
                {/*PO Attributes Code*/}
                <nav className="animated bounceInDown">
                    <ul>
                        <li className="sub-menu">
                            <a onClick={handleSubMenuToggle}>
                                PO Attributes
                                <div
                                    className={`fa ${isSubMenuOpen ? "fa-caret-up" : "fa-caret-down"} right`}></div>
                            </a>
                            {isSubMenuOpen && (
                                <ul>
                                    {POAttributesArr.map((data) => (
                                        <li key={data.key}>
                                            <a onClick={(e) => {
                                                GetDynamicFilterStaticValueDataForDistinctTypesPO(data.key, data)
                                            }}>{data.key} <strong style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{findLengthOfPoAttributes(data.key)}</strong></a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
                {/*PO Attributes Code*/}
            </>
        )
    }
    const RangeFiltersComponentForMobileLeftSideBar = () =>{
        return(
            <>
                {StaticMainFilterData1.map((data => {
                    return (
                        <div key={data.id} className='Unset_Nav'>
                            <Nav.Item>
                                {data.isRange ? <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueDataRange(data.keyID)
                                    }} eventKey={data.id}>{data.name} <strong
                                        style={{
                                            float: 'right',
                                            fontWeight: '100'
                                        }}>{getFilterLength(data.keyID)}</strong></Nav.Link>
                                    : <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                    }} eventKey={data.id}>{data.name}
                                        <strong
                                            style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{getFilterLength(data.keyName)}</strong></Nav.Link>
                                }
                            </Nav.Item>
                        </div>
                    )
                }))}
            </>
        )
    }
    const MainFilterMobileLeftSideBar = () =>{
        return (
            <>
                <Col style={{ paddingRight: '0px' }}>


                    <Nav variant="pills" className="FilterCol-1">

                        {/*Main Section For Filter Division*/}

                        <BasicCategoryFiltersComponentMobileLeftSideBar/>
                        <DistinctTypesComponentForMobileLeftSideBar/>
                        <DistinctPoAttributesComponentForMobileLeftSideBar/>
                        <RangeFiltersComponentForMobileLeftSideBar/>

                        {/*Main Section For Filter Division*/}
                    </Nav>
                </Col>
            </>
        )
    }

    /*---------------------------------------------------------------------------------*/
    /*-------------------Left Side Bar Components Mobile------------------------------*/

    /*---------------------------------------------------------------------------------*/
    /*-------------------Right Side Bar Components Mobile-----------------------------*/
    const MainFilterMobileRightSideBarDistinctTypesAndPoAttributesCode = () =>{
        return(
            <div>
                {StaticFilterRes.map(((data, index) => {
                    return (
                        <div key={data.id}>
                            {TriggerDistinctTypePO ? <div>
                                <div
                                    className='listGeResOnCLick d-flex justify-content-between'>
                                    <div
                                        className='d-flex align-content-center'>
                                        <input type="checkbox"
                                               style={{ marginRight: '10px' }}
                                               name={DynamicFilterStaticValueDataDistinctTypePO}
                                               id={`${DynamicFilterStaticValueDataDistinctTypePO}_${index}`}
                                               value={data.key}
                                               checked={
                                                   filter.PoAttributes.some(
                                                       (attr) =>
                                                           attr[DynamicFilterStaticValueDataDistinctTypePO] &&
                                                           attr[DynamicFilterStaticValueDataDistinctTypePO].includes(data.key) // updated checked logic
                                                   )
                                               }
                                               onChange={(e) => {
                                                   handleCheckboxChangeDistinctType(e, 'DistinctPO')
                                               }}
                                        />
                                        <span>{data.key}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        marginLeft: '10px',
                                        color: 'blue'
                                    }}>{data.doc_count}</span>
                                </div>
                            </div> : <div key={data.id}>
                                <div
                                    className='listGeResOnCLick d-flex justify-content-between'>
                                    <div
                                        className='d-flex align-content-center'>
                                        <input type="checkbox"
                                               style={{ marginRight: '10px' }}
                                               name={DynamicFilterStaticValueDataDistinctType}
                                               id={`${DynamicFilterStaticValueDataDistinctType}_${index}`}
                                               value={data.key}
                                               checked={
                                                   filter.Potypes.some(
                                                       (potype) => potype.type === DynamicFilterStaticValueDataDistinctType && potype.value.includes(data.key)
                                                   )
                                               }
                                               onChange={(e) => {
                                                   handleCheckboxChangeDistinctType(e, 'Distinct')
                                               }}
                                        />
                                        <span>{data.key}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        marginLeft: '10px',
                                        color: 'blue'
                                    }}>{data.doc_count}</span>
                                </div>
                            </div>}
                        </div>
                    )
                }))}
            </div>
        )
    }
    const MainFilterMobileRightSideAllFilterCode = () =>{
        return(
            <div>
                {StaticFilterRes.map(((data, index) => {
                    return (
                        <div key={data.id}>
                            <div
                                className='listGeResOnCLick d-flex justify-content-between'>
                                <div
                                    className='d-flex align-content-center'>
                                    {DynamicFilterStaticValueData === null ?
                                        <div>
                                            {DynamicFilterStaticValueData === 'CategoryID' || DynamicFilterStaticValueData === 'SubCategoryID' || DynamicFilterStaticValueData === 'BrandID' ? <>
                                                    <input
                                                        type="checkbox"
                                                        style={{ marginRight: '10px' }}
                                                        name={DynamicFilterStaticValueData1}
                                                        id={`${DynamicFilterStaticValueData1}_${index}`}
                                                        value={Object.values(data)[0]}
                                                        checked={filter[DynamicFilterStaticValueData1].includes(Object.values(data)[1])}
                                                        onChange={(e) => {
                                                            handleCheckboxChange(e, data)
                                                        }}
                                                    />
                                                </> :
                                                <>
                                                    {DynamicFilterStaticValueData1 === 'B2BMixPercent' ? <>

                                                        <div
                                                            className='d-flex flex-column'>
                                                            <label
                                                                style={{ padding: '10px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    name="option"
                                                                    value="Yes"
                                                                    style={{ marginRight: '10px' }}
                                                                    checked={DynamicFilterStaticValueData1 === "B2BMixPercent" ? filter.B2BMixPercent.includes('Yes') : filter.LiveStyle.includes('Yes')}
                                                                    onChange={() => handleOptionChange('Yes', 'Desktop', DynamicFilterStaticValueData1)}
                                                                />
                                                                YES
                                                            </label>

                                                            <label
                                                                style={{ padding: '10px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    name="option"
                                                                    value="No"
                                                                    style={{ marginRight: '10px' }}
                                                                    checked={DynamicFilterStaticValueData1 === "B2BMixPercent" ? filter.B2BMixPercent.includes('No') : filter.LiveStyle.includes('No')}
                                                                    onChange={() => handleOptionChange('No', 'Desktop', DynamicFilterStaticValueData1)}
                                                                />
                                                                NO
                                                            </label>
                                                        </div>


                                                    </> : <>
                                                        {DynamicFilterStaticValueData1 === 'Replainshment' || DynamicFilterStaticValueData1 === 'LiveStyle' ? <>
                                                            <div
                                                                key={data.id}
                                                                className='d-flex flex-column'>
                                                                <label
                                                                    style={{ padding: '10px' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="option"
                                                                        value="Yes"
                                                                        style={{
                                                                            marginRight: '10px',
                                                                            padding: '10px'
                                                                        }}
                                                                        checked={
                                                                            (DynamicFilterStaticValueData1 === "Replainshment" && filter.Replainshment.includes(data[DynamicFilterStaticValueData1])) ||
                                                                            (DynamicFilterStaticValueData1 === "LiveStyle" && filter.LiveStyle.includes(data[DynamicFilterStaticValueData1]))
                                                                        }
                                                                        onChange={() => handleOptionChangeReplishment(data[DynamicFilterStaticValueData1], 'Desktop', DynamicFilterStaticValueData1)}
                                                                    />
                                                                    {data[DynamicFilterStaticValueData]}
                                                                </label>
                                                            </div>
                                                        </> : <>
                                                            <input
                                                                type="checkbox"
                                                                style={{ marginRight: '10px' }}
                                                                name={DynamicFilterStaticValueData1}
                                                                id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                value={Object.values(data)[0]}
                                                                checked={GetCatFilterChecked(Object.values(data)[0], 'BaseKeys')}
                                                                onChange={(e) => {
                                                                    handleCheckboxChange(e, data)
                                                                }}
                                                            /></>}
                                                    </>}
                                                </>}
                                        </div> :
                                        <div>
                                            {/* mobile filter list item */}
                                            {DynamicFilterStaticValueData === 'CategoryID' || DynamicFilterStaticValueData === 'SubCategoryID' || DynamicFilterStaticValueData === 'BrandID' ?
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        style={{ marginRight: "10px" }}
                                                        name={DynamicFilterStaticValueData}
                                                        id={`${DynamicFilterStaticValueData}_${index}`}
                                                        value={Object.values(data)[0]}
                                                        checked={GetCatFilterChecked(Object.values(data)[0], 'CatKeys')}
                                                        onChange={(e) => {
                                                            handleCheckboxChange(e, data);
                                                        }}
                                                    />
                                                </> :
                                                <>
                                                    {(DynamicFilterStaticValueData === "30daysRPT" || DynamicFilterStaticValueData === "30DaysST" || DynamicFilterStaticValueData === "90daysRPT" || DynamicFilterStaticValueData === "90DaysST") ? <>
                                                        <input
                                                            type="checkbox"
                                                            style={{ marginRight: "10px" }}
                                                            name={'_' + DynamicFilterStaticValueData}
                                                            id={`${'_' + DynamicFilterStaticValueData}_${index}`}
                                                            value={Object.values(data)[1]}
                                                            checked={
                                                                filter['_' + DynamicFilterStaticValueData].some((val) =>
                                                                    val.hasOwnProperty("from") && val.hasOwnProperty("to")
                                                                        ? `${val.from}-${val.to}` === data.range
                                                                        : val === Object.values(data)[1]
                                                                )
                                                            }
                                                            onChange={(e) => {
                                                                handleCheckboxChange(e, data, 'Desktop');
                                                            }}
                                                        />
                                                    </> : <>
                                                        {DynamicFilterStaticValueData === 'topbottom' ? <>
                                                            <input
                                                                type="checkbox"
                                                                style={{ marginRight: "10px" }}
                                                                name={DynamicFilterStaticValueData1}
                                                                id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                value={Object.values(data)[0]}
                                                                checked={filter.topbottom.includes(data.topbottom)}
                                                                onChange={(e) => {
                                                                    handleCheckboxChangeTopBottom(data, 'Mobile');
                                                                }}
                                                            /></> : <>
                                                            <input
                                                                type="checkbox"
                                                                style={{ marginRight: "10px" }}
                                                                name={DynamicFilterStaticValueData}
                                                                id={`${DynamicFilterStaticValueData}_${index}`}
                                                                value={Object.values(data)[1]}
                                                                checked={
                                                                    filter[DynamicFilterStaticValueData].some((val) =>
                                                                        val.hasOwnProperty("from") && val.hasOwnProperty("to")
                                                                            ? `${val.from}-${val.to}` === data.range
                                                                            : val === Object.values(data)[1]
                                                                    )
                                                                }
                                                                onChange={(e) => {
                                                                    handleCheckboxChange(e, data);
                                                                }}
                                                            /></>}
                                                    </>}
                                                </>}
                                        </div>
                                    }
                                    {PriceRangeFilter !== '' ? (
                                        <div>
                                            {DynamicFilterStaticValueData === 'AgeFrom' ? (
                                                <>
                                                    {data.range ? (
                                                        <span>{convertRange(data.range)}</span>
                                                    ) : (
                                                        <span>Invalid Range</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span>{data.range}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {DynamicFilterStaticValueData === 'InwardMonth' ?
                                                <>
                                                    {DynamicFilterStaticValueData}
                                                    <span>{GetMonthNamebyKey(data[DynamicFilterStaticValueData1])}</span>
                                                </> : <>
                                                    <span>{data[DynamicFilterStaticValueData1]}</span></>}
                                        </div>
                                    )}
                                </div>
                                <span style={{
                                    fontSize: '12px',
                                    marginLeft: '10px',
                                    color: 'blue'
                                }}>{data.doc_count}</span>
                            </div>
                        </div>
                    )
                }))}
            </div>
        )
    }
    const MainFilterMobileRightSideBar = () =>{
        return (
            <>
                <Col style={{ paddingLeft: '0px' }}>
                    <div style={{ overflow: "scroll", overflowY: 'hidden', height: '89vh' }}>
                        {SpinnerMainFilter ? <>
                            <Spinner animation="border" role="status" style={{
                                width: '20px',
                                height: '20px',
                                color: 'blue',
                                margin: '50%'
                            }}>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </> : <>
                            {TriggerDistinctType ? <>
                                {StaticFilterRes.length > 0 ? <>
                                        <MainFilterMobileRightSideBarDistinctTypesAndPoAttributesCode/>
                                    </> :
                                    <>
                                        <div style={{ padding: '10px' }}>
                                            <span>Some Error occurred,</span>
                                            <span> <strong
                                                style={{ color: "blue", cursor: 'pointer' }}
                                                onClick={() => {
                                                    SetTrigger(!Trigger)
                                                }}>Click Here</strong>For Refresh</span>
                                        </div>
                                    </>
                                }
                            </> : <div>
                                {/* search for mobile view */}

                                {DynamicFilterStaticValueData === 'BrandID' ?
                                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%',  padding: '5px',borderWidth:'10px' }}>
                                        <input
                                            style={{ width: '100%', fontSize: '14px', padding: '5px', paddingRight:'0px'}}
                                            type="text"

                                            placeholder="Search"
                                            value={Search}
                                            onChange={handleSearch}>
                                        </input>
                                        <img
                                            style={{  right: '14px' , height:'28px', width:'28px', marginTop: '3px'}}
                                            alt="clear"
                                            onClick={handleSearchClear}
                                            src={require('../../assets/images/clear.png')}
                                        />
                                    </div> : <></>}

                                {DynamicFilterStaticValueData === 'BrandID' ?

                                    filteredData.map(((data, index) => {
                                        return (
                                            <div key={data.id}>
                                                <div
                                                    className='listGeResOnCLick d-flex justify-content-between'>
                                                    <div
                                                        className='d-flex align-content-center'>
                                                        {DynamicFilterStaticValueData === null ?
                                                            <div>

                                                                <input
                                                                    type="checkbox"
                                                                    style={{ marginRight: '10px' }}
                                                                    name={DynamicFilterStaticValueData1}
                                                                    id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                    value={Object.values(data)[0]}
                                                                    checked={filter[DynamicFilterStaticValueData1].includes(Object.values(data)[1])}
                                                                    onChange={(e) => {
                                                                        handleCheckboxChange(e, data, 'Desktop')
                                                                    }}
                                                                />

                                                            </div> :
                                                            <div>

                                                                {/* web filter list item */}

                                                                <input
                                                                    type="checkbox"
                                                                    style={{ marginRight: "10px" }}
                                                                    name={DynamicFilterStaticValueData}
                                                                    id={`${DynamicFilterStaticValueData}_${index}`}
                                                                    value={Object.values(data)[0]}
                                                                    checked={GetCatFilterChecked(Object.values(data)[0], 'CatKeys')}
                                                                    onChange={(e) => {
                                                                        handleCheckboxChange(e, data, 'Desktop');
                                                                    }}
                                                                />

                                                                <span>{data[DynamicFilterStaticValueData1]}</span>

                                                            </div>
                                                        }

                                                    </div>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        marginLeft: '10px',
                                                        color: 'blue'
                                                    }}>{data['doc_count']}</span>
                                                </div>
                                            </div>
                                        )
                                    }))


                                    : <></>

                                }



                                {DynamicFilterStaticValueData !== 'BrandID' ?

                                    StaticFilterRes.length > 0 ? <>
                                        <MainFilterMobileRightSideAllFilterCode/>
                                    </> : <>
                                        <div style={{ padding: '10px' }}>
                                            <span>Some Error occurred,</span>
                                            <span> <strong
                                                style={{ color: "blue", cursor: 'pointer' }}
                                                onClick={() => {
                                                    SetTrigger(!Trigger)
                                                }}>Click Here  </strong>For Refresh</span>
                                        </div>
                                    </>:<></>}

                            </div>}
                        </>}
                    </div>
                </Col>
            </>
        )
    }

    /*---------------------------------------------------------------------------------*/
    /*-------------------Right Side Bar Components Mobile-----------------------------*/

    const MobileMainFilterViewSideBar = () =>{
        return(
            <>
                <div className='class-desktop-view'>
                    <div className='GenderPopUpHeader d-flex justify-content-between'
                         style={{ position: 'sticky', top: '0px' }}>
                                    <span style={{ color: 'blue', fontSize: '12px', cursor: 'pointer' }} onClick={(e) => {
                                        SetShowMainFilter(!showMainFilter);
                                        DropDownController('All')
                                        SetMainFilterHideContent(false)
                                    }}>CLOSE</span>
                        <span style={{ cursor: 'pointer', fontSize: '12px' }}
                              onClick={ClearAllFiltersFunction}>CLEAR ALL</span>
                    </div>
                    {/* <div className='class-desktop-view'>*/} {/*Case Study*/}
                    <div className=''>
                        <Tab.Container id="left-tabs-example" defaultActiveKey={4}>
                            <Row style={{ background: 'white' }}>
                                <MainFilterMobileLeftSideBar/>
                                <MainFilterMobileRightSideBar/>
                            </Row>
                        </Tab.Container>
                    </div>
                    <div className='GenderPopUpHeader d-flex justify-content-around'
                         style={{ position: 'sticky', borderBottom: 'unset', bottom: '0px' }}>
                        <span onClick={CancelMainFilterView}>CANCEL</span>
                        <span onClick={SetTriggerFunction}>SUBMIT</span>
                    </div>
                </div>
            </>
        )
    }

    /*Ending Of Main Filter Mobile UI Components*/
    /*---------------------------------------------------------------------------------*/










    /*---------------------------------------------------------------------------------*/
    /*Starting Of Main Filter Desktop UI Components*/


    /*---------------------------------------------------------------------------------*/
    /*-------------------Left Side Bar Components Desktop------------------------------*/
    const BasicCategoryFiltersComponentDesktopLeftSideBar = () =>{
        return(
            <>
                {StaticMainFilterData.map((data => {
                    return (
                        <div key={data.id} className='Unset_Nav'>
                            <Nav.Item>
                                {data.keyID !== null ?
                                    <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                    }} eventKey={data.id}>{data.name}
                                        <strong
                                            style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{getFilterLength(data.keyID)}</strong></Nav.Link>
                                    : <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                    }} eventKey={data.id}>{data.name}
                                        <strong
                                            style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{getFilterLength(data.keyName)}</strong></Nav.Link>
                                }
                            </Nav.Item>
                        </div>
                    )
                }))}
            </>
        )
    }
    const DistinctTypesComponentForDesktopLeftSideBar  = () =>{
        return(
            <>
                {DistinctValueArr !== [] ? <>
                    {DistinctValueArr.map((data => {
                        return (
                            <div key={data.id} className='Unset_Nav'>
                                <Nav.Item>
                                    <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueDataForDistinctTypes(data.key, data)
                                    }} eventKey={data.id}> <span
                                        style={{ color: 'blue' }}>{data.key} </span>
                                        <span
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                fontWeight: '100'
                                            }}>{findLengthOfType(data.key)}</span></Nav.Link>
                                </Nav.Item>
                            </div>
                        )
                    }))}
                </> : <></>}
            </>
        )
    }
    const DistinctPoAttributesComponentForDesktopLeftSideBar  = () =>{
        return(
            <>
                {/*PO Attributes Code*/}
                <nav className="animated bounceInDown">
                    <ul>
                        <li className="sub-menu">
                            <a onClick={handleSubMenuToggle}>
                                PO Attributes
                                <div
                                    className={`fa ${isSubMenuOpen ? "fa-caret-up" : "fa-caret-down"} right`}></div>
                            </a>
                            {isSubMenuOpen && (
                                <ul>
                                    {POAttributesArr.map((data) => (
                                        <li key={data.key}>
                                            <a onClick={(e) => {
                                                GetDynamicFilterStaticValueDataForDistinctTypesPO(data.key, data)
                                            }}>{data.key} <strong style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{findLengthOfPoAttributes(data.key)}</strong></a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
                {/*PO Attributes Code*/}
            </>
        )
    }
    const RangeFiltersComponentForDesktopLeftSideBar = () =>{
        return(
            <>
                {StaticMainFilterData1.map((data => {
                    return (
                        <div key={data.id} className='Unset_Nav'>
                            <Nav.Item>
                                {data.isRange ? <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueDataRange(data.keyID)
                                    }} eventKey={data.id}>{data.name} <strong
                                        style={{
                                            float: 'right',
                                            fontWeight: '100'
                                        }}>{getFilterLength(data.keyID)}</strong></Nav.Link>
                                    : <Nav.Link onClick={(e) => {
                                        GetDynamicFilterStaticValueData(data.keyID, data.keyName)
                                    }} eventKey={data.id}>{data.name}
                                        <strong
                                            style={{
                                                float: 'right',
                                                fontWeight: '100'
                                            }}>{getFilterLength(data.keyName)}</strong></Nav.Link>
                                }
                            </Nav.Item>
                        </div>
                    )
                }))}
            </>
        )
    }

    const MainFilterDesktopLeftSideBar = () =>{
        return(
            <>
                <Col style={{ paddingRight: '0px' }}>
                    <Nav variant="pills" className="FilterCol-1">

                        {/*  Main Section For Filter Division*/}

                        <BasicCategoryFiltersComponentDesktopLeftSideBar/>
                        <DistinctTypesComponentForDesktopLeftSideBar/>
                        <DistinctPoAttributesComponentForDesktopLeftSideBar/>
                        <RangeFiltersComponentForDesktopLeftSideBar/>

                        {/*Main Section For Filter Division*/}
                    </Nav>
                </Col>
            </>
        )
    }

    /*---------------------------------------------------------------------------------*/
    /*-------------------Left Side Bar Components Desktop------------------------------*/

    /*---------------------------------------------------------------------------------*/
    /*-------------------Right Side Bar Components Desktop-----------------------------*/
    const MainFilterDesktopRightSideBarDistinctTypesAndPoAttributesCode = () =>{
        return(
            <div>
                {StaticFilterRes.map(((data, index) => {
                    return (
                        <div key={data.id}>
                            {TriggerDistinctTypePO ? <div>
                                <div
                                    className='listGeResOnCLick d-flex justify-content-between'>
                                    <div
                                        className='d-flex align-content-center'>
                                        <input
                                            type="checkbox"
                                            style={{ marginRight: "10px" }}
                                            name={`${DynamicFilterStaticValueDataDistinctTypePO}_${data.key}`} // update name attribute
                                            id={`${DynamicFilterStaticValueDataDistinctTypePO}_${index}`}
                                            value={data.key}
                                            checked={
                                                filter.PoAttributes.some(
                                                    (attr) =>
                                                        attr[DynamicFilterStaticValueDataDistinctTypePO] &&
                                                        attr[DynamicFilterStaticValueDataDistinctTypePO].includes(data.key) // updated checked logic
                                                )
                                            }
                                            onChange={(e) => {
                                                handleCheckboxChangeDistinctType(e, "DistinctPO", "Desktop");
                                            }}
                                        />
                                        <span>{data.key}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        marginLeft: '10px',
                                        color: 'blue'
                                    }}>{data.doc_count}</span>
                                </div>
                            </div> : <div key={data.id}>
                                <div
                                    className='listGeResOnCLick d-flex justify-content-between'>
                                    <div
                                        className='d-flex align-content-center'>
                                        <input type="checkbox"
                                               style={{ marginRight: '10px' }}
                                               name={DynamicFilterStaticValueDataDistinctType}
                                               id={`${DynamicFilterStaticValueDataDistinctType}_${index}`}
                                               value={data.key}
                                               checked={
                                                   filter.Potypes.some(
                                                       (potype) => potype.type === DynamicFilterStaticValueDataDistinctType && potype.value.includes(data.key)
                                                   )
                                               }
                                               onChange={(e) => {
                                                   handleCheckboxChangeDistinctType(e, 'Distinct', 'Desktop')
                                               }}
                                        />
                                        <span>{data.key}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        marginLeft: '10px',
                                        color: 'blue'
                                    }}>{data.doc_count}</span>
                                </div>
                            </div>}
                        </div>
                    )
                }))}
            </div>
        )
    }

    const MainFilterDesktopRightSideAllFilterCode = () =>{
        return(
            <>
                {StaticFilterRes.map(((data, index) => {
                    return (
                        <div key={data.id}>
                            <div
                                className='listGeResOnCLick d-flex justify-content-between'>
                                <div
                                    className='d-flex align-content-center'>
                                    {DynamicFilterStaticValueData === null ?

                                        /*Not Able To Create Function Component Dependency Exist*/
                                        /*Filter Code Section For B2BMix,  Replainsment, LifeStyle Filter */

                                        <div>
                                            {DynamicFilterStaticValueData === 'CategoryID' || DynamicFilterStaticValueData === 'SubCategoryID' || DynamicFilterStaticValueData === 'BrandID' ? <>
                                                    <input
                                                        type="checkbox"
                                                        style={{ marginRight: '10px' }}
                                                        name={DynamicFilterStaticValueData1}
                                                        id={`${DynamicFilterStaticValueData1}_${index}`}
                                                        value={Object.values(data)[0]}
                                                        checked={filter[DynamicFilterStaticValueData1].includes(Object.values(data)[1])}
                                                        onChange={(e) => {
                                                            handleCheckboxChange(e, data, 'Desktop')
                                                        }}
                                                    />
                                                </> :
                                                <>
                                                    {DynamicFilterStaticValueData1 === 'B2BMixPercent' ? <>
                                                        <div
                                                            className='d-flex flex-column'>
                                                            <label
                                                                style={{ padding: '10px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    name="option"
                                                                    value="Yes"
                                                                    style={{ marginRight: '10px' }}
                                                                    checked={DynamicFilterStaticValueData1 === "B2BMixPercent" ? filter.B2BMixPercent.includes('Yes') : filter.LiveStyle.includes('Yes')}
                                                                    onChange={() => handleOptionChange('Yes', 'Desktop', DynamicFilterStaticValueData1)}
                                                                />
                                                                <span>Yes</span>
                                                            </label>

                                                            <label
                                                                style={{ padding: '10px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    name="option"
                                                                    value="No"
                                                                    style={{ marginRight: '10px' }}
                                                                    checked={DynamicFilterStaticValueData1 === "B2BMixPercent" ? filter.B2BMixPercent.includes('No') : filter.LiveStyle.includes('No')}
                                                                    onChange={() => handleOptionChange('No', 'Desktop', DynamicFilterStaticValueData1)}
                                                                />
                                                                <span>No</span>
                                                            </label>
                                                        </div>


                                                    </> : <>
                                                        {DynamicFilterStaticValueData1 === 'Replainshment' || DynamicFilterStaticValueData1 === 'LiveStyle' ? <>
                                                            <div
                                                                key={data.id}
                                                                className='d-flex flex-column'>
                                                                <label
                                                                    style={{ padding: '10px' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="option"
                                                                        value="Yes"
                                                                        style={{
                                                                            marginRight: '10px',
                                                                            padding: '10px'
                                                                        }}
                                                                        checked={
                                                                            (DynamicFilterStaticValueData1 === "Replainshment" && filter.Replainshment.includes(data[DynamicFilterStaticValueData1])) ||
                                                                            (DynamicFilterStaticValueData1 === "LiveStyle" && filter.LiveStyle.includes(data[DynamicFilterStaticValueData1]))
                                                                        }
                                                                        onChange={() => handleOptionChangeReplishment(data[DynamicFilterStaticValueData1], 'Desktop', DynamicFilterStaticValueData1)}
                                                                    />
                                                                    <span
                                                                        style={{ padding: '10px' }}>{data[DynamicFilterStaticValueData1]}</span>
                                                                </label>

                                                            </div>
                                                        </> : <>
                                                            <input
                                                                type="checkbox"
                                                                style={{ marginRight: '10px' }}
                                                                name={DynamicFilterStaticValueData1}
                                                                id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                value={Object.values(data)[0]}
                                                                checked={GetCatFilterChecked(Object.values(data)[0], 'BaseKeys')}
                                                                onChange={(e) => {
                                                                    handleCheckboxChange(e, data, 'Desktop')
                                                                }}
                                                            />
                                                        </>}</>}
                                                </>}
                                        </div> :

                                        /*Not Able To Create Function Component Dependency Exist*/
                                        /*Filter Code Section For All RPT ST Filters, Top Bottom Filter */

                                        <div>
                                            {/* web filter list item */}
                                            {DynamicFilterStaticValueData === 'CategoryID' || DynamicFilterStaticValueData === 'SubCategoryID' || DynamicFilterStaticValueData === 'BrandID' ?
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        style={{ marginRight: "10px" }}
                                                        name={DynamicFilterStaticValueData}
                                                        id={`${DynamicFilterStaticValueData}_${index}`}
                                                        value={Object.values(data)[0]}
                                                        checked={GetCatFilterChecked(Object.values(data)[0], 'CatKeys')}
                                                        onChange={(e) => {
                                                            handleCheckboxChange(e, data, 'Desktop');
                                                        }}
                                                    />
                                                </> :

                                                <>
                                                    {(DynamicFilterStaticValueData === "30daysRPT" || DynamicFilterStaticValueData === "30DaysST" || DynamicFilterStaticValueData === "90daysRPT" || DynamicFilterStaticValueData === "90DaysST") ?
                                                        <><input
                                                            type="checkbox"
                                                            style={{ marginRight: "10px" }}
                                                            name={'_' + DynamicFilterStaticValueData}
                                                            id={`${'_' + DynamicFilterStaticValueData}_${index}`}
                                                            value={Object.values(data)[1]}
                                                            checked={
                                                                filter['_' + DynamicFilterStaticValueData].some((val) =>
                                                                    val.hasOwnProperty("from") && val.hasOwnProperty("to")
                                                                        ? `${val.from}-${val.to}` === data.range
                                                                        : val === Object.values(data)[1]
                                                                )
                                                            }
                                                            onChange={(e) => {
                                                                handleCheckboxChange(e, data, 'Desktop');
                                                            }}
                                                        />
                                                        </> : <>
                                                            {DynamicFilterStaticValueData1 === 'topbottom' ? <>
                                                                <input
                                                                    type="checkbox"
                                                                    style={{ marginRight: "10px" }}
                                                                    name={DynamicFilterStaticValueData1}
                                                                    id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                    value={Object.values(data)[0]}
                                                                    checked={filter.topbottom.includes(data.topbottom)}
                                                                    onChange={(e) => {
                                                                        handleCheckboxChangeTopBottom(data, 'Desktop');
                                                                    }}
                                                                />
                                                            </> : <>
                                                                <input
                                                                    type="checkbox"
                                                                    style={{ marginRight: "10px" }}
                                                                    name={DynamicFilterStaticValueData}
                                                                    id={`${DynamicFilterStaticValueData}_${index}`}
                                                                    value={Object.values(data)[1]}
                                                                    checked={
                                                                        filter[DynamicFilterStaticValueData].some((val) =>
                                                                            val.hasOwnProperty("from") && val.hasOwnProperty("to")
                                                                                ? `${val.from}-${val.to}` === data.range
                                                                                : val === Object.values(data)[1]
                                                                        )
                                                                    }
                                                                    onChange={(e) => {
                                                                        handleCheckboxChange(e, data, 'Desktop');
                                                                    }}
                                                                /></>}
                                                        </>}
                                                </>}
                                        </div>
                                    }
                                    {DynamicFilterStaticValueData1 === 'Replainshment' || DynamicFilterStaticValueData1 === 'LiveStyle' ? <></> : <>{PriceRangeFilter !== '' ? (
                                        <div>
                                            {DynamicFilterStaticValueData === 'AgeFrom' ? (
                                                <>
                                                    {data.range ? (
                                                        <span>{convertRange(data.range)}</span>
                                                    ) : (
                                                        <span>Invalid Range</span>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <span>{data.range}</span>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {DynamicFilterStaticValueData1 === 'InwardMonth' || DynamicFilterStaticValueData1 === 'FADMonth' ?
                                                <>
                                                    <span>{GetMonthNamebyKey(data[DynamicFilterStaticValueData1])}</span>
                                                </> : <>
                                                    <span>{data[DynamicFilterStaticValueData1]}</span></>}
                                        </div>
                                    )}</>}
                                </div>
                                <span style={{
                                    fontSize: '12px',
                                    marginLeft: '10px',
                                    color: 'blue'
                                }}>{data['doc_count']}</span>
                            </div>
                        </div>
                    )
                }))}
            </>
        )
    }
    const MainFilterDesktopRightSideBar = () =>{
        return(
            <>
                <Col style={{ paddingLeft: '0px' }}>
                    <div style={{ overflow: "scroll", height: '89vh' }}>
                        {SpinnerMainFilter ? <>
                            <Spinner animation="border" role="status" style={{
                                width: '20px',
                                height: '20px',
                                color: 'blue',
                                margin: '50%'
                            }}>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner></> : <>
                            {TriggerDistinctType ? <>
                                {StaticFilterRes.length > 0 ? <>
                                    <MainFilterDesktopRightSideBarDistinctTypesAndPoAttributesCode/>
                                </> : <>
                                    <div style={{ padding: '10px' }}>
                                        <span>Some Error occurred,</span>
                                        <span> <strong
                                            style={{ color: "blue", cursor: 'pointer' }}
                                            onClick={() => {
                                                SetTrigger(!Trigger)
                                            }}>Click Here  </strong>For Refresh</span>
                                    </div>
                                </>}
                            </> : <div >
                                {/* seach for filters  */}
                                {DynamicFilterStaticValueData === 'BrandID' ?
                                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%',  padding: '5px',borderWidth:'10px' }}>
                                        <input
                                            style={{ width: '100%', fontSize: '14px', padding: '5px', paddingRight:'0px'}}
                                            type="text"

                                            placeholder="Search"
                                            value={Search}
                                            onChange={handleSearch}>
                                        </input>
                                        <img
                                            style={{  right: '14px' , height:'28px', width:'28px', marginTop: '3px'}}
                                            alt="clear"
                                            onClick={handleSearchClear}
                                            src={require('../../assets/images/clear.png')}
                                        />
                                    </div> : <></>}

                                {DynamicFilterStaticValueData === 'BrandID' ?

                                    filteredData.map(((data, index) => {
                                        return (
                                            <div key={data.id}>
                                                <div
                                                    className='listGeResOnCLick d-flex justify-content-between'>
                                                    <div
                                                        className='d-flex align-content-center'>
                                                        {DynamicFilterStaticValueData === null ?
                                                            <div>

                                                                <input
                                                                    type="checkbox"
                                                                    style={{ marginRight: '10px' }}
                                                                    name={DynamicFilterStaticValueData1}
                                                                    id={`${DynamicFilterStaticValueData1}_${index}`}
                                                                    value={Object.values(data)[0]}
                                                                    checked={filter[DynamicFilterStaticValueData1].includes(Object.values(data)[1])}
                                                                    onChange={(e) => {
                                                                        handleCheckboxChange(e, data, 'Desktop')
                                                                    }}
                                                                />

                                                            </div> :
                                                            <div>

                                                                {/* web filter list item */}

                                                                <input
                                                                    type="checkbox"
                                                                    style={{ marginRight: "10px" }}
                                                                    name={DynamicFilterStaticValueData}
                                                                    id={`${DynamicFilterStaticValueData}_${index}`}
                                                                    value={Object.values(data)[0]}
                                                                    checked={GetCatFilterChecked(Object.values(data)[0], 'CatKeys')}
                                                                    onChange={(e) => {
                                                                        handleCheckboxChange(e, data, 'Desktop');
                                                                    }}
                                                                />

                                                                <span>{data[DynamicFilterStaticValueData1]}</span>

                                                            </div>
                                                        }

                                                    </div>
                                                    <span style={{
                                                        fontSize: '12px',
                                                        marginLeft: '10px',
                                                        color: 'blue'
                                                    }}>{data['doc_count']}</span>
                                                </div>
                                            </div>
                                        )
                                    }))


                                    : <></>

                                }

                                {DynamicFilterStaticValueData !== 'BrandID' ?

                                    StaticFilterRes.length > 0 ? <>
                                        <MainFilterDesktopRightSideAllFilterCode/>
                                    </> : <>
                                        <div style={{ padding: '10px' }}>
                                            <span>Some Error occurred,</span>
                                            <span> <strong
                                                style={{ color: "blue", cursor: 'pointer' }}
                                                onClick={() => {
                                                    SetTrigger(!Trigger)
                                                }}>Click Here  </strong>For Refresh</span>
                                        </div>
                                    </>






                                    : <></>
                                }



                                { }
                            </div>}
                        </>}
                    </div>
                </Col>
            </>
        )
    }

    /*---------------------------------------------------------------------------------*/
    /*-------------------Right Side Bar Components Desktop-----------------------------*/

    const DesktopMainFilterViewSideBar = () =>{
        return(
            <>
                <div className='class-desktop-view-1'>
                    <div className='GenderPopUpHeader d-flex justify-content-between'
                         style={{ position: 'sticky', top: '0px' }}>
                                    <span style={{ color: 'blue', fontSize: '12px', cursor: 'pointer' }} onClick={(e) => {
                                        SetShowMainFilter(!showMainFilter);
                                        DropDownController('All')
                                    }}>CLOSE</span>
                        <span style={{ cursor: 'pointer', fontSize: '12px' }}
                              onClick={ClearAllFiltersFunction}>CLEAR ALL</span>
                    </div>
                    <div className=''>
                        <Tab.Container id="left-tabs-example" defaultActiveKey={4}>
                            <Row style={{ background: 'white' }}>
                                <MainFilterDesktopLeftSideBar/>
                                <MainFilterDesktopRightSideBar/>
                            </Row>
                        </Tab.Container>
                    </div>
                    {/* <div className='GenderPopUpHeader d-flex justify-content-around'
                                     style={{position: 'sticky', borderBottom: 'unset', bottom: '0px'}}>
                                    <span onClick={CancelMainFilterView}>CANCEL</span>
                                     <span onClick={SetTriggerFunction}>SUBMIT</span>
                                </div>*/}
                </div>
            </>
        )
    }

    /*Ending Of Main Filter Desktop UI Components*/
    /*---------------------------------------------------------------------------------*/


    /*Main Filter Desktop UI Components*/


    const MainFooterSideBarFilterParantComponent = () =>{
        return(
            <>
                {showMainFilter === true ?
                    <div className='case_class-3'
                         style={{ position: "sticky", bottom: '0px' }}> {/*Case Study*/}
                        <MobileMainFilterViewSideBar/>
                        <DesktopMainFilterViewSideBar/>
                    </div> : <></>}
            </>
        )
    }

    /* Ending Of Main Filters (Desktop & Mobile) UI Components*/ /*Edit Carefully*/








    const FooterController = () =>{
        return(
            <>
                {MainFilterHideContent === false ? <div className='Page-Footer-Filter'>
                        <span
                            className={showGenderFilter === true ? 'Page-Footer-Text text-danger' : 'Page-Footer-Text'}
                            onClick={(e) => {
                                SetShowGenderFilter(!showGenderFilter)
                                HideNextFilterFunction('GENDER')
                                DropDownController('All')
                                localStorage.setItem("IsGenderFilterOpen", 'False')
                                GetGenderFilterTypeBar()
                                SetGenderDropDown(!GenderDropDown);
                            }}>GENDER</span>
                    <span
                        className={showBasicFilter === true ? 'Page-Footer-Text text-danger' : 'Page-Footer-Text'}
                        onClick={(e) => {
                            SetShowBasicFilter(!showBasicFilter);
                            HideNextFilterFunction('BASIC')
                            DropDownController('All')
                            localStorage.setItem("IsGenderFilterOpen", 'True')
                        }}>{BasicOrderFilterArr === 'ASC' ?
                        <span className="fa fa-arrow-up basic_margin" /> :
                        <span className="fa fa-arrow-down basic_margin" />}{BasicFilterArr}</span>
                    {/* <div className='class-desktop-view'>*/} {/*Case Study*/}
                    <div className=''>
                        {showMainFilter === true ? <>
                            <div className='d-flex justify-content-around'
                                 style={{ position: 'sticky', borderBottom: 'unset', bottom: '0px' }}>
                                {/* <span style={{marginRight:'40px'}} onClick={CancelMainFilterView}>CANCEL</span>*/}
                                <span style={{ cursor: "pointer", fontWeight: 'bold', color: 'red' }}
                                      onClick={SetTriggerFunction}>SUBMIT</span>
                            </div>
                        </> : <><span
                            className={showMainFilter === true ? 'Page-Footer-Text text-danger advanced-filter-class' : 'Page-Footer-Text advanced-filter-class'}
                            onClick={(e) => {
                                SetShowMainFilter(!showMainFilter);
                                DropDownController('All')
                                HideNextFilterFunction('MAIN');
                                localStorage.setItem("IsGenderFilterOpen", 'True')
                                GetDynamicFilterStaticValueData(null, 'ProductType')
                            }}>FILTER
                            </span></>}
                        <span
                            className={showMainFilter === true ? 'Page-Footer-Text text-danger advanced-filter-class-1' : 'Page-Footer-Text advanced-filter-class-1'}
                            onClick={(e) => {
                                SetShowMainFilter(!showMainFilter);
                                SetMainFilterHideContent(true)
                                DropDownController('All')
                                {/*Case Study*/
                                }
                                HideNextFilterFunction('MAIN');
                                GetDynamicFilterStaticValueData(null, 'ProductType')
                            }}>FILTER
                            </span>
                    </div>

                </div> : <></>}
            </>
        )
    }

    /*Page UI Components*/

    return (<ErrorBoundary>
        {notificationMessage && (
            <Notification
                message={notificationMessage}
                type={notificationType}
                duration={2000}
                onClose={() => {
                    setNotificationMessage('');
                    setNotificationType('');
                }}
                key={notificationKey} // Pass down the key prop
            />
        )}
        <div className='Product-Listing-Container'>
            {MainFilterHideContent === false ? <TopNavbar updateProductData={updateProductData} /> : <></>}
            <div className='container-view d-flex'>
                <div className='Product-List-Dynamic' style={{ width: 'unset' }}>
                    {/*DropDown UI*/}
                    <DropDownComponent/>
                    {/*DropDown UI*/}

                    {/*Product Listing Slot UI*/}
                    <ProductListingComponent/>
                    {/*Product Listing Slot UI*/}


                    {/*Basic Footer UI*/} {/*Case Study*/}
                    <GenderFooterDrop/>
                    <SortFooterFilter/>
                    <MainFooterSideBarFilterParantComponent/>
                    {/*Basic Footer UI*/}

                    {/*Footer Controller UI*/}
                    <FooterController/>
                    {/*Footer Controller UI*/}

                </div>
            </div>
        </div>
    </ErrorBoundary>)
}