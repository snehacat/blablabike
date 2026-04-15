const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalRides: 156,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    rating: 4.9,
    totalRides: 203,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '+91 76543 21098',
    rating: 4.7,
    totalRides: 89,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  }
];

const mockRides = [
  {
    id: 1,
    driver: mockUsers[0],
    from: 'Electronic City',
    to: 'Koramangala',
    departureTime: '2024-04-14T08:30:00Z',
    arrivalTime: '2024-04-14T09:15:00Z',
    price: 80,
    totalSeats: 4,
    availableSeats: 2,
    vehicleType: 'Scooter',
    vehicleModel: 'Honda Activa',
    route: ['Electronic City', 'Hosur Road', 'Silk Board', 'Koramangala'],
    status: 'active',
    description: 'Daily commute to office. Flexible with timing.'
  },
  {
    id: 2,
    driver: mockUsers[1],
    from: 'Whitefield',
    to: 'Marathahalli',
    departureTime: '2024-04-14T09:00:00Z',
    arrivalTime: '2024-04-14T09:45:00Z',
    price: 60,
    totalSeats: 3,
    availableSeats: 1,
    vehicleType: 'Bike',
    vehicleModel: 'Royal Enfield Classic',
    route: ['Whitefield', 'ITPL', 'Marathahalli'],
    status: 'active',
    description: 'Regular office commute. Punctual and safe rider.'
  },
  {
    id: 3,
    driver: mockUsers[2],
    from: 'HSR Layout',
    to: 'BTM Layout',
    departureTime: '2024-04-14T18:00:00Z',
    arrivalTime: '2024-04-14T18:30:00Z',
    price: 50,
    totalSeats: 3,
    availableSeats: 3,
    vehicleType: 'Scooty',
    vehicleModel: 'TVS Jupiter',
    route: ['HSR Layout', 'Bommanahalli', 'BTM Layout'],
    status: 'active',
    description: 'Return journey from work. All seats available.'
  },
  {
    id: 4,
    driver: mockUsers[0],
    from: 'Indiranagar',
    to: 'MG Road',
    departureTime: '2024-04-14T10:30:00Z',
    arrivalTime: '2024-04-14T11:00:00Z',
    price: 40,
    totalSeats: 2,
    availableSeats: 1,
    vehicleType: 'Bike',
    vehicleModel: 'Bajaj Pulsar',
    route: ['Indiranagar', 'CMH Road', 'MG Road'],
    status: 'active',
    description: 'Quick trip to the city center.'
  },
  {
    id: 5,
    driver: mockUsers[1],
    from: 'Jayanagar',
    to: 'Electronic City',
    departureTime: '2024-04-14T08:00:00Z',
    arrivalTime: '2024-04-14T09:00:00Z',
    price: 90,
    totalSeats: 4,
    availableSeats: 2,
    vehicleType: 'Scooter',
    vehicleModel: 'Honda Activa',
    route: ['Jayanagar', 'Banashankari', 'Electronic City'],
    status: 'active',
    description: 'Morning commute with flexible pickup points.'
  }
];

const mockBookings = [
  {
    id: 1,
    rideId: 1,
    userId: 2,
    passengerName: 'Priya Patel',
    seatsBooked: 1,
    bookingTime: '2024-04-14T07:45:00Z',
    status: 'confirmed',
    pickupPoint: 'Silk Board',
    totalAmount: 80
  },
  {
    id: 2,
    rideId: 2,
    userId: 3,
    passengerName: 'Amit Kumar',
    seatsBooked: 2,
    bookingTime: '2024-04-14T08:30:00Z',
    status: 'confirmed',
    pickupPoint: 'ITPL',
    totalAmount: 120
  }
];

// API Routes

// Get all rides
app.get('/api/rides', (req, res) => {
  const { from, to, date } = req.query;
  let filteredRides = [...mockRides];
  
  if (from) {
    filteredRides = filteredRides.filter(ride => 
      ride.from.toLowerCase().includes(from.toLowerCase())
    );
  }
  
  if (to) {
    filteredRides = filteredRides.filter(ride => 
      ride.to.toLowerCase().includes(to.toLowerCase())
    );
  }
  
  res.json(filteredRides);
});

// Get ride by ID
app.get('/api/rides/:id', (req, res) => {
  const ride = mockRides.find(r => r.id === parseInt(req.params.id));
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  res.json(ride);
});

// Create new ride
app.post('/api/rides', (req, res) => {
  const newRide = {
    id: mockRides.length + 1,
    driver: mockUsers[0], // Mock driver
    ...req.body,
    status: 'active',
    availableSeats: req.body.totalSeats
  };
  mockRides.push(newRide);
  res.status(201).json(newRide);
});

// Book a ride
app.post('/api/bookings', (req, res) => {
  const { rideId, userId, seatsBooked, pickupPoint } = req.body;
  
  const ride = mockRides.find(r => r.id === rideId);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  
  if (ride.availableSeats < seatsBooked) {
    return res.status(400).json({ error: 'Not enough seats available' });
  }
  
  const newBooking = {
    id: mockBookings.length + 1,
    rideId,
    userId,
    passengerName: mockUsers.find(u => u.id === userId)?.name || 'Anonymous',
    seatsBooked,
    pickupPoint,
    bookingTime: new Date().toISOString(),
    status: 'confirmed',
    totalAmount: ride.price * seatsBooked
  };
  
  mockBookings.push(newBooking);
  ride.availableSeats -= seatsBooked;
  
  res.status(201).json(newBooking);
});

// Get user bookings
app.get('/api/bookings/:userId', (req, res) => {
  const userBookings = mockBookings.filter(b => b.userId === parseInt(req.params.userId));
  res.json(userBookings);
});

// Get all users (for demo purposes)
app.get('/api/users', (req, res) => {
  res.json(mockUsers);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// User authentication (mock)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  
  if (user) {
    res.json({
      user,
      token: 'mock-jwt-token-' + user.id
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// User registration (mock)
app.post('/api/auth/register', (req, res) => {
  const newUser = {
    id: mockUsers.length + 1,
    ...req.body,
    rating: 0,
    totalRides: 0,
    verified: false,
    avatar: `https://images.unsplash.com/photo-${Math.random()}?w=100&h=100&fit=crop&crop=face`
  };
  
  mockUsers.push(newUser);
  res.status(201).json({
    user: newUser,
    token: 'mock-jwt-token-' + newUser.id
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    totalRides: mockRides.length,
    activeRides: mockRides.filter(r => r.status === 'active').length,
    totalUsers: mockUsers.length,
    totalBookings: mockBookings.length,
    averageRating: (mockUsers.reduce((acc, user) => acc + user.rating, 0) / mockUsers.length).toFixed(1),
    fuelSaved: '18L+'
  };
  res.json(stats);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 BlaBlaBike API server running on port ${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`  GET  /api/rides - Get all rides`);
  console.log(`  GET  /api/rides/:id - Get ride by ID`);
  console.log(`  POST /api/rides - Create new ride`);
  console.log(`  POST /api/bookings - Book a ride`);
  console.log(`  GET  /api/bookings/:userId - Get user bookings`);
  console.log(`  GET  /api/users - Get all users`);
  console.log(`  GET  /api/users/:id - Get user by ID`);
  console.log(`  POST /api/auth/login - User login`);
  console.log(`  POST /api/auth/register - User registration`);
  console.log(`  GET  /api/stats - Get platform statistics`);
});
