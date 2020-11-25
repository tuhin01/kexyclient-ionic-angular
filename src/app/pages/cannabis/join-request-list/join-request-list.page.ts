import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../basePage';
import { Storage } from "@ionic/storage";
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, MenuController, NavController } from '@ionic/angular';
import {apis, constants} from "../../../../common/shared";
@Component({
  selector: 'app-join-request-list',
  templateUrl: './join-request-list.page.html',
  styleUrls: ['./join-request-list.page.scss'],
})
export class JoinRequestListPage extends BasePage implements OnInit {
  join_request_list = [];
  private organization;
  private org_type: string = '';

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

  async ngOnInit() {
    await this._prepareJoinRequestList();
  }
  _prepareJoinRequestList() {
    (async () => {
      this.organization = await this.storage.get(constants.STORAGE_ORGANIZATION);
      if (this.organization.type == 'distributor') {
        this.org_type = 'distributor';
      } else if (this.organization.type == 'restaurant') {
        this.org_type = 'restaurant';
      }

      let data = {
        org_id: this.organization.id,
        org_type: this.org_type
      };
      let res = await this.callApi(apis.API_GET_JOIN_REQUESTS, data, {shouldBlockUi: true});
      if (!res.success) {
        return;
      }
      this.join_request_list = res.data.requests;
    })();
  }


  async showActionList(request) {
    // let alert = await this.alertCtrl.create();
    // alert.header('Update Request Status');
    //
    // alert.addInput({
    //   type: 'radio',
    //   label: 'Pending',
    //   value: 'pending',
    //   checked: (request.status === 'pending')
    // });
    // alert.addInput({
    //   type: 'radio',
    //   label: 'Accept',
    //   value: 'accepted',
    //   checked: (request.status === 'accepted')
    // });
    // alert.addInput({
    //   type: 'radio',
    //   label: 'Delete',
    //   value: 'deleted',
    //   checked: (request.status === 'deleted')
    // });
    //
    // alert.addButton('Cancel');
    // alert.addButton({
    //   text: 'OK',
    //   handler: (status) => {
    //     console.log(status);
    //     let postData = {
    //       join_request_id: request.id,
    //       status: status
    //     };
    //     this.updateRequestStatus(postData);
    //   }
    // });
    // await alert.present();
  }

  async updateRequestStatus(data) {
    let res = await this.callApi(apis.API_APPROVE_OR_DELETE_JOIN_REQUEST, data, {shouldBlockUi: true});
    if (!res.success) {
      return;
    }
    await this.showAwaitableAlert("Success!", "Request updated successfully.");
    await this._prepareJoinRequestList();
  }
}
