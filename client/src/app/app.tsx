import { useEffect, useState } from 'react';
import { Ticket, User } from '@acme/shared-models';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import styles from './app.module.css';
import Tickets from './tickets/tickets';
import Users from './users/users';
import TicketDetails from './tickets/details';

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets and users data
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const ticketsData = await response.json();
        console.log('ticketsData', ticketsData);
        setTickets(ticketsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const usersData = await response.json();
        setUsers(usersData);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchTickets();
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles['app']}>
      <Routes>
        <Route path="/" element={<Tickets />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  );
};

export default App;
