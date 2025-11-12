const ENV = {
  dev: {
    API_URL: "https://d3e728f9-adb3-45c3-b9d9-db9f07d52739-00-r3h6z7uj39eh.sisko.replit.dev", // ganti sesuai nama Replit kamu
  },
  prod: {
    API_URL: "https://d3e728f9-adb3-45c3-b9d9-db9f07d52739-00-r3h6z7uj39eh.sisko.replit.dev",
  },
};

export default function getEnvVars() {
  return ENV.dev;
}