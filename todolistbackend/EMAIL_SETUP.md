# Email Configuration Guide

## Setup Instructions

### 1. Update `application.properties`

Edit `src/main/resources/application.properties` and update the following:

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Demo email recipient (all emails will be sent to this address)
demo.email.recipient=your-email@gmail.com
```

### 2. Gmail App Password Setup

For Gmail, you need to generate an "App Password" (not your regular password):

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** > **2-Step Verification**
3. Scroll down to **App Passwords**
4. Select **Mail** and **Other (Custom name)** - enter "TodoList App"
5. Click **Generate**
6. Copy the 16-character password
7. Use this password in `spring.mail.password` field

### 3. For Other Email Providers

**Outlook/Hotmail:**
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
```

**Yahoo:**
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
```

## Email Features

### 1. Project Creation Email
- Sent automatically when a project is created
- Includes: Project name, description, team members

### 2. Task Assignment Email
- Sent automatically when a task is assigned
- Includes: Project details, tasks assigned to each team member, status, due dates
- Shows warning if due date is within 3 days

### 3. All Tasks Assigned Email
- Sent automatically when ALL tasks in a project are assigned
- Includes complete summary of all tasks and assignments

## Due Date Warnings

The system calculates days from today to the due date:
- If due date is within 3 days: Shows ⚠️ WARNING message
- Example: Task assigned on 19th, due on 22nd = "⚠️ WARNING: Due date is in 3 days!"

## Testing

After configuration, test by:
1. Creating a new project
2. Adding team members
3. Creating tasks
4. Assigning tasks to team members

All emails will be sent to the address specified in `demo.email.recipient`.

