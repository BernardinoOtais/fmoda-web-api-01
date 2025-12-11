module.exports = {
  apps: [
    {
      namespace: "next-express",
      name: "web",
      script: "./node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "./apps/web",
      max_memory_restart: "500M",
      node_args: "--expose-gc",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      namespace: "next-express",
      name: "api-8000",
      script: "dist/server.js",
      cwd: "./apps/api",
      exec_mode: "fork",
      max_memory_restart: "300M",
      instances: 1,
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
      max_memory_restart: "300M",
      instances: 1,
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
      max_memory_restart: "300M",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 8002,
      },
    },
  ],
};
