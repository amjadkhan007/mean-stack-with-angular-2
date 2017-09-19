import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit {
  currentUrl;
  processing = false;
  messageClass;
  message;
  blogFound = false;
  blog;


  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }
  
  deleteBlog() {
    console.log("Blog Id: " + this.blog._id);
    this.processing = true;
    this.blogService.deleteBlog(this.blog._id).subscribe(data => {
      if(!data.success) {
        this.processing = false;
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
      } else {
        this.message = data.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate(['/blog']);
        }, 2000);
      }
    });

  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
      } else {
        this.blog= data.blog;
        this.blogFound = true;
      }
      
    });
  }

}
