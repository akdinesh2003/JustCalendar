import React, { useState, useEffect } from 'react';
import { 
  Paper, Grid, Typography, IconButton, Dialog, TextField, Button, Box,
  useTheme, ToggleButton, ToggleButtonGroup, Tabs, Tab 
} from '@mui/material';
import { 
  ChevronLeft, ChevronRight, Event, Note,
  CalendarViewMonth, CalendarViewWeek, CalendarViewDay,
  WbSunny, Cloud, Search
} from '@mui/icons-material';
import { useSwipeable } from 'react-swipeable';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isToday, getDay, addWeeks, startOfWeek, endOfWeek 
} from 'date-fns';

const Calendar = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [notes, setNotes] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState('');
  const [newNote, setNewNote] = useState('');
  const [reminderTime, setReminderTime] = useState(''); // Keep this only
  const [category, setCategory] = useState('default');  // Keep this only
  const [view, setView] = useState('month');            // Keep this only
  const [weather, setWeather] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Remove any duplicate declarations of these states below

  // Updated holidays list with Indian holidays
  const holidays = {
    '2024-01-01': { name: 'New Year\'s Day', type: 'national' },
    '2024-01-15': { name: 'Makar Sankranti', type: 'festival' },
    '2024-01-26': { name: 'Republic Day', type: 'national' },
    '2024-03-08': { name: 'Maha Shivaratri', type: 'festival' },
    '2024-03-25': { name: 'Holi', type: 'festival' },
    '2024-04-09': { name: 'Rama Navami', type: 'festival' },
    '2024-04-11': { name: 'Eid ul-Fitr', type: 'festival' },
    '2024-08-15': { name: 'Independence Day', type: 'national' },
    '2024-08-26': { name: 'Janmashtami', type: 'festival' },
    '2024-10-02': { name: 'Gandhi Jayanti', type: 'national' },
    '2024-10-31': { name: 'Diwali', type: 'festival' },
    '2024-12-25': { name: 'Christmas', type: 'festival' }
  };

  const handlePrevMonth = () => setCurrentDate(prev => addMonths(prev, -1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setOpenDialog(true);
  };

  // New: Delete event handler
  const handleDeleteEvent = (dateStr, index) => {
    setEvents(prev => {
      const updatedEvents = [...(prev[dateStr] || [])];
      updatedEvents.splice(index, 1);
      return { ...prev, [dateStr]: updatedEvents };
    });
  };

  const handleSave = () => {
    if (!selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    if (newEvent) {
      const eventObj = {
        title: newEvent,
        category: category,
        reminder: reminderTime,
        timestamp: new Date().toISOString()
      };
      setEvents(prev => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), eventObj]
      }));

      // Simple reminder notification demo
      if (reminderTime) {
        console.log(`Reminder set for ${newEvent} at ${reminderTime}`);
      }
    }
    if (newNote) {
      setNotes(prev => ({
        ...prev,
        [dateStr]: newNote
      }));
    }
    setNewEvent('');
    setNewNote('');
    setReminderTime('');
    setCategory('default');
    setOpenDialog(false);
  };

  // New: Clear search
  const clearSearch = () => setSearchTerm('');

  // Update renderCalendar to show events with delete buttons and filter by search
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startingDayIndex = getDay(monthStart);

    return (
      <Grid container spacing={1.5}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Grid item xs={1.71} key={day}>
            <Typography 
              align="center" 
              sx={{ 
                color: day === 'Sun' ? 'error.main' : 'primary.main',
                fontWeight: 600,
                fontSize: '0.9rem',
                pb: 1
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <Grid item xs={1.71} key={`empty-${i}`}>
            <Paper 
              sx={{ 
                height: '90px',
                visibility: 'hidden',
                bgcolor: 'transparent',
                boxShadow: 'none'
              }}
            />
          </Grid>
        ))}
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const holiday = holidays[dateStr];
          const dayEvents = events[dateStr] || [];
          const filteredEvents = dayEvents.filter(ev => ev.title.toLowerCase().includes(searchTerm.toLowerCase()));
          const hasNotes = notes[dateStr];
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;

          return (
            <Grid item xs={1.71} key={dateStr}>
              <Paper
                onClick={() => handleDateClick(day)}
                sx={{
                  height: '90px',
                  p: 1,
                  background: isToday(day) 
                    ? theme.palette.today.gradient
                    : holiday 
                    ? theme.palette.holiday.gradient
                    : isWeekend 
                    ? theme.palette.weekend.gradient
                    : theme.palette.background.gradient,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  boxShadow: holiday ? '0 4px 12px rgba(255, 152, 0, 0.2)' : 'none',
                  overflowY: 'auto'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    alignSelf: 'flex-end',
                    fontWeight: isToday(day) ? 700 : 500,
                    color: isWeekend ? 'error.main' : 'text.primary'
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                {holiday && (
                  <Typography 
                    variant="caption" 
                    sx={{
                      color: 'error.main',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      mt: 0.5,
                      textAlign: 'center'
                    }}
                  >
                    {holiday.name}
                  </Typography>
                )}
                {filteredEvents.map((event, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: categories[event.category]?.color || categories.default.color,
                      color: '#fff',
                      p: 0.5,
                      borderRadius: 1,
                      mb: 0.5,
                      fontSize: '0.65rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'default'
                    }}
                    onClick={e => e.stopPropagation()} // Prevent dialog open on event click
                  >
                    <Event fontSize="inherit" sx={{ mr: 0.5 }} />
                    <Typography sx={{ flexGrow: 1 }}>{event.title}</Typography>
                    <Button 
                      size="small" 
                      color="inherit" 
                      onClick={() => handleDeleteEvent(dateStr, index)}
                      sx={{ minWidth: 'auto', p: 0, ml: 1, color: '#fff' }}
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
                {hasNotes && (
                  <Note 
                    fontSize="small" 
                    color="secondary" 
                    titleAccess={notes[dateStr]}
                    sx={{ position: 'absolute', bottom: 8, right: 8 }}
                  />
                )}
                {dayEvents.length > 0 && (
                  <Typography variant="caption" sx={{ mt: 'auto', fontSize: '0.6rem', color: 'text.secondary' }}>
                    {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  // Event categories with colors
  const categories = {
    default: { color: '#1976d2', label: 'General' },
    meeting: { color: '#2196f3', label: 'Meeting' },
    birthday: { color: '#e91e63', label: 'Birthday' },
    reminder: { color: '#ff9800', label: 'Reminder' },
    task: { color: '#4caf50', label: 'Task' },
    holiday: { color: '#9c27b0', label: 'Holiday' }
  };

  // Add dialog content for mobile-like interface
  const renderDialogContent = () => (
    <Box sx={{ p: 3, minWidth: 300 }}>
      <Typography variant="h6" mb={2}>
        {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
      </Typography>
      
      <TextField
        select
        fullWidth
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        margin="normal"
        SelectProps={{
          native: true,
        }}
      >
        {Object.entries(categories).map(([key, value]) => (
          <option key={key} value={key} style={{ color: value.color }}>
            {value.label}
          </option>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Event Title"
        value={newEvent}
        onChange={(e) => setNewEvent(e.target.value)}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Reminder"
        type="datetime-local"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        fullWidth
        label="Notes"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        margin="normal"
        multiline
        rows={4}
      />

      <Button
        variant="contained"
        onClick={handleSave}  // Make sure this function is defined and in scope
        sx={{ mt: 2 }}
        fullWidth
      >
        Save
      </Button>
    </Box>
  );

  // Add swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextMonth(),
    onSwipedRight: () => handlePrevMonth(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // Add weather fetching (mock data for demo)
  useEffect(() => {
    const mockWeather = {
      temp: '28°C',
      condition: 'Sunny'
    };
    setWeather(mockWeather);
  }, [currentDate]);

  // Add view switching handler
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Add header with mobile-like controls
  const renderHeader = () => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Typography variant="h4">
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {weather.condition === 'Sunny' ? <WbSunny /> : <Cloud />}
          <Typography>{weather.temp}</Typography>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          <ToggleButton value="month">
            <CalendarViewMonth />
          </ToggleButton>
          <ToggleButton value="week">
            <CalendarViewWeek />
          </ToggleButton>
          <ToggleButton value="day">
            <CalendarViewDay />
          </ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search />,
          }}
          sx={{ mb: 2 }}
        />
        {searchTerm && (
          <Button size="small" onClick={clearSearch} sx={{ mb: 2 }}>
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );

  // Update the main return statement
  const renderMonthView = () => {
    // Your existing renderCalendar() logic for month view
    return renderCalendar();
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start, end });
  
    return (
      <Grid container spacing={1.5}>
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayEvents = events[dateStr] || [];
          const holiday = holidays[dateStr];
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
  
          return (
            <Grid item xs={12 / 7} key={dateStr}>
              <Paper
                onClick={() => handleDateClick(day)}
                sx={{
                  height: '120px',
                  p: 1,
                  background: isToday(day)
                    ? theme.palette.today.gradient
                    : holiday
                    ? theme.palette.holiday.gradient
                    : isWeekend
                    ? theme.palette.weekend.gradient
                    : theme.palette.background.gradient,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  boxShadow: holiday ? '0 4px 12px rgba(255, 152, 0, 0.2)' : 'none',
                  overflowY: 'auto'
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    alignSelf: 'flex-end',
                    fontWeight: isToday(day) ? 700 : 500,
                    color: isWeekend ? 'error.main' : 'text.primary'
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                {dayEvents.map((event, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{
                      bgcolor: categories[event.category]?.color || categories.default.color,
                      color: '#fff',
                      p: 0.5,
                      borderRadius: 1,
                      mb: 0.5,
                      fontSize: '0.65rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {event.title}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderDayView = () => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dayEvents = events[dateStr] || [];
    const holiday = holidays[dateStr];
    const isWeekend = getDay(currentDate) === 0 || getDay(currentDate) === 6;
  
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </Typography>
        <Paper
          sx={{
            p: 2,
            background: isToday(currentDate)
              ? theme.palette.today.gradient
              : holiday
              ? theme.palette.holiday.gradient
              : isWeekend
              ? theme.palette.weekend.gradient
              : theme.palette.background.gradient,
            borderRadius: '12px',
            minHeight: '200px'
          }}
        >
          {dayEvents.length === 0 ? (
            <Typography>No events for this day.</Typography>
          ) : (
            dayEvents.map((event, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  bgcolor: categories[event.category]?.color || categories.default.color,
                  color: '#fff',
                  p: 1,
                  borderRadius: 1,
                  mb: 1
                }}
              >
                {event.title}
              </Typography>
            ))
          )}
        </Paper>
      </Box>
    );
  };

  // Update your main render to conditionally render based on view
  return (
    <Box sx={{ p: 3, maxWidth: '95vw', margin: 'auto' }} {...swipeHandlers}>
      {renderHeader()}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        {renderDialogContent()}
      </Dialog>
    </Box>
  );
};

export default Calendar;