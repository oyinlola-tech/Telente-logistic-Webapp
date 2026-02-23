const services = [
  {
    id: 'air-freight',
    title: 'Air Freight',
    description: 'Fast and reliable air cargo services for urgent shipments worldwide.',
    icon: 'Plane',
    features: [
      'Express delivery within 24-48 hours',
      'Real-time tracking and notifications',
      'Customs clearance support',
      'Temperature-controlled options'
    ],
    longDescription:
      'Our air freight service is built for high-priority shipments. We coordinate carrier capacity, documentation, and destination handover to keep lead times predictable.',
    benefits: [
      'Fastest global transit times',
      'High shipment security',
      'Ideal for high-value goods',
      'Reliable schedules'
    ]
  },
  {
    id: 'sea-freight',
    title: 'Sea Freight',
    description: 'Cost-effective ocean shipping for large volume cargo.',
    icon: 'Ship',
    features: [
      'FCL and LCL options',
      'Port-to-port or door-to-door',
      'Insurance coverage options',
      'Customs brokerage support'
    ],
    longDescription:
      'Our sea freight service supports both containerized and project cargo. We optimize routing and consolidation to lower total landed cost.',
    benefits: [
      'Best value for large volume',
      'Great for non-urgent shipments',
      'Handles oversized cargo',
      'Lower shipping cost per unit'
    ]
  },
  {
    id: 'land-transport',
    title: 'Land Transport',
    description: 'Efficient ground transportation for domestic and cross-border deliveries.',
    icon: 'Truck',
    features: [
      'FTL and LTL options',
      'Last-mile delivery',
      'GPS visibility',
      'Flexible pickup and routing'
    ],
    longDescription:
      'Our road network covers major domestic and regional corridors with dependable pickup and drop-off windows.',
    benefits: [
      'Flexible routes',
      'Cost-effective regional option',
      'Direct store/warehouse delivery',
      'Fast turnaround for domestic lanes'
    ]
  },
  {
    id: 'warehousing',
    title: 'Warehousing & Storage',
    description: 'Secure storage facilities with inventory management systems.',
    icon: 'Warehouse',
    features: [
      'Climate-controlled storage',
      'Inventory visibility',
      'Pick and pack',
      'Returns processing'
    ],
    longDescription:
      'Our warehousing service supports short and long-term storage with inventory control and fulfillment workflows.',
    benefits: [
      'Lower overhead',
      'Scalable capacity',
      'Better inventory accuracy',
      'Faster fulfillment'
    ]
  },
  {
    id: 'express-delivery',
    title: 'Express Delivery',
    description: 'Time-critical delivery services for urgent packages.',
    icon: 'Package',
    features: [
      'Same-day and next-day options',
      'Priority handling',
      'Delivery confirmation',
      'Dedicated support'
    ],
    longDescription:
      'Express delivery is designed for shipments with strict deadlines, backed by priority routing and milestone updates.',
    benefits: [
      'Fastest delivery option',
      'Ideal for urgent parcels',
      'High reliability',
      'Premium service handling'
    ]
  },
  {
    id: 'international',
    title: 'International Shipping',
    description: 'Cross-border logistics for global trade and e-commerce.',
    icon: 'Globe',
    features: [
      'Cross-border coordination',
      'Documentation and compliance',
      'Duties and taxes support',
      'Returns logistics'
    ],
    longDescription:
      'International shipping includes end-to-end planning for customs, duty exposure, and delivery performance across regions.',
    benefits: [
      'Simplified global expansion',
      'Reduced customs friction',
      'Consolidated shipping options',
      'Consistent international SLAs'
    ]
  }
];

const news = [
  {
    id: 'network-expansion-2026',
    title: 'Telente Logistics Expands Global Network with New Distribution Centers',
    excerpt:
      'We have opened three new distribution centers across Asia, Europe, and South America.',
    content:
      'Telente Logistics has expanded its global network with new distribution centers designed to improve delivery speed, inventory reach, and reliability for cross-border shipments.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
    author: 'Marketing Team',
    publishedAt: '2026-02-15T09:30:00.000Z'
  },
  {
    id: 'tracking-platform-upgrade',
    title: 'New Tracking Platform Upgrade Delivers Better Milestone Visibility',
    excerpt: 'Customers can now monitor package milestones with improved timing accuracy.',
    content:
      'The tracking platform now provides clearer status milestones and expected delivery updates, improving operational transparency for both senders and recipients.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    author: 'Technology Team',
    publishedAt: '2026-02-10T12:00:00.000Z'
  },
  {
    id: 'sustainability-fleet-initiative',
    title: 'Sustainability Initiative Targets 50% Electric Fleet by 2027',
    excerpt: 'A new fleet roadmap advances our long-term emissions reduction goals.',
    content:
      'The initiative includes phased EV adoption, route-level utilization planning, and charging infrastructure partnerships to lower logistics emissions.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=800&fit=crop',
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
    location: 'Remote',
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
