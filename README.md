# Flashcard iOS Web

This project is a fun flashcard-like web application designed for asking relationship questions. It is optimized for viewing on iPhone devices, providing an engaging and interactive experience.

## Features

- **Flashcard Experience**: Users can navigate through various categories of relationship questions presented in a flashcard format.
- **Responsive Design**: The application is designed to be visually appealing and functional on mobile devices, particularly iPhones.
- **Dynamic Question Loading**: Questions are loaded from a JSON file, allowing for easy updates and modifications to the content.

## Project Structure

```
flashcard-ios-web
├── public
│   └── manifest.json          # Web app manifest for metadata
├── src
│   ├── index.html             # Main HTML document
│   ├── main.ts                # Main TypeScript file
│   ├── styles
│   │   └── main.css           # CSS styles for the application
│   ├── components
│   │   ├── Flashcard.ts       # Flashcard component
│   │   └── Controls.ts        # UI controls component
│   ├── data
│   │   └── relationship_questions.json # JSON data with questions
│   └── types
│       └── index.d.ts         # Type definitions for TypeScript
├── package.json                # npm configuration file
├── tsconfig.json              # TypeScript configuration file
├── vite.config.ts             # Vite configuration file
├── .gitignore                  # Git ignore file
└── README.md                   # Project documentation
```

## Setup Instructions

1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd flashcard-ios-web
   ```

2. **Install Dependencies**: 
   ```
   npm install
   ```

3. **Run the Application**: 
   ```
   npm run dev
   ```

4. **Open in Browser**: Navigate to `http://localhost:3000` to view the application.

## Usage

- Navigate through the flashcards to explore different categories of relationship questions.
- Use the controls to flip through questions and interact with the content.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.