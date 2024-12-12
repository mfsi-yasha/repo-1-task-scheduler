import { config } from "dotenv";

config();

const APP_ENVS = {
	PORT: parseInt(process.env.PORT ?? ""),
	LOGS_DIR: process.env.LOGS_DIR as string,
	NODE_ENV: process.env.NODE_ENV as "development" | "production" | "staging",
	JWT_SECRET: process.env.JWT_SECRET as string,
	COOKIE_SECRET: process.env.COOKIE_SECRET as string,
	SERVE_BASE_PATH: process.env.SERVE_BASE_PATH as string,
};

const MONGO_KEYS = {
	MONGODB_SERVER: process.env.MONGODB_SERVER as string,
};

const SMTP_KEYS = {
	SMTPSERVER_HOST: process.env.SMTPSERVER_HOST as string,
	SMTPSERVER_PORT: parseInt(process.env.SMTPSERVER_PORT ?? ""),
	SMTPSERVER_USER: process.env.SMTPSERVER_USER as string,
	SMTPSERVER_PASSWORD: process.env.SMTPSERVER_PASSWORD as string,
	SMTPSERVER_SENDER: process.env.SMTPSERVER_SENDER as string,
};

const KEYS = { APP_ENVS, MONGO_KEYS, SMTP_KEYS };

const undefinedKeys: Array<string> = [];

for (const key in KEYS) {
	const element = (
		KEYS as Record<
			string,
			Record<string, undefined | string | number | boolean>
		>
	)[key];

	for (const eleKey in element) {
		switch (eleKey) {
			case "PORT": {
				if (isNaN(element[eleKey] as number)) {
					undefinedKeys.push(`(PORT should be a number)`);
				}
				break;
			}

			case "NODE_ENV": {
				if (
					!(
						element[eleKey] === "development" ||
						element[eleKey] === "production" ||
						element[eleKey] === "staging"
					)
				) {
					undefinedKeys.push(
						`(Allowed NODE_ENV are development, production and staging)`,
					);
				}
				break;
			}

			case "SMTPSERVER_PORT": {
				if (isNaN(element[eleKey] as number)) {
					undefinedKeys.push(`(SMTPSERVER_PORT should be a number)`);
				}
				break;
			}

			default: {
				if (
					element[eleKey] === undefined ||
					(typeof element[eleKey] === "string"
						? element[eleKey].trim() === ""
						: false)
				) {
					undefinedKeys.push(eleKey);
				}
				break;
			}
		}
	}
}

if (undefinedKeys.length) {
	console.log(`Env variables not set:\n\t${undefinedKeys.join(",\n\t")}`);
	process.exit(1);
}

export default KEYS;
