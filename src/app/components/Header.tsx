import { Link, useLocation } from 'react-router';
import { Search } from 'lucide-react';

const imgLogo =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=160&q=80';

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-[60px] h-[65px]">
        <Link to="/" className="flex items-center gap-2">
          <img src={imgLogo} alt="Telente Logistics" className="h-[50px] w-auto" />
          <span className="text-xl font-bold text-[#324048]">Telente Logistics</span>
        </Link>
        
        <nav className="flex items-center gap-8">
          <Link
            to="/about"
            className={`text-lg ${isActive('/about') ? 'text-[#336FB3] font-bold' : 'text-black'}`}
          >
            About Us
          </Link>
          <Link
            to="/services"
            className={`text-lg ${isActive('/services') ? 'text-[#336FB3] font-bold' : 'text-black'}`}
          >
            Services
          </Link>
          <Link
            to="/news"
            className={`text-lg ${isActive('/news') ? 'text-[#336FB3] font-bold' : 'text-black'}`}
          >
            News
          </Link>
          <Link
            to="/careers"
            className={`text-lg ${isActive('/careers') ? 'text-[#336FB3] font-bold' : 'text-black'}`}
          >
            Careers
          </Link>
          <Link
            to="/contact"
            className={`text-lg ${isActive('/contact') ? 'text-[#336FB3] font-bold' : 'text-black'}`}
          >
            Contact
          </Link>
          
          <Link
            to="/tracking"
            className="flex items-center gap-2 bg-[#1b75bc] text-white px-6 py-2 rounded-full hover:bg-[#155a94] transition-colors"
          >
            <Search className="w-4 h-4" />
            Track Package
          </Link>
          
        </nav>
      </div>
    </header>
  );
}
