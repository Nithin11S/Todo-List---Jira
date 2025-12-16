import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskModal from './TaskModal';
import './index.css';  

const DragDrop = ({ refreshTrigger, selectedProject }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    underReview: [],
    completed: [],  
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    if (!selectedProject) return;
    try {
      const result = await axios.get(`http://localhost:8080/tasks/getByProject/${selectedProject.projectId}`);
      setTasks({
        todo: result.data.filter(task => task.taskStatus === 'TODO'),
        inProgress: result.data.filter(task => task.taskStatus === 'INPROGRESS'),
        underReview: result.data.filter(task => task.taskStatus === 'UNDERREVIEW'),
        completed: result.data.filter(task => task.taskStatus === 'COMPLETED'),
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const syncAllFromJira = async () => {
    if (!selectedProject) return;
    try {
      await axios.post(`http://localhost:8080/tasks/syncAllFromJira/${selectedProject.projectId}`);
      // After syncing, fetch tasks to get updated statuses
      fetchTasks();
    } catch (error) {
      console.error('Error syncing from Jira:', error);
    }
  };
  
  useEffect(() => {
    if (!selectedProject) return;
    
    fetchTasks();
    
    // Sync from Jira every 5 seconds to catch changes made in Jira
    const syncIntervalId = setInterval(() => {
      syncAllFromJira();
    }, 5000);
    
    // Also refresh tasks every 3 seconds
    const fetchIntervalId = setInterval(() => {
      fetchTasks();
    }, 3000);
    
    return () => {
      clearInterval(syncIntervalId);
      clearInterval(fetchIntervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  useEffect(() => {
    if (refreshTrigger) {
      fetchTasks();
    }
  }, [refreshTrigger]);

  const handleTaskClick = async (task) => {
    try {
      const response = await axios.get(`http://localhost:8080/tasks/${task.taskId}`);
      setSelectedTask(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleModalUpdate = () => {
    fetchTasks();
  };

  const columnConfig = [
    { id: 'todo', label: 'TODO' },
    { id: 'inProgress', label: 'INPROGRESS' },
    { id: 'underReview', label: 'UNDERREVIEW' },
    { id: 'completed', label: 'COMPLETED' }
  ];

  return (
    <>
      <div className="kanban-board">
        {columnConfig.map(({ id, label }) => {
          const columnTasks = tasks[id] || [];
          return (
            <div
              key={id}
              className={`kanban-column kanban-column-${id}`}
            >
              <div className="column-header">
                <h3>{label}</h3>
                <span className="task-count">{columnTasks.length}</span>
              </div>
              <div className="column-content">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task, index) => {
                    if (!task || !task.taskId) return null;
                    return (
                      <div
                        key={`task-${task.taskId}`}
                        className="kanban-task clickable"
                        onClick={() => handleTaskClick(task)}
                      >
                        <div className="task-content">
                          <h4 className="task-title">{task.taskName || 'Untitled Task'}</h4>
                          <p className="task-details">{task.taskDetails || ''}</p>
                          {task.section && (
                            <div className="task-section" style={{ marginTop: '8px' }}>
                              <span style={{
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '500'
                              }}>
                                📁 {task.section}
                              </span>
                            </div>
                          )}
                          {task.assignedTo && (
                            <div className="task-assigned">
                              <span className="assigned-badge">👤 {task.assignedTo}</span>
                            </div>
                          )}
                          {task.dueDate && (
                            <div className="task-due-date">
                              <span className="due-date-badge">📅 {task.dueDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-column">
                    <p>No tasks</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleModalUpdate}
        selectedProject={selectedProject}
      />
    </>
  );
};

export default DragDrop;
    