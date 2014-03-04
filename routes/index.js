
/*
 * GET home page.
 */

/*
var posts =  posts || [{
	index: 0,
	text: "Sample 1",
	user: "Doncho Minkov",
	date: "04-03-2014 17:40:00"
}, {
	index: 1,
	text: "Sample 2",
	user: "Doncho Minkov",
	date: "04-03-2014 17:40:00"
}];
*/

var posts = [],
	maxPostIndex = 10000000,
	maxPostsCount = 10000;

function checkPostsCount(){
	if(posts.length >= maxPostsCount){
		posts = posts.slice(posts.length - maxPostsCount);
	}
}

function checkPostsIndices(){
	if(posts.length){
		if(posts[posts.length-1].index >= maxPostIndex){
			for(var i = 0; i < posts.length; i+=1){
				posts[i].index = i;
			}
		}
	}
}

if(!String.prototype.htmlEscape){
	String.prototype.htmlEscape = function() {
		 return this.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, "&#39")
					.replace(/ /g,"&nbsp;");
	};
}

exports.getPosts = function(req, res){
	checkPostsCount();
	checkPostsIndices();
	res.json(posts);
};

exports.getPostsSince = function(req, res){
	checkPostsCount();
	checkPostsIndices();
	if(!req.params.hasOwnProperty("index")){
		var errResponse = {
			message: "Invalid post index",
			err_code: "INV_POST"
		};
		return res.json(errResponse);
	}

	var index = parseInt(req.params.index);
	if(index<0 || index>posts.length) index = 0;
	res.json(posts.slice(index));
}

exports.addPost = function(req, res){
	if(!req.body.hasOwnProperty("user") ||
	 	!req.body.hasOwnProperty("text")){
		var errResponse = {
			message: "Invalid post",
			err_code: "INV_POST"
		};
		return res.json(errResponse);
	}

	var post = {
		index: posts.length,
		username: req.body.user.htmlEscape(),
		text: req.body.text.htmlEscape()
	};

	posts.push(post);
	res.json(true);
}