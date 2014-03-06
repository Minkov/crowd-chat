var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/crowd-chat');

var MessageSchema = new mongoose.Schema({
	by: String,
	text: String,
	sentDate: Date
});

mongoose.model('Message', MessageSchema);

var Message = mongoose.model('Message');

function checkPostsCount() {
	if (posts.length >= maxPostsCount) {
		posts = posts.slice(posts.length - maxPostsCount);
	}
}

function checkPostsIndices() {
	if (posts.length) {
		if (posts[posts.length - 1].index >= maxPostIndex) {
			for (var i = 0; i < posts.length; i += 1) {
				posts[i].index = i;
			}
		}
	}
}

if (!String.prototype.htmlEscape) {
	String.prototype.htmlEscape = function() {
		return this.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, "&#39")
			.replace(/ /g, "&nbsp;");
	};
}

exports.getPosts = function(req, res) {
	Message.find().exec()
		.then(function(messages) {
			console.log(messages);
			if (messages && messages.length) {
				res.json(messages);
			} else {
				res.json([]);
			}
		});
};

exports.getPostsSince = function(req, res) {
	if (!req.params.hasOwnProperty('id')) {
		var errResponse = {
			message: "Invalid post index",
			err_code: "INV_POST"
		};
		return res.json(errResponse);
	}
	var date;
	Message.find({
		'_id': req.params.id
	}).exec()
		.then(function(messages) {
			console.log('Here!');
			if (!messages.length) {
				res.json([]);
			}
			date = messages[0].get('sentDate');
			console.log(date);
			return Message.find().exec();
		})
		.then(function(messages) {
			var laterMessages = [];
			for (var i = 0; i < messages.length; i += 1) {
				if (messages[i].get('sentDate') > date) {
					laterMessages.push(messages[i]);
				}
			}
			res.json(laterMessages);
		});
};

exports.addPost = function(req, res) {
	if (!req.body.hasOwnProperty("user") || !req.body.hasOwnProperty("text")) {
		var errResponse = {
			message: "Invalid message",
			err_code: "INV_POST"
		};
		return res.json(errResponse);
	}
	var message = new Message({
		by: req.body.user.htmlEscape(),
		text: req.body.text.htmlEscape(),
		sentDate: new Date()
	});
	message.save(function(err, msg) {
		console.log(arguments);
		if (err) {
			res.status(400);
			return res.json(err);
		}
		res.json(msg);
	});

	// var post = {
	// index: posts.length,
	// username: req.body.user.htmlEscape(),
	// text: req.body.text.htmlEscape()
	// };

	// posts.push(post);
	// res.json(true);
};