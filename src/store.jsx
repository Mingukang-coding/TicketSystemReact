import { configureStore, createSlice } from '@reduxjs/toolkit'

// sampleTickets 전체 mock 데이터
const sampleTickets = [
  {
    id: 1703123456789,
    title: 'Server downtime issue',
    description: 'The main server is down and the service is unavailable. Immediate action required.',
    assignee: 'Admin User',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-07-15',
    workLogs: [
      {
        id: 1703123456790,
        content: 'Initial investigation started. Server appears to be unresponsive.',
        timestamp: '2025-01-15T10:30:00Z',
        author: 'Admin User',
        type: 'status_update'
      },
      {
        id: 1703123456791,
        content: 'Identified the issue as database connection timeout. Working on fix.',
        timestamp: '2025-01-15T11:45:00Z',
        author: 'Admin User',
        type: 'progress_update'
      }
    ]
  },
  {
    id: 1703123456792,
    title: 'Database backup failure',
    description: 'Scheduled database backup failed last night. Please investigate the cause.',
    assignee: 'Admin User',
    priority: 'high',
    status: 'overdue',
    dueDate: '2025-07-21',
    workLogs: [
      {
        id: 1703123456793,
        content: 'Backup failure detected. Checking system logs for root cause.',
        timestamp: '2025-01-15T09:15:00Z',
        author: 'Admin User',
        type: 'investigation'
      }
    ]
  },
  {
    id: 1703123456794,
    title: 'Improve user authentication system',
    description: 'Enhance the security and UX of the login and registration process.',
    assignee: 'John Doe',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-07-23',
    workLogs: [
      {
        id: 1703123456795,
        content: 'Started working on the authentication system improvements.',
        timestamp: '2025-01-15T08:30:00Z',
        author: 'John Doe',
        type: 'progress_update'
      },
      {
        id: 1703123456796,
        content: 'Completed initial security audit. Found several areas for improvement.',
        timestamp: '2025-01-15T14:20:00Z',
        author: 'John Doe',
        type: 'progress_update'
      }
    ]
  },
  {
    id: 1703123456797,
    title: 'UI/UX design review',
    description: 'Review the new UI/UX designs and provide feedback to the design team.',
    assignee: 'Jane Smith',
    priority: 'low',
    status: 'overdue',
    dueDate: '2025-08-25',
    workLogs: [
      {
        id: 1703123456798,
        content: 'Received design files. Starting review process.',
        timestamp: '2025-01-15T10:00:00Z',
        author: 'Jane Smith',
        type: 'progress_update'
      }
    ]
  },
  {
    id: 1703123456799,
    title: 'Update API documentation',
    description: 'Update the API documentation to reflect recent changes and new endpoints.',
    assignee: 'Admin User',
    priority: 'medium',
    status: 'overdue',
    dueDate: '2025-06-30',
    workLogs: [
      {
        id: 1703123456800,
        content: 'Documentation update completed. All new endpoints are now documented.',
        timestamp: '2025-01-14T16:45:00Z',
        author: 'Admin User',
        type: 'completion'
      }
    ]
  },
  {
    id: 1703123456801,
    title: 'Security vulnerability patch',
    description: 'Apply the latest security patches to all production servers.',
    assignee: 'John Doe',
    priority: 'high',
    status: 'urgent',
    dueDate: '2026-01-17',
    workLogs: []
  },
  {
    id: 1703123456802,
    title: 'Set up performance monitoring',
    description: 'Implement performance monitoring tools for the backend services.',
    assignee: 'Admin User',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-05-31',
    workLogs: []
  },
  {
    id: 1703123456803,
    title: 'Improve code review process',
    description: 'Suggest improvements to the current code review workflow.',
    assignee: 'Sarah Wilson',
    priority: 'low',
    status: 'in-progress',
    dueDate: '2026-01-28',
    workLogs: [
      {
        id: 1703123456804,
        content: 'Analyzing current code review process. Gathering feedback from team members.',
        timestamp: '2025-01-15T13:15:00Z',
        author: 'Sarah Wilson',
        type: 'investigation'
      }
    ]
  },
  {
    id: 1703123456805,
    title: 'Login error inquiry',
    description: 'Users are experiencing login errors. Please check the authentication logs.',
    assignee: 'unassigned',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-07-23',
    workLogs: []
  },
  {
    id: 1703123456806,
    title: 'Feature request: new functionality',
    description: 'A customer requested a new feature. Please review and estimate.',
    assignee: 'unassigned',
    priority: 'low',
    status: 'in-progress',
    dueDate: '2025-08-30',
    workLogs: []
  },
  {
    id: 1703123456807,
    title: 'Payment system inspection',
    description: 'Inspect the payment system for any issues before the next release.',
    assignee: 'unassigned',
    priority: 'high',
    status: 'urgent',
    dueDate: '2025-07-06',
    workLogs: []
  },
  {
    id: 1703123456808,
    title: 'Email delivery failure',
    description: 'Some users are not receiving emails. Check the email server configuration.',
    assignee: 'unassigned',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-07-06',
    workLogs: []
  },
  {
    id: 1703123456809,
    title: 'Mobile app crash',
    description: 'The mobile app crashes on startup for some users. Investigate and fix.',
    assignee: 'unassigned',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-07-06',
    workLogs: []
  },
  {
    id: 1703123456810,
    title: 'Incorporate customer feedback',
    description: 'Review and incorporate recent customer feedback into the product.',
    assignee: 'unassigned',
    priority: 'low',
    status: 'in-progress',
    dueDate: '2025-07-06',
    workLogs: []
  },
  {
    id: 1703123456811,
    title: 'Server log analysis required',
    description: 'Analyze server logs for unusual activity or errors.',
    assignee: 'unassigned',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-07-17',
    workLogs: []
  }
];
// tickets 슬라이스 생성
const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: sampleTickets,
  reducers: {
    addTicket: (state, action) => {
      state.push(action.payload);
    },
    updateAssignee: (state, action) => {
      const { id, assignee } = action.payload;
      const ticket = state.find(t => t.id === id);
      if (ticket) {
        ticket.assignee = assignee;
      }
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      const ticket = state.find(t => t.id === id);
      if (ticket) {
        ticket.status = status;
      }
    },
    updateDueDate: (state, action) => {
      const { id, dueDate } = action.payload;
      const ticket = state.find(t => t.id === id);
      if (ticket) {
        ticket.dueDate = dueDate;
      }
    },
    addWorkLog: (state, action) => {
      const { ticketId, workLog } = action.payload;
      const ticket = state.find(t => t.id === ticketId);
      if (ticket) {
        if (!ticket.workLogs) {
          ticket.workLogs = [];
        }
        ticket.workLogs.push({
          id: Date.now(),
          content: workLog.content,
          timestamp: workLog.timestamp || new Date().toISOString(),
          author: workLog.author,
          type: workLog.type || 'progress_update'
        });
      }
    },
    updateWorkLog: (state, action) => {
      const { ticketId, logId, updates } = action.payload;
      const ticket = state.find(t => t.id === ticketId);
      if (ticket && ticket.workLogs) {
        const log = ticket.workLogs.find(l => l.id === logId);
        if (log) {
          Object.assign(log, updates);
        }
      }
    },
    deleteWorkLog: (state, action) => {
      const { ticketId, logId } = action.payload;
      const ticket = state.find(t => t.id === ticketId);
      if (ticket && ticket.workLogs) {
        ticket.workLogs = ticket.workLogs.filter(l => l.id !== logId);
      }
    },
    addSubtask: (state, action) => {
      const { ticketId, subtask } = action.payload;
      const ticket = state.find(t => t.id === ticketId);
      if (ticket) {
        if (!ticket.subtasks) {
          ticket.subtasks = [];
        }
        ticket.subtasks.push({
          id: Date.now(),
          title: subtask.title,
          description: subtask.description,
          status: 'pending',
          createdAt: new Date().toISOString(),
          createdBy: subtask.createdBy
        });
      }
    },
    updateSubtaskStatus: (state, action) => {
      const { ticketId, subtaskId, status } = action.payload;
      const ticket = state.find(t => t.id === ticketId);
      if (ticket && ticket.subtasks) {
        const subtask = ticket.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
          subtask.status = status;
        }
      }
    },
    deleteSubtask: (state, action) => {
      const { ticketId, subtaskId } = action.payload;
      const ticket = state.find(t => t.id === ticketId);
      if (ticket && ticket.subtasks) {
        ticket.subtasks = ticket.subtasks.filter(s => s.id !== subtaskId);
      }
    }
  }
});

