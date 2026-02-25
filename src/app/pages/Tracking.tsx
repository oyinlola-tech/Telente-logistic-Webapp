import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { packageApi, Package as PackageType } from '../utils/api';

type StatusType = PackageType['status'];
type RoutePoint = {
  key: string;
  location: string;
  status: StatusType;
  timestamp?: string;
  description?: string;
  isStart?: boolean;
};
type GeocodedPoint = RoutePoint & { lat: number; lng: number };
type DisplayTrackingEvent = {
  id: string;
  timestamp?: string;
  location: string;
  status: StatusType;
  description: string;
};

declare global {
  interface Window {
    L?: any;
  }
}

const LEAFLET_CSS_ID = 'tracking-leaflet-css';
const LEAFLET_SCRIPT_ID = 'tracking-leaflet-script';
const geocodeCache = new Map<string, { lat: number; lng: number } | null>();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColorMap: Record<StatusType, string> = {
  pending: '#eab308',
  in_transit: '#2563eb',
  out_for_delivery: '#ea580c',
  delayed: '#f97316',
  delivered: '#16a34a',
  cancelled: '#dc2626',
};

const formatStatusLabel = (status: string) =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const getStatusColor = (status: string) =>
  statusColorMap[status as StatusType] || '#64748b';

const normalizeStatus = (value: string | undefined, fallback: StatusType): StatusType => {
  const candidate = String(value || '').toLowerCase() as StatusType;
  return statusColorMap[candidate] ? candidate : fallback;
};

const formatTimestamp = (value?: string) => {
  if (!value) return 'Time unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Time unavailable';
  return parsed.toLocaleString();
};

