
import { Room, Booking } from "@/models/types";

// Sample room data
export const ROOMS: Room[] = [
  {
    id: "room1",
    name: "Executive Suite",
    location: "Floor 5, North Wing",
    capacity: 12,
    features: ["Projector", "Video Conference", "Whiteboard", "Catering"],
    image: "/placeholder.svg",
  },
  {
    id: "room2",
    name: "Brainstorm Room",
    location: "Floor 3, East Wing",
    capacity: 6,
    features: ["Whiteboard", "TV Screen", "Coffee Machine"],
    image: "/placeholder.svg",
  },
  {
    id: "room3",
    name: "Conference Room A",
    location: "Floor 1, Main Hall",
    capacity: 20,
    features: ["Projector", "Video Conference", "Sound System", "Catering"],
    image: "/placeholder.svg",
  },
  {
    id: "room4",
    name: "Small Meeting Room",
    location: "Floor 2, West Wing",
    capacity: 4,
    features: ["TV Screen", "Whiteboard"],
    image: "/placeholder.svg",
  },
  {
    id: "room5",
    name: "Auditorium",
    location: "Ground Floor, South Entrance",
    capacity: 50,
    features: ["Stage", "Sound System", "Projector", "Recording Equipment"],
    image: "/placeholder.svg",
  },
];

// Helper function to generate random past and future bookings
export const generateMockBookings = (userId: string): Booking[] => {
  const today = new Date();
  const bookings: Booking[] = [];
  
  // Generate some past bookings
  for (let i = 1; i <= 5; i++) {
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - i);
    
    const startTime = new Date(pastDate);
    startTime.setHours(9 + i, 0, 0);
    
    const endTime = new Date(pastDate);
    endTime.setHours(10 + i, 0, 0);
    
    bookings.push({
      id: `past-booking-${i}`,
      roomId: ROOMS[i % ROOMS.length].id,
      userId,
      title: `Past Meeting ${i}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: "confirmed",
    });
  }
  
  // Generate some future bookings
  for (let i = 1; i <= 5; i++) {
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + i);
    
    const startTime = new Date(futureDate);
    startTime.setHours(9 + i, 0, 0);
    
    const endTime = new Date(futureDate);
    endTime.setHours(10 + i, 0, 0);
    
    bookings.push({
      id: `future-booking-${i}`,
      roomId: ROOMS[(i + 2) % ROOMS.length].id,
      userId,
      title: `Upcoming Meeting ${i}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: "confirmed",
    });
  }
  
  return bookings;
};

// Generate random bookings for all rooms (for calendar view)
export const generateRoomBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const today = new Date();
  const userIds = ["1", "2", "user-123"];
  
  // Generate bookings for the current week
  for (let dayOffset = -3; dayOffset <= 7; dayOffset++) {
    const date = new Date();
    date.setDate(today.getDate() + dayOffset);
    
    // Create 1-3 bookings per day
    const bookingsPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < bookingsPerDay; i++) {
      const roomIndex = Math.floor(Math.random() * ROOMS.length);
      const room = ROOMS[roomIndex];
      
      const userIndex = Math.floor(Math.random() * userIds.length);
      const userId = userIds[userIndex];
      
      // Random start hour between 8 AM and 4 PM
      const startHour = 8 + Math.floor(Math.random() * 8);
      // Meeting duration between 1-2 hours
      const durationHours = Math.floor(Math.random() * 2) + 1;
      
      const startTime = new Date(date);
      startTime.setHours(startHour, 0, 0);
      
      const endTime = new Date(date);
      endTime.setHours(startHour + durationHours, 0, 0);
      
      bookings.push({
        id: `booking-${dayOffset}-${roomIndex}-${i}`,
        roomId: room.id,
        userId,
        title: `Meeting in ${room.name}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: "confirmed",
      });
    }
  }
  
  return bookings;
};

// Storage of bookings in localStorage
export const getStoredBookings = (): Booking[] => {
  const stored = localStorage.getItem("bookings");
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with some random bookings if none exist
  const initialBookings = generateRoomBookings();
  localStorage.setItem("bookings", JSON.stringify(initialBookings));
  return initialBookings;
};

export const saveBooking = (booking: Booking): void => {
  const bookings = getStoredBookings();
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

export const updateBooking = (updatedBooking: Booking): void => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex(b => b.id === updatedBooking.id);
  if (index !== -1) {
    bookings[index] = updatedBooking;
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }
};

export const deleteBooking = (bookingId: string): void => {
  const bookings = getStoredBookings();
  const updatedBookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem("bookings", JSON.stringify(updatedBookings));
};

export const getBookingsByUserId = (userId: string): Booking[] => {
  const bookings = getStoredBookings();
  return bookings.filter(b => b.userId === userId);
};

export const getBookingsByRoomId = (roomId: string): Booking[] => {
  const bookings = getStoredBookings();
  return bookings.filter(b => b.roomId === roomId);
};

export const getAllRooms = (): Room[] => {
  return ROOMS;
};

export const getRoomById = (roomId: string): Room | undefined => {
  return ROOMS.find(room => room.id === roomId);
};
