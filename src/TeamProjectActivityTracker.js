import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProfileCard from './components/Profilecard/ProfileCard';
import TimelineGraph from './components/TimeLineGraph/TimelineGraph';
import './index.css'; // Import custom styles for grid layout

const ProjectTimeline = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [tooltip, setTooltip] = useState(null); // Tooltip content and position

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/projects.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
        }
        const jsonData = await response.json();
        setTeamMembers(jsonData);
      } catch (error) {
        console.error('Error fetching JSON:', error);
      }
    };

    fetchProjects();
  }, []);

  const generateWeeks = () => {
    const weeks = [];
    const startDate = new Date(`${selectedYear}-01-01`);
    const startDayOffset = startDate.getDay(); // Get the starting weekday
    const correctedStartDate = new Date(startDate);
  
    // Adjust the start date to the closest Monday
    correctedStartDate.setDate(correctedStartDate.getDate() - (startDayOffset === 0 ? 6 : startDayOffset - 1));
  
    const endDate = new Date(`${selectedYear}-12-31`);
  
    let currentDate = new Date(correctedStartDate);
    while (currentDate <= endDate) {
      weeks.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
  
    return weeks;
  };

  const generateMonths = (weeks) => {
    const months = [];
    let lastMonth = null;

    weeks.forEach((week, index) => {
      const month = week.toLocaleDateString('en-US', { month: 'short' });
      if (month !== lastMonth) {
        months.push({ month, weekIndex: index });
        lastMonth = month;
      }
    });

    return months;
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const isProjectActiveOnDay = (project, schedule, date) => {
    if (!Array.isArray(schedule)) return false;

    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);

    if (date < projectStart || date > projectEnd) return false;

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return schedule.includes(dayName);
  };

  const handleMouseOver = (e, date, projects) => {
    const rect = e.target.getBoundingClientRect();
    const tooltipContent = projects.length
      ? `Date: ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}\nProject: ${projects[0].name}`
      : `Date: ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;

    setTooltip({
      content: tooltipContent,
      x: rect.left + window.scrollX + 40,
      y: rect.top + window.scrollY - 40,
    });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  const weeks = generateWeeks();
  const months = generateMonths(weeks);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold mr-4">Data Science Pool Project Timeline</h2>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="appearance-none border rounded p-2 pr-8 text-gray-700"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {teamMembers.map((member) => (
        <div 
            key={member.name} 
            className="grid-container mb-30" // Add margin-bottom here for spacing
        >
            {/* Profile Section */}
            <div className="profile-column">
            <ProfileCard
                name={member.name}
                title={member.role || 'Team Member'}
                avatarUrl={member.avatarUrl || '/default-avatar.png'}
            />
            </div>

            {/* Timeline Section */}
            <div className="timeline-column">
            <TimelineGraph
                weeks={weeks}
                months={months}
                weekdays={weekdays}
                projects={member.projects}
                isProjectActiveOnDay={isProjectActiveOnDay}
                handleMouseOver={handleMouseOver}
                handleMouseOut={handleMouseOut}
            />
            </div>
        </div>
        ))}


      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute bg-gray-800 text-white text-sm py-1 px-2 rounded"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.content.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectTimeline;
