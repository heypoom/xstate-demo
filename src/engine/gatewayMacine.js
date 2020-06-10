import { Machine, spawn, assign, send } from "xstate";
import authMachine, { actionTypes as authMachineTypes } from "./authMachine";
import locationMachine, {
  actionTypes as locationMachineTypes
} from "./locationMachine";

function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

const gateWayMachines = Machine(
  {
    id: "gateway",
    initial: "initializing",
    context: {
      user: null,
      location: null
    },
    states: {
      initializing: {
        type: "parallel",
        states: {
          invokeAuth: {
            initial: "pending",
            states: {
              pending: {
                invoke: {
                  id: "authMachine",
                  src: authMachine,
                  onDone: "resolved",
                  onError: "resolved"
                }
              },
              resolved: { type: "final" }
            }
          }
        },
        onDone: "initialized"
      },
      initialized: {
        type: "parallel",
        initial: "locationReady",
        states: {
          locationReady: {
            on: {
              [locationMachineTypes.LOCATION_IDLE]: {
                actions: send(locationMachineTypes.LOCATION_UPDATING, {
                  to: "location"
                })
              },
              [locationMachineTypes.LOCATION_UPDATED]: {
                actions: ["getLocation"]
              }
            }
          }
        }
      }
    }
  },
  {
    actions: {
      getUser: assign({
        user: (_, e) => e.user
      }),
      getLocation: assign({
        location: (_, e) => e.location
      })
    }
  }
);

export default gateWayMachines;
