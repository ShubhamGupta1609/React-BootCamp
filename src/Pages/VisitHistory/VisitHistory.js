import TopNavbar from "../Navbar";
import React, {useState} from "react";
import {LIVE_URL, PRODUCT_IMG_URL} from "../../env";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import Col from "react-bootstrap/Col";
import {NavLink} from "react-router-dom";
import '../../HandBook.scss'
import Notification from "../../Components/Notification/Notification";
import Spinner from "react-bootstrap/Spinner";
import {MonthArray} from "../../Utils/Constants";

export default function VisitHistory() {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    let [loader, setLoader] = useState(false)
    let [productData, setProductData] = useState([])
    let [SpinnerLoading, SetSpinnerLoading] = useState(false)
    let [SpinnerLoadingIndex, SetSpinnerLoadingIndex] = useState(0)
    const [refresh, setRefresh] = useState(false);

    React.useEffect(() => {
        setLoader(true)
        let WishlistUrl = LIVE_URL + 'getUserVisitHistory'
        var payload = {}
        axios.post(WishlistUrl, payload).then((response) => {
            if (response.status) {
                setProductData(response.data.data)
                setLoader(false)
            } else {
                setLoader(false)
            }
        }).catch((err => {
            setLoader(false)
        }))
    }, [])
    const GetFixedValueFunction = (value) => {
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
    const GetSellingPrice = (mrp, discount) =>{
        console.log(mrp)
        console.log(discount)
        const discountAmount = (mrp * discount) / 100;
        const sellingPrice = mrp - discountAmount;
        return sellingPrice % 1 === 0 ? sellingPrice.toFixed(0) : sellingPrice.toFixed(0)
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
    const GetMonthNamebyKey = (key) => {
        for (let i = 0; i <= MonthArray.length; i++) {
            if (MonthArray[i].key === key) {
                return MonthArray[i].value
            }
        }
    }
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
    const GetLikedStatusByStyle = (Style) => {
        const likedProducts = localStorage.getItem("LikedProducts");
        return likedProducts && likedProducts.split(",").includes(Style);
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
    return (
        <>
            <TopNavbar/>
            <Loader status={loader}/>
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
            {/*Main Product Listing Section*/}
            <div>
                {productData.length > 0 ? <>
                    <div className='mr-3 ml-3 mb-3 w-100 New_Class'>
                        {productData.map(((data, index) => {
                            if (data.style.ProductID !== undefined || data.style.ProductID != null) {
                                /*
                                                                var imgUrl = PRODUCT_IMG_URL + '300x364/' + data.style.ProductID[0] + 'a.jpg?'  + Math.floor(Math.random() * 90000) + 10000
                                */
                                var imgUrl = PRODUCT_IMG_URL + '300x364/' + data.style.ProductID[0] + 'a.jpg?'
                                return (
                                    <div className='d-flex flex-row p-2 p-2 m-2 bg-light hvr-grow card_class-products'
                                         key={data.style.id}>
                                        <div className='image-container' style={{height: '160px', width: '110px'}}>
                                            <img alt="Image" style={{height: '160px', width: '110px'}} src={imgUrl}
                                                 onError={(e) => e.target.src = require('../../assets/images/Default_Image.jpg')}/>
                                        </div>
                                        <div style={{lineHeight: '15px'}}>
                                            <div className='data.style-container d-flex flex-column p-2 w-100'>
                                                <div className='d-flex justify-content-between'>
                                                    <div>
                                                <span style={{fontSize: '10px'}}
                                                      className='small-text-class'>Style</span>
                                                        <span>{data.style.Style}</span>
                                                    </div>
                                                    <div className='d-flex align-items-center'>
                                                        {data.LiveStyle === "Yes" ? <> <img alt="Cloud"
                                                                                            className='icon_nav'
                                                                                            src={require('../../assets/images/Online.png')}/></> : <>
                                                            <img alt="Cloud" className='icon_nav'
                                                                 src={require('../../assets/images/Offline.png')}/></>}
                                                        {SpinnerLoading && SpinnerLoadingIndex === index ? (

                                                            <Spinner animation="border" role="status" style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                color: 'blue'
                                                            }}>
                                                                <span className="visually-hidden">Loading...</span>
                                                            </Spinner>
                                                        ) : (
                                                            <>
                                                                {GetLikedStatusByStyle(data.style.Style) ? (
                                                                    <i
                                                                        className="fa fa-heart"
                                                                        style={{
                                                                            fontSize: '20px',
                                                                            color: '#ff3e60',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={(e) => {
                                                                            SetLikeProductToApi(data.style, index);
                                                                            SetSpinnerLoadingIndex(index)
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i
                                                                        className="fa fa-heart-o"
                                                                        style={{cursor: 'pointer', fontSize: '20px'}}
                                                                        onClick={(e) => {
                                                                            SetLikeProductToApi(data.style, index);
                                                                            SetSpinnerLoadingIndex(index)
                                                                        }}
                                                                    ></i>
                                                                )}
                                                            </>
                                                        )}
                                                        <i className="fa-regular fa-cloud-slash"></i>
                                                    </div>

                                                </div>
                                                <NavLink to="/productinfo" style={{all: 'unset', cursor: 'pointer'}}
                                                         state={{styleName: data.style.Style}}>
                                                    <h3 className='Product_Name'>{data.style.ProductName}</h3>
                                                </NavLink>

                                                <div
                                                    className='price-container pl-2 d-flex justify-content-lg-start align-content-center'>
                                                    {data.style.sellingprice ? <> <strong>₹{data.style.sellingprice} |</strong></> : <> <strong><span style={{
                                                        fontFamily: 'auto',
                                                        fontSize: '16px'
                                                    }}>₹</span>{GetSellingPrice(data.style.MRP , data.style.Discount)} |</strong></>}
                                                    <div className='d-flex align-items-center'>
                                                                 <span className='content-card'
                                                                       style={{marginLeft: '5px', textDecorationLine : 'line-through', fontWeight: 'bold'}}>{data.style.MRP}</span>
                                                        <div className='d-flex align-items-center'>
                                                                <span className='small-text-class'
                                                                      style={{marginLeft: '5px'}}> Disc.</span>
                                                            <span className='content-card'
                                                                  style={{fontWeight: 'bold', color: '#ff0000b0'}}>{data.style.Discount === null || '' ? 0 : GetFixedValueFunction(data.style.Discount)} % OFF</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className='small-text-class'>Performance Bucket</span>
                                                    <span
                                                        className='content-card'>{GetCodiFinalFilter(data.style.CondiFinalSourcing2)}</span>
                                                </div>
                                                <div
                                                    className='d-flex justify-content-between align-content-center'>
                                                    <div>
                                                        <span className='small-text-class'>FAD</span>
                                                        <span
                                                            className='content-card'>{GetMonthNamebyKey(data.style.FADMonth)} - {data.style.FADYear}</span>
                                                    </div>
                                                    <div>
                                                        <span className='small-text-class'>CTR</span>
                                                        <span className='content-card'>{data.style.CTR} %</span>
                                                    </div>
                                                    <div>
                                                        <span className='small-text-class'>NGM</span>
                                                        <span className='content-card'>{data.style.NGM}%</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className='d-flex justify-content-between align-content-center'>
                                                    <div>
                                                        <span className='small-text-class'>Total RPT</span>
                                                        <span className='content-card'>{data.style.TotalRPT}</span>
                                                    </div>
                                                    <div>
                                                        <span className='small-text-class'>Total ST</span>
                                                        <span className='content-card'>{data.style.TotalST}</span>
                                                    </div>
                                                    <div>
                                                        <span className='small-text-class'>SR</span>
                                                        <span
                                                            className='content-card'>{data.style.StyleSRPercent === null ? 0 : data.style.StyleSRPercent} %</span>
                                                    </div>
                                                </div>
                                                <div
                                                    className='d-flex justify-content-between align-content-center'>
                                                    <div className='d-flex'>
                                                        <div>
                                                            <span className='small-text-class'>30 Days ST</span>
                                                            <span
                                                                className='content-card'>{data.style['30DaysST']} %</span>
                                                        </div>
                                                        <div>
                                                            <span className='small-text-class'
                                                                  style={{marginLeft: '5px'}}>Intake Bucket</span>
                                                            <span
                                                                className='content-card'>{GetBucketRangeFunction(data.style.TotalIntakeBucket)}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {data.style.OtherStyles.length ?
                                                            <img alt="logo" style={{height: '20px', width: '20px'}}
                                                                 src={require('../../assets/images/Multicolor_icon.png')}/> : <></>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)

                            } else {
                                return (
                                    <Col className='d-flex flex-row p-2 p-2 m-2 bg-light hvr-grow card_class_visit'
                                         key={data.style.id}>

                                        <div className='data.style-container d-flex flex-column p-2 w-100'>
                                            <div className='d-flex justify-content-between'>
                                                <div>
                                                        <span style={{fontSize: '25px'}}
                                                              className='small-text-class'>Style</span>
                                                    <span style={{fontSize: '25px'}}>{data.style.Style}</span>
                                                </div>

                                            </div>

                                            <div
                                                className='price-container pl-2 d-flex justify-content-lg-start align-content-center'>

                                                <div>
                                                        <span style={{fontSize: '18px'}}
                                                              className='small-text-class'>Style details not available in today's synced data</span>

                                                </div>
                                            </div>

                                        </div>
                                    </Col>)
                            }
                        }))}
                    </div>
                </> : <>{loader === true ? <>
                </> : <>
                    <div style={{height: '80vh'}}>
                        <center className='text-center mt-5'>No Data.style Found, Please Update Filters.</center>
                    </div>
                </>}</>
                }
            </div>
            {/*Main Product Listing Section*/}
        </>
    )
}