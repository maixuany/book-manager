import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo, userInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await fetch(
        "https://stry3k-3000.preview.csb.app/api/v1/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ username, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        response.json().then((payload) => {
          Cookies.set("token", payload.data.token);
          setUserInfo(payload.data.payload);
          setRedirect(true);
        });
      } else {
        alert("wrong credentials");
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const fullname = userInfo?.fullname;

  if (redirect || fullname) {
    return <Navigate to={"/"} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
