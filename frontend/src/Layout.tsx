import { useLocation } from "react-router";
import NavBar, { NavBarButton } from "src/components/layout/NavBar/NavBar";

function Layout({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	return (
		<div>
			<NavBar>
				<NavBarButton
					to="/"
					text={"Home"}
					isActive={location.pathname === "/"}
				/>
				<NavBarButton
					to="/profile"
					text={"Profile"}
					isActive={location.pathname === "/profile"}
				/>
			</NavBar>

			{/* Main Content */}
			<div className="container-global container-fluid">{children}</div>
		</div>
	);
}

export default Layout;
