import { Facebook, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../../assets/telente-logo.svg';

const imgBackground =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80';

export function Footer() {
  return (
    <footer className="relative bg-[rgba(217,217,217,0.5)] pt-12 pb-6">
      <div className="absolute left-0 top-0 h-full w-[300px] overflow-hidden opacity-30">
        <img
          src={imgBackground}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={logo} alt="Telente Logistics logo" className="w-10 h-10 rounded-lg" />
              <h3 className="text-2xl font-bold text-[#2e4049]">
                Telente Logistics Co., Ltd.
              </h3>
            </div>
            <div className="h-0.5 w-36 bg-[#1b75bc] mb-4"></div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#1b75bc]" />
                <div>
                  <span className="font-bold text-[#2e4049]">Hotline: </span>
                  <span className="text-[#2e4049]">078.777.6666</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1b75bc] mt-1" />
                <div>
                  <span className="font-bold text-[#2e4049]">Address: </span>
                  <span className="text-[#2e4049]">
                    28C Le Truc, Ward 7, Binh Thanh District, Ho Chi Minh City
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#1b75bc]" />
                <div>
                  <span className="font-bold text-[#2e4049]">Email: </span>
                  <span className="text-[#2e4049]">contact@telentelogistics.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-2xl font-bold text-[#2e4049] mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Facebook className="w-10 h-10 text-[#1877F2]" fill="#1877F2" />
              </a>
              <a
                href="mailto:contact@telentelogistics.com"
                className="hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-[#EA5A47] rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-[#2e4049]">
            (c) 2026 Telente Logistics. All rights reserved.
          </p>
          <p className="text-[#2e4049] mt-2">
            Built by Oluwayemi Oyinlola. Portfolio:{' '}
            <a
              href="https://oyinlola.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1b75bc] font-bold hover:underline"
            >
              oyinlola.site
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

