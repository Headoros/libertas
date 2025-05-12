import request from 'supertest';
import express, { Application } from 'express';
import { fetchEvents } from '../controllers/event.controller';
import { getEvents } from '../services/event.service';
import EventMessageBus from '../event-message-bus';

jest.mock('../event-message-bus', () => {
    const mockConnect = jest.fn().mockResolvedValue(undefined);
    const mockPublishEvent = jest.fn().mockResolvedValue(undefined);
    const mockClose = jest.fn().mockResolvedValue(undefined);

    return jest.fn(() => ({
        connect: mockConnect,
        publishEvent: mockPublishEvent,
        close: mockClose,
    }));
});

// Mock the event service to control its behavior during the test
jest.mock('../services/event.service', () => ({
    getEvents: jest.fn(),
}));

describe('GET /events', () => {
    let app: Application;
    const mockMessageBusInstance = new (EventMessageBus as jest.Mock)()

    beforeEach(() => {
        // Create a new express app for each test to avoid interference
        app = express();
        app.get('/events', fetchEvents);
    });

    afterEach(() => {
        // Clear all mocks after each test to ensure isolation
        jest.clearAllMocks();
    });

    afterAll(async () => {
        // Simulate closing the message bus connection after all tests
        await mockMessageBusInstance.close();
      });

    it('should return a 200 OK and an empty array if no events exist', async () => {
        // Arrange: Mock the getEvents service to return an empty array
        (getEvents as jest.Mock).mockResolvedValue([]);

        // Act: Make a GET request to the /events endpoint
        const response = await request(app).get('/events');

        // Assert: Check the response status and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
        expect(getEvents).toHaveBeenCalledTimes(1); // Ensure the service was called
    });

    it('should return a 200 OK and an array of events if events exist', async () => {
        // Arrange: Mock the getEvents service to return a sample array of events
        const mockEvents = [
            { id: 1, name: 'Event 1', date: '2025-05-15' },
            { id: 2, name: 'Event 2', date: '2025-05-16' },
        ];
        (getEvents as jest.Mock).mockResolvedValue(mockEvents);

        // Act: Make a GET request to the /events endpoint
        const response = await request(app).get('/events');

        // Assert: Check the response status and body
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockEvents);
        expect(getEvents).toHaveBeenCalledTimes(1); // Ensure the service was called
    });

    it('should return a 500 Internal Server Error if the service throws an error', async () => {
        // Arrange: Mock the getEvents service to throw an error
        (getEvents as jest.Mock).mockRejectedValue(new Error('Database error'));

        // Act: Make a GET request to the /events endpoint
        const response = await request(app).get('/events');

        // Assert: Check the response status and error message
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ message: 'Error fetching events' });
        expect(getEvents).toHaveBeenCalledTimes(1); // Ensure the service was called
    });
});