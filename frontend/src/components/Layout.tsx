import {
	Link,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { Button } from "./ui/button";
import { logoutUser } from "@/services/loginService";
import type { ReactNode } from "react";

const Layout = () => {
	return (
		<NavigationMenu className="tw-h-full tw-justify-between tw-flex tw-flex-col tw-border-r-2">
			<NavigationMenuList className="tw-h-full">
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/">
							<Button variant="link">Home</Button>
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/dashboard">
							<Button variant="link">Dashboard</Button>
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/bookings">
							<Button variant="link">Bookings</Button>
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link href="/analytics">
							<Button variant="link">Analytics</Button>
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
	return (
		<div className="tw-h-screen tw-pr-1 tw-bg-gradient-to-tl tw-from-white tw-to-zinc-50 tw-text-slate-800 tw-flex">
			<Layout />
			{children}
		</div>
	);
};

export { LayoutWrapper };
