import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { TaskDetailsI } from "src/apis/tasks/addTask.api";
import getTasksApi, { GetAllTaskFilters } from "src/apis/tasks/getTasks.api";
import Heading from "src/components/utility/Heading/Heading";
import NoDataFound from "src/components/utility/NoDataFound/NoDataFound";

const TASK_LIST_LIMIT = 25;

function getMinuteDifference(dateOld: Date, dateNew: Date) {
	// Calculate the difference in milliseconds
	const differenceInMillis = dateNew.getTime() - dateOld.getTime();

	// Convert milliseconds to minutes
	const differenceInMinutes = differenceInMillis / (60 * 1000);

	return differenceInMinutes;
}

const OverDue = ({ dueDate }: { dueDate: string }) => {
	const minutes = useMemo(() => {
		return getMinuteDifference(new Date(), new Date(dueDate));
	}, [dueDate]);

	if (minutes / 60 < 24) {
		return (
			<span className="text-danger">
				{minutes <= 0 ? "Overdue by" : "Due in"}{" "}
				{Math.round(Math.abs(minutes) / 60)} hours
			</span>
		);
	} else {
		return <></>;
	}
};

const TaskList = () => {
	const navigate = useNavigate();

	const [tasks, setTasks] = useState<Array<TaskDetailsI>>([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const filters = useRef<GetAllTaskFilters>({
		start: 0,
		limit: TASK_LIST_LIMIT,
	});

	const handleAddTask = useCallback(() => {
		navigate("/task/new");
	}, []);

	const handleLoadMore = useCallback(() => {
		if (hasMore) {
			setLoading(true);
			filters.current.start = (filters.current.start ?? 0) + TASK_LIST_LIMIT;
			getTasksApi(filters.current)
				.then(res => {
					setTasks(p => [...p, ...res]);
					if (res.length < TASK_LIST_LIMIT) {
						setHasMore(false);
					}
				})
				.catch(() => {
					alert("Error loading content! Try again later!");
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [hasMore]);

	useEffect(() => {
		setLoading(true);
		getTasksApi(filters.current)
			.then(res => {
				setTasks(res);
				if (res.length < TASK_LIST_LIMIT) {
					setHasMore(false);
				}
			})
			.catch(() => {
				alert("Error loading content! Try again later!");
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-5">
				<Heading
					className="card-title text-center"
					text={"All Tasks"}
					isH1={true}
				/>
				<button
					className="btn btn-success"
					onClick={handleAddTask}
				>
					Add Task
				</button>
			</div>

			<ul className="list-group mt-3">
				{tasks.map(task => (
					<li
						key={task.taskId}
						className="list-group-item d-flex justify-content-between align-items-center gap-3"
					>
						<span>{task.name}</span>
						<div className="d-flex gap-3 justify-content-between align-items-center">
							<OverDue dueDate={task.dueDate} />
							<button
								className="btn btn-info"
								onClick={() => {
									navigate(`/task/${task.taskId}`);
								}}
							>
								<i className="fa fa-eye"></i> View
							</button>
						</div>
					</li>
				))}
			</ul>

			<div className="d-flex justify-content-center">
				{loading ? (
					<div
						className="spinner-border spinner-border-sm text-primary"
						role="status"
					>
						<span className="sr-only">Loading...</span>
					</div>
				) : hasMore ? (
					<button
						className="btn btn-primary mt-3"
						onClick={handleLoadMore}
					>
						<i className="fa fa-arrow-down"></i> Load More
					</button>
				) : tasks.length === 0 ? (
					<NoDataFound text="No Data Found" />
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default TaskList;
