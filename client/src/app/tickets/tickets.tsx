import { useState, useEffect } from 'react';
import { Ticket, User } from '@acme/shared-models';
import { Link } from 'react-router-dom';
import AddNew from './add';

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets and users data
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const ticketsData = await response.json();
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

  // Handle adding a new ticket
  const addTicket = async (ticket: {
    description: string;
    assigneeId: number | null;
  }) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticket),
      });

      if (!response.ok) throw new Error('Failed to add ticket');

      const addedTicket = await response.json();
      console.log('Added ticket:', addedTicket);
      setTickets([...tickets, addedTicket]);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Tickets List</h2>

      {/* Add Ticket Form */}
      <AddNew users={users} onAddTicket={addTicket} />

      {tickets && tickets.length > 0 ? (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">
                    Ticket ID: {ticket.id}
                  </p>
                  <p className="font-medium text-gray-800">
                    {ticket.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Assigned to:{' '}
                    {users.find((u) => u.id === ticket.assigneeId)?.name ||
                      'Unassigned'}
                  </p>
                </div>
                <Link to={`/tickets/${ticket.id}`}>
                  <button className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600">
                    View Details
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">No tickets available...</div>
      )}
    </div>
  );
}

export default Tickets;
