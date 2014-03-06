var posts = [];

function generateRandomId(id){
	var parts = id.toString().split(''),
			idLength = 30,
			idChars = '1234567890qwertyuiopasdfghjklzxcvbnm';
	while(parts.length < idLength){
		parts.push(idChars[Math.floor(Math.random()*idChars.length)]);
	}
	return parts.join('');
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
	res.json(posts);
};

exports.getPostsSince = function(req, res) {
	if (!req.params.hasOwnProperty('id')) {
		var errResponse = {
			message: "Invalid post index",
			err_code: "INV_POST"
		};
		return res.json(errResponse);
	}
	var id = req.params.id,
		index;
	for(var i = 0; i < posts.length-1; i+=1){
		if(posts[i].id === id){
			return res.json(posts.slice(i+1));
		}
	}
	return res.json([]);
};

exports.addPost = function(req, res) {
	if (!req.body.hasOwnProperty("user") || !req.body.hasOwnProperty("text")) {
		var errResponse = {
			message: "Invalid message",
			err_code: "INV_POST"
		};
		return res.json(errResponse);
	}
	posts.push({
		id: generateRandomId(posts.length),
		text: req.body.text.htmlEscape(),
		by: req.body.user.htmlEscape()
	});
	res.json(true);
};