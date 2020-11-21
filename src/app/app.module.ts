import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy, IonRouterOutlet } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { Camera } from "@ionic-native/camera/ngx";
import { Keyboard } from "@ionic-native/keyboard/ngx";
// import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
// import { getConfig } from "../common/config";
//
// const config: SocketIoConfig = {
//   url: getConfig().mockSocketUri,
//   options: {
//     reconnectionDelay: 500,
//     reconnectionDelayMax: 2000,
//     transports: ["websocket", "polling"],
//   },
// };


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ swipeBackEnabled: false }),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    // SocketIoModule.forRoot(config)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
