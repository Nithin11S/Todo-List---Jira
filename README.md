# Todo List - Jira Integration

A full-stack Todo List application with Jira integration, built using Spring Boot (Backend) and React (Frontend). This application allows you to manage projects and tasks with seamless synchronization to Jira, drag-and-drop task management, and automated email notifications.

## 🚀 Features

- **Project Management**: Create and manage multiple projects with team members
- **Task Management**: Create, update, and organize tasks with drag-and-drop functionality
- **Jira Integration**: Sync tasks with Jira issues automatically
- **Task Status Tracking**: Track tasks through multiple statuses (TODO, IN PROGRESS, UNDER REVIEW, COMPLETED)
- **Email Notifications**: Automated email notifications for:
  - Project creation
  - Task assignments
  - Due date warnings (within 3 days)
- **User Authentication**: Secure login and registration system
- **Real-time Updates**: Automatic synchronization with Jira every 5 seconds
- **Team Collaboration**: Assign tasks to team members with due dates

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.3.3** - Java framework
- **MongoDB** - NoSQL database
- **Spring Security** - Authentication and authorization
- **Spring Mail** - Email notifications
- **WebFlux** - Reactive programming for Jira API calls
- **Maven** - Dependency management

### Frontend
- **React 18.3.1** - UI library
- **React Router DOM 6.26.2** - Routing
- **Axios 1.7.7** - HTTP client
- **Tailwind CSS 3.4.11** - Styling framework

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Node.js** (v14 or higher) and **npm**
- **MongoDB** (running locally or connection string)
- **Maven** (or use the included Maven wrapper)
- **Jira Account** with API token (for Jira integration)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nithin11S/Todo-List---Jira.git
cd TodoList-Jira-main
```

### 2. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/todolist
MONGODB_DATABASE=todolist

# Email Configuration
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
SPRING_MAIL_SMTP_AUTH=true
SPRING_MAIL_SMTP_STARTTLS_ENABLE=true
SPRING_MAIL_SMTP_STARTTLS_REQUIRED=true
DEMO_EMAIL_RECIPIENT=your-email@gmail.com

# Jira Configuration
JIRA_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_DEFAULT_PROJECT_KEY=YOUR_PROJECT_KEY
```

**Note**: The `.env` file is already included in `.gitignore` to protect your sensitive information.

### 3. Backend Setup

Navigate to the backend directory and configure `application.properties`:

```bash
cd todolistbackend
```

Create or update `src/main/resources/application.properties` with your configuration. You can reference the values from your `.env` file or use environment variables.

For detailed email setup instructions, see [EMAIL_SETUP.md](todolistbackend/EMAIL_SETUP.md).

### 4. Frontend Setup

Install frontend dependencies:

```bash
cd todolistfrontend
npm install
```

## 🏃 Running the Application

### Start MongoDB

Ensure MongoDB is running on your local machine:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### Start the Backend

From the `todolistbackend` directory:

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or using Maven (if installed)
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Start the Frontend

From the `todolistfrontend` directory:

```bash
npm start
```

The frontend will start on `http://localhost:3000`

Or from the root directory:

```bash
npm start
```

## 📁 Project Structure

```
TodoList-Jira-main/
├── .env                    # Environment variables (not in git)
├── .gitignore             # Git ignore file
├── README.md              # This file
├── package.json           # Root package.json
├── todolistbackend/       # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml            # Maven dependencies
│   └── EMAIL_SETUP.md     # Email configuration guide
└── todolistfrontend/      # React frontend
    ├── src/
    │   ├── App.jsx
    │   ├── Home.jsx
    │   ├── Loginpage.jsx
    │   ├── RegisterPage.jsx
    │   ├── DragDrop.jsx
    │   ├── ProjectModal.jsx
    │   ├── ProjectSelector.jsx
    │   └── TaskModal.jsx
    └── package.json
```

## 🔑 Getting API Keys

### Jira API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token**
3. Give it a label (e.g., "TodoList App")
4. Copy the generated token
5. Add it to your `.env` file as `JIRA_API_TOKEN`

### Gmail App Password (for Email)

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security** > **2-Step Verification**
3. Scroll down to **App Passwords**
4. Select **Mail** and **Other (Custom name)** - enter "TodoList App"
5. Click **Generate**
6. Copy the 16-character password
7. Add it to your `.env` file as `SPRING_MAIL_PASSWORD`

## 📧 Email Features

The application sends automated emails for:

1. **Project Creation**: When a new project is created
2. **Task Assignment**: When tasks are assigned to team members
3. **Due Date Warnings**: When a task's due date is within 3 days
4. **All Tasks Assigned**: When all tasks in a project are assigned

See [EMAIL_SETUP.md](todolistbackend/EMAIL_SETUP.md) for detailed email configuration.

## 🔄 Jira Integration

The application automatically:
- Syncs tasks with Jira issues every 5 seconds
- Creates Jira issues when tasks are created
- Updates task status based on Jira issue status
- Displays Jira issue keys in the task modal

## 🎯 Usage

1. **Register/Login**: Create an account or login to access the application
2. **Create Project**: Click "Create Project" to add a new project with team members
3. **Select Project**: Choose a project from the dropdown
4. **Create Tasks**: Add tasks with name, description, and section
5. **Manage Tasks**: Use drag-and-drop to move tasks between status columns
6. **Assign Tasks**: Click on a task to assign it to team members and set due dates
7. **Sync with Jira**: Tasks automatically sync with Jira issues

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Nithin S**

- GitHub: [@Nithin11S](https://github.com/Nithin11S)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Atlassian for Jira API
- All contributors and users of this project

## 📞 Support

If you encounter any issues or have questions, please open an issue on the [GitHub repository](https://github.com/Nithin11S/Todo-List---Jira/issues).

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. The `.env` file is already included in `.gitignore`.
