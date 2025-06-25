# Real-Time Traffic Navigation Simulator

**Live Demo**: [https://route-finder-ten.vercel.app/](https://route-finder-ten.vercel.app/)


**Video**:

https://github.com/user-attachments/assets/6aebac0e-7006-4536-ad54-8c6dd9818194



---

This project is a web-based traffic navigation simulator that visualizes how real-time traffic conditions affect route planning in a city. It provides an interactive map where users can find the fastest route between two points, taking into account dynamic traffic, road types, and vehicle constraints.

## Key Features

- **Interactive Map**: A dynamic, SVG-based map displays a network of cities and roads.
- **Real-Time Traffic**: Traffic conditions are simulated on the backend and update automatically every few seconds.
- **Smart Pathfinding**: The simulator uses Dijkstra's algorithm to find the optimal route based on current travel times.
- **Vehicle Constraints**: The routing algorithm accounts for different vehicle types (e.g., trucks avoid narrow roads).
- **Live Updates**: Toggle on live updates to see the recommended route change automatically as traffic conditions fluctuate.
- **Route Information**: Displays the total estimated travel time and physical distance for the calculated path.

## Technical Implementation

- **Frontend**: Built with [Next.js](https://nextjs.org) (App Router) and [React](https://react.dev/).
- **UI**: Styled with [Tailwind CSS](https://tailwindcss.com/) and uses [ShadCN UI](https://ui.shadcn.com/) components.
- **Backend**: The graph data structure and traffic simulation logic are managed in-memory on the server-side using TypeScript.
- **API**: Next.js API routes handle requests for graph data, pathfinding, and traffic updates.
- **Pathfinding**: The core routing logic is powered by a custom implementation of **Dijkstra's algorithm** on a weighted graph.

## Getting Started

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the simulator in action.
