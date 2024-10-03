import { useQuery } from "@tanstack/react-query";
import { getBookingCount } from "@/services/conference";
import { AuthContext } from "@/contexts/Auth";
import { useContext, useEffect } from "react";
import type { API_ERROR, RoomsBookingCount } from "@/types";
import { useToast } from "./use-toast";
import { logoutUser } from "@/services/loginService";
import { useNavigate } from "react-router-dom";

const useRoomCountQuery = () => {
	const { role } = useContext(AuthContext);
	const { toast } = useToast();
	const navigate = useNavigate();
	const {
		data: bookingsData,
		isLoading: bookingsLoading,
		isError,
		error,
	} = useQuery<RoomsBookingCount[] | API_ERROR>({
		queryKey: ["bookCountQuery"],
		queryFn: getBookingCount,
		enabled: !role,
	});

	// figure out a better way to handle this
	// ErrorBoundry is likely a better way to handle this.
	useEffect(() => {
		const apiError = bookingsData as API_ERROR;
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
	}, [toast, error, bookingsData, navigate]);

	return {
		bookingsData: bookingsData as RoomsBookingCount[],
		bookingsLoading,
		isError,
	};
};
export { useRoomCountQuery };
