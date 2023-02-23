import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import Cookies from "js-cookie";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    console.log(Cookies.get("token"));
    fetch("http://localhost:3000/api/v1/user/me", {
      credentials: "include",
      headers: { Authorization: "Bearer " + Cookies.get("token") },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((userInfo) => {
          console.log(userInfo.data);
          setUserInfo(userInfo.data);
        });
      } else setUserInfo(null);
    });
  }, []);

  function logout() {
    fetch("http://localhost:3000/api/v1/auth/logout", {
      credentials: "include",
      method: "POST",
      headers: { Authorization: "Bearer " + Cookies.get("token") },
    });
    setUserInfo(null);
  }

  const fullname = userInfo?.fullname;

  return (
    <header>
      <Link to="/" className="logo">
        Book Library
      </Link>
      <nav>
        {fullname && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({fullname})</a>
          </>
        )}
        {!fullname && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
