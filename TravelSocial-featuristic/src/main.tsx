
import { createRoot } from "react-dom/client";
import { PostsProvider } from "./contexts/PostsContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <PostsProvider>
    <App />
  </PostsProvider>
);