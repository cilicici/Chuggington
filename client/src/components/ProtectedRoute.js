import React from "react";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const token = localStorage.getItem("autt");

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
}

export default ProtectedRoute;
