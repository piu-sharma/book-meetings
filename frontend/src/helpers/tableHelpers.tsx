import type { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export function columnSort<T>(
	{ column }: { column: Column<T, string> },
	colName: string,
) {
	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className="tw-flex tw-px-0 tw-py-2"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		>
			<span className="tw-cursor-pointer"> {colName} </span>
			<ArrowUpDown className="tw-ml-1 tw-h-3 tw-w-3 tw-cursor-pointer" />
		</div>
	);
}
