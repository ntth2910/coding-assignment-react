import React, { useState } from 'react';
import { User } from '@acme/shared-models';

interface AddTicketProps {
  users: User[];
  onAddTicket: (ticket: {
    description: string;
    assigneeId: number | null;
  }) => void;
}

const AddTicket: React.FC<AddTicketProps> = ({ users, onAddTicket }) => {
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);

  const handleAddTicket = () => {
    if (!newTicketDesc || selectedAssignee === null) {
      alert('Please fill out the description and select an assignee.');
      return;
    }

    onAddTicket({ description: newTicketDesc, assigneeId: selectedAssignee });
    console.log('selectedAssignee', selectedAssignee);
    setNewTicketDesc('');
    setSelectedAssignee(selectedAssignee);
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Ticket description"
        className="border rounded p-2 mr-4"
        value={newTicketDesc}
        onChange={(e) => setNewTicketDesc(e.target.value)}
      />
      <select
        className="border rounded p-2 mr-4"
        value={selectedAssignee || ''}
        onChange={(e) => setSelectedAssignee(Number(e.target.value))}
      >
        <option value="">Select Assignee</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        className="bg-green-500 text-white p-2 rounded"
        onClick={handleAddTicket}
      >
        Add Ticket
      </button>
    </div>
  );
};

export default AddTicket;
