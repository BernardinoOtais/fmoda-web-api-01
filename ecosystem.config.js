module.exports = {
  apps: [
    {
      namespace: "next-express",
      name: "web",
      // Change 1: Use npm start to ensure all hooks/path resolutions run correctly
      script: "npm",
      args: "run start",
      cwd: "./apps/web",
      // Change 2: Increase memory. Next.js builds/actions can spike > 500MB
      max_memory_restart: "1G",
      instances: 1,
      exec_mode: "fork",
      // Change 3: Add explicit PATH and Build ID stability environment variables
      env: {
        NODE_ENV: "production",
        PORT: 3000,
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
