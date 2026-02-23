const services = [
  {
    id: 'air-freight',
    title: 'Air Freight',
    description: 'Priority cargo services from Lagos and Abuja to major global trade lanes.',
    icon: 'Plane',
    features: [
      '24-72 hour uplift options',
      'Airport-to-door coordination',
      'Customs documentation support',
      'Priority handling for critical cargo'
    ],
    longDescription:
      'Our air freight service is optimized for urgent and high-value shipments. We coordinate cargo readiness, carrier booking, and destination handover to keep lead times predictable and secure.',
    benefits: [
      'Fast international transit',
      'Reduced stockout risk',
      'High handling security',
      'Reliable service windows'
    ]
  },
  {
    id: 'sea-freight',
    title: 'Sea Freight',
    description: 'Economical containerized shipping through Lagos ports for large-volume cargo.',
    icon: 'Ship',
    features: [
      'FCL and LCL booking options',
      'Port-to-port and door-to-door',
      'Cargo insurance support',
      'Import and export advisory'
    ],
    longDescription:
      'Our sea freight team supports importers, exporters, and project shippers with route planning, consolidation, and port operations designed to minimize landed cost.',
    benefits: [
      'Best value for bulk cargo',
      'Strong capacity planning',
      'Coverage for oversized freight',
      'Lower shipping cost per unit'
    ]
  },
  {
    id: 'land-transport',
    title: 'Land Transport',
    description: 'Reliable nationwide haulage and regional distribution across Nigeria.',
    icon: 'Truck',
    features: [
      'FTL and shared-load options',
      'GPS vehicle monitoring',
      'Scheduled route planning',
      'Dedicated last-mile support'
    ],
    longDescription:
      'Our land transport operation connects ports, factories, warehouses, and retail points across Nigeria with dependable route control and milestone visibility.',
    benefits: [
      'Flexible route coverage',
      'Strong domestic turnaround',
      'Direct business-to-business delivery',
      'Scalable truck capacity'
    ]
  },
  {
    id: 'warehousing',
    title: 'Warehousing & Fulfillment',
    description: 'Secure warehousing in strategic Nigerian locations with inventory visibility.',
    icon: 'Warehouse',
    features: [
      'Climate-sensitive storage zones',
      'Inventory control and cycle counts',
      'Pick-pack-dispatch workflows',
      'Reverse logistics handling'
    ],
    longDescription:
      'Our warehousing and fulfillment operations support fast-moving businesses with structured storage, order processing, and dispatch performance you can measure.',
    benefits: [
      'Lower operating overhead',
      'Improved stock accuracy',
      'Faster order cycle times',
      'Flexible storage capacity'
    ]
  },
  {
    id: 'express-delivery',
    title: 'Express Delivery',
    description: 'Time-critical same-day and next-day parcel delivery in key cities.',
    icon: 'Package',
    features: [
      'Same-day service in metro zones',
      'Next-day nationwide coverage',
      'Proof-of-delivery confirmation',
      'Priority dispatch desk'
    ],
    longDescription:
      'Express delivery is designed for urgent customer orders, legal documents, and replacement parts, with rapid dispatch and real-time status updates.',
    benefits: [
      'Fastest delivery option',
      'Better customer satisfaction',
      'High delivery reliability',
      'End-to-end visibility'
    ]
  },
  {
    id: 'international',
    title: 'International Shipping',
    description: 'Cross-border freight and e-commerce logistics from Nigeria to global markets.',
    icon: 'Globe',
    features: [
      'Export and import coordination',
      'Compliance and documentation guidance',
      'Duty and tax visibility',
      'Returns and reverse shipping support'
    ],
    longDescription:
      'Our international shipping solutions help businesses scale beyond borders with clearer compliance pathways, reliable transit planning, and consistent handovers.',
    benefits: [
      'Simplified global expansion',
      'Fewer customs delays',
      'Multi-modal shipping options',
      'Consistent service quality'
    ]
  }
];

const news = [
  {
    id: 'lagos-gateway-upgrade-2026',
    title: 'Telente Logistics Expands Gateway Operations in Lagos',
    excerpt:
      'Our upgraded Lagos gateway increases sorting speed and line-haul capacity for domestic and international cargo.',
    content:
      'Telente Logistics has expanded gateway operations in Lagos with improved sorting infrastructure, automated scanning points, and stronger dispatch controls. The upgrade helps reduce transfer delays, improve shipment accuracy, and support growing demand across Nigeria and West Africa.',
    image: '/images/news-gateway.jpg',
    author: 'Operations Team',
    publishedAt: '2026-02-15T09:30:00.000Z'
  },
  {
    id: 'fleet-visibility-upgrade',
    title: 'New Fleet Visibility Platform Improves Customer Tracking',
    excerpt: 'Customers now receive clearer movement milestones and more reliable delivery windows.',
    content:
      'Our latest tracking platform release introduces cleaner status milestones, stronger scan compliance at transfer points, and improved ETA confidence. Businesses can now monitor shipments with better operational clarity from pickup to delivery.',
    image: '/images/news-tracking.jpg',
    author: 'Technology Team',
    publishedAt: '2026-02-10T12:00:00.000Z'
  },
  {
    id: 'green-logistics-commitment',
    title: 'Telente Commits to Low-Emission Delivery Expansion by 2027',
    excerpt: 'The company launches a phased plan to increase low-emission vehicles and cleaner routing.',
    content:
      'Telente Logistics has launched a sustainability roadmap focused on route efficiency, fuel-aware planning, and phased low-emission fleet growth. The initiative supports long-term environmental goals while maintaining reliable delivery performance.',
    image: '/images/news-sustainability.jpg',
    author: 'Sustainability Team',
    publishedAt: '2026-02-05T08:00:00.000Z'
  }
];

const jobs = [
  {
    id: 'logistics-coordinator',
    title: 'Logistics Coordinator',
    department: 'Operations',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
    salary: 'Competitive',
    description:
      'Coordinate shipment planning, documentation, and exception handling across domestic and international deliveries.',
    requirements: [
      '2+ years logistics operations experience',
      'Strong communication and coordination skills',
      'Experience with shipment tracking tools'
    ],
    postedAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'customer-support-specialist',
    title: 'Customer Support Specialist',
    department: 'Customer Experience',
    location: 'Abuja, Nigeria',
    type: 'Full-time',
    salary: 'Competitive',
    description:
      'Support customers with shipment inquiries, service updates, and issue resolution while maintaining high response quality.',
    requirements: [
      '1+ years customer support experience',
      'Clear written and verbal communication',
      'Experience with CRM tools is a plus'
    ],
    postedAt: '2026-01-24T10:00:00.000Z'
  },
  {
    id: 'warehouse-supervisor',
    title: 'Warehouse Supervisor',
    department: 'Warehouse Operations',
    location: 'Ibadan, Nigeria',
    type: 'Full-time',
    salary: 'Competitive',
    description:
      'Lead receiving, storage, and dispatch operations while maintaining inventory accuracy and safety standards.',
    requirements: [
      '3+ years warehousing experience',
      'Team leadership and shift planning',
      'Knowledge of inventory workflows'
    ],
    postedAt: '2026-01-18T10:00:00.000Z'
  }
];

module.exports = {
  services,
  news,
  jobs
};
