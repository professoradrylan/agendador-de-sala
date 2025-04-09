
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  features: string[];
  image: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
  description?: string;
  status: "confirmed" | "pending" | "cancelled";
}
