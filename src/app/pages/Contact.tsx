import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { contactApi } from '../utils/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', service: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      alert('Failed to submit form. This is a demo - connect your backend to enable this feature.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <main className="pt-[85px] pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="max-w-7xl mx-auto px-8 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Get in touch with our team for inquiries, quotes, or support
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-20 max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-bold text-[#324048] mb-8">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Have questions about our services? Need a quote for your shipping needs?
                Our team is here to help. Reach out to us through any of the following channels.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#a5e3f6] bg-opacity-40 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#1b75bc]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#324048] mb-1">Phone</h3>
                    <p className="text-gray-700">Hotline: 078.777.6666</p>
                    <p className="text-sm text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#a5e3f6] bg-opacity-40 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#1b75bc]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#324048] mb-1">Email</h3>
                    <p className="text-gray-700">contact@telentelogistics.com</p>
                    <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#a5e3f6] bg-opacity-40 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#1b75bc]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#324048] mb-1">Address</h3>
                    <p className="text-gray-700">
                      28C Le Truc, Ward 7<br />
                      Binh Thanh District<br />
                      Ho Chi Minh City
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-gray-200 rounded-xl h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Map View</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-[#324048] mb-6">
                Send Us a Message
              </h2>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-gray-700">
                    Thank you for contacting us. We'll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc] transition-colors"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Service Inquiry *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc] transition-colors appearance-none bg-white"
                    >
                      <option value="">Select a service</option>
                      <option value="air-freight">Air Freight</option>
                      <option value="sea-freight">Sea Freight</option>
                      <option value="land-transport">Land Transport</option>
                      <option value="warehousing">Warehousing</option>
                      <option value="express-delivery">Express Delivery</option>
                      <option value="international">International Shipping</option>
                      <option value="other">Other / General Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc] transition-colors resize-none"
                      placeholder="Tell us about your shipping needs..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1b75bc] text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-[#155a94] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-[#324048] text-center mb-12">
              Office Hours
            </h2>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="space-y-4">
                  {[
                    { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                    { day: 'Public Holidays', hours: 'Closed' },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0"
                    >
                      <span className="font-bold text-[#324048]">{schedule.day}</span>
                      <span className="text-gray-700">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-gray-600">
                    For urgent inquiries outside business hours, please email us at{' '}
                    <a href="mailto:urgent@telentelogistics.com" className="text-[#1b75bc] font-bold hover:underline">
                      urgent@telentelogistics.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
