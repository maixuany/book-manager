import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditBook() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/book/" + id).then((response) => {
      response.json().then((info) => {
        setName(info.data.name);
        setAuthor(info.data.by_user.fullname);
        setContent(info.data.intro);
      });
    });
  }, []);

  async function updateBook(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("name", name);
    data.set("author", author);
    data.set("intro", content);
    if (files?.[0]) {
      data.set("pdf", files?.[0]);
    }
    const response = await fetch("http://localhost:3000/api/v1/book/" + id, {
      method: "PUT",
      body: data,
      credentials: "include",
      headers: { Authorization: "Bearer " + Cookies.get("token") },
    });
    if (response.status === 200) {
      setRedirect(true);
    } else if (response.status === 403 || response.status === 401) {
      alert("Access Denied");
    } else {
      alert("File Error");
    }
  }

  if (redirect) {
    return <Navigate to={"/book/" + id} />;
  }

  return (
    <form onSubmit={updateBook}>
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
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }}>Update book</button>
    </form>
  );
}
