import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { KEY } from '../../app/key'

import 'rxjs/add/operator/toPromise';



@Injectable()
export class UserService {
  constructor(private http: Http) {}
  getUser(data): Promise < {} > {
    const userUrl = localStorage.url + `v1/m/user/index?appid=${data.appid}&appSecret=${data.appSecret}&key=${KEY.key}&sign=${data.sign}&msg=${data.msg}&timestamp=${data.timestamp}`;
    return this.http.get(userUrl)
      .toPromise()
      .then(response => response.json().context as {})
  }
  getTrumpet(): Promise < {} > {
    const requestData = {
      key: KEY.key,
      token: localStorage.token
    }
    const userUrl = localStorage.url + `v1/m/news/getTrumpet?key=${requestData.key}&token=${requestData.token}`;

    return this.http.get(userUrl)
      .toPromise()
      .then(response => response.json().context as {})
  }
}
