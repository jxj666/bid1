import { Component, OnInit } from '@angular/core';
import { IndexPage } from '../index/index';
import { ThemePublish } from '../theme_publish/theme';
import { ThemeAudit } from '../theme_audit/theme';
// import { NavParams } from 'ionic-angular';
import { NavController } from 'ionic-angular';

import { ThemeService } from './theme.service';

@Component({
  selector: 'page-theme',
  templateUrl: 'theme.html'
})
export class ThemePage implements OnInit {
  tab1Root = IndexPage;
  tab2Root = ThemePublish;
  tab3Root = ThemeAudit;
  theme_list: any = [];
  appid: string = '12sadfasfcsfdadsfdsf3';
  timestamp: string = '1232342134124';
  appSecret: string = 'wqerweqrwqerqwer';
  sign: string = '13214321fdfdsa234fwefdafds';
  msg: string = '43123213234321sfaasdf421342342134werwqer2143214';

  constructor(private themeService: ThemeService,  public navCtrl: NavController) {}
  ngOnInit(): void {
    this.getAllTopics();
  }
  pushParams(): void {
    this.navCtrl.push(IndexPage, { 'appid': this.appid, 'sign': this.sign, 'timestamp': this.timestamp, 'appSecret': this.appSecret, 'msg': this.msg });
  }
  getAllTopics(): void {
    this.themeService.getAllTopics().then(data => this.getMyPublishTopicsShow(data));
  }
  getMyPublishTopicsShow(data): void {
    this.theme_list = data.list;
  }
  showData(data): void {
    console.log(data);
  }
  saveId(data): void {
    localStorage.themeId = data;
  }
    goToMyPage() {
    // go to the MyPage component
    this.navCtrl.push('IndexPage');
  }
}
