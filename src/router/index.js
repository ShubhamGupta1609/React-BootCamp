import '../App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import CryptoPrices from '../Components/InterviewComponents/CryptoPricesComponent';

function AppRouter() {
    return (
        <Router>
            <Routes>
                { <Route path="/" element={<CryptoPrices />} /> }
            </Routes>
        </Router>
    );
}

export default AppRouter;
