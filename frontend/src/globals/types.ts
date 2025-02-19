export type AxiosStatus = "error" | "success" | "pending";

/**
 * ActionDispatch type is a generic type that defines a function for dispatching actions.
 * It takes a generic type TActions, which represents a collection of action functions.
 * These actions are expected to be functions that modify a state and may take a payload.
 *
 * The type specifies a function that takes two parameters:
 *   - 'action': a string literal representing the action to be dispatched.
 *   - 'payload': an optional parameter that can be the payload for the action.
 *
 * The type uses conditional types to infer and enforce the correct payload type for each action.
 * If an action in TActions is a function, it extracts the payload type using Parameters and maps it to the correct position.
 * If an action is not a function, it sets the payload type to 'never'.
 *
 * Example Usage:
 *   If TActions = { increment: (amount: number) => void; reset: () => void },
 *   ActionDispatch<TActions> would be:
 *   (action: "increment", payload: number) => void
 *   | (action: "reset", payload: never) => void
 */
export type ActionDispatch<TActions> = <T extends keyof TActions>(
	action: T,
	payload?: TActions[T] extends (...args: any) => any
		? Parameters<TActions[T]>[1]
		: never,
) => void;
