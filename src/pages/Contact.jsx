import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Navigation,
  ArrowRight,
} from "lucide-react";

function Contact() {
  return (
    <main className="overflow-hidden bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 pb-20 pt-36">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-200/30 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm">
              <MessageCircle size={16} />
              Get In Touch
            </div>

            <h1 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
              Let’s solve your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                technology needs.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Need a computer, repair service, networking solution, CCTV,
              printer or power backup? Contact Global Systems in Hospet.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* PHONE */}
          <motion.a
            href="tel:+919448146841"
            whileHover={{ y: -7 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Phone size={27} />
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-900">
              Call Us
            </h2>

            <p className="mt-3 font-semibold text-slate-600">
              94481 46841
            </p>

            <p className="mt-1 font-semibold text-slate-500">
              70195 42925
            </p>
          </motion.a>

          {/* WHATSAPP */}
          <motion.a
            href="https://wa.me/919448146841"
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -7 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <MessageCircle size={27} />
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-900">
              WhatsApp
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Message us directly for product enquiries and service support.
            </p>
          </motion.a>

          {/* EMAIL */}
          <motion.a
            href="mailto:dhrahim@yahoo.com"
            whileHover={{ y: -7 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Mail size={27} />
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-900">
              Email
            </h2>

            <p className="mt-3 break-all text-sm font-semibold text-slate-600">
              dhrahim@yahoo.com
            </p>
          </motion.a>

          {/* LOCATION */}
          <motion.div
            whileHover={{ y: -7 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <MapPin size={27} />
            </div>

            <h2 className="mt-6 text-xl font-black text-slate-900">
              Visit Us
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              No. 218, beside Medinova (KLS) Hospital,
              ISR Road, Hospet – 583 201
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAP + INFO */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">

          {/* MAP */}
          <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-slate-100 shadow-xl">
            <iframe
              title="Global Systems Location"
              src="https://www.google.com/maps?q=Global%20Systems%20Hospet%20Karnataka&output=embed"
              className="h-[500px] w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center">
            <p className="font-bold uppercase tracking-[0.25em] text-blue-600">
              Global Systems
            </p>

            <h2 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">
              Complete solution
              <span className="block text-blue-600">
                for computers.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              We provide computer sales, services, networking, CCTV,
              printers, peripherals, laptops, desktops, UPS and battery
              solutions.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">Address</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    No. 218, beside Medinova (KLS) Hospital,
                    ISR Road, Hospet – 583 201
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Service & Support
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Contact us before visiting for service or product
                    availability.
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="tel:+919448146841"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                <Phone size={18} />
                Call Now
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Global+Systems+Hospet+Karnataka"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Navigation size={18} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center shadow-2xl md:p-16">

          <p className="font-bold uppercase tracking-[0.25em] text-blue-100">
            Need Help?
          </p>

          <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
            Talk to Global Systems.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-blue-100">
            Whether you need a new computer or technical support,
            we're here to help.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="tel:+919448146841"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-700 transition hover:-translate-y-1"
            >
              Call Us
              <ArrowRight size={18} />
            </a>

            <a
              href="https://wa.me/919448146841"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-green-600"
            >
              WhatsApp
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;