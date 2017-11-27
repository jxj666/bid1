import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { KEY } from '../../app/key'

import 'rxjs/add/operator/toPromise';



@Injectable()
export class ThemeService {
 private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
  constructor(private http: Http) {}
  getAllTopics(): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/topic/getAllTopics?key=${KEY.key}&token=${localStorage.token}&start=0&size=1000`;
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
  createTopic(body): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/topic/createTopic`;
    body +=`&key=${KEY.key}&token=${localStorage.token}`;
    return this.http.post(userUrl, body,{headers: this.headers})
      .toPromise()
      .then(response => response.json().context as {})
  }
  auditTopic(body): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/topic/auditTopic`;
    body +=`&key=${KEY.key}&token=${localStorage.token}`;
    return this.http.post(userUrl, body,{headers: this.headers})
      .toPromise()
      .then(response => response.json().code as {})
  }
  info(data): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/topic/info?key=${KEY.key}&token=${localStorage.token}&topicId=${data}`;
    return this.http.get(userUrl)
      .toPromise()
      .then(response => response.json().context as {})
  }
}
