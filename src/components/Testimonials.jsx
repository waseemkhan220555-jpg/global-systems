import { Star, Quote } from "lucide-react";

export default function Testimonials() {
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
    <section className="bg-slate-50 py-24 px-6">
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
            <div key={rev.name} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm relative flex flex-col justify-between">
              <Quote className="text-blue-100 absolute right-6 top-6" size={48} />
              <div>
                <div className="flex gap-1 text-yellow-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400" />
                  ))}
                </div>
                <p className="mt-4 text-slate-600 leading-relaxed italic relative z-10">"{rev.text}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="font-black text-slate-900">{rev.name}</p>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}