import { useContext, useState } from "react";
import { UserContext } from "../UserContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function register(ev) {
    ev.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ fullname, username, password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 201) {
        alert("registration successful");
      } else {
        alert("Register failed");
      }
    } catch (error) {
      alert("Register failed. Try again later.");
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="text"
        placeholder="fullname"
        value={fullname}
        onChange={(ev) => setFullname(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
