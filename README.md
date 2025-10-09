# DeWallify 🚀

A free, web-based utility that takes a plain "wall of text" and uses AI to automatically format it with Markdown for improved readability. Transform your unstructured text into beautifully formatted, document-ready content.

## Features ✨

- **AI-Powered Formatting**: Uses Google Gemini AI to intelligently structure your text
- **Markdown Output**: Clean, readable Markdown with proper headings, lists, and emphasis
- **Rich Text Copy**: Copy as both plain text (Markdown) and rich text for Word/Docs
- **Real-time Processing**: Fast formatting with streaming responses
- **No Registration**: Free to use, no login required
- **Professional Design**: Beautiful, paper-like UI with rounded buttons and pale colors

## Getting Started 🛠️

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd dewallify
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your Google Gemini API key:**
   
   Edit `.env.local` and replace `your_gemini_api_key_here` with your actual API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

   **Get your API key from:** [Google AI Studio](https://makersuite.google.com/app/apikey)

5. **Run the development server:**
   ```bash
   pnpm dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## How It Works 🧠

1. **Input**: User pastes plain text into the input textarea
2. **Processing**: Frontend sends text to `/api/format` endpoint
3. **AI Formatting**: Google Gemini AI processes the text with a detailed prompt
4. **Output**: Formatted Markdown is returned and rendered with syntax highlighting
5. **Copy**: Users can copy both plain Markdown and rich HTML for pasting into documents

## Tech Stack 💻

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/ui components
- **AI**: Google Gemini (gemini-1.5-flash)
- **UI Components**: Radix UI primitives
- **Notifications**: Sonner (toast notifications)
- **Markdown**: react-markdown for rendering
- **Icons**: Lucide React

## API Endpoints 📡

### POST /api/format

Formats plain text using Google Gemini AI.

**Request Body:**
```json
{
  "text": "Your unformatted text here..."
}
```

**Response:**
```json
{
  "formatted": "# Formatted Text\n\nYour formatted markdown..."
}
```

## Environment Variables 🔐

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `NEXT_PUBLIC_APP_URL` | Application URL | No | `http://localhost:3000` |

## Styling & Design 🎨

The application features a unique "paper-like" design with:
- Warm, papery background gradients
- Rounded buttons and components  
- Pale, colorful palette (no pure black/white)
- Hand-drawn style icons using Lucide React
- Soft shadows and backdrop blur effects

### Color Palette
- **Paper Cream**: `#FAF7F0`
- **Warm Taupe**: `#6B5B4F` 
- **Soft Coral**: `#FFB4A2`
- **Pale Mint**: `#B5EAD7`
- **Soft Lavender**: `#E0BBE4`

## Development 👩‍💻

### Project Structure
```
dewallify/
├── src/
│   ├── app/
│   │   ├── api/format/route.ts    # Gemini AI API endpoint
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout with toast
│   │   └── page.tsx               # Main formatter page
│   ├── components/
│   │   └── ui/                    # Shadcn/ui components
│   └── lib/
│       └── utils.ts               # Utility functions
├── .env.example                   # Environment template
├── .env.local                     # Local environment (gitignored)
└── package.json
```

### Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting 🔧

### Common Issues

**"API key not configured" error:**
- Make sure you've set `GEMINI_API_KEY` in your `.env.local` file
- Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Make sure you're using Node.js 18 or higher

**Styling issues:**
- The app uses Tailwind CSS v4 - make sure you're not mixing v3 classes
- Custom CSS variables are defined in `globals.css`

## Support 💬

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) section
2. Create a new issue with detailed description
3. Include your environment details and error messages

---

Made with ❤️ using Next.js and Google Gemini AI