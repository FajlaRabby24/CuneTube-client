# 🎬 CineTube - Premium Movie Platform & Developer Portfolio

CineTube is a cinematic, state-of-the-art movie and video streaming application designed to deliver a high-end visual experience. It acts as both a feature-rich streaming/review hub and a developer showcase site. Movie enthusiasts can seamlessly explore films, write ratings and reviews, curate personal watchlists, and subscribe to premium access tiers.

---

## ✨ Key Features

- **Cinematic Dark Mode UI**: A glowing, glassmorphic layout optimized for movies, featuring interactive hovering cards and premium layouts.
- **Search & Dynamic Discovery**: Instantly query films using robust keyword search, pricing types (Free vs. Premium), genres, and tag filters.
- **Interactive Ratings & Reviews**: Add user scores and detailed feedback card blocks equipped with animated glow borders.
- **Stripe Premium Subscriptions**: Safe, end-to-end payment integration to unlock monthly/yearly premium tiers.
- **Unified Admin Dashboard**: Secure panel restricted to administrator roles to manage tags, content catalog, user profiles, stripe payments, notifications, reports, and contact inquiries.
- **Responsive Bento Developer Portfolio**: Built-in "About Me" bento showcase highlighting skills, tools, and background details in a balanced 12-column grid.
- **Contact Message Logs**: Integrated client-to-server contact forms validation powered by Prisma database storage.

---

## 🛠️ Tech Stack

| Category               | Technology Used                                                                  | Description                                          |
| :--------------------- | :------------------------------------------------------------------------------- | :--------------------------------------------------- |
| **Frontend Framework** | [Next.js 15+](https://nextjs.org/) (App Router)                                  | High-performance React framework.                    |
| **Backend API**        | [Express.js](https://expressjs.com/)                                             | Robust server handling routing and business logic.   |
| **Database ORM**       | [Prisma](https://www.prisma.io/)                                                 | Modern database toolkit for PostgreSQL querying.     |
| **Cloud Database**     | [Neon Postgres](https://neon.tech/)                                              | Fully managed serverless Postgres database.          |
| **Authentication**     | [Better Auth](https://www.better-auth.com/)                                      | Secure developer-friendly user auth.                 |
| **Payments**           | [Stripe](https://stripe.com/)                                                    | Real-time subscription payments processing.          |
| **Image Upload**       | [Cloudinary](https://cloudinary.com/)                                            | Asset hosting and content delivery.                  |
| **Styling**            | [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) | Custom CSS tokens, layouts, and prebuilt components. |
| **Animations**         | [Framer Motion](https://motion.dev/)                                             | Smooth fluid transitions and mouse-tracking glows.   |
| **Runtime & Bundler**  | [Bun](https://bun.sh/)                                                           | Fast, all-in-one JavaScript runtime tool.            |

---

## 🚀 Local Installation

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed:

```bash
# Verify bun installation
bun --version
```

### Setup Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/FajlaRabby24/CineTube-client.git
   cd CineTube
   ```

2. **Setup the Server**:

   ```bash
   cd server
   bun install
   # Run prisma migrations to sync databases
   bunx prisma db push
   # Start the development server
   bun dev
   ```

3. **Setup the Client**:
   ```bash
   cd ../client
   bun install
   # Start Next.js development server
   bun dev
   ```

---

## ⚙️ Environment Configurations

Create a `.env` file in the root of the respective directories.

### Backend Server (`/server/.env`)

```env
NODE_ENV="development"
PORT="5000"
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=verify-full"
FRONTEND_URL="http://localhost:3000"

# Authentication Secrets
BETTER_AUTH_URL="http://localhost:5000"
BETTER_AUTH_SECRET="your-better-auth-secret-key"
ACCESS_TOKEN_SECRET="your-access-token-jwt-secret"
REFRESH_TOKEN_SECRET="your-refresh-token-jwt-secret"

# Stripe Keys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_MONTLY_PRODUCT_ID="price_..."
STRIPE_YEARLY_PRODUCT_ID="price_..."

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# Email SMTP (Gmail App Password)
EMAIL_SENDER_SMTP_USER="your-email@gmail.com"
EMAIL_SENDER_SMTP_PASS="your-gmail-app-password"
EMAIL_SENDER_SMTP_HOST="smtp.gmail.com"
EMAIL_SENDER_SMTP_PORT="465"
```

### Client Frontend (`/client/.env`)

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api/v1"
JWT_ACCESS_SECRET="your-access-token-jwt-secret"

# Cloudinary Assets
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-preset-name"
```

---

## 🖼️ User Interface Screenshot

Here is a preview of the CineTube application landing page:

![CineTube Homepage Screenshot](./public/screenshot.png)

---

## 👋 Greeting & Thanks

Thank you for exploring CineTube! I hope this project showcases my skills in modern full-stack web engineering, database relations, secure gateway payments, and responsive UX design. If you have any feedback or inquiries, feel free to submit them through the contact panel or drop by!

Happy Watching! 🍿  
**Fajla Rabby**  
_Full Stack Web Developer_
