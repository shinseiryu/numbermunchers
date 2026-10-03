const db = require('../db');
const crypto = require('crypto');
const sessionController = {};

// Sessions last 50 minutes, matching the old Mongo `expires: 3000` setting.
const SESSION_TTL_MS = 3000 * 1000;

const selectSession = db.prepare('SELECT userID FROM sessions WHERE cookieID = ? AND createdAt > ?');
const insertSession = db.prepare('INSERT INTO sessions (cookieID, userID, createdAt) VALUES (?, ?, ?)');
const deleteSession = db.prepare('DELETE FROM sessions WHERE cookieID = ?');
const deleteExpired = db.prepare('DELETE FROM sessions WHERE createdAt <= ?');

sessionController.isLoggedIn = (req, res, next) => {
	const cookieID = req.cookies.muncher;
	if(!cookieID) return next();

	try {
		const session = selectSession.get(cookieID, Date.now() - SESSION_TTL_MS);
		if(session) res.locals.userId = session.userID;
		return next();
	}
	catch(err) {
		return next('Error in sessionController isLoggedIn: '+err.message);
	}
};


sessionController.startSession = (req, res, next) =>{
	const now = Date.now();
	res.locals.session = crypto.randomBytes(32).toString('hex');

	try {
		deleteExpired.run(now - SESSION_TTL_MS);
		insertSession.run(res.locals.session, res.locals.userId, now);
		return next();
	}
	catch(err) {
		return next('Error in sessionController startSession: '+err.message);
	}
};

sessionController.endSession = (req, res, next) =>{
	try {
		deleteSession.run(req.cookies.muncher);
		return next();
	}
	catch(err) {
		return next('Error in ending session: '+err.message);
	}
}

module.exports = sessionController;
