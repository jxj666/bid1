import { Component,OnInit } from '@angular/core';
import { AuditPage } from '../audit/audit';
import { AuditService } from '../audit/audit.service';
@Component({
  selector: 'page-audit-success',
  templateUrl: 'audit.html'
})

export class AuditSuccess implements OnInit {
   tab1Root = AuditPage;
  arr1=[1,2,3,4,5,6];
  audit_list:any=[];
  constructor(private auditService: AuditService) {

  }
  ngOnInit(): void {
    this.getReviewNews();
  }
  getReviewNews(): void {
    this.auditService.getReviewNews2().then(data => this.getReviewNewsShow(data));
  }
  getReviewNewsShow(data): void {
    this.audit_list=data.list;
  }
  showData(data): void {
    console.log(data);
  }
}
