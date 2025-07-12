import React from 'react';
import { Nav} from 'react-bootstrap';

export default function Sidebar({ activeFilter, onFilterChange, isOpen, onToggle }) {
  const menuItems = [

    { key: 'all', label: 'All Tickets', icon: '📋' },
    { key: 'assignee', label: 'Tickets by Assignee', icon: '👤' },
    { key: 'overdue', label: 'Overdue Tickets', icon: '⚠️' },
    { key: 'urgent', label: 'Urgent Tickets', icon: '🚨' },
    { key: 'completed', label: 'Completed', icon: '✅' }

  ];

  return (
    <div 
      className="sidebar" 
      style={{ 
        backgroundColor: '#f8f9fa', 
        borderRight: '1px solid #dee2e6',
        padding: '20px 0',
        width: isOpen ? '250px' : '0',
        overflow: 'hidden',
        transition: 'width 0.3s ease-in-out',
        position: 'relative'
      }}
    >
      {/* close button */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#6c757d',
          zIndex: 1000,
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#e9ecef';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        ✕
      </button>

      <div style={{ 
        padding: '0 20px', 
        marginBottom: '20px',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        transitionDelay: isOpen ? '0.1s' : '0s'
      }}>
        <h5 style={{ color: '#495057', marginBottom: '15px' }}>Filters</h5>
      </div>
      
      <Nav className="flex-column">
        {menuItems.map((item, index) => (
          <Nav.Link
            key={item.key}
            active={activeFilter === item.key}
            onClick={() => onFilterChange(item.key)}
            style={{
              // bootstrap color code 
              color: activeFilter === item.key ? '#007bff' : '#6c757d',
              backgroundColor: activeFilter === item.key ? '#e3f2fd' : 'transparent',
              borderLeft: activeFilter === item.key ? '3px solid #007bff' : '3px solid transparent',
              padding: '12px 20px',
              margin: '2px 0',
              borderRadius: '0 4px 4px 0',
              transition: 'all 0.2s ease',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
              transitionDelay: isOpen ? `${0.1 + index * 0.05}s` : '0s'
            }}
          >
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
} 