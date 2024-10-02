import type { Booking } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateBooking({
  title,
  invitees,
  startTime,
  endTime,
  roomId,
}: {
  title: string;
  startTime: number;
  endTime: number;
  roomId: string;
  invitees: string;
}): {
  errorMsg: string,
  isValid: boolean,
} {
  if (!title) {
    return {
      errorMsg: 'Title not defined',
      isValid: false,
    };
  }

  if (endTime - startTime < 1000 * 60 * 15) { // 15 mins
    return {
      errorMsg: 'Meeting time is smaller than 15 mins',
      isValid: false,
    };
  }

  // should be < 24 hours
  if (endTime - startTime > 1000 * 60 * 60 * 18) {
    return {
      errorMsg: 'Meeting time is greater than 18 hrs',
      isValid: false,
    };
  }

  if (!roomId) {
    return {
      errorMsg: 'Room not selected',
      isValid: false,
    };
  }

  if (!invitees) {
    return {
      errorMsg: 'No invitees in the meeting',
      isValid: false,
    };
  }

  return {
    errorMsg: '',
    isValid: true
  };


}