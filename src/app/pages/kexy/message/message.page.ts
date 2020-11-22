import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { HttpClient } from "@angular/common/http";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  MenuController,
  NavController,
} from "@ionic/angular";
import { BasePage } from "../../basePage";
import { NodeSocketService } from "../../../services/node-socket.service";
import { constants } from "../../../../common/shared";
import { routeConstants } from "../../../../common/routeConstants";

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"],
})
export class MessagePage extends BasePage implements OnInit {
  protected params: any;
  public currentUser;
  public search_string;
  isConversationListEmptyBecauseOfSearchResult: boolean = false;
  shouldIgnoreNextPageLeave: boolean;
  conversation_list: any = [];
  conversation_list_backup: any = [];
  online_user_list: any;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public storage: Storage,
    public httpClient: HttpClient,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public navCtrl: NavController,
    private nodeSocket: NodeSocketService,
    public actionSheetCtrl: ActionSheetController
  ) {
    super(router, route, httpClient, loadingCtrl, alertCtrl, storage, menu, navCtrl);
    this.online_user_list = [];
  }

  ngOnInit() {
    (async () => {
      this.currentUser = await this.storage.get(constants.STORAGE_USER);
      this.nodeSocket.setUserId(this.currentUser.id);
      this.nodeSocket.event("conversation-list-updated").subscribe(({ conversation_list }) => {
        conversation_list = conversation_list.filter(({ should_show }) => should_show);
        conversation_list.sort((a, b) => {
          if (b.updated_at === a.updated_at) return b.id - a.id;
          return Date.parse(b.updated_at) - Date.parse(a.updated_at);
        });
        this.conversation_list = conversation_list;
        this.conversation_list_backup = conversation_list;
      });
      this.nodeSocket.subscribeToUserOnlineStatus((list) => (this.online_user_list = list));
    })();
  }

  ionViewDidEnter() {
    this.shouldIgnoreNextPageLeave = false;
    (async () => {
      await this._loadConversations();
    })();
  }

  colorList = ["red", "green", "blue", "yellow", "cyan", "magenta"];

  public nameToColor(first_name, last_name) {
    let sum = String(first_name + last_name)
      .split("")
      .reduce((sum, value) => {
        return sum + value.charCodeAt(0);
      }, 0);
    return this.colorList[sum % this.colorList.length];
  }

  public nameToInitials(first_name, last_name) {
    return (first_name.charAt(0) + last_name.charAt(0)).toUpperCase();
  }

  async _loadConversations() {
    this.nodeSocket.emit("request-push", { event: "conversation-list-updated" });
  }

  searchCanceled() {
    this.conversation_list = this.conversation_list_backup;
    this.isConversationListEmptyBecauseOfSearchResult = false;
  }

  async searchStringChanged() {
    this.isConversationListEmptyBecauseOfSearchResult = true;
    this.conversation_list = this.conversation_list_backup.filter((conversation) => {
      return conversation.participant_list.some((participant) => {
        let regex = new RegExp(this.search_string, "i");
        return (
          regex.test(participant.company_name) ||
          regex.test(participant.first_name) ||
          regex.test(participant.last_name)
        );
      });
    });
  }

  async _startConversation(conversation) {
    this.shouldIgnoreNextPageLeave = true;
    await this.navigateTo(routeConstants.KEXY.MESSAGE_CONV, { conversation: JSON.stringify(conversation) });
  }

  async conversationTapped(i) {
    let conversation = this.conversation_list[i];
    await this._startConversation(conversation);
  }

  async addConversationTapped() {
    this.shouldIgnoreNextPageLeave = true;
    await this.navigateTo(routeConstants.KEXY.RESTAURANT_TABS + "/" + routeConstants.KEXY.ALL_CONTACTS);
  }

  async addParticipantsTapped() {
    await this.navigateTo(routeConstants.KEXY.RESTAURANT_TABS + "/" + routeConstants.KEXY.ALL_CONTACTS, {
      conversation: [],
      mode: "add-participants",
    });
  }

  deleteConversationTapped(conversation) {
    this.nodeSocket.emit("delete-conversation", {
      id: conversation.id,
    });
    this._loadConversations();
  }

  longPressCount: number = 0;
  async conversationLongTapped(conversation) {
    // This is to prevent showing multiple action sheet popup if user keep the button pressed more than we expect
    this.longPressCount++;
    if (this.longPressCount > 1) return;

    const actionSheet = await this.actionSheetCtrl.create({
      header: "",
      subHeader: "",
      buttons: [
        {
          text: "Delete Conversation",
          role: "destructive",
          handler: () => {
            console.log("Destructive clicked");
            this.deleteConversationTapped(conversation);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
      ],
    });

    await actionSheet.present();
  }

  longPressEnded() {
    this.longPressCount = 0;
  }
}
