export const mockRides = [
  { id: 1, from: 'Connaught Place', to: 'Gurgaon', city: 'Delhi', date: '2024-04-15', departureTime: '2024-04-15T08:30:00', price: 80, availableSeats: 2, totalSeats: 4, vehicleType: 'Scooter', vehicleModel: 'Honda Activa', driver: { id: 1, name: 'Rahul Sharma', rating: 4.8, totalRides: 156, avatar: 'https://i.pravatar.cc/100?img=1', verified: true }, description: 'Daily office commute. Flexible pickup near metro.', status: 'active' },
  { id: 2, from: 'Bandra', to: 'Andheri', city: 'Mumbai', date: '2024-04-15', departureTime: '2024-04-15T09:00:00', price: 60, availableSeats: 1, totalSeats: 3, vehicleType: 'Bike', vehicleModel: 'Royal Enfield Classic', driver: { id: 2, name: 'Priya Patel', rating: 4.9, totalRides: 203, avatar: 'https://i.pravatar.cc/100?img=5', verified: true }, description: 'Regular office commute. Punctual and safe.', status: 'active' },
  { id: 3, from: 'Indiranagar', to: 'Electronic City', city: 'Bengaluru', date: '2024-04-15', departureTime: '2024-04-15T18:00:00', price: 70, availableSeats: 3, totalSeats: 3, vehicleType: 'Scooty', vehicleModel: 'TVS Jupiter', driver: { id: 3, name: 'Amit Kumar', rating: 4.7, totalRides: 89, avatar: 'https://i.pravatar.cc/100?img=3', verified: true }, description: 'Return journey from work. All seats available.', status: 'active' },
  { id: 4, from: 'Whitefield', to: 'Marathahalli', city: 'Bengaluru', date: '2024-04-15', departureTime: '2024-04-15T09:15:00', price: 50, availableSeats: 2, totalSeats: 2, vehicleType: 'Bike', vehicleModel: 'Bajaj Pulsar', driver: { id: 4, name: 'Sneha Rao', rating: 4.6, totalRides: 45, avatar: 'https://i.pravatar.cc/100?img=9', verified: true }, description: 'Quick trip to the tech park.', status: 'active' },
  { id: 5, from: 'Jayanagar', to: 'Electronic City', city: 'Bengaluru', date: '2024-04-15', departureTime: '2024-04-15T08:00:00', price: 90, availableSeats: 2, totalSeats: 4, vehicleType: 'Scooter', vehicleModel: 'Honda Activa', driver: { id: 2, name: 'Priya Patel', rating: 4.9, totalRides: 203, avatar: 'https://i.pravatar.cc/100?img=5', verified: true }, description: 'Morning commute with flexible pickup points.', status: 'active' },
  { id: 6, from: 'Dadar', to: 'Powai', city: 'Mumbai', date: '2024-04-15', departureTime: '2024-04-15T10:00:00', price: 75, availableSeats: 1, totalSeats: 2, vehicleType: 'Bike', vehicleModel: 'Hero Splendor', driver: { id: 1, name: 'Rahul Sharma', rating: 4.8, totalRides: 156, avatar: 'https://i.pravatar.cc/100?img=1', verified: true }, description: 'Mid-morning ride to Powai IT hub.', status: 'active' },
  { id: 7, from: 'Dwarka', to: 'Noida', city: 'Delhi', date: '2024-04-15', departureTime: '2024-04-15T08:45:00', price: 85, availableSeats: 2, totalSeats: 3, vehicleType: 'Bike', vehicleModel: 'Honda CB Shine', driver: { id: 3, name: 'Amit Kumar', rating: 4.7, totalRides: 89, avatar: 'https://i.pravatar.cc/100?img=3', verified: true }, description: 'Daily commute from Dwarka to Noida sector 62.', status: 'active' },
  { id: 8, from: 'Andheri', to: 'Thane', city: 'Mumbai', date: '2024-04-15', departureTime: '2024-04-15T07:30:00', price: 65, availableSeats: 1, totalSeats: 2, vehicleType: 'Scooter', vehicleModel: 'Suzuki Access', driver: { id: 4, name: 'Sneha Rao', rating: 4.6, totalRides: 45, avatar: 'https://i.pravatar.cc/100?img=9', verified: true }, description: 'Early morning ride to Thane.', status: 'active' },
  { id: 9, from: 'Rohini', to: 'Connaught Place', city: 'Delhi', date: '2024-04-15', departureTime: '2024-04-15T09:30:00', price: 70, availableSeats: 3, totalSeats: 3, vehicleType: 'Scooty', vehicleModel: 'TVS Ntorq', driver: { id: 2, name: 'Priya Patel', rating: 4.9, totalRides: 203, avatar: 'https://i.pravatar.cc/100?img=5', verified: true }, description: 'Heading to CP for work. All seats open.', status: 'active' },
];

export const mockBookings = [
  { id: 1, ride: mockRides[0], seatsBooked: 1, status: 'confirmed', bookingDate: '2024-04-14', totalAmount: 80 },
  { id: 2, ride: mockRides[2], seatsBooked: 2, status: 'completed', bookingDate: '2024-04-10', totalAmount: 140 },
];

export const mockPostedRides = [
  { ...mockRides[1], bookings: 2 },
  { ...mockRides[5], bookings: 1 },
];

export const mockUser = {
  id: 10,
  fullName: 'Test User',
  email: 'test@test.com',
  phone: '+911234567890',
  rating: 4.5,
  totalRides: 12,
  avatar: 'https://i.pravatar.cc/100?img=12',
  verified: true,
  joinedDate: '2024-01-10',
};
