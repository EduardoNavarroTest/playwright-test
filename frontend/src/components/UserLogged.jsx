import React, { useEffect, useState } from 'react';
import { getUserLogged } from '../services/whoamiService.js';

const UserLogged = () => {
    const [user, setUser] = useState(null);
    const [ip, setIp] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUserLogged()
            .then(data => {
                setUser(data.user);
                setIp(data.ip);
            })
            .catch(err => setError(err.message));
    }, []);

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading user...</p>;

    return (
        <div>
            <h3>User detected</h3>
            <p><strong>IP:</strong> {ip}</p>
            <p><strong>User:</strong> {user}</p>
        </div>
    );
};

export default UserLogged;
