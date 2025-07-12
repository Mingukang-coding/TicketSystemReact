import React from 'react';
import { Card, Badge } from 'react-bootstrap';

export default function TicketCard({ ticket, onClick }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return 'danger';
      case 'urgent': return 'warning';
      case 'in-progress': return 'info';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Card 
      className="mb-3 ticket-card" 
      style={{ 
        cursor: 'pointer',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      <Card.Body style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <Badge bg={getPriorityColor(ticket.priority)} style={{ fontSize: '0.7rem' }}>
            {ticket.priority.toUpperCase()}
          </Badge>
          <small style={{ color: '#6c757d' }}>#{ticket.id}</small>
        </div>
        
        <Card.Title style={{ 
          fontSize: '1rem', 
          marginBottom: '8px',
          fontWeight: '600',
          color: '#212529'
        }}>
          {ticket.title}
        </Card.Title>
        
        <Card.Subtitle style={{ 
          fontSize: '0.85rem', 
          marginBottom: '12px',
          color: '#6c757d'
        }}>
          Owner: {ticket.assignee}
        </Card.Subtitle>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge bg={getStatusColor(ticket.status)} style={{ fontSize: '0.75rem' }}>
            {ticket.status === 'overdue' ? 'Overdue' : 
             ticket.status === 'urgent' ? 'Urgent' :
             ticket.status === 'in-progress' ? 'In Progress' :
             ticket.status === 'completed' ? 'Completed' : ticket.status}
          </Badge>
          <small style={{ color: '#6c757d' }}>
            {ticket.dueDate}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
} 