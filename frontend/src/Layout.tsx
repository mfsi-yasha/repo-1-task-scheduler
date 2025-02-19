import { useLocation } from "react-router";
import NavBar, { NavBarButton } from "src/components/layout/NavBar/NavBar";
import GlobalLoader from "./components/utility/GlobalLoader/GlobalLoader";
import useProfile from "./hooks/user/useProfile";

function Layout({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const { store } = useProfile();

	if (store.loginInfoFetching === "pending") {
		return <GlobalLoader />;
	}

	return (
		<div>
			{store.loginInfo?.user?.verified ? (
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
			) : (
				<></>
			)}

			{/* Main Content */}
			<div className="container-global container-fluid">{children}</div>
		</div>
	);
}

export default Layout;
