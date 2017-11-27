import { Component, Input } from '@angular/core';
import { ThemeAudit } from '../theme_audit/theme';
import { ThemeService } from '../theme/theme.service';
import { ThemePage } from '../theme/theme';

@Component({
  selector: 'page-theme-set',
  templateUrl: 'theme.html'
})
export class ThemeSet {
  tab1Root = ThemeAudit;
   tab2Root = ThemePage;
  opinion: number = 0;
  @Input() text: string = '';
  constructor(private themeService: ThemeService) {}
  auditTopic(): void {
    const body = `&topicId=${localStorage.themeId}&title=${localStorage.title}&context=${localStorage.context}&opinion=${this.opinion}&message=${this.text}`;
    this.themeService.auditTopic(body).then(data => this.auditTopicShow(data));
  }
  auditTopicShow(data): void {
  }
}
