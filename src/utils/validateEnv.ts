import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";
import config from "config";

export default cleanEnv(config, {
  MONGO_URL: str(),
  PORT: port(),
  SESSION_SECRET: str(),
});
