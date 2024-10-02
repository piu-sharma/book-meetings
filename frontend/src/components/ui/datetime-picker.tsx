"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export function DateTimePicker({
	selectedDate,
	onChange,
}: { selectedDate: Date; onChange: (newDate: Date | undefined) => void }) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"tw-w-[280px] tw-justify-start tw-text-left tw-font-normal",
						!selectedDate && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="tw-mr-2 tw-h-4 tw-w-4" />
					{selectedDate ? (
						format(selectedDate, "PPP")
					) : (
						<span>Pick a date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="tw-w-auto tw-p-0">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={onChange}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
