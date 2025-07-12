import React from 'react';
import { Col, Badge } from 'react-bootstrap';
import TicketCard from './TicketCard';

export default function TicketColumn({ title, tickets, columnType, onCardClick }) {
  const getColumnColor = (type) => {
    switch (type) {
      case 'overdue': return '#dc3545';
      case 'urgent': return '#ffc107';
      case 'normal': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <Col md={4} className="mb-4">
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '16px',
        height: 'calc(100vh - 200px)',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: `3px solid ${getColumnColor(columnType)}`
        }}>
          <h6 style={{
            margin: 0,
            color: '#495057',
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            {title}
          </h6>
          <Badge 
            bg="secondary" 
            style={{ 
              marginLeft: '8px',
              fontSize: '0.75rem'
            }}
          >
            {tickets.length}
          </Badge>
        </div>
        
        <div style={{ minHeight: '50px' }}>
          {tickets.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#6c757d',
              fontSize: '0.9rem',
              padding: '20px'
            }}>
              No tickets
            </div>
          ) : (
            tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onClick={() => onCardClick && onCardClick(ticket)} />
            ))
          )}
        </div>
      </div>
    </Col>
  );
} 