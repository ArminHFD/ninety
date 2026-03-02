export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold mb-8">NINETY</h1>

        <nav className="space-y-4">
          <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Dashboard
          </button>
          <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Habits
          </button>
          <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Journal
          </button>
          <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Focus Timer
          </button>
          <button className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Modules
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Welcome to your 90-day challenge.
          </p>
        </div>
      </div>

    </div>
  );
}