import { AuthContext } from "@/contexts/Auth";
import { useContext, useEffect } from "react";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import type { API_ERROR, BookingsTimeSeries } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getBookSeriesData } from "@/services/conference";
import { logoutUser } from "@/services/loginService";

const useBookingsTimeSeries = (startDate: string, endDate: string) => {
	const { toast } = useToast();
	const navigate = useNavigate();

	const fetchQuery = async () => {
		return await getBookSeriesData(startDate, endDate);
	};

	const {
		data: bookingSeriesData,
		isLoading,
		isError,
		refetch: fetchData,
		error,
	} = useQuery<BookingsTimeSeries | API_ERROR>({
		queryKey: ["bookingTimeSeries", startDate, endDate],
		queryFn: () => fetchQuery(),
		enabled: !!(startDate && endDate),
	});

	// figure out a better way to handle this
	// ErrorBoundry is likely a better way to handle this.
	useEffect(() => {
		const apiError = bookingSeriesData as API_ERROR;
		if (apiError?.error || error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: apiError?.error.msg || "Error while fetching rooms data.",
			});

			if (apiError?.error && apiError.error.status === 403) {
				toast({
					title: "Nah bob, you cant see this",
					description:
						apiError?.error.msg ||
						"Seems like your session expired or you may not have permissions to view this page.",
				});
				logoutUser();
				navigate("/");
			}
		}
	}, [toast, error, bookingSeriesData, navigate]);

	return {
		bookingSeriesData: bookingSeriesData as BookingsTimeSeries,
		isLoading,
		isError,
		error,
		fetchData,
	};
};

export { useBookingsTimeSeries };
