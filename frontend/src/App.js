import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Sass
import './Scss/Main.scss';

// Import Pages
import Home from './Pages/Home.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
