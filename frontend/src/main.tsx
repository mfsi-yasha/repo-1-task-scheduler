import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "src/scss/global.scss";
import queryClient from "src/globals/queryClient";
import App from "src/App.tsx";

createRoot(document.querySelector("app")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</StrictMode>,
);
