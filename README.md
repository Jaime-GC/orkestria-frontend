# Orkestria Frontend

Welcome to **Orkestria**, a modern and elegant platform designed to help you manage projects, tasks, and resources efficiently. This repository contains the frontend of the Orkestria application, built using [Deno Fresh](https://fresh.deno.dev/) and styled with **Tailwind CSS**.

---

## 🌟 Features

- **Neumorphic Design**: A visually appealing and modern UI with a consistent neumorphic style.
- **Kanban Board**: Drag-and-drop functionality to manage tasks across different statuses.
- **Dynamic Sidebar**: A responsive and interactive sidebar for seamless navigation.
- **CRUD Operations**: Create, edit, and delete users, projects, categories, and more.
- **Data Visualization**: Interactive charts and reports for tracking income, expenses, and other metrics.
- **Custom Scrollbars**: Aesthetic and functional scrollbars for a better user experience.

---

## 🚀 Getting Started

### Prerequisites

- **Deno**: Install Deno by following the [official guide](https://deno.land/manual/getting_started/installation).
- **Node.js** (optional): For managing frontend dependencies like Tailwind CSS.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jaime-GC/orkestria-frontend.git
   cd orkestria-frontend
   ```

2. Install dependencies:
   ```bash
   deno task start
   ```

3. Start the development server:
   ```bash
   deno task start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

---

## 🛠️ Project Structure

```
orkestria-frontend/
├── components/       # Reusable UI components (e.g., buttons, cards, icons)
├── islands/          # Interactive components with client-side interactivity
├── routes/           # Application routes (pages)
├── static/           # Static assets (e.g., styles, images)
├── tailwind.config.ts # Tailwind CSS configuration
├── dev.ts            # Development server entry point
├── main.ts           # Application entry point
└── README.md         # Project documentation
```

---

## 🎨 Design Highlights

- **Color Palette**:
  - Primary: `#001f3f` (Navy Blue)
  - Secondary: Shades of gray for backgrounds and accents.
- **Typography**:
  - Font: [Inter](https://fonts.google.com/specimen/Inter) for a clean and modern look.
- **Neumorphism**:
  - Shadows and highlights to create a soft, 3D-like interface.

---

## 📂 Key Features by Route

### `/`
- Welcome page with a gradient animation and a footer.

### `/projects`
- List of projects with neumorphic cards.
- Hover effects for interactivity.

### `/users`
- User management with modals for creating, editing, and deleting users.

### `/reports`
- Interactive charts for visualizing income and expenses.

### `/kanban`
- Drag-and-drop Kanban board for task management.

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

## 📸 Screenshots

### Dashboard
![Dashboard Screenshot](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Kanban Board
![Kanban Screenshot](https://via.placeholder.com/800x400?text=Kanban+Screenshot)

---

## 🌐 Links

- **Live Demo**: [Orkestria](https://orkestria.example.com)
- **Backend Repository**: [Orkestria Backend](https://github.com/Jaime-GC/orkestria-backend)
- **Documentation**: [Orkestria Docs](https://orkestria-docs.example.com)

---

Thank you for using **Orkestria**! 🎉
