# 🛠️ Developer Tools

A modern, responsive web application built with Next.js that provides essential developer utilities in one convenient location. Features a clean interface with dark/light theme support and intuitive search functionality.

## ✨ Features

- **�️ Essential Developer Tools** - A growing collection of commonly used utilities including encoding/decoding, hashing, and security tools
- **🎨 Dark/Light Theme Support** - Toggle between themes with system preference detection
- **🔍 Quick Search** - Fast tool search with keyboard shortcuts (⌘K / Ctrl+K)
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **⚡ Fast Performance** - Built with Next.js 15 and Turbopack for optimal speed

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jobacx/dev-tools.git
cd dev-tools
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
# or 
yarn install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

### Stacks
- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - User interface library
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com)** - Accessible component primitives
- **[Lucide React](https://lucide.dev)** - Beautiful icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme switching

### Development Tools
- **[ESLint](https://eslint.org)** - Code linting
- **[PostCSS](https://postcss.org)** - CSS processing
- **[Turbopack](https://turbo.build/pack)** - Fast bundler and dev server

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── api/               # API routes
│   │   ├── bcrypt/        # Bcrypt endpoints
│   │   └── jwt/           # JWT endpoints
│   └── tools/             # Tool pages
│       ├── layout.tsx     # Tools layout
│       ├── base64/        # Base64 tool
│       ├── bcrypt/        # Bcrypt tool
│       └── jwt/           # JWT tool
├── components/            # Reusable components
│   ├── ui/                # UI component library
│   ├── theme-provider.tsx # Theme context
│   └── theme-toggle.tsx   # Theme switcher
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript definitions
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server  
- `pnpm lint` - Run ESLint

## AI Prompts for Generating New Feature
```
please create a new feature tools in this project.

name:

requirements:
- include analyzing of existing tools for design ui pattern
- adding of new config in @tools-config.ts

functionalities: 
- 
```

## 🎯 Roadmap

Future tools and features planned:

- [x] **URL Encoder/Decoder** - Encode and decode URLs and query parameters
- [x] **Color Converter** - Convert between different color formats (HEX, RGB, HSL, etc.)
- [ ] **JSON Formatter/Validator** - Format, validate, and minify JSON
- [x] **Hash Generator** - Generate MD5, SHA1, SHA256, and other hashes
- [x] **QR Code Generator** - Create QR codes for text, URLs, and data
- [ ] **Regular Expression Tester** - Test and debug regex patterns
- [ ] **SQL Formatter** - Format and beautify SQL queries
- [ ] **XML/HTML Formatter** - Format and validate XML/HTML
- [x] **Timestamp Converter** - Convert between different timestamp formats
- [x] **Lorem Ipsum Generator** - Generate placeholder text
- [x] **Markdown Preview** - 

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) team for the amazing framework
- [Shadcn UI](https://ui.shadcn.com) for components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [Lucide](https://lucide.dev) for beautiful icons

---

<div align="center">

**[🌐 Visit Live Demo](https://dev-tools-jbacule.vercel.app)** | **[📝 Report Bug](https://github.com/jobacx/dev-tools/issues)** | **[✨ Request Feature](https://github.com/jobacx/dev-tools/issues)**

Made with ❤️ by [jobacx](https://github.com/jobacx)

</div>
