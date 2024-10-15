import React, { useState } from 'react';
import axios from 'axios'; // Import axios

  const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send task creation request to backend
      const response = await axios.post('http://localhost:3001/tasks', {
        title,
        description,
        due_date: dueDate, // Ensure the date field matches the backend expectation
      });
  
      console.log('Task created:', response.data); // Debugging log
  
      // Refresh the task list after successful creation
      await onTaskCreated(); 
  
      // Clear the form fields
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Error creating task:', error); // Debugging log
    }
  };
  

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          className="form-control mb-3"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        {/* Centering the button */}
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary mt-3">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

