// import "./App.css";
import { MainContent } from "./components/MainContent";
import { AuthProvider } from "./contexts/Auth";
import "./index.css";
import "./output.css";

function App() {
	return (
		<div className=" tw-font-custom">
			<AuthProvider>
				<MainContent />
			</AuthProvider>
		</div>
	);
}

export default App;
