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

export type {
  Booking,
  Room,
  User,
  API_ERROR,
};