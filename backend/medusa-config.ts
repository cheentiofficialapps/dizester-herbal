const config = {
  projectConfig: {
    jwtSecret: process.env.JWT_SECRET || "supersecret",
    cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    database_url: process.env.DATABASE_URL,
    redis_url: process.env.REDIS_URL,
    admin_cors: process.env.ADMIN_CORS || "http://localhost:7001,http://localhost:9000",
    store_cors: process.env.STORE_CORS || "http://localhost:8000",
    auth_cors: process.env.AUTH_CORS || "http://localhost:8000",
    database_extra: {},
  },
  admin: {
    path: "/app",
  },
};

export default config;
