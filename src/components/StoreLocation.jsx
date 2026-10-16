import { MapPin, Clock, Navigation } from "lucide-react";

export default function StoreLocation() {
  return (
    <section className="bg-white py-20 px-6">
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

        <div className="h-[400px] w-full overflow-hidden rounded-[2.5rem] border border-slate-200 shadow-xl">
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
  );
}