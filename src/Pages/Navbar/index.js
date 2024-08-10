import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './index.scss'
import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import {LIVE_URL} from "../../env";
import Notification from "../../Components/Notification/Notification";
import store from "../../redux/store";
import Spinner from "react-bootstrap/Spinner";
import packageJson from "../../../package.json";

function TopNavbar(Props) {

    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    let [Search, SetSearch] = useState(store.getState().ProductSaveFilter.data.keyword);
    let [ResultData, SetResultData] = useState([]);
    const location = useLocation();
    let [SpinnerLoading, SetSpinnerLoading] = useState(false)

    function getPageTitle(location) {
        if (['/categorylisting'].includes(location.pathname)) {
            return 'The Handbook';
        } else if (['/productinfo'].includes(location.pathname)) {
            return 'Product Details';
        } else if (['/wishlistproducthistory'].includes(location.pathname)) {
            return 'Your Wishlist';
        } else if (['/wishlistsharedhistory'].includes(location.pathname)) {
            return 'Wishlist History';
        } else if (['/recentvisit'].includes(location.pathname)) {
            return 'Visit History';
        } else {
            return '';
        }
    }

    const pageTitle = getPageTitle(location);
    const showSearchInput = !['/categorylisting', '/wishlistsharedhistory', '/wishlistproducthistory', '/recentvisit', '/productinfo','/forgetpassword'].includes(location.pathname);
    const showUserTags = !['/forgetpassword'].includes(location.pathname);
    const showBackInput = !['/categorylisting', '/categoryproductlisting'].includes(location.pathname);
    let navigate = useNavigate();
    const [show, setShow] = useState(false);
    let [loader, setLoader] = useState(false)
    const handleClose = () => {
        setShow(false);
    }

    const handleLogOut = () => {
        setLoader(true)
        setShow(false);
        let logOutUrl = LIVE_URL + 'logout'
        let payload = {
            username: localStorage.getItem("emailaddress")
        }
        const headers = {
            'Content-Type': 'text/plain',
            'Authorization': localStorage.getItem("token"),
            'useraddress': localStorage.getItem("useraddress")
        };
        axios.post(logOutUrl, payload, {headers}).then((response) => {
            if (response.data.status) {
                setLoader(false)
                setShow(false);
                localStorage.clear()
                navigate('/')
            } else {
                setLoader(false)
            }
        }).catch((err => {
            setLoader(false)
        }))
    }
    const handleShow = () => setShow(true);
    const NavigateToHome = () => {
        navigate('/categorylisting')
    }
    const HandleChangePassword = () => {
        navigate('/changepassword')
    }
    const HandleVisitHistory = () => {
        navigate('/recentvisit')
    }
    const HandleLikedProducts = () => {
        navigate('/wishlistproducthistory')
    }
    const HandleWishlistShared = () => {
        navigate('/wishlistsharedhistory')
    }
    const GetAutoSuggestion = () => {
        if (Search === '' || Search === null) {
            setNotificationKey(notificationKey + 1); // Increment the key to show the new message
            setNotificationMessage('Please Enter Keyword For Search');
            setNotificationType('success');
        } else {
            SetSpinnerLoading(true)
            let SearchUrl = LIVE_URL + 'autoSuggest'
            let payload = {
                keyword: Search
            }
            axios.post(SearchUrl, payload).then((response) => {
                if (response.data.status) {
                    SetSpinnerLoading(false)
                    const resultData = response.data.data.map(item => {
                        const keyParts = item.key.split('#');
                        const source = keyParts[0];
                        const sourceKey = keyParts[1].split('.')[0];
                        return {...item, source, sourceKey};
                    });
                    SetResultData(resultData);
                } else {
                    SetSpinnerLoading(false)
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(response.data.message);
                    SetResultData([]);
                }
            }).catch((err => {
                setLoader(false)
            }))
        }
    }
    const CheckSearchDetails = (data) => {
        Props.updateProductData(data, Search);
        SetResultData([])
    }
    const ResetSearchData = () => {
        SetSearch('')
        Props.updateProductData([], 'Reset');
        SetResultData([])
    }
    return (
        <>
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
            {['xxl'].map((expand) => (
                <Navbar key={expand} bg="light" expand={expand} className="custom-nav">
                    <>
                        <Navbar.Brand>
                            <div>
                                <div className='d-flex justify-content-between align-items-center' style={{height: '40px'}}>
                                    <div className='d-flex' style={{height: '40px'}}>
                                        {showSearchInput && (
                                            <img onClick={NavigateToHome} alt="logo"
                                                 style={{height: '40px', width: '40px', cursor: 'pointer'}}
                                                 src={require('../../assets/images/TBH_Small.png')}/>
                                        )}
                                        {showBackInput && (
                                            <div>
                                                <i
                                                    className='fa fa-arrow-left'
                                                    style={{marginRight: '30px', cursor: 'pointer', fontSize: '30px'}}
                                                    onClick={() => navigate(-1)}
                                                ></i>
                                            </div>
                                        )}
                                        {!showSearchInput && (
                                            <div>
                                                <span onClick={NavigateToHome}
                                                      style={{fontSize: '20px', cursor: 'pointer',marginRight: '5px'}}>{pageTitle}</span>
                                                <span style={{fontSize: '10px', color: 'blue'}}>V {packageJson.version}</span>
                                            </div>
                                        )}
                                        <div className="search-container position-relative">
                                            {showSearchInput && (
                                                <div className="search-container position-relative">
                                                    <div className="search-container position-relative">
                                                        <input
                                                            type="text"
                                                            className="seachInputClass"
                                                            placeholder="Search"
                                                            value={Search}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Space' || e.keyCode === 32) {
                                                                    GetAutoSuggestion();
                                                                }
                                                                if (e.key === "Enter") {
                                                                    CheckSearchDetails(0)
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                SetSearch(e.target.value);
                                                                if (e.target.value === '') {
                                                                    SetResultData([])
                                                                }
                                                            }}
                                                        />
                                                      
                                                        {ResultData.length > 0 && Search !== '' && (
                                                            <div className="search-results border">
                                                                {ResultData.map((data) => {
                                                                    return (
                                                                        <div key={data.source}>
                                                                            <div className="search_result_class"
                                                                                 onClick={() => {
                                                                                     CheckSearchDetails(data)
                                                                                 }}>
                                                                               <span>
                                                                                   <strong>{data.doc_count}</strong>
                                                                                   <span> matches found in </span><strong>{data.source}</strong>
                                                                               </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                    </div>
                                                    <button type="submit" className="search-icon position-absolute"
                                                            style={{
                                                                right: '5px',
                                                                top: '2px',
                                                                border: 'unset',
                                                                background: 'unset'
                                                            }} onClick={() => {
                                                        GetAutoSuggestion()
                                                    }}>
                                                        <div>
                                                            {SpinnerLoading ? (

                                                                <Spinner animation="border" role="status" style={{ width: '20px', height: '20px', color: 'blue' }}>
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </Spinner>
                                                            ) : (
                                                                <>
                                                                    <strong style={{marginRight: '10px', fontSize: '12px'}}
                                                                            onClick={ResetSearchData}>Reset</strong><i
                                                                    className="fa fa-search"></i>  
                                                                </>
                                                            )}
                                                        </div>
                                                       
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {/*  <i className='fa fa-bookmark' style={{fontSize: '40px',color: 'gray',marginLeft: '10px'}}></i>*/}
                                    </div>
                                    {showUserTags && (
                                        <div className='d-flex'>
                                            <i className="fa fa-heart display_heart" style={{
                                                fontSize: '40px',
                                                color: '#ff3e60',
                                                marginLeft: '20px',
                                                marginRight: '10px'
                                            }} onClick={HandleLikedProducts}></i>
                                            <Navbar.Toggle style={{float: 'right', zIndex: '999999999'}}
                                                           className='display-toggle'
                                                           aria-controls={`offcanvasNavbar-expand-${expand}`}>
                                                <i className="fa fa-user" style={{fontSize: '30px'}}></i>
                                            </Navbar.Toggle>
                                            <div className='display-toggle-1'>
                                                <div className="navbar">
                                                    <div className="navbar-menu">
                                              <span className="nav-item" onClick={NavigateToHome}>
                                                  Home
                                              </span>
                                                        <span className="nav-item" onClick={HandleVisitHistory}>
                                                    Recent Visits
                                                </span>
                                                        <span className="nav-item" onClick={HandleLikedProducts}>
                                                    Your Wishlist
                                                </span>
                                                        <span className="nav-item" onClick={HandleWishlistShared}>
                                                    Wishlist Share History
                                                </span>
                                                        <span className="nav-item" onClick={HandleChangePassword}>
                                                    Change Password
                                                </span>
                                                        <span className="nav-item" onClick={handleShow}>
                                                    Logout
                                                </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </Navbar.Brand>

                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <div className="user_nav" style={{}}>
                                    <div className="pr-4 pt-1 pb-4">
                                    </div>
                                    <img style={{height: '100px', width: '100px'}}
                                         src={require('../../assets/images/icon1.png')}/>
                                    <strong
                                        style={{textTransform: 'uppercase'}}>{localStorage.getItem('firstname') + '  ' + localStorage.getItem('lastname')}</strong>
                                    <span>{localStorage.getItem('emailaddress')}</span>
                                    <span>{localStorage.getItem('mobilenumber')}</span>
                                </div>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    {/* <span className='navItemsClass'>Save List</span>*/}
                                    <span className='navItemsClass' onClick={NavigateToHome}>Home</span>
                                    <span className='navItemsClass' onClick={HandleVisitHistory}>Recent Visits</span>
                                    <span className='navItemsClass' onClick={HandleLikedProducts}>Your Wishlist</span>
                                    <span className='navItemsClass' onClick={HandleWishlistShared}>Wishlist Shared History</span>
                                    {/* <span className='navItemsClass'>Allocate Filters</span>*/}
                                    <span className='navItemsClass'
                                          onClick={HandleChangePassword}>Change Password</span>
                                    <span className='navItemsClass' onClick={handleShow}>Log Out</span>
                                </Nav>
                                <div style={{marginTop: '30%', textAlign: 'center'}}>
                                    <span>Version {packageJson.version}</span>
                                </div>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </>
                </Navbar>
            ))}
            {/* <div className='border'>
                {ResultData.map((data)=>{
                    return(
                        <div>
                            <div className='search_resert_class'>
                                <span>{data.doc_count} matches found in {data.source}</span>
                            </div>
                        </div>
                    )
                })}
            </div>*/}
            <Modal show={show} onHide={handleClose} style={{zIndex: '99999999999999', marginTop: "100px"}}>
                <Modal.Header closeButton>
                    <Modal.Title>Log Out</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are You Sure Want To Log Out?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLogOut}>
                        Log Out
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default TopNavbar;