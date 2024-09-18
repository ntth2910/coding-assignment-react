import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Ticket } from '@acme/shared-models';

export function TicketDetails() {
  const { id } = useParams<{ id: string }>(); // Get ticket id from URL params
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`);
        if (!response.ok) throw new Error('Failed to fetch ticket details');
        const ticketData: Ticket = await response.json();
        setTicket(ticketData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ticket) return <div>No ticket found...</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Ticket Details</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600">Ticket ID: {ticket.id}</p>
        <p className="text-lg font-bold text-gray-800">
          Description: {ticket.description}
        </p>
        {/* Add more ticket details here */}
      </div>
    </div>
  );
}

export default TicketDetails;
