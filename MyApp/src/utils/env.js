const ENV = {
  dev: {
    API_URL: "https://02502f82-14ae-468f-b0a9-93aa5ed7fc5c-00-24je5z61ps6gg.sisko.replit.dev", // ganti sesuai nama Replit kamu
  },
  prod: {
    API_URL: "https://02502f82-14ae-468f-b0a9-93aa5ed7fc5c-00-24je5z61ps6gg.sisko.replit.dev",
  },
};

export default function getEnvVars() {
  return ENV.dev;
}