import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TaskModal = ({ task, isOpen, onClose, onUpdate, selectedProject }) => {
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const syncedTaskIdRef = useRef(null);

  useEffect(() => {
    if (selectedProject && selectedProject.teamMembers) {
      setTeamMembers(selectedProject.teamMembers);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (task) {
      setAssignedTo(task.assignedTo || '');
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  // Auto-sync from Jira when modal opens if task has Jira issue key
  useEffect(() => {
    if (!isOpen || !task || !task.jiraIssueKey || !task.taskId) {
      return;
    }
    
    // Only sync once per task when modal opens
    if (syncedTaskIdRef.current === task.taskId) {
      return;
    }
    
    syncedTaskIdRef.current = task.taskId;
    
    const sync = async () => {
      try {
        const response = await axios.post(`http://localhost:8080/tasks/syncFromJira/${task.taskId}`);
        if (response.data && !response.data.includes('already in sync')) {
          onUpdate(); // Only update if status actually changed
        }
      } catch (error) {
        console.error('Auto-sync from Jira failed:', error);
      }
    };
    
    sync();
  }, [isOpen, task, onUpdate]);
  
  // Reset synced ref when modal closes
  useEffect(() => {
    if (!isOpen) {
      syncedTaskIdRef.current = null;
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleAssign = async () => {
    if (!assignedTo || !dueDate) {
      alert('Please fill in both assigned member and due date');
      return;
    }
    try {
      await axios.post(`http://localhost:8080/tasks/assign/${task.taskId}`, {
        assignedTo: assignedTo,
        dueDate: dueDate
      });
      alert('Task assigned successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Failed to assign task');
    }
  };

  const handleMoveNext = async () => {
    try {
      await axios.post(`http://localhost:8080/tasks/moveNext/${task.taskId}`);
      alert('Task moved to next status!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error moving task:', error);
      alert(error.response?.data || 'Failed to move task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this completed task? This action cannot be undone.')) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/tasks/delete/${task.taskId}`);
      alert('Task deleted successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert(error.response?.data || 'Failed to delete task');
    }
  };

  const handleSyncFromJira = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/tasks/syncFromJira/${task.taskId}`);
      alert(response.data || 'Status synced from Jira!');
      onUpdate();
    } catch (error) {
      console.error('Error syncing from Jira:', error);
      alert(error.response?.data || 'Failed to sync from Jira');
    }
  };


  const getNextStatus = () => {
    switch(task.taskStatus) {
      case 'TODO': return 'INPROGRESS';
      case 'INPROGRESS': return 'UNDERREVIEW';
      case 'UNDERREVIEW': return 'COMPLETED';
      default: return null;
    }
  };

  const isTodo = task.taskStatus === 'TODO';
  const isCompleted = task.taskStatus === 'COMPLETED';
  const nextStatus = getNextStatus();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.taskName}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="task-detail-section">
            <label className="detail-label">Task Details:</label>
            <p className="detail-value">{task.taskDetails || 'No details provided'}</p>
          </div>

          <div className="task-detail-section">
            <label className="detail-label">Status:</label>
            <span className={`status-badge status-${task.taskStatus.toLowerCase()}`}>
              {task.taskStatus}
            </span>
          </div>

          {task.assignedTo && (
            <div className="task-detail-section">
              <label className="detail-label">Assigned To:</label>
              <p className="detail-value">{task.assignedTo}</p>
            </div>
          )}

          {task.dueDate && (
            <div className="task-detail-section">
              <label className="detail-label">Due Date:</label>
              <p className="detail-value">{task.dueDate}</p>
            </div>
          )}

          {task.jiraIssueKey && (
            <div className="task-detail-section">
              <label className="detail-label">Jira Issue:</label>
              <p className="detail-value">{task.jiraIssueKey}</p>
            </div>
          )}

          {isTodo && (
            <>
              <div className="task-detail-section">
                <label className="detail-label">Assign Team Member:</label>
                <select
                  className="form-select"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Select a team member</option>
                  {teamMembers.map((member, index) => (
                    <option key={index} value={member}>{member}</option>
                  ))}
                </select>
              </div>

              <div className="task-detail-section">
                <label className="detail-label">Due Date:</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {isTodo && (
            <button className="btn-assign" onClick={handleAssign}>
              Assign Task
            </button>
          )}
          {nextStatus && (
            <button className="btn-move-next" onClick={handleMoveNext}>
              Move to {nextStatus}
            </button>
          )}
          {task.jiraIssueKey && (
            <button className="btn-assign" onClick={handleSyncFromJira} style={{backgroundColor: '#667eea'}}>
              🔄 Sync from Jira
            </button>
          )}
          {isCompleted && (
            <button className="btn-delete" onClick={handleDelete}>
              🗑️ Clear Task
            </button>
          )}
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

