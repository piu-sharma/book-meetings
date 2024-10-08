import { API_URL } from "@/constants";
import type { Room, Booking, API_ERROR, RoomsBookingCount, BookingsTimeSeries } from "@/types";
import { getToken } from "./loginService";

type FetchType = 'GET' | 'POST';

interface FetchOptions {
  method?: FetchType,
  headers?: HeadersInit,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  postParams?: any,
};

async function fetchWrapper<T>(url: string, fetchOptions?: FetchOptions): Promise<T | API_ERROR> {
  const method = fetchOptions?.method || 'GET';
  const options: {
    headers: HeadersInit,
    method: FetchType,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    body?: any,
  } = {
    headers: {
      ...(fetchOptions?.headers || {}),
      "Content-Type": "application/json",
      "Authorization": `bearer ${getToken()}`,
    } as HeadersInit,
    method,

  };
  if (fetchOptions?.method === 'POST') {
    options.body = JSON.stringify(fetchOptions?.postParams);
  }
  const response = await fetch(url, options);
  /* if (response.status === 403) {
    logoutUser();
  } */
  if (!response.ok) {
    return {
      error: {
        msg: `Failed to ${method} url ${url}`,
        status: response.status
      }
    }; // Handle errors such as invalid credentials
  }
  return await response.json() as T;
}

// for admin only
export const getAllBookings = async (): Promise<Booking[] | API_ERROR> => {
  const bookings = await fetchWrapper<Booking[]>(`${API_URL}/bookings`);
  return bookings;
};

// fetch bookings by user [NON-ADMIN role]
export const getBookingsByUserId = async ({ userId }: { userId: string; }): Promise<Booking[] | API_ERROR> => {
  const bookings = await fetchWrapper<Booking[]>(`${API_URL}/my-bookings`, {
    method: "POST",
    postParams: { user: { email: userId } }
  });

  return bookings; // Store the token for later use
};

export const getBookingCount = async (): Promise<RoomsBookingCount[] | API_ERROR> => {
  const countList = await fetchWrapper<RoomsBookingCount[]>(`${API_URL}/booking-counts`, {});
  return countList; // Store the token for later use
};

export const getAvailableRooms = async (): Promise<Room[] | API_ERROR> => {
  const rooms = await fetchWrapper<Room[]>(`${API_URL}/rooms`, {});
  return rooms; // Store the token for later use
};

export const createBooking = async (booking: Booking): Promise<undefined | API_ERROR> => {
  const resp = await fetchWrapper<undefined>(`${API_URL}/bookings`, {
    postParams: booking,
    method: 'POST'
  });
  return resp;
};

export const getBookSeriesData = async (startDate: string, endDate: string): Promise<BookingsTimeSeries | API_ERROR> => {
  const resp = await fetchWrapper<BookingsTimeSeries>(`${API_URL}/booking-series?startDate=${startDate}&endDate=${endDate}`, {
    method: 'GET'
  });
  return resp;
}; 