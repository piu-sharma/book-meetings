interface Booking {
  id: number;
  roomId?: string;
  date?: number;
  startTime?: number;
  endTime?: number;
  title?: string;
  invitees?: string[];
}

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface User {
  userId: string;
  role: string;
}

export type {
  Booking,
  Room,
  User,
};