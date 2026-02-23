import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <main className="pt-[85px] pb-20">
        <div className="max-w-4xl mx-auto px-8 py-20 text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#1b75bc] mb-4">404</h1>
            <h2 className="text-4xl font-bold text-[#324048] mb-4">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/"
              className="flex items-center gap-2 bg-[#1b75bc] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#155a94] transition-colors"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <Link
              to="/tracking"
              className="flex items-center gap-2 bg-[#2E4049] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1f2c32] transition-colors"
            >
              <Search className="w-5 h-5" />
              Track Package
            </Link>
          </div>

          <div className="mt-16 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-[#324048] mb-6">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Services' },
                { to: '/news', label: 'News' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="bg-gray-50 px-6 py-3 rounded-lg font-bold text-[#1b75bc] hover:bg-gray-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
