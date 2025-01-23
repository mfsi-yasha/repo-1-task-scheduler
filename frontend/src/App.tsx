import { BrowserRouter, Route, Routes } from "react-router";
import { useStoreCreate } from "./hooks/useStore";
import Layout from "src/Layout";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/auth/Login/Login";
import Signup from "./pages/auth/Signup/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";
import VerifyUser from "./pages/auth/VerifyUser/VerifyUser";

function App() {
	const [store, dispatch, Provider] = useStoreCreate();

	return (
		<Provider value={[store, dispatch]}>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<Layout>
								<Home />
							</Layout>
						}
					/>
					<Route
						path="/profile"
						element={
							<Layout>
								<Profile />
							</Layout>
						}
					/>
					<Route
						path="/login"
						element={
							<Layout>
								<Login />
							</Layout>
						}
					/>
					<Route
						path="/signup"
						element={
							<Layout>
								<Signup />
							</Layout>
						}
					/>
					<Route
						path="/forgot-password"
						element={
							<Layout>
								<ForgotPassword />
							</Layout>
						}
					/>
					<Route
						path="/reset-password"
						element={
							<Layout>
								<ResetPassword />
							</Layout>
						}
					/>
					<Route
						path="/verify-user"
						element={
							<Layout>
								<VerifyUser />
							</Layout>
						}
					/>
				</Routes>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
