import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation

const TaskList = ({ onTaskUpdated }) => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [summary, setSummary] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [onTaskUpdated]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      onTaskUpdated();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditTaskId(task.id);
    setNewTitle(task.title);
    setNewDescription(task.description);
    setNewDueDate(task.due_date);
    setNewStatus(task.status || '');
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/tasks/${editTaskId}`, {
        title: newTitle,
        description: newDescription,
        due_date: newDueDate,
        status: newStatus,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId
            ? { ...task, title: newTitle, description: newDescription, due_date: newDueDate, status: newStatus }
            : task
        )
      );
      setEditTaskId(null);
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleSummarize = async (taskDescription) => {
    try {
      const response = await axios.post('http://localhost:3001/summarize-task', { taskDescription });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing task:', error);
      setSummary('Failed to generate summary.');
    }
  };

  const handleCancel = () => setEditTaskId(null);

  const filteredTasks = tasks.filter((task) =>
    filterStatus ? task.status.toLowerCase() === filterStatus.toLowerCase() : true
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'asc') return new Date(a.due_date) - new Date(b.due_date);
    if (sortOrder === 'desc') return new Date(b.due_date) - new Date(a.due_date);
    return 0;
  });

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
      <h1 className="text-center mb-4">Task Manager</h1>

      <div className="d-flex justify-content-center mb-3 gap-3 w-100">
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="form-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">Sort by Due Date</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-center">No tasks available. Please create one.</p>
      ) : (
        <ul className="list-group w-100" style={{ maxWidth: '1150px' }}>
          {sortedTasks.map((task) => (
            <li key={task.id} className="list-group-item">
              {editTaskId === task.id ? (
                <div className="row">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 d-flex justify-content-end align-items-start gap-2">
                    <button className="btn btn-success btn-sm" onClick={handleUpdate}>
                      Save
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <strong>{task.title}</strong>: {task.description}
                    <br />
                    <em>Due: {task.due_date || 'N/A'}, Status: {task.status || 'N/A'}</em>
                    <br />
                    <em>Created by: {task.owner || 'Unknown'}</em>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>
                      Delete
                    </button>
                    <button className="btn btn-info btn-sm" onClick={() => handleSummarize(task.description)}>
                      Summarize
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {summary && (
        <div className="alert alert-info mt-4 text-center" style={{ maxWidth: '600px' }}>
          <h5>Task Summary</h5>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
