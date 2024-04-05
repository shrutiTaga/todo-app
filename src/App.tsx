import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

type Priority = 'p1' | 'p2' | 'p3';

type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
  priority?: Priority;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(getData());
  const [taskName, setTaskName] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);
  
  function getData() {
    const list = localStorage.getItem('tasks');
    return list ? JSON.parse(list) : [];
  }

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    checkSpeechSynthesisSupport();
  }, []); // Run only on initial mount

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]); // Run whenever tasks change

  const checkSpeechSynthesisSupport = () => {
    setSpeechSynthesisAvailable('speechSynthesis' in window);
  };

  const handleAddTask = () => {
    if (taskName.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        title: taskName,
        isCompleted: false,
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      setTaskName('');
    }
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = () => {
    if (editTaskId !== null && editTaskTitle.trim() !== '') {
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === editTaskId ? { ...task, title: editTaskTitle } : task))
      );
      setEditTaskId(null);
      setEditTaskTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editTaskId !== null) {
        handleEditTask();
      } else {
        handleAddTask();
      }
    }
  };

  const handleEditClick = (taskId: number) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      setEditTaskId(taskId);
      setEditTaskTitle(taskToEdit.title);
      setTaskName(''); // Clear the input box when editing begins
      window.scrollTo(0, 0);
    }
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditTaskTitle('');
    setTaskName('');
  };

  const handleReadTask = (taskId: number) => {
    const taskToRead = tasks.find(task => task.id === taskId);
    if (taskToRead && speechSynthesisAvailable) {
      const utterance = new SpeechSynthesisUtterance(taskToRead.title);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container" style={{ position: 'relative', top: '10px' }}>
      <div className='col-md-6 mx-auto'>

        <h1 className="title">Tasks</h1>
        <div className="input-container">
          <input
            id="task-input"
            className="task-input"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter task..."
            autoFocus={!editTaskId}
            style={{ width: 'calc(100% - 110px)' }}
          />
          <button className="add-button" onClick={handleAddTask}>Add</button>
        </div>
         
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
              {editTaskId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    style={{ width: 'calc(100% - 110px)' }}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter task..."
                  />
                  <button className="save-button" onClick={handleEditTask}>Save</button>
                  <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{task.title}</span>
                  <div>
                    <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    <button className="edit-button" onClick={() => handleEditClick(task.id)}>Edit</button>
                    <button className="read-button" onClick={() => handleReadTask(task.id)}>
                      <FontAwesomeIcon icon={faVolumeUp} />
                    </button>
                  </div>
                </>
              )}
            </li>
           ))}
           </ul>
         </div>
       </div>
  );
}

export default App;
