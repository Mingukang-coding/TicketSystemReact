import React from 'react';
import { Nav } from 'react-bootstrap';

export default function EmployeeSidebar({ activeFilter, onFilterChange, isOpen, onToggle }) {
  const handleFilterChange = (filter) => {
    onFilterChange(filter);
  };

  return (
    <div style={{
      width: '250px',
      height: '100%',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      padding: '20px 0',
      overflowY: 'auto',
      transition: 'transform 0.3s ease-in-out',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
    }}>
      <div style={{ padding: '0 20px 20px 20px' }}>
        <h5 style={{ color: '#495057', marginBottom: '20px', fontWeight: 'bold' }}>
          Employee Dashboard
        </h5>
      </div>
      
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link
            onClick={() => handleFilterChange('my')}
            style={{
              color: activeFilter === 'my' ? '#007bff' : '#6c757d',
              backgroundColor: activeFilter === 'my' ? '#e3f2fd' : 'transparent',
              borderLeft: activeFilter === 'my' ? '4px solid #007bff' : '4px solid transparent',
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              fontWeight: activeFilter === 'my' ? 'bold' : 'normal'
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'my') {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.color = '#495057';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'my') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6c757d';
              }
            }}
          >
            📋 My Tickets
          </Nav.Link>
        </Nav.Item>
        
        <Nav.Item>
          <Nav.Link
            onClick={() => handleFilterChange('progress')}
            style={{
              color: activeFilter === 'progress' ? '#28a745' : '#6c757d',
              backgroundColor: activeFilter === 'progress' ? '#d4edda' : 'transparent',
              borderLeft: activeFilter === 'progress' ? '4px solid #28a745' : '4px solid transparent',
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              fontWeight: activeFilter === 'progress' ? 'bold' : 'normal'
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'progress') {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.color = '#495057';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'progress') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6c757d';
              }
            }}
          >
            📊 My Progress
          </Nav.Link>
        </Nav.Item>
        
        <Nav.Item>
          <Nav.Link
            onClick={() => handleFilterChange('urgent')}
            style={{
              color: activeFilter === 'urgent' ? '#dc3545' : '#6c757d',
              backgroundColor: activeFilter === 'urgent' ? '#f8d7da' : 'transparent',
              borderLeft: activeFilter === 'urgent' ? '4px solid #dc3545' : '4px solid transparent',
              padding: '12px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              fontWeight: activeFilter === 'urgent' ? 'bold' : 'normal'
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== 'urgent') {
                e.target.style.backgroundColor = '#f8f9fa';
                e.target.style.color = '#495057';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== 'urgent') {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6c757d';
              }
            }}
          >
            ⚠️ Urgent Tickets
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
} 