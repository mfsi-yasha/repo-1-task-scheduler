import type { Metadata } from "next";
import "src/scss/global.scss";

export const metadata: Metadata = {
	title: "Task Scheduler App",
	description: "Task Scheduler App",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
