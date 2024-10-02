import { columnSort } from "@/helpers/tableHelpers";
import type { Room } from "@/types";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { LayoutWrapper } from "../Layout";
import { DataTable } from "../common/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRoomQuery } from "@/hooks/useRoomQuery";
import { ErrorMessage } from "../common/ErrorMessage";

const Home = () => {
	const { roomsData, isRoomsLoading, isError } = useRoomQuery();
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

	return !isError ? (
		<LayoutWrapper>
			<Card>
				<CardHeader className="tw-py-4">
					<CardTitle>Available Rooms</CardTitle>
				</CardHeader>
				<CardContent className="tw-py-2">
					<div>
						{isRoomsLoading ? "..." : null}
						{roomsData ? (
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
	) : (
		<ErrorMessage errorMsg="An error occured" />
	);
};

export { Home };
