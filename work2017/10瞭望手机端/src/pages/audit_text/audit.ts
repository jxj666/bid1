import { Component, Input, OnInit } from '@angular/core';
// import { NavController, NavParams } from 'ionic-angular';
// import { Camera, CameraOptions } from '@ionic-native/camera';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { KEY } from '../../app/key';
import { AuditPage } from '../audit/audit';
import { AuditService } from '../audit/audit.service';
// import { ImagePicker } from '@ionic-native/image-picker';
import { IndexPage } from '../index/index';

@Component({
  selector: 'page-audit-text',
  templateUrl: 'audit.html'
})
export class AuditText implements OnInit {
  URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
  tab1Root = AuditPage;
  tab2Root = IndexPage;
  @Input() title1: string = '';
  @Input() title2: string = '';
  @Input() author: string = '';
  @Input() word: string = '';
  @Input() job: string = '';
  @Input() contentMin: string = '';
  @Input() content: string = '';
  @Input() order: string = '';
  channelarr: any = [];
  channelId: any = '';
  fieldId: any = '';
  sourceId: any = '';
  opinion_list: any = [];
  dictChannels: any = [];
  dictFields: any = [];
  dictSources: any = [];
  onOff: boolean = false;
  onOff2: boolean = false;
  imgUrl: string = '';
  options: any = {};
  content2: any = '';
  headface: any = [];
  imgChange: boolean = false;

  constructor(
    private auditService: AuditService,
    // private imagePicker: ImagePicker,
    // public navCtrl: NavController,
    // public navParams: NavParams,
    // private camera: Camera,
    // private transfer: FileTransfer

  ) {}
  ngOnInit(): void {
    localStorage.bookUrl = '';
    this.info();
    this.getPullDownList()
  }
  info(): void {
    this.auditService.info().then(data => this.infoShow(data));
  }
  infoShow(data): void {
    this.title1 = data.news.title || ' ';
    this.title2 = data.news.subtitle || ' ';
    this.author = data.news.author || ' ';
    this.word = data.news.keyword || ' ';
    this.job = data.news.position || ' ';
    this.contentMin = data.news.summary || ' ';
    this.content = data.news.content || ' ';
    this.content2 = data.news.content.replace(/&nbsp;/ig, ' ').replace(/<\/em>/ig, '').replace(/<\/>/ig, '').replace(/<\/b>/ig, '').replace(/<[bi(em)]>/ig, '').replace(/<\/.*?>/ig, '\r').replace(/<.*?>/ig, ' ');
    this.opinion_list = data.newsReviews || [];
    this.sourceId = data.newsSource.sourceId;
    this.channelarr = data.moniChannels;
    this.fieldId = data.newsField.dictField.id;
    var txt = '';
    this.channelarr.forEach(function(i) { txt += (i.id + ',') })
    this.channelId = txt;
  }
  channel(id) {
    var num = id + ",";
    var key = this.channelId.search(num) > -1 ? true : false;
    if (key) {
      this.channelId = this.channelId.replace(num, '');
    } else {
      this.channelId += num;
    }


  }
  getPullDownList(): void {
    this.auditService.getPullDownList().then(data => this.getPullDownListShow(data));
  }
  getPullDownListShow(data): void {
    this.dictChannels = data.dictChannels;
    this.dictFields = data.dictFields;
    this.dictSources = data.dictSources;
  }
  deleteImg(val): void {
    console.log(val);
   for(var i=0;i<this.headface.length;i++){
     if(this.headface[i]==val){
       console.log(i);
this.headface.splice(i,1);
this.imgChange = false;
return;
     }
   }
  }
  addImg(): void {

  }
  audit(K): void {
    const reviewStatus = K;
    var body = `&opinion=${''}&editOpinion=${this.order }&reviewStatus=${reviewStatus }&sourceId=${this.sourceId }&fieldId=${this.fieldId }&title=${this.title1 }&subtitle=${this.title2 }&keyWord=${this.word }&summary=${this.contentMin }&content=${this.onOff2?encodeURIComponent(this.content2):encodeURIComponent(this.content)}&text=${this.onOff2?encodeURIComponent(this.content2):encodeURIComponent(this.content)}&layOutType=${''}&num=${''}&channelArr=${this.channelId.slice(0,-1) }&newsId=${localStorage.auditId }&signUrl=${this.headface.toString()}&isSign=${this.onOff?1:0 }`;
    // var body = {
    //   opinion: undefined,
    //   editOpinion: this.order,
    //   reviewStatus: reviewStatus,
    //   sourceId: this.sourceId,
    //   fieldId: this.fieldId,
    //   title: this.title1,
    //   subtitle: this.title2,
    //   keyword: this.word,
    //   summary: this.contentMin,
    //   content: this.content,
    //   text: this.content,
    //   layOutType: undefined,
    //   num: undefined,
    //   channelArr: this.channelId.slice(0, -1),
    //   newsId: localStorage.auditId,
    //   signUrl: undefined,
    //   isSign: this.onOff ? 1 : 0
    // }
    sessionStorage.audited=localStorage.auditId;
    this.auditService.reviewNews(body).then(data => this.auditShow(data));
  }

  auditShow(data): void {


  }
  onChangeSelectFile(event) {
    this.imgChange = false;
    const file = event.currentTarget.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }
  uploadFile(file): void {
    this.auditService.uploadFile(file).then(data => this.showFile(data));
    //this.headface = localStorage.bookUrl;

  }
showFile(res){
  console.log(res);
  var url1=JSON.parse(res).context[0].url ||'http://liaowang.oss-cn-hangzhou.aliyuncs.com/www/assets/img/test.jpg';
  this.headface.push(url1);

}
  uploadFileShow(data): void {
    alert(data);
  }


}
