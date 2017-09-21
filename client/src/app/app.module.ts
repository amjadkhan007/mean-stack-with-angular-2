import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { BlogService } from './services/blog.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { SingleBlogComponent } from './components/blog/single-blog/single-blog.component';
import {ExcerptFilter} from './filters/excerpt.filter';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    PageNotFoundComponent,
    DashboardComponent,
    ContactComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    DeleteBlogComponent,
    PublicProfileComponent,
    SingleBlogComponent,
    ExcerptFilter
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    FlashMessagesModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, BlogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
