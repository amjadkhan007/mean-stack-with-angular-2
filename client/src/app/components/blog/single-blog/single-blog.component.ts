import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.css']
})
export class SingleBlogComponent implements OnInit {
  message;
  messageClass;
  currentUrl;
  loading = true;
  post;
  processing = false;
  commentForm;
  username;
  newComment = [];
  enabledComments = [];
  blogFound = false;


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService,
    private router: Router 
  ) { 
      this.createCommentForm();
  }

  getSingleBlog() {
    this.loading = true;
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingle(this.currentUrl.id).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
      } else {
        this.post= data.blog;
        this.loading = false;
      }
      
    });
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

  likeBlog(blogId) {
    this.blogService.likeBlog(blogId).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.getSingleBlog();
      }
    });
  }

  dislikeBlog(blogId) {
    this.blogService.dislikeBlog(blogId).subscribe(data => {
      if(!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.getSingleBlog();
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
        this.getSingleBlog();
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

    this.getSingleBlog();
  }

}
