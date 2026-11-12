import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Service from "./pages/Service";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <>
      <ScrollToTop />

      {!isAdminPage && <Navbar />}

      <main className={isAdminPage ? "" : "pt-[78px]"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Service />} />
          <Route path="/products" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

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