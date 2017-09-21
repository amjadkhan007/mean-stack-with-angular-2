import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class BlogService {

  domain = this.authService.domain;
  options;

  constructor(
    private http: Http,
    private authService: AuthService
  ) { }

  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = new RequestOptions({
      headers: new Headers ({
        'Content-Type': 'Application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  createNewBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + '/blogs/newblog/', blog, this.options).map(res => res.json());
  }

  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/blogs/allBlogs/', this.options).map(res => res.json());
  }

  getSingleBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/blogs/singleBlog/' + id, this.options).map(res => res.json());
  }

  getSingle(id) {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/blogs/single/' + id, this.options).map(res => res.json());
  }

  updateBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  deleteBlog(id) {
    this.createAuthenticationHeaders();
    return this.http.delete(this.domain + '/blogs/deleteBlog/'+ id, this.options).map(res => res.json());
  }

  
  likeBlog(id) {
    const blogData = {id: id};
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/blogs/likeBlog/', blogData, this.options).map(res => res.json());
  }

  dislikeBlog(id) {
    const blogData = {id: id};
    this.createAuthenticationHeaders();
    return this.http.put(this.domain + '/blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
  }

  postComment(id, comment) {
    this.createAuthenticationHeaders();

    const blogData = { id: id, comments: comment };
    return this.http.post(this.domain + '/blogs/comments/', blogData, this.options).map(res => res.json());
  }

}