const buildDisplayTrackingHistory = (pkg: PackageType): DisplayTrackingEvent[] => {
  const sender = pkg.senderAddress?.trim() || '';
  const recipient = pkg.recipientAddress?.trim() || '';
  const currentLocation = pkg.currentLocation?.trim() || '';
  const fallbackStatus: StatusType = pkg.status || 'pending';

  const events: DisplayTrackingEvent[] = [];
  if (sender) {
    events.push({
      id: `start-${pkg.id}`,
      timestamp: pkg.createdAt,
      location: sender,
      status: 'pending',
      description: 'Shipment created',
    });
  }

  const historyAsc = [...(pkg.trackingHistory || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  let lastKnownLocation = sender || '';
  historyAsc.forEach((event, index) => {
    const eventLocation = (event.location || '').trim();
    const location =
      eventLocation ||
      lastKnownLocation ||
      currentLocation ||
      recipient ||
      sender ||
      'Location unavailable';
    lastKnownLocation = location === 'Location unavailable' ? lastKnownLocation : location;
    const eventStatus = normalizeStatus(event.status, fallbackStatus);
    events.push({
      id: event.id || `history-${pkg.id}-${index}`,
      timestamp: event.timestamp,
      location,
      status: eventStatus,
      description: event.description || `Status changed to ${formatStatusLabel(eventStatus)}.`,
    });
  });

  const finalLocation =
    currentLocation ||
    recipient ||
    events[events.length - 1]?.location ||
    sender ||
    'Location unavailable';
  const finalStatus = normalizeStatus(pkg.status, 'pending');
  const last = events[events.length - 1];
  const needsFinalEvent = !last || last.status !== finalStatus;

  if (needsFinalEvent && finalLocation) {
    events.push({
      id: `final-${pkg.id}`,
      timestamp: pkg.updatedAt || pkg.estimatedDelivery,
      location: finalLocation,
      status: finalStatus,
      description:
        finalStatus === 'delivered'
          ? 'Package delivered'
          : `Current status: ${formatStatusLabel(finalStatus)}`,
    });
  }

  if (!events.length && recipient) {
    events.push({
      id: `recipient-only-${pkg.id}`,
      timestamp: pkg.updatedAt || pkg.createdAt,
      location: recipient,
      status: finalStatus,
      description: 'Shipment update',
    });
  }

  return events;
};

const buildRoutePoints = (history: DisplayTrackingEvent[], pkg: PackageType): RoutePoint[] => {
  const points: RoutePoint[] = [];
  history.forEach((event, index) => {
    const location = event.location?.trim();
    if (!location) return;
    points.push({
      key: `${event.id}-${index}-${location}`,
      location,
      status: normalizeStatus(event.status, pkg.status || 'pending'),
      timestamp: event.timestamp,
      description: event.description,
      isStart: index === 0,
    });
  });

  const sender = (pkg.senderAddress || '').trim();
  const recipient = (pkg.recipientAddress || '').trim();
  if (points.length === 1 && sender && recipient && sender.toLowerCase() !== recipient.toLowerCase()) {
    const only = points[0];
    if (only.location.toLowerCase() !== sender.toLowerCase()) {
      points.unshift({
        key: `force-start-${sender}`,
        location: sender,
        status: 'pending',
        timestamp: pkg.createdAt,
        description: 'Shipment created',
        isStart: true,
      });
    }
    if (points[points.length - 1].location.toLowerCase() !== recipient.toLowerCase()) {
      points.push({
        key: `force-end-${recipient}`,
        location: recipient,
        status: normalizeStatus(pkg.status, 'pending'),
        timestamp: pkg.updatedAt || pkg.estimatedDelivery,
        description: 'Destination',
      });
    }
  }

  return points;
};

const geocodeLocation = async (location: string): Promise<{ lat: number; lng: number } | null> => {
  const normalized = location.trim();
  if (!normalized) return null;
  if (geocodeCache.has(normalized)) {
    return geocodeCache.get(normalized) || null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/geocode?query=${encodeURIComponent(normalized)}`
    );
    if (!response.ok) {
      geocodeCache.set(normalized, null);
      return null;
    }
    const payload = await response.json();
    const data = payload?.data;
    if (!data?.lat || !data?.lng) {
      geocodeCache.set(normalized, null);
      return null;
    }
    const coords = { lat: Number(data.lat), lng: Number(data.lng) };
    geocodeCache.set(normalized, coords);
    return coords;
  } catch {
    geocodeCache.set(normalized, null);
    return null;
  }
};

const loadLeaflet = async (): Promise<any> => {
  if (typeof window === 'undefined') return null;
  if (window.L) return window.L;

  if (!document.getElementById(LEAFLET_CSS_ID)) {
    const css = document.createElement('link');
    css.id = LEAFLET_CSS_ID;
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
  }

  const existingScript = document.getElementById(LEAFLET_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      if (window.L) {
        resolve();
        return;
      }
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Leaflet')), { once: true });
    });
    return window.L;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = LEAFLET_SCRIPT_ID;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.body.appendChild(script);
  });

  return window.L;
};

export default function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageData, setPackageData] = useState<PackageType | null>(null);
  const [selectedMapLocation, setSelectedMapLocation] = useState<string>('');
  const [mapPoints, setMapPoints] = useState<GeocodedPoint[]>([]);
  const [focusPoint, setFocusPoint] = useState<GeocodedPoint | null>(null);
  const [mapError, setMapError] = useState('');
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const mapLayerRef = useRef<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedTracking = trackingNumber.trim().toUpperCase();
    
    if (!normalizedTracking) {
      setError('Please enter a tracking number');
      return;
    }
    if (!/^[A-Z0-9-]{6,50}$/.test(normalizedTracking)) {
      setError('Tracking number format is invalid.');
      return;
    }

    setLoading(true);
    setError('');
    setPackageData(null);

    try {
      const data = await packageApi.getByTrackingNumber(normalizedTracking);
      setPackageData(data);
      setTrackingNumber(normalizedTracking);
      setSelectedMapLocation(data.currentLocation || data.recipientAddress || '');
    } catch {
      setError('Package not found. Please check your tracking number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMapOpenUrl = (location: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const selectedPoint = useMemo(
    () => mapPoints.find((point) => point.location === selectedMapLocation),
    [mapPoints, selectedMapLocation]
  );

  const displayTrackingHistory = useMemo(() => {
    if (!packageData) return [];
    return buildDisplayTrackingHistory(packageData);
  }, [packageData]);

  const latestDelayReason = useMemo(() => {
    if (!displayTrackingHistory.length) return '';
    const delayedEvents = [...displayTrackingHistory].reverse().filter((event) => event.status === 'delayed');
    const latest = delayedEvents[0];
    return latest?.description || '';
  }, [displayTrackingHistory]);

  useEffect(() => {
    let cancelled = false;
    const populateRoutePoints = async () => {
      if (!packageData) {
        setMapPoints([]);
        setFocusPoint(null);
        setMapError('');
        return;
      }

      const routePoints = buildRoutePoints(displayTrackingHistory, packageData);
      if (!routePoints.length) {
        setMapPoints([]);
        setMapError('No mappable locations found for this package.');
        return;
      }

      setIsMapLoading(true);
      setMapError('');

      try {
        const validPoints: GeocodedPoint[] = [];
        for (const point of routePoints) {
          const coords = await geocodeLocation(point.location);
          if (cancelled) return;
          if (!coords) continue;
          validPoints.push({ ...point, ...coords });
        }

        setMapPoints(validPoints);
        setFocusPoint(null);
        if (!validPoints.length) {
          setMapError('Could not map the package route from the available addresses.');
        }
      } finally {
        if (!cancelled) setIsMapLoading(false);
      }
    };

    populateRoutePoints();
    return () => {
      cancelled = true;
    };
  }, [packageData, displayTrackingHistory]);

  useEffect(() => {
    let cancelled = false;
    const resolveFocusedLocation = async () => {
      if (!selectedMapLocation) {
        setFocusPoint(null);
        return;
      }
      const found = mapPoints.find((point) => point.location === selectedMapLocation);
      if (found) {
        setFocusPoint(found);
        return;
      }
      const coords = await geocodeLocation(selectedMapLocation);
      if (cancelled) return;
      if (!coords) {
        setFocusPoint(null);
        return;
      }
      setFocusPoint({
        key: `focus-${selectedMapLocation}`,
        location: selectedMapLocation,
        status: packageData?.status || 'in_transit',
        timestamp: packageData?.updatedAt,
        description: 'Selected location',
        ...coords,
      });
    };
    resolveFocusedLocation();
    return () => {
      cancelled = true;
    };
  }, [selectedMapLocation, mapPoints, packageData?.status, packageData?.updatedAt]);

  useEffect(() => {
    let isMounted = true;
    const renderMap = async () => {
      if (!mapElementRef.current || !mapPoints.length) return;
      const L = await loadLeaflet();
      if (!isMounted || !L || !mapElementRef.current) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapElementRef.current);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstanceRef.current);
      }

      if (mapLayerRef.current) {
        mapLayerRef.current.remove();
      }
      mapLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

      for (let i = 1; i < mapPoints.length; i += 1) {
        const previous = mapPoints[i - 1];
        const current = mapPoints[i];
        L.polyline(
          [
            [previous.lat, previous.lng],
            [current.lat, current.lng],
          ],
          {
            color: getStatusColor(current.status),
            weight: 5,
            opacity: 0.9,
          }
        ).addTo(mapLayerRef.current);
      }

      const pointsToRender = focusPoint && !mapPoints.some((p) => p.key === focusPoint.key)
        ? [...mapPoints, focusPoint]
        : mapPoints;

      pointsToRender.forEach((point, index) => {
        const marker = L.circleMarker([point.lat, point.lng], {
          radius: (focusPoint?.key === point.key || selectedPoint?.key === point.key) ? 8 : 6,
          color: '#ffffff',
          weight: 2,
          fillColor: getStatusColor(point.status),
          fillOpacity: 1,
        }).addTo(mapLayerRef.current);

        marker.bindPopup(`
          <strong>${point.isStart ? 'Start Address' : formatStatusLabel(point.status)}</strong><br/>
          ${point.location}<br/>
          ${point.timestamp ? formatTimestamp(point.timestamp) : ''}
          ${point.description ? `<br/>${point.description}` : ''}
        `);

        if (
          focusPoint?.key === point.key ||
          selectedPoint?.key === point.key ||
          (!selectedPoint && !focusPoint && index === pointsToRender.length - 1)
        ) {
          marker.openPopup();
        }
      });

      const bounds = L.latLngBounds(pointsToRender.map((point) => [point.lat, point.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    };

    renderMap();
    return () => {
      isMounted = false;
    };
  }, [mapPoints, selectedPoint, focusPoint]);

  useEffect(() => () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      mapLayerRef.current = null;
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'delayed':
        return <Clock className="w-6 h-6 text-orange-600" />;
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

                {packageData.status === 'delayed' && latestDelayReason && (
                  <div className="mt-6 pt-6 border-t border-white border-opacity-20">
                    <p className="text-sm opacity-90 mb-1">Delay Reason</p>
                    <p className="text-lg font-bold">{latestDelayReason}</p>
                  </div>
                )}
                
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
                  {displayTrackingHistory.length > 0 ? (
                    displayTrackingHistory.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getStatusColor(event.status) }}
                          />
                          {index < displayTrackingHistory.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-600">
                              {formatTimestamp(event.timestamp)}
                            </p>
                          </div>
                          <p className="font-bold text-[#2E4049] mb-1">{formatStatusLabel(event.status || 'pending')}</p>
                          <p className="text-gray-600">{event.description || 'Status update recorded.'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <p className="text-sm text-gray-600">{event.location || '-'}</p>
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
                  <p className="text-sm text-gray-600 mb-3">
                    Route starts from sender address and each segment is colored by status update.
                  </p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    {(Object.keys(statusColorMap) as StatusType[]).map((status) => (
                      <div key={status} className="flex items-center gap-2 text-xs text-gray-700">
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: statusColorMap[status] }}
                        />
                        <span>{formatStatusLabel(status)}</span>
                      </div>
                    ))}
                  </div>

                  {isMapLoading ? (
                    <div className="w-full h-[340px] rounded-xl border border-gray-200 flex items-center justify-center text-gray-600">
                      Loading route map...
                    </div>
                  ) : mapError ? (
                    <div className="w-full h-[340px] rounded-xl border border-red-200 bg-red-50 flex items-center justify-center text-red-600 px-4 text-center">
                      {mapError}
                    </div>
                  ) : (
                    <div ref={mapElementRef} className="w-full h-[340px] rounded-xl overflow-hidden border border-gray-200" />
                  )}
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
                  href="tel:+2342013300045"
                  className="text-[#1b75bc] font-bold hover:underline"
                >
                  Call: +234 201 330 0045
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="mailto:contact@telentelogistics.com"
                  className="text-[#1b75bc] font-bold hover:underline"
                >
                  Email Us
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
