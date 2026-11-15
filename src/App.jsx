import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Service from "./pages/Service";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function App() {
  const location = useLocation();

  const isAdminPage = location.pathname === "/admin";
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      <ScrollToTop />

      {!isAdminPage && <Navbar />}

      <main className={isAdminPage || isAuthPage ? "" : "pt-[78px]"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Service />} />
          <Route path="/products" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Customer Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Dashboard */}
          <Route path="/admin" element={<Admin />} />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;