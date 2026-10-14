import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./pages/login";
import Layout from "./components/layout";
import AuthenticatedRoute from "./components/authenticated-route";
import AllProblems from "./pages/all-problems";
import Chapters from "./pages/chapters";
import Progress from "./pages/progress";
import Calendar from "./pages/calendar";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <AllProblems />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/chapters",
    element: (
      <AuthenticatedRoute>
        <Chapters />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/progress",
    element: (
      <AuthenticatedRoute>
        <Progress />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/calendar",
    element: (
      <AuthenticatedRoute>
        <Calendar />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
}

export default App;
