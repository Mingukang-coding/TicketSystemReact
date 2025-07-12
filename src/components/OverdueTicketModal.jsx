import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { updateDueDate, updateStatus, addWorkLog } from '../store';

export default function OverdueTicketModal({ show, onHide, ticket }) {
  const dispatch = useDispatch();
  const [newDueDate, setNewDueDate] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split('T')[0];

  React.useEffect(() => {
    if (ticket && show) {
      // 현재 마감일보다 하루 뒤를 기본값으로 설정
      const currentDueDate = new Date(ticket.dueDate);
      const nextDay = new Date(currentDueDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setNewDueDate(nextDay.toISOString().split('T')[0]);
      setError('');
      setSuccessMessage('');
      setShowSuccessModal(false);
    }
  }, [ticket, show]);

  const handleDueDateUpdate = async () => {
    if (!newDueDate.trim()) {
      setError('Please select a new due date.');
      return;
    }

    // 과거 날짜 체크
    const selectedDate = new Date(newDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Due date cannot be in the past.');
      return;
    }

    // 현재 마감일보다 이전 날짜 체크
    const currentDueDate = new Date(ticket.dueDate);
    if (selectedDate <= currentDueDate) {
      setError('New due date must be after the current due date.');
      return;
    }

    setIsUpdating(true);
    setError('');
    setSuccessMessage('');
    setShowSuccessModal(false);

    try {
      dispatch(updateDueDate({ id: ticket.id, dueDate: newDueDate }));
      
      // 마감일이 오늘 이후로 연장되면 status를 'open'으로 변경
      const selectedDate = new Date(newDueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let statusChanged = false;
      if (selectedDate > today) {
        dispatch(updateStatus({ id: ticket.id, status: 'open' }));
        statusChanged = true;
        setSuccessMessage(`Due date extended to "${newDueDate}" and status changed to "open"!`);
      } else {
        setSuccessMessage(`Due date successfully extended to "${newDueDate}"!`);
      }
      
      // 작업 로그 추가
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const workLogContent = statusChanged 
        ? `Due date extended from "${ticket.dueDate}" to "${newDueDate}". Status automatically changed from "overdue" to "open".`
        : `Due date extended from "${ticket.dueDate}" to "${newDueDate}".`;
      
      const newWorkLog = {
        content: workLogContent,
        author: currentUser.name || 'Admin',
        type: 'due_date_extension'
      };
      
      dispatch(addWorkLog({ ticketId: ticket.id, workLog: newWorkLog }));
      
      // 성공 모달 표시
      setShowSuccessModal(true);
      
    } catch (err) {
      setError('Failed to update due date. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  if (!ticket) return null;

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
        <Modal.Title>
          <span style={{ color: '#721c24' }}>⚠️ Overdue Ticket - Extend Due Date</span>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

        {/* 티켓 정보 */}
        <div style={{ marginBottom: '24px' }}>
          <h5>{ticket.title}</h5>
          <p style={{ whiteSpace: 'pre-line', color: '#666', marginBottom: '16px' }}>
            {ticket.description}
          </p>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Badge bg={getPriorityBadgeColor(ticket.priority)}>
              Priority: {ticket.priority}
            </Badge>
            <Badge bg="danger">
              Status: {ticket.status}
            </Badge>
            <Badge bg="warning" text="dark">
              Current Due: {ticket.dueDate}
            </Badge>
            <Badge bg="info">
              Assignee: {ticket.assignee}
            </Badge>
          </div>
        </div>

        {/* 마감일 연장 섹션 */}
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h6 style={{ color: '#856404', marginBottom: '12px' }}>
            📅 Extend Due Date
          </h6>
          <p style={{ color: '#856404', fontSize: '14px', marginBottom: '16px' }}>
            This ticket is overdue. Please select a new due date to extend the deadline.
          </p>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Form.Control
              type="date"
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
              min={today}
              style={{ maxWidth: '200px' }}
            />
            <Button 
              variant="warning" 
              onClick={handleDueDateUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? 'Extending...' : 'Extend Due Date'}
            </Button>
          </div>
          
          {newDueDate && (
            <div style={{ marginTop: '12px' }}>
              <small style={{ color: '#856404' }}>
                Due date will be extended from <strong>{ticket.dueDate}</strong> to <strong>{newDueDate}</strong>
              </small>
            </div>
          )}
        </div>

        {/* 주의사항 */}
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#d1ecf1', 
          border: '1px solid #bee5eb', 
          borderRadius: '6px'
        }}>
          <small style={{ color: '#0c5460' }}>
            <strong>Note:</strong> Extending the due date will help track the ticket progress better. 
            Make sure to communicate with the assignee about the new deadline.
          </small>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>

    {/* 성공 모달 */}
    <Modal show={showSuccessModal} onHide={() => { setShowSuccessModal(false); onHide(); }} centered>
      <Modal.Body style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#e6f9ed" />
            <polyline points="20,34 30,44 46,24" fill="none" stroke="#2ecc71" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h4 style={{ color: '#2ecc71', marginBottom: 16 }}>Success!</h4>
        <div style={{ color: '#222', fontSize: 18, marginBottom: 24 }}>
          {successMessage || 'Due date has been successfully extended.'}
        </div>
        <Button variant="success" onClick={() => { setShowSuccessModal(false); onHide(); }}>
          OK
        </Button>
      </Modal.Body>
    </Modal>
  </>
  );
}