import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { TaskDetailsI, TaskStatusesT } from "src/apis/tasks/addTask.api";
import getTaskByIdApi from "src/apis/tasks/getTaskById.api";
import updateTaskByIdApi, {
	UpdateTaskParams,
} from "src/apis/tasks/updateTaskById.api";
import GlobalLoader from "src/components/utility/GlobalLoader/GlobalLoader";
import Heading from "src/components/utility/Heading/Heading";
import NoDataFound from "src/components/utility/NoDataFound/NoDataFound";

// Task status options for dropdown
const taskStatuses: Array<{ key: TaskStatusesT; label: string }> = [
	{ key: "toDo", label: "To Do" },
	{ key: "inProgress", label: "In Progress" },
	{ key: "done", label: "Done" },
];

const TaskDetails = () => {
	const { taskId } = useParams();
	const navigate = useNavigate();
	const [task, setTask] = useState<TaskDetailsI | null>(null);
	const ogTask = useRef<TaskDetailsI | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editing, setEditing] = useState(false);
	const [showDD, setShowDD] = useState(false);

	// Fetch the task details when the component mounts
	useEffect(() => {
		const fetchTaskDetails = async () => {
			try {
				setLoading(true);
				const response = await getTaskByIdApi({ taskId: taskId + "" });
				ogTask.current = { ...response };
				setTask(response);
			} catch (err) {
				setError("Failed to fetch task details.");
			} finally {
				setLoading(false);
			}
		};

		fetchTaskDetails();
	}, [taskId]);

	const handleUpdateTask = useCallback(
		async (params: Omit<UpdateTaskParams, "taskId">) => {
			if (task) {
				try {
					const response = await updateTaskByIdApi({
						taskId: task.taskId,
						...params,
					});
					ogTask.current = { ...response };
					setTask(response);
					setEditing(false);
				} catch (err) {
					setError("Failed to update task.");
				}
			}
		},
		[task],
	);

	const handleSave = useCallback(() => {
		if (task) {
			const params: Omit<UpdateTaskParams, "taskId"> = {};

			if (task.name !== ogTask.current?.name) {
				params.name = task.name;
			}
			if (task.description !== ogTask.current?.description) {
				params.description = task.description;
			}
			if (task.dueDate !== ogTask.current?.dueDate) {
				params.dueDate = task.dueDate.split("T")[0];
			}

			if (Object.keys(params).length) {
				setLoading(true);
				handleUpdateTask(params)
					.then(() => {})
					.catch(() => {})
					.finally(() => {
						setLoading(false);
					});
			} else {
				setEditing(false);
			}
		}
	}, [handleUpdateTask, task]);

	if (loading) return <GlobalLoader style={{ height: "auto" }} />;
	if (!task) return <NoDataFound text="No task found!" />;

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-5">
				<Heading
					className="card-title text-center"
					text={"Task Details"}
					isH1={true}
				/>
				<button
					className="btn"
					title="Go Back"
					onClick={() => {
						navigate("/");
					}}
				>
					<i className="fa fa-arrow-left"></i>
				</button>
			</div>
			{error ? <div className="alert alert-danger my-3">{error}</div> : <></>}
			<div className="card">
				<div className="card-body">
					{/* Task Header: Task Name & Status */}
					<div className="d-flex justify-content-between align-items-center mb-2">
						{/* Editable task name */}
						{editing ? (
							<input
								type="text"
								className="form-control mr-3"
								value={task.name}
								onChange={e => setTask({ ...task, name: e.target.value })}
							/>
						) : (
							<h4 className="card-title">{task.name}</h4>
						)}

						{/* Task Status */}
						<div className="form-group">
							<div className="dropdown">
								<button
									className={`btn btn-${task.status === "toDo" ? "secondary" : task.status === "inProgress" ? "primary" : "success"}`}
									type="button"
									onClick={() => {
										setShowDD(s => !s);
									}}
									style={{ width: "150px" }}
								>
									{
										taskStatuses.find(status => status.key === task.status)
											?.label
									}
								</button>
								{showDD && (
									<ul
										className="dropdown-menu show"
										style={{
											right: 0, // Align the dropdown menu to the right
											width: "150px", // Fixed width for the dropdown
										}}
									>
										{taskStatuses.map(status => (
											<li
												key={status.key}
												className="px-0"
											>
												<button
													className="dropdown-item"
													style={{ width: "150px" }}
													type="button"
													onClick={() => {
														if (status.key !== task.status) {
															setTask(p =>
																p
																	? {
																			...p,
																			status: status.key,
																		}
																	: p,
															);
															handleUpdateTask({ status: status.key });
														}
														setShowDD(false);
													}}
												>
													{status.label}
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					</div>

					{/* Task Description */}
					<textarea
						className="form-control mb-2"
						rows={4}
						value={task.description}
						readOnly={!editing}
						onChange={e => setTask({ ...task, description: e.target.value })}
					/>

					{/* Due Date */}
					<div className="mb-4">
						<strong>Due Date:</strong>{" "}
						<input
							type="date"
							className="form-control"
							readOnly={!editing}
							value={task.dueDate.split("T")[0]} // Format date for input
							onChange={e => {
								setTask(p =>
									p
										? {
												...p,
												dueDate: new Date(e.target.value).toISOString(),
											}
										: p,
								);
							}}
						/>
					</div>

					{/* Created & Updated At */}
					<div className="mb-2">
						<strong>Created At:</strong>{" "}
						{new Date(task.createdAt).toLocaleString()}
					</div>
					<div className="mb-4">
						<strong>Updated At:</strong>{" "}
						{new Date(task.updatedAt).toLocaleString()}
					</div>

					{/* Edit/Save Button */}
					<div className="d-flex justify-content-between mt-4">
						{editing ? (
							<>
								<button
									className="btn btn-success"
									onClick={handleSave}
								>
									Save Changes
								</button>
								<button
									className="btn btn-secondary"
									onClick={() => {
										setEditing(false);
										if (ogTask.current) {
											setTask({ ...ogTask.current });
										}
									}}
								>
									Cancel Changes
								</button>
							</>
						) : (
							<button
								className="btn btn-primary"
								onClick={() => setEditing(true)}
							>
								Edit Task
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskDetails;
