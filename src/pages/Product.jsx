import { motion } from "framer-motion";
import {
  Laptop,
  HardDrive,
  MemoryStick,
  Mouse,
  Keyboard,
  Printer,
  Camera,
  BatteryCharging,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import jiobook from "../assets/products/jiobook.jpg";
import lenovo from "../assets/products/lenovo.jpg";
import ram from "../assets/products/ram.jpg";
import ssd from "../assets/products/ssd.jpg";
import hdd from "../assets/products/hdd.jpg";
import mouse from "../assets/products/mouse.jpg";
import keyboard from "../assets/products/keyboard.jpg";
import printer from "../assets/products/printer.jpg";
import cctv from "../assets/products/cctv.jpg";
import ups from "../assets/products/ups.jpg";

const products = [
  {
    image: jiobook,
    icon: Laptop,
    category: "Laptop",
    name: "JioBook 11",
    price: "₹10,990",
    description:
      "Compact laptop for everyday computing, study and basic office work.",
  },
  {
    image: lenovo,
    icon: Laptop,
    category: "Laptop",
    name: "Lenovo IdeaPad Slim 3",
    price: "₹39,499",
    description:
      "Slim everyday laptop suitable for office, study and professional use.",
  },
  {
    image: ram,
    icon: MemoryStick,
    category: "RAM",
    name: "Patriot 16GB DDR4 RAM",
    price: "₹12,099",
    description:
      "16GB DDR4 memory for compatible desktop and laptop systems.",
  },
  {
    image: ram,
    icon: MemoryStick,
    category: "RAM",
    name: "EVM 16GB DDR4 RAM",
    price: "₹8,899",
    description:
      "High-capacity DDR4 memory for compatible computer systems.",
  },
  {
    image: ssd,
    icon: HardDrive,
    category: "SSD",
    name: "Zebronics 512GB SSD",
    price: "₹5,999",
    description:
      "512GB solid-state storage for faster everyday computing.",
  },
  {
    image: ssd,
    icon: HardDrive,
    category: "SSD",
    name: "FOXIN NVMe SSD",
    price: "₹7,999",
    description:
      "Fast NVMe storage for compatible desktops and laptops.",
  },
  {
    image: hdd,
    icon: HardDrive,
    category: "Hard Disk",
    name: "WD 2TB External HDD",
    price: "Reference Price",
    description:
      "Portable external storage for backups, files and media.",
  },
  {
    image: mouse,
    icon: Mouse,
    category: "Mouse",
    name: "Dell MS116 Mouse",
    price: "₹800",
    description:
      "Simple and reliable wired mouse for everyday computer use.",
  },
  {
    image: keyboard,
    icon: Keyboard,
    category: "Keyboard",
    name: "Portronics Bubble 3.0 Keyboard",
    price: "₹879",
    description:
      "Comfortable keyboard for home, office and everyday computing.",
  },
  {
    image: keyboard,
    icon: Keyboard,
    category: "Keyboard",
    name: "Frontech Keyboard",
    price: "₹269",
    description:
      "Affordable keyboard for everyday desktop requirements.",
  },
  {
    image: printer,
    icon: Printer,
    category: "Printer",
    name: "Canon Pixma Printer",
    price: "Reference Price",
    description:
      "Compact printing solution for home and office requirements.",
  },
  {
    image: printer,
    icon: Printer,
    category: "Printer",
    name: "HP DeskJet Printer",
    price: "Reference Price",
    description:
      "Practical printer solution for everyday document printing.",
  },
  {
    image: cctv,
    icon: Camera,
    category: "CCTV",
    name: "CP Plus CCTV Combo",
    price: "₹6,960",
    description:
      "Security camera solution for homes, offices and businesses.",
  },
  {
    image: cctv,
    icon: Camera,
    category: "CCTV",
    name: "2MP CCTV Camera",
    price: "₹754",
    description:
      "Affordable CCTV camera for basic security requirements.",
  },
  {
    image: ups,
    icon: BatteryCharging,
    category: "UPS",
    name: "UPS Protector 725",
    price: "₹2,543",
    description:
      "Power backup solution for computers and electronic equipment.",
  },
];

function Product() {
  const enquire = (productName) => {
    const message = `Hello Global Systems, I am interested in ${productName}. Please share the current availability and price.`;

    window.open(
      `https://wa.me/919448146841?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="overflow-hidden bg-white">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-purple-50 px-6 pb-20 pt-36">

        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />

        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-200/30 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-bold text-purple-600 shadow-sm">
              <ShoppingBag size={16} />
              Products & Solutions
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">

              Quality products.

              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Honest technology solutions.
              </span>

            </h1>

            {/* Description */}
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">

              Explore laptops, RAM, SSDs, hard disks, keyboards, mice,
              printers, CCTV, UPS and other computer products available
              through Global Systems.

            </p>

            {/* Price Notice */}
            <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm leading-6 text-blue-800">

              <strong>Price note:</strong>{" "}
              Prices shown are online reference prices and may change.
              Contact Global Systems for current availability and final price.

            </div>

          </motion.div>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS
      ====================================================== */}
      <section className="bg-slate-50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >

            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Featured Products
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-900 md:text-5xl">
              Explore our products
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
              Looking for a product? Check the reference price and contact
              Global Systems directly for availability.
            </p>

          </motion.div>


          {/* Product grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {products.map((product, index) => {

              const Icon = product.icon;

              return (
                <motion.div
                  key={product.name}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.04,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-2xl"
                >

                  {/* =================================================
                      PRODUCT IMAGE
                  ================================================== */}
                  <div className="relative h-56 overflow-hidden bg-white">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-110"
                    />

                    {/* Category */}
                    <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-md backdrop-blur">
                      {product.category}
                    </div>

                    {/* Bottom gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/70 to-transparent" />

                  </div>


                  {/* =================================================
                      PRODUCT DETAILS
                  ================================================== */}
                  <div className="p-7">

                    {/* Product name */}
                    <h3 className="text-xl font-black text-slate-900">
                      {product.name}
                    </h3>


                    {/* Description */}
                    <p className="mt-3 min-h-[56px] leading-7 text-slate-500">
                      {product.description}
                    </p>


                    {/* Price */}
                    <div className="mt-6">

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Online reference price
                      </p>

                      <p className="mt-1 text-2xl font-black text-blue-600">
                        {product.price}
                      </p>

                    </div>


                    {/* Enquire button */}
                    <button
                      onClick={() => enquire(product.name)}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-600"
                    >

                      Enquire Now

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />

                    </button>

                  </div>

                </motion.div>
              );
            })}

          </div>

        </div>

      </section>


      {/* =====================================================
          REFURBISHED COMPUTERS
      ====================================================== */}
      <section className="px-6 py-24">

        <div className="mx-auto grid max-w-7xl items-center gap-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-purple-700 p-8 shadow-2xl md:p-14 lg:grid-cols-2">

          {/* Text */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            <p className="font-bold uppercase tracking-[0.25em] text-blue-100">
              Smart Choice
            </p>

            <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">

              Refurbished computers

              <br />

              that make sense.

            </h2>

            <p className="mt-6 max-w-xl leading-8 text-blue-100">

              Looking for a practical computer solution?
              Ask Global Systems about available refurbished
              laptops and desktop systems.

            </p>

            <button
              onClick={() => enquire("a refurbished computer")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-700 transition hover:-translate-y-1 hover:bg-blue-50"
            >

              Check Availability

              <ArrowRight size={18} />

            </button>

          </motion.div>


          {/* Laptop visual */}
          <div className="relative flex min-h-[280px] items-center justify-center">

            <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <motion.div
              animate={{
                y: [0, -12, 0],
                rotate: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="relative"
            >

              {/* Laptop screen */}
              <div className="h-40 w-64 rounded-2xl border-8 border-slate-200 bg-slate-900 shadow-2xl md:h-48 md:w-80">

                <div className="m-3 flex h-[calc(100%-1.5rem)] items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">

                  <Laptop
                    className="text-white"
                    size={60}
                    strokeWidth={1.4}
                  />

                </div>

              </div>

              {/* Laptop base */}
              <div className="mx-auto h-5 w-72 rounded-b-2xl bg-slate-200 shadow-xl md:w-96" />

            </motion.div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="px-6 pb-24">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto max-w-5xl rounded-[2.5rem] border border-slate-200 bg-slate-50 p-10 text-center md:p-14"
        >

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">

            <ShoppingBag size={30} />

          </div>

          <h2 className="mt-6 text-3xl font-black text-slate-900 md:text-4xl">

            Can't find what you're looking for?

          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">

            Contact Global Systems and tell us what product you need.
            We'll help you find the right solution.

          </p>

          <button
            onClick={() => enquire("a computer product")}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
          >

            Contact Global Systems

            <ArrowRight size={18} />

          </button>

        </motion.div>

      </section>

    </main>
  );
}

export default Product;