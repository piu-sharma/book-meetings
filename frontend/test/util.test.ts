import should from "should";
import { describe, it } from "mocha";
import { validateBooking } from '@/lib/utils';

const date = Date.now();

describe("validateBooking", () => {
	it("should return isValid false if invitees are not present in booking", () => {
		const validationResp = validateBooking({
			endTime: date + (1000 * 60 * 30),
			startTime: date,
			invitees: '',
			roomId: '1',
			title: "title"
		});

		should(validationResp.isValid).equal(false);
	});

	it("should return isValid false if booking time is < 15 mins", () => {
		const validationResp = validateBooking({
			endTime: date + (1000 * 60 * 10),
			startTime: date,
			invitees: 'aadsfsa',
			roomId: '1',
			title: "title"
		});

		should(validationResp.isValid).equal(false);
	});

});
