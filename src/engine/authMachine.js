import * as React from "react";
import { sendParent, send, Machine, assign, spawn, interpret } from "xstate";
import { useMachine, useService } from "@xstate/react";

const loggedUserInfo = {
  name: "Tawan C."
};
function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
const invokeFakeResolvedAuthApi = () => {
  return Promise.resolve(loggedUserInfo);
};

/**
 * React hook
 */
export function useAuth() {
  const [context, setContext] = React.useState({});

  const service = interpret(authClientMachine)
    .onTransition(s => {
      if (s.value === "authorized") {
        setContext(s.context);
      }
    })
    .start();

  return [context, service];
}

const authServerMachine = Machine({
  id: "server",
  initial: "waitingForCode",
  context: {
    user: null
  },
  states: {
    waitingForCode: {
      invoke: {
        id: "authorized-user",
        src: wait(1000),
        onExit: () => console.log("x")
      },
      on: {
        CODE: {
          actions: [(_, e) => console.log("TOKEN", e)]
        }
      }
    }
  }
});

const authClientMachine = Machine({
  id: "client",
  initial: "idle",
  context: {
    user: null
  },
  states: {
    idle: {
      on: { AUTH: "authorizing" }
    },
    authorizing: {
      invoke: {
        id: "auth-server",
        src: authServerMachine
      },
      entry: [send("CODE", { to: "auth-server" })],
      on: {
        TOKEN: {
          target: "authorized",
          actions: assign({
            user: (ctx, e) => e.data
          })
        }
      }
    },
    authorized: {
      type: "final"
    }
  }
});

export default authClientMachine;
