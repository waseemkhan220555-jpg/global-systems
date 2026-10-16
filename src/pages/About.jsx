import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wrench,
  Users,
  Network,
  Laptop,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import inside from "../assets/inside.jpg";

const strengths = [
  {
    icon: ShieldCheck,
    title: "Trusted Solutions",
    text: "Practical computer products and technology solutions for everyday needs.",
  },
  {
    icon: Wrench,
    title: "Technical Expertise",
    text: "Professional support for computers, laptops, printers, networking and more.",
  },
  {
    icon: Users,
    title: "Customer Focused",
    text: "We understand your requirement first and then recommend the right solution.",
  },
  {
    icon: Network,
    title: "Complete Support",
    text: "Sales, service, networking and technology support under one roof.",
  },
];

const services = [
  "Laptop & Desktop Sales",
  "Computer Repair & Service",
  "Printer Service",
  "CCTV Solutions",
  "Networking Solutions",
  "UPS & Battery Solutions",
];

function About() {
  return (
    <main className="overflow-hidden bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 pb-24 pt-36">

        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />

        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-purple-200/30 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >

            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              About Global Systems
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900 md:text-6xl">

              Your trusted

              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                computer solution partner.
              </span>

            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">

              Global Systems provides computer sales, services, networking
              and technology solutions for homes, offices and businesses.

            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <div className="rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
                Computer Sales
              </div>

              <div className="rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
                Technical Service
              </div>

              <div className="rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm">
                Networking
              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* WHO WE ARE */}
      <section className="px-6 py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >

            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Who We Are
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">

              Technology made

              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                simple and reliable.
              </span>

            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">

              Global Systems is a complete computer solutions business
              focused on helping customers with dependable products,
              technical services and practical technology solutions.

            </p>

            <p className="mt-5 leading-8 text-slate-500">

              From setting up a new computer to repairing an existing
              system, installing CCTV or configuring a network, our goal
              is to make technology easier for our customers.

            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              {services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                >

                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-blue-600"
                  />

                  <span className="text-sm font-bold text-slate-700">
                    {service}
                  </span>

                </div>
              ))}

            </div>

          </motion.div>


          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="group relative overflow-hidden rounded-[2rem] shadow-2xl"
          >

            <img
              src={inside}
              alt="Inside Global Systems computer shop"
              className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-7 text-white">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                Global Systems
              </p>

              <h3 className="mt-2 text-3xl font-black">
                Complete Solution for Computers
              </h3>

            </div>

          </motion.div>

        </div>

      </section>


      {/* WHAT WE DO */}
      <section className="bg-slate-50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >

            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              What We Do
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-900 md:text-5xl">
              Everything you need,
              <span className="block text-blue-600">
                under one roof.
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              We provide a range of computer and technology services
              designed for homes, offices and businesses.
            </p>

          </motion.div>


          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {strengths.map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  whileHover={{ y: -7 }}
                  className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-xl"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                    <Icon size={27} />

                  </div>

                  <h3 className="mt-6 text-xl font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    {item.text}
                  </p>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>


      {/* WHY CHOOSE US */}
      <section className="px-6 py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">

          <div>

            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Why Choose Us
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">

              More than products.

              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                We provide solutions.
              </span>

            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">

              Choosing the right computer product is only the beginning.
              Global Systems focuses on helping customers with installation,
              maintenance, repair and ongoing technical support.

            </p>

          </div>


          <div className="grid gap-4 sm:grid-cols-2">

            {[
              {
                number: "01",
                title: "Understand",
                text: "We understand your actual requirement.",
              },
              {
                number: "02",
                title: "Recommend",
                text: "We suggest practical products and solutions.",
              },
              {
                number: "03",
                title: "Install",
                text: "We help with setup and technical installation.",
              },
              {
                number: "04",
                title: "Support",
                text: "We remain available for service and support.",
              },
            ].map((item) => (

              <div
                key={item.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <span className="text-sm font-black text-blue-600">
                  {item.number}
                </span>

                <h3 className="mt-3 text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 leading-6 text-slate-500">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="px-6 pb-24">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-purple-700 p-10 text-center shadow-2xl md:p-16"
        >

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white">

            <Laptop size={32} />

          </div>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Need a computer solution?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">

            Talk to Global Systems for computers, accessories,
            repairs, networking, printers, CCTV and more.

          </p>

          <a
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-700 transition hover:-translate-y-1 hover:bg-blue-50"
          >

            Contact Us

            <ArrowRight size={18} />

          </a>

        </motion.div>

      </section>

    </main>
  );
}

export default About;