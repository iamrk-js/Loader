import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ipost } from './shared/modal/post';
import { LoaderService } from './shared/services/loader.service';
import { PostapiService } from './shared/services/postapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  isLoading !:boolean;
  title = 'http_firebase';
  isUpdateting: any;
  postForm!: FormGroup<any>;
  postArray: Ipost[] = [];
  constructor(private _postApiservice: PostapiService,
    private _loaderService: LoaderService) {

  }
  ngOnInit(): void {
    console.log(this.isLoading)
    this._loaderService._loading$.subscribe(res => this.isLoading = res)
    this.postForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      content: new FormControl(null, [Validators.required]),
    })
    this.getAllPosts()// shareReplay
    this._postApiservice.getPassData(5, 50)
      .subscribe(console.log)

    // this._loaderService.hide()
  }
  onDeletePost(ele: any, id: string) {
    this._postApiservice.removePost(id)
      .subscribe(res => {
        console.log(res)
        ele.target.closest('.card').remove()
        console.log(ele.target.closest('.card'))
      })
  }
  getAllPosts() {
    this._loaderService.show();
    this._postApiservice.fetchAllPost()
      .subscribe(
        res => {
          setTimeout(() => {
            console.log(res)
            this.postArray = res;
            this._loaderService.hide();
          }, 3000);
         
        },
        err => {
          console.log(err)
        }
      )
  }
  onPostUpdate() {
    let post = this.postForm.value;
    let updateId = localStorage.getItem("updateId")!
    this._postApiservice.updatePost(updateId, post)
      .subscribe((res) => {
        console.log(res)
        this.postArray.forEach(obj => {
          if (obj.id === updateId) {
            obj.title = post.title,
              obj.content = post.content
          }
        })
        this.postForm.reset()
        this.isUpdateting = false;
      })
  }
  onPostSubmit() {
    console.log(this.postForm.value)
    let post = this.postForm.value;
    this._postApiservice.createPost(post)
      .subscribe(
        res => {
          console.log(res) // {name : ertyuio}
          let obj = {
            ...post,
            id: res.name
          }
          console.log(obj)
          this.postArray.push(obj)
        },
        err => {
          console.log(err)
        }
      )
    this.postForm.reset()
  }
  onEditPost(post: Ipost) {
    console.log(post)
    localStorage.setItem("updateId", post.id)
    this.isUpdateting = true;
    this.postForm.patchValue({
      title: post.title,
      content: post.content
    })
  }
}
