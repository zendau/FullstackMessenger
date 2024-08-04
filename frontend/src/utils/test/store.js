import store from "@/store";

export const defaultState = JSON.parse(JSON.stringify(store.state));

export function resetStateData() {
  store.replaceState(JSON.parse(JSON.stringify(defaultState)));
}

// export async function callStateAction(path, args) {
//   return await store._actions[path][0](args);
// }

// export async function callStateMutation(path, args) {
//   return await store._mutations[path][0](args);
// }
