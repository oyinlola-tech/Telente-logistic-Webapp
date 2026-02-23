import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Plane, Ship, Truck, Warehouse, Package, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { serviceApi, Service } from '../utils/api';

const iconMap: Record<string, any> = {
  Plane,
  Ship,
  Truck,
  Warehouse,
  Package,
  Globe,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await serviceApi.getAll();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-[85px] pb-20">
        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="max-w-7xl mx-auto px-8 text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Our Services</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Comprehensive logistics solutions tailored to your shipping needs.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-8">
          {loading ? (
            <p className="text-center text-gray-600">Loading services...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Package;
                return (
                  <div
                    key={service.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#1b75bc] hover:shadow-lg transition-all"
                  >
                    <div className="w-16 h-16 bg-[#a5e3f6] bg-opacity-40 rounded-full flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-[#1b75bc]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#324048] mb-3">{service.title}</h3>
                    <p className="text-gray-700 mb-6">{service.description}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-[#1b75bc] mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={`/services/${service.id}`} className="text-[#1b75bc] font-bold hover:underline">
                      Learn More →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
