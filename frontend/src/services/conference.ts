import { API_URL } from "@/constants";
import type { Room, Booking } from "@/types";
import { getToken, logoutUser } from "./loginService";

type FetchType = 'GET' | 'POST';

interface FetchOptions {
  method?: FetchType,
  headers?: HeadersInit,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  postParams?: any,
};

async function fetchWrapper<T>(url: string, fetchOptions?: FetchOptions): Promise<T> {
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
  if (response.status === 403) {
    logoutUser();
  }
  if (!response.ok) {
    throw new Error(`Failed to ${method} url ${url}`); // Handle errors such as invalid credentials
  }
  return await response.json() as T;
}

// for admin only
export const getAllBookings = async (): Promise<Booking[]> => {
  const bookings = await fetchWrapper<Booking[]>(`${API_URL}/bookings`);
  return bookings;
};

// fetch bookings by user [NON-ADMIN role]
export const getBookingsByUserId = async ({ userId }: { userId: string; }): Promise<Booking[]> => {
  const bookings = await fetchWrapper<Booking[]>(`${API_URL}/my-bookings`, {
    method: "POST",
    postParams: { user: { email: userId } }
  });

  return bookings; // Store the token for later use
};

export const getBookingCount = async ({ roomId }: { roomId: string; }): Promise<number> => {
  const count = await fetchWrapper<number>(`${API_URL}/booking-counts`, {});
  return count; // Store the token for later use
};

export const getAvailableRooms = async (): Promise<Room[]> => {
  const rooms = await fetchWrapper<Room[]>(`${API_URL}/rooms`, {});
  return rooms; // Store the token for later use
};