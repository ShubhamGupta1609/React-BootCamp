import React, { useState, useEffect } from 'react';
import './Notofication.scss'
const Notification = ({ message, type, duration, onClose, key }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return isVisible ? (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 9999,
            }}
            key={key}
        >
            <div
                className='pop_up_css'
            >
                <img alt="logo" className='icon_nav' src={require('../../assets/images/TBH_Small.png')}/>

                <span style={{fontSize: '10px'}}>
                     {message}
                </span>
               
            </div>
        </div>
    ) : null;
};

export default Notification;
