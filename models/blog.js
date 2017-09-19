var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

let titleLengthChecker = (title) => {
  if(!title) {
    return false;
  }
  else {
    if(title.length < 5 || title.length > 50) {

      return false; 

    }
    else {

      return true;
    }

  }
  
};

let alphanumericTitleChecker = (title) => {
   if(!title) {
    return false;
  }
  else {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title);
  }
};

const titleValidators = [
  {
    validator: titleLengthChecker,
    message: 'Title Must be at least 5 characters long, but no more than 50'
  },
  {
    validator: alphanumericTitleChecker,
    message: 'Title must be alphanumeric'
  }
];



let bodyLengthChecker = (body) => {
  if(!body) {
    return false;
  }
  else {
    if(body.length < 5 || body.length > 5000) {

      return false; 

    }
    else {

      return true;
    }

  }
  
};

const bodyValidators = [
  {
    validator: bodyLengthChecker,
    message: 'Body Must be at least 5 characters long, but no more than 5000'
  }
];


let commentLengthChecker = (commnet) => {
  if(!commnet[0]) {
    return false;
  }
  else {
    if(commnet[0] < 1 || commnet[0] > 200) {

      return false; 

    }
    else {

      return true;
    }

  }
  
};

const commentValidators = [
  {
    validator: commentLengthChecker,
    message: 'comments Must be at least 1 characters long, but no more than 200'
  }
];

const blogSchema = new Schema({
  title: {type: String, required: true, validate: titleValidators},
  body: {type: String, required: true, validate: bodyValidators},
  createdBy: {type: String},
  createdAt: {type: Date, default: Date.now()},
  likes: {type: Number, default: 0},
  likedBy: {type: Array},
  dislikes: {type: Number, default: 0},
  dislikedBy: {type: Array},
  comments: [
    {
      commnet: {type: String, validate: commentValidators},
      commentator: {type: String},
      commentDate: {type: Date, default: Date.now()}
    }
  ]
});

module.exports = mongoose.model('Blog', blogSchema);