interface Booking {
  id?: number;
  roomId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
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

interface API_ERROR {
  error: {
    msg: string;
    status: number;
  };
}

interface RoomsBookingCount {
  bookName: string;
  count: number;
}

interface BookingsTimeSeries {
  [key: string]: number;
}

export type {
  Booking,
  Room,
  User,
  API_ERROR,
  RoomsBookingCount,
  BookingsTimeSeries,
};