import { Component, OnInit } from '@angular/core';
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { CameraService } from "../../../services/camera.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage extends BasePage implements OnInit {
  protected params: any;
  public currentUser;
  public search_string;
  public contact_list = [];
  public contactSide: string = "contacts";
  public isConversationListEmptyBecauseOfSearchResult: boolean = false;
  public shouldIgnoreNextPageLeave: boolean;
  public conversation_list: any = [];
  public conversation_list_backup: any = [];
  public online_user_list: any;
  colorList = [
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'magenta'
  ]
  public isInGroupSelectionMode: boolean = false;
  public selected_contact_list: any = [];
  public preExistingConversation: any;
  public selected_conversation_list: any = [];
  public search_string2: any;
  public loadingDialog: any = null;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.params = params;
      }
    });

    this._enableRestaurantMenu();

    this.online_user_list = [];
    this.contactSide = "contacts";
    if (this.params.mode === 'add-participants') {
      this.isInGroupSelectionMode = true;
      this.preExistingConversation = this.params.conversation;
    } else {
      this.isInGroupSelectionMode = false;
      this.preExistingConversation = null;
    }
  }

}
