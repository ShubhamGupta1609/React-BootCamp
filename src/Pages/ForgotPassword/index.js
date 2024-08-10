import '../Login/index.scss'
import React, {useState} from "react";
import {Button} from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import Notification from "../../Components/Notification/Notification";
import {useNavigate} from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import {LIVE_URL} from "../../env";
import TopNavbar from "../Navbar";

export default function ForgotPassword() {
    let navigate = useNavigate();
    let [loader, setLoader] = useState(false)
    const [show, setShow] = useState(false);
    let [Otp, SetOtp] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    let [email, setEmail] = useState('');
    const SendOTPToMail = () => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const isValid = emailRegex.test(email);
        if (!isValid) {
            setNotificationKey(notificationKey + 1); // Increment the key to show the new message
            setNotificationMessage('Please check you email address.')
            setNotificationType('failed');
            return false;
        }
        setLoader(true);
        let baseUrl = LIVE_URL + 'sendOTPOnemail';
        const headers = {
            'Content-Type': 'text/plain;charset=utf-8'
        };
        const payload = {
            username: email
        };
        fetch(baseUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (response.ok) {
                    return response.text(); // Get the response as text
                } else {
                    throw new Error('Request failed.');
                }
            })
            .then((responseData) => {
                let Responce = JSON.parse(responseData)
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(Responce.message);
                    setLoader(false);
                    if(Responce.status_code === '200'){
                       setShow(true)
                    }
            })
            .catch((error) => {
                setLoader(false);
            });
    }
    const SendResetPassword = (responce) =>{
        let data = JSON.parse(responce)
        let systemtoken = data.systemtoken
        let useraddress = data.useraddress
        setLoader(true)
        let OTP_URL = LIVE_URL + 'resetPassword'
        var payload = {
            "username": email,
        }
        const headers = {
            'Content-Type': 'text/plain;charset=utf-8',
            'Authorization' : systemtoken,
            'useraddress' :useraddress
        };
        fetch(OTP_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (response.ok) {
                    return response.text(); // Get the response as text
                } else {
                    throw new Error('Request failed.');
                }
            })
            .then((responseData) => {
                    setLoader(false);
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage("Password send to your email successfully.");
                    setTimeout(() => {
                        navigate('/')
                    }, 1000);
            })
            .catch((error) => {
                setLoader(false);
            });
    }
    const handleClose = () => {
        setShow(false);
        navigate('/')
    }
    const CheckOTP = () => {
        if (Otp === '' || Otp === null) {
            setNotificationKey(notificationKey + 1); // Increment the key to show the new message
            setNotificationMessage('Please Enter OTP.');
            setNotificationType('failed');
        } else {
            setLoader(true)
            let OTP_URL = LIVE_URL + 'validateOTP'
            var payload = {
                "username": email,
                "otp": Otp,
                "flag": 0
            }
            const headers = {
                'Content-Type': 'text/plain;charset=utf-8'
            };
            fetch(OTP_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            })
                .then((response) => {
                    if (response.ok) {
                        return response.text(); // Get the response as text
                    } else {
                        throw new Error('Request failed.');
                    }
                })
                .then((responseData) => {
                    let Responce = JSON.parse(responseData)
                    if (Responce.status_code === "424") {
                        setLoader(false);
                        setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                        setNotificationMessage(Responce.message);
                    } else if (Responce.status_code === "200") {
                        setLoader(false);
                        setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                        setNotificationMessage(Responce.message);
                        setShow(false)
                        SendResetPassword(responseData)
                    }
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            SendOTPToMail();
        }
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
            <div className='forget-main-container container'>
                <div className="body-login">
                    <div className="box">
                        <div className="form" style={{padding: '80px 40px'}}>
                            <img alt="logo" style={{height: '100px', width: '100px', margin: '0 auto'}}
                                 src={require('../../assets/images/HB_logo.jpg')}/>
                            <span>Plese enter your email id here</span>
                            <div className="inputBox">
                                <input type="email"  onKeyDown={handleKeyDown} value={email} placeholder="Email ID" required='required'
                                       onChange={(e) => {
                                           setEmail(e.target.value)
                                       }}/>
                                <Button variant="danger" className='p-2' onClick={SendOTPToMail} style={{
                                    width: '-webkit-fill-available',
                                    marginTop: '10px'
                                }}>Submit</Button>{' '}
                            </div>
                        </div>
                    </div>
                    <div>
                        <span style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '10px',
                            color: 'black'
                        }}>Version 2.5</span>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} style={{marginTop: "20%"}}>
                <Modal.Body>
                    <div className='d-flex flex-column align-items-center mb-2'>
                        <span>OTP has been sent to your email id.</span>
                    </div>
                    <div className='otp-section'>
                        <div className="inputBox p-2">
                            <input
                                type="text"
                                value={Otp}
                                maxLength={6}
                                placeholder="Enter Your 6 Digit OTP"
                                required
                                onChange={(e) => {
                                    const input = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                    SetOtp(input);
                                }}
                            />

                        </div>
                    </div>
                    <div className='custom-footer d-flex justify-content-around'>
                        <span onClick={handleClose}>Cancel</span>
                        <span onClick={CheckOTP}>Submit</span>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}