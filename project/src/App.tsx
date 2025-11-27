import { useState, useEffect } from 'react';
import { Plus, X, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const MOCK_DATA = [
  {
    id: 1,
    name: 'Yashwanth',
    role: 'Senior Developer',
    tasks: [
      { id: 1, title: 'Design API Architecture', status: 'Completed' },
      { id: 2, title: 'Code Review - Auth Module', status: 'In Progress' },
      { id: 3, title: 'Update Documentation', status: 'Pending' }
    ]
  },
  {
    id: 2,
    name: 'Indira',
    role: 'Frontend Engineer',
    tasks: [
      { id: 4, title: 'Build Dashboard UI', status: 'In Progress' },
      { id: 5, title: 'Implement Dark Mode', status: 'Completed' },
      { id: 6, title: 'Mobile Responsive Design', status: 'Pending' }
    ]
  },
  {
    id: 3,
    name: 'Ranjith',
    role: 'Product Manager',
    tasks: [
      { id: 7, title: 'Sprint Planning', status: 'Completed' },
      { id: 8, title: 'User Research Analysis', status: 'Completed' },
      { id: 9, title: 'Roadmap Q2 Planning', status: 'In Progress' }
    ]
  },
  {
    id: 4,
    name: 'Kalpana',
    role: 'Backend Developer',
    tasks: [
      { id: 10, title: 'Database Optimization', status: 'In Progress' },
      { id: 11, title: 'API Rate Limiting', status: 'Pending' },
      { id: 12, title: 'Write Unit Tests', status: 'Pending' }
    ]
  }
];

function App() {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ employeeId: '', title: '', status: 'Pending' });

  useEffect(() => {
    localStorage.removeItem('employeeTaskData');
    setEmployees(MOCK_DATA);
    localStorage.setItem('employeeTaskData', JSON.stringify(MOCK_DATA));
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('employeeTaskData', JSON.stringify(employees));
    }
  }, [employees]);

  const getFilteredEmployees = () => {
    if (filter === 'All') return employees;
    return employees.map(emp => ({
      ...emp,
      tasks: emp.tasks.filter(task => task.status === filter)
    })).filter(emp => emp.tasks.length > 0);
  };

  const getAllTasks = () => {
    return employees.flatMap(emp => emp.tasks);
  };

  const getTotalTasks = () => getAllTasks().length;
  const getCompletedTasks = () => getAllTasks().filter(t => t.status === 'Completed').length;
  const getPendingTasks = () => getAllTasks().filter(t => t.status === 'Pending').length;
  const getInProgressTasks = () => getAllTasks().filter(t => t.status === 'In Progress').length;
  const getCompletionRate = () => {
    const total = getTotalTasks();
    return total > 0 ? Math.round((getCompletedTasks() / total) * 100) : 0;
  };

  const handleAddTask = () => {
    if (!newTask.employeeId || !newTask.title.trim()) return;

    const updatedEmployees = employees.map(emp => {
      if (emp.id === parseInt(newTask.employeeId)) {
        return {
          ...emp,
          tasks: [...emp.tasks, { id: Date.now(), title: newTask.title, status: newTask.status }]
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setNewTask({ employeeId: '', title: '', status: 'Pending' });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Completed': 'bg-green-100 text-green-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      'Pending': 'bg-yellow-100 text-yellow-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const filteredEmployees = getFilteredEmployees();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <div className="text-3xl font-bold mb-2 text-gray-800">Employee Task Tracker</div>
          <div className="text-gray-500 mb-6">Manage and monitor tasks across your team</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1">Total Tasks</div>
                <div className="text-3xl font-bold text-gray-800">{getTotalTasks()}</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1">Completed</div>
                <div className="text-3xl font-bold text-green-600">{getCompletionRate()}%</div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1">Pending</div>
                <div className="text-3xl font-bold text-yellow-600">{getPendingTasks()}</div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:scale-[1.02] transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1">In Progress</div>
                <div className="text-3xl font-bold text-blue-600">{getInProgressTasks()}</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['All', 'Completed', 'In Progress', 'Pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="mb-4">
                <div className="text-xl font-bold text-gray-800">{employee.name}</div>
                <div className="text-gray-500 text-sm">{employee.role}</div>
              </div>
              <div className="space-y-3">
                {employee.tasks.map(task => (
                  <div key={task.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-gray-700 font-medium">{task.title}</div>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold text-gray-800">Add New Task</div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee
                </label>
                <select
                  value={newTask.employeeId}
                  onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Select an employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                onClick={handleAddTask}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg mt-6"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
