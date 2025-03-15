import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';

const Dashboard = () => {

    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [inputScrumName, setInputScrumName] = useState('');
    const [inputTaskTitle, setInputTaskTitle] = useState('');
    const [inputTaskDescription, setInputTaskDescription] = useState('');
    const [inputTaskStatus, setInputTaskStatus] = useState('To Do');
    const [inputTaskAssignedTo, setInputTaskAssignedTo] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scrumsResponse, usersResponse] = await Promise.all([
                    axios.get('http://localhost:4000/scrums'),
                    axios.get('http://localhost:4000/users')
                ]);
    
                setScrums(scrumsResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, []);
    
    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const handleAddScrum = async (event) => {
        event.preventDefault();

        try {
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                name: inputScrumName,
            });

            const inputScrum = newScrumResponse.data;

            await axios.post('http://localhost:4000/tasks', {
                title: inputTaskTitle,
                description: inputTaskDescription,
                status: inputTaskStatus,
                scrumId: inputScrum.id,
                assignedTo: Number(inputTaskAssignedTo),
                history: [
                    {
                        status: inputTaskStatus,
                        date: new Date().toISOString().split('T')[0],
                    },
                ],
            });

            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);
            setShowForm(false);
            setInputScrumName('');
            setInputTaskTitle('');
            setInputTaskDescription('');
            setInputTaskStatus('To Do');
            setInputTaskAssignedTo('');
        } catch (error) {
            console.error('Error adding scrum:', error);
        }
    };

    let addScrumButtonText = showForm ? 'Cancel' : 'Add New Scrum';

    return (
        <div>
            <h2>👩‍💻Scrum Teams</h2>
            {user && user.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {addScrumButtonText}
                    </button>
                    {showForm && (
                        <form onSubmit={handleAddScrum}>
                            <div>
                                <label>Scrum Name:</label>
                                <input
                                    type="text"
                                    value={inputScrumName}
                                    onChange={(e) => setInputScrumName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Task Title:</label>
                                <input
                                    type="text"
                                    value={inputTaskTitle}
                                    onChange={(e) => setInputTaskTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Task Description:</label>
                                <input
                                    type="text"
                                    value={inputTaskDescription}
                                    onChange={(e) => setInputTaskDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Task Status:</label>
                                <select
                                    value={inputTaskStatus}
                                    onChange={(e) => setInputTaskStatus(e.target.value)}
                                    required
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label>Assign To:</label>
                                <select
                                    value={inputTaskAssignedTo}
                                    onChange={(e) => setInputTaskAssignedTo(e.target.value)}
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Create Scrum</button>
                        </form>
                    )}
                </div>
            )}
            <ul>
                {scrums.map((scrum) => (
                    <li key={scrum.id}>
                        {scrum.name}&nbsp; &nbsp;
                        <button onClick={() => handleGetDetails(scrum.id)}> Get Details</button>
                    </li>
                ))}
            </ul>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;
