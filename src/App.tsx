import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import Zodiac from './pages/Zodiac';
import Daily from './pages/Daily';
import Destiny from './pages/Destiny';
import Premium from './pages/Premium';
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <div className="min-h-screen bg-[#051d1f] text-[#f6f9ff]">
      <CustomCursor />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/zodiac" element={<Zodiac />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/destiny" element={<Destiny />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
