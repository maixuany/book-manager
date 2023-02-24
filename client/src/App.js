import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreateBook from "./pages/CreateBook";
import EditBook from "./pages/EditBook";
import BookPage from "./pages/BookPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path={"/login"} element={<LoginPage />} />
          <Route path={"/register"} element={<RegisterPage />} />
          <Route path="/create" element={<CreateBook />} />
          <Route path="/post/:id" element={<BookPage />} />
          <Route path="/edit/:id" element={<EditBook />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
