import React, { useState } from "react";
import addTaskApi, { AddTaskParams } from "src/apis/tasks/addTask.api";
import { useNavigate } from "react-router";
import Heading from "src/components/utility/Heading/Heading";

const AddTaskComponent = () => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError("Name can not be empty!");
			return;
		}
		if (!description.trim()) {
			setError("Description can not be empty!");
			return;
		}
		if (!dueDate.trim()) {
			setError("Due date can not be empty!");
			return;
		}

		setError(null);
		setLoading(true);

		const params: AddTaskParams = { name, description, dueDate };
		addTaskApi(params)
			.then(res => {
				navigate(`/task/${res.taskId}`);
			})
			.catch(() => {
				setError("Please check fields.");
				setLoading(false);
			});
	};

	return (
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-5">
				<Heading
					className="card-title text-center"
					text={"Add New Task"}
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
			{error && <div className="alert alert-danger">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label
						htmlFor="taskName"
						className="form-label"
					>
						Task Name
					</label>
					<input
						type="text"
						id="taskName"
						className="form-control"
						placeholder="Enter task name"
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</div>

				<div className="mb-3">
					<label
						htmlFor="taskDescription"
						className="form-label"
					>
						Task Description
					</label>
					<textarea
						id="taskDescription"
						className="form-control"
						rows={3}
						placeholder="Enter task description"
						value={description}
						onChange={e => setDescription(e.target.value)}
						required
					/>
				</div>

				<div className="mb-3">
					<label
						htmlFor="taskDueDate"
						className="form-label"
					>
						Due Date
					</label>
					<input
						type="date"
						id="taskDueDate"
						className="form-control"
						value={dueDate}
						onChange={e => setDueDate(e.target.value)}
						required
					/>
				</div>

				<button
					type="submit"
					className="btn btn-primary d-inline-flex justify-content-center align-items-center"
					disabled={loading}
				>
					{loading && (
						<div
							className="spinner-border spinner-border-sm text-white"
							role="status"
						>
							<span className="sr-only">Loading...</span>
						</div>
					)}
					<span>Add Task</span>
				</button>
			</form>
		</div>
	);
};

export default AddTaskComponent;
