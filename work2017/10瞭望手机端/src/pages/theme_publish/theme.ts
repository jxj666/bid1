import { Component, OnInit, Input } from '@angular/core';
import { ThemePage } from '../theme/theme';


import { ThemeService } from '../theme/theme.service';
@Component({
  selector: 'page-theme-publish',
  templateUrl: 'theme.html'
})
export class ThemePublish implements OnInit {
  tab1Root = ThemePage;
  themePublish: any = {
    dictFields: []
  };
  @Input() title: String = '';
  @Input() context: String = '';
  field: String = '0';
  constructor(private themeService: ThemeService) {}
  ngOnInit(): void {
    this.getPullDownList();
  }
  getPullDownList(): void {
    this.themeService.getPullDownList().then(data => this.getPullDownListShow(data));
  }
  getPullDownListShow(data): void {
    this.themePublish.dictFields = data.dictFields;
  }
  showData(data): void {
    console.log(data);
  }
  createTopic(): void {
    if (!this.context || !this.title || this.field == '0') {
      alert('请完整输入!');
    }
    var req = `&title=${this.title}&content=${this.context}&field=${this.field}`;
    this.themeService.createTopic(req).then(data => this.showData(data));
  }
}
