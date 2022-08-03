import React from "react";
import { AuthorizeUI } from "./lib";

const App = () => {
  return (
    <AuthorizeUI type={"student"}>
      <TestComponent />
    </AuthorizeUI>
  );
};

export default App;

const TestComponent = () => {
  return <div />;
};
