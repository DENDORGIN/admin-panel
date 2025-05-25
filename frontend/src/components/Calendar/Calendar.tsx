import { useDisclosure } from "@chakra-ui/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CalendarEventsService } from "../../client";
import type { CalendarEventCreate, CalendarEventPublic } from "../../client";
import AddEventModal from "./AddEventModal";
import "./Calendar.css";
import useCustomToast from "../../hooks/useCustomToast";
import { EventInput } from "@fullcalendar/core";

const Calendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedDate, setSelectedDate] = useState<{ startStr: string; endStr: string; allDay: boolean } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useCustomToast();


  const { data: fetchedEvents, isLoading, refetch } = useQuery<CalendarEventPublic[]>({
    queryKey: ["calendarEvents"],
    queryFn: CalendarEventsService.readCalendarEvents,
  });

  // Formatting events
  useEffect(() => {
    if (fetchedEvents) {
      const formattedEvents: EventInput[] = fetchedEvents.map((event) => ({
        id: event.ID,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        allDay: event.allDay,
        color: event.color ?? undefined,
      }));
      setEvents(formattedEvents);
    }
  }, [fetchedEvents]);

  // Mutation for adding a new event
  const mutation = useMutation({
    mutationFn: (newEvent: CalendarEventCreate) => CalendarEventsService.createCalendarEvent(newEvent),
    onSuccess: (createdEvent: CalendarEventPublic) => {
      const formattedEvent: EventInput = {
        id: createdEvent.ID,
        title: createdEvent.title,
        start: createdEvent.startDate,
        end: createdEvent.endDate,
        allDay: createdEvent.allDay,
        color: createdEvent.color ?? undefined,
      };

      setEvents((prevEvents) => [...prevEvents, formattedEvent]); // ✅ Тепер всі події відповідають `EventInput`
      refetch();
    },
  });

  // Handling date selection for new events
  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate({
      startStr: selectInfo.startStr,
      endStr: selectInfo.endStr || selectInfo.startStr,
      allDay: selectInfo.allDay,
    });
    onOpen();
  };

  // Handling event addition
  const handleEventAdd = (newEvent: CalendarEventCreate) => {
    mutation.mutate(newEvent);
    onClose();
  };

  // Handling event click for deletion
  const handleEventClick = (clickInfo: any) => {
    if (window.confirm(`Delete event '${clickInfo.event.title}'?`)) {
      const eventId = clickInfo.event.id;
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      CalendarEventsService.deleteCalendarEvent(eventId).then(() => refetch());
      showToast("Deleted!", "Event deleted successfully.", "success");
    }
  };

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
      <div className="calendar-container">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            height="auto"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,  // ВИМКНЕННЯ AM/PM
            }}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,  // ВІДОБРАЖЕННЯ В 24-ГОДИННОМУ ФОРМАТІ
            }}
        />

        <AddEventModal
            isOpen={isOpen}
            onClose={onClose}
            onAddEvent={handleEventAdd}
            selectedDate={selectedDate}
        />
      </div>
  );
};

export default Calendar;
