import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import DragDrop from './DragDrop';
import ProjectModal from './ProjectModal';
import ProjectSelector from './ProjectSelector';


const Homes = () => {
 const [refreshTrigger, setRefreshTrigger] = useState(0);
 const [projectRefreshTrigger, setProjectRefreshTrigger] = useState(0);
 const [selectedProject, setSelectedProject] = useState(null);
 const [showTaskSection, setShowTaskSection] = useState(false);
 const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
 const [formdata,setFormdata] = useState({
  taskName:'',
  taskDetails:'',
  taskStatus:'TODO',
  projectId: '',
  section: ''
 });

  const handleChange = (e) =>{
    const {name, value} = e.target;
    setFormdata({
      ...formdata,
      [name]:value
    })

  }

  const handleTaskCreation = async(e) =>{
    e.preventDefault();
    if (!selectedProject) {
      alert('Please select a project first');
      return;
    }
    try{
      const taskData = {
        ...formdata,
        projectId: selectedProject.projectId
      };
      const response = await axios.post('http://localhost:8080/tasks/create', taskData);
      if(response.status === 200){
        alert("Task Created!");
        setFormdata({
          taskName: '',
          taskDetails: '',
          taskStatus: 'TODO',
          projectId: '',
          section: ''
        });
        // Trigger refresh of task list
        setRefreshTrigger(prev => prev + 1);
      }
    }catch(error){
      console.error("Something went wrong", error);
      alert("Failed to create task. Please try again.");
    }
  }

  const handleProjectCreated = () => {
    // Refresh project list
    setProjectRefreshTrigger(prev => prev + 1);
  }

  const handleContinue = () => {
    if (!selectedProject) {
      alert('Please select a project first');
      return;
    }
    setShowTaskSection(true);
  }


  return (
    <div className="home-container">
      <header className="app-header">
        <h1 className="app-title">ToDoList</h1>
        <button 
          className="btn-create-project"
          onClick={() => setIsProjectModalOpen(true)}
        >
          + New Project
        </button>
      </header>
      
      <div className="project-selector-container">
        <ProjectSelector
          selectedProject={selectedProject}
          onProjectChange={(project) => {
            setSelectedProject(project);
            setShowTaskSection(false);
          }}
          refreshTrigger={projectRefreshTrigger}
        />
        
        {selectedProject && !showTaskSection && (
          <div className="continue-button-container">
            <button 
              className="btn-continue"
              onClick={handleContinue}
            >
              Continue to Tasks →
            </button>
          </div>
        )}
      </div>

      {selectedProject && showTaskSection && (
        <>
          <div className="task-form-container">
            <form onSubmit={handleTaskCreation} className="task-form">
              <div className="form-group">
                <label htmlFor="taskName" className="form-label">Task Name</label>
                <input
                  id="taskName"
                  name="taskName"
                  type="text"
                  value={formdata.taskName}
                  onChange={handleChange}
                  placeholder="Enter task name"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDetails" className="form-label">Task Details</label>
                <input
                  id="taskDetails"
                  name="taskDetails"
                  type="text"
                  value={formdata.taskDetails}
                  onChange={handleChange}
                  placeholder="Enter task details"
                  className="form-input"
                  required
                />
              </div>
              {selectedProject && (selectedProject.sections && selectedProject.sections.length > 0) && (
                <div className="form-group">
                  <label htmlFor="section" className="form-label">Section/Category</label>
                  <select
                    id="section"
                    name="section"
                    value={formdata.section}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">-- Select a section (optional) --</option>
                    {selectedProject.sections.map((section, index) => (
                      <option key={index} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              )}
              <button type="submit" className="btn-primary">
                <span>+</span> Add Task
              </button>
            </form>
          </div>

          <div className="kanban-container">
            <DragDrop refreshTrigger={refreshTrigger} selectedProject={selectedProject}/>
          </div>
        </>
      )}

      {!selectedProject && (
        <div className="no-project-message">
          <p>Please create or select a project to start managing tasks</p>
        </div>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
        onProjectSelect={(project) => {
          setSelectedProject(project);
          setShowTaskSection(false);
        }}
      />
    </div>
  )
}

export default Homes;