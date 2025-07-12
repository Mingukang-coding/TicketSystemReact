import React, { useState } from 'react';
import { Card, Badge, Button, Form, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateDueDate, updateStatus, addWorkLog, updateAssignee, selectTickets, selectEmployees } from '../store';

export default function AdminTicketProgressView({ ticket, onBack }) {
  const dispatch = useDispatch();
  const tickets = useSelector(selectTickets);
  const employees = useSelector(selectEmployees);
  
  const [newDueDate, setNewDueDate] = useState(ticket ? ticket.dueDate : '');
  const [newAssignee, setNewAssignee] = useState(ticket ? ticket.assignee : '');
  const [workLog, setWorkLog] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // 현재 티켓의 최신 정보를 store에서 가져오기
  const currentTicketFromStore = tickets.find(t => t.id === ticket?.id);

  React.useEffect(() => {
    if (ticket) {
      setNewDueDate(ticket.dueDate);
      setNewAssignee(ticket.assignee);
      setError('');
      setSuccessMessage('');
    }
  }, [ticket]);

  if (!ticket || !currentTicketFromStore) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Ticket not found</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  const handleDueDateUpdate = async () => {
    if (!newDueDate.trim()) {
      setError('Please select a due date.');
      return;
    }
    
    if (newDueDate === currentTicketFromStore.dueDate) {
      setError('Due date is already set to this value.');
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

    setIsUpdating(true);
    setError('');
    setSuccessMessage('');

    try {
      dispatch(updateDueDate({ id: ticket.id, dueDate: newDueDate }));
      
      // 마감일이 오늘 이후로 변경되면 status를 'open'으로 변경 (현재 overdue인 경우에만)
      const selectedDate = new Date(newDueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let statusChanged = false;
      if (selectedDate > today && currentTicketFromStore.status === 'overdue') {
        dispatch(updateStatus({ id: ticket.id, status: 'open' }));
        statusChanged = true;
        setSuccessMessage(`Due date updated to "${newDueDate}" and status changed to "open"!`);
      } else {
        setSuccessMessage(`Due date successfully updated to "${newDueDate}"!`);
      }
      
      // 작업 로그 추가
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const workLogContent = statusChanged 
        ? `Due date updated from "${currentTicketFromStore.dueDate}" to "${newDueDate}". Status automatically changed from "overdue" to "open".`
        : `Due date updated from "${currentTicketFromStore.dueDate}" to "${newDueDate}".`;
      
      const newWorkLog = {
        content: workLogContent,
        author: currentUser.name || 'Admin',
        type: 'due_date_update'
      };
      
      dispatch(addWorkLog({ ticketId: ticket.id, workLog: newWorkLog }));
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      setError('Failed to update due date. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssigneeUpdate = async () => {
    if (!newAssignee.trim()) {
      setError('Please select an assignee.');
      return;
    }
    
    if (newAssignee === currentTicketFromStore.assignee) {
      setError('Assignee is already set to this value.');
      return;
    }

    setIsUpdating(true);
    setError('');
    setSuccessMessage('');

    try {
      dispatch(updateAssignee({ id: ticket.id, assignee: newAssignee }));
      
      // 작업 로그 추가
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const workLogContent = `Assignee changed from "${currentTicketFromStore.assignee}" to "${newAssignee}".`;
      
      const newWorkLog = {
        content: workLogContent,
        author: currentUser.name || 'Admin',
        type: 'assignee_change'
      };
      
      dispatch(addWorkLog({ ticketId: ticket.id, workLog: newWorkLog }));
      
      setSuccessMessage(`Assignee successfully updated to "${newAssignee}"!`);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (err) {
      setError('Failed to update assignee. Please try again.');
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
      author: currentUser.name || 'Admin',
      type: 'admin_update'
    };

    dispatch(addWorkLog({ ticketId: ticket.id, workLog: newWorkLog }));
    
    setWorkLog('');
    setError('');
    setSuccessMessage('Work log added successfully!');
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
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

  const isDueDateChanged = newDueDate !== currentTicketFromStore.dueDate;
  const isAssigneeChanged = newAssignee !== currentTicketFromStore.assignee;
  const workLogs = currentTicketFromStore.workLogs || [];
  const subtasks = currentTicketFromStore.subtasks || [];

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const today = new Date().toISOString().split('T')[0];

  // Progress 계산 함수들
  const getProgressPercentage = (ticket) => {
    let mainTaskProgress = 0;
    let subtaskProgress = 0;
    let hasSubtasks = false;

    // Main task 진행도 계산
    switch (ticket.status) {
      case 'completed':
        mainTaskProgress = 100;
        break;
      case 'in-progress':
        mainTaskProgress = 60;
        break;
      case 'open':
        mainTaskProgress = 20;
        break;
      case 'overdue':
        mainTaskProgress = 30;
        break;
      default:
        mainTaskProgress = 10;
    }

    // Subtask 진행도 계산
    if (ticket.subtasks && ticket.subtasks.length > 0) {
      hasSubtasks = true;
      const completedSubtasks = ticket.subtasks.filter(subtask => subtask.status === 'completed').length;
      const inProgressSubtasks = ticket.subtasks.filter(subtask => subtask.status === 'in-progress').length;
      
      // 완료된 subtask: 100%, 진행 중인 subtask: 60%, 대기 중인 subtask: 0%
      const totalSubtaskProgress = (completedSubtasks * 100) + (inProgressSubtasks * 60);
      subtaskProgress = Math.round(totalSubtaskProgress / ticket.subtasks.length);
    }

    // 최종 진행도 계산
    if (hasSubtasks) {
      // Main task와 subtask를 가중 평균으로 계산
      // Main task: 40%, Subtask: 60% 가중치
      const weightedProgress = (mainTaskProgress * 0.4) + (subtaskProgress * 0.6);
      return Math.round(weightedProgress);
    } else {
      // Subtask가 없는 경우 main task 진행도만 사용
      return mainTaskProgress;
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return '#28a745'; // 초록색 (거의 완료)
    if (percentage >= 60) return '#17a2b8'; // 청록색 (진행 중)
    if (percentage >= 40) return '#ffc107'; // 노란색 (중간 진행)
    if (percentage >= 20) return '#fd7e14'; // 주황색 (시작됨)
    return '#dc3545'; // 빨간색 (시작 전/문제)
  };

  const getSubtaskStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Button 
            variant="outline-secondary" 
            onClick={onBack}
            style={{ marginRight: '16px' }}
          >
            ← Back to Ticket List
          </Button>
          <h4 style={{ margin: 0, color: '#495057' }}>Ticket Progress View</h4>
        </div>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Detailed view of ticket: {ticket.title}
        </p>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {successMessage && <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* 왼쪽 컬럼 - 티켓 정보 및 관리 */}
        <div>
          {/* 티켓 기본 정보 */}
          <Card style={{ marginBottom: '24px' }}>
            <Card.Header>
              <h5 style={{ margin: 0 }}>Ticket Information</h5>
            </Card.Header>
            <Card.Body>
              <h6>{currentTicketFromStore.title}</h6>
              <p style={{ whiteSpace: 'pre-line', color: '#666' }}>
                {currentTicketFromStore.description}
              </p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', marginBottom: '16px' }}>
                <Badge bg={getPriorityBadgeColor(currentTicketFromStore.priority)}>
                  Priority: {currentTicketFromStore.priority}
                </Badge>
                <Badge bg={getStatusBadgeColor(currentTicketFromStore.status)}>
                  Status: {currentTicketFromStore.status}
                </Badge>
                <Badge bg="info">
                  Due: {currentTicketFromStore.dueDate}
                </Badge>
                <Badge bg="secondary">
                  ID: {currentTicketFromStore.id}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ color: '#495057' }}>Overall Progress</strong>
                  <span style={{ color: '#6c757d', fontWeight: 'bold' }}>
                    {getProgressPercentage(currentTicketFromStore)}%
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '12px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '6px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${getProgressPercentage(currentTicketFromStore)}%`,
                    height: '100%',
                    backgroundColor: getProgressBarColor(getProgressPercentage(currentTicketFromStore)),
                    transition: 'width 0.3s ease-in-out'
                  }}></div>
                </div>
                <small style={{ color: '#6c757d' }}>
                  {subtasks.length > 0 
                    ? `Main task: ${currentTicketFromStore.status} | Subtasks: ${subtasks.filter(s => s.status === 'completed').length}/${subtasks.length} completed`
                    : `Main task: ${currentTicketFromStore.status}`
                  }
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* 마감일 업데이트 */}
          <Card style={{ marginBottom: '24px' }}>
            <Card.Header>
              <h6 style={{ margin: 0 }}>Update Due Date</h6>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <Form.Control
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  min={today}
                  style={{ maxWidth: '200px' }}
                />
                <Button 
                  variant={isDueDateChanged ? "warning" : "primary"} 
                  size="sm" 
                  onClick={handleDueDateUpdate}
                  disabled={isUpdating || !isDueDateChanged}
                >
                  {isUpdating ? 'Updating...' : 'Update Due Date'}
                </Button>
              </div>
              {isDueDateChanged && (
                <small style={{ color: '#856404' }}>
                  Due date will be changed from "{currentTicketFromStore.dueDate}" to "{newDueDate}"
                </small>
              )}
            </Card.Body>
          </Card>

          {/* 담당자 변경 */}
          <Card style={{ marginBottom: '24px' }}>
            <Card.Header>
              <h6 style={{ margin: 0 }}>Change Assignee</h6>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <Form.Select 
                  value={newAssignee} 
                  onChange={e => setNewAssignee(e.target.value)}
                  style={{ maxWidth: '200px' }}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </Form.Select>
                <Button 
                  variant={isAssigneeChanged ? "warning" : "primary"} 
                  size="sm" 
                  onClick={handleAssigneeUpdate}
                  disabled={isUpdating || !isAssigneeChanged}
                >
                  {isUpdating ? 'Updating...' : 'Update Assignee'}
                </Button>
              </div>
              {isAssigneeChanged && (
                <small style={{ color: '#856404' }}>
                  Assignee will be changed from "{currentTicketFromStore.assignee}" to "{newAssignee}"
                </small>
              )}
            </Card.Body>
          </Card>

          {/* 작업 로그 추가 */}
          <Card>
            <Card.Header>
              <h6 style={{ margin: 0 }}>Add Admin Note</h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={workLog}
                  onChange={e => setWorkLog(e.target.value)}
                  placeholder="Enter admin note or update..."
                />
              </Form.Group>
              <Button 
                variant="success" 
                size="sm" 
                onClick={handleAddWorkLog}
                disabled={!workLog.trim()}
              >
                Add Note
              </Button>
            </Card.Body>
          </Card>
        </div>

        {/* 오른쪽 컬럼 - Subtask 및 작업 로그 히스토리 */}
        <div>
          {/* Subtask 섹션 */}
          {subtasks.length > 0 && (
            <Card style={{ marginBottom: '24px' }}>
              <Card.Header>
                <h6 style={{ margin: 0 }}>Subtasks ({subtasks.filter(s => s.status === 'completed').length}/{subtasks.length} completed)</h6>
              </Card.Header>
              <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {subtasks.map(subtask => (
                  <div key={subtask.id} style={{ 
                    padding: '12px', 
                    border: '1px solid #dee2e6', 
                    borderRadius: '6px', 
                    marginBottom: '8px',
                    backgroundColor: subtask.status === 'completed' ? '#d4edda' : '#fff',
                    borderColor: subtask.status === 'completed' ? '#c3e6cb' : '#dee2e6'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <h6 style={{ 
                          margin: 0, 
                          marginBottom: '4px',
                          color: subtask.status === 'completed' ? '#155724' : '#495057',
                          textDecoration: subtask.status === 'completed' ? 'line-through' : 'none'
                        }}>
                          {subtask.title}
                        </h6>
                        {subtask.description && (
                          <p style={{ 
                            margin: 0, 
                            color: subtask.status === 'completed' ? '#155724' : '#666',
                            fontSize: '14px',
                            fontStyle: subtask.status === 'completed' ? 'italic' : 'normal'
                          }}>
                            {subtask.description}
                          </p>
                        )}
                      </div>
                      <Badge bg={getSubtaskStatusBadgeColor(subtask.status)}>
                        {subtask.status}
                      </Badge>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <small style={{ color: '#6c757d' }}>
                        Created by {subtask.createdBy}
                      </small>
                      <small style={{ color: '#6c757d' }}>
                        {new Date(subtask.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* 작업 로그 히스토리 */}
          <Card>
            <Card.Header>
              <h6 style={{ margin: 0 }}>Work Log History ({workLogs.length})</h6>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {workLogs.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                  No work logs yet
                </p>
              ) : (
                <div>
                  {workLogs.map(log => (
                    <div key={log.id} style={{ 
                      padding: '12px', 
                      border: '1px solid #dee2e6', 
                      borderRadius: '6px', 
                      marginBottom: '12px',
                      backgroundColor: '#fff'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong style={{ color: '#495057' }}>
                          {log.author}
                        </strong>
                        <small style={{ color: '#6c757d' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </small>
                      </div>
                      <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{log.content}</p>
                      {log.type && (
                        <small style={{ color: '#6c757d', fontStyle: 'italic' }}>
                          Type: {log.type}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
} 