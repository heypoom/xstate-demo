import React from "react";
import ReactDOM from "react-dom";
import { GatewayProvider, useGateway } from "./engine/gatway";

function App() {
  const [state, dispatch] = useGateway();

  const { location, user } = state;
  const { locationUpdate, authCheck } = dispatch;

  if (!user) {
    return (
      <React.Fragment>
        <div>Unauthorized</div>
        <button onClick={() => authCheck()}>Login</button>
      </React.Fragment>
    );
  }

  return (
    <div>
      <h1>User: {user && `${user.name}`}</h1>
      <h1>Location: {location}</h1>
      {JSON.stringify(state)}
      <h1>Change Location</h1>
      <button onClick={() => locationUpdate("australia")}>To Australia</button>
      <button onClick={() => locationUpdate("thailand")}>To Thailand</button>
    </div>
  );
}

ReactDOM.render(
  <GatewayProvider>
    <App />
  </GatewayProvider>,
  document.getElementById("root")
);
