import { Link, useLocation } from 'react-router';
import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

const imgLogo =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=160&q=80';

const navItems = [
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/news', label: 'News' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-[65px]">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
          <img src={imgLogo} alt="Telente Logistics" className="h-[44px] w-auto" />
          <span className="text-lg md:text-xl font-bold text-[#324048]">Telente Logistics</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-lg ${isActive(item.to) ? 'text-[#336FB3] font-bold' : 'text-black'}`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/tracking"
            className="flex items-center gap-2 bg-[#1b75bc] text-white px-6 py-2 rounded-full hover:bg-[#155a94] transition-colors"
          >
            <Search className="w-4 h-4" />
            Track Package
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden p-2 rounded-md border border-gray-200 text-[#324048]"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={closeMobile}
              className={`block px-2 py-2 rounded ${
                isActive(item.to) ? 'bg-blue-50 text-[#336FB3] font-bold' : 'text-[#324048]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/tracking"
            onClick={closeMobile}
            className="flex items-center justify-center gap-2 bg-[#1b75bc] text-white px-4 py-2 rounded-lg font-semibold"
          >
            <Search className="w-4 h-4" />
            Track Package
          </Link>
        </div>
      ) : null}
    </header>
  );
}
