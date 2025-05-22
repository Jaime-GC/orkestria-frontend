import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

// Import types only, to avoid server-side execution issues
type CalendarInstance = any;
type CalendarOptions = any;

export interface TuiEvent {
  id: string;
  calendarId: string;
  title: string;
  category: "time";
  start: string;   // ISO datetime
  end?: string;    // ISO datetime
  backgroundColor?: string;
  borderColor?: string;
  isReadOnly?: boolean;
  isAllDay?: boolean;
  raw?: {
    [key: string]: any;
  };
}

interface TuiCalendarProps {
  events: TuiEvent[];
  view: "week" | "month";
  height?: string;
}

export default function TuiCalendarIsland({ events, view, height = "700px" }: TuiCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add useEffect to inject CSS
  useEffect(() => {
    if (!isClient) return;
    
    // Add CSS link to head if not already present
    if (!document.querySelector('link[href*="toastui-calendar.min.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://uicdn.toast.com/calendar/latest/toastui-calendar.min.css';
      document.head.appendChild(link);
    }
  }, [isClient]);

  // Initialize calendar only on client side
  useEffect(() => {
    if (!isClient || !containerRef.current) return;
    
    // Dynamically import Calendar to avoid SSR issues
    (async () => {
      try {
        // Dynamic import
        const { default: Calendar } = await import('@toast-ui/calendar');
        
        calendarRef.current = new Calendar(containerRef.current, {
          defaultView: view,
          usageStatistics: false,
          isReadOnly: true,
          week: {
            startDayOfWeek: 1, // Monday
            dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            workweek: true,
            hourStart: 8,
            hourEnd: 20,
          },
          month: {
            startDayOfWeek: 1, // Monday
            dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          },
          calendars: [
            {
              id: '1',
              name: 'Horarios',
              color: '#ffffff',
              backgroundColor: '#4b76cc',
              borderColor: '#3c5da0',
            },
            {
              id: '2',
              name: 'Reservas',
              color: '#ffffff',
              backgroundColor: '#38a169',
              borderColor: '#276749',
            }
          ],
          template: {
            time(event) {
              return `<div class="p-2 ${event.isRead ? 'line-through' : ''}">
                        <div class="font-medium">${event.title}</div>
                      </div>`;
            }
          }
        });

        // Create initial events
        if (calendarRef.current && events.length > 0) {
          calendarRef.current.createEvents(events);
        }
      } catch (error) {
        console.error("Error initializing Toast UI Calendar:", error);
      }
    })();

    return () => {
      if (calendarRef.current) {
        calendarRef.current.destroy();
      }
    };
  }, [isClient, view]);

  // Update events when they change
  useEffect(() => {
    if (!isClient || !calendarRef.current) return;
    
    calendarRef.current.clear();
    calendarRef.current.createEvents(events);
  }, [events, isClient]);

  return (
    <div class="calendar-container">
      <div ref={containerRef} style={{ height }}>
        {!isClient && (
          <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            Cargando calendario...
          </div>
        )}
      </div>
    </div>
  );
}
