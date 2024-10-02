import { AuthContext } from "@/contexts/Auth";
import { useContext, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { API_ERROR, Booking } from "@/types";
import { getAllBookings, getBookingsByUserId } from "@/services/conference";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { columnSort } from "@/helpers/tableHelpers";
import { Roles } from "@/constants";
import { DataTable } from "./DataTable";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

const BookingsWidget = () => {
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
				navigate("/");
			}
		}
	}, [toast, error, bookings, navigate]);

	const columns: ColumnDef<Booking, string>[] = [
		{
			accessorKey: "roomId",
			header: ({ column }: { column: Column<Booking, string> }) =>
				columnSort<Booking>({ column }, "Room Id"),
		},
		{
			accessorKey: "title",
			header: "Title",
		},
	];

	return (
		<Card>
			<CardHeader className="tw-py-4">
				<CardTitle className="tw-flex tw-justify-between">
					<div>Available Rooms</div>
					<div>
						<Button
							variant="default"
							className="tw-bg-emerald-500 hover:tw-bg-emerald-600"
						>
							Get a Room!
						</Button>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="tw-py-2">
				<div>
					{isLoading ? "..." : null}
					{bookings ? (
						<DataTable
							columns={columns}
							data={bookings as Booking[]}
							filterByColumn="name"
						/>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
};

export { BookingsWidget };
