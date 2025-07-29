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
      name: "api 1",
      script: "node dist/server.js",
      cwd: "./apps/api",
      instances: "1",
      exec_mode: "fork",
      /*
      exec_mode: "cluster",
      instances: "10",
      */
      env: {
        NODE_ENV: "production",
      },
    },
    {
      namespace: "next-express",
      name: "api 2",
      script: "node dist/server.js",
      cwd: "./apps/api",
      instances: "1",
      exec_mode: "fork",
      /*
      exec_mode: "cluster",
      instances: "10",
      */
      env: {
        NODE_ENV: "production",
        PORT: 8002,
      },
    },
  ],
};
