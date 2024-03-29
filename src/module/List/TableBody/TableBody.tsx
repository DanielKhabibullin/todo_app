import {useEffect, useRef, useState} from 'react';
import {Button} from 'react-bootstrap';
import {useAppDispatch, useAppSelector} from '../../../hooks';
import {setUserTask} from '../../../store/reducer';
import {changeStatus, changeTaskText, delTask, getTask} from '../../../UsersData/user';
import {ConfirmModal} from './ConfirmModal/ConfirmModal';

interface IProps {
	item: {
		taskId: string;
		text: string;
		status: string;
		priority: string};
	index: number;
}

export const TableBody = ({item, index}: IProps) => {
	const {taskId, text, status, priority} = item;
	const [statusTask, setStatusTask] = useState(false);
	const dispatch = useAppDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(text);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
	const id: string = useAppSelector((state) => state.userReducer.id);
	const tdRef = useRef<HTMLTableCellElement>(null);

	const deleteTask = () => {
		setIsConfirmModalOpen(true);
	};

	const onConfirm = () => {
		setIsConfirmModalOpen(false);
		delTask(id, taskId);
		dispatch(setUserTask(getTask(id)));
	};

	const doneTask = () => {
		setStatusTask(!statusTask);
		changeStatus(id, taskId, statusTask ? 'In progress' : 'Completed');
		dispatch(setUserTask(getTask(id)));
	};

	const editTask = () => {
		setIsEditing(true);
	};

	const handleEdit = (e: React.FocusEvent<HTMLTableCellElement>) => {
		const editedValue = e.currentTarget.textContent || '';
		changeTaskText(id, taskId, editedValue);
		setIsEditing(false);
		setEditedText(editedValue);
		dispatch(setUserTask(getTask(id)));
	};

	useEffect(() => {
		dispatch(setUserTask(getTask(id)));
	}, [dispatch, id, statusTask]);

	useEffect(() => {
		if (isEditing && tdRef.current) {
			const tdElement = tdRef.current;
			tdElement.focus();
		}
	}, [isEditing]);

	const getPriorityClassName = () => {
		switch (priority) {
			case 'table-warning':
				return 'table-warning';
			case 'table-danger':
				return 'table-danger';
			default:
				return 'table-light';
		}
	};

	return (
		<>
			<tr className={`${statusTask ? 'table-success' : getPriorityClassName()}`} data-task-id={taskId}>
				<td>{index + 1}</td>
				{isEditing ?
					<td
						ref={tdRef} 
						contentEditable={true}
						suppressContentEditableWarning={true}
						onBlur={handleEdit}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								e.currentTarget.blur();
							}
						}}
					>
						{editedText}
					</td>
					:
					<td
						className={`${statusTask ? 'text-decoration-line-through table-success' : ''}`}
						onDoubleClick={() => setIsEditing(true)}
					>
						{text}
					</td>
				}
				<td>{status}</td>
				<td>
					<Button
						variant="danger"
						onClick={deleteTask} className='me-1 mb-1'
					>
						Delete
					</Button>
					<Button
						onClick={doneTask} className='me-1 mb-1'
						variant="success"
					>
						{statusTask ? 'Uncomplete' : 'Complete'}
					</Button>
					<Button
						className='mb-1'
						variant="secondary"
						onClick={editTask}
						disabled={statusTask}
					>
						Edit
					</Button>
				</td>
			</tr>
			<ConfirmModal
				isOpen={isConfirmModalOpen}
				onClose={() => setIsConfirmModalOpen(false)}
				onConfirm={onConfirm}
				taskText={text}
			/>
		</>
	);
};
