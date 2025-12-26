# Automata Made Easy

A web-based visual tool for designing, visualizing, and testing Deterministic Finite Automata (DFA). Create interactive finite automata with drag-and-drop interface, test input strings, and visualize state transitions.

## Project Context

**Automata Made Easy** is a visualization helper tool designed to make working with Deterministic Finite Automata (DFA) more intuitive and accessible. This application serves as an educational and practical resource for:

- **Students and Educators**: Visualize DFA concepts, state transitions, and automata behavior through interactive diagrams
- **Developers**: Quickly prototype and test finite automata for pattern matching, lexical analysis, or compiler design
- **Researchers**: Experiment with different DFA configurations and validate automata designs

The tool generates **visual diagrams** that represent DFAs as interactive graphs, where:
- **States** are displayed as circles/nodes
- **Transitions** are shown as directed edges labeled with input symbols
- **Final/Accepting states** are visually distinguished (typically with double circles)
- **Start state** is clearly marked for easy identification

By providing an intuitive drag-and-drop interface, users can create complex automata diagrams without needing to manually draw or code them, making it an essential helper tool for anyone working with finite automata theory and applications.

## Features

- **Interactive DFA Diagrams**: Generate beautiful, interactive state diagrams with SVG graphics that visualize your automata structure
- **Visual DFA Designer**: Drag-and-drop interface for creating finite automata diagrams without manual drawing
- **State Management**: Add and remove states with custom names, displayed as nodes in the diagram
- **Symbol Management**: Define input alphabet symbols that appear as labels on transitions
- **Transition Creation**: Drag symbols between states to create transitions, automatically drawn as directed edges in the diagram
- **Start State**: Default "Start" state configuration, clearly marked in the visualization
- **Final States**: Double-click states to mark them as final/accepting states (visually distinguished in the diagram)
- **Input Testing**: Test input strings against your DFA to check acceptance and see the execution flow
- **JSON Support**: Import/export DFA definitions via JSON for easy sharing and persistence
- **Real-time Visualization**: See your automata diagram update instantly as you make changes using Raphael.js SVG rendering

## Tech Stack

- **Backend**: Node.js with Express.js
- **Template Engine**: Jade/Pug
- **Frontend**: Vanilla JavaScript
- **Graphics**: Raphael.js for SVG rendering
- **UI Framework**: Bootstrap
- **Testing**: Mocha and Chai
- **Security**: Helmet.js, Express Rate Limiting

## Installation

### Prerequisites

- Node.js (v12 or higher recommended)
- npm (Node Package Manager)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/digvijay19/automata-made-easy.git
   ```

2. Navigate to the project directory:

   ```bash
   cd automata-made-easy
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the Application

Start the development server:

```bash
npm start
```

The server will start on port 3000 (or the port specified in the `PORT` environment variable).

Open your browser and navigate to:

```
http://localhost:3000/home
```

## Usage

### Visual Designer Interface (`/home`)

1. **Add Symbols**: Enter input symbols in the SYMBOLS section and click the '+' button to add them
2. **Add States**: Enter state names in the STATES section and click the '+' button (default "Start" state is provided)
3. **Create Transitions**: Drag an input symbol bubble from one state to another to create a transition
4. **Set Final States**: Double-click on any state to toggle it as a final/accepting state
5. **Test Input**: Enter an input string in the input field and click the play button to test if it's accepted by the DFA

### JSON Designer Interface (`/designer`)

1. Enter a JSON representation of your DFA in the text area
2. Click "Create DFA from JSON" to visualize the automata
3. Enter input strings in the input box and click "Check Input" to test

### Routes

- `/home` - Main visual designer interface
- `/designer` - JSON-based designer interface
- `/index` - Alternative home page with JSON input

## Project Structure

```
automata-made-easy/
├── bin/
│   └── www                 # Server entry point
├── public/
│   ├── javascripts/        # Client-side JavaScript
│   │   ├── designer.js     # Main designer logic
│   │   ├── machine.js      # DFA machine implementation
│   │   ├── state.js        # State class definition
│   │   ├── machineParser.js # JSON parser for DFA
│   │   ├── drawDfa.js      # DFA visualization
│   │   └── raphael.js      # SVG graphics library
│   └── stylesheets/        # CSS styles
├── routes/
│   ├── index.js            # Main routes
│   └── users.js            # User routes
├── test/                   # Test files
│   ├── machineTest.js
│   ├── stateTest.js
│   └── designerTest.js
├── views/                  # Jade/Pug templates
│   ├── home.jade           # Main designer view
│   ├── designer.jade       # JSON designer view
│   └── layout.jade         # Base layout
├── app.js                  # Express application setup
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Testing

The project includes test suites using Mocha and Chai. Run tests using:

```bash
npm test
```

Or open `runTest.html` in a browser for browser-based testing.

## Security Features

- **Helmet.js**: Security headers and Content Security Policy
- **Rate Limiting**: Protection against brute force attacks (100 requests per 15 minutes per IP)
- **Input Sanitization**: XSS prevention and input validation
- **Body Size Limits**: Protection against DoS attacks (10MB limit)

## Development

The application uses `nodemon` for automatic server restart during development. The server will automatically reload when you make changes to the code.

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
