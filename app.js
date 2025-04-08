import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const PORT = 3001;

// Explicit CORS configuration
app.use(
	cors({
		origin: "http://localhost:3000", // Allow only Next.js origin
		methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
		allowedHeaders: ["Content-Type"], // Allowed headers
	})
);

// Middleware
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "root",
	database: "task_manager",
});

// CREATE
app.post("/tasks", async (req, res) => {
	try {
		const { title, done } = req.body;
		const [result] = await pool.query(
			"INSERT INTO tasks (title, done) VALUES (?, ?)",
			[title, done || false]
		);
		res.status(201).json({ id: result.insertId, title, done });
	} catch (error) {
		console.error("POST error:", error);
		res.status(500).json({ error: error.message });
	}
});

// READ all
app.get("/tasks", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM tasks");
		res.json(rows);
	} catch (error) {
		console.error("GET error:", error);
		res.status(500).json({ error: error.message });
	}
});

// READ one
app.get("/tasks/:id", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
			req.params.id,
		]);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		console.error("GET by ID error:", error);
		res.status(500).json({ error: error.message });
	}
});

// UPDATE
app.put("/tasks/:id", async (req, res) => {
	try {
		const { title, done } = req.body;
		const [result] = await pool.query(
			"UPDATE tasks SET title = ?, done = ? WHERE id = ?",
			[title, done, req.params.id]
		);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.json({ id: req.params.id, title, done });
	} catch (error) {
		console.error("PUT error:", error);
		res.status(500).json({ error: error.message });
	}
});

// DELETE
app.delete("/tasks/:id", async (req, res) => {
	try {
		const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [
			req.params.id,
		]);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.status(204).send();
	} catch (error) {
		console.error("DELETE error:", error);
		res.status(500).json({ error: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
