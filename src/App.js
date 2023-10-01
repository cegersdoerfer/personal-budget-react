import './App.scss';
import Menu from './Menu/Menu';
import Hero from './Hero/Hero';
import Footer from './Footer/Footer';
import HomePage from './HomePage/HomePage';
import LoginPage from './LoginPage/LoginPage';
import AboutPage from './AboutPage/AboutPage';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";



function App() {
  return (
    <Router className="App">
      <Menu />
      <Hero />
      <div className="mainContainer">
        <Routes>
          <Route path="/about" element={<AboutPage />}>
          </Route>
          <Route path="/login" element={<LoginPage />}>
          </Route>
          <Route path="/" element={<HomePage />}>
          </Route>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
