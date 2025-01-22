import styles from "./Paragraph.module.scss";

function Paragraph({
	text,
	className,
	...props
}: { text: string } & React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLParagraphElement>,
	HTMLParagraphElement
>) {
	return (
		<p
			className={`${styles.paragraph} ${className ?? ""}`}
			{...props}
		>
			{text}
		</p>
	);
}

export default Paragraph;
