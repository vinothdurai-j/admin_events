# Mini Event Management System – Backend

Node.js + Express + MongoDB (Mongoose) + Joi + JWT + bcrypt

## 1. What the task asks
- **Admin** logs in, creates / edits / disables / deletes events and sees who registered.
- **User** registers / logs in, browses & searches events, opens details, registers, sees "My Registrations", cancels.
- Backend does all authentication, authorization and validation.

## 2. Run the project
```bash
npm install
# make sure MongoDB is running, then check values in .env
npm start        # or: npm run dev
```
Default admin is auto-created on first start from `.env`
(`admin@example.com` / `Admin@123`).

## 3. Folder structure
```
Backend/
├── config/db.js                      -> MongoDB connection
├── middlewares/
│   ├── auth.js                       -> authenticate, isAdmin, isUser
│   └── validate.js                   -> runs Joi schemas
├── models/
│   ├── admin/        (controller, model, router, service, validations.js)
│   ├── user/         (controller, model, router, service, validations.js)
│   ├── event/        (controller, model, router, service, validations.js)
│   └── registration/ (controller, model, router, service, validations.js)
├── routes/index.js                   -> registers all module routers
├── utils/
│   ├── createError.js  response.js  token.js  pagination.js
│   ├── escapeRegex.js  validationHelpers.js  seedAdmin.js
├── .env  .env.example  .gitignore  index.js  package.json
```
Flow of every request: **Router -> (auth + validate middleware) -> Controller -> Service -> Model**

## 4. Database collections
| Collection | Fields |
|---|---|
| admins | name, email (unique), password (hashed), role |
| users | name, email (unique), password (hashed), phone, role |
| events | name, description, category, location, eventDate, maxParticipants, registeredCount, status (ACTIVE/INACTIVE), createdBy |
| registrations | event, user, status (REGISTERED/CANCELLED), registeredAt, cancelledAt — unique index on (event, user) |

## 5. API list (all start with `/api`)
Send token as header `Authorization: Bearer <token>`

| Method | URL | Who | Body / Query |
|---|---|---|---|
| POST | /admin/login | public | email, password |
| POST | /user/register | public | name, email, password, phone? |
| POST | /user/login | public | email, password |
| GET | /user/profile | user | – |
| POST | /events | admin | name, description, category, location, eventDate, maxParticipants, status? |
| GET | /events/admin/list | admin | query: search, category, location, status, fromDate, toDate, page, limit |
| PUT | /events/:id | admin | any of name, description, category, location, eventDate, maxParticipants |
| PATCH | /events/:id/status | admin | status = ACTIVE / INACTIVE (disable / enable) |
| DELETE | /events/:id | admin | – |
| GET | /events | any logged in | query: search, category, location, fromDate, toDate, page, limit (only ACTIVE + upcoming) |
| GET | /events/:id | any logged in | users can open only ACTIVE events |
| POST | /registrations | user | eventId |
| GET | /registrations/my | user | – |
| PATCH | /registrations/:id/cancel | user | – |
| GET | /registrations/event/:eventId | admin | query: status, page, limit |

## 6. Business rules -> where they are coded
| Rule | File |
|---|---|
| Event exists / ACTIVE / date not passed / not already registered / seats available | models/registration/service/index.js -> registerForEvent |
| Same event twice not allowed | service check + unique index in registration model |
| Only admin can create/edit/disable/delete | middlewares/auth.js (isAdmin) used in event router |
| Cannot cancel after event date | registration service -> cancelRegistration |
| Cannot reduce maxParticipants below current registrations | event service -> updateEvent |
| Validation of all inputs | validations.js in each module + middlewares/validate.js |

## 7. Quick test order (Postman)
1. POST /api/admin/login -> copy admin token
2. POST /api/events (admin token) with a FUTURE eventDate, e.g. `2030-01-15T10:00:00Z`
3. POST /api/user/register -> copy user token
4. GET /api/events (user token) -> copy event `_id`
5. POST /api/registrations `{ "eventId": "<id>" }` -> success
6. Same call again -> 409 already registered
7. GET /api/registrations/my -> see registration, then PATCH /api/registrations/<id>/cancel
8. GET /api/registrations/event/<eventId> (admin token)

## 8. Interview notes
- Passwords are hashed with bcrypt, never returned (`select: false` in model).
- JWT contains `{ id, role }`; middleware reads it, so role checks need no extra DB call.
- Admin and User are separate collections (matches your existing `admin/` and `user/` modules).
- Capacity uses a stored `registeredCount`. Simple and easy to explain. For very high traffic, two users could grab the last seat at the same moment; the production fix is an atomic `findOneAndUpdate` with `$inc`.
