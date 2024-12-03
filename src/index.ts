import express, { Application } from "express";
import dotenv from "dotenv";
import abc from "src/test/test";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.get("/", abc);

app.listen(port, () => {
	console.log(`Server is Fire at http://localhost:${port}`);
});
