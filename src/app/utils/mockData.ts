// Mock data for demo purposes - Remove this in production
import { Package } from './api';

export const mockPackages: Package[] = [
  {
    id: '1',
    trackingNumber: 'TL202602210001',
    senderName: 'John Anderson',
    senderPhone: '+1-555-0123',
    senderAddress: '123 Shipping Lane, New York, NY 10001, USA',
    recipientName: 'Sarah Williams',
    recipientPhone: '+1-555-0456',
    recipientAddress: '456 Delivery Street, Los Angeles, CA 90001, USA',
    weight: 5.5,
    dimensions: '30x20x15 cm',
    service: 'Express',
    status: 'in_transit',
    currentLocation: 'Chicago Distribution Center',
    estimatedDelivery: '2026-02-25',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-21T14:30:00Z',
    trackingHistory: [
      {
        id: '1-1',
        timestamp: '2026-02-20T10:00:00Z',
        location: 'New York, NY',
        status: 'Package Received',
        description: 'Package received at origin facility and processing started',
      },
      {
        id: '1-2',
        timestamp: '2026-02-20T15:30:00Z',
        location: 'New York Distribution Center',
        status: 'In Transit',
        description: 'Package departed facility and in transit to next location',
      },
      {
        id: '1-3',
        timestamp: '2026-02-21T08:15:00Z',
        location: 'Chicago, IL',
        status: 'Arrived at Hub',
        description: 'Package arrived at Chicago distribution hub',
      },
      {
        id: '1-4',
        timestamp: '2026-02-21T14:30:00Z',
        location: 'Chicago Distribution Center',
        status: 'In Transit',
        description: 'Package sorted and loaded for next destination',
      },
    ],
  },
  {
    id: '2',
    trackingNumber: 'TL202602200045',
    senderName: 'Tech Solutions Inc.',
    senderPhone: '+1-555-0789',
    senderAddress: '789 Business Blvd, San Francisco, CA 94102, USA',
    recipientName: 'Michael Chen',
    recipientPhone: '+1-555-0321',
    recipientAddress: '321 Tech Park, Seattle, WA 98101, USA',
    weight: 12.3,
    dimensions: '50x40x30 cm',
    service: 'Standard',
    status: 'out_for_delivery',
    currentLocation: 'Seattle Local Facility',
    estimatedDelivery: '2026-02-22',
    createdAt: '2026-02-19T09:00:00Z',
    updatedAt: '2026-02-21T07:00:00Z',
    trackingHistory: [
      {
        id: '2-1',
        timestamp: '2026-02-19T09:00:00Z',
        location: 'San Francisco, CA',
        status: 'Package Received',
        description: 'Package picked up from sender',
      },
      {
        id: '2-2',
        timestamp: '2026-02-19T18:00:00Z',
        location: 'San Francisco Distribution Center',
        status: 'Processing',
        description: 'Package processed and sorted',
      },
      {
        id: '2-3',
        timestamp: '2026-02-20T06:00:00Z',
        location: 'Portland, OR',
        status: 'In Transit',
        description: 'Package in transit through Portland hub',
      },
      {
        id: '2-4',
        timestamp: '2026-02-20T22:00:00Z',
        location: 'Seattle, WA',
        status: 'Arrived at Destination',
        description: 'Package arrived at destination city',
      },
      {
        id: '2-5',
        timestamp: '2026-02-21T07:00:00Z',
        location: 'Seattle Local Facility',
        status: 'Out for Delivery',
        description: 'Package loaded on delivery vehicle',
      },
    ],
  },
  {
    id: '3',
    trackingNumber: 'TL202602180123',
    senderName: 'Global Exports Ltd.',
    senderPhone: '+1-555-0147',
    senderAddress: '147 Export Way, Miami, FL 33101, USA',
    recipientName: 'Emma Rodriguez',
    recipientPhone: '+1-555-0258',
    recipientAddress: '258 Main Street, Boston, MA 02101, USA',
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
        location: 'Miami, FL',
        status: 'Package Received',
        description: 'Package received at facility',
      },
      {
        id: '3-2',
        timestamp: '2026-02-18T03:00:00Z',
        location: 'Atlanta, GA',
        status: 'In Transit',
        description: 'Package processed at Atlanta hub',
      },
      {
        id: '3-3',
        timestamp: '2026-02-19T12:00:00Z',
        location: 'New York, NY',
        status: 'In Transit',
        description: 'Package arrived at New York facility',
      },
      {
        id: '3-4',
        timestamp: '2026-02-20T08:00:00Z',
        location: 'Boston, MA',
        status: 'Out for Delivery',
        description: 'Package out for delivery',
      },
      {
        id: '3-5',
        timestamp: '2026-02-20T15:45:00Z',
        location: 'Boston, MA',
        status: 'Delivered',
        description: 'Package delivered successfully. Signed by recipient.',
      },
    ],
  },
  {
    id: '4',
    trackingNumber: 'TL202602210089',
    senderName: 'Fashion Boutique',
    senderPhone: '+1-555-0369',
    senderAddress: '369 Style Avenue, Austin, TX 78701, USA',
    recipientName: 'David Park',
    recipientPhone: '+1-555-0741',
    recipientAddress: '741 Fashion Lane, Denver, CO 80201, USA',
    weight: 3.2,
    dimensions: '25x20x10 cm',
    service: 'Express',
    status: 'pending',
    currentLocation: 'Austin Processing Center',
    estimatedDelivery: '2026-02-24',
    createdAt: '2026-02-21T16:00:00Z',
    updatedAt: '2026-02-21T16:00:00Z',
    trackingHistory: [
      {
        id: '4-1',
        timestamp: '2026-02-21T16:00:00Z',
        location: 'Austin, TX',
        status: 'Label Created',
        description: 'Shipping label created. Awaiting pickup.',
      },
    ],
  },
  {
    id: '5',
    trackingNumber: 'TL202602190234',
    senderName: 'Electronics World',
    senderPhone: '+1-555-0852',
    senderAddress: '852 Tech Drive, Portland, OR 97201, USA',
    recipientName: 'Lisa Thompson',
    recipientPhone: '+1-555-0963',
    recipientAddress: '963 Home Street, Phoenix, AZ 85001, USA',
    weight: 15.8,
    dimensions: '60x45x35 cm',
    service: 'Standard',
    status: 'in_transit',
    currentLocation: 'Las Vegas Distribution Hub',
    estimatedDelivery: '2026-02-23',
    createdAt: '2026-02-18T13:00:00Z',
    updatedAt: '2026-02-21T09:30:00Z',
    trackingHistory: [
      {
        id: '5-1',
        timestamp: '2026-02-18T13:00:00Z',
        location: 'Portland, OR',
        status: 'Package Received',
        description: 'Package picked up from sender location',
      },
      {
        id: '5-2',
        timestamp: '2026-02-19T06:00:00Z',
        location: 'Portland Distribution Center',
        status: 'Processing',
        description: 'Package processed and prepared for shipment',
      },
      {
        id: '5-3',
        timestamp: '2026-02-20T14:00:00Z',
        location: 'Sacramento, CA',
        status: 'In Transit',
        description: 'Package in transit through California hub',
      },
      {
        id: '5-4',
        timestamp: '2026-02-21T09:30:00Z',
        location: 'Las Vegas, NV',
        status: 'In Transit',
        description: 'Package arrived at Las Vegas distribution hub',
      },
    ],
  },
];

// Helper function to get package by tracking number (for demo)
export function getMockPackageByTrackingNumber(trackingNumber: string): Package | undefined {
  return mockPackages.find(pkg => pkg.trackingNumber === trackingNumber);
}

// Helper function to get paginated packages (for demo)
export function getMockPackagesPaginated(page: number = 1, limit: number = 10, statusFilter?: string) {
  let filtered = mockPackages;
  
  if (statusFilter && statusFilter !== 'all') {
    filtered = mockPackages.filter(pkg => pkg.status === statusFilter);
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
