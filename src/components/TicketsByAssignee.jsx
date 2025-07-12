import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdminTicketProgressView from './AdminTicketProgressView';
import { updateAssignee } from '../store.jsx';

export default function TicketsByAssignee() {
  const tickets = useSelector(state => state.tickets);
  const employees = useSelector(state => state.employees);
  const dispatch = useDispatch();
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showProgressView, setShowProgressView] = useState(false);

  const assigneeTickets = tickets.filter(
    ticket => selectedAssignee && ticket.assignee === selectedAssignee
  );

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowProgressView(true);
  };

  const handleBackToAssigneeList = () => {
    setShowProgressView(false);
    setSelectedTicket(null);
  };

  const assigneeNames = employees.map(emp => emp.name);

  // Progress View가 활성화된 경우
  if (showProgressView && selectedTicket) {
    return (
      <AdminTicketProgressView 
        ticket={selectedTicket} 
        onBack={handleBackToAssigneeList}
      />
    );
  }

  // 기본 Assignee List View
  return (
    <div>
      <h4 style={{ marginBottom: 24 , paddingTop: '54px' }}>Tickets by Assignee</h4>
      <div style={{ maxWidth: 320, marginBottom: 24 }}>
        <select
          className="form-select"
          value={selectedAssignee}
          onChange={e => setSelectedAssignee(e.target.value)}
        >
          <option value="">Select an assignee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
          ))}
        </select>
      </div>
      {selectedAssignee ? (
        assigneeTickets.length > 0 ? (
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {assigneeTickets.map(ticket => (
              <li key={ticket.id} style={{ marginBottom: 16 }}>
                <div 
                  style={{ 
                    background: '#f8f9fa', 
                    borderRadius: 8, 
                    padding: 16, 
                    boxShadow: '0 2px 8px #eee',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => handleTicketClick(ticket)}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e9ecef';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px #ddd';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8f9fa';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px #eee';
                  }}
                >
                  <strong>{ticket.title}</strong>
                  <div style={{ color: '#888', fontSize: 14, marginTop: 4 }}>{ticket.description}</div>
                  <div style={{ marginTop: 8, fontSize: 13 }}>
                    <span>Status: {ticket.status}</span> | <span>Due: {ticket.dueDate}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ color: '#888', marginTop: 24 }}>No tickets assigned to this user.</div>
        )
      ) : (
        <div style={{ color: '#888', marginTop: 24 }}>Please select an assignee.</div>
      )}
    </div>
  );
} 