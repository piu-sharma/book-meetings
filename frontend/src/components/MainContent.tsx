import { AuthContext } from "@/contexts/Auth";
import { useContext } from "react";
import LoginForm from "./pages/LoginForm";
import { MainApp } from "./pages/Home";

const MainContent = () => {
	const { isAuthenticated } = useContext(AuthContext);

	if (isAuthenticated) {
		return <MainApp />;
	}
	return <LoginForm />;
};

export { MainContent };
