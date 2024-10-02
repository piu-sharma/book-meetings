import { columnSort } from "@/helpers/tableHelpers";
import { useToast } from "@/hooks/use-toast";
import { getAvailableRooms } from "@/services/conference";
import type { API_ERROR, Room } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";
import { LayoutWrapper } from "../Layout";
import { DataTable } from "../common/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/services/loginService";

const Home = () => {
	const {
		data: roomsData,
		isLoading: isRoomsLoading,
		error,
	} = useQuery<Room[] | API_ERROR>({
		queryKey: ["rooms"],
		queryFn: getAvailableRooms,
	});
	const { toast } = useToast();
	const navigate = useNavigate();
	const columns: ColumnDef<Room, string>[] = [
		{
			accessorKey: "name",
			header: ({ column }: { column: Column<Room, string> }) =>
				columnSort<Room>({ column }, "Name"),
		},
		{
			accessorKey: "capacity",
			header: ({ column }: { column: Column<Room, string> }) =>
				columnSort<Room>({ column }, "Capacity"),
		},
	];

	useEffect(() => {
		const apiError = roomsData as API_ERROR;
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
	}, [toast, error, roomsData, navigate]);
	return (
		<LayoutWrapper>
			<Card>
				<CardHeader className="tw-py-4">
					<CardTitle>Available Rooms</CardTitle>
				</CardHeader>
				<CardContent className="tw-py-2">
					<div>
						{isRoomsLoading ? "..." : null}
						{roomsData && !(roomsData as API_ERROR)?.error ? (
							<DataTable
								columns={columns}
								data={roomsData as Room[]}
								filterByColumn="name"
							/>
						) : null}
					</div>
				</CardContent>
			</Card>
			&nbsp;
		</LayoutWrapper>
	);
};

export { Home };
