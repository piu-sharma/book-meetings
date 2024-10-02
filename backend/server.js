const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const csv = require("csv-parser");
const fs = require("node:fs");
const http = require("node:http");
const WebSocket = require("ws");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.SECRET_KEY;

// Load rooms from CSV
const rooms = [];
fs.createReadStream("rooms.csv")
	.pipe(csv())
	.on("data", (row) => {
		rooms.push({ id: row.id, name: row.name, capacity: row.capacity });
	});

// Load users from CSV
const users = {};
fs.createReadStream("users.csv")
	.pipe(csv())
	.on("data", (row) => {
		users[row.email.trim()] = {
			password: row.password.trim(),
			role: row.role.trim(),
		};
	});

const bookings = []; // Store bookings

// JWT Authentication Middleware
function authenticate(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(403).json({ error: "Unauthorized" });

	try {
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch {
		res.status(403).json({ error: "Unauthorized" });
	}
}

// Admin Authorization Middleware
function authorizeAdmin(req, res, next) {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}
	next();
}

// Login Route (JWT Generation)
app.post("/login", (req, res) => {
	const { email, password } = req.body;
	const user = users[email];
	if (user && user.password === password) {
		const token = jwt.sign({ email, role: user.role }, SECRET_KEY, {
			expiresIn: "1h",
		});
		return res.json({ token, role: user.role });
	}
	res.status(401).json({ error: "Invalid credentials" });
});

// Fetch Available Rooms
app.get("/rooms", authenticate, (req, res) => {
	res.json(rooms);
});

// Create New Booking
app.post("/bookings", authenticate, (req, res) => {
	const { roomId, date, startTime, endTime, title, invitees } = req.body;

	// Check for double bookings within the time slot
	const roomBookings = bookings.filter(
		(booking) =>
			booking.roomId === roomId &&
			booking.date === date &&
			booking.startTime < endTime &&
			booking.endTime > startTime,
	);
	if (roomBookings.length > 0) {
		return res
			.status(400)
			.json({ error: "Room is already booked for the selected time slot" });
	}

	// Add booking
	const booking = {
		roomId,
		roomName: rooms.find((room) => room.id === roomId).name,
		date,
		startTime,
		endTime,
		title,
		invitees,
		bookedBy: req.user.email,
	};
	bookings.push(booking);

	// Emit WebSocket message for real-time updates
	// biome-ignore lint/complexity/noForEach: <explanation>
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify({ message: "New booking created", booking }));
		}
	});

	res.status(201).json({ message: "Booking created successfully", booking });
});

// Delete Booking (Admin Only)
app.delete("/bookings/:bookingId", authenticate, authorizeAdmin, (req, res) => {
	const { bookingId } = req.params;
	const bookingIndex = bookings.findIndex(
		(booking) => booking.id === bookingId,
	);

	if (bookingIndex === -1) {
		return res.status(404).json({ error: "Booking not found" });
	}

	// Remove booking
	const deletedBooking = bookings.splice(bookingIndex, 1)[0];

	// Emit WebSocket message for real-time updates
	// biome-ignore lint/complexity/noForEach: <explanation>
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(
				JSON.stringify({ message: "Booking deleted", booking: deletedBooking }),
			);
		}
	});

	res
		.status(200)
		.json({ message: "Booking deleted successfully", booking: deletedBooking });
});

// Fetch All Bookings (For Admins)
app.get("/bookings", authenticate, authorizeAdmin, (req, res) => {
	res.json(bookings);
});

// Fetch User's Bookings (For Regular Users)
app.post("/my-bookings", authenticate, (req, res) => {
	const userBookings = bookings.filter(
		(booking) => booking.bookedBy === req.user.email,
	);
	res.json(userBookings);
});

// Fetch Booking Counts for Each Room (Admin-Only for Chart)
app.get("/booking-counts", authenticate, authorizeAdmin, (req, res) => {
	const roomBookingCounts = rooms.map((room) => ({
		roomName: room.name,
		count: bookings.filter((booking) => booking.roomId === room.id).length,
	}));
	res.json(roomBookingCounts);
});

// Time Series Booking Count Data (Admin-Only for Chart)
app.get("/booking-series", authenticate, authorizeAdmin, (req, res) => {
	const { startDate, endDate } = req.query;

	const seriesData = {};

	// biome-ignore lint/complexity/noForEach: <explanation>
	bookings
		.filter(
			(booking) =>
				new Date(booking.date) >= new Date(startDate) &&
				new Date(booking.date) <= new Date(endDate),
		)
		.forEach((booking) => {
			if (!seriesData[booking.date]) {
				seriesData[booking.date] = 0;
			}
			seriesData[booking.date] += 1;
		});

	res.json(seriesData);
});

// WebSocket Connection Handling
wss.on("connection", (ws) => {
	ws.send(JSON.stringify({ message: "Connected to WebSocket" }));
});

// Start the server
server.listen(3001, () => {
	console.log("Backend server running on port 3001");
});
