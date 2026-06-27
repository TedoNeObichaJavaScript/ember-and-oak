import next from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", "data/**", "scripts/**"] },
  ...next,
];

export default config;
