import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Add your routes here */}
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
