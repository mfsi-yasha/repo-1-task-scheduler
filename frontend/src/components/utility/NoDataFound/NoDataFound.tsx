import styles from "./NoDataFound.module.scss";

function NoDataFound({
	text,
	className,
	...props
}: { text: string } & React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>) {
	return (
		<div
			className={`${styles.noDataFound} ${className ?? ""}`}
			{...props}
		>
			{text}
		</div>
	);
}

export default NoDataFound;
