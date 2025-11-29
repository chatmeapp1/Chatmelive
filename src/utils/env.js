const ENV = {
  dev: {
    API_URL: "https://5673766c-0cb9-4eb2-ba61-380c90ae9383-00-107h8sd6jgwdl.sisko.replit.dev:8000", // ganti sesuai nama Replit kamu
  },
  prod: {
    API_URL: "https://5673766c-0cb9-4eb2-ba61-380c90ae9383-00-107h8sd6jgwdl.sisko.replit.dev:8000",
  },
};

export default function getEnvVars() {
  return ENV.dev;
}