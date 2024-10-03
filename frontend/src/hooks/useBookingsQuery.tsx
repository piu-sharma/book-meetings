import { AuthContext } from "@/contexts/Auth";
import { getAllBookings, getBookingsByUserId } from "@/services/conference";
import type { API_ERROR, Booking } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import { Roles } from "@/constants";
import { logoutUser } from "@/services/loginService";

const useBookingsQuery = () => {
	const { role, userName } = useContext(AuthContext);
	const { toast } = useToast();

	const navigate = useNavigate();

	const fetchFn =
		role === Roles.user && userName
			? () => getBookingsByUserId({ userId: userName })
			: getAllBookings;

	const {
		data: bookings,
		isLoading,
		error,
		refetch,
		isRefetchError,
	} = useQuery<Booking[] | API_ERROR>({
		queryKey: ["bookings"],
		queryFn: fetchFn,
		enabled: !!(role && userName),
	});

	// figure out a better way to handle this
	// ErrorBoundry is likely a better way to handle this.
	useEffect(() => {
		const apiError = bookings as API_ERROR;
		if (apiError?.error || error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: apiError?.error.msg || "Error while fetching rooms data.",
			});

			if (apiError?.error && apiError.error.status === 403) {
				logoutUser();
				navigate("/");
			}
		}
	}, [toast, error, bookings, navigate]);

	return {
		bookings,
		isLoading,
		error,
		refetch,
		isRefetchError,
	};
};

export { useBookingsQuery };
