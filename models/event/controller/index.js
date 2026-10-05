const eventService = require('../service');
const { sendSuccess, sendError } = require('../../../utils/response');

// ---------- Admin ----------
const createEvent = async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    return sendSuccess(res, 201, 'Event created successfully', event);
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllEventsForAdmin = async (req, res) => {
  try {
    const result = await eventService.getAllEventsForAdmin(req.query);
    return sendSuccess(res, 200, 'Events fetched', result);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    return sendSuccess(res, 200, 'Event updated successfully', event);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const event = await eventService.updateEventStatus(req.params.id, req.body.status);
    return sendSuccess(res, 200, `Event status changed to ${event.status}`, event);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id);
    return sendSuccess(res, 200, 'Event deleted successfully');
  } catch (error) {
    return sendError(res, error);
  }
};

// ---------- User ----------
const getActiveEvents = async (req, res) => {
  try {
    const result = await eventService.getActiveEvents(req.query);
    return sendSuccess(res, 200, 'Events fetched', result);
  } catch (error) {
    return sendError(res, error);
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id, req.user.role);
    return sendSuccess(res, 200, 'Event fetched', event);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createEvent,
  getAllEventsForAdmin,
  updateEvent,
  updateEventStatus,
  deleteEvent,
  getActiveEvents,
  getEventById,
};
