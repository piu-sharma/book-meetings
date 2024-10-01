
### Backend - Conference Room Booking System

#### Overview
This backend provides a simple conference room booking system with JWT-based authentication and real-time WebSocket updates. It supports role-based access (admin vs. user) and is designed to handle room bookings, booking management, and real-time notifications.

### Installation
1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   npm start
   ```

### Endpoints

#### 1. **POST `/login`** - User Login with JWT
- **Description**: Authenticates users based on email and password, then returns a JWT token and the user's role.
- **Request**:
  ```json
  {
    "email": "user@company.com",
    "password": "userpass"
  }
  ```
- **Response**:
  ```json
  {
    "token": "JWT_TOKEN_HERE",
    "role": "admin"
  }
  ```

#### 2. **GET `/rooms`** - Fetch Available Rooms
- **Description**: Returns a list of all available rooms.
- **Authentication**: Requires JWT in the `Authorization` header.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Alpha Room",
      "capacity": 2
    },
    {
      "id": 2,
      "name": "Beta Room",
      "capacity": 3
    }
  ]
  ```

#### 3. **POST `/bookings`** - Create a New Booking
- **Description**: Creates a new room booking. Prevents double bookings for the same room on the same date and time slot. Also sends a WebSocket message to notify connected clients about the new booking.
- **Authentication**: Requires JWT in the `Authorization` header.
- **Request**:
  ```json
  {
    "roomId": 1,
    "date": "2024-09-11",
    "startTime": "09:00",
    "endTime": "10:00",
    "title": "Team Meeting",
    "invitees": "alice@example.com, bob@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Booking created successfully",
    "booking": {
      "roomId": 1,
      "roomName": "Alpha Room",
      "date": "2024-09-11",
      "startTime": "09:00",
      "endTime": "10:00",
      "title": "Team Meeting",
      "invitees": "alice@example.com, bob@example.com"
    }
  }
  ```

#### 4. **DELETE `/bookings/:bookingId`** - Delete a Booking (Admin Only)
- **Description**: Deletes an existing booking by ID (Admin-only access).
- **Authentication**: Requires JWT in the `Authorization` header.
- **Authorization**: Admin-only access.
- **Response**:
  ```json
  {
    "message": "Booking deleted successfully",
    "booking": {
      "roomId": 1,
      "roomName": "Alpha Room",
      "date": "2024-09-11",
      "startTime": "09:00",
      "endTime": "10:00"
    }
  }
  ```

#### 5. **GET `/my-bookings`** - Fetch User's Bookings
- **Description**: Returns a list of all bookings for a single regular user.
- **Authentication**: Requires JWT in the `Authorization` header.
- **Response**:
  ```json
  [
    {
      "roomId": 1,
      "roomName": "Alpha Room",
      "date": "2024-09-11",
      "startTime": "09:00",
      "endTime": "10:00",
      "title": "Team Meeting",
      "invitees": "alice@example.com, bob@example.com",
      "bookedBy": "user@company.com"
    }
  ]
  ```

#### 6. **GET `/booking-counts`** - Get Booking Analytics (Admin Only)
- **Description**: Returns the number of bookings for each room, used to generate booking analytics (e.g., in charts).
- **Authentication**: Requires JWT in the `Authorization` header.
- **Authorization**: Admin-only access.
- **Response**:
  ```json
  [
    {
      "roomName": "Alpha Room",
      "count": 5
    },
    {
      "roomName": "Beta Room",
      "count": 3
    }
  ]
  ```

#### 7. **GET `/booking-series`** - Get Time Series Booking Data (Admin Only)
- **Description**: Returns time series data for bookings between two dates for chart generation.
- **Authentication**: Requires JWT in the `Authorization` header.
- **Authorization**: Admin-only access.
- **Request**:
  - `startDate`: Start date of the time series (e.g., `2024-09-01`)
  - `endDate`: End date of the time series (e.g., `2024-09-30`)
- **Response**:
  ```json
  {
    "2024-09-11": 3,
    "2024-09-12": 5
  }
  ```

### WebSocket Integration

#### Real-Time Booking Updates
- **Description**: When a new booking is created or deleted, a message is broadcasted to all WebSocket clients, allowing the frontend to update the list of bookings in real-time.
- **Message Format**:
  ```json
  {
    "message": "New booking created",
    "booking": {
      "roomId": 1,
      "roomName": "Alpha Room",
      "date": "2024-09-11",
      "startTime": "09:00",
      "endTime": "10:00",
      "title": "Team Meeting",
      "invitees": "alice@example.com, bob@example.com"
    }
  }
  ```

### Authentication
All requests (except `/login`) require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <JWT_TOKEN>
```

### Notes
- Admin users can see all bookings, delete bookings, and view booking analytics.
- Standard users can only see their own bookings.
- The backend is designed to integrate with a React frontend, and uses WebSockets to provide real-time booking updates.
