import { useEffect, useState } from "react";
import { Admin, Resource } from "react-admin";
import BookList from "./components/book/books";
import jsonServerProvider from "ra-data-json-server";

function App() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/v1/book")
      .then((response) => response.json())
      .then((payload) => setBooks(payload.data))
      .catch((error) => console.log(error.message));
  }, []);
  return (
    <Admin>
      <Resource name="books" list={BookList} data={books} />
    </Admin>
  );
}

export default App;
