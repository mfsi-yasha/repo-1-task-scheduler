import KEYS from "src/globals/keys";
import "src/db/connection";
import express, {
	NextFunction,
	Request,
	Response,
	json,
	urlencoded,
} from "express";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";
import api from "src/api/api";

/**
 * Used to handle the global errors.
 *
 * @param err Error
 * @param req Request Object
 * @param res Response Object
 * @param next Next Function
 */
const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	console.error(err.stack); // log the error stack
	res.status(500).send({ error: 'Something went wrong!' });
};

/**
 * Create an Express application.
 */
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser(KEYS.APP_ENVS.COOKIE_SECRET));
app.use(cors());
app.disable("x-powered-by");
app.use(helmet());
app.use(
	helmet.referrerPolicy({
		policy: "no-referrer",
	})
);
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
	);
	res.setHeader(
		"Content-Security-Policy",
		"script-src 'self' https://cdn.jsdelivr.net;"
	);
	res.setHeader("X-Frame-Options", "SAMEORIGIN");
	res.setHeader("X-XSS-Protection", "1; mode=block");
	next();
});
app.use(compression());
app.use(
	rateLimit({
		windowMs: 2 * 60 * 1000, // 2 minutes
		max: 1000, // limit each IP to 1000 requests per windowMs
	})
);

/**
 * Mount the router for API routes.
 * @param path "{KEYS.APP_ENVS.SERVE_BASE_PATH}/api" - Base path for API routes.
 * @param {typeof api} callback - Express router containing API routes.
 */
app.use(`${KEYS.APP_ENVS.SERVE_BASE_PATH}/api`, api);

/**
 * Writing global error handller in the last.
 */
app.use(errorHandler);

/**
 * Start the server.
 * @param port - Port number on which the server will listen.
 * @param callback () => void - Callback function invoked when the server starts listening.
 */
app.listen(parseInt(KEYS.APP_ENVS.PORT), () => {
	console.log(`Server running at http://localhost:${KEYS.APP_ENVS.PORT}`);
});
