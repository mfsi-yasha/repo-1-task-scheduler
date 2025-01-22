import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import queryClient from "src/globals/queryClient";
import Layout from "src/Layout";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route
							path="/"
							element={<Home />}
						/>
						<Route
							path="/profile"
							element={<Profile />}
						/>
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
