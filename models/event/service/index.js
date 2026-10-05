const Event = require('../model');
const Registration = require('../../registration/model');
const createError = require('../../../utils/createError');
const escapeRegex = require('../../../utils/escapeRegex');
const { getPagination } = require('../../../utils/pagination');

// Builds the MongoDB filter from search / category / location / date
const buildFilter = (query) => {
  const filter = {};

  if (query.search) {
    filter.name = { $regex: escapeRegex(query.search), $options: 'i' };
  }
  if (query.category) {
    filter.category = { $regex: `^${escapeRegex(query.category)}$`, $options: 'i' };
  }
  if (query.location) {
    filter.location = { $regex: escapeRegex(query.location), $options: 'i' };
  }
  if (query.fromDate || query.toDate) {
    filter.eventDate = {};
    if (query.fromDate) filter.eventDate.$gte = query.fromDate;
    if (query.toDate) filter.eventDate.$lte = query.toDate;
  }

  return filter;
};

// Gets events + pagination info for a given filter
const findEventsWithPagination = async (filter, query) => {
  const { page, limit, skip } = getPagination(query);

  const total = await Event.countDocuments(filter);
  const events = await Event.find(filter).sort({ eventDate: 1 }).skip(skip).limit(limit);

  return {
    events,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// ---------- Admin ----------
const createEvent = async (data, adminId) => {
  return await Event.create({ ...data, createdBy: adminId });
};

const getAllEventsForAdmin = async (query) => {
  const filter = buildFilter(query);
  if (query.status) filter.status = query.status;
  return await findEventsWithPagination(filter, query);
};

const updateEvent = async (eventId, data) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw createError(404, 'Event not found');
  }

  // Cannot reduce capacity below already registered users
  if (data.maxParticipants !== undefined && data.maxParticipants < event.registeredCount) {
    throw createError(
      400,
      `Max participants cannot be less than current registrations (${event.registeredCount})`
    );
  }

  Object.assign(event, data);
  await event.save();
  return event;
};

const updateEventStatus = async (eventId, status) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw createError(404, 'Event not found');
  }

  event.status = status;
  await event.save();
  return event;
};

const deleteEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw createError(404, 'Event not found');
  }

  await Registration.deleteMany({ event: eventId }); // remove its registrations too
  await event.deleteOne();
};

// ---------- User ----------
const getActiveEvents = async (query) => {
  const filter = buildFilter(query);
  filter.status = 'ACTIVE'; // users only see ACTIVE events

  // By default show only upcoming events
  if (!query.fromDate) {
    filter.eventDate = { ...filter.eventDate, $gte: new Date() };
  }

  return await findEventsWithPagination(filter, query);
};

// Admin can open any event, user can open only ACTIVE events
const getEventById = async (eventId, role) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw createError(404, 'Event not found');
  }
  if (role !== 'admin' && event.status !== 'ACTIVE') {
    throw createError(404, 'Event not found');
  }
  return event;
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
