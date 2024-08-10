import React, {useState} from "react";
import {Button} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import {useNavigate} from "react-router-dom";
import {LIVE_URL} from "../../env";
import axios from "axios";
import Notification from "../../Components/Notification/Notification";
import Loader from "../../Components/Loader/Loader";

export default function ChangePassword() {
    let navigate = useNavigate();
    let [loader, setLoader] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    let [CurrentPassword, SetCurrentPassword] = useState('');
    let [NewPassword, SetNewPassword] = useState('');
    let [Otp, SetOtp] = useState('');
    const [show, setShow] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);


    React.useEffect(() => {
        setLoader(true);
        let baseUrl =  LIVE_URL + 'sendOTPOnemail';
        const headers = {
            'Content-Type': 'text/plain;charset=utf-8'
        };
        const payload = {
            username: localStorage.getItem("emailaddress"),
            /*  username: 'hrishikesh.langade@firstcry.com',*/
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
                if (Responce.status_code === "424") {
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(Responce.message);
                    setLoader(false);
                     setTimeout(() => {
                         navigate('/')
                     }, 1000);
                } else if (Responce.status_code === "200") {
                    setLoader(false);
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage('OTP Send Successfully.');
                }
            })
            .catch((error) => {
                setLoader(false);
            });
    }, []);


    const CheckOTP = () => {
        if (Otp === '' || Otp === null) {
            setNotificationKey(notificationKey + 1); // Increment the key to show the new message
            setNotificationMessage('Please Enter OTP.');
            setNotificationType('failed');
        } else {
            setLoader(true)
            let OTP_URL = LIVE_URL + 'validateOTP'
            var payload = {
                "username": localStorage.getItem("emailaddress"),
                "otp": Otp,
                "flag": 2
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
                    }
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    }
    const handleClose = () => {
        setShow(false);
        navigate('/categorylisting')
    }
    const SubmitFinalChangeCall = () => {
        if (CurrentPassword === '' || NewPassword === '') {
            setNotificationKey(notificationKey + 1); // Increment the key to show the new message
            setNotificationMessage('Please Enter Current Password And New Password.');
            setNotificationType('failed');
        } else {
            setLoader(true)
            let OTP_URL = LIVE_URL + 'changePassword'
            var payload = {
                "username": localStorage.getItem("emailaddress"),
                "oldpassword": CurrentPassword,
                "newpassword": NewPassword
            }
            const headers = {
                'Content-Type': 'text/plain',
                'Authorization': localStorage.getItem("token"),
                'useraddress': localStorage.getItem("useraddress")
            };
            axios.post(OTP_URL, payload, {headers}).then((response) => {
                if (response.data.message === 'success') {
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage('Password Change Successfully.');
                     setTimeout(() => {
                        navigate('/')
                    }, 3000);
                    setLoader(false)
                } else {
                    setLoader(false)
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(response.data.message);
                }
            }).catch((err => {
                setLoader(false)
            }))
        }
    }
    function handleKeyDownLogin(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            SubmitFinalChangeCall();
        }
    }
    function SetOptFunction(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            CheckOTP();
        }
    }
    return (<>
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
                <div className="form" style={{padding: '80px 20px'}}>
                    <img alt="logo" style={{height: '100px', width: '100px', margin: '0 auto'}}
                         src={require('../../assets/images/HB_logo.jpg')}/>
                    <span>Plese enter below details</span>
                    <div className="inputBox">
                        <input  type={showPassword ? 'text' : 'password'} onKeyDown={handleKeyDownLogin} value={CurrentPassword} placeholder="Current Password"
                               required='required' onChange={(e) => {
                            SetCurrentPassword(e.target.value)
                        }}/>
                        <p onClick={() => setShowPassword(!showPassword)} >
                            {showPassword ? <><i className="fa fa-eye showpassclass"></i></> : <><i className="fa fa-eye showpassclass"></i></>}
                        </p>
                        <br/>
                        <br/>
                        <input type={showPassword1 ? 'text' : 'password'}  onKeyDown={handleKeyDownLogin} value={NewPassword} placeholder="New Password" required='required'
                               onChange={(e) => {
                                   SetNewPassword(e.target.value)
                               }}/>
                        <p onClick={() => setShowPassword1(!showPassword1)} >
                            {showPassword1 ? <><i className="fa fa-eye showpassclass"></i></> : <><i className="fa fa-eye showpassclass"></i></>}
                        </p>
                        <br/>
                        <Button variant="danger" className='p-2' onClick={SubmitFinalChangeCall}
                                style={{width: '-webkit-fill-available', marginTop: '10px'}}>Submit</Button>{' '}
                    </div>
                </div>
                <div>
                        <span style={{
                            position: 'absolute', bottom: '20px', right: '10px', color: 'black'
                        }}>Version 2.5</span>
                </div>
            </div>
        </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Body>
                <div className='d-flex flex-column align-items-center mb-2'>
                    <span>OTP has been sent to your email id.</span>
                    <strong>{localStorage.getItem('emailaddress')}</strong>
                </div>
                <div className='otp-section'>
                    <div className="inputBox p-2">
                        <input
                            onKeyDown={SetOptFunction}
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
    </>)
}