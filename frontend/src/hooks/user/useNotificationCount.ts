import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import getUserNotificationsCountApi from "src/apis/user/getUserNotificationsCount.api";

function useNotificationCount() {
	const { data, refetch } = useQuery({
		queryKey: ["useNotificationCount"],
		queryFn: getUserNotificationsCountApi,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 10000);

		return () => {
			clearInterval(interval);
		};
	}, [refetch]);

	return useMemo(() => data ?? 0, [data]);
}

export default useNotificationCount;
