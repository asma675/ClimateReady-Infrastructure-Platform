import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import RiskMap from "./RiskMap";

import Investments from "./Investments";

import Assets from "./Assets";

import Methodology from "./Methodology";

import LiveMonitoring from "./LiveMonitoring";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    RiskMap: RiskMap,
    
    Investments: Investments,
    
    Assets: Assets,
    
    Methodology: Methodology,
    
    LiveMonitoring: LiveMonitoring,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/RiskMap" element={<RiskMap />} />
                
                <Route path="/Investments" element={<Investments />} />
                
                <Route path="/Assets" element={<Assets />} />
                
                <Route path="/Methodology" element={<Methodology />} />
                
                <Route path="/LiveMonitoring" element={<LiveMonitoring />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}