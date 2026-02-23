import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { packageApi, Package as PackageType } from '../utils/api';

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageData, setPackageData] = useState<PackageType | null>(null);
  const [selectedMapLocation, setSelectedMapLocation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setPackageData(null);

    try {
      const data = await packageApi.getByTrackingNumber(trackingNumber);
      setPackageData(data);
      setSelectedMapLocation(data.currentLocation || data.recipientAddress || '');
    } catch (err) {
      setError('Package not found. Please check your tracking number and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'in_transit':
      case 'out_for_delivery':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMapEmbedUrl = (location: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;

  const getMapOpenUrl = (location: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'pending':
        return <Package className="w-6 h-6 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Package className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <main className="pt-[85px] pb-20">
        <div className="max-w-4xl mx-auto px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#324048] mb-4">
              Track Your Package
            </h1>
            <p className="text-xl text-gray-600">
              Enter your tracking number to see the current status of your shipment
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., TL123456789)"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#1b75bc] transition-colors"
                />
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1b75bc] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#155a94] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <p className="text-red-600 font-bold">{error}</p>
              </div>
            </div>
          )}

          {/* Package Information */}
          {packageData && (
            <div className="space-y-8">
              {/* Status Card */}
              <div className="bg-gradient-to-r from-[#1b75bc] to-[#336FB3] rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Tracking Number</p>
                    <p className="text-3xl font-bold">{packageData.trackingNumber}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-full p-4">
                    {getStatusIcon(packageData.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Current Status</p>
                    <p className="text-xl font-bold capitalize">
                      {packageData.status.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Estimated Delivery</p>
                    <p className="text-xl font-bold">
                      {new Date(packageData.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {packageData.currentLocation && (
                  <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <p className="text-lg">Current Location: {packageData.currentLocation}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Shipping Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-[#324048] mb-4">Sender Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-bold text-[#2E4049]">{packageData.senderName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-bold text-[#2E4049]">{packageData.senderPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-bold text-[#2E4049]">{packageData.senderAddress}</p>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedMapLocation(packageData.senderAddress)}
                          className="text-sm text-[#1b75bc] font-bold hover:underline"
                        >
                          View sender address on map
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipient Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-[#324048] mb-4">Recipient Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-bold text-[#2E4049]">{packageData.recipientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-bold text-[#2E4049]">{packageData.recipientPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-bold text-[#2E4049]">{packageData.recipientAddress}</p>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedMapLocation(packageData.recipientAddress)}
                          className="text-sm text-[#1b75bc] font-bold hover:underline"
                        >
                          View recipient address on map
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#324048] mb-4">Package Details</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-bold text-[#2E4049]">{packageData.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="font-bold text-[#2E4049]">{packageData.dimensions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service Type</p>
                    <p className="font-bold text-[#2E4049]">{packageData.service}</p>
                  </div>
                </div>
              </div>

              {/* Tracking History */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#324048] mb-6">Tracking History</h3>
                <div className="space-y-6">
                  {packageData.trackingHistory && packageData.trackingHistory.length > 0 ? (
                    packageData.trackingHistory.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-[#1b75bc]' : 'bg-gray-300'}`}></div>
                          {index < packageData.trackingHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-600">
                              {new Date(event.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="font-bold text-[#2E4049] mb-1">{event.status}</p>
                          <p className="text-gray-600">{event.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-600">{event.location}</p>
                          </div>
                          <div className="mt-2 flex gap-3">
                            <button
                              type="button"
                              onClick={() => setSelectedMapLocation(event.location)}
                              className="text-sm text-[#1b75bc] font-bold hover:underline"
                            >
                              View on map
                            </button>
                            <a
                              href={getMapOpenUrl(event.location)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#2E4049] font-bold hover:underline"
                            >
                              Open maps
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No tracking history available</p>
                  )}
                </div>
              </div>

              {/* Live Map */}
              {selectedMapLocation ? (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#324048]">Location Map</h3>
                    <a
                      href={getMapOpenUrl(selectedMapLocation)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1b75bc] font-bold hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Showing: {selectedMapLocation}</p>
                  <div className="w-full h-[320px] rounded-xl overflow-hidden border border-gray-200">
                    <iframe
                      title="Package location map"
                      src={getMapEmbedUrl(selectedMapLocation)}
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Help Section */}
          {!packageData && !error && (
            <div className="text-center mt-12 p-8 bg-gray-50 rounded-xl">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#324048] mb-2">
                Need Help?
              </h3>
              <p className="text-gray-600 mb-4">
                If you're having trouble tracking your package, please contact our customer service
              </p>
              <div className="flex gap-4 justify-center mb-6">
                <a
                  href="tel:078.777.6666"
                  className="text-[#1b75bc] font-bold hover:underline"
                >
                  Call: 078.777.6666
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="mailto:contact@telentelogistics.com"
                  className="text-[#1b75bc] font-bold hover:underline"
                >
                  Email Us
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-bold text-[#324048] mb-3">Try these demo tracking numbers:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['TL202602210001', 'TL202602200045', 'TL202602180123'].map((num) => (
                    <button
                      key={num}
                      onClick={() => setTrackingNumber(num)}
                      className="px-4 py-2 bg-[#a5e3f6] bg-opacity-40 rounded-lg text-[#1b75bc] font-bold hover:bg-opacity-60 transition-colors text-sm"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
