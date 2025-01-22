import Heading from "src/components/utility/Heading/Heading";

function Home() {
	return (
		<div className="pt-5 px-1 px-md-4">
			{/* Main heading for the page */}
			<Heading
				className="px-2"
				text={"Home"}
				isH1={true}
			/>
		</div>
	);
}

export default Home;
