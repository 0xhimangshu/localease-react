import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendar, faClock, faUser, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

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

interface BookingForm {
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
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
    // ... rest of the mock services remain unchanged ...
  ];

export function Service() {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    // Simulating API call to fetch service details
    const fetchService = async () => {
      try {
        // For now, using mock data from Services page
        const mockService = MOCK_SERVICES.find(s => s.id === id);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (mockService) {
          setService(mockService);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', bookingForm);
    alert('Booking request sent successfully!');
    setShowBookingForm(false);
    setBookingForm({
      date: '',
      time: '',
      name: '',
      phone: '',
      email: '',
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Service Not Found</h2>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] py-8">
      <div className="container mx-auto px-4">
        <div className="glass-card">
          {/* Service Image */}
          <div className="relative h-64 md:h-96 rounded-t-lg overflow-hidden">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full">
              {service.category}
            </div>
          </div>

          {/* Service Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                <p className="text-gray-600 text-lg mb-4">{service.description}</p>
                <div className="flex items-center gap-2 text-yellow-500">
                  <FontAwesomeIcon icon={faStar} />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-gray-600">({service.reviews} reviews)</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold text-primary mb-2">
                  ${service.price}
                </div>
                <button 
                  className="btn-primary px-8 py-3 rounded-full bg-gray-900 hover:bg-gray-800 max-w-fit"
                  onClick={() => setShowBookingForm(true)}
                >
                  Book Now
                </button>
              </div>
            </div>

            {/* Provider Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Service Provider</h2>
              <div className="flex items-center gap-4">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium">{service.provider.name}</h3>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{service.provider.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-2xl font-semibold mb-">Book Service</h2>
                  <form onSubmit={handleBookingSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                          Date
                        </label>
                        <input
                          type="date"
                          className="w-full p-2 border dark:bg-gray-800 rounded-[12px]"
                          required
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          <FontAwesomeIcon icon={faClock} className="mr-2" />
                          Time
                        </label>
                        <input
                          type="time"
                          className="w-full p-2 border dark:bg-gray-800 rounded-[12px]"
                          required
                          value={bookingForm.time}
                          onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border dark:bg-gray-800 rounded-[12px]  "
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          <FontAwesomeIcon icon={faPhone} className="mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="w-full p-2 border dark:bg-gray-800 rounded-[12px]"
                          required
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-2 border dark:bg-gray-800 rounded-[12px]"
                          required
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Additional Notes
                        </label>
                        <textarea
                          className="w-full p-2 border dark:bg-gray-800 rounded-[12px]"
                          rows={3}
                          value={bookingForm.notes}
                          onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        className="px-4 py-2 border dark:bg-gray-800 rounded-[12px]"
                        onClick={() => setShowBookingForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-[12px]"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
