import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ipost } from '../modal/post';

@Injectable({
  providedIn: 'root'
})
export class PostapiService {

  postsApiUrl = `${environment.baseUrl}/post.json`
  constructor(private _http: HttpClient) { }


  createPost(obj: Ipost): Observable<{ name: string }> {
    let httpHeader = new HttpHeaders({
      "content-type": "application-json",
      "Authorization": "JWT token get from LS"
    })
    return this._http.post<{ name: string }>(this.postsApiUrl, obj, {
      headers : httpHeader
    })
  }

  fetchAllPost(): Observable<Ipost[]> {
    let httpheader = new HttpHeaders({
      "content-type": "application-json",
      "Authorization": "JWT token get from LS"
    })
    return this._http.get<Ipost[]>(this.postsApiUrl, {
      headers : httpheader
    })
      .pipe(
        map((res: any) => {
          const postArray: Ipost[] = []
          if (res) {
            console.log(res)
            for (let key in res) {

              postArray.push({ ...res[key], id: key })
            }
          }
          return postArray
        })

      )

  }

  updatePost(id: string, obj: Ipost) {
    let updatePostUrl = `${environment.baseUrl}/post/${id}.json`
    return this._http.patch(updatePostUrl, obj)
  }

  removePost(id: string) {
    let deletePostUrl = `${environment.baseUrl}/post/${id}.json`;
    return this._http.delete(deletePostUrl)
  }

  getPassData(pageNo : number, count:number):Observable<any>{
    let httpParams = new HttpParams().set("page", pageNo).set("size", count)
    // let httpParams = new HttpParams()
    // httpParams.appendAll({
    //   "page" : 2,
    //   "size" : 50
    // })
    // let httpParams = new HttpParams().set("page", pageNo).set("size", count)
    return this._http.get<any>("https://api.instantwebtools.net/v1/passenger",{
      params : httpParams
    })
  }
}
