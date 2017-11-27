import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
//import { IonicPageModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { IndexPage } from '../pages/index/index';
import { ThemePage } from '../pages/theme/theme';
import { AuditPage } from '../pages/audit/audit';
import { ThemePublish } from '../pages/theme_publish/theme';
import { AuditSuccess } from '../pages/audit_success/audit';
import { ThemeAudit } from '../pages/theme_audit/theme';
import { ThemeSet } from '../pages/theme_set/theme';
import { AuditText } from '../pages/audit_text/audit';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Broadcaster } from '@ionic-native/broadcaster';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../pages/index/user.service';
import { ThemeService } from '../pages/theme/theme.service';
import { AuditService } from '../pages/audit/audit.service';
// import { ImagePicker } from '@ionic-native/image-picker';
// import { Camera } from '@ionic-native/camera';
// import { File } from '@ionic-native/file';
// import { FileTransfer } from '@ionic-native/file-transfer';



@NgModule({
  declarations: [
    MyApp,
    IndexPage,
    ThemePage,
    AuditPage,
    ThemePublish,
    AuditSuccess,
    ThemeAudit,
    ThemeSet,
    AuditText
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{},{
      links:[
      {component:IndexPage,name:'index',segment:'index/:appid/:timestamp/:appSecret/:sign/:msg'}, {component:ThemePage,name:'theme',segment:'theme'},{component:AuditPage,name:'audit',segment:'audit'}]
    }),
    //IonicPageModule.forChild(IndexPage)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IndexPage,
    ThemePage,
    AuditPage,
    ThemePublish,
    AuditSuccess,
    ThemeAudit,
    ThemeSet,
    AuditText
  ],
  providers: [
    StatusBar,
    // Broadcaster,
    SplashScreen,
    UserService,
    ThemeService,
    AuditService,
    // ImagePicker,
    // Camera,
    // File,
    // FileTransfer,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {

}
