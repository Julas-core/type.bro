# Type.bro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)

A clone of the popular typing test website [monkeytype](https://monkeytype.com/), built with React, TypeScript, and Tailwind CSS. Test your typing speed, accuracy, and consistency with a sleek, highly customizable, hacker-themed interface.

![Screenshot of Type.bro](https://via.placeholder.com/800x450.png?text=Type.bro+Screenshot)
*(Screenshot placeholder)*

## Features

- **Multiple Test Modes**: Practice with different challenges.
  - `time`: Type as many words as you can in a given time.
  - `words`: Type a specific number of words.
  - `quote`: Type a famous quote fetched from the Gemini API.
  - `zen`: An endless mode for relaxed practice.
- **Real-time Feedback**: Instant WPM, accuracy, and character statistics.
- **Detailed Results**: After each test, view a beautiful graph of your WPM and accuracy over time, including mistake tracking.
- **Local Leaderboard**: Compete against your own best scores for different test configurations.
- **Deep Customization**: Tailor the experience to your liking in the extensive settings menu.
  - **Appearance**:a Dozens of themes, multiple font families, and adjustable font size.
  - **Behavior**: Adjust test difficulty, enable blind mode, or set a quick restart key.
  - **Sound**: Keyboard click and error sounds with volume control.
  - **Caret Style**: Customize the look and feel of your cursor.
- **Pace Cursor**: Race against your own average, best, or a custom WPM goal.
- **Multi-language Support**: Test your skills in various languages and even programming languages.
- **Gemini API Integration**: Generates unique quotes for the "quote" test mode.

## Tech Stack

- **Frontend**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google Gemini API](https://ai.google.dev/) for quote generation.
- **Charts**: [Recharts](https://recharts.org/) for visualizing test results.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need a modern web browser and a way to serve the files locally. A simple way is to use a code editor extension like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code.

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your-username/type.bro.git
    cd type.bro
    ```

2.  **Run the application**
    - Open the project folder in your code editor.
    - Right-click on `index.html` and choose "Open with Live Server" (or your equivalent).

The app should now be running in your browser!

### Configuration (For Gemini API)

The "quote" typing mode uses the Google Gemini API to generate unique quotes. For this feature to work, the application requires a Google Gemini API key.

- The application is designed to read the API key from an environment variable: `process.env.API_KEY`.
- In the current simple setup (serving static HTML), this environment variable will not be available, and the quote feature will gracefully fall back to a default placeholder text.
- To enable the Gemini API functionality during local development, you would need to use a build tool like [Vite](https://vitejs.dev/) or [Create React App](https://create-react-app.dev/) which can manage and inject environment variables into the application.

## Project Structure

The project follows a standard React component-based architecture.

```
/
├── src/
│   ├── components/     # Reusable React components
│   ├── contexts/       # React context for global state (e.g., Settings)
│   ├── services/       # Modules for interacting with external APIs (Gemini)
│   ├── App.tsx         # Main application component
│   ├── constants.ts    # Shared constants (e.g., word lists)
│   ├── index.tsx       # Entry point for the React application
│   ├── languages.ts    # List of supported languages
│   ├── themes.ts       # Theme definitions
│   ├── types.ts        # TypeScript type definitions
│   └── words.ts        # Word lists for different languages
├── index.html          # The main HTML file
├── metadata.json       # Project metadata
└── README.md           # You are here!
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License.

## Acknowledgements

- Inspired by the fantastic [monkeytype](https://monkeytype.com/).
- Icons from [Feather Icons](https://feathericons.com/).
- Fonts from [Google Fonts](https://fonts.google.com/).
