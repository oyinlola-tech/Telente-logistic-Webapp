import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { ArrowRight, CheckCircle2, Globe2, MapPinned, ShieldCheck, Timer } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const trustStats = [
  { label: 'Shipments per Month', value: '45,000+' },
  { label: 'States Covered', value: '36 + FCT' },
  { label: 'On-Time Dispatch', value: '98.7%' },
  { label: 'Enterprise Clients', value: '520+' },
];

const serviceHighlights = [
  {
    title: 'Nationwide Distribution',
    text: 'Daily line-haul operations connecting Lagos, Abuja, Kano, Port Harcourt, and regional hubs.',
  },
  {
    title: 'International Freight',
    text: 'Sea and air freight solutions for importers, exporters, and cross-border e-commerce operations.',
  },
  {
    title: 'Secure Warehousing',
    text: 'Structured storage, inventory controls, and fast dispatch workflows for growth-stage businesses.',
  },
];

const operationalPillars = [
  {
    icon: Timer,
    title: 'Speed with Control',
    description: 'Clear dispatch timelines and route-level visibility across every shipment stage.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-First Operations',
    description: 'Documented handling, customs support, and reliable proof of delivery standards.',
  },
  {
    icon: Globe2,
    title: 'Global Trade Reach',
    description: 'From Nigerian ports and airports to key international delivery destinations.',
  },
  {
    icon: MapPinned,
    title: 'Deep Local Coverage',
    description: 'Dedicated last-mile delivery teams in strategic commercial and industrial zones.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1d2a33]">
      <Header />

      <main className="pt-[85px]">
        <section className="bg-gradient-to-br from-[#f4fbff] via-[#eef6ff] to-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <p className="mb-4 inline-flex w-fit items-center rounded-full border border-[#b6d8f6] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1b75bc]">
                Nigeria Built. Globally Connected.
              </p>
              <h1 className="text-4xl font-bold leading-tight text-[#21313b] sm:text-5xl">
                Logistics Infrastructure for Serious Businesses
              </h1>
              <p className="mt-5 max-w-xl text-lg text-[#4a5a66]">
                Telente Logistics helps companies move cargo, inventory, and customer orders across Nigeria and international routes with speed, visibility, and discipline.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/tracking"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1b75bc] px-6 py-3 font-bold text-white transition-colors hover:bg-[#155a94]"
                >
                  Track Shipment
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-[#d0deeb] bg-white px-6 py-3 font-bold text-[#2d3d49] transition-colors hover:bg-[#f5f9fc]"
                >
                  Request Quote
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-[#dde8f3] bg-white shadow-sm">
              <ImageWithFallback
                src="/images/hero-logistics.jpg"
                alt="Telente logistics operations"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8eef5] bg-white py-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {trustStats.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-2xl font-bold text-[#1b75bc]">{item.value}</p>
                <p className="text-sm text-[#5f6d78]">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <h2 className="text-3xl font-bold text-[#22323d] sm:text-4xl">What We Deliver</h2>
            <p className="mx-auto max-w-2xl text-[#5f6d78]">
              Integrated logistics services built to support imports, exports, nationwide distribution, and e-commerce fulfillment.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {serviceHighlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#e1e9f2] bg-[#f9fcff] p-6">
                <h3 className="text-xl font-bold text-[#263945]">{item.title}</h3>
                <p className="mt-3 text-[#5b6975]">{item.text}</p>
                <Link to="/services" className="mt-5 inline-flex items-center gap-2 font-bold text-[#1b75bc] hover:underline">
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#f4f8fc] py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-3xl font-bold text-[#22323d] sm:text-4xl">Operational Excellence at Scale</h2>
              <p className="mt-4 text-[#5b6975]">
                We combine disciplined operations, experienced field teams, and practical technology to keep your supply chain dependable from pickup to final delivery.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {operationalPillars.map((pillar) => (
                  <div key={pillar.title} className="rounded-xl border border-[#dde8f3] bg-white p-5">
                    <pillar.icon className="h-6 w-6 text-[#1b75bc]" />
                    <h3 className="mt-3 font-bold text-[#22323d]">{pillar.title}</h3>
                    <p className="mt-2 text-sm text-[#60707c]">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#dde8f3] bg-white p-8">
              <h3 className="text-2xl font-bold text-[#22323d]">Why Leading Teams Choose Telente</h3>
              <ul className="mt-6 space-y-4">
                {[
                  'Dedicated account managers for enterprise customers',
                  'Real-time shipment milestones and escalation workflows',
                  'Integrated line-haul, storage, and last-mile services',
                  'Focused support for Nigerian and international trade flows',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[#4f5e6b]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1b75bc]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-[#1b75bc] p-6 text-white">
                <p className="text-sm uppercase tracking-[0.15em] text-blue-100">Head Office</p>
                <p className="mt-1 font-bold">12B Admiralty Way, Lekki Phase 1, Lagos</p>
                <p className="mt-2 text-blue-50">Customer Desk: +234 201 330 0045</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#1b75bc] to-[#2f6fb2] px-6 py-10 text-center text-white sm:px-10">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to Upgrade Your Logistics Performance?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-50">
              Let us build a logistics plan aligned to your volume, timelines, and service-level expectations.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="rounded-full bg-white px-6 py-3 font-bold text-[#1b75bc] hover:bg-[#f0f6ff]">
                Talk to Our Team
              </Link>
              <Link to="/about" className="rounded-full border border-white/50 px-6 py-3 font-bold text-white hover:bg-white/10">
                Learn About Telente
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
