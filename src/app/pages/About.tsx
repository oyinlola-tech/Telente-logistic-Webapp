import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Target, Users, Award, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <main className="pt-[85px] pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="max-w-7xl mx-auto px-8 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About Telente Logistics</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Your trusted partner in global logistics solutions, connecting businesses worldwide
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-16 h-16 bg-[#1b75bc] rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#324048] mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700">
                To provide seamless, reliable, and efficient logistics solutions that empower
                businesses to reach their full potential in the global marketplace. We strive
                to exceed expectations through innovation, dedication, and exceptional service.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="w-16 h-16 bg-[#336FB3] rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#324048] mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700">
                To become the world's most trusted and innovative logistics partner, recognized
                for our commitment to sustainability, technology-driven solutions, and
                customer-centric approach in every shipment we handle.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-[#324048] text-center mb-12">Our Story</h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700">
              <p>
                Founded with a vision to revolutionize the logistics industry, Telente Logistics
                has grown from a small local operation to a global logistics powerhouse. Our
                journey began with a simple belief: that every business, regardless of size,
                deserves access to world-class shipping solutions.
              </p>
              <p>
                Over the years, we've built an extensive network spanning continents, invested
                in cutting-edge technology, and assembled a team of dedicated professionals who
                share our passion for excellence. Today, we handle thousands of shipments daily,
                each one treated with the same care and attention to detail.
              </p>
              <p>
                What sets us apart is our unwavering commitment to our customers. We don't just
                move packages; we build relationships, solve problems, and help businesses grow.
                From small startups to Fortune 500 companies, our clients trust us to deliver
                their goods safely, efficiently, and on time, every time.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-[#324048] text-center mb-4">
            Our Core Values
          </h2>
          <div className="h-1 w-[220px] bg-[#336FB3] mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Excellence',
                description: 'We pursue excellence in every aspect of our service',
              },
              {
                icon: Users,
                title: 'Customer First',
                description: 'Our customers success is our top priority',
              },
              {
                icon: Target,
                title: 'Reliability',
                description: 'We deliver on our promises, every single time',
              },
              {
                icon: Globe,
                title: 'Innovation',
                description: 'We embrace technology to improve our services',
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-[#a5e3f6] bg-opacity-40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-10 h-10 text-[#1b75bc]" />
                </div>
                <h3 className="text-xl font-bold text-[#324048] mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-[#324048] text-center mb-12">
              Our Leadership Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'John Anderson', role: 'Chief Executive Officer' },
                { name: 'Sarah Williams', role: 'Chief Operations Officer' },
                { name: 'Michael Chen', role: 'Chief Technology Officer' },
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-[#324048] mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-[#1b75bc]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {[
                { value: '15+', label: 'Years of Experience' },
                { value: '50+', label: 'Countries Served' },
                { value: '10K+', label: 'Daily Shipments' },
                { value: '99.9%', label: 'On-Time Delivery' },
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-5xl font-bold mb-2">{stat.value}</p>
                  <p className="text-xl">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
