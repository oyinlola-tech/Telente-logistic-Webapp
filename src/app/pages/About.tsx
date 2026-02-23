import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Award, Globe, ShieldCheck, Target, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const leadership = [
  { name: 'Amina Bello', role: 'Chief Executive Officer' },
  { name: 'Tunde Adebayo', role: 'Chief Operations Officer' },
  { name: 'Chinonso Eze', role: 'Chief Technology Officer' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-20 pt-[85px]">
        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">About Telente Logistics</h1>
            <p className="mx-auto max-w-3xl text-lg text-blue-50 sm:text-xl">
              A Nigerian logistics company helping businesses scale with dependable national and international movement.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-[#dde8f3] bg-white shadow-sm">
            <ImageWithFallback
              src="/images/about-warehouse.jpg"
              alt="Telente warehouse operations"
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-[#22323d]">Built for the Demands of Modern Commerce</h2>
            <p className="text-[#5e6d79]">
              Telente Logistics supports importers, manufacturers, distributors, and e-commerce brands with coordinated freight, warehousing, and delivery operations.
            </p>
            <p className="text-[#5e6d79]">
              From ports and airports to nationwide distribution points, our teams combine structured processes with practical technology to keep goods moving efficiently.
            </p>
            <p className="text-[#5e6d79]">
              We focus on consistency, communication, and accountability so clients can plan inventory and customer delivery promises with confidence.
            </p>
          </div>
        </section>

        <section className="bg-[#f6f9fc] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-[#dde8f3] bg-white p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f2fb]">
                  <Target className="h-6 w-6 text-[#1b75bc]" />
                </div>
                <h3 className="text-2xl font-bold text-[#243541]">Our Mission</h3>
                <p className="mt-3 text-[#5f6e7a]">
                  Deliver logistics services that raise operational reliability for every client, regardless of shipment size or route complexity.
                </p>
              </article>
              <article className="rounded-2xl border border-[#dde8f3] bg-white p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e7f2fb]">
                  <Globe className="h-6 w-6 text-[#1b75bc]" />
                </div>
                <h3 className="text-2xl font-bold text-[#243541]">Our Vision</h3>
                <p className="mt-3 text-[#5f6e7a]">
                  Become Africa&apos;s most trusted logistics execution partner for businesses that require speed, traceability, and disciplined delivery outcomes.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#22323d] sm:text-4xl">Core Values</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Award,
                title: 'Execution Excellence',
                description: 'We prioritize measurable quality in handling, dispatch, and delivery.',
              },
              {
                icon: Users,
                title: 'Client Partnership',
                description: 'We align operations to client SLAs, growth plans, and business realities.',
              },
              {
                icon: ShieldCheck,
                title: 'Operational Integrity',
                description: 'We apply transparent processes and clear accountability across teams.',
              },
              {
                icon: Globe,
                title: 'Continuous Innovation',
                description: 'We improve our logistics stack to deliver better speed and visibility.',
              },
            ].map((value) => (
              <div key={value.title} className="rounded-xl border border-[#e1e9f2] bg-[#f9fcff] p-6 text-center">
                <value.icon className="mx-auto h-8 w-8 text-[#1b75bc]" />
                <h3 className="mt-4 text-lg font-bold text-[#243541]">{value.title}</h3>
                <p className="mt-2 text-sm text-[#5f6d79]">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#f6f9fc] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-10 text-center text-3xl font-bold text-[#22323d] sm:text-4xl">Leadership Team</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {leadership.map((member) => (
                <div key={member.name} className="rounded-xl border border-[#dde8f3] bg-white p-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf3fb] text-xl font-bold text-[#1b75bc]">
                    {member.name
                      .split(' ')
                      .map((segment) => segment[0])
                      .join('')}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#243541]">{member.name}</h3>
                  <p className="text-[#647380]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1b75bc] py-14">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center text-white sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              { value: '12+', label: 'Years in Logistics' },
              { value: '36 + FCT', label: 'Coverage Footprint' },
              { value: '45K+', label: 'Monthly Shipments' },
              { value: '98.7%', label: 'Dispatch Reliability' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
