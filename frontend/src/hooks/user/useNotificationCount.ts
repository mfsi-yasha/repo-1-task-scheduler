import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import getUserNotificationsCountApi from "src/apis/user/getUserNotificationsCount.api";

/**
 * Custom hook to fetch and track the user's notification count.
 *
 * This hook uses the `useQuery` hook from React Query to fetch the user's notification count
 * and refetches the count every 10 seconds. The refetched data is returned as a memoized value.
 *
 * @returns The user's notification count. Defaults to 0 if no data is available.
 */
function useNotificationCount() {
	const { data, refetch } = useQuery({
		queryKey: ["useNotificationCount"],
		queryFn: getUserNotificationsCountApi,
	});

	/**
	 * Sets up an interval to refetch the notification count every 10 seconds.
	 * Clears the interval when the component is unmounted.
	 */
	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 10000);

		return () => {
			clearInterval(interval);
		};
	}, [refetch]);

	/**
	 * Memoizes the notification count to avoid unnecessary recalculations.
	 * Returns 0 if no data is available.
	 */
	return useMemo(() => data ?? 0, [data]);
}

export default useNotificationCount;
