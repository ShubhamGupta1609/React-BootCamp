import TopNavbar from "../Navbar";
import React, {useRef, useState} from "react";
import {LIVE_URL, PRODUCT_IMG_URL} from "../../env";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import {NavLink} from "react-router-dom";
import './index.scss'
import '../../HandBook.scss'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Notification from '../../Components/Notification/Notification';
import {MonthArray} from "../../Utils/Constants";

export default function LikedProducts() {
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
    const GetSellingPrice = (mrp, discount) => {
        console.log(mrp)
        console.log(discount)
        const discountAmount = (mrp * discount) / 100;
        const sellingPrice = mrp - discountAmount;
        return sellingPrice % 1 === 0 ? sellingPrice.toFixed(0) : sellingPrice.toFixed(0)
    }

    const checkboxRefs = useRef([]);

    const handleSpanClick = (index) => {
        checkboxRefs.current[index].click(); // Trigger the checkbox click event for the specific index
    };
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    const [SelectAll, SetSelectAll] = useState(true);

    let [Trigger, SetTrigger] = useState(true)
    let [loader, setLoader] = useState(false)
    let [SelectedFormat, SetSelectedFormat] = useState(1)

    let [productData, setProductData] = useState([])
    let [SelectedProducts, SetSelectedProduct] = useState([])
    const [ShowDelete, SetShowDelete] = useState(false);
    const [ShowShare, SetShowShare] = useState(false);
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
    const handleDeleteClose = () => {
        SetShowDelete(false);
    }
    const handleShareClose = () => {
        SetShowShare(false);
    }
    React.useEffect(() => {
        setLoader(true);
        let wishlistUrl = LIVE_URL + 'shortlistprodlistbyuser';
        var payload = {
            "userid": localStorage.getItem('userid'),
            "page": 1,
            "pagesize": 1000
        };
        axios.post(wishlistUrl, payload)
            .then((response) => {
                if (response.status) {
                    const data = response.data.data.filter(item => item.productid).map(item => {
                        let id;
                        if (item.productid.includes('[') && item.productid.includes(']')) {
                            id = JSON.parse(item.productid).map(val => String(val));
                        } else {
                            id = item.productid.split(',').map(val => String(val));
                        }
                        return {...item, productid: id};
                    });
                    // Sort the data based on lastmodifieddate in descending order
                    data.sort((a, b) => {
                        return new Date(b.lastmodifieddate) - new Date(a.lastmodifieddate);
                    })
                    setProductData(data);
                    setLoader(false);
                } else {
                    setLoader(false);
                }
            })
            .catch(() => {
                setLoader(false);
            });
    }, [Trigger]);

    const SetSelectedProducts = (e, data) => {
        const productIds = data.productid
        const commaSeparatedProductIds = productIds.join(',');
        const selectedProductObject = {
            'userid': localStorage.getItem("userid"),
            'productid': commaSeparatedProductIds,
            'style': data.style,
            'productname': data.productname,
            'mrp': data.mrp,
            'discount': data.discount,
            'condifinalsourcing1': data.condifinalsourcing1,
            'condifinalsourcing2': data.condifinalsourcing2,
            'firstactivedate': data.firstactivedate,
            'ctr': data.ctr,
            '30daysrpt': data['30daysrpt'],
            '30daysst': data['30daysst'],
            'totalintakebucket': data.totalintakebucket,
            'ngm': data.ngm,
            'isactive': 0,
            'livestyle': data.livestyle,
        };

        if (e.target.checked) {
            SetSelectedProduct([...SelectedProducts, selectedProductObject]);
        } else {
            SetSelectedProduct(SelectedProducts.filter(style => style.style !== data.style));
        }
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
    const HandleDeleteWishlist = () => {
        SetShowDelete(false)
        const LikeUrl = LIVE_URL + 'insertshortlistprod';
        const numProducts = SelectedProducts.length;
        let numCompleted = 0;

        SelectedProducts.forEach((product) => {
            const payload = product;

            axios.post(LikeUrl, payload)
                .then((response) => {
                    if (response.data.status) {
                        setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                        setNotificationMessage('Removed Successfully.');
                        setNotificationType('success');
                        SetSelectedProduct([])
                    } else {
                        setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                        setNotificationMessage('Error.');
                        setNotificationType('failed');
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    // Increment the count of completed API calls
                    numCompleted++;

                    // If all API calls have completed, log the success message
                    if (numCompleted === numProducts) {
                        console.log(`All ${numProducts} API calls completed successfully.`);
                        SetTrigger(!Trigger)
                    }
                });
        });
    };
    const GetMonthNamebyKey = (key) => {
        for (let i = 0; i <= MonthArray.length; i++) {
            if (MonthArray[i].key === key) {
                return MonthArray[i].value
            }
        }
    }
    const SelectAllFunction = () => {
        SetSelectAll(!SelectAll);
        if (SelectAll === true) {
            const selectedProducts = productData.map(data => {
                const productIds = data.productid;
                const commaSeparatedProductIds = productIds.join(',');
                return {
                    'userid': localStorage.getItem("userid"),
                    'productid': commaSeparatedProductIds,
                    'style': data.style,
                    'productname': data.productname,
                    'mrp': data.mrp,
                    'discount': data.discount,
                    'condifinalsourcing1': data.condifinalsourcing1,
                    'condifinalsourcing2': data.condifinalsourcing2,
                    'firstactivedate': data.firstactivedate,
                    'ctr': data.ctr,
                    '30daysrpt': data['30daysrpt'],
                    '30daysst': data['30daysst'],
                    'totalintakebucket': data.totalintakebucket,
                    'ngm': data.ngm,
                    'isactive': 0,
                    'livestyle': data.livestyle,
                };
            });
            SetSelectedProduct(selectedProducts);
        } else {
            SetSelectedProduct([]);
        }
    };


    const HandleShareWishlist = () => {
        SetShowShare(false)
        const ShareUrl = LIVE_URL + 'wishlistemailsent';
        let StyleKeys = SelectedProducts.map((product) => product.style);
        let payload = {
            "createdby": localStorage.getItem("emailaddress"),
            "useremailid": localStorage.getItem("emailaddress"),
            "stylecode": StyleKeys,
            "flag": SelectedFormat
        }
        axios.post(ShareUrl, payload)
            .then((response) => {
                if (response.data.status) {
                    // Handle success
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage('Wishlist Shared Successfully.');
                    setNotificationType('success');
                    setLoader(false)
                    SetSelectedProduct([])
                } else {
                    // Handle error
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage('Error While Sharing Wishlist.');
                    setNotificationType('failed');
                }
            })
            .catch((error) => {
                console.log(error);
            })
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
                <div className='d-flex justify-content-between position-sticky align-content-center' style={{
                    margin: '10px 0 10px 0',
                    top: '56px',
                    height: '40px',
                    backgroundColor: 'white',
                    padding: '5px',
                    alignItem: 'center'
                }}>
                    <div className='ml-2'>
                        <span style={{margin: '10px', fontSize: '12px'}}>Selected Products</span>
                        {SelectedProducts.length}
                    </div>
                    <div style={{cursor: 'pointer', marginRight: '10px', display: 'flex'}} className='mr-2'>
                        <div className='Select_all'>
                            <input type='checkbox' style={{marginRight:'10px'}} onClick={() => {
                                SelectAllFunction();
                            }}/>
                          <span>
                            {SelectAll === true || SelectAll === '' ?
                                <span  style={{fontSize: '20px'}}>Select All</span> : 
                                <span  style={{fontSize: '20px'}}>Deselect All</span>}</span>
                        </div>
                        {SelectedProducts.length ? <> <img src="data:image/png;base64,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" style={{height: '30px', marginRight: '20px'}} onClick={() => {
                            SetShowDelete(!ShowDelete)
                        }}></img>
                            <img src="data:image/png;base64,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"  style={{height: '30px'}} onClick={() => {
                                SetShowShare(!ShowShare)
                            }}></img></> : <></>}
                    </div>
                </div>
            {productData.length > 0 ?
                <div style={{height: '80vh'}}>
                    <div className='mr-3 ml-3 mb-3 w-100 New_Class' style={{lineHeight: '15px'}}>
                        {productData.map(((data, index) => {
                            /* var imgUrl =  PRODUCT_IMG_URL + '300x364/' + data.productid[0] +'a.jpg?'  + Math.floor(Math.random() * 90000) + 10000*/
                            var imgUrl = PRODUCT_IMG_URL + '300x364/' + data.productid[0] + 'a.jpg?' /* + Math.floor(Math.random() * 90000) + 10000*/
                            return (
                                <div
                                    style={{margin: "5px"}}
                                    className={`d-flex flex-row p-2 bg-light card_class-products ${
                                        SelectedProducts.some((product) => product.style === data.style)
                                            ? "border border-danger"
                                            : ""
                                    }`}
                                    key={data.id}
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-1"
                                        style={{marginRight: '2px'}}
                                        ref={(ref) => (checkboxRefs.current[index] = ref)}
                                        onChange={(e) => SetSelectedProducts(e, data)}
                                        checked={SelectedProducts.some((product) => product.style === data.style)}
                                    />
                                    <div className='image-container' style={{height: '160px', width: '110px'}}>
                                        <img onClick={() => handleSpanClick(index)} alt="Image"
                                             style={{height: '160px', width: '110px', cursor: 'pointer'}} src={imgUrl}
                                             onError={(e) => e.target.src = require('../../assets/images/Default_Image.jpg')}/>
                                    </div>
                                    <div className='data-container d-flex flex-column p-2 w-100'>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <span style={{fontSize: '10px'}}
                                                      className='small-text-class'>Style</span>
                                                <span>{data.style}</span>
                                            </div>
                                            <div>
                                                {/*
                                    <i className="fa fa-heart-o" onClick={(e) =>{SetLikeProductToApi(data)}}></i>
*/}
                                                <i className="fa-regular fa-cloud-slash"></i>
                                            </div>

                                        </div>
                                        <NavLink to="/productinfo" style={{all: 'unset', cursor: 'pointer'}}
                                                 state={{styleName: data.style}}>
                                            <h3 className='Product_Name'>{data.productname}</h3>
                                        </NavLink>

                                        <div
                                            className='price-container pl-2 d-flex justify-content-lg-start align-content-center'>
                                            {data.sellingprice ? <> <strong>₹{data.sellingprice} |</strong></> : <>
                                                <strong><span style={{
                                                    fontFamily: 'auto',
                                                    fontSize: '16px'
                                                }}>₹</span> {GetSellingPrice(data.mrp, data.discount)} |</strong></>}
                                            <div className='d-flex align-items-center'>
                                                                 <span className='content-card'
                                                                       style={{
                                                                           marginLeft: '5px',
                                                                           textDecorationLine: 'line-through',
                                                                           fontWeight: 'bold'
                                                                       }}>{data.mrp}</span>
                                                <div className='d-flex align-items-center'>
                                                                <span className='small-text-class'
                                                                      style={{marginLeft: '5px'}}> Disc.</span>
                                                    <span className='content-card'
                                                          style={{
                                                              fontWeight: 'bold',
                                                              color: '#ff0000b0'
                                                          }}>{data.discount === null || '' ? 0 : GetFixedValueFunction(data.discount)} % OFF</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className='d-flex justify-content-between align-content-center'>
                                            <div>
                                                <span className='small-text-class'>FAD</span>
                                                <span className='content-card'>{data.firstactivedate}</span>
                                            </div>
                                            <div>
                                                <span className='small-text-class'>CTR</span>
                                                <span className='content-card'>{data.ctr} %</span>
                                            </div>
                                            <div>
                                                <span className='small-text-class'>NGM</span>
                                                <span className='content-card'>{data.ngm}%</span>
                                            </div>
                                        </div>
                                        <div
                                            className='d-flex justify-content-between align-content-center'>
                                            <div>
                                                <span className='small-text-class'>Total RPT</span>
                                                <span className='content-card'>{data['totalrpt']}</span>
                                            </div>
                                            <div>
                                                <span className='small-text-class'>Total ST</span>
                                                <span className='content-card'>{data['totalst']}</span>
                                            </div>
                                            <div>
                                                <span className='small-text-class'>SR</span>
                                                <span
                                                    className='content-card'>{data.stylesrpercent === null ? 0 : data.stylesrpercent} %</span>
                                            </div>
                                        </div>
                                        <div
                                            className='d-flex justify-content-between align-content-center'>
                                            <div className='d-flex'>
                                                <div>
                                                    <span className='small-text-class'>30 Days ST</span>
                                                    <span className='content-card'>{data['30daysst']} %</span>
                                                </div>
                                                <div>
                                                    <span className='small-text-class' style={{marginLeft: '5px'}}>Intake Bucket</span>
                                                    <span
                                                        className='content-card'>{GetBucketRangeFunction(data.totalintakebucket)}</span>
                                                </div>
                                            </div>
                                            {/*<div>
                                                {data.OtherStyles.length ?
                                                    <img alt="logo" style={{height: '20px', width: '20px'}}
                                                         src={require('../../assets/images/Multicolor_icon.png')}/> : <></>}
                                            </div>*/}
                                        </div>
                                    </div>
                                </div>)
                        }))}
                    </div>
                </div>
                : <>{loader === true ? <></> : <>
                    <div style={{height: '80vh'}}>
                        <div className="center">
                            <span style={{fontSize: '20px'}}>No Data Found...!</span>
                            <br/>
                            <span style={{fontSize: '15px'}}>Please add one or more products from product list.</span>
                        </div>
                    </div>
                </>}</>

            }
            <Modal show={ShowDelete} onHide={handleDeleteClose} style={{zIndex: '99999999999999', marginTop: "100px"}}>
                <Modal.Body>Are You Sure Want To Delete?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={HandleDeleteWishlist}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={ShowShare} onHide={handleShareClose} style={{zIndex: '99999999999999', marginTop: "100px"}}>
                <Modal.Body>
                    <Modal.Header style={{padding: 'unset'}} closeButton onClick={handleShareClose}>

                    </Modal.Header>
                    {/* <div className='d-flex flex-column'>
                        <span>Receiver Email ID</span>
                        <input style={{border: 'unset', borderBottom: '1px solid gray'}} type='text'
                               value={localStorage.getItem('emailaddress')}/>
                    </div>*/}
                    <div className='icon_share'>
                        <div className='d-flex flex-column justify-content-center'>
                            <div className={SelectedFormat === 1 ? 'icon_class border border-primary' : 'icon_class-1'}>
                                <img src="data:image/png;base64,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" style={{height: '50px'}} onClick={() => {
                                    SetSelectedFormat(1)
                                }}></img>
                            </div>
                            <span style={{marginLeft: '15px'}}>EXCEL</span>
                        </div>
                        <div className='d-flex flex-column justify-content-center'>
                            <div className={SelectedFormat === 0 ? 'icon_class border border-primary' : 'icon_class-1'}>
                                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFWklEQVR4nO3dWYgcRRwG8DKieKEYJSqKKOIBHhjiBQGjIhrcjVvf11RAiUQFo0RXUUTxXBFE8XoRj4AHqC+CkgePRyNoUEFRUETBRFHEeCu4u1M1mpLaTGSnd7ozO2zm391VH/TDLpuZ4vtN9TXdHaVSUlJSUlKGHEf6mi0fea0PUU1NBQr2Ayyf+NHRQ1UTU4Fy/YDLFx44QjUtFSjWD7wAX04ac6RqUmqIcHvu563TxhyrmhLxgjm/ZWbMc1G+ndb6ONWE1BGkJwr5XYs8XtU9dQXphWLJbRY4RdU5dQYpQPnJZtlpqq6pO0gByu9O67NUHdMEkAKUPxxwjqpbmgLSEwX4u02er+qUJoEUzJTJNnmhqkuaBlIwU6baWXaRqkOaCFKAYlukVlVPU0EKUbSmqnKaDFKA8o8lr1BVTdNBSlCuVFVMDCAFe1/bHXC9qlpiASlEIW9SVUpMICUot6iqJDaQglP3YblXVSExghShWPIhJZ1YQQpRgIeVZGIGKUF5yiu1h5JI7CCF2xRgg5+YWKSGHemCXQVAQixwXw+UZ9WwI12wqwhI0UzZne/XexAVKNlVeEkglEdIIJQvPoFQvuwEQvmCEwjlS00glC8ygQxYgiXbnWtyrXT5Ue/2WuA3C1zljdk3jMOvWbN/+LKoajBRgFjAOeDMXuOxWXa1NEJ0IA54pWg84SyrA7ZIQ0QFYnNXfNgsW9r1M/m0NERUIO3cZZ2WfL1rTMCt0hBRgbRyl3Q68rUcyHppiKhAHDCeA7g5N6a7pCFiA3lp9hi8MYfP/tmSz0hDRAViyV/8unV7FY3Jkm9JQ0QF4sKGHRgpGdPX0hDRgTjy5V7jCasvaYQoQSww5YEl+fHYLFstjRAliNuB8uAcEOAJaYSYQf7yxhzQNR7gRWmEaEEc+UP+YrTwDKyZe8wrgBEdiAUe6zkm4FppiChBnNbLCscFvCqNERcI8HnZuLwxB1XheERFBHJj1ziAcTs2durs37XIkyz5awIZxjHIyMjBO4v3xuxtgR8d+ZVfufLA3Admefj7NEN2L8rzs0u3WXbZrJmz0RuzZxeK1ivCLnIeNTzaz5GfWmCTBT4Iq7jOPYNpldX37CC32yw7uQsEeC/3N0/OWbVqvcyRt7XJS6bHxo4puqEmzDyr9TWO/D5tQ/oDeSM3O5b2WKX9XLYH1k/CaZmF+G5eDTtDXzdrvaLr/YHnOquqrZZ83JHn5ldZg8aSlyeQ8o3523M+EDv2rk4fpPBwlD8zw4Bxp/V1+ddpaX1CAimfIcvnXXrYJmTZ6rALPN9/67Ls7ARShAFs7AtgYmKRy7IzHHm3BTaHB8V0tj0tR074tWv36RfEAo8mkLmrqc0t4NKy24wDQhu4wAEvhMe87mKnYJsD7vSrVh1Wigqs34mZNuqcKe7dsIEu+wS3jDnRkg+Ep1LPt7TO8cbHYRfZAfc48gZH3hFuZ17IKx/VsLPge1HAlhaZlb1nuHLRku8PfQ8vJpDO86c25L9wyic8tnWhj6YTSB4DmGoBULuIHx3drwpncBs9Q8KtBWGD3M97WfIR6YIbDxJ2RfOv6XtcTdImL7bAv9IFNx4k/x+pTBlzdLgbavbvJoGjZs5PVaDgxoN4YxaXvb43ZrEjP5MuNhqQcAta0Wt7YIklP5QuNS4Q4M9ez1VvZ9l5jvxGutDoQP7/0gl4MxwxW/J+S74jXWTUIE1eVAKhOEICoXzxCYTyZScQyhecQChfagKhfJEJpALluQQiX5hLIPIluQQiX4xLIPJluAos6dQJ5RESCOWLTyCULzuBUL7gBEL5UmsFkpKSkpKiYs9/UBakbAygCSYAAAAASUVORK5CYII="  style={{height: '50px'}} onClick={() => {
                                    SetSelectedFormat(0)
                                }}></img>
                            </div>
                            <span style={{marginLeft: '20px'}}>PDF</span>
                        </div>


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button variant="danger" className='w-100' onClick={HandleShareWishlist}>
                            Send
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

        </>
    )
}