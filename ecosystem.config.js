module.exports = {
  apps: [
    {
      namespace: "next-express",
      name: "web",
      script: "npm run start ",
      cwd: "./apps/web",
    },
    {
      namespace: "next-express",
      name: "api-8000",
      script: "dist/server.js",
      cwd: "./apps/api",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },
    },
    {
      namespace: "next-express",
      name: "api-8001",
      script: "dist/server.js",
      cwd: "./apps/api",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8001,
      },
    },
    {
      namespace: "next-express",
      name: "api-8002",
      script: "dist/server.js",
      cwd: "./apps/api",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8002,
      },
    },
  ],
};
