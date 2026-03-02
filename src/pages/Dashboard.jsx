export default function Dashboard() {
    return (
      <div>
        <div className="rounded-2xl bg-gray-100 p-5">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm font-medium text-gray-700">
            Welcome to your 90 Day Challenge
          </p>
  
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold">Todays Progress</div>
              <div className="mt-2 text-sm text-gray-600">
                Habits Completed: 0/0 <br />
                Journal: — <br />
                Focus Sessions: 0
              </div>
            </div>
  
            <div className="rounded-xl bg-white p-4 shadow-sm text-center">
              <div className="text-3xl font-bold">0 Day Streak 🔥</div>
            </div>
  
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold">Next Priority</div>
              <div className="mt-2 text-sm text-gray-600">
                No planner items added yet
              </div>
            </div>
  
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Progress</div>
                <div className="text-sm font-semibold">Day 0/90</div>
              </div>
  
              <div className="mt-3 grid grid-cols-10 gap-1">
                {Array.from({ length: 90 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-sm bg-gray-200"
                    title={`Day ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }