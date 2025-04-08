CREATE DATABASE  task_manager;

USE task_manager;

CREATE TABLE  tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE
);

INSERT INTO tasks (title, done) VALUES 
    ('Complete project proposal', FALSE),
    ('Review team feedback', TRUE);