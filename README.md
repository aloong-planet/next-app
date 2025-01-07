# Next.js Modern Application

A modern web application built with Next.js 14, featuring a clean project structure and optimized performance.

## 🚀 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Font System:** Next/Font with Geist
- **Development Tools:**
  - ESLint for code linting
  - PostCSS for CSS processing
  - Modern module bundling with Next.js

## ✨ Features

### App Router Architecture
- **App Directory Structure** (`src/app/`)
  - Modern file-system based routing
  - Nested layouts with `layout.tsx`
  - Server-first component approach
  - Automatic route segments creation

### Performance Optimizations
- **Server Components by Default**
  - Reduced client-side JavaScript
  - Improved initial page load
  - Better SEO performance
- **Automatic Font Optimization**
  - Custom Geist font integration
  - Zero layout shift with font preloading
  - Variable font support for optimal loading

### Development Features
- **Enhanced Developer Experience**
  - Fast Refresh enabled for quick development
  - TypeScript integration with strict type checking
  - ESLint configuration for code quality
  - Tailwind CSS with PostCSS processing

### Built-in Optimizations
- **Image Optimization**
  - Automatic image optimization with next/image
  - WebP format support
  - Lazy loading by default
- **CSS/Styling Features**
  - Tailwind CSS integration
  - Global styles in `globals.css`
  - CSS Modules support
  - PostCSS processing pipeline

### Security & Performance
- **Automatic Security Headers**
  - Built-in XSS protection
  - Strict Content Security Policy
- **Static and Dynamic Rendering**
  - Automatic static optimization
  - Dynamic rendering when needed
  - Edge runtime support

### Development Tooling
- **Modern Development Stack**
  - Hot Module Replacement
  - Error reporting with source maps
  - Development mode debugging
  - TypeScript error checking in real-time

## 🛠️ Project Structure

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── chat/              # Chat API endpoints
│   │   ├── debug/             # Debug endpoints
│   │   ├── infos/             # Information endpoints
│   │   └── test-openai/       # OpenAI test endpoints
│   │
│   ├── chat/                  # Chat Feature
│   │   ├── [id]/              # Dynamic chat routes
│   │   ├── components/        # Chat-specific components
│   │   ├── error.tsx         # Error handling
│   │   ├── layout.tsx        # Chat layout
│   │   └── page.tsx          # Main chat page
│   │
│   ├── infos/                # Information Pages
│   │   ├── components/       # Info components
│   │   │   ├── CurrencySelect.tsx
│   │   │   └── ExchangeRateWidget.tsx
│   │   └── page.tsx
│   │
│   ├── news/                 # News Feature
│   │   ├── components/       # News components
│   │   └── page.tsx         # News page
│   │
│   ├── payments/            # Payments Feature
│   │   ├── columns.tsx      # Table columns definition
│   │   ├── data-table.tsx   # Table component
│   │   └── page.tsx         # Payments page
│   │
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
│
├── components/              # Shared components
├── lib/                    # Utility functions and libraries
├── stores/                 # State management
└── fonts/                  # Custom font assets
```

### Key Features

#### 1. Chat System
- Real-time chat functionality with OpenAI integration
- Dynamic chat routing with conversation history
- Error handling and fallback UI

#### 2. Information Widgets
- Exchange Rate Widget with real-time currency conversion
- Currency selection with support for multiple currencies
- Auto-refresh functionality and error handling

#### 3. News Aggregator
- Integration with Hacker News API
- Real-time news search and filtering
- Preset topic selections (Rust, LLM, eBPF)

#### 4. Payment Management
- Advanced data table with sorting and filtering
- Column visibility toggle
- Pagination and row selection
- Action buttons for each payment entry

#### 5. Core Features
- **Responsive Layout**
  - Collapsible sidebar navigation
  - Breadcrumb navigation
  - Theme switching support
- **API Integration**
  - OpenAI API integration
  - Exchange rate API
  - News API endpoints
- **UI Components**
  - Custom table components
  - Form elements
  - Modal dialogs
  - Loading states

### Technology Implementation

#### Frontend
- Next.js App Router for routing
- React Server Components
- Client-side state management
- Custom hooks and utilities

#### Styling
- Tailwind CSS for styling
- Custom Geist font integration
- Dark mode support
- Responsive design

#### Data Management
- API route handlers
- Error boundaries
- Loading states
- Data caching

## 🚦 Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd <project-name>
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Start the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🔧 Development Mode

During development:
- Hot reloading is enabled by default
- Changes to `src/app` directory will be immediately reflected
- TypeScript errors are shown in real-time
- Tailwind CSS classes are compiled on-demand

## 📝 Environment Setup

Make sure you have:
- Node.js 18.17 or later installed
- A code editor with TypeScript support
- Git for version control

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
