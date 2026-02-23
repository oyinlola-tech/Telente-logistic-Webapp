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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pb-20 pt-[85px]">
        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">Our Services</h1>
            <p className="mx-auto max-w-3xl text-lg sm:text-xl">
              End-to-end logistics capabilities tailored for high-performance supply chains.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {loading ? (
            <p className="text-center text-gray-600">Loading services...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || Package;
                return (
                  <article
                    key={service.id}
                    className="rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-[#1b75bc] hover:shadow-lg"
                  >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#a5e3f6]/40">
                      <Icon className="h-8 w-8 text-[#1b75bc]" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-[#324048]">{service.title}</h3>
                    <p className="mb-6 text-gray-700">{service.description}</p>
                    <ul className="mb-6 space-y-2">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="mt-1 text-[#1b75bc]">-</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={`/services/${service.id}`} className="font-bold text-[#1b75bc] hover:underline">
                      Learn More {'->'}
                    </Link>
                  </article>
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
