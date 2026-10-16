import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Service from "./pages/Service";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const path =
    window.location.pathname.replace(/\/+$/, "") || "/";

  let page;

  switch (path) {
    case "/services":
      page = <Service />;
      break;

    case "/products":
      page = <Product />;
      break;

    case "/about":
      page = <About />;
      break;

    case "/contact":
      page = <Contact />;
      break;

    case "/":
    default:
      page = <Home />;
      break;
  }

  return (
    <>
      <Navbar />
      {page}
    </>
  );
}

export default App;