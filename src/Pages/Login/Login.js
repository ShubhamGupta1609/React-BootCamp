import './index.scss'
import {Navigate, useNavigate} from 'react-router-dom';
import {useEffect, useState} from "react";

import axios from 'axios';
import Loader from "../../Components/Loader/Loader";
import Notification from '../../Components/Notification/Notification';
import {LIVE_URL} from "../../env";
import packageJson from '../../../package.json'; // Adjust the path accordingly
export default function Login() {
    
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [notificationKey, setNotificationKey] = useState(0);
    let navigate = useNavigate();
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [otp, setOtp] = useState('');
    let [login, setLogin] = useState(false);
    let [ShowResendOTP, SetShowResendOTP] = useState(false);
    let [loader, setLoader] = useState(false)
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            requestOtp();
        }
    }
    function handleKeyDownLogin(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkLogin();
        }
    }
    const requestOtp = (value) => {
        if(value === 'Resend'){
            resetTimer()
        }
       
        let baseUrl = LIVE_URL + 'sendOTPOnemail'
        if (email === '' || password === '') {
            setNotificationKey(notificationKey + 1); // Increment the key to show the new message
            setNotificationMessage('Please Enter Email Address And Password.')
            setNotificationType('failed');
            
        } else {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            const isValid = emailRegex.test(email);
            if (!isValid) {
                setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                setNotificationMessage('Please check you email address.')
                setNotificationType('failed');
                return false;
            }
            setLoader(true)
            const headers = {
                'Content-Type': 'text/plain;charset=utf-8'
            };
            var payload = {
                username: email, password: password
            }
            axios.post(baseUrl, payload, {headers}).then((response) => {
                if (response.data.status && response.data.status_code !== '424' && response.data.status_code !== '614') {
                    setLoader(false)
                    setLogin(true)
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage('OTP Send To Registered Email Address!');
                    setNotificationType('success');
                } else if(response.data.status_code == '424') {
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(response.data.message)
                    setNotificationType('failed');
                    setLoader(false)
                }
                else if(response.data.status_code == '614') {
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(response.data.message)
                    setNotificationType('failed');
                    setLoader(false)
                }else {
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(response.data.message)
                    setNotificationType('failed');
                    setLoader(false)
                }
            }).catch((err => {
                setLoader(false)
                console.log(err)
            }))
        }
    }
    const ForgetPasswordScreen = () => {
        navigate('/forgetpassword')
    }
    const [timer, setTimer] = useState(5 * 60); // Timer in seconds
    useEffect(() => {
        let interval = null;
        if (login && timer > 0) {
            interval = setInterval(() => {
                setTimer((timer) => timer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
            if (timer === 0) {
                SetShowResendOTP(true);
            }
        }
        return () => clearInterval(interval);
    }, [login, timer, SetShowResendOTP]);

    const secondsToMinutes = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        return `${minutes}:${formattedSeconds}`;
    };

    const [showPassword, setShowPassword] = useState(false);
    const resetTimer = () => {
        setTimer(300);
        SetShowResendOTP(false);
    };

    const checkLogin = (value) => {
        let baseUrl = LIVE_URL + 'loginauth'
        if (email === '' || password === '' || otp === '') {
            setNotificationKey(notificationKey + 1); // Increment the key to show the new message
            setNotificationMessage('Please Enter OTP')
            setNotificationType('failed');
        } else {
            setLoader(true)
            const headers = {
                'Content-Type': 'text/plain;charset=utf-8'
            };
            var payload = {
                username: email, password: password, otp: otp, flag: 1
            }
            axios.post(baseUrl, payload, {headers}).then((response) => {
                if (response.data.status) {
                    let userData = response.data.data
                    localStorage.setItem("emailaddress", userData.emailaddress)
                    localStorage.setItem("token", response.data.systemtoken)
                    localStorage.setItem("useraddress", response.data.useraddress)
                    localStorage.setItem("firstname", response.data.data.firstname)
                    localStorage.setItem("lastname", response.data.data.lastname)
                    localStorage.setItem("mobilenumber", response.data.data.mobilenumber)
                    localStorage.setItem("userid", response.data.data.userid)
                    setLoader(false)
                    navigate('/categorylisting')
                } else {
                    setLoader(false)
                    setNotificationKey(notificationKey + 1); // Increment the key to show the new message
                    setNotificationMessage(response.data.message)
                 }
            }).catch((err => {
                setLoader(false)
                console.log(err)
            }))
        }
    }
    return (<>
        <Loader status={loader}/>
        {notificationMessage && (
            <Notification
                message={notificationMessage}
                type={notificationType}
                duration={1000}
                onClose={() => {
                    setNotificationMessage('');
                    setNotificationType('');
                }}
                key={notificationKey} // Pass down the key prop
            />
        )}
        {localStorage.getItem('token') ? <Navigate to="/categorylisting"/> : <div className="body-login">
            {/*<div className="body-Login">*/}
            <div className="box">
                <div className="form">
                    <img alt="logo" style={{height: '100px', width: '100px', margin: 'auto'}}
                         src={require('../../assets/images/HB_logo.jpg')}/>
                    <h3 style={{color: 'blue'}}>SIGN IN</h3>

                    <div className={login === true ? 'freeze-class inputBox' : 'inputBox'}>
                        <input type="email" value={email} placeholder="Email Address" required='required'
                               onChange={(e) => {
                                   setEmail(e.target.value)
                               }}/>
                    </div>
                    <div className={login === true ? 'freeze-class inputBox' : 'inputBox'}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            placeholder="Password"
                            required='required'
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                        <p onClick={() => setShowPassword(!showPassword)} >
                            {showPassword ? <><i className="fa fa-eye showpassclass"></i></> : <><i className="fa fa-eye showpassclass"></i></>}
                        </p>
                    </div>
                    <input className={login === true ? 'freeze-class loginButton' : 'loginButton'} type="submit" value="Sign in" onClick={requestOtp}/>
                    <span style={{display: "flex", justifyContent: "end", marginTop: '10px'}}><span onClick={ForgetPasswordScreen} style={{cursor: 'pointer'}}>Forgot Password</span></span>
                    {login === true ?<div>
                        <div className="inputBox1">
                            <input
                                type="text"
                                value={otp}
                                placeholder="Enter your 6 digit OTP"
                                required
                                onKeyDown={handleKeyDownLogin}
                                maxLength={6}
                                onChange={(e) => {
                                    const input = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                                    setOtp(input);
                                }}
                            />

                        </div>
                        <input
                            className={login === true ? "loginButton" : "loginButton"}
                            type="submit"
                            value={login ? secondsToMinutes(timer) : "Sign in"}
                            onClick={requestOtp}
                            disabled={login && timer > 0}
                            style={{border: "unset", width: '190%'}}
                        />
                        <div className='d-flex justify-content-around'>
                            <input disabled={!ShowResendOTP} className={`loginButton loginButton-1 text-center -align-center ${!ShowResendOTP && 'opacity-50'} ${!ShowResendOTP && 'pointer-events-none'}`} type="submit" value="Resend OTP" onClick={()=>{requestOtp('Resend')}}/>
                            <input className='loginButton loginButton-1 text-center -align-center ' type="submit" value="Submit" onClick={() =>{checkLogin('')}}/> 
                        </div>
                       
                    </div> : <></>}
                    
                </div>
            </div>
            <div>
                    <span
                        style={{position: 'absolute', bottom: '20px', right: '10px', color: 'black'}}>Version {packageJson.version}</span>
            </div>
        </div>}
    </>)
}