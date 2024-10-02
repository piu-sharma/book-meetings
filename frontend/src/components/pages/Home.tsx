import { getAvailableRooms } from "@/services/conference";
import { useQuery } from "@tanstack/react-query";
import type { Booking } from "@/types";
import { LayoutWrapper } from "../Layout";

const MainApp = () => {
	const { data, isLoading, isError, error } = useQuery<Booking[]>({
		queryKey: ["rooms"],
		queryFn: getAvailableRooms,
	});

	return (
		<LayoutWrapper>
			<div className="tw-w-3/4 tw-pl-1 tw-pt-2">
				{isLoading ? "..." : null}
				{data?.map((room) => room?.id)}
			</div>
		</LayoutWrapper>
	);
};

export { MainApp };
