export function doNothingWith(reducer) {
  return function (state, action) {
    // Just call the passed reducer
    return reducer(state, action);
  };
}

export function storeHistory(reducer) {
  // Call the reducer with empty action to populate the initial state
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: []
  };

  return function (state = initialState, action) {
    const { past, present } = state;
    return {
      past: [...past, action],
      present: reducer(state.present, action)
    };
  };
}