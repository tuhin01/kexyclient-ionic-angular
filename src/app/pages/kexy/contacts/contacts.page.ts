import { Component, OnInit } from "@angular/core";
import { BasePage } from "../../basePage";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import { AlertController, LoadingController, MenuController, NavController } from "@ionic/angular";
import { NodeSocketService } from "../../../services/node-socket.service";
import { apis, constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";

@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.page.html",
  styleUrls: ["./contacts.page.scss"],
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
  colorList = ["red", "green", "blue", "yellow", "cyan", "magenta"];
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
    private nodeSocket: NodeSocketService
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.params = params;
      }
    });

    (async () => {
      this._enableRestaurantMenu().then(r => null);

      this.online_user_list = [];
      this.contactSide = "contacts";
      if (this.params && this.params.mode === "add-participants") {
        this.isInGroupSelectionMode = true;
        this.preExistingConversation = this.params.conversation;
      } else {
        this.isInGroupSelectionMode = false;
        this.preExistingConversation = null;
      }

      this.currentUser = await this.storage.get(constants.STORAGE_USER);
      this._setupNotificationSystem();

      this.nodeSocket.setUserId(this.currentUser.id);

      this.nodeSocket.event("conversation-list-updated").subscribe(({ conversation_list }) => {
        conversation_list = conversation_list.filter(({ should_show }) => should_show);
        conversation_list.sort((a, b) => {
          if (b.updated_at === a.updated_at) return b.id - a.id;
          return Date.parse(b.updated_at) - Date.parse(a.updated_at);
        });
        this.conversation_list = conversation_list;
        this.conversation_list_backup = conversation_list;
        this.searchStringChanged2();
      });

      (<any>window).openedConversationIdAndTimestampList = [];
      this.nodeSocket.event("new-conversation-created").subscribe((conversation) => {
        console.log(
          "(<any>window).openedConversationIdAndTimestampList",
          (<any>window).openedConversationIdAndTimestampList
        );

        let entry = (<any>window).openedConversationIdAndTimestampList.find((entry) => {
          return entry.conversation_id === conversation.id && Date.now() - entry.timestamp < 1000;
        });
        if (!entry) {
          (<any>window).openedConversationIdAndTimestampList.push({
            conversation_id: conversation.id,
            timestamp: Date.now(),
          });
          console.log("NEW CONVERSATION", conversation);

          console.log("Dialog", this.loadingDialog);

          if (this.isInGroupSelectionMode) {
            this.isInGroupSelectionMode = false;
            // TODO - Fix
            // this.navCtrl.push("MessageConversationPage", { conversation });
          } else {
            // TODO - Fix
            // this.navCtrl.push("MessageConversationPage", { conversation });
          }
        }
      });

      this.nodeSocket.subscribeToUserOnlineStatus((list) => (this.online_user_list = list));

      await this._loadContacts();
    })();
  }

  ionViewWillLeave() {
    console.log(this.loadingDialog);
    if (this.loadingDialog) {
      this.loadingDialog.dismiss();
      this.loadingDialog = null;
    }
  }

  ionViewDidEnter() {

    this._loadContacts(false);
    this._loadConversations(); // for contactSide = 'conversations'
  }

  public nameToColor(first_name, last_name) {
    let sum = String(first_name + last_name).split('').reduce((sum, value) => {
      return sum + value.charCodeAt(0);
    }, 0);
    return this.colorList[sum % this.colorList.length];
  }

  public nameToInitials(first_name, last_name) {
    return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
  }

  groupSelectionStartTapped() {
    this.isInGroupSelectionMode = true;
  }

  groupSelectionCancelTapped() {
    this.isInGroupSelectionMode = false;
    this.selected_contact_list = [];
    this.selected_conversation_list = [];
  }

  async addParticipantsTapped() {
    await this.navigateTo(routeConstants.KEXY.CONTACTS, {
      conversation: [],
      mode: 'add-participants'
    })
  }

  groupSelectionConfirmTapped() {
    console.log(this.selected_contact_list, this.selected_conversation_list)

    if (this.preExistingConversation) {
      this.selected_conversation_list.push(this.preExistingConversation);
    }

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    let participant_id_list = this.selected_contact_list.map(contact => contact.user_id);
    if (!this.preExistingConversation) {
      this.selected_conversation_list.forEach(conversation => {
        conversation.participant_list.forEach(participant => {
          participant_id_list.push(participant.user_id);
        });
      });
    }
    participant_id_list = participant_id_list
      .filter(onlyUnique)
      .filter(participant => participant.user_id !== this.currentUser.id);

    console.log(participant_id_list);

    this.nodeSocket.emit('begin-conversation', {
      participant_id_list
    });
    this.selected_contact_list = [];
    this.selected_conversation_list = [];
  }

  /** FIXME needing to duplicate everywhere */
  _setupNotificationSystem() {
    // this.kFire.setUpNotificationSystem({
    //   onTokenUpdate: async (token) => {
    //     console.log('__LOCAL_DEVICE_ID_FOR_LOGOUT', token);
    //     await this.storage.set('__LOCAL_DEVICE_ID_FOR_LOGOUT', token);
    //     let res = await this.callApi(apis.API_USER_ADD_DEVICE, {
    //       device_id: token
    //     }, {shouldBlockUi: false});
    //     if (!res.success) return;
    //     console.log('Token Reported to Kexy Server', token);
    //   }
    // });
  }

  async _loadContacts(blockUi = true) {
    let res = await this.callApi(apis.API_ALL_CONTACTS, {search_string: ''}, {shouldBlockUi: blockUi});
    if (!res.success) return;
    let list = res.data.contact_list;
    list = list.filter(contact => contact.user_id !== this.currentUser.id);
    list.forEach(contact => contact.onlinseStatus = {isOnline: false});
    list.forEach(contact => {
      if (contact.logo_image_url == '') {
        contact.no_logo_name = 'TK';
      }
    });
    this.contact_list = list;
  }

  async searchCanceled() {
    await this.searchStringChanged();
  }

  async searchStringChanged() {
    if (this.search_string.length === 0) return;
    let data = {
      search_string: this.search_string,
    };
    let res = await this.callApi(apis.API_ALL_CONTACTS, data);
    if (!res.success) return;

    this.contact_list = res.data.contact_list;
  }

  _startConversation(contact) {
    this.nodeSocket.emit('begin-conversation', {participant_id_list: [contact.user_id]});
    this.loadingDialog = this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Talking to the server. Please wait.'
    });
    this.loadingDialog.present();
  }

  async contactTapped(i) {
    let contact = this.contact_list[i];
    console.log("contactTapped", i, contact);
    if (this.isInGroupSelectionMode) {
      let index = this.selected_contact_list.indexOf(contact);
      if (index > -1) {
        this.selected_contact_list.splice(index, 1);
      } else {
        this.selected_contact_list.push(contact);
      }
    } else {
      this._startConversation(contact);
    }
  }

  // ==================================================================
  // ====== Workaround for contact selection
  // ==================================================================

  async _loadConversations() {
    this.nodeSocket.emit('request-push', {event: 'conversation-list-updated'});
  }

  searchCanceled2() {
    this.conversation_list = this.conversation_list_backup;
    this.isConversationListEmptyBecauseOfSearchResult = false;
  }

  async searchStringChanged2() {
    console.log('searchStringChanged2 this.search_string2', this.search_string2);
    console.log(this.conversation_list_backup);
    this.isConversationListEmptyBecauseOfSearchResult = true;
    this.conversation_list = this.conversation_list_backup.filter(conversation => {
      return conversation.participant_list.some(participant => {
        let regex = new RegExp(this.search_string2, 'i');
        return regex.test(participant.company_name) || regex.test(participant.first_name) || regex.test(participant.last_name);
      })
    });
  }

  async conversationTapped(i) {
    let conversation = this.conversation_list[i];
    console.log("conversationTapped", i, conversation);
    if (this.isInGroupSelectionMode) {
      let index = this.selected_conversation_list.indexOf(conversation);
      if (index > -1) {
        this.selected_conversation_list.splice(index, 1);
      } else {
        this.selected_conversation_list.push(conversation);
      }
    } else {
      this._startConversation(conversation);
    }
  }

}
