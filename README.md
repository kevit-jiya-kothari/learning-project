# OutreachHub

OutreachHub is a multi-tenant SaaS platform that helps businesses manage contacts, message templates, and targeted campaigns.

## Features

### Admin Portal
- Admin authentication
- Create, view, update, and delete business workspaces
- Manage workspace users

### OutreachHub Portal
- Workspace-based access
- Editor and Viewer roles
- Contact management with tags
- Message template management
- Text and Text & Image templates
- Campaign creation and management
- Campaign launch simulation
- Per-contact campaign message storage
- Live campaign status using polling
- Campaign copying
- Workspace analytics and dashboards

### Multi-Tenant Support
Users can belong to multiple workspaces and switch between their available workspaces from the OutreachHub portal.

## Tech Stack

- Frontend: Angular.js
- Backend: Node.js / Express.js
- Database: MongoDB
- Authentication: JWT
- Charts: Chart.js / Recharts
- Version Control: Git & GitHub

## Project Structure

```text
OutreachHub/
├── frontend/
├── backend/
├── README.md
└── .gitignore