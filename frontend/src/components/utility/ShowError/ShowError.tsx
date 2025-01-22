import styles from "./ShowError.module.scss";

function ShowError({
	children,
	className,
	...props
}: { children: React.ReactNode } & React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>) {
	return (
		<div
			className={`${styles.error} ${className ?? ""}`}
			{...props}
		>
			{children}
		</div>
	);
}

export default ShowError;
