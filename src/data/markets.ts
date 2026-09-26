import { MarketLandingPage } from '../types';

export const marketLandingPages: MarketLandingPage[] = [
  {
    slug: 'europe',
    regionName: 'European Union & United Kingdom',
    heroHeadline: 'EU-Compliant Egyptian Agricultural Produce directly to European Ports',
    regionalSubtext: 'Direct reefer vessel shipping lines from Alexandria and Port Said to Rotterdam, Hamburg, Koper, Fos-sur-Mer, and Felixstowe. Strict adherence to EU MRL limits, GlobalGAP certification standards, and ETR (Estimated Time in Route) guarantees.',
    popularProducts: ['Sweet Potatoes', 'Hydro-Cooled Carrots', 'Red & Golden Onions', 'Ware Potatoes'],
    keyPorts: ['Rotterdam (Netherlands)', 'Hamburg (Germany)', 'Koper (Slovenia)', 'Fos-sur-Mer (France)', 'Felixstowe (UK)'],
    transitTimeEstimate: '5 to 9 Days Direct Maritime Shipping',
    complianceStandards: [
      'EU Maximum Residue Limits (MRL) Batch Tested',
      'GlobalGAP Supply Chain Tracking',
      'SMETA / Sedex Social Compliance Framework',
      'Euro Pallet (80x120cm) Standard Loading'
    ]
  },
  {
    slug: 'gcc',
    regionName: 'GCC & Middle East',
    heroHeadline: 'Fresh Daily Supply & Express Overland / Maritime Shipping to the Gulf',
    regionalSubtext: 'Serving importers, central markets, and supermarket chains across the Kingdom of Saudi Arabia, UAE, Qatar, Kuwait, Oman, and Bahrain. High-capacity reefer logistics and fast customs clearance via Safaga, Duba, and Jeddah.',
    popularProducts: ['Sweet Potatoes', 'Fresh Garlic', 'Hydro-Cooled Carrots', 'Spunta Potatoes', 'Onions'],
    keyPorts: ['Jeddah Islamic Port (KSA)', 'Duba Port (KSA)', 'Jebel Ali (UAE)', 'Shuwaikh (Kuwait)', 'Hamad Port (Qatar)'],
    transitTimeEstimate: '3 to 6 Days Express Route',
    complianceStandards: [
      'SFDA (Saudi Food & Drug Authority) Registration Ready',
      'GCC Standardization Organization (GSO) Fresh Produce Specs',
      'Arabic / English Dual Language Packaging Labels',
      'Rapid Cold-Chain Inspection Clearance'
    ]
  },
  {
    slug: 'asia',
    regionName: 'Asia-Pacific & Far East',
    heroHeadline: 'Direct Maritime Reefer Line & Premium Produce to Asia',
    regionalSubtext: 'Certified agricultural export containers shipped via Suez Canal maritime routes to Singapore, Malaysia, India, and Vietnam with full phytosanitary documentation.',
    popularProducts: ['Sweet Potatoes', 'Red & Golden Onions', 'Fresh Garlic', 'Washed Carrots'],
    keyPorts: ['Singapore', 'Port Klang (Malaysia)', 'Nhava Sheva / Mumbai (India)', 'Shanghai (China)', 'Cat Lai / Ho Chi Minh (Vietnam)'],
    transitTimeEstimate: '14 to 22 Days Direct Liner Service',
    complianceStandards: [
      'Controlled Atmosphere (CA) Reefer Shipping',
      'Strict Caliber & Weight Grading',
      'High-Durability Export Carton Ventilation'
    ]
  }
];
