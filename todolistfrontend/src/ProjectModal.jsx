import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectModal = ({ isOpen, onClose, onProjectCreated, onProjectSelect }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [jiraProjectKey, setJiraProjectKey] = useState('');
  const [teamMember, setTeamMember] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('Project name is required');
      return;
    }
    try {
      await axios.post('http://localhost:8080/projects/create', {
        projectName: projectName,
        projectDescription: projectDescription,
        jiraProjectKey: jiraProjectKey.trim() || null, // Use null if empty so backend can set default
        teamMembers: teamMembers,
        createdBy: 'currentUser' // You can get this from auth context
      });
      const createdProjectName = projectName;
      alert('Project created successfully!');
      setProjectName('');
      setProjectDescription('');
      setJiraProjectKey('');
      setTeamMembers([]);
      setTeamMember('');
      onProjectCreated();
      // Fetch the created project and select it
      setTimeout(async () => {
        try {
          const projects = await axios.get('http://localhost:8080/projects/getAll');
          const newProject = projects.data.find(p => p.projectName === createdProjectName);
          if (newProject && onProjectSelect) {
            onProjectSelect(newProject);
          }
        } catch (error) {
          console.error('Error fetching new project:', error);
        }
      }, 500);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(error.response?.data || 'Failed to create project');
    }
  };

  const handleAddMember = () => {
    if (teamMember.trim() && !teamMembers.includes(teamMember.trim())) {
      setTeamMembers([...teamMembers, teamMember.trim()]);
      setTeamMember('');
    }
  };

  const handleRemoveMember = (member) => {
    setTeamMembers(teamMembers.filter(m => m !== member));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Project</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleCreateProject}>
          <div className="modal-body">
            <div className="task-detail-section">
              <label className="detail-label">Project Name *</label>
              <input
                type="text"
                className="form-input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="task-detail-section">
              <label className="detail-label">Project Description</label>
              <textarea
                className="form-input"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Enter project description"
                rows="3"
              />
            </div>

            <div className="task-detail-section">
              <label className="detail-label">Jira Project Key</label>
              <input
                type="text"
                className="form-input"
                value={jiraProjectKey}
                onChange={(e) => setJiraProjectKey(e.target.value.toUpperCase())}
                placeholder="Enter Jira project key"
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <div className="task-detail-section">
              <label className="detail-label">Add Team Members</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={teamMember}
                  onChange={(e) => setTeamMember(e.target.value)}
                  placeholder="Enter team member name"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
                <button type="button" className="btn-add-member" onClick={handleAddMember}>
                  + Add
                </button>
              </div>
              {teamMembers.length > 0 && (
                <div className="team-members-list">
                  {teamMembers.map((member, index) => (
                    <span key={index} className="team-member-tag">
                      {member}
                      <button
                        type="button"
                        className="remove-member-btn"
                        onClick={() => handleRemoveMember(member)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn-assign">
              Create Project
            </button>
            <button type="button" className="btn-close" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

