import { AuthContext } from "@/contexts/Auth";
import { logoutUser } from "@/services/loginService";
import {
	Link,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { type ReactNode, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Toaster } from "./ui/toaster";

const getActiveClass = (path: string, href: string) => {
	const pathToken = path.split("/");
	if (!pathToken[1] && href === "/") {
		return "tw-bg-zinc-300";
	}

	if (pathToken[1] && pathToken[1] === href) {
		return "tw-bg-zinc-300";
	}
	return "";
};

const Layout = () => {
	const path = window.location.pathname;

	return (
		<NavigationMenu className="tw-h-full tw-justify-between tw-flex tw-flex-col tw-border-r-2">
			<NavigationMenuList className="tw-h-full">
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/">
							<Button
								variant="link"
								className={`tw-rounded-none ${getActiveClass(path, "/")}`}
							>
								Home
							</Button>
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/dashboard">
							<Button
								variant="link"
								className={`tw-rounded-none ${getActiveClass(path, "dashboard")}`}
							>
								Dashboard
							</Button>
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/bookings">
							<Button
								variant="link"
								className={`tw-rounded-none ${getActiveClass(path, "bookings")}`}
							>
								Bookings
							</Button>
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/analytics">
							<Button
								variant="link"
								className={`tw-rounded-none ${getActiveClass(path, "analytics")}`}
							>
								Analytics
							</Button>
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Button variant={"secondary"} onClick={logoutUser}>
							Logout
						</Button>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated } = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated === false) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	return (
		<div className="tw-h-screen tw-pr-1 tw-bg-gradient-to-tl tw-from-white tw-to-zinc-50 tw-text-slate-800 tw-flex">
			<div className="tw-py-2">
				<Layout />
			</div>
			<div className="tw-w-lvw tw-p-2 ">
				{children}
				<Toaster />
			</div>
		</div>
	);
};

export { LayoutWrapper };
