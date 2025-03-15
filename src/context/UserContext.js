import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            if (loggedInUser) {
                setUser(loggedInUser);
            }
        } catch (err) {
            setError('Failed to load user data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setError(null); 
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    const dologout = () => {
        try {
            localStorage.removeItem('user');
            setUser(null);
        } catch (err) {
            setError('Logout failed. Please try again.');
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, error, login, dologout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserProvider, UserContext };
