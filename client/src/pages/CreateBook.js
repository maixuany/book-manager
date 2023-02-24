import { useState } from "react";
import Editor from "../Editor";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function CreateBook() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);

  async function createNewBook(ev) {
    const data = new FormData();
    data.set("name", name);
    data.set("author", author);
    data.set("intro", content);
    data.set("pdf", files[0]);
    ev.preventDefault();
    const response = await fetch("http://localhost:3000/api/v1/book", {
      method: "POST",
      body: data,
      credentials: "include",
      headers: { Authorization: "Bearer " + Cookies.get("token") },
    });
    if (response.status === 201) {
      setRedirect(true);
    } else if (response.status === 403 || response.status === 401) {
      alert("Please Login");
      setRedirectLogin(true);
    } else {
      alert("File Error");
    }
  }

  if (redirectLogin) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={createNewBook}>
      <input
        type="title"
        placeholder={"Name Book"}
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Author"}
        value={author}
        onChange={(ev) => setAuthor(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}>Create book</button>
    </form>
  );
}
