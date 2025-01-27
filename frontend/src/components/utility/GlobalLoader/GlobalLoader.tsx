function GlobalLoader({
	className,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>) {
	return (
		<div
			className={`d-flex justify-content-center align-items-center vh-100 ${className ?? ""}`}
			{...props}
		>
			<div
				className="spinner-border text-primary"
				role="status"
			>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	);
}

export default GlobalLoader;
