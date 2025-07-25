import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScheduleSelectionStep = ({ onNext, onBack, selectedSchedule, setSelectedSchedule }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Generate available time slots
  const timeSlots = [
    { id: 1, time: '8:00 AM', available: true },
    { id: 2, time: '9:00 AM', available: true },
    { id: 3, time: '10:00 AM', available: false },
    { id: 4, time: '11:00 AM', available: true },
    { id: 5, time: '12:00 PM', available: true },
    { id: 6, time: '1:00 PM', available: false },
    { id: 7, time: '2:00 PM', available: true },
    { id: 8, time: '3:00 PM', available: true },
    { id: 9, time: '4:00 PM', available: true },
    { id: 10, time: '5:00 PM', available: false },
    { id: 11, time: '6:00 PM', available: true },
  ];

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isSelected = selectedSchedule?.date?.toDateString() === date.toDateString();
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        isSelected,
        available: !isPast && isCurrentMonth && Math.random() > 0.3 // Mock availability
      });
    }
    
    return days;
  };

  // Generate week view days
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isSelected = selectedSchedule?.date?.toDateString() === date.toDateString();
      
      days.push({
        date,
        isToday,
        isPast,
        isSelected,
        available: !isPast && Math.random() > 0.2 // Mock availability
      });
    }
    
    return days;
  };

  const calendarDays = viewMode === 'week' ? generateWeekDays() : generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleDateSelect = (day) => {
    if (!day.available || day.isPast) return;
    
    setSelectedSchedule({
      date: day.date,
      timeSlot: null
    });
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    if (!timeSlot.available) return;
    
    setSelectedTimeSlot(timeSlot);
    setSelectedSchedule({
      ...selectedSchedule,
      timeSlot: timeSlot
    });
  };

  const handleNext = () => {
    if (selectedSchedule?.date && selectedSchedule?.timeSlot) {
      onNext(selectedSchedule);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Select Date & Time</h2>
        
        {/* View Mode Toggle */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
              viewMode === 'week' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
              viewMode === 'month' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateMonth('prev')}
              className="w-8 h-8 p-0"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
              className="text-sm px-3 py-1 h-8"
            >
              Today
            </Button>
            <Button
              variant="outline"
              onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateMonth('next')}
              className="w-8 h-8 p-0"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(day)}
              disabled={day.isPast || !day.available}
              className={`p-2 text-sm rounded-lg transition-all duration-200 ${
                day.isSelected
                  ? 'bg-primary text-primary-foreground'
                  : day.isToday
                  ? 'bg-accent text-accent-foreground'
                  : day.available && !day.isPast
                  ? 'hover:bg-muted text-foreground'
                  : 'text-muted-foreground cursor-not-allowed'
              } ${
                viewMode === 'month' && !day.isCurrentMonth ? 'opacity-30' : ''
              }`}
            >
              {day.date.getDate()}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-xs text-muted-foreground">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted border border-border rounded-full"></div>
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted-foreground/30 rounded-full"></div>
            <span className="text-xs text-muted-foreground">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      {selectedSchedule?.date && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Available Times for {selectedSchedule.date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleTimeSlotSelect(slot)}
                disabled={!slot.available}
                className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  selectedTimeSlot?.id === slot.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : slot.available
                    ? 'bg-background text-foreground border-border hover:border-primary hover:bg-primary/5'
                    : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Service
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!selectedSchedule?.date || !selectedSchedule?.timeSlot}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Details
        </Button>
      </div>
    </div>
  );
};

export default ScheduleSelectionStep;