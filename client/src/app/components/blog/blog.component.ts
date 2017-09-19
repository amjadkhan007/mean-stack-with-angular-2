import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  processing=false;
  newPost = false;
  loadingBlogs = false;
  form: FormGroup;
  commentForm;
  username;
  blogPosts = [];
  newComment = [];
  enabledComments = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) { 
      this.createNewBlogForm();
      this.createCommentForm();
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          this.validateTitle
        ])],
      body: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5000)
        ])]

    });
  }

  enableBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comments: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
        ])]
    });
  }

  enableCommentForm() {
    this.commentForm.get('comments').enable();
  }

  disableCommentForm() {
    this.commentForm.get('comments').disable();
  }


  validateTitle(controls) {
    const regExp = new RegExp(/^[a-zA-Z\-0-9 ]+$/); //alphanumeric and space allowed
    if(regExp.test(controls.value)) {
      return null;
    }else {
      return { 'validateTitle': true }
    }
  }

  newBlogForm() {
    this.newPost = true;
  }

  onBlogSubmit() {
    this.disableBlogForm();
    this.processing=true;
    var newBlog = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }

    this.blogService.createNewBlog(newBlog).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableBlogForm();
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.getAllBlogs();
        setTimeout(() => {
          // window.location.reload();
          this.resetBlogForm();
          
        }, 2000);
      }
    });
  }

  resetBlogForm() {
    this.processing=false;
    this.newPost=false;
    this.message="";
    this.messageClass="";
    this.enableBlogForm();
    this.form.reset();
  }

  goBack() {
    window.location.reload();
  }

  reloadBlogs() {
    this.loadingBlogs = true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs = false;
    }, 4000);
  }

  stringAsDate(dateStr: string) {
    return new Date(dateStr);
  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  cancelComment(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;

  }


  getAllBlogs() {
    this.blogService.getAllBlogs().subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.blogPosts = data.blogs;
      }
    });
  }

  likeBlog(blogId) {
    this.blogService.likeBlog(blogId).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.loadingBlogs = true;
        this.getAllBlogs();
        setTimeout(() => {
          this.loadingBlogs = false;
        }, 2000);
      }
    });
  }

  dislikeBlog(blogId) {
    this.blogService.dislikeBlog(blogId).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.loadingBlogs = true;
        this.getAllBlogs();
        setTimeout(() => {
          this.loadingBlogs = false;
        }, 2000);
      }
    });
  }

  postComment(id) {
    this.processing = true;
    this.disableCommentForm();
    const comment = this.commentForm.get('comments').value;
    this.blogService.postComment(id, comment).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = true;
        this.enableCommentForm();
      } else {
        this.processing = false;
        this.enableCommentForm();
        this.commentForm.reset();
        const index = this.newComment.indexOf(id);
        this.newComment.splice(index, 1);
        this.getAllBlogs();
        if(this.enabledComments.indexOf(id) == -1)
          this.expandComments(id);

      }
    });
  }

  expandComments(id) {
    this.enabledComments.push(id);

  }

  collapsComments(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });

    this.getAllBlogs();
  }

}
