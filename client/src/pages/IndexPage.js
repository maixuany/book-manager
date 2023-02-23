import { useEffect, useState } from "react";
import Book from "../Book";

export default function IndexPage() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/v1/book").then((response) => {
      response.json().then((payload) => {
        setBooks(payload.data);
      });
    });
  }, []);
  return <>{books.length > 0 && books.map((book) => <Book {...book} />)}</>;
}
