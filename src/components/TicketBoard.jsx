import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import TicketColumn from './TicketColumn';
import TicketCard from './TicketCard';
import TicketDetailModal from './TicketDetailModal';
import OverdueTicketModal from './OverdueTicketModal';
import AdminTicketProgressView from './AdminTicketProgressView';
import { useDispatch, useSelector } from 'react-redux';
import { updateAssignee, selectEmployees, updateStatus } from '../store';

export default function TicketBoard({ tickets, activeFilter }) {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmployees);
  // 모달 상태 및 선택 티켓 관리
  const [showModal, setShowModal] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [showProgressView, setShowProgressView] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // 직원 이름 목록 (assignees)
  const assignees = employees.map(emp => emp.name);

  // Overdue 자동 처리
  useEffect(() => {
    const now = new Date();
    tickets.forEach(ticket => {
      if (new Date(ticket.dueDate) < now && ticket.status !== 'overdue') {
        dispatch(updateStatus({ id: ticket.id, status: 'overdue' }));
      }
    });
  }, [tickets, dispatch]);

  // 필터링된 티켓들
  const getFilteredTickets = () => {
    // 현재 로그인한 사용자 정보 가져오기 (localStorage에서)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    switch (activeFilter) {
      case 'my':
        return tickets.filter(ticket => ticket.assignee === currentUser.name);
      case 'urgent':
        return tickets.filter(ticket => 
          ticket.priority === 'high' || 
          ticket.status === 'urgent' || 
          ticket.status === 'overdue'
        );
      case 'overdue':
        return tickets.filter(ticket => ticket.status === 'overdue');
      case 'completed':
        return tickets.filter(ticket => ticket.status === 'completed');
      default:
        return tickets;
    }
  };

  const filteredTickets = getFilteredTickets();
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Overdue: status가 'overdue'이거나 dueDate가 이미 지난 티켓
  const overdueTickets = filteredTickets.filter(ticket => ticket.status === 'overdue' || new Date(ticket.dueDate) < now);
  // Due in 24 hours: dueDate가 24시간 이내인 티켓
  const dueIn24Tickets = filteredTickets.filter(ticket => {
    const due = new Date(ticket.dueDate);
    return due > now && due <= next24h;
  });
  // Due later: 나머지
  const normalTickets = filteredTickets.filter(ticket =>
    ticket.status !== 'overdue' &&
    !(new Date(ticket.dueDate) > now && new Date(ticket.dueDate) <= next24h)
  );

  // TicketCard 클릭 핸들러
  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
    
    // Overdue 티켓인 경우 OverdueTicketModal 표시
    if (ticket.status === 'overdue' || new Date(ticket.dueDate) < new Date()) {
      setShowOverdueModal(true);
    } 
    // Unassigned 티켓인 경우 TicketDetailModal 표시
    else if (ticket.assignee === 'unassigned') {
      setShowModal(true);
    } 
    // 그 외의 경우 AdminTicketProgressView 표시
    else {
      setShowProgressView(true);
    }
  };

  // 담당자 변경 핸들러
  const handleUpdateAssignee = (id, assignee) => {
    dispatch(updateAssignee({ id, assignee }));
    setShowModal(false);
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ color: '#495057', marginBottom: '8px', paddingLeft: '16px',paddingTop: '54px' }}>
          Ticket Board
        </h4>
        <p style={{ color: '#6c757d', margin: 0, paddingLeft: '16px' }}>
          {activeFilter === 'all' ? 'All tickets' : 
           activeFilter === 'my' ? 'My assigned tickets' :
           activeFilter === 'urgent' ? 'Urgent tickets' :
           activeFilter === 'overdue' ? 'Overdue tickets' :
           activeFilter === 'completed' ? 'Completed tickets' : 'Filtered tickets'}
        </p>
      </div>
      
      {/* Unassigned Tickets 영역 */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        maxHeight: '480px',
        overflowY: 'auto'
      }}>
        <h4 style={{ color: '#495057', marginBottom: '8px', paddingLeft: '16px', paddingTop: '10px', paddingBottom: '16px' }}>
          Unassigned Tickets
        </h4>
        {filteredTickets.filter(ticket => ticket.assignee === 'unassigned').length === 0 ? (
          <p style={{ color: '#6c757d', margin: 0, paddingLeft: '16px' }}>
            담당자 미지정 티켓이 없습니다.
          </p>
        ) : (
          filteredTickets.filter(ticket => ticket.assignee === 'unassigned').map(ticket => (
            <div style={{ paddingLeft: '16px', paddingRight: '16px' }} key={ticket.id}>
              <TicketCard ticket={ticket} onClick={() => handleCardClick(ticket)} />
            </div>
          ))
        )}
      </div>

      <Row>
        <TicketColumn 
          title="Overdue" 
          tickets={overdueTickets} 
          columnType="overdue"
          onCardClick={handleCardClick}
        />
        <TicketColumn 
          title="Due in 24 hours" 
          tickets={dueIn24Tickets} 
          columnType="urgent"
          onCardClick={handleCardClick}
        />
        <TicketColumn 
          title="Due later" 
          tickets={normalTickets} 
          columnType="normal"
          onCardClick={handleCardClick}
        />
      </Row>

      <TicketDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        ticket={selectedTicket}
        assignees={assignees}
        onUpdateAssignee={handleUpdateAssignee}
      />
      
      <OverdueTicketModal
        show={showOverdueModal}
        onHide={() => setShowOverdueModal(false)}
        ticket={selectedTicket}
      />
      
      {showProgressView && selectedTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'white',
          zIndex: 1050,
          overflow: 'auto'
        }}>
          <AdminTicketProgressView
            ticket={selectedTicket}
            onBack={() => setShowProgressView(false)}
          />
        </div>
      )}
    </div>
  );
} 