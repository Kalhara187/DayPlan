# DayPlan - Daily Planning Application

A modern, responsive daily planning application built with React, Vite, and Tailwind CSS. Features a beautiful dark/light theme toggle and authentication pages.

## Features

- ✨ Modern and clean UI design
- 🌓 Dark/Light theme toggle with persistent storage
- 🔐 Sign In and Sign Up pages
- 📱 Fully responsive design
- 🎨 Tailwind CSS for styling
- ⚡ Fast development with Vite
- 🔄 Smooth transitions and animations

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Context API

## Project Structure
frontend/
├── src/
│ ├── components/
│ │ └── Themetoggle.jsx # Theme toggle button component
│ ├── context/
│ │ └── ThemeContext.jsx # Theme context provider
│ ├── pages/
│ │ ├── Signin.jsx # Sign in page
│ │ └── Signup.jsx # Sign up page
│ ├── App.jsx # Main app component with routing
│ ├── main.jsx # Application entry point
│ └── index.css # Global styles
├── public/ # Static assets
├── index.html # HTML template
├── package.json # Dependencies
├── tailwind.config.js # Tailwind configuration
├── vite.config.js # Vite configuration
└── postcss.config.js # PostCSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DayPlan
