import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    provider: {
      name: string;
      avatar: string;
      rating: number;
    };
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link to={`/service/${service.id}`} className="block">
      <div className="glass-card hover:shadow-lg transition-shadow">
        {/* Service Image */}
        <div className="relative h-48 rounded-t-lg overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white text-xl font-semibold">{service.name}</h3>
          </div>
        </div>

        {/* Service Details */}
        <div className="p-4">
          <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
          
          {/* Provider Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={service.provider.avatar}
              alt={service.provider.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{service.provider.name}</p>
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <FontAwesomeIcon icon={faStar} />
                <span>{service.provider.rating}</span>
              </div>
            </div>
          </div>

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div className="text-primary font-semibold">
              ${service.price}/hr
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-yellow-500">
                <FontAwesomeIcon icon={faStar} />
                <span>{service.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 