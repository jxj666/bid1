import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { KEY } from '../../app/key'
// import { HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';



@Injectable()
export class AuditService {
  bookUrl: any = '';
  private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  constructor(private http: Http) {}
  getReviewNews1(): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/news/getReviewNews?key=${KEY.key}&token=${localStorage.token}&start=0&size=1000&stage=2&isAsign=0`;
    return this.http.get(userUrl)
      .toPromise()
      .then(response => response.json().context as {})
  }
  getReviewNews2(): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/news/getReviewNews?key=${KEY.key}&token=${localStorage.token}&start=0&size=1000&type=1&isAsign=0`;
    return this.http.get(userUrl)
      .toPromise()
      .then(response => response.json().context as {})
  }
  info(): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/news/info?newsId=${localStorage.auditId}&key=${KEY.key}&token=${localStorage.token}`;
    return this.http.get(userUrl)
      .toPromise()
      .then(response => response.json().context as {})
  }
  getPullDownList(): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/news/getPullDownList?key=${KEY.key}&token=${localStorage.token}`;
    return this.http.get(userUrl)
      .toPromise()
      .then(response => response.json().context as {})
  }
  uploadFile(file):  Promise < {} >  {
    const userUrl = localStorage.url + `v1/m/news/uploadFile`;
    const promise = new Promise(function(resolve, reject) {
      const handler = function() {
        if (this.readyState !== 4) { return; }
        if (this.status === 200) {
          resolve(this.responseText);
        } else {
          reject(new Error(this.statusText));
        }
      }
      const xml = new XMLHttpRequest();
      var formData = new FormData();
      formData.append('file', file);
      formData.append('key', KEY.key);
      formData.append('type', "2");
      formData.append('token', localStorage.token);
      xml.open('POST', userUrl, true);
      xml.onreadystatechange = handler;
      xml.send(formData);
    });
    return promise;

  }
  reviewNews(body): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/news/reviewNews`;
    body += `&key=${KEY.key}&token=${localStorage.token}`;

    //body.key=KEY.key;
    //body.token=localStorage.token;

    return this.http.post(userUrl, body, { headers: this.headers })
      .toPromise()
      .then(response => response.json() as {})
  }
}
