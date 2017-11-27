import { Component,OnInit,Input } from '@angular/core';
import { ThemePage } from '../theme/theme';
import { ThemeSet } from '../theme_set/theme';
import { ThemeService } from '../theme/theme.service';
@Component({
  selector: 'page-theme-audit',
  templateUrl: 'theme.html'
})
export class ThemeAudit implements OnInit {
  tab1Root = ThemePage;
  tab2Root = ThemeSet;
  message_list:any=[];
  @Input() title:string='';
  @Input() text:string='';
  @Input() field:string='';
  constructor(private themeService: ThemeService) {}
  ngOnInit(): void {
    this.info();
  }
  info(): void {
    var dataId=localStorage.themeId;
    this.themeService.info(dataId).then(data => this.infoShow(data));
  }
  infoShow(data):void{
  this.title=data.topic.title;
  this.field=data.topic.field;
  this.text=data.topic.content.replace(/<.*?>/g,'');
  this.message_list=JSON.parse(data.topic.messageBoard);

  }
  save():void{
localStorage.title=this.title;
localStorage.context=this.text;
  }
}
