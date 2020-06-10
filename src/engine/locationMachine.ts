import * as React from "react";
import { assign, Machine, sendParent } from "xstate";

// const authorizedUser = "@tawanttc";

export const actionTypes = {
  LOCATION_IDLE: "LOCATION_IDLE",
  LOCATION_UPDATING: "LOCATION_UPDATING",
  LOCATION_UPDATED: "LOCATION_UPDATED"
};

const defaultLocation = "australia";

/**
 * React hook
 */
export const useLocation = coreService => {
  const [locatoinState, setLocationState] = React.useState({});

  const locationDispatch = {
    locationUpdate: newLocation =>
      coreService.send({
        type: actionTypes.LOCATION_IDLE,
        payload: newLocation
      })
  };

  return [locatoinState, locationDispatch];
};

const createLocationMachine = Machine(
  {
    id: "location",
    context: {
      location: defaultLocation
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          [actionTypes.LOCATION_IDLE]: "change"
        }
      },
      change: {
        on: {
          [actionTypes.LOCATION_UPDATING]: {
            target: "updated",
            actions: ["updateLocation"],
            cond: "authorizedOnly"
          }
        }
      },
      updated: {
        on: {
          [actionTypes.LOCATION_IDLE]: {
            target: "idle",
            actions: sendParent(actionTypes.LOCATION_UPDATED)
          }
        }
      }
    }
  },
  {
    actions: {
      updateLocation: () => console.log("xx")
    },
    guards: {
      authorizedOnly: ctx => {
        console.log("ctx.user", ctx.user);
        // if (ctx.user === null) {
        //   alert("Only authorized user ??");
        //   return;
        // }
        // if (ctx.user.twitter !== authorizedUser) {
        //   alert("Only authorized user ??");
        //   return;
        // }

        return true;
      }
    }
  }
);

export default createLocationMachine;
