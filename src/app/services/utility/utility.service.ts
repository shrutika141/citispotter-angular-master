import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from '../user/user.service';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor
    (private userService: UserService) { }

  dbDateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  dbDateFormat = 'YYYY-MM-DD';
  britishDateFormat = 'DD MMM, YYYY - hh:mm A';
  saveUserIpAddress: any = null;

  // baseUrl = "http://54.162.47.114/user";
  // serverBaseUrl = "http://54.162.47.114";
  // baseUrl = "https://www.admin.citispotter.com/user";

  // baseUrl = "http://18.206.104.224/user";
  // serverBaseUrl = "http://18.206.104.224";

  baseUrl = "http://localhost:3000/user";
  serverBaseUrl = "http://localhost:3000";

  static googleClientId: string = '356508381078-aulu3j9s5elo1n2mms9j96tmv5cnefmo.apps.googleusercontent.com';

  static facebookClientId: string = '764266090949145';

  unreadNotificationsCount: number = 0;
  allUnreadNotificationsData: any = [];
  excluded: any = [null, undefined, '', 0, false, 'null', 'undefined'];

  planType: {
    SUBSCRIPTION: "S",
    LICENSE: "L"
  }

  // Creating constants indicating postive sentence sign as 1 & negative sentence as 0 in sentiments api response
  public static negativeTextSymbol: string = "0";
  public static positiveTextSymbol: string = "1";
  public static neutralTextSymbol: string = "2";

  clearConsole() {
    window.console.log = function () { };
  }

  static getGoogleClientId() {
    console.log("window.location.origin");
    // console.log(window.location.origin);

    if (window.location.origin == "https://www.dashboard.citispotter.com") {
      // console.log('inside if origin');
      UtilityService.googleClientId = '356508381078-fqqnafqv6n8bpqtnc85ic8pofsm3qa0p.apps.googleusercontent.com'
    }
    // console.log(UtilityService.googleClientId);
    return UtilityService.googleClientId;
  }

  static getFacebookClientId() {
    return UtilityService.facebookClientId;
  }

  isNull(item) {
    // console.log("isNull called");
    // console.log(item);
    // return (item != null && item != '' && item != 0 && item != undefined) || isNaN(item) !== false ? item : 'N/A';
    return !this.excluded.includes(item) || isNaN(item) !== false ? item : 'N/A';
  }

  isEmpty(item) {
    return (item != null && item != '' && item != 0 && item != undefined) || isNaN(item) !== false ? item : '';
  }

  checkApiLimit(item) {
    return (item != null && item != '' && item != 0 && item != undefined) || isNaN(item) !== false ? item : 0;
  }

  getDate(date) {
    return date ? moment(date).format(this.dbDateFormat) : 'N/A';
  }

  getDateInBritishFormat(date) {
    // return date ? moment(date).format(this.britishDateFormat) : 'N/A';
    return date ? new Date(date).toUTCString() : 'N/A';
  }

  getDataByMilliseconds(d) {
    return new Date(d).getTime();
  }

  extractTextFromHTML(htmlData) {
    let span = document.createElement('span');
    span.innerHTML = htmlData;
    return (span.textContent || span.innerText).substr(0, 80);
  }

  getFormatedPricing(price) {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
  }

  isExpired(date) {
    return date ? moment(date).format(this.dbDateFormat) : 'Expired';
  }

  subtractDate(createdAt, expiryDate) {
    if (createdAt && expiryDate) {
      var d1 = moment(createdAt).format(this.dbDateFormat);
      var d2 = moment(expiryDate).format(this.dbDateFormat);
      console.log("d1");
      console.log(d1);
      console.log("d2");
      console.log(d2);
      console.log("moment(d2).diff(d1, 'days')");
      console.log(moment(d2).diff(d1, 'days'));
      return moment(d2).diff(d1, "days");
    } else {
      return "N/A";
    }
  }

  createAuthorizationHeader() {
    const token = this.userService.userData.token;
    let headers = new HttpHeaders().append('api', token);
    return headers;
  }

  convertObjectToFormData(obj) {
    let form_data = new FormData();

    for (var key in obj) {
      if (typeof obj[key] === "object" && !(obj[key] instanceof File)) {
        form_data.append(key, JSON.stringify(obj[key]));
      } else {
        form_data.append(key, obj[key]);
      }
    }
    return form_data;
  }

  downloadFileAsPdf(element_id) {
    console.log('captureScreen called');
    var data = document.getElementById(element_id);
    console.log(data);

    // const elem = document.querySelector('#generateReportModal') as HTMLDivElement;
    // console.log("elem.offsetHeight");
    // console.log(elem.offsetHeight);

    $('.downloadReportLoader').removeClass('display_none');
    $('#downloadReport_Btn').addClass('pointer_events_none');

    html2canvas(data, { scale: 2 })
      .then(
        (canvas) => {
          var imgWidth = 208;
          var pageHeight = 295;
          var imgHeight = (canvas.height * imgWidth) / canvas.width;
          const contentDataURL = canvas.toDataURL('image/png');

          console.log("canvas.width");
          console.log(canvas.width);
          console.log("canvas.height");
          console.log(canvas.height);

          // Old Logic
          let pdf;
          if (canvas.width > canvas.height) {
            console.log("if if");
            pdf = new jspdf('l', 'px', [canvas.width, canvas.height]);
          }
          else {
            console.log("else else");
            pdf = new jspdf('p', 'px', [canvas.height, canvas.width]);
          }
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, canvas.width, canvas.height);
          pdf.save('download.pdf'); // Generated PDF

          $('.downloadReportLoader').addClass('display_none');
          $('#downloadReport_Btn').removeClass('pointer_events_none');
          $('#generateReportModal').modal('hide');
        });
  }

  downloadA3SizePdf(element_id) {
    console.log('mysubcription captureScreen called');
    var data = document.getElementById(element_id);
    console.log(data);
    html2canvas(data, { scale: 2 }).then((canvas) => {
      console.log('inside html2canvas');
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a3'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('download.pdf'); // Generated PDF
    });
  }

  downloadTextAsPdf(data) {
    var doc = new jspdf("p", "mm", "a3");
    // const doc = new jspdf();
    doc.setFontSize(14);
    var strArr = doc.splitTextToSize(data, 215);
    doc.text(strArr, 15, 15);
    doc.save("download.pdf"); // will save the file in the current working directory
  }

  getUserIp() {
    console.log('getUserIp called');
    return new Promise((resolve, reject) => {
      $.getJSON('https://api.ipify.org?format=json', function (data) {
        console.log('yaha tak badiya');
        if (!data) {
          console.log("error while sending mail");
          console.log(data);
          reject('error bhaiya');
        } else {
          console.log("Sab theek");
          console.log(data);
          resolve(data);
        }
        console.log('yaha tak bhi badiya');
      });
    });
  }

  convertDateToHours(date) {
    return date ? moment(date).fromNow(true) : 'N/A';
  }

  extractArrayValues(item) {
    console.log("Item Item");
    console.log(item);
    return Array.isArray(item) ? item.values() : item;
  }
}
