import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectSelector = ({ selectedProject, onProjectChange, onAddMember, refreshTrigger }) => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [newMember, setNewMember] = useState('');
  const [newSection, setNewSection] = useState('');
  const [fullProjectDetails, setFullProjectDetails] = useState(null);
  const [editingJiraKey, setEditingJiraKey] = useState(false);
  const [newJiraKey, setNewJiraKey] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedProject && selectedProject.projectId) {
      fetchFullProjectDetails(selectedProject.projectId);
    }
  }, [selectedProject?.projectId]);

  const fetchProjects = async () => {
    try {
      const result = await axios.get('http://localhost:8080/projects/getAll');
      setProjects(result.data);
      if (result.data.length > 0 && !selectedProject) {
        onProjectChange(result.data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchFullProjectDetails = async (projectId) => {
    try {
      const response = await axios.get(`http://localhost:8080/projects/${projectId}`);
      setFullProjectDetails(response.data);
      onProjectChange(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setFullProjectDetails(selectedProject);
    }
  };

  const handleAddMember = async () => {
    if (!selectedProject || !newMember.trim()) {
      alert('Please select a project and enter a team member name');
      return;
    }
    try {
      await axios.post(`http://localhost:8080/projects/${selectedProject.projectId}/addMember`, {
        teamMember: newMember.trim()
      });
      alert('Team member added successfully!');
      setNewMember('');
      fetchProjects();
      // Refresh selected project
      const updated = await axios.get(`http://localhost:8080/projects/${selectedProject.projectId}`);
      setFullProjectDetails(updated.data);
      onProjectChange(updated.data);
    } catch (error) {
      console.error('Error adding team member:', error);
      alert(error.response?.data || 'Failed to add team member');
    }
  };

  const handleUpdateJiraKey = async () => {
    if (!selectedProject || !newJiraKey.trim()) {
      alert('Please enter a Jira project key');
      return;
    }
    try {
      await axios.put(`http://localhost:8080/projects/${selectedProject.projectId}/jiraKey`, {
        jiraProjectKey: newJiraKey.trim().toUpperCase()
      });
      alert('Jira project key updated successfully!');
      setEditingJiraKey(false);
      setNewJiraKey('');
      // Refresh selected project
      const updated = await axios.get(`http://localhost:8080/projects/${selectedProject.projectId}`);
      setFullProjectDetails(updated.data);
      onProjectChange(updated.data);
    } catch (error) {
      console.error('Error updating Jira key:', error);
      alert(error.response?.data || 'Failed to update Jira project key');
    }
  };

  const handleAddSection = async () => {
    if (!selectedProject || !newSection.trim()) {
      alert('Please enter a section name');
      return;
    }
    try {
      await axios.post(`http://localhost:8080/projects/${selectedProject.projectId}/addSection`, {
        section: newSection.trim()
      });
      alert('Section added successfully!');
      setNewSection('');
      // Refresh selected project
      const updated = await axios.get(`http://localhost:8080/projects/${selectedProject.projectId}`);
      setFullProjectDetails(updated.data);
      onProjectChange(updated.data);
    } catch (error) {
      console.error('Error adding section:', error);
      alert(error.response?.data || 'Failed to add section');
    }
  };

  const handleRemoveSection = async (section) => {
    if (!selectedProject) return;
    if (!window.confirm(`Are you sure you want to remove the section "${section}"?`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/projects/${selectedProject.projectId}/removeSection?section=${encodeURIComponent(section)}`);
      alert('Section removed successfully!');
      // Refresh selected project
      const updated = await axios.get(`http://localhost:8080/projects/${selectedProject.projectId}`);
      setFullProjectDetails(updated.data);
      onProjectChange(updated.data);
    } catch (error) {
      console.error('Error removing section:', error);
      alert(error.response?.data || 'Failed to remove section');
    }
  };

  return (
    <div className="project-selector">
      <div className="project-selector-header">
        <label className="detail-label">Select Project:</label>
        <select
          className="form-select project-select"
          value={selectedProject?.projectId || ''}
          onChange={async (e) => {
            const project = projects.find(p => p.projectId === e.target.value);
            if (project) {
              setIsOpen(true);
              // Fetch full project details
              try {
                const response = await axios.get(`http://localhost:8080/projects/${project.projectId}`);
                setFullProjectDetails(response.data);
                onProjectChange(response.data);
              } catch (error) {
                console.error('Error fetching project details:', error);
                onProjectChange(project);
              }
            } else {
              onProjectChange(null);
            }
          }}
        >
          <option value="">-- Select a project --</option>
          {projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>
              {project.projectName}
            </option>
          ))}
        </select>
      </div>

      {selectedProject && (
        <div className="project-info">
          <div className="project-details">
            <h4>{selectedProject.projectName}</h4>
            {selectedProject.projectDescription && (
              <p className="project-description">{selectedProject.projectDescription}</p>
            )}
            <div style={{ marginTop: '8px' }}>
              {!editingJiraKey ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ fontSize: '13px', color: '#667eea', fontWeight: '500', margin: 0 }}>
                    🔗 Linked to Jira: <strong>{(fullProjectDetails?.jiraProjectKey || selectedProject?.jiraProjectKey || 'KAN')}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingJiraKey(true);
                      setNewJiraKey(fullProjectDetails?.jiraProjectKey || selectedProject?.jiraProjectKey || '');
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={newJiraKey}
                    onChange={(e) => setNewJiraKey(e.target.value.toUpperCase())}
                    placeholder="Enter Jira project key (e.g., MAD)"
                    style={{
                      fontSize: '13px',
                      padding: '6px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '4px',
                      width: '150px',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateJiraKey}
                    style={{
                      fontSize: '11px',
                      padding: '6px 12px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingJiraKey(false);
                      setNewJiraKey('');
                    }}
                    style={{
                      fontSize: '11px',
                      padding: '6px 12px',
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="team-members-section">
            <div className="team-members-header">
              <label className="detail-label">Team Members:</label>
              <button
                type="button"
                className="btn-toggle-members"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? '−' : '+'}
              </button>
            </div>
            
            <div className="team-members-content">
              {(fullProjectDetails?.teamMembers || selectedProject?.teamMembers) && 
               (fullProjectDetails?.teamMembers?.length > 0 || selectedProject?.teamMembers?.length > 0) ? (
                <div className="team-members-list">
                  {(fullProjectDetails?.teamMembers || selectedProject?.teamMembers || []).map((member, index) => (
                    <span key={index} className="team-member-tag">
                      {member}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-members">No team members yet</p>
              )}
              
              {isOpen && (
                <div className="add-member-form">
                  <input
                    type="text"
                    className="form-input"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="Enter team member name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMember();
                      }
                    }}
                  />
                  <button type="button" className="btn-add-member" onClick={handleAddMember}>
                    Add Member
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="sections-section" style={{ marginTop: '20px', borderTop: '1px dashed #e0e0e0', paddingTop: '20px' }}>
            <div className="sections-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label className="detail-label">Sections/Categories:</label>
              <button
                type="button"
                className="btn-toggle-members"
                onClick={() => setIsSectionsOpen(!isSectionsOpen)}
              >
                {isSectionsOpen ? '−' : '+'}
              </button>
            </div>
            
            <div className="sections-content">
              {(fullProjectDetails?.sections || selectedProject?.sections) && 
               (fullProjectDetails?.sections?.length > 0 || selectedProject?.sections?.length > 0) ? (
                <div className="sections-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                  {(fullProjectDetails?.sections || selectedProject?.sections || []).map((section, index) => (
                    <span key={index} className="section-tag" style={{
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      border: '1px solid #c8e6c9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      {section}
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(section)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2e7d32',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          padding: '0 3px',
                          marginLeft: '3px'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-sections" style={{ color: '#888', fontStyle: 'italic', marginBottom: '15px' }}>No sections yet</p>
              )}
              
              {isSectionsOpen && (
                <div className="add-section-form" style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="Enter section name (e.g., Frontend, Backend)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSection();
                      }
                    }}
                  />
                  <button type="button" className="btn-add-member" onClick={handleAddSection}>
                    Add Section
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;

