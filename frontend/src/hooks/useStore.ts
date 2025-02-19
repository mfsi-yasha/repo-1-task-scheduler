import { createContext, useCallback, useContext, useReducer } from "react";
import { GetUserDetailsI } from "src/apis/user/getUserDetails.api";
import { ActionDispatch, AxiosStatus } from "src/globals/types";

export interface StoreData {
	loginInfo: GetUserDetailsI | null;
	loginInfoFetching: AxiosStatus;
}

/**
 * Initial state for the store.
 */
const storeInitialData: StoreData = {
	loginInfo: null,
	loginInfoFetching: "pending",
};

/**
 * Reducer function to handle state modifications.
 *
 * @function
 * @param state - The current state.
 * @param actionPayload - Array containing the action and payload.
 * @returns The new state after applying the action.
 */
const reducerMethod = (
	state: StoreData,
	[action, payload]: [
		(value: StoreData, payload?: any) => StoreData,
		undefined | any,
	],
): StoreData => {
	// Execute the action function with current state and payload
	const newDate = action(state, payload);
	// Return a new state object to ensure immutability
	return { ...newDate };
};

/**
 * Context for store.
 */
const StoreContext = createContext([storeInitialData, () => {}] as [
	StoreData,
	ActionDispatch<typeof StoreAction>,
]);

/**
 * Custom hook to create context with a reducer.
 */
export const useStoreCreate = () => {
	// Use the reducer to manage state
	const [state, dispatch] = useReducer(reducerMethod, {
		// Initialize state with default values
		...storeInitialData,
	});

	// Memoize the modified dispatch function using useCallback
	const modifiedDispatch: ActionDispatch<typeof StoreAction> = useCallback(
		(action, payload) => {
			// Wrap dispatch with action and payload
			dispatch([StoreAction[action], payload]);
		},
		[dispatch],
	);

	// Return the state, modified dispatch, and context provider
	return [state, modifiedDispatch, StoreContext.Provider] as [
		StoreData,
		ActionDispatch<typeof StoreAction>,
		typeof StoreContext.Provider,
	];
};

/**
 * Custom hook to consume the store context.
 */
export const useStore = () => {
	// Destructure context values
	const [store, dispatch] = useContext(StoreContext);

	// Return context values
	return {
		store,
		dispatch,
	};
};

/**
 * Actions to modify the segment view state state.
 */
const StoreAction = {
	/**
	 * Resets the store state.
	 */
	resetStore: () => {
		return { ...storeInitialData };
	},

	/**
	 * Sets the store state.
	 */
	setStore: (state: StoreData, payload: Partial<StoreData>) => {
		return { ...state, ...payload };
	},
};
