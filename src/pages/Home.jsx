import { useState } from "react";
import inside from "../assets/inside.jpg";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Laptop,
  Monitor,
  Printer,
  Camera,
  Network,
  Wrench,
  ShieldCheck,
  Sparkles,
  Phone,
  CheckCircle2,
  Send,
  Star,
  Quote,
  MapPin,
  Clock,
  Navigation,
} from "lucide-react";

import Laptop3D from "../components/Laptop3D";

function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Laptop Solutions",
    message: "",
  });

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const text = `*New Service Inquiry*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Service:* ${formData.service}%0A*Details:* ${formData.message}`;
    window.open(`https://wa.me/919448146841?text=${text}`, "_blank");
  };

  const services = [
    {
      icon: Laptop,
      title: "Laptop Solutions",
      text: "Sales, upgrades, diagnostics and professional laptop service.",
    },
    {
      icon: Monitor,
      title: "Desktop Solutions",
      text: "Desktop sales, repairs, upgrades and complete setup support.",
    },
    {
      icon: Printer,
      title: "Printer Service",
      text: "Reliable printer servicing and troubleshooting solutions.",
    },
    {
      icon: Camera,
      title: "CCTV Solutions",
      text: "CCTV products and practical security solutions.",
    },
    {
      icon: Network,
      title: "Networking",
      text: "Computer networking and connectivity solutions.",
    },
    {
      icon: Wrench,
      title: "Repair & Support",
      text: "Professional computer troubleshooting and technical support.",
    },
  ];

  const reviews = [
    {
      name: "Amit Patil",
      role: "Laptop Screen & SSD Upgrade",
      text: "Replaced my Dell laptop screen in just 2 hours. Very transparent pricing and excellent behavior!",
      rating: 5,
    },
    {
      name: "Priya Kulkarni",
      role: "Office CCTV Setup",
      text: "Installed 6 CCTV cameras for our office space. Clean wiring and the mobile app view works perfectly.",
      rating: 5,
    },
    {
      name: "Rohan Deshmukh",
      role: "Desktop Gaming PC Repair",
      text: "Diagnosed a complex motherboard issue that other shops gave up on. Highly recommended for technical work!",
      rating: 5,
    },
  ];

  return (
    <main className="overflow-hidden bg-white text-slate-900">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24">

        {/* Background glow */}
        <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-purple-200/30 blur-[120px]" />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(90deg, #2563eb 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-10 px-6 py-14 lg:grid-cols-[1fr_1.1fr]">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Complete Computer Solutions
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] md:text-6xl xl:text-7xl">
              Technology that
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                works for you.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
              Sales, services, networking and computer solutions from
              <strong className="text-slate-800"> Global Systems</strong>.
              Get dependable technical support for your everyday technology
              needs.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#services"
                className="group flex items-center gap-3 rounded-full bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-200 transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
              >
                Explore Services
                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="tel:+919448146841"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600"
              >
                <Phone size={18} />
                Call Us
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4">
              {[
                "Professional Support",
                "Quality Solutions",
                "Complete Computer Care",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                  <CheckCircle2 size={18} className="text-blue-600" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT 3D AREA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex min-h-[580px] items-center justify-center"
          >

            {/* Large glow */}
            <div className="absolute h-[380px] w-[380px] rounded-full bg-blue-400/20 blur-[90px]" />

            {/* Decorative ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[430px] w-[430px] rounded-full border border-blue-200/60"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[510px] w-[510px] rounded-full border border-dashed border-purple-200/60"
            />

            {/* Floating Laptop card */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-2 top-20 z-30 rounded-2xl border border-white bg-white/90 p-4 shadow-2xl backdrop-blur-xl md:left-0"
            >
              <Laptop className="text-blue-600" size={28} />
              <p className="mt-1 text-xs font-bold text-slate-700">
                Laptops
              </p>
            </motion.div>

            {/* Floating printer card */}
            <motion.div
              animate={{ y: [0, 13, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute right-0 top-28 z-30 rounded-2xl border border-white bg-white/90 p-4 shadow-2xl backdrop-blur-xl"
            >
              <Printer className="text-purple-600" size={28} />
              <p className="mt-1 text-xs font-bold text-slate-700">
                Printers
              </p>
            </motion.div>

            {/* CCTV card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute bottom-28 left-8 z-30 rounded-2xl border border-white bg-white/90 p-4 shadow-2xl backdrop-blur-xl"
            >
              <Camera className="text-indigo-600" size={27} />
              <p className="mt-1 text-xs font-bold text-slate-700">
                CCTV
              </p>
            </motion.div>

            {/* 3D LAPTOP */}
            <div className="relative z-20 w-full max-w-[650px]">
              <Laptop3D />
            </div>

          </motion.div>
        </div>
      </section>

      {/* ================= SERVICE STRIP ================= */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">

          {[
            ["01", "Computer Sales"],
            ["02", "Expert Service"],
            ["03", "Networking"],
            ["04", "CCTV Solutions"],
          ].map(([number, title]) => (
            <div
              key={number}
              className="border-r border-slate-100 px-6 py-7 last:border-r-0"
            >
              <p className="text-sm font-black text-blue-600">{number}</p>
              <p className="mt-1 font-bold text-slate-800">{title}</p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section
        id="services"
        className="relative bg-slate-50 py-28"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="max-w-3xl">
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              What We Do
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Everything your computer needs.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              From purchasing a new system to keeping your existing technology
              running smoothly, Global Systems provides practical solutions
              for your business and everyday needs.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-2xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-7 text-xl font-black text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    {service.text}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600">
                    Learn more
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= WHY GLOBAL SYSTEMS ================= */}
      <section className="bg-white py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 shadow-2xl">

              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <Sparkles className="text-white/80" size={42} />

                <h3 className="mt-8 text-3xl font-black text-white md:text-4xl">
                  Complete Solution
                  <br />
                  for Computers
                </h3>

                <p className="mt-5 max-w-md leading-7 text-blue-100">
                  Sales, services, networking, peripherals, CCTV, laptops,
                  desktops, UPS and batteries — all under one roof.
                </p>

                <div className="mt-9 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                    <ShieldCheck className="text-white" />
                    <p className="mt-3 font-bold text-white">
                      Trusted Support
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                    <Wrench className="text-white" />
                    <p className="mt-3 font-bold text-white">
                      Technical Care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Why Choose Us
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Technology support without the confusion.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Whether you need a computer, a repair, networking support or
              security equipment, our goal is simple — provide a practical
              solution and dependable service.
            </p>

            <div className="mt-8 space-y-5">
              {[
                "Computer sales and technical support",
                "Laptop and desktop solutions",
                "Networking and CCTV solutions",
                "Printers, peripherals and accessories",
                "UPS and battery solutions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <CheckCircle2 size={17} />
                  </div>

                  <span className="font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= BOOKING FORM SECTION ================= */}
      <section id="booking" className="bg-slate-50 py-24 px-6">
        <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl md:p-12">
          <div className="text-center">
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">Quick Booking</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">Request a Service</h2>
            <p className="mt-2 text-slate-600">Fill out this quick form to send your details straight to our WhatsApp.</p>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700">Your Name</label>
              <input
                type="text"
                required
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700">Select Service</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600 bg-white"
                >
                  <option>Laptop Solutions</option>
                  <option>Desktop Solutions</option>
                  <option>Printer Service</option>
                  <option>CCTV Solutions</option>
                  <option>Networking</option>
                  <option>Repair & Support</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Describe the Issue</label>
              <textarea
                rows="3"
                placeholder="E.g., Laptop screen is flickering or needs an SSD upgrade..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              <Send size={18} />
              Send via WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">Customer Ratings</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">Loved by Local Customers</h2>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 border border-yellow-200">
              <Star className="fill-yellow-400 text-yellow-400" size={18} />
              4.9 / 5.0 Rating from 200+ Satisfied Clients
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {reviews.map((rev) => (
              <div key={rev.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm relative flex flex-col justify-between">
                <Quote className="text-blue-200 absolute right-6 top-6" size={48} />
                <div>
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-slate-600 leading-relaxed italic relative z-10">"{rev.text}"</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="font-black text-slate-900">{rev.name}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">{rev.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INSIDE GLOBAL SYSTEMS ================= */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 max-w-3xl"
          >
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Inside Global Systems
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Visit our store.
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                See what we offer.
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Take a look inside Global Systems and explore our computer
              products, services and complete technology solutions.
            </p>
          </motion.div>

          {/* Store image */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group relative overflow-hidden rounded-[2rem] shadow-2xl"
          >
            <img
              src={inside}
              alt="Inside Global Systems computer shop"
              className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[550px]"
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Image text */}
            <div className="absolute bottom-0 left-0 p-7 text-white md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                Our Store
              </p>

              <h3 className="mt-2 text-3xl font-black md:text-4xl">
                Welcome to Global Systems
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 md:text-base">
                Computer sales, service, networking and complete technology
                solutions under one roof.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================= STORE LOCATION & MAP SECTION ================= */}
      <section className="bg-white py-24 px-6">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
          
          <div>
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">Store Location</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">Visit Our Service Center</h2>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              Drop by our store for instant diagnostics, repair quotes, or computer purchasing guidance.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Address</h4>
                  <p className="text-slate-600 mt-1">Global Systems, Computer Store & Repair Center, Main Road</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Working Hours</h4>
                  <p className="text-slate-600 mt-1">Monday – Saturday: 10:00 AM – 8:30 PM</p>
                  <p className="text-xs font-semibold text-green-600 mt-0.5">● Open Today</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://maps.google.com/?q=Global+Systems"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
              >
                <Navigation size={18} />
                Get Google Maps Directions
              </a>
            </div>
          </div>

          <div className="h-[420px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-xl">
            <iframe
              title="Global Systems Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.0!2d75.123!3d15.364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDIxJzUwLjQiTiA3NcKwMDcnMjIuOCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 px-8 py-16 text-center shadow-2xl md:px-16">

          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-600/30 blur-[100px]" />

          <div className="relative">
            <p className="font-bold uppercase tracking-[0.25em] text-blue-400">
              Need Help?
            </p>

            <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
              Let's solve your computer needs.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
              Contact Global Systems for computer sales, service, networking
              and complete technology solutions.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="tel:+919448146841"
                className="flex items-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-blue-500"
              >
                <Phone size={18} />
                Call Global Systems
              </a>

              <a
                href="https://wa.me/919448146841"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white px-7 py-4 font-bold text-slate-900 transition hover:-translate-y-1"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;