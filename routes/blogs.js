const User = require('../models/user');
const Blog = require ('../models/blog');

const jwt = require('jsonwebtoken');
const config = require('../config/database');


module.exports = (router) => {

  router.post('/newblog', (req, res) => {

    if(!req.body.title) {
      res.json({ success: false, message: " Blog title is required"});
    }
    else {
       if(!req.body.body) {
        res.json({ success: false, message: " Blog body is required"});
      } else {
        if(!req.body.createdBy) {
          res.json({ success: false, mesage: "Creater is required"});
        } else {
          const blog = new Blog({
            title: req.body.title,
            body:  req.body.body,
            createdBy: req.body.createdBy
          });

          blog.save((err) => {
            if(err) {
              if(err.errors) {
                if(err.errors.title) {
                  res.json({success: false, message: err.errors.title.message});
                } else {
                  if(err.errors.body) {
                    res.json({success: false, message: err.errors.body.message});
                  } else {
                    if(err.errors.createdBy) {
                      res.json({success: false, message: err.errors.createdBy.message});
                    } else {
                      res.json({success: false, message: err});
                    }
                  }
                }
              } else {
                  res.json({success: false, message: err});
              }
            } else {
              res.json({ success: true, message: "Blog created successfully"});
            }
          });
        }
      }
    }
  });

  //Get All Blogs
  router.get('/allBlogs', (req, res)=> {
    //res.send('hello');
    Blog.find((err, blogs) => {
      if(err) {
        res.json({ success: false, message: err });
      } else {
        if(!blogs) {
          res.json({ success: false, message: 'No Blog Found' });
        } else {
          res.json({ success: true, blogs: blogs });
        }
      }
    }).sort({ '_id': -1});
  });


  router.get('/singleBlog/:id', (req, res) => {
    if(!req.params.id) {
      res.json({ success: false, message: 'Blog Id not provided '});
    } else {
      Blog.findOne({ _id: req.params.id }, (err, blog) => {
        if(err) {
          res.json({success: false, message: 'Not a valid blog id'});
        } else {
          if(!blog) {
            res.json({success: false, mesage: 'Blog not found'});
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if(err) {
                res.json({ success: false, message: err});
              } else {
                if(!user) {
                  res.json({ success: false, message: 'Could not Authenticate User'}); 
                } else {
                  if(user.username !== blog.createdBy) {
                    res.json({ success: false, message: 'You are not authorized to edit this blog'}); 
                  } else {
                    res.json({ success: true, message: 'Success', blog: blog});
                  }
                }
              }
            });
          }
        }
      });
    }
    
  });

  router.get('/single/:id', (req, res) => {
    if(!req.params.id) {
      res.json({ success: false, message: 'Blog Id not provided '});
    } else {
      Blog.findOne({ _id: req.params.id }, (err, blog) => {
        if(err) {
          res.json({success: false, message: 'Not a valid blog id'});
        } else {
          if(!blog) {
            res.json({success: false, mesage: 'Blog not found'});
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if(err) {
                res.json({ success: false, message: err});
              } else {
                if(!user) {
                  res.json({ success: false, message: 'Could not Authenticate User'}); 
                } else {
                  res.json({ success: true, message: 'Success', blog: blog});
                }
              }
            });
          }
        }
      });
    }
    
  });

  router.put('/updateBlog/', (req, res) => {
   if(!req.body._id) {
    res.json({ success: false, message: 'Blog Id not provided '});
   } else {
    Blog.findOne({ _id: req.body._id }, (err, blog) => {
      if(err) {
        res.json({success: false, message: 'Not a valid blog id'});
      } else {
        if(!blog) {
          res.json({success: false, mesage: 'Blog not found'});
        } else {
          User.findOne({ _id: req.decoded.userId }, (err, user) => {
            if(err) {
              res.json({ success: false, message: err});
            } else {
              if(!user) {
                res.json({ success: false, message: 'Could not Authenticate User'}); 
              } else {
                if(user.username !== blog.createdBy) {
                  res.json({ success: false, message: 'You are not authorized to edit this blog'}); 
                } else {
                  blog.title = req.body.title;
                  blog.body = req.body.body;
                  blog.save((err)=> {
                    if(err) {
                      res.json({ success: false, message: err}); 
                    } else {
                      res.json({ success : true, message: 'blog updated!'});
                    }                     
                  });
                }
              }
            }
          });
        }
      }
    });
   }
  });


  router.delete('/deleteBlog/:id', (req, res) => {
    if(!req.params.id) {
      res.json({ success: false, message: 'Blog Id not provided '});
    } else {
      Blog.findByIdAndRemove(req.params.id, (err)=> {
        if(err) {
          res.json({ success: false, message: err});
        } else {
           res.json({ success: true, message: 'blog deleted'});
        }
      })
    }

  });

  router.put('/likeBlog/', (req, res) => {
    if(!req.body.id) {
      res.json({ success: false, message: 'Blog id not provided!'});
    } else {
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        if(err) {
          res.json({ success: false, message: err});
        } else {
          if(!blog) {
            res.json({ success: false, message: 'Blog not found!'});
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if(err) {
                res.json({ success: false, message: err});
              } else {
                if(!user) {
                  res.json({ success: false, message: 'User cannot be authenticated!'});
                } else {
                  if(blog.likedBy.includes(user.username)) {
                    res.json({ success: false, message: 'You already have liked this post!'});
                  } else {
                    blog.likes ++;
                    blog.likedBy.push(user.username);

                    if(blog.dislikedBy.includes(user.username)) {
                      const index = blog.dislikedBy.indexOf(user.username);
                      blog.dislikedBy.splice(index, 1);
                      blog.dislikes --;
                    }
                    blog.save((err) => {
                      if(err) {
                        res.json({ success: false, message: 'Blog could not be liked!'});
                      } else {
                        res.json({ success: true, message: 'Blog liked!'})
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/dislikeBlog/', (req, res) => {
    if(!req.body.id) {
      res.json({ success: false, message: 'Blog id not provided!'});
    } else {
      Blog.findOne({ _id: req.body.id }, (err, blog) => {
        if(err) {
          res.json({ success: false, message: err});
        } else {
          if(!blog) {
            res.json({ success: false, message: 'Blog not found!'});
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if(err) {
                res.json({ success: false, message: err});
              } else {
                if(!user) {
                  res.json({ success: false, message: 'User cannot be authenticated!'});
                } else {
                  if(blog.dislikedBy.includes(user.username)) {
                    res.json({ success: false, message: 'You already have disliked this post!'});
                  } else {
                    blog.dislikes ++;
                    blog.dislikedBy.push(user.username);

                    if(blog.likedBy.includes(user.username)) {
                      const index = blog.likedBy.indexOf(user.username);
                      blog.likedBy.splice(index, 1);
                      blog.likes --;
                    }
                    blog.save((err) => {
                      if(err) {
                        res.json({ success: false, message: 'Blog could not be liked!'});
                      } else {
                        res.json({ success: true, message: 'Blog unliked!'})
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.post('/comments/', (req, res) => {
    if(!req.body.comments) {
      res.json({ success: false, message: 'No comments provided!'});
    } else {
      if(! req.body.id) {
        res.json({ success: false, message: 'No blog id provided! '});
      } else {
        Blog.findOne({ _id: req.body.id}, (err, blog) => {
          if(err) {
            res.json({ success: false, message: 'Error in finding blog' + err });
          } else {
            if(!blog) {
              res.json({ success: false, message: 'Blog not found!' });
            } else {
              User.findOne({ _id: req.decoded.userId}, (err, user) => {
                if(err) {
                  res.json({ success: false, message: 'Error in finding user ' + err});
                } else {
                  if(!user) {
                    res.json({ success: false, message: 'User not found!'});
                  } else {
                    blog.comments.push({
                      commnet: req.body.comments,
                      commentator: user.username
                    });
                    blog.save((err)=> {
                      if(err) {
                        res.json({ success: false, message:  'Error in Saving blog ' + err});
                      } else {
                        res.json({ success: true, message: 'Comments saved'});
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });

  return router;
};