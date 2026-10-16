import { Phone, MessageCircle, Wrench } from "lucide-react";
import logo from "../assets/logo.jpg";

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 md:px-8">

        {/* BRAND */}
        <a href="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Global Systems"
            className="h-12 w-12 object-contain"
          />

          <div className="leading-none">
            <div className="text-[19px] font-black tracking-tight">
              <span className="text-blue-700">GLOBAL</span>{" "}
              <span className="text-red-500">SYSTEMS</span>
            </div>

            <p className="mt-1.5 text-[9px] font-semibold tracking-[0.08em] text-slate-500">
              COMPLETE SOLUTION FOR COMPUTERS
            </p>
          </div>
        </a>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Home
          </a>

          <a
            href="/services"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            Services
          </a>

          <a
            href="/products"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            Products
          </a>

          <a
            href="/about"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            About
          </a>

          <a
            href="/contact"
            className="font-medium text-slate-600 transition hover:text-blue-600"
          >
            Contact
          </a>
        </nav>

        {/* ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">
          {/* BOOK SERVICE BUTTON */}
          <a
            href="/#booking"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
          >
            <Wrench size={16} />
            Book Service
          </a>

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

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="/#booking"
            className="flex h-10 items-center gap-1.5 rounded-full bg-blue-600 px-3.5 text-xs font-bold text-white shadow-lg"
          >
            <Wrench size={14} />
            Book
          </a>

          <a
            href="tel:+919448146841"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg"
            aria-label="Call Global Systems"
          >
            <Phone size={18} />
          </a>
        </div>

      </div>
    </header>
  );
}

export default Navbar;