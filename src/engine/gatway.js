import * as React from "react";
import { Machine, sendParent, interpret } from "xstate";
import gateWayMachines from "./gatewayMacine";
import { useMachine } from "@xstate/react";
import authClientMachine, { useAuth } from "./authMachine";
// import { useLocation } from "./locationMachine";

// Context
const Context = React.createContext(null);
const DispatchContext = React.createContext(null);

export function GatewayProvider({ children }) {
  const [context, service] = useAuth();
  console.log("context", context);
  // const memoizedValue = React.useMemo(() => {
  //   return {
  //     ...authState
  //     // ...locationState
  //   };
  // }, [authState]);

  let contextValue = {
    // ...authState
  };
  let contextDispatch = {
    authCheck: () => service.send("AUTH")
    // ...locationDispatch
  };

  return (
    <Context.Provider value={contextValue}>
      <DispatchContext.Provider value={contextDispatch}>
        {children}
      </DispatchContext.Provider>
    </Context.Provider>
  );
}

export function useGateway() {
  const context = React.useContext(Context);
  const dispatch = React.useContext(DispatchContext);

  if (context === null)
    throw new Error("useGateway must be inside GatewayProvider");

  return [context, dispatch];
}
