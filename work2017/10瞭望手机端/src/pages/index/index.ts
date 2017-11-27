import { Component, OnInit } from '@angular/core';
import { ThemePage } from '../theme/theme';
import { AuditPage } from '../audit/audit';
// import { Broadcaster } from '@ionic-native/broadcaster';
import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';


import { UserService } from './user.service';



// @IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html'
})
export class IndexPage implements OnInit {
  tab1Root = ThemePage;
  tab2Root = AuditPage;
  myParam: string = '123';
  user: any = {
    username: '加载中...',
    avatar: '',
    roleName: '请稍后...',
  };
  appid: string = 'test';
  sign: string = 'test';
  timestamp: string = 'test';
  appSecret: string = 'test';
  msg: string = 'test';
  url: string = '';
  index: any = {
    auditNum: 0,
    themeNum: 0
  }
  // private broadcaster: Broadcaster,
  constructor(private userService: UserService, private navParams: NavParams, public navCtrl: NavController) {}
  getUser(): void {
    if (this.appid == ':appid') {
      this.appid = '';
      this.sign = '';
      this.timestamp = '';
      this.appSecret = '';
      this.msg = '';
    }
    if (this.appid && this.sign && this.timestamp) {
      var data = {
        appid: this.appid,
        sign: this.sign,
        timestamp: this.timestamp,
        appSecret: this.appSecret,
        msg: encodeURIComponent(this.msg)
      }
      // localStorage.url = `http://zhikuyun.lwinst.com/`;
      localStorage.url = `http://testliaowang.chengjuiot.com/`;
      this.userService.getUser(data).then(user => this.userShow(user));
    } else {
      if (!localStorage.user) {
        this.user = undefined;
        return;
      }
      this.user.avatar = JSON.parse(localStorage.user).avatar;
      this.user.username = JSON.parse(localStorage.user).username;
      this.user.roleName = localStorage.roleName || '瞭望';
      //this.getTrumpet();
    }
  }
  getTrumpet(): void {
    this.userService.getTrumpet().then(data => this.getTrumpetShow(data));
  }
  getTrumpetShow(data): void {
    this.index.auditNum = data.news;
  }
  showData(data): void {
    console.log(data);
  }
  userShow(user): void {
    if (user == null) {
      this.user = undefined;
      alert("请求数据错误或数据库未找到相应数据!");
      return;
    }
    this.user.avatar = user.avatar;
    this.user.username = user.username;
    localStorage.user = JSON.stringify(user);
    localStorage.role = user.role;
    localStorage.token = user.token;
    localStorage.uid = user.uid;
    this.user.roleNum = user.role.split(',').pop();
    switch (this.user.roleNum) {
      case 'CMS001':
        this.user.roleName = '普通';
        break;
      case 'CMS002':
        this.user.roleName = '一编';
        break;
      case 'CMS003':
        this.user.roleName = '二编';
        break;
      case 'CMS004':
        this.user.roleName = '签发';
        break;
      case 'CMS005':
        this.user.roleName = '设计部';
        break;
      case 'CMS006':
        this.user.roleName = '总编室1';
        break;
      case 'CMS007':
        this.user.roleName = '总编室2';
        break;
      case 'CMS008':
        this.user.roleName = '选题浏览';
        break;
      case 'CMS009':
        this.user.roleName = '选题编辑';
        break;
      case 'CMS010':
        this.user.roleName = '高级选填编辑';
        break;
      case 'CMS011':
        this.user.roleName = '外部人员选题查看';
        break;
      case 'CMS012':
        this.user.roleName = '终审';
        break;
      case 'CMS013':
        this.user.roleName = '研报普通';
        break;
      case 'CMS014':
        this.user.roleName = '研报一编';
        break;
      case 'CMS015':
        this.user.roleName = '研报二编';
        break;
      case 'CMS016':
        this.user.roleName = '研报签发';
        break;
      case 'CMS017':
        this.user.roleName = '研报导出';
        break;
      case 'CMS018':
        this.user.roleName = '研报总编室1';
        break;
      case 'CMS019':
        this.user.roleName = '研报总编室2';
        break;
      case 'CMS020':
        this.user.roleName = '高级';
        break;
      default:
        this.user.roleName = '未知';
    }
    localStorage.roleName = this.user.roleName;
    // this.getTrumpet();
  }
  ngOnInit(): void {
    this.appid = this.navParams.get('appid');
    this.sign = this.navParams.get('sign');
    this.timestamp = this.navParams.get('timestamp');
    this.appSecret = this.navParams.get('appSecret');
    this.msg = this.navParams.get('msg');
    sessionStorage.audited = 0;
    this.getUser();
  }
}
