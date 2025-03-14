Traffic Unit System

Project Overview 🚦🚗✨

The Traffic Unit System is a web-based platform designed to streamline and digitize the processes associated with traffic-related services. This system enables users to manage their driving and car licenses efficiently while allowing administrators to oversee and approve user requests.

Features 🌟📋🚘

For Users:

User Registration: Users can register their accounts and add personal details to the system.

Driving License Management:

Apply for a driving license.

Take an online theoretical exam.

Schedule and attend a practical driving exam.

Receive a digital driving license upon approval.

Car License Management:

Apply for a car license.

Receive a date from the traffic unit to collect the license.

Track license requests and statuses.

For Admins:

Request Approval: Approve or reject user requests for driving and car licenses.

Exam Scheduling: Assign dates for practical driving exams.

License Issuance: Notify users when their licenses are ready for collection.

Manage System Users: Oversee and manage registered users and their requests.

Technology Stack 💻📦🛠️

Frontend: React.js.

Backend: Node.js with Express.

Database: PostgreSQL.

Styling: TailwindCSS.

Authentication: JSON Web Tokens (JWT).

Installation 🛠️📥📂

Clone the Repository

git clone https://github.com/Yohanna-Ayad/Traffic_Unit.git
cd traffic-unit-system

Install Dependencies

npm install

Set Up Environment Variables

Create a .env file in the root directory and configure the following variables:

DB_HOST=your-database-host
DB_PORT=your-database-port
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-jwt-secret

Run Database Migrations

npx sequelize-cli db:migrate

Start the Backend Server 🚀📡💾

cd backend
npm run dev

Access the backend server at http://localhost:8626.

Start the Frontend Server 🚀🖥️🎨

cd frontend
npm run dev

Access the frontend application at http://localhost:5173.

Usage 📑👥✅

User Workflow 👤💡📝

Register an account.

Log in to the system.

Apply for services like driving or car licenses.

Take the theoretical exam online.

Attend practical exams on the scheduled date.

Track the status of requests and receive updates.

Admin Workflow 👨‍💼📋🛡️

Log in to the admin dashboard.

View and approve/reject user requests.

Assign dates for exams or license issuance.

Notify users of updates.

Contributing 🤝🌍🛠️

We welcome contributions to enhance the Traffic Unit System. Follow these steps to contribute:

Fork the repository.

Create a new branch for your feature or bugfix:

git checkout -b feature/your-feature-name

Commit your changes:

git commit -m "Add your commit message here"

Push to your branch:

git push origin feature/your-feature-name

Create a pull request.

License 📜🖋️✅

This project is licensed under the MIT License.

Contact 📧📞🌟

For inquiries or support, don't hesitate to get in touch with eng.yohannaayad@gmail.com.
