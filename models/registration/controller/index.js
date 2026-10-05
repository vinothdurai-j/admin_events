const registrationService = require('../service');
const { sendSuccess, sendError } = require('../../../utils/response');

const register = async (req, res) => {
  try {
    const registration = await registrationService.registerForEvent(req.user.id, req.body.eventId);
    return sendSuccess(res, 201, 'Registered successfully', registration);
  } catch (error) {
    return sendError(res, error);
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await registrationService.getMyRegistrations(req.user.id);
    return sendSuccess(res, 200, 'My registrations fetched', registrations);
  } catch (error) {
    return sendError(res, error);
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await registrationService.cancelRegistration(req.user.id, req.params.id);
    return sendSuccess(res, 200, 'Registration cancelled', registration);
  } catch (error) {
    return sendError(res, error);
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const result = await registrationService.getEventRegistrations(req.params.eventId, req.query);
    return sendSuccess(res, 200, 'Event registrations fetched', result);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = { register, getMyRegistrations, cancelRegistration, getEventRegistrations };
