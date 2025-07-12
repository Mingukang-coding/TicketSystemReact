import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Form } from 'react-bootstrap';

export default function TicketDetailModal({ show, onHide, ticket, assignees, onUpdateAssignee }) {
  const [newAssignee, setNewAssignee] = useState(ticket ? ticket.assignee : '');

  useEffect(() => {
    setNewAssignee(ticket ? ticket.assignee : '');
  }, [ticket]);

  if (!ticket) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assign Ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{ticket.title}</h5>
        <Form.Group className="mb-3">
          <Form.Label>Assignee</Form.Label>
          <Form.Select value={newAssignee} onChange={e => setNewAssignee(e.target.value)}>
            {assignees && assignees.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <p><strong>Description:</strong></p>
        <p style={{ whiteSpace: 'pre-line' }}>{ticket.description}</p>
        <p><strong>Priority:</strong> <Badge bg="info">{ticket.priority}</Badge></p>
        <p><strong>Status:</strong> <Badge bg="secondary">{ticket.status}</Badge></p>
        <p><strong>Due Date:</strong> {ticket.dueDate}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => onUpdateAssignee(ticket.id, newAssignee)}>
          Assign
        </Button>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
} 