export const appName = "Illumina";

export const hostname = process.env.SERVER_ENV === "production" ? "illumina.phanective.org"
  : process.env.SERVER_ENV === "staging" ? "illumina-staging.phanective.org"
  : "localhost:3000"

export const baseURL = (process.env.SERVER_ENV === "development" ? "http://" : "https://") + hostname;
