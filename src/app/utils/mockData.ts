import { Package } from './api';

// Local sample data for development fallback
export const mockPackages: Package[] = [
  {
    id: '1',
    trackingNumber: 'TLNG260220001',
    senderName: 'Adewale Logistics Hub',
    senderPhone: '+234-803-111-2200',
    senderAddress: '45 Wharf Road, Apapa, Lagos, Nigeria',
    recipientName: 'Ngozi Okafor',
    recipientPhone: '+234-806-445-1120',
    recipientAddress: '18 Independence Layout, Enugu, Nigeria',
    weight: 5.5,
    dimensions: '30x20x15 cm',
    service: 'Express',
    status: 'in_transit',
    currentLocation: 'Benin Transit Hub, Edo',
    estimatedDelivery: '2026-02-25',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-21T14:30:00Z',
    trackingHistory: [
      {
        id: '1-1',
        timestamp: '2026-02-20T10:00:00Z',
        location: 'Apapa, Lagos',
        status: 'Package Received',
        description: 'Package received and manifest created.',
      },
      {
        id: '1-2',
        timestamp: '2026-02-20T15:30:00Z',
        location: 'Lagos Mainland Distribution Center',
        status: 'In Transit',
        description: 'Shipment dispatched to regional corridor.',
      },
      {
        id: '1-3',
        timestamp: '2026-02-21T08:15:00Z',
        location: 'Benin City, Edo',
        status: 'Arrived at Hub',
        description: 'Shipment scanned at Benin hub.',
      },
      {
        id: '1-4',
        timestamp: '2026-02-21T14:30:00Z',
        location: 'Benin Transit Hub, Edo',
        status: 'In Transit',
        description: 'Shipment loaded for final line-haul.',
      },
    ],
  },
  {
    id: '2',
    trackingNumber: 'TLNG260220045',
    senderName: 'Mainland Tech Stores',
    senderPhone: '+234-809-232-5600',
    senderAddress: '12 Allen Avenue, Ikeja, Lagos, Nigeria',
    recipientName: 'Binta Yusuf',
    recipientPhone: '+234-807-990-1188',
    recipientAddress: '36 Ahmadu Bello Way, Kaduna, Nigeria',
    weight: 12.3,
    dimensions: '50x40x30 cm',
    service: 'Standard',
    status: 'out_for_delivery',
    currentLocation: 'Kaduna City Dispatch, Kaduna',
    estimatedDelivery: '2026-02-22',
    createdAt: '2026-02-19T09:00:00Z',
    updatedAt: '2026-02-21T07:00:00Z',
    trackingHistory: [
      {
        id: '2-1',
        timestamp: '2026-02-19T09:00:00Z',
        location: 'Ikeja, Lagos',
        status: 'Package Received',
        description: 'Package picked up from sender.',
      },
      {
        id: '2-2',
        timestamp: '2026-02-19T18:00:00Z',
        location: 'Lagos Distribution Center',
        status: 'Processing',
        description: 'Package sorted for northbound movement.',
      },
      {
        id: '2-3',
        timestamp: '2026-02-20T06:00:00Z',
        location: 'Abuja Central Hub, FCT',
        status: 'In Transit',
        description: 'Package reached Abuja transfer hub.',
      },
      {
        id: '2-4',
        timestamp: '2026-02-20T22:00:00Z',
        location: 'Kaduna, Kaduna State',
        status: 'Arrived at Destination',
        description: 'Package reached destination city.',
      },
      {
        id: '2-5',
        timestamp: '2026-02-21T07:00:00Z',
        location: 'Kaduna City Dispatch, Kaduna',
        status: 'Out for Delivery',
        description: 'Package loaded for doorstep delivery.',
      },
    ],
  },
  {
    id: '3',
    trackingNumber: 'TLNG260218123',
    senderName: 'Port Harcourt Export Desk',
    senderPhone: '+234-803-778-4200',
    senderAddress: '22 Aba Road, Port Harcourt, Rivers, Nigeria',
    recipientName: 'Temitope Akinola',
    recipientPhone: '+234-805-227-9134',
    recipientAddress: '9 Ring Road, Ibadan, Oyo, Nigeria',
    weight: 8.7,
    dimensions: '40x30x25 cm',
    service: 'Priority',
    status: 'delivered',
    currentLocation: 'Delivered',
    estimatedDelivery: '2026-02-20',
    createdAt: '2026-02-17T11:00:00Z',
    updatedAt: '2026-02-20T15:45:00Z',
    trackingHistory: [
      {
        id: '3-1',
        timestamp: '2026-02-17T11:00:00Z',
        location: 'Port Harcourt, Rivers',
        status: 'Package Received',
        description: 'Package accepted at origin station.',
      },
      {
        id: '3-2',
        timestamp: '2026-02-18T03:00:00Z',
        location: 'Benin Transit Hub, Edo',
        status: 'In Transit',
        description: 'Package processed at intermediate hub.',
      },
      {
        id: '3-3',
        timestamp: '2026-02-19T12:00:00Z',
        location: 'Ibadan Last-Mile Station, Oyo',
        status: 'Out for Delivery',
        description: 'Package moved to last-mile delivery team.',
      },
      {
        id: '3-4',
        timestamp: '2026-02-20T15:45:00Z',
        location: 'Ibadan, Oyo',
        status: 'Delivered',
        description: 'Package delivered successfully and confirmed.',
      },
    ],
  },
];

export function getMockPackageByTrackingNumber(trackingNumber: string): Package | undefined {
  return mockPackages.find((pkg) => pkg.trackingNumber === trackingNumber);
}

export function getMockPackagesPaginated(page: number = 1, limit: number = 10, statusFilter?: string) {
  let filtered = mockPackages;

  if (statusFilter && statusFilter !== 'all') {
    filtered = mockPackages.filter((pkg) => pkg.status === statusFilter);
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    packages: filtered.slice(start, end),
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
  };
}
