import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, Wrench, Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">

        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="Global Systems"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          />

          <div className="leading-none">
            <div className="text-[16px] sm:text-[19px] font-black tracking-tight">
              <span className="text-blue-700">GLOBAL</span>{" "}
              <span className="text-red-500">SYSTEMS</span>
            </div>

            <p className="mt-1.5 text-[8px] sm:text-[9px] font-semibold tracking-[0.08em] text-slate-500">
              COMPLETE SOLUTION FOR COMPUTERS
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="font-semibold text-slate-700 transition hover:text-blue-600">
            Home
          </Link>
          <Link to="/services" className="font-medium text-slate-600 transition hover:text-blue-600">
            Services
          </Link>
          <Link to="/products" className="font-medium text-slate-600 transition hover:text-blue-600">
            Products
          </Link>
          <Link to="/about" className="font-medium text-slate-600 transition hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="font-medium text-slate-600 transition hover:text-blue-600">
            Contact
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/#booking"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
          >
            <Wrench size={16} />
            Book Service
          </Link>

          <a
            href="tel:+919448146841"
            className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
          >
            <Phone size={16} />
            Call
          </a>

          <a
            href="https://wa.me/919448146841"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:-translate-y-0.5 hover:bg-green-600"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>

        {/* MOBILE ACTIONS & HAMBURGER TOGGLE */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="tel:+919448146841"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700"
            aria-label="Call Global Systems"
          >
            <Phone size={16} />
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute top-[78px] left-0 w-full border-b border-slate-200 bg-white/95 px-6 py-6 shadow-xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-slate-700 text-base py-1"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={() => setIsOpen(false)}
              className="font-medium text-slate-600 text-base py-1"
            >
              Services
            </Link>
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="font-medium text-slate-600 text-base py-1"
            >
              Products
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="font-medium text-slate-600 text-base py-1"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="font-medium text-slate-600 text-base py-1"
            >
              Contact
            </Link>

            <div className="mt-2 flex flex-col gap-2.5 pt-4 border-t border-slate-100">
              <Link
                to="/#booking"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-sm font-bold text-white shadow-md"
              >
                <Wrench size={16} />
                Book Service
              </Link>
              <a
                href="https://wa.me/919448146841"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-green-500 py-3 text-sm font-bold text-white shadow-md"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;