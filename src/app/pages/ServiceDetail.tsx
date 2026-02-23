import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useParams, Link } from 'react-router';
import { Plane, Ship, Truck, Warehouse, Package, Globe, ArrowLeft, CheckCircle } from 'lucide-react';
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

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadService = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const data = await serviceApi.getById(id);
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <main className="pt-[85px] pb-20 max-w-7xl mx-auto px-8">Loading service...</main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <main className="pt-[85px] pb-20">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h1 className="text-4xl font-bold text-[#324048] mb-4">{error || 'Service not found'}</h1>
            <Link to="/services" className="text-[#1b75bc] font-bold hover:underline">
              ← Back to Services
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Package;

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <main className="pt-[85px] pb-20">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Link to="/services" className="flex items-center gap-2 text-[#1b75bc] hover:underline">
            <ArrowLeft className="w-5 h-5" />
            Back to Services
          </Link>
        </div>

        <section className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center gap-6 text-white">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Icon className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-4">{service.title}</h1>
                <p className="text-xl">{service.description}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-8">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-[#324048] mb-6">Overview</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {service.longDescription || service.description}
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-[#324048] mb-8">Key Features</h2>
                <ul className="space-y-4">
                  {service.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-[#1b75bc] flex-shrink-0 mt-1" />
                      <span className="text-lg text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-[#324048] mb-8">Benefits</h2>
                <div className="space-y-6">
                  {(service.benefits || []).map((benefit: string, index: number) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-lg text-gray-700">{benefit}</p>
                    </div>
                  ))}
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
