import React, { Suspense, Component } from "react";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Printer,
  Camera,
  Network,
  Wrench,
  HardDrive,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Phone,
} from "lucide-react";

import Headphone3D from "../components/headphone3D";

/* =========================================================
   3D ERROR BOUNDARY
   ========================================================= */

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Headphone 3D error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[400px] w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Monitor size={30} />
            </div>
            <p className="mt-4 font-bold text-slate-700">Global Systems</p>
            <p className="mt-1 text-sm text-slate-400">Technology solutions</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* =========================================================
   3D LOADING
   ========================================================= */

function ModelLoading() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="mt-4 text-sm font-semibold text-slate-400">
          Loading 3D model...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   SERVICES DATA
   ========================================================= */

const services = [
  {
    icon: Laptop,
    title: "Laptop Service",
    description:
      "Professional laptop troubleshooting, servicing, upgrades and maintenance.",
    points: ["Diagnosis", "Upgrades", "Hardware support"],
  },
  {
    icon: Monitor,
    title: "Desktop Service",
    description:
      "Complete desktop repair, upgrades and technical support for home and business systems.",
    points: ["Repair", "Upgrades", "System setup"],
  },
  {
    icon: Printer,
    title: "Printer Service",
    description:
      "Practical printer troubleshooting and servicing for reliable everyday printing.",
    points: ["Troubleshooting", "Maintenance", "Technical support"],
  },
  {
    icon: Camera,
    title: "CCTV Solutions",
    description:
      "CCTV products and security solutions for homes, shops and workplaces.",
    points: ["CCTV cameras", "Setup", "Support"],
  },
  {
    icon: Network,
    title: "Networking",
    description:
      "Computer networking solutions designed for reliable connectivity.",
    points: ["Network setup", "Connectivity", "Technical support"],
  },
  {
    icon: Wrench,
    title: "Computer Repair",
    description:
      "Technical assistance for computer problems, hardware issues and system maintenance.",
    points: ["Diagnostics", "Hardware service", "Maintenance"],
  },
  {
    icon: HardDrive,
    title: "Refurbished Systems",
    description:
      "Refurbished computer solutions for customers looking for practical technology options.",
    points: ["Refurbished PCs", "Laptops", "System support"],
  },
  {
    icon: ShieldCheck,
    title: "UPS & Battery Solutions",
    description:
      "UPS and battery products for dependable power backup for computer systems.",
    points: ["UPS", "Batteries", "Power backup"],
  },
];

/* =========================================================
   SERVICE PAGE
   ========================================================= */

export default function Service() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 px-6 pb-16 pt-32 md:pb-20 md:pt-36">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-purple-200/30 blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm">
              <Wrench size={16} />
              Professional Computer Services
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              Services built around{" "}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                your technology.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              From laptop and desktop service to networking, CCTV, printers and
              power backup solutions, Global Systems provides complete
              computer solutions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Laptop Service",
                "Printer Support",
                "CCTV",
                "Networking",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="tel:+919448146841"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                <Phone size={18} />
                Get Technical Support
                <ArrowRight size={17} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT - 3D HEADPHONE DISPLAY */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden"
          >
            <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-blue-300/25 blur-[100px]" />
            <div className="pointer-events-none absolute h-80 w-80 rounded-full border border-blue-200/40" />
            <div className="pointer-events-none absolute h-64 w-64 rounded-full border border-purple-200/30" />

            <div className="relative z-10 h-[500px] w-full max-w-lg">
              <ModelErrorBoundary>
                <Suspense fallback={<ModelLoading />}>
                  <Headphone3D />
                </Suspense>
              </ModelErrorBoundary>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-8 right-2 z-20 rounded-2xl border border-white/80 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md md:right-8"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Technology Support
              </p>
              <p className="mt-1 font-black text-slate-800">
                Complete Solutions
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES INTRO */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-12 max-w-3xl"
          >
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              What We Do
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Complete technology{" "}
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                services under one roof.
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              From repairs and upgrades to networking, security and power backup,
              our services are designed to keep your technology running reliably.
            </p>
          </motion.div>

          {/* SERVICE CARDS */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  whileHover={{ y: -7 }}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-2xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-7 text-xl font-black text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-6 space-y-2">
                    {service.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                      >
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-blue-600"
                        />
                        {point}
                      </div>
                    ))}
                  </div>

                  <a
                    href="tel:+919448146841"
                    className="mt-7 flex items-center gap-2 text-sm font-bold text-blue-600"
                  >
                    Get support
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center shadow-2xl md:p-16"
        >
          <p className="font-bold uppercase tracking-[0.25em] text-blue-100">
            Need Technical Help?
          </p>

          <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Let Global Systems help.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Contact us for computer sales, service, networking, CCTV, printers
            and other technology solutions.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="tel:+919448146841"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
            >
              <Phone size={18} />
              Call Now
            </a>

            <a
              href="https://wa.me/919448146841"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
            >
              WhatsApp Us
              <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}