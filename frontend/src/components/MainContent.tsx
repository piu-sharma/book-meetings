import { AuthContext } from "@/contexts/Auth";
import { useContext } from "react";
import LoginForm from "./LoginForm";
import { MainApp } from "./MainApp";

const MainContent = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return (
        <MainApp />
    );
  } else {
    return (
      <LoginForm />);
  }
};

export { MainContent };