# Employee Management System (EMS) - Design Document

## 1. Introduction

### 1.1 Purpose
The Employee Management System (EMS) is a full-stack web application designed to manage employee data efficiently. It provides a user-friendly interface for administrators to perform CRUD operations on employee records and for employees to view their own information.

### 1.2 Scope
- Employee CRUD operations (Create, Read, Update, Delete)
- Role-based access (Admin and Employee)
- Data persistence using H2 database
- Responsive web interface
- RESTful API backend

### 1.3 Assumptions
- Users have basic computer literacy
- Internet connection is available
- Java 17+ and Node.js 16+ are installed for development

## 2. System Overview

### 2.1 High-Level Architecture
The system follows a client-server architecture:
- **Frontend**: React-based single-page application
- **Backend**: Spring Boot REST API
- **Database**: H2 file-based database

### 2.2 Technology Stack
- **Backend**: Spring Boot 3.1.6, Spring Data JPA, H2 Database, Maven
- **Frontend**: React 18, Vite, Tailwind CSS, React Icons
- **Build Tools**: Maven, npm
- **Version Control**: Git

## 3. Functional Requirements

### 3.1 Admin Features
- Login/Register as Admin
- View all employees
- Add new employees
- Edit employee details
- Delete employees
- View dashboard with statistics

### 3.2 Employee Features
- Login/Register as Employee
- View personal profile
- Update own information (limited)

### 3.3 System Features
- User authentication and authorization
- Data validation
- Error handling
- Responsive design

## 4. Non-Functional Requirements

### 4.1 Performance
- Response time < 2 seconds for API calls
- Support for up to 1000 concurrent users

### 4.2 Security
- Password hashing
- Input validation
- CORS configuration
- Role-based access control

### 4.3 Usability
- Intuitive user interface
- Mobile-responsive design
- Clear error messages

## 5. Database Design

### 5.1 Entity-Relationship Diagram
```
Employee
--------
- id: Long (Primary Key)
- firstName: String
- lastName: String
- email: String (Unique)
- department: String
- salary: Double
- phone: String

Admin
-----
- id: Long (Primary Key)
- name: String
- email: String (Unique)
- username: String (Unique)
- password: String (Hashed)
- role: String (admin/employee)
```

### 5.2 Database Schema
- **Employee Table**: Stores employee information
- **Admin Table**: Stores user authentication data
- **H2 Database**: File-based, auto-server mode enabled

## 6. API Design

### 6.1 Base URL
`http://localhost:8080/api`

### 6.2 Employee Endpoints
- `GET /api/employees` - Get all employees (Admin only)
- `GET /api/employees/{id}` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### 6.3 Admin Endpoints
- `GET /api/admins` - Get all admins
- `POST /api/admins` - Register new admin
- `POST /api/admins/login` - Admin login
- `PUT /api/admins/{id}` - Update admin
- `DELETE /api/admins/{id}` - Delete admin

### 6.4 Response Format
```json
{
  "status": 200,
  "message": "Success",
  "data": { ... }
}
```

## 7. Frontend Design

### 7.1 Component Structure
```
App.jsx
├── LoginPage.jsx
├── DashboardPage.jsx
├── EmployeePage.jsx
├── EmployeeDashboard.jsx
└── components/
    ├── Sidebar.jsx
    ├── EmployeeTable.jsx
    ├── EmployeeModal.jsx
    ├── Toast.jsx
    └── Spinner.jsx
```

### 7.2 Key Components
- **LoginPage**: Authentication interface
- **EmployeeTable**: Data grid for employees
- **EmployeeModal**: Form for adding/editing employees
- **Sidebar**: Navigation menu
- **Toast**: Notification system

### 7.3 State Management
- React hooks (useState, useEffect)
- Local storage for session management
- Props drilling for component communication

## 8. Security Design

### 8.1 Authentication
- Username/password based
- Session tokens stored in localStorage
- Role-based access control

### 8.2 Authorization
- Admin role: Full access to all features
- Employee role: Limited access to own data

### 8.3 Data Protection
- Password hashing (BCrypt)
- Input sanitization
- SQL injection prevention via JPA

## 9. User Interface Design

### 9.1 Color Scheme
- Primary: Indigo (#6366f1) for Admin
- Secondary: Cyan (#0891b2) for Employee
- Background: Dark gradient
- Text: Light colors for contrast

### 9.2 Layout
- Responsive grid system
- Mobile-first approach
- Consistent spacing and typography

### 9.3 Navigation
- Sidebar for desktop
- Bottom navigation for mobile
- Role-based menu items

## 10. Deployment Architecture

### 10.1 Development Environment
- Backend: `mvn spring-boot:run` (Port 8080)
- Frontend: `npm run dev` (Port 3000)
- Database: H2 file-based

### 10.2 Production Deployment
- Backend: JAR file deployment
- Frontend: Static build served by backend or CDN
- Database: H2 or migrate to production DB (PostgreSQL/MySQL)

### 10.3 Build Process
- Backend: Maven build
- Frontend: Vite build
- Combined: Docker containerization possible

## 11. Testing Strategy

### 11.1 Unit Testing
- Backend: JUnit for service layer
- Frontend: Jest/React Testing Library

### 11.2 Integration Testing
- API endpoint testing
- Database integration tests

### 11.3 User Acceptance Testing
- Manual testing of user workflows
- Cross-browser compatibility

## 12. Maintenance and Support

### 12.1 Code Quality
- Consistent code formatting
- Documentation comments
- Version control best practices

### 12.2 Monitoring
- Application logs
- Error tracking
- Performance monitoring

### 12.3 Future Enhancements
- User profile pictures
- Advanced search and filtering
- Email notifications
- Multi-language support

## 13. Conclusion

This design document provides a comprehensive overview of the Employee Management System architecture, features, and implementation details. The system is designed to be scalable, maintainable, and user-friendly, following modern web development best practices.

---

**Document Version**: 1.0  
**Date**: April 6, 2026  
**Author**: GitHub Copilot Assistant