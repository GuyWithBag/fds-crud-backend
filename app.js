import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "root",
	database: "task_manager",
});

// CREATE - Add a new task
app.post("/tasks", async (req, res) => {
	try {
		const { title, done } = req.body;
		const [result] = await pool.query(
			"INSERT INTO tasks (title, done) VALUES (?, ?)",
			[title, done || false]
		);
		res.status(201).json({ id: result.insertId, title, done });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// READ - Get all tasks
app.get("/tasks", async (req, res) => {
	try {
		const [rows] = await pool.query("SELECT * FROM tasks");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// READ - Get single task by ID
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
		res.status(500).json({ error: error.message });
	}
});

// UPDATE - Update a task
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
		res.status(500).json({ error: error.message });
	}
});

// DELETE - Delete a task
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
		res.status(500).json({ error: error.message });
	}
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
