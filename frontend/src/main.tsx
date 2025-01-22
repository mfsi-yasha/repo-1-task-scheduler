import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "src/scss/global.scss";
import App from "src/App.tsx";

createRoot(document.querySelector("app")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
