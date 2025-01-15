const fs = require("fs");
const path = require("path");

// The directory where the compiled files are stored (dist folder)
const distDir = path.resolve(__dirname, "./dist");

// Function to recursively walk through files in the dist directory and replace 'src/' with __dirname
function replacePathsInFiles(dir) {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.lstatSync(filePath);

		if (stat.isDirectory()) {
			// Recurse into subdirectories
			replacePathsInFiles(filePath);
		} else if (/\.(js|ts|jsx|tsx)$/.test(filePath)) {
			// Only process .js, .ts, .jsx, and .tsx files
			let fileContent = fs.readFileSync(filePath, "utf-8");

			// Replace 'src/' with __dirname
			fileContent = fileContent.replaceAll(
				`"src/`,
				`require("path").join(__dirname.split("dist")[0], "/dist") + "/`,
			);

			// Write the modified content back to the file
			fs.writeFileSync(filePath, fileContent, "utf-8");

			console.log(`Modified: ${filePath}`);
		}
	});
}

// Start replacing paths in the dist directory
replacePathsInFiles(distDir);

console.log("Path replacement complete.");
