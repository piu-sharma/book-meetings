import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRoomQuery } from "@/hooks/useRoomQuery";
import { validateBooking } from "@/lib/utils";
import { SelectContent, SelectItem } from "@radix-ui/react-select";
import * as React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";
import { createBooking } from "@/services/conference";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

export function BookRoomCTA({
	refetchBooks,
}: { refetchBooks: () => Promise<void> }) {
	const [open, setOpen] = React.useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="default"
					className="tw-bg-emerald-500 hover:tw-bg-emerald-600"
				>
					Get a Room!
				</Button>
			</DialogTrigger>
			<DialogContent className="tw-sm:max-w-[70%] tw-font-custom">
				<DialogHeader>
					<DialogTitle>Get a Room!</DialogTitle>
					<DialogDescription>Reserve a room for a meeting.</DialogDescription>
				</DialogHeader>
				<BookingForm
					closeHandler={() => setOpen(false)}
					refetchBooks={refetchBooks}
				/>
			</DialogContent>
		</Dialog>
	);
}

const defaultBooking = () => {
	return {
		startTime: null,
		endTime: null,
		title: "",
		selectedRoom: null,
		invitees: "",
	};
};

function BookingForm({
	closeHandler,
	className,
	refetchBooks,
}: {
	closeHandler: () => void;
	refetchBooks: () => Promise<void>;
} & React.ComponentProps<"form">) {
	const {
		title: defTitle,
		endTime: defEndTime,
		startTime: defStartTime,
		selectedRoom: defSelectedRoom,
		invitees: defInvitees,
	} = defaultBooking();
	const { roomsData, isRoomsLoading, isError } = useRoomQuery();
	const [startTime, setStartTime] = useState<number | null>(defStartTime);
	const [endTime, setEndTime] = useState<number | null>(defEndTime);
	const [selectedRoom, setSelectedRoom] = useState<string | null>(
		defSelectedRoom,
	);
	const [title, setTitle] = useState<string>(defTitle);
	const [invitees, setInvitees] = useState<string>(defInvitees);

	// const { showToast, ToastContainer } = useToast();
	const { toast } = useToast();

	if (isRoomsLoading) return "...";

	const onSelectRoom = (val: string) => {
		console.log(`something ${val}`);
		setSelectedRoom(val);
	};

	const onStartDate = (newStartDate: Date | null) => {
		const startD = newStartDate ? newStartDate.getTime() : Date.now();
		setStartTime(startD);
	};

	const onEndDate = (newEndDate: Date | null) => {
		const endD = newEndDate ? newEndDate.getTime() : Date.now();
		setEndTime(endD);
	};

	const onInviteeChange = (val: string) => {
		setInvitees(val);
	};

	const onSubmitBooking = async () => {
		const { errorMsg, isValid } = validateBooking({
			title,
			startTime: startTime || Date.now(),
			endTime: endTime || Date.now(),
			roomId: selectedRoom || "",
			invitees,
		});

		if (!isValid) {
			toast({
				title: "Error occurred",
				description: errorMsg,
				variant: "destructive",
			});
			return;
		}

		try {
			await createBooking({
				title,
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				date: new Date(startTime!).toDateString(),
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				startTime: new Date(startTime!).toLocaleTimeString(),
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				endTime: new Date(endTime!).toLocaleTimeString(),
				invitees: invitees.split(","),
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				roomId: selectedRoom!,
			});
			toast({
				title: "Booking Saved!",
			});
			await refetchBooks();
			closeHandler();
		} catch (e: unknown) {
			toast({
				title: "Error occured while saving",
				description: (e as Error).message || "Unkown error",
			});
		}
	};

	const startDateObj = startTime ? new Date(startTime) : new Date();
	const endDateObj = endTime
		? new Date(endTime)
		: new Date(Date.now() + 1000 * 10);
	return (
		<>
			<div className="tw-gap-2">
				<Label htmlFor="bookingTitle">Title</Label>
				<Input
					id="bookingTitle"
					value={title}
					onChange={(e) => setTitle(e.currentTarget.value)}
				/>
				<Label htmlFor="roomSelector">Select Room</Label>
				<Select onValueChange={onSelectRoom} value={selectedRoom?.toString()}>
					<SelectTrigger className="tw-max-w-[300px] tw-w-[360px]">
						<SelectValue
							placeholder="Select a verified email to display"
							className="tw-z-[500] tw-max-w-[300px] tw-w-[360px]"
						/>
					</SelectTrigger>

					<SelectContent className="tw-bg-white tw-border-2 tw-z-[500] tw-border-1 tw-max-w-[300px] tw-w-[360px]">
						{roomsData.map((room) => (
							<SelectItem
								aria-selected={selectedRoom === room.id.toString()}
								className="hover:tw-bg-slate-200 tw-p-1 tw-border-1 tw-border-black tw-cursor-pointer tw-z-[500] tw-max-w-[300px] tw-w-[360px]"
								key={room.id + room.name}
								value={room.id.toString()}
							>
								{room.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className="tw-gap-2 tw-py-2">
					<Label htmlFor="startTime">Start Time:</Label>
					<div
						id="startTime"
						className="tw-flex tw-flex-col tw-items-start tw-space-y-4 tw-py-1"
					>
						<DatePicker
							selected={startDateObj}
							onChange={onStartDate}
							calendarStartDay={0}
							showTimeSelect
							timeFormat="p"
							timeCaption="Time"
							dateFormat="Pp" // Pp includes both date and time
							className="tw-border tw-p-2 tw-rounded-md" // Tailwind classes for styling
						/>
					</div>
					<Label htmlFor="endTime">End Time:</Label>
					<div
						id="endTime"
						className="tw-flex tw-flex-col tw-items-start tw-space-y-4 tw-py-1"
					>
						<DatePicker
							selected={endDateObj}
							onChange={onEndDate}
							showTimeSelect
							timeFormat="p"
							timeCaption="Time"
							dateFormat="Pp" // Pp includes both date and time
							className="tw-border tw-p-2 tw-rounded-md" // Tailwind classes for styling
						/>
					</div>
				</div>
				<div className="tw-py-2">
					<Textarea
						placeholder="add invitees. you can separate invitees with comma."
						onChange={(e) => onInviteeChange(e.currentTarget.value)}
					/>
				</div>
			</div>

			<Button onClick={onSubmitBooking}>Save changes</Button>
			{/* <ToastContainer /> */}
		</>
	);
}
