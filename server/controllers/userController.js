const db = require('../db');
const bcrypt = require('bcryptjs');
const userController ={};

// Columns that are safe to send to the client (never the password hash).
// id is exposed as _id because the frontend reads user._id.
const PUBLIC_COLUMNS = 'CAST(id AS TEXT) AS _id, userName, firstName, lastName, currentLevel, score';

const selectTopUsers = db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY score DESC LIMIT 10`);
const selectUserById = db.prepare(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`);
const selectUserByName = db.prepare('SELECT id, userName, password FROM users WHERE userName = ?');
const insertUser = db.prepare(`INSERT INTO users (userName, firstName, lastName, password)
	VALUES (@userName, @firstName, @lastName, @password)`);
const updateProgress = db.prepare('UPDATE users SET currentLevel = ?, score = ? WHERE id = ?');

userController.getUsers = (req, res, next) =>{
	try {
		res.locals.users = selectTopUsers.all();
		return next();
	}
	catch(err) {
		return next('Error in get users: '+err.message);
	}
};

userController.createUser = (req, res, next) => {
	const { userName, firstName, lastName, password } = req.body;
	if(!userName || !firstName || !lastName || !password){
		return next('Missing signup fields');
	}

	try {
		const encrypted = bcrypt.hashSync(password, 10);
		const result = insertUser.run({ userName, firstName, lastName, password: encrypted });
		res.locals.userId = Number(result.lastInsertRowid);
		res.locals.userName = userName;
		res.locals.user = selectUserById.get(res.locals.userId);
		return next();
	}
	catch(err) {
		return next(err);
	}
};

userController.getUser = (req, res, next) => {
	const user = res.locals.userId && selectUserById.get(res.locals.userId);
	if(user){
		res.locals.user = user;
		return next();
	}
	else{ 
		res.locals.user ={
			firstName: 'Guest',
			lastName: 'Player', 
			userName: 'Guest',
			currentLevel: 1,
			lives: 3,
			score: 0,
			status: 1,
			userID: '',
		};
		return next();
	}
};

userController.updateUser = (req, res, next) => {
	if(!res.locals.userId) return next();

	try {
		updateProgress.run(req.body.level, req.body.score, res.locals.userId);
		return next();
	}
	catch(err) {
		return next(err);
	}
};

userController.verifyUser = (req, res, next) => {
	const user = selectUserByName.get(req.body.userName);
	if(!user){
		return next('Incorrect username');
	}
	if(!bcrypt.compareSync(req.body.password || '', user.password)){
		return next('Incorrect password');
	}
	res.locals.userId = user.id;
	res.locals.userName = user.userName;
	return next();
};

module.exports = userController;
