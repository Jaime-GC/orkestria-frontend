# Orkestria Frontend

Welcome to **Orkestria**, a modern and elegant platform designed to help you manage projects, tasks, and resources efficiently. This repository contains the frontend of the Orkestria application, built using [Deno Fresh](https://fresh.deno.dev/) and styled with **Tailwind CSS**.

---

## 🌟 Features

- **Neumorphic Design**: A modern and visually appealing interface with a consistent neumorphic style.
- **Kanban Board**: Drag-and-drop functionality to manage tasks across different statuses.
- **Dynamic Sidebar**: A responsive and interactive sidebar for seamless navigation.
- **CRUD Operations**: Create, edit, and delete users, projects, tasks, and more.
- **Resource Management**: Administration of inventory, schedules, and resource reservations.
- **User Assignment**: Flexibly assign and unassign users to tasks.
- **Notifications**: Integrated notification system for events and reminders.

---

## 🚀 Getting Started

### Prerequisites

- **Deno**: Install Deno by following the [official guide](https://deno.land/manual/getting_started/installation).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jaime-GC/orkestria-frontend.git
   cd orkestria-frontend
   ```

2. Start the development server:
   ```bash
   deno task start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

## 🛠️ Project Structure

```
orkestria-frontend/
├── components/       # Reusable UI components (buttons, cards, icons)
├── islands/          # Interactive components with client-side interactivity
├── routes/           # Application routes (pages)
├── static/           # Static assets (styles, images)
├── hooks/            # Custom Preact hooks
├── lib/              # Utilities and API configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── dev.ts            # Development server entry point
├── main.ts           # Application entry point
└── README.md         # Project documentation
```

---

## 🎨 Design Highlights

- **Color Palette**:
  - Primary: `#001f3f` (Navy Blue)
  - Secondary: Gray tones for backgrounds and accents.
- **Typography**:
  - Font: System default for a clean and modern appearance.
- **Neumorphism**:
  - Shadows and highlights to create a soft 3D-like interface.

---

## 📂 Key Features by Route

### `/`
- Welcome page with main navigation.

### `/projects`
- List of projects with neumorphic cards.
- Detailed project view with integrated Kanban board.

### `/tasks`
- Complete task management with user assignment.
- List view with filters and editing options.

### `/users`
- User management with modals for creating, editing, and deleting.

### `/resources`
- **Inventory**: Management of resources organized in groups.
- **Schedules**: Programming of events and activities.
- **Reservations**: Reservation system with integrated calendar.

### `/notifications`
- Notification center for events and reminders.

---

## 🧑‍💻 Development

### Scripts

- **Start Development Server**:
  ```bash
  deno task start
  ```

- **Build for Production**:
  ```bash
  deno task build
  ```

- **Lint and Format Code**:
  ```bash
  deno task check
  ```

---

## 🌐 Links

- **Backend Repository**: [Orkestria Backend](https://github.com/Jaime-GC/orkestria-backend)

---

Thank you for using **Orkestria**! 🎉
