import { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ServiceCard } from './components/ServiceCard';
import { FilterSidebar } from './components/FilterSidebar';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  provider: {
    name: string;
    avatar: string;
    rating: number;
  };
}

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'House Cleaning',
    description: 'Professional house cleaning services with eco-friendly products',
    category: 'Cleaning',
    price: 80,
    rating: 4.8,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Clean Pro Services',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 4.9
    }
  },
  {
    id: '2',
    name: 'Plumbing Repair',
    description: '24/7 emergency plumbing services and maintenance',
    category: 'Plumbing',
    price: 95,
    rating: 4.7,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Quick Fix Plumbing',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 4.8
    }
  },
  {
    id: '3',
    name: 'Electrical Services',
    description: '24/7 emergency electrical services and maintenance',
    category: 'Electrical',
    price: 100,
    rating: 4.6,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Quick Fix Electrical',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 4.7
    }
  },
  {
    id: '4',
    name: 'Lawn Care & Landscaping',
    description: 'Professional lawn maintenance and landscaping design',
    category: 'Outdoor',
    price: 75,
    rating: 4.7,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Green Thumb Gardens',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      rating: 4.8
    }
  },
  {
    id: '5',
    name: 'HVAC Maintenance',
    description: 'Heating and cooling system repairs and maintenance',
    category: 'HVAC',
    price: 120,
    rating: 4.9,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Climate Control Experts',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      rating: 4.9
    }
  },
  {
    id: '6',
    name: 'Interior Painting',
    description: 'Professional interior painting and wall finishing',
    category: 'Painting',
    price: 200,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Perfect Paint Co',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      rating: 4.7
    }
  },
  {
    id: '7',
    name: 'Carpet Cleaning',
    description: 'Deep carpet cleaning and stain removal services',
    category: 'Cleaning',
    price: 150,
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Fresh Floors Inc',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      rating: 4.8
    }
  },
  {
    id: '8',
    name: 'Window Installation',
    description: 'Professional window replacement and installation',
    category: 'Home Improvement',
    price: 300,
    rating: 4.7,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Clear View Windows',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      rating: 4.6
    }
  },
  {
    id: '9',
    name: 'Pest Control',
    description: 'Comprehensive pest elimination and prevention',
    category: 'Pest Control',
    price: 90,
    rating: 4.5,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Bug Busters',
      avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
      rating: 4.7
    }
  },
  {
    id: '10',
    name: 'Roof Repair',
    description: 'Professional roofing repair and maintenance',
    category: 'Roofing',
    price: 250,
    rating: 4.8,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Top Notch Roofing',
      avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
      rating: 4.9
    }
  },
  {
    id: '11',
    name: 'Moving Services',
    description: 'Professional moving and packing services',
    category: 'Moving',
    price: 180,
    rating: 4.6,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Swift Movers',
      avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
      rating: 4.7
    }
  },
  {
    id: '12',
    name: 'Garage Door Repair',
    description: 'Garage door installation and repair services',
    category: 'Home Repair',
    price: 130,
    rating: 4.7,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Garage Pros',
      avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
      rating: 4.8
    }
  },
  {
    id: '13',
    name: 'Pool Maintenance',
    description: 'Swimming pool cleaning and maintenance',
    category: 'Pool Services',
    price: 110,
    rating: 4.8,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Pool Perfect',
      avatar: 'https://randomuser.me/api/portraits/women/13.jpg',
      rating: 4.9
    }
  },
  {
    id: '14',
    name: 'Tree Trimming',
    description: 'Professional tree care and removal services',
    category: 'Outdoor',
    price: 200,
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Tree Masters',
      avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
      rating: 4.7
    }
  },
  {
    id: '15',
    name: 'Appliance Repair',
    description: 'Major appliance repair and maintenance',
    category: 'Appliances',
    price: 85,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Appliance Experts',
      avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
      rating: 4.8
    }
  },
  {
    id: '16',
    name: 'Gutter Cleaning',
    description: 'Professional gutter cleaning and maintenance',
    category: 'Outdoor',
    price: 95,
    rating: 4.5,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Gutter Guard',
      avatar: 'https://randomuser.me/api/portraits/men/16.jpg',
      rating: 4.6
    }
  },
  {
    id: '17',
    name: 'Fence Installation',
    description: 'Custom fence design and installation',
    category: 'Outdoor',
    price: 280,
    rating: 4.8,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Fence Factory',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      rating: 4.9
    }
  },
  {
    id: '18',
    name: 'Cabinet Refinishing',
    description: 'Kitchen and bathroom cabinet refinishing',
    category: 'Home Improvement',
    price: 175,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Cabinet Crafters',
      avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
      rating: 4.8
    }
  },
  {
    id: '19',
    name: 'Deck Building',
    description: 'Custom deck design and construction',
    category: 'Outdoor',
    price: 350,
    rating: 4.9,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Deck Masters',
      avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
      rating: 4.9
    }
  },
  {
    id: '20',
    name: 'Window Cleaning',
    description: 'Professional window and glass cleaning',
    category: 'Cleaning',
    price: 120,
    rating: 4.6,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Crystal Clear Windows',
      avatar: 'https://randomuser.me/api/portraits/men/20.jpg',
      rating: 4.7
    }
  },
  {
    id: '21',
    name: 'Drywall Repair',
    description: 'Professional drywall installation and repair',
    category: 'Home Repair',
    price: 140,
    rating: 4.7,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Wall Works',
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
      rating: 4.8
    }
  },
  {
    id: '22',
    name: 'Flooring Installation',
    description: 'Professional flooring installation services',
    category: 'Flooring',
    price: 250,
    rating: 4.8,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Floor Masters',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 4.9
    }
  },
  {
    id: '23',
    name: 'Security System Installation',
    description: 'Home security system installation and setup',
    category: 'Security',
    price: 299,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Secure Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
      rating: 4.8
    }
  },
  {
    id: '24',
    name: 'Bathroom Remodeling',
    description: 'Complete bathroom renovation services',
    category: 'Remodeling',
    price: 450,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Bath Builders',
      avatar: 'https://randomuser.me/api/portraits/men/24.jpg',
      rating: 4.9
    }
  },
  {
    id: '25',
    name: 'Kitchen Remodeling',
    description: 'Complete kitchen renovation services',
    category: 'Remodeling',
    price: 500,
    rating: 4.8,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Kitchen Kings',
      avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
      rating: 4.9
    }
  },
  {
    id: '26',
    name: 'Basement Waterproofing',
    description: 'Professional basement waterproofing services',
    category: 'Waterproofing',
    price: 350,
    rating: 4.7,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Dry Basement Pros',
      avatar: 'https://randomuser.me/api/portraits/men/26.jpg',
      rating: 4.8
    }
  },
  {
    id: '27',
    name: 'Solar Panel Installation',
    description: 'Solar energy system installation',
    category: 'Energy',
    price: 800,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Solar Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/27.jpg',
      rating: 4.9
    }
  },
  {
    id: '28',
    name: 'Home Theater Installation',
    description: 'Custom home theater setup and installation',
    category: 'Entertainment',
    price: 400,
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Theater Tech',
      avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
      rating: 4.8
    }
  },
  {
    id: '29',
    name: 'Smart Home Setup',
    description: 'Smart home device installation and configuration',
    category: 'Technology',
    price: 250,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Smart Living Solutions',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      rating: 4.8
    }
  },
  {
    id: '30',
    name: 'Chimney Cleaning',
    description: 'Professional chimney cleaning and maintenance',
    category: 'Cleaning',
    price: 150,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Chimney Sweeps',
      avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
      rating: 4.7
    }
  },
  {
    id: '31',
    name: 'Asphalt Paving',
    description: 'Driveway paving and repair services',
    category: 'Outdoor',
    price: 600,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Paving Pros',
      avatar: 'https://randomuser.me/api/portraits/women/31.jpg',
      rating: 4.9
    }
  },
  {
    id: '32',
    name: 'Sprinkler System',
    description: 'Irrigation system installation and repair',
    category: 'Outdoor',
    price: 275,
    rating: 4.7,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Sprinkler Solutions',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8
    }
  },
  {
    id: '33',
    name: 'Concrete Work',
    description: 'Concrete installation and repair services',
    category: 'Construction',
    price: 450,
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Concrete Crew',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 4.9
    }
  },
  {
    id: '34',
    name: 'Generator Installation',
    description: 'Backup generator installation and maintenance',
    category: 'Electrical',
    price: 700,
    rating: 4.9,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Power Pros',
      avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
      rating: 4.9
    }
  },
  {
    id: '35',
    name: 'Closet Organization',
    description: 'Custom closet design and organization',
    category: 'Organization',
    price: 200,
    rating: 4.6,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Closet Creators',
      avatar: 'https://randomuser.me/api/portraits/women/35.jpg',
      rating: 4.7
    }
  },
  {
    id: '36',
    name: 'Wallpaper Installation',
    description: 'Professional wallpaper installation services',
    category: 'Interior Design',
    price: 180,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Wall Wizards',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      rating: 4.8
    }
  },
  {
    id: '37',
    name: 'Tile Installation',
    description: 'Professional tile installation and repair',
    category: 'Flooring',
    price: 300,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Tile Masters',
      avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
      rating: 4.9
    }
  },
  {
    id: '38',
    name: 'Insulation Installation',
    description: 'Home insulation installation services',
    category: 'Energy',
    price: 400,
    rating: 4.7,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Insulation Pros',
      avatar: 'https://randomuser.me/api/portraits/men/38.jpg',
      rating: 4.8
    }
  },
  {
    id: '39',
    name: 'Garage Organization',
    description: 'Garage storage and organization solutions',
    category: 'Organization',
    price: 250,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Garage Gurus',
      avatar: 'https://randomuser.me/api/portraits/women/39.jpg',
      rating: 4.7
    }
  },
  {
    id: '40',
    name: 'Basement Finishing',
    description: 'Complete basement finishing services',
    category: 'Remodeling',
    price: 800,
    rating: 4.9,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Basement Builders',
      avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
      rating: 4.9
    }
  },
  {
    id: '41',
    name: 'Home Inspection',
    description: 'Comprehensive home inspection services',
    category: 'Inspection',
    price: 300,
    rating: 4.8,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Home Inspectors Plus',
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      rating: 4.9
    }
  },
  {
    id: '42',
    name: 'Attic Ventilation',
    description: 'Attic ventilation installation and repair',
    category: 'HVAC',
    price: 350,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Attic Aire',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      rating: 4.8
    }
  },
  {
    id: '43',
    name: 'Hardwood Floor Refinishing',
    description: 'Professional hardwood floor restoration',
    category: 'Flooring',
    price: 400,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Hardwood Heroes',
      avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
      rating: 4.9
    }
  },
  {
    id: '44',
    name: 'Outdoor Lighting',
    description: 'Landscape lighting design and installation',
    category: 'Outdoor',
    price: 275,
    rating: 4.6,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Light It Up',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      rating: 4.7
    }
  },
  {
    id: '45',
    name: 'Water Softener Installation',
    description: 'Water treatment system installation',
    category: 'Plumbing',
    price: 600,
    rating: 4.7,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Water Works',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 4.8
    }
  },
  {
    id: '46',
    name: 'Home Network Setup',
    description: 'Home network installation and configuration',
    category: 'Technology',
    price: 200,
    rating: 4.8,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Network Ninjas',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
      rating: 4.9
    }
  },
  {
    id: '47',
    name: 'Storm Door Installation',
    description: 'Storm door installation and repair',
    category: 'Home Improvement',
    price: 250,
    rating: 4.6,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Door Depot',
      avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
      rating: 4.7
    }
  },
  {
    id: '48',
    name: 'Fireplace Maintenance',
    description: 'Fireplace cleaning and maintenance',
    category: 'Home Maintenance',
    price: 175,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Fireplace Pros',
      avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
      rating: 4.8
    }
  },
  {
    id: '49',
    name: 'Home Energy Audit',
    description: 'Comprehensive home energy assessment',
    category: 'Energy',
    price: 225,
    rating: 4.8,
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Energy Experts',
      avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
      rating: 4.9
    }
  },
  {
    id: '50',
    name: 'Soundproofing',
    description: 'Room soundproofing installation services',
    category: 'Home Improvement',
    price: 450,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Sound Solutions',
      avatar: 'https://randomuser.me/api/portraits/men/50.jpg',
      rating: 4.8
    }
  },
  {
    id: '51',
    name: 'Radon Mitigation',
    description: 'Radon detection and mitigation services',
    category: 'Safety',
    price: 800,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Radon Remedies',
      avatar: 'https://randomuser.me/api/portraits/women/51.jpg',
      rating: 4.9
    }
  },
  {
    id: '52',
    name: 'Foundation Repair',
    description: 'Professional foundation repair services',
    category: 'Structural',
    price: 1200,
    rating: 4.8,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Foundation Fixes',
      avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      rating: 4.9
    }
  },
  {
    id: '53',
    name: 'Mold Remediation',
    description: 'Professional mold removal services',
    category: 'Safety',
    price: 500,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952',
    provider: {
      name: 'Mold Masters',
      avatar: 'https://randomuser.me/api/portraits/women/53.jpg',
      rating: 4.8
    }
  }

];
export function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query to avoid too many re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearchQuery(searchQuery);
  };

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter(service => {
      // Search across multiple fields with weighted relevance
      const searchFields = [
        service.name.toLowerCase(),
        service.description.toLowerCase(),
        service.category.toLowerCase(),
        service.provider.name.toLowerCase()
      ];

      const searchTerms = debouncedSearchQuery.toLowerCase().split(' ');
      const matchesSearch = searchTerms.every(term =>
        searchFields.some(field => field.includes(term))
      );

      const matchesCategory = !selectedCategory || service.category === selectedCategory;
      const matchesPrice = service.price >= priceRange[0] && service.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [debouncedSearchQuery, selectedCategory, priceRange]);

  return (
    <div className="min-h-[calc(100vh-100px)] py-2 relative">
      <div className="container mx-auto px-4 relative z-10 w-full">
        {/* Search Bar - Fixed at top */}
        <div className="sticky top-[100px] bg-white z-20 p-2 mb-4 rounded-full">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-white focus:outline-none"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline px-4 py-2 rounded-full flex items-center gap-1 md:hidden"
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </button>
          </form>
        </div>

        <div className="h-[calc(100vh-180px)] overflow-y-auto p-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:sticky md:top-[120px] md:self-start">
              <FilterSidebar
                show={showFilters}
                onClose={() => setShowFilters(false)}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
              />
            </div>

            <div className="flex-1">
              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* No Results */}
              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">No services found</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}