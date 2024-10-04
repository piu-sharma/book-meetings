import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { LayoutWrapper } from "../Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// biome-ignore lint/style/useImportType: <explanation>
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

import { useRoomCountQuery } from "@/hooks/useRoomCountQuery";
import type { RoomsBookingCount } from "@/types";
import { ErrorMessage } from "../common/ErrorMessage";
import { useBookingsTimeSeries } from "@/hooks/useBookingsTimeSeries";
import { useState } from "react";

const chartConfig = {
	desktop: {
		label: "Room",
		color: "#2563eb",
	},
} satisfies ChartConfig;

const Analytics = () => {
	const [startDate, setStartDate] = useState<string>(
		new Date(Date.now() - 1000 * 60 * 60 * 24).toDateString(),
	);
	const [endDate, setEndDate] = useState<string>(new Date().toDateString());

	const {
		bookingsData,
		isError: isBookCountsError,
		bookingsLoading,
	} = useRoomCountQuery();

	const {
		bookingSeriesData,
		isError: isTimeSeriesError,
		isLoading: isTimeSeriesDataLoading,
		fetchData,
	} = useBookingsTimeSeries(startDate, endDate);

	const chartData = bookingSeriesData
		? Object.keys(bookingSeriesData).map((date) => ({
				date,
				value: bookingSeriesData[date],
			}))
		: [];

	const setPastDays = (days: number) => {
		const newStart = new Date(
			Date.now() - 1000 * 60 * 60 * 24 * days,
		).toDateString();
		const newEnd = new Date().toDateString();
		console.log(`new startdate: ${newStart} new end date ${newEnd}`);
		setStartDate(newStart);
		setEndDate(newEnd);
		fetchData();
	};

	return (
		<LayoutWrapper>
			<div className="tw-flex tw-w-full tw-gap-2">
				{isBookCountsError ? (
					<ErrorMessage errorMsg="Error occured while fetching charting data" />
				) : bookingsLoading ? null : (
					<Card className="tw-w-3/6">
						<CardTitle className="tw-py-1">
							<CardHeader className="tw-py-2 tw-px-4">
								Bookings Per room
							</CardHeader>
						</CardTitle>
						<CardContent className="tw-py-2 tw-px-4">
							{bookingsData?.length > 0 ? (
								<ChartContainer
									config={chartConfig}
									className="tw-min-h-[200px] tw-w-[300px]"
								>
									<BarChart
										accessibilityLayer
										data={bookingsData as RoomsBookingCount[]}
									>
										<XAxis
											dataKey="roomName"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
											tickFormatter={(value) => value.slice(0, 3)}
										/>
										<ChartTooltip
											cursor={false}
											content={<ChartTooltipContent indicator="dashed" />}
										/>
										<Bar
											dataKey="count"
											fill="var(--color-desktop)"
											radius={4}
										/>
									</BarChart>
								</ChartContainer>
							) : (
								"There is no data to plot"
							)}
						</CardContent>
					</Card>
				)}
				<Card className="tw-w-2/4">
					<CardTitle className="tw-py-1">
						<CardHeader className="tw-py-2 tw-px-4">
							Time distribution
						</CardHeader>
					</CardTitle>
					<CardContent className="tw-py-2 tw-px-4">
						{isTimeSeriesError ? (
							<ErrorMessage errorMsg="Error occured while fetching time series data" />
						) : isTimeSeriesDataLoading ? (
							"Loading..."
						) : (
							<>
								<div className="tw-absolute tw-top-5 tw-right-6 tw-flex tw-gap-[2px] tw-items-center tw-text-[12px]">
									<span className="">Past:</span>
									<button
										type="button"
										className="tw-border-[1px] tw-px-[2px] tw-text-[12px] tw-rounded-[4px] tw-border-black"
										onClick={() => setPastDays(1)}
									>
										Day
									</button>
									<button
										type="button"
										className="tw-border-[1px] tw-px-[2px] tw-text-[12px] tw-rounded-[4px] tw-border-black"
										onClick={() => setPastDays(7)}
									>
										Week
									</button>
									<button
										type="button"
										className="tw-border-[1px] tw-px-[2px] tw-text-[12px] tw-rounded-[4px] tw-border-black"
										onClick={() => setPastDays(30)}
									>
										Month
									</button>
								</div>
								{Object.keys(bookingSeriesData).length > 0 ? (
									<ChartContainer
										config={chartConfig}
										className="tw-min-h-[200px] tw-w-[300px]"
									>
										<LineChart
											data={chartData}
											margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
										>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="date" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line type="monotone" dataKey="value" stroke="#8884d8" />
										</LineChart>
									</ChartContainer>
								) : (
									"There is no data to plot"
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</LayoutWrapper>
	);
};
export default Analytics;
