import { columnSort } from "@/helpers/tableHelpers";
import { useBookingsQuery } from "@/hooks/useBookingsQuery";
import type { Booking } from "@/types";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BookRoomCTA } from "./CreateBooking";
import { DataTable } from "./DataTable";
import { ErrorMessage } from "./ErrorMessage";

const BookingsWidget = () => {
	const { bookings, isLoading, error } = useBookingsQuery();

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
				<CardTitle className="tw-flex tw-align-middle tw-justify-between">
					<div className="tw-align-middle tw-py-2">Available Rooms</div>
					<div>
						<BookRoomCTA />
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="tw-py-2">
				<div>
					{isLoading ? "..." : null}
					{error ? <ErrorMessage errorMsg="An error occured" /> : null}
					{bookings ? (
						<DataTable
							columns={columns}
							data={bookings as Booking[]}
							filterByColumn="title"
						/>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
};

export { BookingsWidget };
