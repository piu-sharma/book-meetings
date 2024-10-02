import { getAvailableRooms } from "@/services/conference";
import type { API_ERROR, Room } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logoutUser } from "@/services/loginService";

const useRoomQuery = () => {
	const {
		data: roomsData,
		isLoading: isRoomsLoading,
		isError,
		error,
	} = useQuery<Room[] | API_ERROR>({
		queryKey: ["rooms"],
		queryFn: getAvailableRooms,
	});
	const { toast } = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		const apiError = roomsData as API_ERROR;
		if (apiError?.error || error) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: apiError?.error.msg || "Error while fetching rooms data.",
			});

			if (apiError?.error && apiError.error.status === 403) {
				setTimeout(() => {
					logoutUser();
					navigate("/");
				}, 1000);
			}
		}
	}, [toast, error, roomsData, navigate]);

	return {
		roomsData: roomsData as Room[],
		isRoomsLoading,
		error,
		isError,
	};
};

export { useRoomQuery };
