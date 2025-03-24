import Event from '../models/notification.model';
import { EventAttributes } from '../types/event.types';

export const createEvent = async (eventData: EventAttributes): Promise<Event> => {
    return Event.create(eventData);
};

export const getEvents = async (): Promise<Event[]> => {
    return Event.findAll();
};

export const getEventById = async (id: number): Promise<Event | null> => {
    return Event.findByPk(id);
};