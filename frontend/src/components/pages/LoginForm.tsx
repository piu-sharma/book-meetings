import { useState, useContext } from "react";
import { AuthContext } from "@/contexts/Auth";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			if (username && password) {
				await login(username, password);
				navigate("/");
			} else {
				throw new Error();
			}
			// Optionally redirect after successful login
		} catch (err) {
			setError("Invalid username or password");
		}
	};

	return (
		<div className="tw-h-screen tw-bg-gradient-to-tl tw-from-white tw-via-white tw-to-slate-950 tw-flex tw-items-center tw-justify-center">
			<Card className="tw-container tw-flex tw-items-center tw-justify-center tw-max-w-screen-md">
				<CardHeader className="tw-w-4/5 tw-h-3/5 tw-my-6">
					<CardTitle className="tw-h-4 -tw-mx-6">Login</CardTitle>
					<CardDescription className="tw-h-4 -tw-mx-6">
						You need to login before you can proceed
					</CardDescription>
				</CardHeader>
				<CardContent className="tw-m-1 tw-border-l-2 tw-w-4/5 -tw-mx-6">
					{error ? (
						<div className="tw-bg-rose-600 tw-text-white tw-py-1 tw-px-1 tw-rounded">
							{error}
						</div>
					) : null}
					<div className="tw-my-1">
						<Label className="tw-space-y-1" htmlFor="username">
							Username:
						</Label>
						<Input
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="tw-borderRadius"
						/>
					</div>
					<div className="tw-my-1">
						<Label htmlFor="password">Password: </Label>
						<Input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="tw-space-y-1"
						/>
					</div>
					<CardFooter className="-tw-my-3">
						<Button onClick={handleSubmit}>Login</Button>
					</CardFooter>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginForm;
