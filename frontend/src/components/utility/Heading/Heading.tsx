import styles from "./Heading.module.scss";

function Heading({
	text,
	className,
	isH1 = false,
	...props
}: { text: string; isH1?: boolean } & React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLHeadingElement>,
	HTMLHeadingElement
>) {
	if (isH1) {
		return (
			<h1
				className={`${styles.heading} ${className ?? ""}`}
				{...props}
			>
				{text}
			</h1>
		);
	} else {
		return (
			<h2
				className={`${styles.heading} ${className ?? ""}`}
				{...props}
			>
				{text}
			</h2>
		);
	}
}

export default Heading;
