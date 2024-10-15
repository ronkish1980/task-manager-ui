// src/App.js

import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="App">
      <div className="container d-flex flex-column align-items-center mt-5">
        <h1 className="text-center mb-4">Task Manager</h1>
        <Routes>
          <Route
            path="/"
            element={
              <div className="w-75">
                <TaskForm onTaskCreated={fetchTasks} />
                <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

