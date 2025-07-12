import React, { useState } from 'react';
import { Card, Badge, Accordion, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import EmployeeTicketDetailModal from './EmployeeTicketDetailModal';

export default function MyProgressView() {
  const tickets = useSelector(state => state.tickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 현재 로그인한 사용자 정보 가져오기
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  // 현재 사용자에게 할당된 in-progress와 open 상태의 티켓들
  const progressTickets = tickets.filter(ticket => 
    ticket.assignee === currentUser.name && 
    (ticket.status === 'in-progress' || ticket.status === 'open')
  );

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'overdue': return 'danger';
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

  const getSubtaskStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return '#28a745'; // 초록색 (거의 완료)
    if (percentage >= 60) return '#17a2b8'; // 청록색 (진행 중)
    if (percentage >= 40) return '#ffc107'; // 노란색 (중간 진행)
    if (percentage >= 20) return '#fd7e14'; // 주황색 (시작됨)
    return '#dc3545'; // 빨간색 (시작 전/문제)
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#495057', marginBottom: '8px', paddingLeft: '16px', paddingTop: '54px' }}>
          My Progress
        </h4>
        <p style={{ color: '#6c757d', margin: 0, paddingLeft: '16px' }}>
          Active tickets and work progress
        </p>
      </div>

      {progressTickets.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#6c757d'
        }}>
          <h5>No active tickets</h5>
          <p>You don't have any open or in-progress tickets at the moment.</p>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {progressTickets.map(ticket => (
            <Card key={ticket.id} style={{ marginBottom: '20px', border: '1px solid #dee2e6' }}>
              <Card.Header style={{ 
                backgroundColor: ticket.status === 'in-progress' ? '#fff3cd' : '#e3f2fd',
                borderBottom: '1px solid #dee2e6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h6 style={{ margin: 0, fontWeight: 'bold' }}>{ticket.title}</h6>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Badge bg={getPriorityBadgeColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge bg={getStatusBadgeColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              </Card.Header>
              
              <Card.Body>
                <p style={{ color: '#666', marginBottom: '16px' }}>
                  {ticket.description.length > 100 
                    ? `${ticket.description.substring(0, 100)}...` 
                    : ticket.description
                  }
                </p>
                
                {/* progress bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <small style={{ color: '#6c757d' }}>Progress</small>
                    <small style={{ color: '#6c757d' }}>{getProgressPercentage(ticket)}%</small>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: '#e9ecef', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${getProgressPercentage(ticket)}%`,
                      height: '100%',
                      backgroundColor: getProgressBarColor(getProgressPercentage(ticket)),
                      transition: 'width 0.3s ease-in-out'
                    }}></div>
                  </div>
                </div>

                {/* Subtask preview */}
                {ticket.subtasks && ticket.subtasks.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h6 style={{ fontSize: '14px', marginBottom: '8px' }}>
                      Subtasks ({ticket.subtasks.filter(s => s.status === 'completed').length}/{ticket.subtasks.length} completed)
                    </h6>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {ticket.subtasks.map(subtask => (
                        <div key={subtask.id} style={{ 
                          padding: '8px', 
                          backgroundColor: subtask.status === 'completed' ? '#d4edda' : '#f8f9fa', 
                          borderRadius: '4px', 
                          marginBottom: '4px',
                          fontSize: '12px',
                          border: subtask.status === 'completed' ? '1px solid #c3e6cb' : '1px solid #dee2e6'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                            <strong style={{ 
                              color: subtask.status === 'completed' ? '#155724' : '#495057',
                              textDecoration: subtask.status === 'completed' ? 'line-through' : 'none'
                            }}>
                              {subtask.title}
                            </strong>
                            <Badge bg={getSubtaskStatusBadgeColor(subtask.status)} size="sm">
                              {subtask.status}
                            </Badge>
                          </div>
                          {subtask.description && (
                            <p style={{ 
                              margin: 0, 
                              color: subtask.status === 'completed' ? '#155724' : '#666',
                              fontSize: '11px',
                              fontStyle: subtask.status === 'completed' ? 'italic' : 'normal'
                            }}>
                              {subtask.description.length > 60 
                                ? `${subtask.description.substring(0, 60)}...` 
                                : subtask.description
                              }
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* work log preview */}
                <div style={{ marginBottom: '16px' }}>
                  <h6 style={{ fontSize: '14px', marginBottom: '8px' }}>Recent Work Logs</h6>
                  {ticket.workLogs && ticket.workLogs.length > 0 ? (
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {ticket.workLogs.slice(-5).map(log => (
                        <div key={log.id} style={{ 
                          padding: '8px', 
                          backgroundColor: '#f8f9fa', 
                          borderRadius: '4px', 
                          marginBottom: '4px',
                          fontSize: '12px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <strong style={{ color: '#495057' }}>{log.author}</strong>
                            <small style={{ color: '#6c757d' }}>
                              {new Date(log.timestamp).toLocaleDateString()}
                            </small>
                          </div>
                          <p style={{ margin: 0, color: '#666' }}>
                            {log.content.length > 80 
                              ? `${log.content.substring(0, 80)}...` 
                              : log.content
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#6c757d', fontSize: '12px', fontStyle: 'italic', margin: 0 }}>
                      No work logs yet
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: '#6c757d' }}>
                    Due: {ticket.dueDate}
                  </small>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleTicketClick(ticket)}
                  >
                    Update Progress
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
      <EmployeeTicketDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        ticket={selectedTicket}
      />
    </div>
  );
} 