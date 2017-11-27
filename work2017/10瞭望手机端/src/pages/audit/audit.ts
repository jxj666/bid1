import { Component,OnInit } from '@angular/core';
import { IndexPage } from '../index/index';
import { AuditSuccess } from '../audit_success/audit';
import { AuditText } from '../audit_text/audit';

import { AuditService } from './audit.service';

@Component({
  selector: 'page-audit',
  templateUrl: 'audit.html'
})
export class AuditPage implements OnInit {
  tab1Root=IndexPage;
  tab2Root=AuditSuccess;
  AuditText=AuditText;
  audit_list:any=[];
  audited:string='0';
  constructor(private auditService: AuditService) {

  }
  ngOnInit(): void {
    this.audited= sessionStorage.audited || '0';
    this.getReviewNews();
  }
  getReviewNews(): void {
    this.auditService.getReviewNews1().then(data => this.getReviewNewsShow(data));
  }
  getReviewNewsShow(data): void {
    this.audit_list=data.list;
  }
  showData(data): void {
    console.log(data);
  }
    saveId(data):void{
    localStorage.auditId=data;
  }
}
