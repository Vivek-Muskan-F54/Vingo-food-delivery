import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app);

// Allowed origins for both local and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://vingo-food-delivery.vercel.app",
  "https://vingo-food-delivery-goh77k3yj-vivek-muskans-projects.vercel.app",
  "https://vingo-food-delivery-od2s.vercel.app"
];

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// Express CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(
          new Error("CORS policy does not allow access from this origin"),
          false
        );
      }
      return callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// Socket.io handler
socketHandler(io);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  connectDb();
  console.log(`Server started at ${port}`);
});
