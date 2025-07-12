import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus, addWorkLog, addSubtask, updateSubtaskStatus, deleteSubtask, selectTickets } from '../store';

export default function EmployeeTicketDetailModal({ show, onHide, ticket }) {
  const dispatch = useDispatch();
  const tickets = useSelector(selectTickets);
  const [newStatus, setNewStatus] = useState('');
  const [workLog, setWorkLog] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskDescription, setSubtaskDescription] = useState('');
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  // 현재 티켓의 최신 정보를 store에서 가져오기
  const currentTicketFromStore = tickets.find(t => t.id === ticket?.id);

  useEffect(() => {
    if (ticket) {
      setNewStatus(ticket.status);
      setCurrentTicket(ticket);
      setError('');
      setSuccessMessage('');
    }
  }, [ticket]);

  if (!ticket || !currentTicket) return null;

  const handleStatusUpdate = async () => {
    if (!newStatus.trim()) {
      setError('Please select a status.');
      return;
    }
    
    if (newStatus === currentTicket.status) {
      setError('Status is already set to this value.');
      return;
    }

    setIsUpdating(true);
    setError('');
    setSuccessMessage('');

    try {
      // update status action dispatch
      dispatch(updateStatus({ id: ticket.id, status: newStatus }));
      
      // local state update
      setCurrentTicket({ ...currentTicket, status: newStatus });
      
      // success message
      setSuccessMessage(`Status successfully updated to "${newStatus}"!`);
      
      // hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      setError('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddWorkLog = () => {
    if (!workLog.trim()) {
      setError('Please enter work log content.');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newWorkLog = {
      content: workLog,
      author: currentUser.name || 'Unknown',
      type: 'progress_update'
    };

    // Redux store에 workLog 추가
    dispatch(addWorkLog({ ticketId: ticket.id, workLog: newWorkLog }));
    
    setWorkLog('');
    setError('');
    setSuccessMessage('Work log added successfully!');
    
    // 1초 후 성공 메시지 숨기기
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleAddSubtask = () => {
    if (!subtaskTitle.trim()) {
      setError('Please enter subtask title.');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    const newSubtask = {
      title: subtaskTitle,
      description: subtaskDescription,
      createdBy: currentUser.name || 'Unknown'
    };

    // Redux store에 subtask 추가
    dispatch(addSubtask({ ticketId: ticket.id, subtask: newSubtask }));
    
    setSubtaskTitle('');
    setSubtaskDescription('');
    setShowSubtaskForm(false);
    setError('');
    setSuccessMessage('Subtask added successfully!');
    
    // 2초 후 성공 메시지 숨기기
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleUpdateSubtaskStatus = (subtaskId, newStatus) => {
    dispatch(updateSubtaskStatus({ ticketId: ticket.id, subtaskId, status: newStatus }));
    setSuccessMessage('Subtask status updated!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleDeleteSubtask = (subtaskId) => {
    if (window.confirm('Are you sure you want to delete this subtask?')) {
      dispatch(deleteSubtask({ ticketId: ticket.id, subtaskId }));
      setSuccessMessage('Subtask deleted!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'overdue': return 'danger';
      case 'urgent': return 'danger';
      default: return 'secondary';
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

  const getSubtaskStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  const isStatusChanged = newStatus !== currentTicket.status;
  const workLogs = currentTicketFromStore?.workLogs || [];
  const subtasks = currentTicketFromStore?.subtasks || [];

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Ticket Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
        
        {/* 티켓 기본 정보 */}
        <div style={{ marginBottom: '24px' }}>
          <h5>{currentTicket.title}</h5>
          <p style={{ whiteSpace: 'pre-line', color: '#666' }}>{currentTicket.description}</p>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
            <Badge bg={getPriorityBadgeColor(currentTicket.priority)}>
              Priority: {currentTicket.priority}
            </Badge>
            <Badge bg={getStatusBadgeColor(currentTicket.status)}>
              Status: {currentTicket.status}
            </Badge>
            <Badge bg="info">
              Due: {currentTicket.dueDate}
            </Badge>
          </div>
        </div>

        {/* 상태 업데이트 섹션 */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          backgroundColor: isStatusChanged ? '#fff3cd' : '#f8f9fa', 
          borderRadius: '8px',
          border: isStatusChanged ? '2px solid #ffc107' : '1px solid #dee2e6',
          transition: 'all 0.3s ease-in-out'
        }}>
          <h6>Update Status</h6>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Form.Select 
              value={newStatus} 
              onChange={e => setNewStatus(e.target.value)}
              style={{ 
                maxWidth: '200px',
                borderColor: isStatusChanged ? '#ffc107' : undefined
              }}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
            <Button 
              variant={isStatusChanged ? "warning" : "primary"} 
              size="sm" 
              onClick={handleStatusUpdate}
              disabled={isUpdating || !isStatusChanged}
            >
              {isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                isStatusChanged ? 'Update Status' : 'No Changes'
              )}
            </Button>
            {isStatusChanged && (
              <small style={{ color: '#856404', fontWeight: 'bold' }}>
                ⚠️ Status will be changed from "{currentTicket.status}" to "{newStatus}"
              </small>
            )}
          </div>
        </div>

        {/* 작업 로그 섹션 */}
        <div style={{ marginBottom: '24px' }}>
          <h6>Add Work Log</h6>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={workLog}
              onChange={e => setWorkLog(e.target.value)}
              placeholder="Enter your progress update or work notes..."
            />
          </Form.Group>
          <Button 
            variant="success" 
            size="sm" 
            onClick={handleAddWorkLog}
            disabled={!workLog.trim()}
          >
            Add Log
          </Button>
        </div>

        {/* 하위 작업 섹션 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h6>Subtasks ({subtasks.length})</h6>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => setShowSubtaskForm(!showSubtaskForm)}
            >
              {showSubtaskForm ? 'Cancel' : '+ Add Subtask'}
            </Button>
          </div>

          {/* 하위 작업 추가 폼 */}
          {showSubtaskForm && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              marginBottom: '16px',
              border: '1px solid #dee2e6'
            }}>
              <h6 style={{ marginBottom: '12px' }}>Add New Subtask</h6>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={subtaskTitle}
                  onChange={e => setSubtaskTitle(e.target.value)}
                  placeholder="Enter subtask title..."
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={subtaskDescription}
                  onChange={e => setSubtaskDescription(e.target.value)}
                  placeholder="Enter subtask description (optional)..."
                />
              </Form.Group>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={handleAddSubtask}
                  disabled={!subtaskTitle.trim()}
                >
                  Add Subtask
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    setShowSubtaskForm(false);
                    setSubtaskTitle('');
                    setSubtaskDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* 하위 작업 목록 */}
          {subtasks.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No subtasks yet.</p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {subtasks.map(subtask => (
                <div key={subtask.id} style={{ 
                  padding: '12px', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '6px', 
                  marginBottom: '8px',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <h6 style={{ margin: 0, marginBottom: '4px' }}>{subtask.title}</h6>
                      {subtask.description && (
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{subtask.description}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <Form.Select
                        size="sm"
                        value={subtask.status}
                        onChange={e => handleUpdateSubtaskStatus(subtask.id, e.target.value)}
                        style={{ width: 'auto', minWidth: '120px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </Form.Select>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteSubtask(subtask.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Badge bg={getSubtaskStatusBadgeColor(subtask.status)}>
                      {subtask.status}
                    </Badge>
                    <small style={{ color: '#6c757d' }}>
                      Created by {subtask.createdBy} on {new Date(subtask.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* work log history */}
        <div>
          <h6>Work Log History ({workLogs.length})</h6>
          {workLogs.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No work logs yet.</p>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {workLogs.map(log => (
                <div key={log.id} style={{ 
                  padding: '12px', 
                  border: '1px solid #dee2e6', 
                  borderRadius: '6px', 
                  marginBottom: '8px',
                  backgroundColor: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <small style={{ fontWeight: 'bold', color: '#495057' }}>
                      {log.author}
                    </small>
                    <small style={{ color: '#6c757d' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{log.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
} 