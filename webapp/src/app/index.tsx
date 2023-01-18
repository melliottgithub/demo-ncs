import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Shifts from '../shifts';
import Query from '../query';

function App() {
  return (
    <Router>
    <div className="flex-column m-auto max-width p-xsmall-left p-xsmall-right">
      <header className="flex-row secondary-1 font-size-xxlarge">
        <p>Company Demo App</p>
      </header>
      <div className="flex-row justify-center font-size-medium">
        <Routes>
          <Route path="/" element={<Shifts />} />
          <Route path="/query/:name" element={<Query />} />
        </Routes>
      </div>
      
    </div>
    </Router>
  );
}

export default App;
