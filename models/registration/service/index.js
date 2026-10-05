const Registration = require('../model');
const Event = require('../../event/model');
const createError = require('../../../utils/createError');
const { getPagination } = require('../../../utils/pagination');

// Registration validation flow (same order as the task document)
const registerForEvent = async (userId, eventId) => {
  // 1. (User is already authenticated by the auth middleware)

  // 2. Event exists?
  const event = await Event.findById(eventId);
  if (!event) {
    throw createError(404, 'Event not found');
  }

  // 3. Event is ACTIVE?
  if (event.status !== 'ACTIVE') {
    throw createError(400, 'This event is not active');
  }

  // 4. Event date passed?
  if (event.eventDate <= new Date()) {
    throw createError(400, 'Registration closed. Event date has already passed');
  }

  // 5. Already registered?
  const existing = await Registration.findOne({ event: eventId, user: userId });
  if (existing && existing.status === 'REGISTERED') {
    throw createError(409, 'You have already registered for this event');
  }

  // 6. Capacity available?
  if (event.registeredCount >= event.maxParticipants) {
    throw createError(400, 'Event is full');
  }

  // 7. All checks passed -> create registration
  let registration;
  if (existing) {
    // user cancelled before and is registering again -> reuse the same row
    existing.status = 'REGISTERED';
    existing.registeredAt = new Date();
    existing.cancelledAt = undefined;
    registration = await existing.save();
  } else {
    registration = await Registration.create({ event: eventId, user: userId });
  }

  event.registeredCount += 1;
  await event.save();

  return registration;
};

const getMyRegistrations = async (userId) => {
  return await Registration.find({ user: userId })
    .populate('event', 'name description category location eventDate status')
    .sort({ createdAt: -1 });
};

const cancelRegistration = async (userId, registrationId) => {
  // user can cancel only his own registration
  const registration = await Registration.findOne({ _id: registrationId, user: userId });
  if (!registration) {
    throw createError(404, 'Registration not found');
  }
  if (registration.status === 'CANCELLED') {
    throw createError(400, 'Registration is already cancelled');
  }

  const event = await Event.findById(registration.event);
  if (event && event.eventDate <= new Date()) {
    throw createError(400, 'Cannot cancel after the event date has passed');
  }

  registration.status = 'CANCELLED';
  registration.cancelledAt = new Date();
  await registration.save();

  if (event && event.registeredCount > 0) {
    event.registeredCount -= 1;
    await event.save();
  }

  return registration;
};

// Admin: see who registered for an event
const getEventRegistrations = async (eventId, query) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw createError(404, 'Event not found');
  }

  const filter = { event: eventId };
  if (query.status) filter.status = query.status;

  const { page, limit, skip } = getPagination(query);
  const total = await Registration.countDocuments(filter);
  const registrations = await Registration.find(filter)
    .populate('user', 'name email phone')
    .sort({ registeredAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    event: {
      id: event._id,
      name: event.name,
      maxParticipants: event.maxParticipants,
      registeredCount: event.registeredCount,
    },
    registrations,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations,
};
