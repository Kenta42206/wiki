import React from "react";
import { useRouteError } from "react-router-dom";
import Header from "./components/Header";
import { Button } from "@blueprintjs/core";

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center ">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
      </div>
    </div>
  );
}

export default ErrorPage;
