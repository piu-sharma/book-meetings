import Analytics from "./components/pages/Analytics";
import Bookings from "./components/pages/Bookings";
import Dashboard from "./components/pages/Dashboard";
import { Home } from "./components/pages/Home";
import LoginForm from "./components/pages/LoginForm";
import { AuthProvider } from "./contexts/Auth";
import "./index.css";
import "./output.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 10 * 5,
			retry: false,
		},
	},
});

const NotFound = () => <div>'Nothing found'</div>;

function App() {
	return (
		<div className=" tw-font-custom">
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<Router>
						<Routes>
							<Route path="/login" element={<LoginForm />} />
							<Route path="*" element={<NotFound />} />
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/booking" element={<Bookings />} />
							<Route path="/analytics" element={<Analytics />} />
							<Route path="/" element={<Home />} />
						</Routes>
					</Router>
				</QueryClientProvider>
			</AuthProvider>
		</div>
	);
}

export default App;
