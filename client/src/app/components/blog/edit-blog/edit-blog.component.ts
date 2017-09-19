import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';


@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  message;
  messageClass;
  currentUrl;
  loading = true;
  blog;
  processing = false;
  constructor(
    private formBuilder: FormBuilder,
    private location:Location,
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router
  ) { 
     // this.createForm();
  }

  
  // createForm() {
  //   this.form = this.formBuilder.group({

  //   });
  // }

  onBlogUpdateSubmit() {
    this.processing = true;
    this.blogService.updateBlog(this.blog).subscribe(data => {
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

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;
    this.blogService.getSingleBlog(this.currentUrl.id).subscribe(data => {
      if(!data.success) {
        this.message = data.message;
        this.messageClass = 'alert alert-danger';
      } else {
        this.blog= data.blog;
        this.loading = false;
      }
      
    });
  }


}