export const { addTicket, updateAssignee, updateStatus, updateDueDate, addWorkLog, updateWorkLog, deleteWorkLog, addSubtask, updateSubtaskStatus, deleteSubtask } = ticketsSlice.actions;
export const selectTickets = state => state.tickets;

// 직원 데이터 7명 (admin: mingu)
const initialEmployees = [
  { id: 0, name: 'unassigned', email: 'unassigned@company.com', role: 'unassigned' },
  { id: 1, name: 'mingu', email: 'mg.kang0518@gmail.com', role: 'admin' },
  { id: 2, name: 'John Doe', email: 'john@company.com', role: 'employee' },
  { id: 3, name: 'Jane Smith', email: 'jane@company.com', role: 'employee' },
  { id: 4, name: 'Mike Johnson', email: 'mike@company.com', role: 'employee' },
  { id: 5, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'employee' },
  { id: 6, name: 'Emily Kim', email: 'emily@company.com', role: 'employee' },
  { id: 7, name: 'David Lee', email: 'david@company.com', role: 'employee' },
  {id: 8, name: 'Test', email: 'Test@test.com', role: 'employee'}
];

const employeesSlice = createSlice({
  name: 'employees',
  initialState: initialEmployees,
  reducers: {
    // 필요시 직원 추가/수정/삭제 reducer 추가
  }
});

export const selectEmployees = state => state.employees;

export default configureStore({
  reducer: {
    tickets: ticketsSlice.reducer,
    employees: employeesSlice.reducer
  }
}); 