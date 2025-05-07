import Sidebar from "../islands/Sidebar.tsx";
import { DownIcon } from "../components/Icons.tsx";


export default function Reports() {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "oct", "nov", "dec"];

  return (
    <div class="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-2xl font-bold text-navy mb-6">Reports</h1>
        
        <div class="flex space-x-4 mb-6">
          {/* Category selector */}
          <div class="relative w-64">
            <button class="w-full flex items-center justify-between bg-gray-100 rounded-xl px-5 py-3 text-navy font-medium text-lg
                       shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]">
              <span>All Categories</span>
              <DownIcon/>
            </button>
          </div>

          {/* Period selector */}
          <div class="relative w-64">
            <button class="w-full flex items-center justify-between bg-gray-100 rounded-xl px-5 py-3 text-navy font-medium text-lg
                       shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d1d9e6,inset_-2px_-2px_6px_#ffffff]">
              <span>This Year</span>
              <DownIcon/>
            </button>
          </div>
        </div>
        
        {/* Chart */}
        <div class="bg-gray-100 rounded-xl shadow-[3px_3px_6px_#d1d9e6,-2px_-2px_6px_#ffffff] p-6">
          <div class="flex items-center mb-4">
            <div class="flex items-center mr-6">
              <svg class="w-4 h-4 text-navy mr-1" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40"></circle>
              </svg>
              <span class="text-navy font-medium">Income</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-blue-400 mr-1" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40"></circle>
              </svg>
              <span class="text-navy font-medium">Expenses</span>
            </div>
          </div>
          
          <div class="h-80 relative">
            {/* Reference horizontal lines */}
            <div class="absolute w-full h-full flex flex-col justify-between">
              <div class="border-b border-gray-200"></div>
              <div class="border-b border-gray-200"></div>
              <div class="border-b border-gray-200"></div>
              <div class="border-b border-gray-200"></div>
              <div class="border-b border-gray-200"></div>
            </div>
            
            {/* SVG Chart (simplified version) */}
            <svg class="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
              {/* Income line */}
              <path d="M0,280 Q100,260 200,180 Q300,250 400,150 Q500,120 600,180 Q700,150 800,100 Q900,50 1000,20 Q1100,10 1200,10" 
                    stroke="#0a2342" 
                    fill="none" 
                    stroke-width="3" />
              
              {/* Expenses line */}
              <path d="M0,290 Q100,270 200,240 Q300,270 400,250 Q500,220 600,240 Q700,230 800,190 Q900,160 1000,130 Q1100,110 1200,80" 
                    stroke="#93c5fd" 
                    fill="none" 
                    stroke-width="3" />
            </svg>
            
            {/* Months */}
            <div class="flex justify-between mt-4">
              {months.map((month) => (
                <div key={month} class="text-navy text-sm">{month}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}