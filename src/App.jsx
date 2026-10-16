import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";   // Note the 's'
import Products from "./pages/Products";   // Note the 's'
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  let page;

  switch (path) {
    case "/services":
      page = <Services />;
      break;

    case "/products":
      page = <Products />;
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