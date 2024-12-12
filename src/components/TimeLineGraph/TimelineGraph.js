import React from 'react';

const TimelineGraph = ({
  weeks,
  months,
  weekdays,
  projects,
  isProjectActiveOnDay,
  handleMouseOver,
  handleMouseOut,
}) => {
  const today = new Date();

  return (
    <div>
      {/* SVG for the timeline */}
      <svg
        className="overflow-x-auto"
        viewBox={`0 0 ${weeks.length * 30 + 60} ${weekdays.length * 30 + 30}`}
      >
        {/* Month labels */}
        {months.map((month, index) => (
          <text
            key={index}
            x={month.weekIndex * 30 + 60}
            y="20"
            fontSize="14"
            fontWeight="bold"
            fill="#4B5563"
          >
            {month.month}
          </text>
        ))}

        {/* Timeline with weekday labels */}
        {weekdays.map((day, dayIndex) => (
          <g key={day}>
            {/* Weekday label */}
            <text
              x="0"
              y={dayIndex * 30 + 50}
              fontSize="12"
              fontWeight="bold"
              fill="#4B5563"
            >
              {day}
            </text>
            {/* Weekly grid */}
            {weeks.map((weekStart, weekIndex) => {
              const date = new Date(
                weekStart.getFullYear(),
                weekStart.getMonth(),
                weekStart.getDate() + dayIndex
              );
              const isToday =
                date.toDateString() === today.toDateString(); // Check if it's the current day
              const activeProjects = projects.filter((project) =>
                isProjectActiveOnDay(project, project.workdays, date)
              );
              return (
                <rect
                  key={`${weekIndex}-${dayIndex}`}
                  x={weekIndex * 30 + 60}
                  y={dayIndex * 30 + 30}
                  width="25"
                  height="25"
                  rx="5"
                  ry="5"
                  fill={activeProjects.length > 0 ? activeProjects[0].color : '#ffffff'}
                  stroke={isToday ? 'red' : '#e5e7eb'} // Add red outline for the current day
                  strokeWidth={isToday ? '2' : '1'} // Thicker outline for the current day
                  onMouseOver={(e) => handleMouseOver(e, date, activeProjects)}
                  onMouseOut={handleMouseOut}
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Legend below the graph */}
      <div className="legend mt-4 flex justify-end space-x-4">
        {projects
          .filter((project) => project.name !== 'Days Off') // Exclude "Days Off"
          .map((project, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 mr-2"
                style={{ backgroundColor: project.color }}
              ></div>
              <span className="text-sm">{project.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TimelineGraph;
