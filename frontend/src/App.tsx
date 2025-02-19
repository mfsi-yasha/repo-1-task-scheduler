import { BrowserRouter, Route, Routes } from "react-router";
import { useStoreCreate } from "./hooks/useStore";
import Layout from "src/Layout";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/auth/Login/Login";
import Signup from "./pages/auth/Signup/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";
import VerifyUser from "./pages/auth/VerifyUser/VerifyUser";
import TaskList from "./pages/tasks/TaskList/TaskList";
import AddTask from "./pages/tasks/AddTask/AddTask";
import TaskDetails from "./pages/tasks/TaskDetails/TaskDetails";

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
								<TaskList />
							</Layout>
						}
					/>
					<Route
						path="/task/new"
						element={
							<Layout>
								<AddTask />
							</Layout>
						}
					/>
					<Route
						path="/task/:taskId"
						element={
							<Layout>
								<TaskDetails />
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
