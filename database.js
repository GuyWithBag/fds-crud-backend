import mysql from "mysql2";

const pool = mysql
	.createPool({
		host: "127.0.0.1",
		user: "root",
		password: "root",
		database: "task_manager",
	})
	.promise();

console.log(result);

const getTasks = async () => {
	const [rows] = await pool.query("SELECT * FROM tasks;");
	return rows;
};
