import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TicketBoard from './TicketBoard';
import TicketsByAssignee from './TicketsByAssignee';
import { useSelector } from 'react-redux';

export default function AdminDashboard() {

  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tickets = useSelector(state => state.tickets);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
      {/* 사이드바 토글 버튼 */}
      <button
        onClick={()=>{toggleSidebar()}}
        style={{
          position: 'fixed',
          top: '70px',
          left: sidebarOpen ? '260px' : '10px',
          zIndex: 1001,
          background: 'RoyalBlue',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease-in-out',
          fontSize: '16px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>


      <div style={{ 
        width: sidebarOpen ? '250px' : '0', 
        flexShrink: 0, // keep the sidebar size fixed

        transition: 'width 0.3s ease-in-out'
      }}>
        <Sidebar 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
      </div>
      
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        transition: 'margin-left 0.3s ease-in-out',
        padding: 24
      }}>
        {activeFilter === 'assignee' ? (
          <TicketsByAssignee />
        ) : (
          <TicketBoard 
            tickets={tickets} 
            activeFilter={activeFilter} 
          />
        )}
      </div>
    </div>
  );
} 