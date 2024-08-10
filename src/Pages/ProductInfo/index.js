import TopNavbar from "../Navbar";
import Table from 'react-bootstrap/Table';
import { useLocation } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import Loader from "../../Components/Loader/Loader";
import { LIVE_URL, PRODUCT_IMG_URL } from "../../env";
import './index.scss'
import '../../HandBook.scss'
import { Carousel } from "react-bootstrap";
import ErrorBoundary from "../../Components/ErrorBoundary";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MonthArray } from "../../Utils/Constants";
import Notification from "../../Components/Notification/Notification";
import Spinner from "react-bootstrap/Spinner";

export default function Productinfo() {
    const GetMonthNamebyKey = (key) => {
        for (let i = 0; i <= MonthArray.length; i++) {
            if (MonthArray[i].key === key) {
                return MonthArray[i].value
            }
        }
    }
    const location = useLocation()
    let [SpinnerLoading, SetSpinnerLoading] = useState(false)
    let [SpinnerLoading1, SetSpinnerLoading1] = useState(false)
    let [SpinnerLoadingIndex, SetSpinnerLoadingIndex] = useState(0)
    let [SpinnerLoadingIndex1, SetSpinnerLoadingIndex1] = useState(0)
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    let [styleName, SetStyleName] = useState(location.state.styleName)
    let [StyleNameIndex, SetStyleNameIndex] = useState(0)
    let baseUrl = LIVE_URL + 'SearchByStyle'
    const [refresh, setRefresh] = useState(false);
    let [ProductData, SetProductData] = useState([])
    let [SaveProductData, SetSaveProductData] = useState([])
    let [OtherTypesData, SetOtherTypesData] = useState([])
    let [CheckResData, SetCheckResData] = useState(false)
    let [loader, setLoader] = useState(false)
    let [ProductImgUrl, SetProductImgUrl] = useState([])

    let [SuggestionProductArr, SetSuggestionProductArr] = useState([])
    let [SuggestionProductArrDate, SetSuggestionProductArrDate] = useState([])
    const GetImagesProduct = (productID) => {
        let baseUrl = `https://cdn.fcglcdn.com/brainbees/jsons/fcimagenames/${productID.ProductID[0]}.json?` + Math.floor(Math.random() * 90000) + 10000
        fetch(baseUrl)
            .then(response => response.json())
            .then(data => {
                const imagesArray = data.images.split(';')
                imagesArray.pop()
                const manipulatedArray = imagesArray.map(imageName => PRODUCT_IMG_URL + `300x364/${imageName}?${Math.floor(Math.random() * 90000) + 10000}`);
                SetProductImgUrl(manipulatedArray);
            }).catch(error => console.error(error));

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


    const ProductSetFailedNotify = () => toast.error("Exception!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });

    const GetBackGroundForStyle = (data) => {
        const colorCode = data.split("-")[1];
        return '#' + colorCode;
    }

    const GetProductsSuggestion = (ResData) => {
        let baseUrl = LIVE_URL + 'getProductSuggestionByFilters'
        var payload = {
            Style: styleName,
            MRP: ResData['MRP'],
            TotalRPT: ResData['TotalRPT'],
            BrandID: ResData['BrandID'],
            ProductType: ResData['ProductType'],
            PatternPrintType: ResData['PatternPrintType'],
            SiteColorID: ResData['SiteColorID'],
            SleeveType: ResData['SleeveLength'],
            pagesize: 10,
        }
        axios.post(baseUrl, payload).then((response) => {
            if (response.status) {
                if (response.data.data.length !== []) {
                    let ResData = response.data.data
                    SetSuggestionProductArr(ResData)
                } else {
                    SetSuggestionProductArr([])
                }
            }
        }).catch((err => {
            console.log(err)
        }))
    }

    const GetProductsSuggestionDate = (ResData) => {
        let baseUrl = LIVE_URL + 'getProductSuggestion'
        var payloadDate = {
            Style: styleName,
            date: ResData['FirstActiveDate'],
            MRP: ResData['MRP'],
            TotalRPT: ResData['TotalRPT'],
            BrandID: ResData['BrandID'],
            ProductType: ResData['ProductType'],
            SleeveType: ResData['SleeveLength'],
            PatternPrintType: ResData['PatternPrintType'],
            SiteColorID: ResData['SiteColorID'],
            pagesize: 10,
        }
        axios.post(baseUrl, payloadDate).then((response) => {
            if (response.status) {
                if (response.data.data.length !== []) {
                    let ResData = response.data.data
                    SetSuggestionProductArrDate(ResData)
                } else {
                    SetSuggestionProductArrDate([])
                }
            }
        }).catch((err => {
            console.log(err)
        }))
    }

    React.useEffect(() => {
        setLoader(true)
        SetCheckResData(false)
        var payload = {
            Style: styleName
        }
        axios.post(baseUrl, payload).then((response) => {
            let ResData = response.data.data[0]
            GetImagesProduct(ResData)
            ResData.OtherStyles.splice(StyleNameIndex, 0, ResData.Style)
            if (response.data.status) {
                SetProductData(ResData)
                SetSaveProductData(ResData)
                SetOtherTypesData(ResData.OtherStyles)
                SetCheckResData(true)

                let imageUrl = []
                for (let i = 0; i < ResData.ProductID.length; i++) {
                    let imgText = String.fromCharCode(97 + i) + ".jpg"; // generates a, b, c, ... for each value of i
                    imageUrl.push({ imageUrl: PRODUCT_IMG_URL + '438x531/' + ResData.ProductID[i] + imgText });
                }
                SetProductImgUrl(imageUrl)
                window.scrollTo({ top: 0, behavior: 'smooth' });
                GetProductsSuggestion(ResData)
                GetProductsSuggestionDate(ResData)
                setLoader(false)
            } else if (response.status_code === '605') {
                ProductSetFailedNotify()
                GetImagesProduct(ResData.ProductID[0])
                SetProductData(SaveProductData)
                SetOtherTypesData(SaveProductData.OtherStyles)
                SetCheckResData(true)
                let imageUrl = []
                for (let i = 0; i < ResData.ProductID.length; i++) {
                    imageUrl[i] = PRODUCT_IMG_URL + '438x531/' + ResData.ProductID[i] + 'a.jpg'
                }
                SetProductImgUrl(imageUrl)
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setLoader(false)
            }
        }).catch((err => {
            setLoader(false)
            console.log(err)
        }))
    }, [styleName])

    const UpdateLatestLikedProducts = (key) => {
        if (key === 0) {
            SetSpinnerLoading(true)
        }
        if (key === 1) {
            SetSpinnerLoading1(true)
        }
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
                    if (key === 0) {
                        SetSpinnerLoading(false)
                    }
                    if (key === 1) {
                        SetSpinnerLoading1(false)
                    }
                } else {
                    if (key === 0) {
                        SetSpinnerLoading(false)
                    }
                    if (key === 1) {
                        SetSpinnerLoading1(false)
                    }
                }
            })
            .catch(() => {
                if (key === 0) {
                    SetSpinnerLoading(false)
                }
                if (key === 1) {
                    SetSpinnerLoading1(false)
                }
            });
    }
    const GetLikedStatusByStyle = (Style) => {
        const likedProducts = localStorage.getItem("LikedProducts");
        return likedProducts && likedProducts.split(",").includes(Style);
    };
    const SetLikeProductToApi = (data, key) => {
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
                    UpdateLatestLikedProducts(key)
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

            });
    };


    var slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

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

    function showSlides(n) {
        setTimeout(() => {
            if (ProductImgUrl.length > 0) {
                var i;
                var slides = document.getElementsByClassName("slides");
                var dots = document.getElementsByClassName("slide-thumbnail");
                if (n > slides.length) {
                    slideIndex = 1
                }
                if (n < 1) {
                    slideIndex = slides.length
                }

                for (i = 0; i < slides.length; i++) {
                    slides[i].style.display = "none";
                    // slides[i].style.display = "inline";
                }
                for (i = 0; i < dots.length; i++) {
                    dots[i].className = dots[i].className.replace(" active", "");
                }
                slides[slideIndex - 1].style.display = "block";
                // slides[slideIndex-1].style.display = "inline";
                dots[slideIndex - 1].className += " active";
            }
        }, 100);

    }

    return (
        <>
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <TopNavbar />
                <ToastContainer />
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
                <Loader status={loader} />
                <div className='class-desktop-view-1'>
                    <div className="main-container p-2 d-flex">
                        {/*   <div style={{width: "40%"}}>
                            <Carousel interval={null} className='custom-width'>
                                {ProductImgUrl.map((data) => {
                                    return (
                                        <Carousel.Item key={data.id}>
                                            <img
                                                className="d-block hvr-grow custom-width"
                                                src={data}
                                                alt='Product_Image'
                                            />
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </div>*/}
                        <div style={{ width: '50%' }}>
                            {ProductImgUrl.length > 0 ? <>
                                <div className="container-image">
                                    <div className="holder">
                                        {ProductImgUrl.map((data, index) => {
                                            return (
                                                <div>
                                                    <div className="slides">
                                                        <img
                                                            onError={(e) => e.target.src = require('../../assets/images/Default_Image.jpg')}
                                                            className='hvr-grow'
                                                            src={data}
                                                            alt="" />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>


                                    <div className="prevContainer"><a className="prev" onClick={() => {
                                        plusSlides(-1)
                                    }}>
                                        <svg viewBox="0 0 24 24">
                                            <path
                                                d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
                                        </svg>
                                    </a></div>
                                    <div className="nextContainer"><a className="next" onClick={() => {
                                        plusSlides(1)
                                    }}>
                                        <svg viewBox="0 0 24 24">
                                            <path
                                                d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
                                        </svg>
                                    </a></div>
                                    <div className="row" style={{ marginTop: '10%' }}>
                                        {ProductImgUrl.map((data, index) => {
                                            return (
                                                <div className="column">
                                                    <img className="slide-thumbnail"
                                                        src={data}
                                                        onClick={() => {
                                                            currentSlide(index + 1)
                                                        }} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </> : <></>}
                        </div>
                        <div className='p-2' style={{ width: '60%' }}>
                            <div className="d-flex flex-column">
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{ProductData.ProductName}</span>
                                <div>
                                    <span style={{
                                        fontSize: '15px',
                                        marginRight: '5px'
                                    }}><strong>Style</strong> - {ProductData.Style}</span>
                                    <span style={{
                                        fontSize: '15px',
                                        marginRight: '5px'
                                    }}><strong>FAD</strong> - {ProductData.FirstActiveDate}</span>
                                    <span style={{
                                        fontSize: '15px',
                                        marginRight: '5px'
                                    }}><strong>Live Month</strong> - {ProductData.FADMonth ? GetMonthNamebyKey(ProductData.FADMonth) : 'N/A'}</span>
                                    <span style={{
                                        fontSize: '15px',
                                        marginRight: '5px'
                                    }}><strong>Live Year</strong> - {ProductData.FADYear ? ProductData.FADYear : 'N/A'}</span>
                                </div>

                            </div>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <span className='p-1' style={{
                                        fontWeight: 'bold',
                                        fontSize: '20px',
                                        color: 'blue'
                                    }}><span style={{
                                        fontFamily: 'auto',
                                        fontSize: '20px',
                                        color: '#003564'
                                    }}>₹</span> <span
                                        style={{ color: '#003564', fontSize: '20px' }}>{ProductData.SellingPrice} </span><span
                                            className=''
                                            style={{ fontSize: '20px', color: 'black' }}>|</span></span>
                                    <span className="" style={{
                                        fontWeight: 'bold',
                                        fontSize: '20px',
                                        textDecoration: 'line-through',
                                        color: '#8080809e'
                                    }}>{ProductData.MRP}</span>
                                    <span className='p-1' style={{ fontWeight: 'bold', fontSize: '20px' }}>|</span>
                                    <span className='p-1' style={{
                                        fontWeight: 'bold',
                                        fontSize: '20px',
                                        color: '#9E9E9E'
                                    }}>Avg. Discount : <strong style={{
                                        fontWeight: 'bold',
                                        color: 'red',
                                        fontSize: '20px'
                                    }}>{ProductData.Discount}% OFF</strong></span>
                                </div>
                                <div>
                                    {ProductData.LiveStyle === "Yes" ? <> <img alt="Cloud" className='icon_nav'
                                        src={require('../../assets/images/Online.png')} /></> : <>
                                        <img alt="Cloud" className='icon_nav'
                                            src={require('../../assets/images/Offline.png')} /></>}
                                </div>
                            </div>
                            <div className="ColorCode_Class d-flex">
                                {OtherTypesData.length ?
                                    <div className="d-flex">
                                        {ProductData.OtherStyles.map((data, index) => (
                                            <div
                                                key={data.id}
                                                style={{
                                                    backgroundColor: GetBackGroundForStyle(data),
                                                    height: '40px',
                                                    width: '40px',
                                                    margin: '10px',
                                                    minWidth: '45px'
                                                }} className={ProductData.Style == data ? 'SetSelectedStyle' : ''}
                                                onClick={(e) => {
                                                    SetStyleName(data)
                                                    SetStyleNameIndex(index)
                                                }}>
                                            </div>
                                        ))}
                                    </div>
                                    :
                                    <></>
                                }
                            </div>
                            <div className=''>
                                <div className='d-flex'>
                                    <Table striped bordered hover className='my-table-responsive-desktop'>
                                        <tbody>
                                            <tr>
                                                <td><span className='textBold'>15 Days RPT</span></td>
                                                <td>{ProductData['15DaysRPT']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>15 Days ST</span></td>
                                                <td>{GetFixedValue(ProductData['15DaysST'])} %</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>30 Days RPT</span></td>
                                                <td>{ProductData['30daysRPT']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>30 Days ST</span></td>
                                                <td>{GetFixedValue(ProductData['30DaysST'])} %</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>60 Days RPT</span></td>
                                                <td>{ProductData['60daysRPT']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>60 Days ST</span></td>
                                                <td>{GetFixedValue(ProductData['60DaysST'])}%</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>90 Days RPT</span></td>
                                                <td>{ProductData['90daysRPT']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>90 Days ST</span></td>
                                                <td>{GetFixedValue(ProductData['90DaysST'])} %</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total RPT</span></td>
                                                <td>{ProductData['TotalRPT']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total ST</span></td>
                                                <td>{GetFixedValue(ProductData['TotalST'])} %</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>NGM</span></td>
                                                <td>{GetFixedValue(ProductData.NGM)} %</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total Intake Bucket</span></td>
                                                <td>{ProductData.TotalIntakeBucket} ({GetBucketRangeFunction(ProductData.TotalIntakeBucket)})</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>B2B SecST</span></td>
                                                <td>{GetFixedValue(ProductData.B2B_secondary_ST)} %</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Last 30Day RPT</span></td>
                                                <td>{ProductData.RPT_last30days}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>PT RPT</span></td>
                                                <td>{GetFixedValue(ProductData.producttypeRPT)}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>SUBCAT RPT</span></td>
                                                <td>{GetFixedValue(ProductData.subcatRPT)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Table striped bordered hover className='my-table-responsive-desktop'>
                                        <tbody>
                                            <tr>
                                                <td><span className='textBold'>Total Sold Qty.</span></td>
                                                <td>{ProductData['TotalSoldQty']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total B2C Sold Qty</span></td>
                                                <td>{ProductData['TotalB2CSoldQty']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total B2B Sold Qty</span></td>
                                                <td>{ProductData['TotalB2BSoldQty']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total Price Sales</span></td>
                                                <td>{ProductData['TotalPriceSales']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>SIH</span></td>
                                                <td>{ProductData['SIH']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total Impressions</span></td>
                                                <td>{ProductData['TotalImpressions']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total CTR</span></td>
                                                <td>{GetFixedValue(ProductData['CTR']) + '%'}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Performance Bucket 1</span></td>
                                                <td>{ProductData['CondiFinalSourcing1']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Performance Bucket 2</span></td>
                                                <td>{ProductData['CondiFinalSourcing2']}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Total Style SR</span></td>
                                                <td>{ProductData['StyleSRPercent'] === null ? 0 + '%' : ProductData['StyleSRPercent'] + '%'}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>SR Reasons Data</span></td>
                                                <td>NA</td>
                                                {/* {ProductData['SRReson']} */}
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Ind Margin</span></td>
                                                <td>{ProductData.IndMargin}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>B2B Sec Sales</span></td>
                                                <td>{ProductData.B2B_secondary_sales}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>Last 6M SR</span></td>
                                                <td>{ProductData.last6months_sr_per} %</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>PT CTR</span></td>
                                                <td>{GetFixedValue(ProductData.PT_CTR)}</td>
                                            </tr>
                                            <tr>
                                                <td><span className='textBold'>SUBCAT CTR</span></td>
                                                <td>{GetFixedValue(ProductData.subcat_CTR)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <div className='product-brief-section'>
                                    <tr>
                                        <td><span className='textBold'>Product Information</span></td>
                                        <td>{ProductData.ProductDesc}</td>
                                    </tr>
                                    <tr>
                                        <td><span className='textBold'>Stock Type</span></td>
                                        <td>{ProductData.StockType}</td>
                                    </tr>
                                    <tr>
                                        <td><span className='textBold'>Vendors Name</span></td>
                                        <td>{ProductData.Vendors}</td>
                                    </tr>
                                    <tr>
                                        <td><span className='textBold'>PO Approved By</span></td>
                                        <td>{ProductData.POApprovedBy}</td>
                                    </tr>
                                    <tr>
                                        <td><span className='textBold'>Size in the Style</span></td>
                                        <td>{ProductData.TotalSizestyles}</td>
                                    </tr>
                                    <tr>
                                        <td><span className='textBold'>Size Currentely Live</span></td>
                                        <td>{ProductData.NoofsizeCurrentlyLive}</td>
                                    </tr>
                                    <tr>
                                        <td><span className='textBold'>Size Left</span></td>
                                        <td>{ProductData.NoOfSizeLeft}</td>
                                    </tr>

                                </div>
                            </div>

                            <div>
                                <span style={{ fontSize: '25px' }}>Product Description</span><br />
                                <div className='d-flex justify-content-between product-brief-section'
                                    style={{ marginBottom: '10px' }}>
                                    <div className='basic-information-section p-1'>
                                        <strong>Specifications: </strong>
                                        {ProductData.Type1Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type1Title}</span></td>
                                            <td>{ProductData.Type1Data}</td>
                                        </tr> : <></>}
                                        {ProductData.Type2Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type2Title}</span></td>
                                            <td>{ProductData.Type2Data}</td>
                                        </tr> : <></>}
                                        {ProductData.Type3Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type3Title}</span></td>
                                            <td>{ProductData.Type3Data}</td>
                                        </tr> : <></>}
                                        {ProductData.Type4Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type4Title}</span></td>
                                            <td>{ProductData.Type4Data}</td>
                                        </tr> : <></>} {ProductData.Type5Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type5Title}</span></td>
                                            <td>{ProductData.Type5Data}</td>
                                        </tr> : <></>}
                                        {ProductData.Type6Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type6Title}</span></td>
                                            <td>{ProductData.Type6Data}</td>
                                        </tr> : <></>}
                                        {ProductData.Type7Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type7Title}</span></td>
                                            <td>{ProductData.Type7Data}</td>
                                        </tr> : <></>} {ProductData.Type8Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type8Title}</span></td>
                                            <td>{ProductData.Type8Data}</td>
                                        </tr> : <></>}
                                        {ProductData.Type9Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type9Title}</span></td>
                                            <td>{ProductData.Type9Data}</td>
                                        </tr> : <></>}
                                        {ProductData.Type10Title ? <tr>
                                            <td><span className='textBold'>{ProductData.Type10Title}</span></td>
                                            <td>{ProductData.Type10Data}</td>
                                        </tr> : <></>}
                                    </div>
                                </div>
                            </div>
                            {CheckResData ? <div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Product ID</th>
                                            <th>Age</th>
                                            <th>RPT</th>
                                            <th>SR%</th>
                                            <th>IM</th>
                                            <th>TPM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {ProductData.ProductID.map((data) => {
                                                    return (
                                                        <div key={data.id}>{data}</div>
                                                    )
                                                })}
                                            </td>
                                            <td>
                                                <div className='d-flex flex-column'>
                                                    {ProductData.AgeFrom.map((data1, index) => (
                                                        <div key={index} className='d-flex'>
                                                            <div>{data1} Y To {ProductData.AgeTo[index]} Y</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                {ProductData.ProductRPT.map((data) => {
                                                    return (
                                                        <div key={data.id}>{data}</div>
                                                    )
                                                })}
                                            </td>
                                            <td>
                                                {ProductData.ProductSrPercent.map((data) => {
                                                    return (
                                                        <div key={data.id}>{data}</div>
                                                    )
                                                })}
                                            </td>
                                            <td>
                                                {ProductData.ProductImpressionMix.map((data) => {
                                                    return (
                                                        <div key={data.id}>{data}</div>
                                                    )
                                                })}
                                            </td>
                                            <td>
                                                {ProductData.ProductTotalPriceMix.map((data) => {
                                                    return (
                                                        <div key={data.id}>{data}</div>
                                                    )
                                                })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>WH Name</th>
                                            <th>Stock Cover</th>
                                            <th>Intake Mix</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ backgroundColor: 'white' }}>
                                                {ProductData.warehouseSc.map((data) => {
                                                    return (
                                                        <div key={data.name}>{data.name.replace("StockCover", "")}</div>
                                                    )
                                                })}
                                            </td>
                                            <td>
                                                {ProductData.warehouseSc.map((data) => {
                                                    return (
                                                        <div key={data.stockcover}>{data.stockcover}</div>
                                                    )
                                                })}
                                            </td>
                                            <td>
                                                {ProductData.warehouseSc.map((data) => {
                                                    return (
                                                        <div key={data.intakemix}>{data.intakemix}</div>
                                                    )
                                                })}
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div> : <></>}

                        </div>
                    </div>
                </div>
                {/*Mobile View*/}
                <div className=" class-desktop-view main-container p-3">
                    <div className="d-flex justify-content-center">
                        <Carousel>
                            {ProductImgUrl.map((data) => {
                                return (
                                    <Carousel.Item key={data.id}>
                                        <img
                                            className="d-block"
                                            src={data}
                                            alt='Product_Image'
                                        />
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>


                    </div>
                    <div className="d-flex flex-column">
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{ProductData.ProductName}</span>
                        <span style={{
                            fontSize: '15px',
                            marginRight: '5px'
                        }}><strong>Style</strong> - {ProductData.Style}</span>
                    </div>
                    <div className="d-flex justify-content-around align-items-center">
                        <span className='p-1'
                            style={{
                                fontWeight: 'bold',
                                fontSize: '20px',
                                fontFamily: 'auto',
                                color: '#003564'
                            }}>₹  <span style={{ color: '#003564', fontSize: '20px' }}>{ProductData.SellingPrice} </span></span>
                        <span
                            className=''
                            style={{ fontSize: '20px', fontWeight: 'bold' }}>|</span>
                        <span className='p-1'
                            style={{
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textDecoration: 'line-through',
                                color: '#8080809e'
                            }}>{ProductData.MRP}</span>
                        <span className='p-1' style={{ fontWeight: 'bold', fontSize: '20px' }}>|</span>
                        <span className='p-1' style={{
                            fontWeight: 'bold',
                            fontSize: '15px',
                            color: '#9E9E9E'
                        }}>Avg. Discount : <strong style={{
                            fontWeight: 'bold',
                            color: 'red',
                        }}>{GetFixedValue(ProductData.Discount)}% OFF</strong></span>
                        {ProductData.LiveStyle === "Yes" ? <> <img alt="Cloud" className='icon_nav'
                            src={require('../../assets/images/Online.png')} /></> : <>
                            <img alt="Cloud" className='icon_nav'
                                src={require('../../assets/images/Offline.png')} /></>}
                    </div>
                    <div className="ColorCode_Class d-flex">
                        {OtherTypesData.length ?
                            <>
                                {ProductData.OtherStyles.map((data, index) => (
                                    <div
                                        key={data.id}
                                        style={{
                                            backgroundColor: GetBackGroundForStyle(data),
                                            height: '40px',
                                            width: '40px',
                                            margin: '10px',
                                            border: "1px solid",
                                            minWidth: '45px'
                                        }} className={ProductData.Style == data ? 'SetSelectedStyle' : ''}
                                        onClick={(e) => {
                                            SetStyleName(data)
                                            SetStyleNameIndex(index)
                                        }}>
                                    </div>
                                ))}
                            </>
                            :
                            <></>
                        }
                    </div>

                    <div className=''>
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td><span className='textBold'>FAD</span></td>
                                    <td>{ProductData.FirstActiveDate}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Live Month</span></td>
                                    <td>{ProductData.FADMonth ? GetMonthNamebyKey(ProductData.FADMonth) : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Live Year</span></td>
                                    <td>{ProductData.FADYear ? ProductData.FADYear : 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>15 Days RPT</span></td>
                                    <td>{ProductData['15DaysRPT']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>15 Days ST</span></td>
                                    <td>{GetFixedValue(ProductData['15DaysST'])} %</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>30 Days RPT</span></td>
                                    <td>{ProductData['30daysRPT']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>30 Days ST</span></td>
                                    <td>{GetFixedValue(ProductData['30DaysST'])}%</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>60 Days RPT</span></td>
                                    <td>{ProductData['60daysRPT']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>60 Days ST</span></td>
                                    <td>{GetFixedValue(ProductData['60DaysST'])}%</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>90 Days RPT</span></td>
                                    <td>{ProductData['90daysRPT']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>90 Days ST</span></td>
                                    <td>{GetFixedValue(ProductData['90DaysST'])}%</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total RPT</span></td>
                                    <td>{ProductData['TotalRPT']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total ST</span></td>
                                    <td>{GetFixedValue(ProductData['TotalST'])}%</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>PT CTR</span></td>
                                    <td>{GetFixedValue(ProductData.PT_CTR)}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>PT RPT</span></td>
                                    <td>{GetFixedValue(ProductData.producttypeRPT)}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>SUBCAT CTR</span></td>
                                    <td>{GetFixedValue(ProductData.subcat_CTR)}</td>
                                </tr>
                               
                                <tr>
                                    <td><span className='textBold'>SUBCAT RPT</span></td>
                                    <td>{GetFixedValue(ProductData.subcatRPT)}</td>
                                </tr>
                            
                            </tbody>
                        </Table>
                        <Table striped bordered hover className='my-table-responsive-desktop'>
                            <tbody>
                                <tr>
                                    <td><span className='textBold'>Total Sold Qty.</span></td>
                                    <td>{ProductData['TotalSoldQty']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total B2C Sold Qty</span></td>
                                    <td>{ProductData['TotalB2BSoldQty']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total B2B Sold Qty</span></td>
                                    <td>{ProductData.TotalB2BSoldQty}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total Price Sales</span></td>
                                    <td>{ProductData['TotalPriceSales']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>SIH</span></td>
                                    <td>{ProductData['SIH']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total Impressions</span></td>
                                    <td>{ProductData['TotalImpressions']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total CTR</span></td>
                                    <td>{GetFixedValue(ProductData['CTR']) + '%'}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Performance Bucket 1</span></td>
                                    <td>{ProductData['CondiFinalSourcing1']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Performance Bucket 2</span></td>
                                    <td>{ProductData['CondiFinalSourcing2']}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total Style SR</span></td>
                                    <td>{ProductData['StyleSRPercent'] === null ? 0 + '%' : ProductData['StyleSRPercent'] + '%'}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>SR Reasons Data</span></td>
                                    <td>NA</td>
                                    {/* {ProductData['SRReson']} */}
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Stock Type</span></td>
                                    <td>{ProductData.StockType}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Total Intake Bucket</span></td>
                                    <td>{ProductData.TotalIntakeBucket} ({GetBucketRangeFunction(ProductData.TotalIntakeBucket)})</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>NGM</span></td>
                                    <td>{GetFixedValue(ProductData.NGM)} %</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Ind Margin</span></td>
                                    <td>{ProductData.IndMargin}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'> Total Size in the Style</span></td>
                                    <td>{ProductData.TotalSizestyles}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'> Total Size Currently Live</span></td>
                                    <td>{ProductData.NoofsizeCurrentlyLive}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>No Of Size Left</span></td>
                                    <td>{ProductData.NoOfSizeLeft}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>B2B SecST</span></td>
                                    <td>{GetFixedValue(ProductData['B2B_secondary_ST'])} %</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Last 30Day RPT</span></td>
                                    <td>{ProductData.RPT_last30days}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>B2B Sec Sales</span></td>
                                    <td>{ProductData.B2B_secondary_sales}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Last 6M SR</span></td>
                                    <td>{ProductData.last6months_sr_per} %</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table striped bordered hover className='my-table-responsive'>
                            <tbody>
                                <tr>
                                    <td><span className='textBold'>Product Name</span></td>
                                    <td>{ProductData.ProductName}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Product Information</span></td>
                                    <td>{ProductData.ProductDesc}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>Vendors</span></td>
                                    <td>{ProductData.Vendors}</td>
                                </tr>
                                <tr>
                                    <td><span className='textBold'>PO Approved By</span></td>
                                    <td>{ProductData.POApprovedBy}</td>
                                </tr>
                            </tbody>
                        </Table>

                        <Table striped bordered hover className='my-table-responsive'>
                            <tbody>
                                {ProductData.Type1Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type1Title}</span></td>
                                    <td>{ProductData.Type1Data}</td>
                                </tr> : <></>}
                                {ProductData.Type2Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type2Title}</span></td>
                                    <td>{ProductData.Type2Data}</td>
                                </tr> : <></>}
                                {ProductData.Type3Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type3Title}</span></td>
                                    <td>{ProductData.Type3Data}</td>
                                </tr> : <></>}
                                {ProductData.Type4Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type4Title}</span></td>
                                    <td>{ProductData.Type4Data}</td>
                                </tr> : <></>} {ProductData.Type5Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type5Title}</span></td>
                                    <td>{ProductData.Type5Data}</td>
                                </tr> : <></>}
                                {ProductData.Type6Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type6Title}</span></td>
                                    <td>{ProductData.Type6Data}</td>
                                </tr> : <></>}
                                {ProductData.Type7Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type7Title}</span></td>
                                    <td>{ProductData.Type7Data}</td>
                                </tr> : <></>} {ProductData.Type8Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type8Title}</span></td>
                                    <td>{ProductData.Type8Data}</td>
                                </tr> : <></>}
                                {ProductData.Type9Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type9Title}</span></td>
                                    <td>{ProductData.Type9Data}</td>
                                </tr> : <></>}
                                {ProductData.Type10Title ? <tr>
                                    <td><span className='textBold'>{ProductData.Type10Title}</span></td>
                                    <td>{ProductData.Type10Data}</td>
                                </tr> : <></>}

                            </tbody>
                        </Table>
                    </div>
                    {CheckResData ? <div>
                        <Table striped bordered hover style={{ fontSize: '10px' }}>
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Age</th>
                                    <th>RPT</th>
                                    <th>SR%</th>
                                    <th>IM</th>
                                    <th>TPM</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        {ProductData.ProductID.map((data) => {
                                            return (
                                                <div key={data.id}>{data}</div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        <div className='d-flex flex-column'>
                                            {ProductData.AgeFrom.map((data1, index) => (
                                                <div key={index} className='d-flex'>
                                                    <div>{data1} Y To {ProductData.AgeTo[index]} Y</div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        {ProductData.ProductRPT.map((data) => {
                                            return (
                                                <div key={data.id}>{data}</div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        {ProductData.ProductSrPercent.map((data) => {
                                            return (
                                                <div key={data.id}>{data}</div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        {ProductData.ProductImpressionMix.map((data) => {
                                            return (
                                                <div key={data.id}>{data}</div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        {ProductData.ProductTotalPriceMix.map((data) => {
                                            return (
                                                <div key={data.id}>{data}</div>
                                            )
                                        })}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>WH Name</th>
                                    <th>Stock Cover</th>
                                    <th>Intake Mix</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ backgroundColor: 'white' }}>
                                        {ProductData.warehouseSc.map((data) => {
                                            return (
                                                <div key={data.name}>{data.name.replace("StockCover", "")}</div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        {ProductData.warehouseSc.map((data) => {
                                            return (
                                                <div key={data.stockcover}>{data.stockcover}</div>
                                            )
                                        })}
                                    </td>
                                    <td>
                                        {ProductData.warehouseSc.map((data) => {
                                            return (
                                                <div key={data.intakemix}>{data.intakemix}</div>
                                            )
                                        })}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div> : <></>}
                </div>
                {/*Mobile View*/}

                <div>
                    <span style={{ fontSize: '20px', padding: '10px' }}>Similar Products</span><br />
                    {SuggestionProductArr.length > 0 ? <>
                        <div className=' w-100 d-flex' style={{ overflowY: "hidden" }}>
                            {SuggestionProductArr.map(((data, index) => {
                                var imgUrl = PRODUCT_IMG_URL + '226x273/' + data.ProductID[0] + 'a.jpg?' + Math.floor(Math.random() * 90000) + 10000
                                return (
                                    <div className='d-flex flex-row p-2 p-2 bg-light similar-sec-class' key={data.id}>
                                        <div className='image-container'>
                                            <img alt="logo" style={{ height: '160px', width: '110px' }} src={imgUrl} />
                                        </div>
                                        <div style={{ lineHeight: '15px' }}
                                            className='data-container d-flex flex-column p-2 w-100'>
                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <span style={{ fontSize: '10px' }}
                                                        className='small-text-class'>Style</span>
                                                    <span>{data.Style}</span>
                                                </div>
                                                <div>

                                                    {SpinnerLoading && SpinnerLoadingIndex === index ? (

                                                        <Spinner animation="border" role="status"
                                                            style={{ width: '20px', height: '20px', color: 'blue' }}>
                                                            <span className="visually-hidden">Loading...</span>
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
                                                                        SetLikeProductToApi(data, 0);
                                                                        SetSpinnerLoadingIndex(index)
                                                                    }}
                                                                ></i>
                                                            ) : (
                                                                <i
                                                                    className="fa fa-heart-o"
                                                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                                                    onClick={(e) => {
                                                                        SetLikeProductToApi(data, 0);
                                                                        SetSpinnerLoadingIndex(index)
                                                                    }}
                                                                ></i>
                                                            )}
                                                        </>
                                                    )}
                                                    <i className="fa-regular fa-cloud-slash"></i>
                                                </div>

                                            </div>
                                            <div onClick={(e) => {
                                                SetStyleName(data.Style)
                                            }}>
                                                <h3 className='Product_Name' style={{ cursor: 'pointer' }}>{data.ProductName}</h3>
                                            </div>

                                            <div
                                                className='price-container pl-2 d-flex justify-content-lg-start align-content-center'>
                                                <strong><span style={{
                                                    fontFamily: 'auto',
                                                    fontSize: '16px'
                                                }}>₹</span> {data.SellingPrice} |</strong>
                                                <div className='d-flex align-items-center'>
                                                    <span className='content-card'
                                                        style={{ marginLeft: '5px', textDecorationLine: 'line-through', fontWeight: 'bold' }}>{data.MRP}</span>
                                                    <div className='d-flex align-items-center'>
                                                        <span className='small-text-class'
                                                            style={{ marginLeft: '5px' }}> Disc.</span>
                                                        <span className='content-card'
                                                            style={{ fontWeight: 'bold', color: '#ff0000b0' }}>{data.Discount === null || '' ? 0 : GetFixedValue(data.Discount)} % OFF</span>
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
                                                    <span className='content-card'>{data.CTR} %</span>
                                                </div>
                                                <div>
                                                    <span className='small-text-class'>NGM</span>
                                                    <span className='content-card'>{data.NGM}%</span>
                                                </div>
                                            </div>
                                            <div
                                                className='d-flex justify-content-between align-content-center'>
                                                <div>
                                                    <span className='small-text-class'>Total RPT</span>
                                                    <span className='content-card'>{data.TotalRPT}</span>
                                                </div>
                                                <div>
                                                    <span className='small-text-class'>Total ST</span>
                                                    <span className='content-card'>{data.TotalST}</span>
                                                </div>
                                                <div>
                                                    <span className='small-text-class'>SR</span>
                                                    <span
                                                        className='content-card'>{data.StyleSRPercent === null ? 0 : data.StyleSRPercent} %</span>
                                                </div>
                                            </div>
                                            <div
                                                className='d-flex justify-content-between align-content-center'>
                                                <div className='d-flex'>
                                                    <div>
                                                        <span className='small-text-class'>30 Days ST</span>
                                                        <span
                                                            className='content-card'>{data['30DaysST']} %</span>
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
                                                        <img alt="logo" style={{ height: '20px', width: '20px' }}
                                                            src={require('../../assets/images/Multicolor_icon.png')} /> : <></>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                            }))}
                        </div>
                    </> : <div style={{ textAlign: 'center', fontSize: '20px', marginTop: '10px' }}>
                        <span>No Similar Data Found.</span>
                    </div>}
                </div>

                <div>
                    <span style={{ fontSize: '20px', padding: '10px', display: 'flex', alignContent: "center" }}>Similar Styles During Same Live Period</span><br />
                    {SuggestionProductArrDate.length > 0 ? <>
                        <div className=' w-100 d-flex' style={{ overflowY: "hidden" }}>
                            {SuggestionProductArrDate.map(((data, indexDate) => {
                                var imgUrl = PRODUCT_IMG_URL + '226x273/' + data.ProductID[0] + 'a.jpg?' + Math.floor(Math.random() * 90000) + 10000
                                return (
                                    <div className='d-flex flex-row p-2 p-2 bg-light similar-sec-class' key={data.id}>
                                        <div className='image-container'>
                                            <img alt="logo" style={{ height: '160px', width: '110px' }} src={imgUrl} />
                                        </div>
                                        <div style={{ lineHeight: '15px' }}
                                            className='data-container d-flex flex-column p-2 w-100'>
                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                    <span style={{ fontSize: '10px' }}
                                                        className='small-text-class'>Style</span>
                                                    <span>{data.Style}</span>
                                                </div>
                                                <div>

                                                    {SpinnerLoading1 && SpinnerLoadingIndex1 === indexDate ? (

                                                        <Spinner animation="border" role="status"
                                                            style={{ width: '20px', height: '20px', color: 'blue' }}>
                                                            <span className="visually-hidden">Loading...</span>
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
                                                                        SetLikeProductToApi(data, 1);
                                                                        SetSpinnerLoadingIndex1(indexDate)
                                                                    }}
                                                                ></i>
                                                            ) : (
                                                                <i
                                                                    className="fa fa-heart-o"
                                                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                                                    onClick={(e) => {
                                                                        SetLikeProductToApi(data, 1);
                                                                        SetSpinnerLoadingIndex1(indexDate)
                                                                    }}
                                                                ></i>
                                                            )}
                                                        </>
                                                    )}
                                                    <i className="fa-regular fa-cloud-slash"></i>
                                                </div>

                                            </div>
                                            <div onClick={(e) => {
                                                SetStyleName(data.Style)
                                            }}>
                                                <h3 style={{
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                }}>{data.ProductName}</h3>
                                            </div>

                                            <div
                                                className='price-container pl-2 d-flex justify-content-lg-start align-content-center'>
                                                <strong><span style={{
                                                    fontFamily: 'auto',
                                                    fontSize: '16px'
                                                }}>₹</span> {data.SellingPrice} |</strong>
                                                <div className='d-flex align-items-center'>
                                                    <span className='content-card'
                                                        style={{ marginLeft: '5px', textDecorationLine: 'line-through', fontWeight: 'bold' }}>{data.MRP}</span>
                                                    <div className='d-flex align-items-center'>
                                                        <span className='small-text-class'
                                                            style={{ marginLeft: '5px' }}> Disc.</span>
                                                        <span className='content-card'
                                                            style={{ fontWeight: 'bold', color: '#ff0000b0' }}>{data.Discount === null || '' ? 0 : GetFixedValue(data.Discount)} % OFF</span>
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
                                                    <span className='content-card'>{data.CTR} %</span>
                                                </div>
                                                <div>
                                                    <span className='small-text-class'>NGM</span>
                                                    <span className='content-card'>{data.NGM}%</span>
                                                </div>
                                            </div>
                                            <div
                                                className='d-flex justify-content-between align-content-center'>
                                                <div>
                                                    <span className='small-text-class'>Total RPT</span>
                                                    <span className='content-card'>{data.TotalRPT}</span>
                                                </div>
                                                <div>
                                                    <span className='small-text-class'>Total ST</span>
                                                    <span className='content-card'>{data.TotalST}</span>
                                                </div>
                                                <div>
                                                    <span className='small-text-class'>SR</span>
                                                    <span
                                                        className='content-card'>{data.StyleSRPercent === null ? 0 : data.StyleSRPercent} %</span>
                                                </div>
                                            </div>
                                            <div
                                                className='d-flex justify-content-between align-content-center'>
                                                <div className='d-flex'>
                                                    <div>
                                                        <span className='small-text-class'>30 Days ST</span>
                                                        <span
                                                            className='content-card'>{data['30DaysST']} %</span>
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
                                                        <img alt="logo" style={{ height: '20px', width: '20px' }}
                                                            src={require('../../assets/images/Multicolor_icon.png')} /> : <></>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                            }))}
                        </div>
                    </> : <div style={{ textAlign: 'center', fontSize: '20px', marginTop: '10px' }}>
                        <span>No Similar Data Found.</span>
                    </div>}
                </div>
            </ErrorBoundary>
        </>
    )
}
