import { config } from "dotenv";

config();

const APP_ENVS = {
  PORT: process.env.PORT as string,
  LOGS_DIR: process.env.LOGS_DIR as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production" | "staging",
  JWT_SECRET: process.env.JWT_SECRET as string,
  COOKIE_SECRET: process.env.COOKIE_SECRET as string,
  SERVE_BASE_PATH: process.env.SERVE_BASE_PATH as string,
};

const MONGO_KEYS = {
  MONGODB_SERVER: process.env.MONGODB_SERVER as string,
};

const KEYS = { APP_ENVS, MONGO_KEYS };

const undefinedKeys: Array<string> = [];

for (const key in KEYS) {
  const element = (KEYS as Record<string, Record<string, undefined | string>>)[
    key
  ];
  for (const eleKey in element) {
    if (eleKey === "PORT" && isNaN(parseInt(element[eleKey] + ""))) {
      undefinedKeys.push(`(PORT should be a number)`);
    } else if (
      eleKey === "NODE_ENV" &&
      !(
        element[eleKey] === "development" ||
        element[eleKey] === "production" ||
        element[eleKey] === "staging"
      )
    ) {
      undefinedKeys.push(
        `(Allowed NODE_ENV are development, production and staging)`
      );
    } else if (!element[eleKey]) {
      undefinedKeys.push(eleKey);
    }
  }
}

if (undefinedKeys.length) {
  console.log(`Env variables not set:\n\t${undefinedKeys.join(",\n\t")}`);
  process.exit(1);
}

export default KEYS;
