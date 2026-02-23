import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Star, PiggyBank, Box, Clock, Shield, Users } from 'lucide-react';
import { Link } from 'react-router';
import logo from '../../assets/telente-logo.svg';

const imgHero =
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80';
const imgTestimonialBg =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80';
const imgTestimonialAvatar =
  'https://images.unsplash.com/photo-1586528116663-7f3f66f6cf6b?auto=format&fit=crop&w=240&q=80';

export default function Home() {
  const benefits = [
    {
      icon: Star,
      title: 'Diverse Services',
      description: 'High quality services',
    },
    {
      icon: Shield,
      title: 'End-to-End Transport',
      description: 'No intermediaries',
    },
    {
      icon: PiggyBank,
      title: 'Optimal Costs',
      description: 'Efficient and effective',
    },
    {
      icon: Box,
      title: 'Safe Goods',
      description: 'Always guaranteed',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Only 5-7 days worldwide',
    },
    {
      icon: Users,
      title: 'Trusted Partners',
      description: 'Reliable and customer-approved',
    },
  ];

  const partners = [logo, logo, logo, logo];

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[687px] mt-[65px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imgHero}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-[60px] flex items-center h-full">
          <div className="text-black max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              TELENTE LOGISTICS
            </h1>
            <h2 className="text-4xl mb-2">
              CONNECTING YOUR BUSINESS
            </h2>
            <h2 className="text-4xl">
              TO EVERYWHERE
            </h2>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-[#d9d9d9] h-[499px] rounded-lg"></div>
          <div>
            <h2 className="text-4xl font-bold text-[#324048] mb-6">ABOUT US</h2>
            <div className="h-1 w-[220px] bg-[#336FB3] mb-6"></div>
            <p className="text-lg text-gray-700 mb-4">
              Telente Logistics is a leading provider of comprehensive logistics solutions,
              committed to delivering excellence in every shipment.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              With years of experience and a global network, we ensure your goods reach
              their destination safely, efficiently, and on time.
            </p>
            <Link
              to="/about"
              className="text-[#1b75bc] font-bold text-lg hover:underline"
            >
              Learn More {'->'}
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-[#324048] text-center mb-4">
            FEATURED SERVICES
          </h2>
          <div className="h-1 w-[220px] bg-[#336FB3] mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              'Air Freight',
              'Sea Freight',
              'Land Transport',
              'Warehousing',
            ].map((service, index) => (
              <div key={index} className="bg-[#d9d9d9] h-[585px] rounded-lg"></div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/services"
              className="text-[#1b75bc] font-bold text-lg hover:underline"
            >
              View All Services {'->'}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-black text-center mb-4">
          WHY CHOOSE TELENTE LOGISTICS
        </h2>
        <div className="h-1 w-[220px] bg-[#336FB3] mx-auto mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-[#a5e3f6] bg-opacity-40 rounded-[30px] p-8 text-center"
            >
              <benefit.icon className="w-20 h-20 mx-auto mb-6 text-[#2E4049]" />
              <h3 className="text-2xl font-bold text-black mb-2">
                {benefit.title}
              </h3>
              <p className="text-xl text-black">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-black text-center mb-4">
            OUR PARTNERS
          </h2>
          <div className="h-1 w-[220px] bg-[#336FB3] mx-auto mb-12"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div key={index} className="w-[220px] h-[220px] flex items-center justify-center">
                <img src={partner} alt={`Partner ${index + 1}`} className="max-w-full max-h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={imgTestimonialBg}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#fafafa] mb-4">
                AUTHENTIC FEEDBACK
              </h2>
              <h3 className="text-3xl text-[#fafafa]">FROM OUR CLIENTS</h3>
            </div>
            
            <div className="bg-[rgba(83,170,222,0.5)] rounded-[30px] p-8">
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={imgTestimonialAvatar}
                  alt="Customer"
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <h4 className="text-3xl font-bold text-white mb-2">
                    Sarah Johnson
                  </h4>
                  <div className="h-px w-[220px] bg-[#336FB3] mb-2"></div>
                  <p className="text-xl text-white">
                    Warehouse Manager at XYZ Company
                  </p>
                </div>
              </div>
              <p className="text-xl text-white text-justify">
                "Thank you Telente Logistics for accompanying us and transporting
                our shipments carefully, thoughtfully, and always on time."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-black text-center mb-4">
          LATEST NEWS
        </h2>
        <div className="h-1 w-[220px] bg-[#336FB3] mx-auto mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 bg-[#d9d9d9] h-[370px] rounded-lg"></div>
          <div className="space-y-8">
            <div className="bg-[#d9d9d9] h-[162px] rounded-lg"></div>
            <div className="bg-[#d9d9d9] h-[162px] rounded-lg"></div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link
            to="/news"
            className="text-[#1b75bc] font-bold text-lg hover:underline"
          >
            View All News {'->'}
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1b75bc]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Ship with Us?
          </h2>
          <p className="text-xl text-white mb-8">
            Get started today and experience world-class logistics services
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-[#1b75bc] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/tracking"
              className="bg-[#2E4049] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1f2c32] transition-colors"
            >
              Track Your Package
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
