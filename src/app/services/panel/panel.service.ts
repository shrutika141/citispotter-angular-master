import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private utilityService: UtilityService
  ) { }

  url: string = this.utilityService.baseUrl;
  headers = this.utilityService.createAuthorizationHeader();

  userPlanInfo(user_id, type): Observable<any> {
    return this.http.get(
      this.url + `/my-plan-info?user_id=${user_id}&type=${type}`
    );
  }

  getAllPlanListData(type): Observable<any> {
    console.log("getAllPlanListData api called");
    let user_id = this.userService.userData.id;
    // return this.http.get(this.url + `/plans?user_id=${user_id}&type=${type}`);
    let data = {
      user_id: user_id,
      type: type,
      userRole: this.userService.getUserData().role
    }

    let body = this.utilityService.convertObjectToFormData(data);
    console.log(body);

    return this.http.post(this.url + `/plans`, body);
  }

  purchasePlan(userPlanData): Observable<any> {
    let body = new FormData();
    body.append('user_id', userPlanData.user_id);
    body.append('plan_id', userPlanData.plan_id);
    body.append('orderId', userPlanData.orderId);
    body.append('transactionId', userPlanData.transactionId);
    body.append('subscription_package_id', userPlanData.subscription_package_id);
    body.append('subscription_package_price', userPlanData.subscription_package_price);
    body.append('transactionData', JSON.stringify(userPlanData.transactionData));
    return this.http.post(this.url + `/purchase-plan`, body);
  }

  editUserProfileData(data): Observable<any> {
    const user_id = this.userService.userData.id;
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + `/edit-profile?id=${user_id}`, body);
  }

  // This api is fetching user data by user id
  getUserProfileData(): Observable<any> {
    const user_id = this.userService.userData.id;
    return this.http.get(this.url + `/profile?id=${user_id}`);
  }

  setUserActivityData(userActivityData): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(userActivityData);
    return this.http.post(this.url + '/user-activity', body);
  }

  setUserPageSpendTime(userActivityData): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(userActivityData);
    return this.http.post(this.url + '/set-user-page-spend-time', body);
  }

  getUserRoles() {
    return this.http.get(this.url + '/get-user-roles');
  }

  getUserOccupations() {
    return this.http.get(this.url + '/get-user-occupations');
  }

  countSentence(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/count-sentence', body);
  }

  countParagrapgh(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/count-paragraph', body);
  }

  countWord(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/count-word', body);
  }

  countCharacter(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/get-character-count', body);
  }

  saveDocument(editorBody, documentId): Observable<any> {
    let saveDocumentDataURL = this.url + '/save-document';
    if (documentId) {
      console.log('documentId');
      console.log(documentId);
      saveDocumentDataURL = this.url + `/save-document?id=${documentId}`;
    }
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(saveDocumentDataURL, body);
  }

  getAllSavedDocument(search = null): Observable<any> {
    console.log('Get all saved document called.');
    let user_id = this.userService.userData.id;
    let url;
    
    console.log("search");
    console.log(search);

    if (search) {
      url = this.url + `/get-all-saved-document?user_id=${user_id}&title=${search}`
    } else {
      url = this.url + `/get-all-saved-document?user_id=${user_id}`
    }
    return this.http.get(url);
  }

  // getFilteredDocument(title): Observable<any> {
  //   console.log('Get all saved document called.');
  //   let user_id = this.userService.userData.id;
  //   return this.http.get(this.url + `/get-filtered-document?user_id=${user_id}?title=${title}`);
  // }


  getSavedDocumentById(document_id): Observable<any> {
    return this.http.get(this.url + `/get-saved-document?id=${document_id}`);
  }

  showEmotionCount(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/show-sentence-emotion', body);
  }

  showLanguageToneCount(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/show-sentence-language-tone', body);
  }

  showActivePassiveVoiceCount(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/active-passive-voice-count', body);
  }

  showSpellingGrammarCount(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/spelling-grammar-count', body);
  }

  showGrammarMistakes(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/check-grammar-mistakes', body);
    // return this.http.get('/assets/json/check-grammar-mistakes.json');
  }

  showSpellingMistakes(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/check-spelling-mistakes', body);
  }

  getGradeLevelCount(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/get-grade-level-count', body);
  }

  showReadTime(editorBody): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(editorBody);
    return this.http.post(this.url + '/show-readtime', body);
  }

  generateOrderId(userObject): Observable<any> {
    let body = new FormData();
    body.append('user_id', userObject.user_id);
    body.append(
      'subscriptionInfo',
      JSON.stringify(userObject.subscriptionInfo)
    );
    body.append(
      'discountCouponInfo',
      JSON.stringify(userObject.discountCouponInfo)
    );
    return this.http.post(this.url + '/get-order-id', body);
  }

  getModuleBySubscription() {
    const user_id = this.userService.userData.id;
    return this.http.get(
      this.url + `/get-module-by-subscription?user_id=${user_id}`
    );
  }

  deleteDocument(document_id): Observable<any> {
    // let body = this.utilityService.convertObjectToFormData(editorBody);
    let body = new FormData();
    body.append('document_id', document_id);
    return this.http.post(this.url + '/delete-document', body);
  }

  checkUserPlanExpiry(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(
      this.url + `/check-user-plan-expiry?user_id=${user_id}`
    );
  }

  verifyUserEmail(code): Observable<any> {
    return this.http.get(this.url + `/verify-user-email?code=${code}`);
  }

  isUserVerifiedEmail(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(
      this.url + `/is-user-verified-email?user_id=${user_id}`
    );
  }

  resendActivationEmailToUser(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(
      this.url + `/resend-activation-email?user_id=${user_id}`
    );
  }

  applyDiscountOnSubscription(discountCouponInfo): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(discountCouponInfo);
    return this.http.post(this.url + '/apply-discount-coupon', body);
  }

  sendForgetPasswordVerificationlLink(data): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(
      this.url + '/send-forget-password-verification-link',
      body
    );
  }

  resetPassword(data): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/reset-password', body);
  }

  changePassword(data): Observable<any> {
    data.user_id = this.userService.userData.id;
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/change-password', body);
  }

  resendResetPasswordEmailToUser(email): Observable<any> {
    let body = new FormData();
    body.append('email', email);
    return this.http.post(this.url + `/resend-reset-password-email`, body);
  }

  shareUserContentThroughEmail(shareContentData): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(shareContentData);
    return this.http.post(this.url + `/share-content-through-email`, body);
  }

  sendFeedback(data): Observable<any> {
    // data.user_id = this.userService.userData.id;
    // let body = this.utilityService.convertObjectToFormData(data);
    let body = new FormData();
    body.append('feedback_topic', data.feedback_topic);
    body.append('feedback', data.feedback);
    if (Array.isArray(data.fileSource)) {
      body.append('fileSource', JSON.stringify(data.fileSource));
      body.append('isFileSource', 'true');
    } else {
      data.fileSource = data.fileSource ? data.fileSource : '';
      body.append('fileSource', data.fileSource);
      body.append('isFileSource', 'false');
    }
    body.append('user_id', this.userService.userData.id);
    return this.http.post(this.url + `/send-feedback`, body);
  }

  sendQuery(data): Observable<any> {
    // data.user_id = this.userService.userData.id;
    // let body = this.utilityService.convertObjectToFormData(data);
    let body = new FormData();
    body.append('topic', data.topic);
    body.append('query', data.query);
    if (Array.isArray(data.fileSource)) {
      body.append('fileSource', JSON.stringify(data.fileSource));
      body.append('isFileSource', 'true');
    } else {
      data.fileSource = data.fileSource ? data.fileSource : '';
      body.append('fileSource', data.fileSource);
      body.append('isFileSource', 'false');
    }
    body.append('user_id', this.userService.userData.id);
    return this.http.post(this.url + `/send-query`, body);
  }

  getAllUserInvoicesData(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(this.url + `/get-user-invoices?user_id=${user_id}`);
  }

  generateUserInvoice(invoice_number): Observable<any> {
    let body = new FormData();
    body.append('invoice_number', invoice_number);
    return this.http.post(this.url + `/generate-invoice`, body);
  }

  getSubscriptionAmount(data): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + `/get-subscription-amount`, body);
  }

  saveFcmToken(token): Observable<any> {
    let data = { user_id: this.userService.userData.id, token: token };
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + `/save-user-fcm`, body);
  }

  deleteUserFcmToken(): Observable<any> {
    let user_id = this.userService.userData.id;
    let body = new FormData();
    body.append('user_id', user_id);
    return this.http.post(this.url + `/delete-user-fcm`, body);
  }

  getUserAllNotifications(): Observable<any> {
    let user_id = this.userService.userData.id;
    let body = new FormData();
    body.append('user_id', user_id);
    return this.http.post(this.url + `/get-user-notifications`, body);
  }

  // This api is fetching user data by user id but when admin login as a user
  getUserDataById(user_id): Observable<any> {
    return this.http.get(this.url + `/profile?id=${user_id}`);
  }

  getAllUnreadNotifications(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(this.url + `/get-all-unread-notifications?user_id=${user_id}`);
  }

  readAllNotifications(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(this.url + `/read-all-notifications?user_id=${user_id}`);
  }

  // checkUserDocumentCreationLimit(): Observable<any> {
  //   let user_id = this.userService.userData.id;
  //   return this.http.get(this.url + `/check-user-document-creation-limit?user_id=${user_id}`);
  // }

  async doubleCheckUserDocumentCreationLimit() {
    console.log("hello doubleCheckUserDocumentCreationLimit");
    let user_id = this.userService.userData.id;
    let apiUrl = `${this.url}/double-check-user-document-creation-limit?user_id=${user_id}`;
    return this.http.get(apiUrl).toPromise();
  }

  async checkUserWordAnalyseLimit(word_count) {
    console.log("hello checkUserWordAnalyseLimit");
    let user_id = this.userService.userData.id;
    let apiUrl = `${this.url}/check-user-word-analyse-limit?user_id=${user_id}&word_count=${word_count}`;
    return this.http.get(apiUrl).toPromise();
  }

  insertAnalysedWordRecord(insertAnalysedWordObject): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(insertAnalysedWordObject);
    return this.http.post(this.url + `/insert-analysed-word-count`, body);
  }

  getAllowedWordLimitToTextEditorData(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(this.url + `/get-allowed-word-limit-to-editor?user_id=${user_id}`);
  }

  // The below api return a promise after getting the API response object of user's subscription module
  getModuleBySubscriptionPromise() {
    const user_id = this.userService.userData.id;
    return this.http.get(this.url + `/get-module-by-subscription?user_id=${user_id}`).toPromise();
  }

  getUserCustomDictionaryWords(data): Observable<any> {
    // let url = this.url + `/get-user-custom-dictionary-words?user_id=${data.user_id}&module_id=${data.module_id}`;
    // if (!data.module_id) { url = this.url + `/get-user-custom-dictionary-words?user_id=${data.user_id}`; }
    // return this.http.get(url);

    let url = this.url + `/get-user-custom-dictionary-words?user_id=${data.user_id}&dictionary_id=${data.dictionary_id}&document_id=${data.document_id}`;
    // if (!data.dictionary_id) { url = this.url + `/get-user-custom-dictionary-words?user_id=${data.user_id}`; }
    return this.http.get(url);
  }

  getDictionaryWordsByModuleWise(data): Observable<any> {
    let url = this.url + `/get-dictionary-words-by-module?user_id=${data.user_id}&document_id=${data.document_id}&module_id=${data.module_id}`;
    return this.http.get(url);
  }

  addWordToUserCustomDictionary(data): Observable<any> {
    let body = new FormData();
    body.append('word', data.word);
    body.append('part_of_speech', data.part_of_speech);
    body.append('case_sensitive', data.case_sensitive);
    body.append('description', data.description);
    body.append('suggestions', JSON.stringify(data.suggestions));
    body.append('dictionary_id', data.dictionary_id);
    body.append('user_id', this.userService.userData.id);
    return this.http.post(this.url + '/add-word-to-user-custom-dictionary', body);
  }

  editUserCustomDictionaryWord(data): Observable<any> {
    // data.user_id = this.userService.userData.id;
    // let body = this.utilityService.convertObjectToFormData(data);
    let body = new FormData();
    body.append('id', data.id);
    body.append('word', data.word);
    body.append('part_of_speech', data.part_of_speech);
    body.append('case_sensitive', data.case_sensitive);
    body.append('description', data.description);
    body.append('suggestions', JSON.stringify(data.suggestions));
    body.append('dictionary_id', data.dictionary_id);
    body.append('user_id', this.userService.userData.id);
    return this.http.post(this.url + '/edit-user-custom-dictionary-word', body);
  }

  deleteUserCustomDictionaryWord(data): Observable<any> {
    data.user_id = this.userService.userData.id;
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/delete-user-custom-dictionary-word', body);
  }

  addWordsToUserCustomDictionaryThroughCSV(data): Observable<any> {
    let user_id = this.userService.userData.id;
    let body = new FormData();
    body.append('csvData', JSON.stringify(data.csvData));
    body.append('user_id', user_id);
    body.append('dictionary_id', data.dictionary_id);
    return this.http.post(this.url + `/add-words-to-user-custom-dictionary-through-csv`, body);
  }

  fetchAllUserCustomDictionary(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(this.url + `/get-user-custom-dictionary-list?user_id=${user_id}`);
  }

  addNewUserCustomDictionary(data): Observable<any> {
    data.user_id = this.userService.userData.id;
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/add-custom-dictionary', body);
  }

  editUserCustomDictionary(data): Observable<any> {
    data.user_id = this.userService.userData.id;
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/edit-custom-dictionary', body);
  }

  deleteUserCustomDictionary(data): Observable<any> {
    data.user_id = this.userService.userData.id;
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/delete-custom-dictionary', body);
  }

  toggleDictionaryStatus(data): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/toggle-dictionary', body);
  }

  ignoreUserCustomDicitonaryWord(data): Observable<any> {
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/ignore-dictionary-word', body);
  }

  fetchOraganizationEmployeeList(): Observable<any> {
    let user_id = this.userService.userData.id;
    return this.http.get(this.url + `/get-oraganization-employees-list?user_id=${user_id}`);
  }

  addOraganizationEmployee(data): Observable<any> {
    data.user_id = this.userService.userData.id;
    let body = this.utilityService.convertObjectToFormData(data);
    return this.http.post(this.url + '/add-employee-to-oraganization', body);
  }
}
