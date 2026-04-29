# 🎬 CineTube Client

CineTube is a premium movie and video streaming platform built with modern web technologies. This repository contains the frontend application built with Next.js 15+ (React 19).

## ✨ Features

- **Responsive Design**: Mobile-first, premium UI/UX.
- **Dynamic Content**: Powered by TanStack Query for efficient data fetching.
- **Advanced Forms**: Robust form management with TanStack Form and Zod validation.
- **Data Tables**: Powerful data grids using TanStack Table.
- **Visualizations**: Interactive charts and data representation with Recharts.
- **Smooth Animations**: High-performance transitions and micro-interactions using Framer Motion (`motion`).
- **Modern Styling**: Built with Tailwind CSS 4 and Shadcn UI components.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Runtime**: [Bun](https://bun.sh/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [TanStack Form](https://tanstack.com/form) & [Zod](https://zod.dev/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Motion](https://motion.dev/)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   bun install
   ```

### Environment Variables

Create a `.env` file in the root of the client directory and add your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
# Add other necessary environment variables
```

### Development

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Build

Build the application for production:

```bash
bun build
```

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks.
- `src/lib`: Utility functions and shared logic.
- `src/services`: API service layers.
- `src/types`: TypeScript definitions.

---
Built with ❤️ for CineTube.
