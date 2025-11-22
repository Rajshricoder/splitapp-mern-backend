import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connect } from "./db/db.js";
import http from "http";

import transroutes from "./routes/transactions.js";
import authroutes from "./routes/auth.js";
import savingroutes from "./routes/savings.js";
import billsRoutes from "./routes/bills.js";
import mailroutes from "./routes/sendEmail.js";
import userroutes from "./routes/user.js";
import grouproutes from "./routes/groups.js";
import friendroutes from "./routes/friends.js";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/bills", billsRoutes);
app.use("/api/transactions", transroutes);
app.use("/api/savings", savingroutes);
app.use("/api/auth", authroutes);
app.use("/api/mail", mailroutes);
app.use("/api/user", userroutes);
app.use("/api/group", grouproutes);
app.use("/api/friend", friendroutes);

// ✅ HEALTH CHECK ROUTE
app.get("/health", async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;

        const statusMap = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting"
        };

        return res.status(200).json({
            status: "OK",
            server: "running",
            database: statusMap[dbStatus] || "unknown"
        });
    } catch (err) {
        return res.status(500).json({
            status: "ERROR",
            message: err.message
        });
    }
});

// Error middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "errorrrr";
    console.log(err);
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

// Start server ONLY AFTER DB connects
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connect();       // ⬅ your db.js connect function
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
