import { getEnv } from "./env.js";

let env = getEnv();
const overrideEnv = window.localStorage.getItem("env");

if (["dev", "prod", "local"].includes(overrideEnv)) {
  console.log(`Overriding env from localStorage [${overrideEnv}]`);
  env = overrideEnv;
}

const CONFIG = {
  local: {
    API: "http://localhost:3000/api"
  },
  staging: {
    API: "https://staging.api.thehumanfactor.ai/api"
  },
  prod: {
    API: "https://api.thehumanfactor.ai/api"
  }
};

console.log(`Configured with env: [${env}]`);
export default CONFIG[env];
