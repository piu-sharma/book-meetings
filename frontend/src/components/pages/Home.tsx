import { useToast } from "@/hooks/use-toast";
import { getAvailableRooms } from "@/services/conference";
import type { Room } from "@/types";
import { useQuery } from "@tanstack/react-query";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useEffect } from "react";
import { LayoutWrapper } from "../Layout";
import { DataTable } from "../common/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const columnSort = (
	{ column }: { column: Column<Room, string> },
	colName: string,
) => {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className="tw-flex tw-px-0 tw-py-2"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		>
			<span className="tw-cursor-pointer">{colName}</span>
			<ArrowUpDown className="tw-ml-1 tw-h-3 tw-w-3 tw-cursor-pointer" />
		</div>
	);
};

const Home = () => {
	const {
		data: roomsData,
		isLoading: isRoomsLoading,
		isError: roomFetchError,
	} = useQuery<Room[]>({
		queryKey: ["rooms"],
		queryFn: getAvailableRooms,
	});
	const { toast } = useToast();
	const columns: ColumnDef<Room, string>[] = [
		{
			accessorKey: "name",
			header: ({ column }: { column: Column<Room, string> }) =>
				columnSort({ column }, "Name"),
		},
		{
			accessorKey: "capacity",
			header: ({ column }: { column: Column<Room, string> }) =>
				columnSort({ column }, "Capacity"),
		},
	];

	useEffect(() => {
		if (roomFetchError) {
			toast({
				variant: "destructive",
				title: "Uh oh! Something went wrong.",
				description: "There was a problem with your request.",
			});
		}
	}, [roomFetchError, toast]);
	return (
		<LayoutWrapper>
			<div className="tw-px-3">
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
									data={roomsData}
									filterByColumn="name"
								/>
							) : null}
						</div>
					</CardContent>
				</Card>
				&nbsp;
			</div>
		</LayoutWrapper>
	);
};

export { Home };
