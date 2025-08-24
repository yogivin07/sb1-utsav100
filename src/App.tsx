import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';

import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import About from './pages/About';
import Makepayment from './pages/Makepayment';


import { ProductCatalog } from './components/ProductCatalog' ;




function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          
          
        </Routes>
      </div>
      <div className="powr-popup" id="ec4cb8fc_1755972151"></div>
      <script src="https://www.powr.io/powr.js?platform=html"></script>
    
    

    </Router>
    
      
    
  );
}

export default App;