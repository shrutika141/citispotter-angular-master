import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Document, Packer, Paragraph, TableRowHeightAttributes, TextRun, } from 'docx';
import { saveAs } from 'file-saver';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { HelpComponent } from '../help/help.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CSVRecord } from '../../CSVModel';
import { CsvFileUploadService } from 'src/app/services/csv-file-upload/csv-file-upload.service';
declare var $: any;
import * as moment from 'moment';
import Docxtemplater from "docxtemplater";
import * as PizZip from 'pizzip';
import { forkJoin } from 'rxjs';
import { HttpCancelService } from 'src/app/services/httpcancel/httpcancel.service';

@Component({
  selector: 'app-text-editor',
  // templateUrl: './text-editor.component.html',
  // styleUrls: ['./text-editor.component.css'],
  templateUrl: './new-text-editor-ui.component.html',
  styleUrls: ['./new-text-editor-ui.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TextEditorComponent implements OnInit {
  documentData: any;
  allData: any = [];
  allData2: any = [];
  myurl: string;
  errorKeywordCount: number = 0;
  sentenceCount: number = 0;
  paragraphCount: number = 0;
  wordCount: number = 0;
  gradeLevelCount: number = 0;
  characterCount: number = 0;
  readTimeData: any = 0;
  showEmotionsProgressBar: boolean = false;
  showLanguageToneProgressBar: boolean = false;
  allEmotionData: any = {};
  allActivePassiveVoiceData: any = {};
  allSpellingGrammarData: any = [];
  totalEmotionsCount: number = 0;
  totalSentimentsCount: number = 0;
  totalPassiveVoiceCount: number = 0;
  totalSpellingGrammarCount: number = 0;
  allLanguageToneData: any = {};
  emotionScores: any = {};
  activePassiveVoiceScores: any = {};
  sentimentsScores: any = {};
  emotionalSentences: any = [];
  passiveSentences: any = [];
  spellingGrammarIncorrectWords: any = [];
  documentId: string;
  moduleInfoData: any = [];
  positiveSentences: any = [];
  negativeSentences: any = [];
  neutralSentences: any = [];
  isPlanExpired: boolean = true;
  isDocumentEdited: boolean = false;
  images: any = [];
  sortedEmotionsArray: any = [];
  sortedSentimentsArray: any = [];
  documentCreationLimitOver: any = false;
  wordAnalyseLimitOver: any = false;
  showAnalysisStatus: any = '';
  allowedWordLimitToEditor: number = 0;
  allDictionaryData: any = [];
  allDictionaryWordsData: any = [];
  dictionaryWordFoundArray: any = [];
  termsDictionaryWords: any = [];
  styleGuideDictionaryWords: any = [];
  deliveryDictionaryWords: any = [];
  inclusivityDictionaryWords: any = [];
  suggestedWord: string = '';
  documentInfoData: any = {};
  wordSuggestionsArray: any = [];
  activePassiveVoiceData: any = {};
  activeAIAnalysisModuleObject: any = {};
  hoveredDictionaryWordObject: any = {};
  clickedCardDataObject: any = {};
  adminDictionarWordsModule = ["styleGuide", "terms", "delivery", "inclusivity"];
  customIdsArray: any = [];
  apiErrorMessage: string = "";
  allGrammarMistakesData: any = {};
  grammarMistakesSentences: any = [];
  allSpellingMistakesData: any = {};
  spellingMistakesSentences: any = [];
  timeout;
  temp: any;
  carretIndex: number;
  nodeStack: any = [];

  allAIAnalysisModulesObject: any = {
    readability: {
      dotClass: 'readabilityDot', modulename: 'readability', moduleHeadText: 'Readability', tickClass: '', countLoaderClass: '', wordCountLoaderClass: '', mainLoaderClass: '',
      moduleDescription: `<p class="infoText">Readability is the ease with which a reader can understand a written text.</p>`
    },
    emotionalAnalysis: {
      dotClass: 'emotionsDot', modulename: 'emotionalAnalysis', moduleHeadText: 'Emotions', tickClass: '', countLoaderClass: '', wordCountLoaderClass: '', mainLoaderClass: '',
      moduleDescription: `<p class="infoText">It shows distribution of emotions: joy, fear, sadness, anger and surprise.</p>`
    },
    tonalAnalysis: {
      dotClass: 'sentimentsDot', modulename: 'tonalAnalysis', moduleHeadText: 'Tone', tickClass: '', countLoaderClass: '', wordCountLoaderClass: '', mainLoaderClass: '',
      moduleDescription: `<p class="infoText">It shows distribution of sentiments: positive, negative and neutral.</p>`
    },
    spellingGrammar: {
      dotClass: 'spellingGrammarDot', modulename: 'spellingGrammar', moduleHeadText: 'Grammar & Spelling', tickClass: '', countLoaderClass: '', wordCountLoaderClass: '', mainLoaderClass: '',
      moduleDescription: `<p class="infoText">No description available regarding spelling & grammar module.</p>`
    },
    terms: {
      dotClass: 'termsDot', modulename: 'terms', moduleHeadText: 'Terms', tickClass: 'terms_tick', countLoaderClass: 'terms_count_loader', wordCountLoaderClass: 'terms_word_count', mainLoaderClass: 'terms_loader',
      moduleDescription: `<p class="infoText">No description available regarding terms module.</p>`
    },
    styleGuide: {
      dotClass: 'styleGuideDot', modulename: 'styleGuide', moduleHeadText: 'Style', tickClass: 'style_guide_tick', countLoaderClass: 'style_guide_count_loader', wordCountLoaderClass: 'style_guide_word_count', mainLoaderClass: 'style_guide_loader',
      moduleDescription: `<p class="infoText">Style guides help a brand become consistent, and it helps to be easily identifiable with the audience.</p>`
    },
    clarity: {
      dotClass: 'clarityDot', modulename: 'clarity', moduleHeadText: 'Clarity', tickClass: '', countLoaderClass: '', wordCountLoaderClass: '', mainLoaderClass: '',
      moduleDescription: `<p class="infoText">Passive sentences often make it difficult to identify who is acting, as the sentence's subject is the person or item acted upon rather than the person who is performing the sentence. In active voice, although, it becomes easy to identify the performer as he/she is the subject of the sentence.</p>

      <p class="infoText">
      For example,
      Passive voice-"The book was read by Jim in one day."
      Active voice- "Jim read the book in one day."

      In the above case, when you read the sentence in the active voice, you immediately identify that "Jim" is performing an activity. In contrast, in passive voice, you get to know about the person performing the action at the end of the sentence. It just makes the reader work hard for no reason.</p>`
    },
    delivery: {
      dotClass: 'deliveryDot', modulename: 'delivery', moduleHeadText: 'Delivery', tickClass: 'delivery_tick', countLoaderClass: 'delivery_count_loader', wordCountLoaderClass: 'delivery_word_count', mainLoaderClass: 'delivery_loader',
      moduleDescription: `<p class="infoText">No description available regarding delivery module.</p>`
    },
    inclusivity: {
      dotClass: 'inclusivityDot', modulename: 'inclusivity', moduleHeadText: 'Inclusivity', tickClass: 'inclusivity_tick', countLoaderClass: 'inclusivity_count_loader', wordCountLoaderClass: 'inclusivity_word_count', mainLoaderClass: 'inclusivity_loader',
      moduleDescription: `<p class="infoText">Gender-neutral language or gender-inclusive language is language that avoids bias towards a particular sex or social gender.</p>`
    },
  };

  // Creating an object to change the highlighted text color as dynamically
  modulesHighlightingColorData: any = {
    love: {
      buttonColor: '#ff8080',
      progressBarColor: '#ff8080',
      borderColor: '#ff8080',
      textBgColor: '#faecec',
    },
    joy: {
      buttonColor: '#ffff00',
      progressBarColor: '#ffff00',
      borderColor: '#ffff00',
      textBgColor: '#ffffdc',
    },
    surprise: {
      buttonColor: '#02b290',
      progressBarColor: '#02b290',
      borderColor: '#0b6b3b',
      textBgColor: '#e4f7f3',
    },
    anger: {
      buttonColor: '#ff4c52',
      progressBarColor: '#ff4c52',
      borderColor: '#f30a59',
      textBgColor: '#fdedf2',
    },
    disgust: {
      buttonColor: '#ff80ff',
      progressBarColor: '#ff80ff',
      borderColor: '#6a067c',
      textBgColor: '#fff1ff',
    },
    fear: {
      buttonColor: '#0000ff',
      progressBarColor: '#0000ff',
      borderColor: '#50d855',
      textBgColor: '#f1ffe0',
    },
    sadness: {
      buttonColor: '#ff4c52',
      progressBarColor: '#ff4c52',
      borderColor: '#03a9f4',
      textBgColor: '#f0f6f9',
    },
    positive: {
      buttonColor: '#02b290',
      progressBarColor: '#02b290',
      borderColor: '#50d855',
      textBgColor: '#f1ffe0',
    },
    negative: {
      buttonColor: '#ff4c52',
      progressBarColor: '#ff4c52',
      borderColor: '#f30a59',
      textBgColor: '#fdedf2',
    },
    neutral: {
      buttonColor: '#cdd2d6',
      progressBarColor: '#cdd2d6',
      borderColor: '#cdd2d6',
      textBgColor: '#efefef',
    },
    "style-guide": {
      // textBgColor: '#5eebc1',
      textBgColor: '#48e7f2',
    },
    clarity: { textBgColor: '#dffdff' },
    spellingGrammar: { textBgColor: '#ffe5fb' },
    // grammarMistake: { textBgColor: '#ffe5fb' },
  };

  // Creating an object of module flags and checking which module are available for this subscription
  moduleFlagData = {
    emotionalAnalysis: false,
    tonalAnalysis: false,
    wordCount: false,
    sentenceCount: false,
    readingTime: false,
    copyText: false,
    generateReport: false,
    highlightText: false,
    analyseButton: false,
    downloadButton: false,
    socialShareButton: false,
    emailShare: false,
    facebookShare: false,
    twitterShare: false,
    linkedInShare: false,
    printButton: false,
    styleGuide: false,
    spellingGrammar: false,
    terms: false,
    clarity: false,
    delivery: false,
    inclusivity: false,
    characterCount: false,
    readability: false,
  };

  // Creating reactive form to send query and setting up the basic validations also
  myQueryForm = new FormGroup({
    topic: new FormControl('', [Validators.required, Validators.minLength(3)]),
    query: new FormControl('', [Validators.required]),
    file: new FormControl(),
    fileSource: new FormControl('', [Validators.required]),
  });

  // Creating reactive form to send feedback and setting up the basic validations also
  myFeedbackForm = new FormGroup({
    feedback_topic: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    feedback: new FormControl('', [Validators.required]),
    feedback_file: new FormControl(),
    fileSource: new FormControl('', [Validators.required]),
  });

  constructor(
    private panelService: PanelService,
    public userService: UserService,
    private loaderService: LoaderService,
    private routes: Router,
    private _Activatedroute: ActivatedRoute,
    public utilityService: UtilityService,
    public csvUploadService: CsvFileUploadService,
    public httpCancelService: HttpCancelService,

  ) { }

  async ngOnInit(): Promise<void> {
    console.log('TextEditorComponent ngOnInit called');
    this.myurl = window.location.href;
    this.documentId = this._Activatedroute.snapshot.paramMap.get('id');

    // return;

    // Setting few event handlers
    this.setEventHandlers();

    $("[data-toggle=popover]").popover();

    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    })

    this.activeAIAnalysisModuleObject = this.allAIAnalysisModulesObject["styleGuide"];

    console.log("this.activeAIAnalysisModuleObject");
    console.log(this.activeAIAnalysisModuleObject);

    // Note:The doubleCheckDocumentCreationLimit function is just checking user's document creation limit
    // the reason behind that is maybe user visits to this url directly then also he will only able to do
    // anything if his/her document creaition limit is not exceeded.

    // Before user do anything such as writting,emotion analyse just simply check his document creation
    // limit if limit is not exceeded then only move forward otherwise by shong alert simply terminate
    if (this.documentId == 'new') {
      await this.doubleCheckDocumentCreationLimit();
    }

    this.changedTextEditorState();

    // The below code is checking any document id is there in current route
    this._Activatedroute.queryParams.subscribe((params) => {
      console.log('Query params.');
      console.log(params['id']);
      if (params['id']) {
        this.documentId = params['id'];
      }
      console.log('Query params.');
      console.log(this.documentId);
    });

    console.log("this._Activatedroute.snapshot.paramMap.get('id')");
    console.log(this._Activatedroute.snapshot.paramMap.get('id'));

    console.log('ngOnInit this.documentId');
    console.log(this.documentId);

    // Checking is user's subscription has been currently active or
    // not if not then don't fetch any notifications
    // if (this.isPlanExpired) {
    //   this.fetchAllUnreadNotifications();
    // }

    this.checkUserSubscriptionExpiryDate();
    this.getModuleInfoBySubscription();
  }

  ngAfterViewInit() {
    this.onEditorEnter(null);
  }

  // ngAfterViewInit() {
  //   console.log("ngAfterViewInit called");

  //   $("[data-toggle=popover]").popover();

  //   $(function () {
  //     $('[data-toggle="tooltip"]').tooltip();
  //   })

  //   this.activeAIAnalysisModuleObject = this.allAIAnalysisModulesObject["styleGuide"];

  //   console.log("this.activeAIAnalysisModuleObject");
  //   console.log(this.activeAIAnalysisModuleObject);
  // }

  doubleCheckDocumentCreationLimit() {
    console.log('Text editor checkDocumentCreationLimit called');
    return this.panelService
      .doubleCheckUserDocumentCreationLimit()
      .then((data) => {
        console.log('doubleCheckDocumentCreationLimit api response');
        console.log(data);

        if (data != 'success') {
          // $('#analyseBtn').addClass('pointer_events_none');
          this.documentCreationLimitOver = true;
          Swal.fire({
            title: `<p class='swalText'>Can't create new document 😦</p>`,
            html: `<p class='swalText'>Your ${data}.</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn swal_button_style',
            },
          });
        }
      })
      .catch((error) => {
        console.log('doubleCheckUserDocumentCreationLimit api error');
        console.log(error);
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn swal_button_style',
          },
        });
      })
      .finally(() => {
        console.log('resp');
        return Promise.resolve(true);
      });
  }

  checkUserWordAnalyseCount() {
    console.log('checkUserWordAnalyseCount called');
    let word_count = document
      .getElementById('editor')
      .innerText.split(' ').length;
    return this.panelService
      .checkUserWordAnalyseLimit(word_count)
      .then((data) => {
        console.log('checkUserWordAnalyseCount api response');
        console.log(data);
        if (data != 'success') {
          this.wordAnalyseLimitOver = true;
          $('#tempData *').addClass('pointer_events_none');
          Swal.fire({
            title: `<p class='swalText'>Can't Analyse 😦</p>`,
            html: `<p class='swalText'>Your ${data}.</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn swal_button_style',
            },
          });
          return false;
        }
        return true;
      })
      .catch((error) => {
        console.log('checkUserWordAnalyseCount api error');
        console.log(error);
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      })
      .finally(() => {
        console.log('resp');
        return Promise.resolve(true);
      });
  }

  fetchAllUnreadNotifications() {
    console.log('fetchAllUnreadNotifications called');

    // Showing Notification Counter Loding
    $('.notifications').addClass('pointer_events_none');
    $('#notification_counter').addClass('display_none');
    $('.notification_count_loader').removeClass('display_none');

    // return;
    this.panelService.getAllUnreadNotifications().subscribe(
      (data) => {
        console.log('fetchAllUnreadNotifications api response');

        // Hiding Notification Counter Loding
        $('.notifications').removeClass('pointer_events_none');
        $('#notification_counter').removeClass('display_none');
        $('.notification_count_loader').addClass('display_none');

        console.log(data);
        this.utilityService.unreadNotificationsCount = data.length;
        this.utilityService.allUnreadNotificationsData = data;
        console.log('this.allUnreadNotificationsData');
        console.log(this.utilityService.allUnreadNotificationsData);
      },
      (error) => {
        console.log('fetchAllUnreadNotifications api error');
        console.log(error);

        // Hiding Notification Counter Loding
        $('.notifications').removeClass('pointer_events_none');
        $('#notification_counter').removeClass('display_none');
        $('.notification_count_loader').addClass('display_none');

        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  checkUserSubscriptionExpiryDate() {
    console.log('checkUserSubscriptionExpiryDate called');
    this.panelService.checkUserPlanExpiry().subscribe(
      (data) => {
        console.log('checkUserPlanExpiry api response');
        console.log(data);
        this.isPlanExpired = data.expiry_date == 'expired' ? false : true;
        console.log('this.isPlanExpired');
        console.log(this.isPlanExpired);

        if (this.isPlanExpired) {
          this.checkAllowedWordLimitToTextEditor();
        }

        // Checking whether user's current active subscription got expired or not
        // if not the calculate how many days left to expire subscription
        let subscriptionExpiryStatus =
          data.expiry_date == 'expired'
            ? 'Expired'
            : this.utilityService.subtractDate(new Date(), data.expiry_date);
        console.log('subscriptionExpiryStatus');
        console.log(subscriptionExpiryStatus);
        $('.subscriptionDaysCount').text(subscriptionExpiryStatus);
      },
      (error) => {
        console.log('getModuleBySubscription api error');
        console.log(error);
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  getModuleInfoBySubscription() {
    console.log('getModuleInfoBySubscription called');
    this.panelService
      .getModuleBySubscription()
      .subscribe(
        (data) => {
          console.log('getModuleBySubscription api called');
          console.log(data);
          console.log(data['subscriptionInfo']['moduleInfo']);
          this.moduleInfoData = data['subscriptionInfo']['moduleInfo'];
          console.log('getModuleInfoBySubscription this.moduleInfoData');
          console.log(this.moduleInfoData);

          // The below loop is checking which modules are available to this subscription and making their flags to true
          for (let i = 0; i < this.moduleInfoData.length; i++) {
            let flag = this.moduleInfoData[i].flag;
            this.moduleFlagData[flag] = true;
            // this.moduleDataWithId[flag] = this.moduleInfoData[i].id;
          }

          // The below code is checking that is any social sharing feature is available to this subscription if not then hide all the social buttons
          this.moduleFlagData.socialShareButton =
            !this.moduleFlagData.emailShare &&
              !this.moduleFlagData.facebookShare &&
              !this.moduleFlagData.twitterShare &&
              !this.moduleFlagData.linkedInShare
              ? true
              : false;

          console.log('moduleFlagData');
          console.log(this.moduleFlagData);
          this.getDocumentIdFromUrl();
        },
        (error) => {
          console.log('getModuleBySubscription api error');
          console.log(error);
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  getDocumentIdFromUrl() {
    console.log('getDocumentIdFromUrl called');
    console.log(this.documentId);
    if (this.documentId && this.documentId != 'new') {
      console.log('inside getDocumentIdFromUrl if');
      this.getSavedDocumentDataViaId(+this.documentId);
    }
  }

  getSavedDocumentDataViaId(document_id) {
    console.log('getSavedDocumentDataViaId called');
    this.panelService
      .getSavedDocumentById(document_id)
      .subscribe(
        (data) => {
          console.log('getSavedDocumentById api response');
          console.log(data);
          if (data.msg == 'success') {
            console.log('data.data.text');
            console.log(data.data.text);
            this.documentInfoData = data.data;

            console.log("this.documentInfoData");
            console.log(this.documentInfoData);

            document.getElementById('editor').innerHTML = data.data.text;
            // $('#editor').html(data.data.text);
            this.documentData = document.getElementById('editor').innerText;
            console.log('getSavedDocumentDataViaId this.documentData');
            console.log(this.documentData);

            if (data.data.text) {
              this.showAnalysis('n');
            }
          }
        },
        (error) => {
          console.log('getSavedDocumentDataViaId api error');
          console.log(error);
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  saveDocumentData(editorBody, action) {
    console.log('saveDocumentData data');
    console.log(editorBody);

    // Extracting document title and saving it into the database
    editorBody.title = $('#documentTitle').val() ? $('#documentTitle').val() : this.documentInfoData.title;
    console.log(editorBody);

    let sendDocumentId = null;
    if (action == 'update') {
      console.log('action update');
      sendDocumentId = this.documentId;
      console.log('sendDocumentId');
      console.log(sendDocumentId);
    }

    // $('.documentSaved_wrapper').removeClass('display_none');

    this.panelService
      .saveDocument(editorBody, sendDocumentId)
      .subscribe(
        (data) => {
          console.log('saveDocument api response');
          console.log(data);

          // $(".savingDocument_text").
          // $('.documentSaved_wrapper').removeClass('display_none');

          console.log('action');
          console.log(action);

          if (action == 'insert') {
            this.documentId = data.data.id;
            this.routes.navigate([], {
              queryParams: { id: this.documentId },
              queryParamsHandling: 'merge',
            });
          }

          // If showAnalyse button clicked directly by the user and then we need to check word analyse count
          if (this.showAnalysisStatus == 'y') {
            this.setWordAnalyseCount();
          }
        },
        (error) => {
          console.log('saveDocument api error');
          console.log(error);
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  async showAnalysis(status) {
    console.log('showAnalysis called');

    // Before analysing get the cursor current position and store it in a variable
    this.carretIndex = this.getSelectionCharacterOffsetWithin(document.getElementById("editor"));
    console.log("this.carretIndex");
    console.log(this.carretIndex);

    // Before analysing cancelling all the previous pending http request before calling new http request
    this.httpCancelService.cancelPendingRequests();

    // If existed document opened for the first time the status
    // would be 'n' and no need to check word analyse count,but if user directly clicks on the
    // showAnalyse button the status would be 'y' and then we need to check word analyse count
    this.showAnalysisStatus = status;

    // Before analysing firstly checking is user plan is expired or not
    // if yes then no need to analyse simply returm
    if (this.isPlanExpired) {
      // Before analysing firstly clearing all the previous highlighted text

      this.clearEditor();

      // Hiding the emotions and sentiments scores in every new analyse till the new analyse response get
      this.showEmotionsProgressBar = this.showLanguageToneProgressBar = false;

      // Getting Text editor text
      const editorBody = this.getTextEditorDataInTextFormat();

      // The below if is checking is there any text in the text editor
      // if it is empty then no need to analyse
      if (editorBody.editorText) {
        console.log('inside editorBody.editorText if');
        console.log('showAnalysis this.documentId');
        console.log(this.documentId);

        // Before analysing checking is user's word analyse limit is exceeded or not
        if (status == 'y') {
          console.log('word analyse hoga pehle');

          // Firstly checking is user's word analyse limit
          const wordAnalyseLimit = await this.checkUserWordAnalyseCount();
          console.log('wordAnalyseLimit');
          console.log(wordAnalyseLimit);

          // If user's word analyse limit is over then don't need to move proceed simply just terminate
          if (!wordAnalyseLimit) { return; }

          console.log('kar har maidan fateh');
        }

        // The below if is checking is new document is creating or existing one needs to analyse
        if (this.documentId == 'new') {
          console.log('if this.documentId');
          console.log(this.documentId);
          this.saveDocumentData(this.getTextEditorDataInHTMLFormat(), 'insert');
        } else {
          console.log('else this.documentId');
          console.log(this.getTextEditorDataInHTMLFormat());
          this.saveDocumentData(this.getTextEditorDataInHTMLFormat(), 'update');
        }

        // Fecth gradw level count of editor text
        this.fetchGradeLevelCount(editorBody);

        console.log('showAnalysis this.moduleInfoData');
        console.log(this.moduleInfoData);

        // The below all if conditons are checking whether this module is present
        // in user's active subscription  or not if yes then only call the function
        if (this.moduleFlagData.emotionalAnalysis) {
          console.log('emotionalAnalysis Zarur hoga.!');
          if ((this.documentData.split(' ').length > 5)) {
            this.showEmotionCountData(editorBody);
          }
        }

        if (this.moduleFlagData.tonalAnalysis) {
          console.log('tonalAnalysis Zarur hoga.!');
          this.showLanguageToneCountData(editorBody);
        }

        if (this.moduleFlagData.clarity) {
          console.log('active passive voice Zarur hoga.!');
          this.showActivePassiveVoiceCountData(editorBody);
        }

        if (this.moduleFlagData.wordCount) {
          this.showWordCount(editorBody);
        }

        if (this.moduleFlagData.characterCount) {
          this.showCharacterCount(editorBody);
        }

        if (this.moduleFlagData.readingTime) {
          this.showReadTimeData(editorBody);
        }

        // if (this.moduleFlagData.spellingGrammar) {
        //   this.showSpellingGrammarData(editorBody);
        // }

        if (this.moduleFlagData.spellingGrammar) {
          // this.testForkJoin(editorBody);
          // this.showGrammarMistakesData(editorBody);
          this.showSpellingMistakesData(editorBody);
        }

        const activeModulename = $('.analysisCardWrapper.active').data('modulename');
        console.log("Show Analysis activeModulename");
        console.log(activeModulename);

        if (this.adminDictionarWordsModule.includes(activeModulename)) {
          console.log("adminDictionarWordsModule if");
          this.getDictionaryWordsByModule();
        }

      } else {
        console.log('inside editorBody.editorText else');
        // this.showEmotionalData =
        //   this.showLanguageData =
        //   this.showActivePassiveData =
        //   this.showDictionaryWordData =
        //   this.showSpellingGrammarInfo =
        //   false;
        Swal.fire({
          title: `<p class='swalText'>Oops.. 😦</p>`,
          html: `<p class='swalText'>Nothing to analyse.</p>`,
          icon: 'warning',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    }
  }

  setWordAnalyseCount() {
    console.log('setWordAnalyseCount called');
    let word_count = document
      .getElementById('editor')
      .innerText.split(' ').length;

    console.log('setWordAnalyseCount word_count');
    console.log(word_count);

    console.log('setWordAnalyseCount documentId');
    console.log(this.documentId);

    // Forming the object to be inserted
    let insertAnalysedWordObject = {
      document_id: this.documentId,
      user_id: this.userService.userData.id,
      word_count: word_count,
    };

    console.log('insertAnalysedWordObject');
    console.log(insertAnalysedWordObject);

    this.panelService
      .insertAnalysedWordRecord(insertAnalysedWordObject)
      .subscribe(
        (data) => {
          console.log('insertAnalysedWordRecord api response');
          console.log(data);
        },
        (error) => {
          console.log('insertAnalysedWordRecord api error');
          console.log(error);
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showEmotionCountData(editorBody) {
    console.log('showEmotionCountData called');

    this.loaderService.showLoading('emotion_analysis_loader');
    $('#emotion_count_loader').removeClass('display_none');
    $('.emotion_count').addClass('display_none');

    this.panelService
      .showEmotionCount(editorBody)
      .subscribe(
        (data) => {
          console.log('showEmotionCount api response');
          console.log(data);

          // Hide emotions loading after getting emotions api response
          $('#emotion_count_loader').addClass('display_none');
          $('.emotion_count').removeClass('display_none');
          this.loaderService.hideLoading('emotion_analysis_loader');

          // Firstly assigning all api data to local array
          this.allEmotionData = data;
          this.totalEmotionsCount = Object.keys(this.allEmotionData.overall_scores.emotions).length;

          console.log('this.allEmotionData');
          console.log(this.allEmotionData);

          //Extracting all the api response objects and convert them into an array of objects
          this.emotionalSentences = Object.keys(this.allEmotionData.text_labels).map((key) => this.allEmotionData.text_labels[key]);

          console.log('showEmotionCountData emotionalSentences');
          console.log('this.emotionalSentences');
          console.log(this.emotionalSentences);

          //Extracted emotions object from api responese of nested object
          this.emotionScores = data.overall_scores.emotions;
          console.log('this.emotionScores');
          console.log(this.emotionScores);

          //Append the key to that object as well
          this.sortedEmotionsArray = Object.keys(this.emotionScores).map(
            (key) => {
              this.emotionScores[key].emotion = key;
              return this.emotionScores[key];
            }
          );

          //After extracting sort them by percentange_of_pie value
          this.sortedEmotionsArray.sort(
            (a, b) => b.percentange_of_pie - a.percentange_of_pie
          );
          console.log('sortedEmotionsArray');
          console.log(this.sortedEmotionsArray);

          // After emotions api data processing unhide the sentiments progress bar
          this.showEmotionsProgressBar = true;
        },
        (error) => {
          console.log('emotions mai error aaya.');
          console.log(error);
          $('#emotion_count_loader').addClass('display_none');
          $('.emotion_count').removeClass('display_none');
          this.loaderService.hideLoading('emotion_analysis_loader');
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showLanguageToneCountData(editorBody) {
    console.log('showLanguageToneCountData called');

    $('#sentiments_count_loader').removeClass('display_none');
    $('.sentiments_count').addClass('display_none');
    this.loaderService.showLoading('sentiments_analysis_loader');

    this.panelService.showLanguageToneCount(editorBody).subscribe(
      (data) => {
        // Hide sentiments loading after getting sentiments api response
        $('#sentiments_count_loader').addClass('display_none');
        $('.sentiments_count').removeClass('display_none');
        this.loaderService.hideLoading('sentiments_analysis_loader');
        console.log('showLanguageToneCount api response');
        console.log(data);

        // Firstly assigning all api data to local array
        this.allLanguageToneData = data;

        this.totalSentimentsCount = Object.keys(
          this.allLanguageToneData.overall_scores.sentiments
        ).length;

        console.log('this.allLanguageToneData');
        console.log(this.allLanguageToneData);

        //Extracting all the positive sentences from sentiments api response object
        this.positiveSentences = Object.keys(
          this.allLanguageToneData.text_labels
        ).map((key) => this.allLanguageToneData.text_labels[key]);
        this.positiveSentences = this.positiveSentences.filter(
          (item) => item.sentiment_label == 1
        );

        console.log('this.positiveSentences');
        console.log(this.positiveSentences);

        //Extracting all the negative sentences from sentiments api response object
        this.negativeSentences = Object.keys(
          this.allLanguageToneData.text_labels
        ).map((key) => this.allLanguageToneData.text_labels[key]);
        this.negativeSentences = this.negativeSentences.filter(
          (item) => item.sentiment_label == 0
        );

        console.log('this.negativeSentences');
        console.log(this.negativeSentences);

        //Extracting all the neutral sentences from sentiments api response object
        this.neutralSentences = Object.keys(
          this.allLanguageToneData.text_labels
        ).map((key) => this.allLanguageToneData.text_labels[key]);
        this.neutralSentences = this.neutralSentences.filter(
          (item) => item.sentiment_label == 2
        );

        console.log('this.neutralSentences');
        console.log(this.neutralSentences);

        //Extracted emotions object from api responese of nested object
        this.sentimentsScores = data.overall_scores.sentiments;
        console.log('this.sentimentsScores');
        console.log(this.sentimentsScores);

        //Append the key to that object as well
        this.sortedSentimentsArray = Object.keys(this.sentimentsScores).map(
          (key) => {
            this.sentimentsScores[key].sentiments = key;
            return this.sentimentsScores[key];
          }
        );

        //After extracting sort them by percentange_of_pie value
        this.sortedSentimentsArray.sort(
          (a, b) => b.percentange_of_pie - a.percentange_of_pie
        );
        console.log('sortedSentimentsArray');
        console.log(this.sortedSentimentsArray);

        // After sentiments api data processing unhide the sentiments progress bar
        this.showLanguageToneProgressBar = true;
      },
      (error) => {
        console.log('tonal mai error aaya.');
        console.log(error);
        $('#sentiments_count_loader').addClass('display_none');
        $('.sentiments_count').removeClass('display_none');
        this.loaderService.hideLoading('sentiments_analysis_loader');
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  showActivePassiveVoiceCountData(editorBody) {
    console.log('showActivePassiveVoiceCountData called');

    this.loaderService.showLoading('active_passive_loader');
    $('#voice_count_loader').removeClass('display_none');
    $('.voice_count').addClass('display_none');

    this.panelService
      .showActivePassiveVoiceCount(editorBody)
      .subscribe(
        (data) => {
          console.log('showActivePassiveVoiceCount api response');
          console.log(data);

          // Hide emotions loading after getting emotions api response
          $('#voice_count_loader').addClass('display_none');
          $('.voice_count').removeClass('display_none');
          this.loaderService.hideLoading('active_passive_loader');

          // Firstly assigning all api data to local array
          this.allActivePassiveVoiceData = data;
          this.totalPassiveVoiceCount =
            this.allActivePassiveVoiceData.overall_scores.voice_type.passive.sentence_count;

          console.log('this.allActivePassiveVoiceData');
          console.log(this.allActivePassiveVoiceData);

          //Extracting all the api response objects and convert them into an array of objects
          this.passiveSentences = Object.keys(
            this.allActivePassiveVoiceData.passive_sentences
          ).map((key) => this.allActivePassiveVoiceData.passive_sentences[key]);

          console.log('showActivePassiveVoiceCountData passiveSentences');
          console.log('this.passiveSentences');
          console.log(this.passiveSentences);

          //Extracted passive sentence object from api responese of nested object
          this.activePassiveVoiceScores = data.overall_scores.voice_type;
          console.log('this.activePassiveVoiceScores');
          console.log(this.activePassiveVoiceScores);

          const activeModulename = $('.analysisCardWrapper.active').data('modulename');
          console.log("ShowActivePassiveVoiceCount activeModulename");
          console.log(activeModulename);

          if (activeModulename == "clarity") {
            this.highlightSelectedSentence();
          }
        },
        (error) => {
          console.log('showActivePassiveVoiceCount mai error aaya.');
          console.log(error);
          $('#emotion_count_loader').addClass('display_none');
          $('.emotion_count').removeClass('display_none');
          this.loaderService.hideLoading('active_passive_loader');
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showSpellingGrammarData(editorBody) {
    console.log('showSpellingGrammarData called');

    this.loaderService.showLoading('spellingGrammar_loader');
    $('#spelling_grammar_loader').removeClass('display_none');
    $('.spelling_grammar_count').addClass('display_none');

    this.panelService
      .showSpellingGrammarCount(editorBody)
      .subscribe(
        (data) => {
          console.log('showSpellingGrammarCount api response');
          console.log(data);

          // Hide spelling and grammar loading after getting showSpellingGrammarCount api response
          $('#spelling_grammar_loader').addClass('display_none');
          $('.spelling_grammar_count').removeClass('display_none');
          this.loaderService.hideLoading('spellingGrammar_loader');

          // let editorHTML = $('#editor').text();
          let editorHTML = this.documentData;
          // console.log("showSpellingGrammarCount editorHTML");
          // console.log(editorHTML);
          // console.log("this.documentData");
          // console.log(this.documentData);

          // Firstly filter and remove all "" " ." " ," word consist object
          this.allSpellingGrammarData = data.matches
            .filter(item => {
              console.log("editorHTML.substr(item.offset, item.length)");
              console.log("item.offset = " + item.offset + " item.length = " + item.length);
              console.log(editorHTML.substr(item.offset, item.length));
              const word = editorHTML.substr(item.offset, item.length);
              console.log("word");
              console.log(word);
              console.log("word.replace(/\s/g, '').length")
              console.log(word.replace(/\s/g, '').length);

              if ((word.replace(/\s/g, '').length) && (word != " ." && word != " ,")) {
                while (true) {
                  console.log('check unique id hain');
                  let customId = Math.random().toString(36).substr(2, 9);
                  if (!this.customIdsArray.includes(customId)) {
                    console.log('Id unique hain');
                    item.wordid = customId;
                    item.text = word;
                    this.customIdsArray.push(customId);
                    break;
                  }
                }
                return item
              };
            });

          console.log("this.customIdsArray");
          console.log(this.customIdsArray);

          console.log('this.allSpellingGrammarData');
          console.log(this.allSpellingGrammarData);


          this.spellingGrammarIncorrectWords = this.allSpellingGrammarData
            .filter(o => o)
            .map(item => {
              console.log("editorHTML.substr(item.offset, item.length)");
              console.log("item.offset = " + item.offset + " item.length = " + item.length);
              console.log(editorHTML.substr(item.offset, item.length));
              const word = editorHTML.substr(item.offset, item.length);
              if ((word.replace(/\s/g, '').length) && (word != " ." && word != " ,")) {
                return { id: item.wordid, word: word }
              };
            });

          this.spellingGrammarIncorrectWords = this.spellingGrammarIncorrectWords.filter(o => o);

          console.log('this.spellingGrammarIncorrectWords');
          console.log(this.spellingGrammarIncorrectWords);

          this.totalSpellingGrammarCount = this.spellingGrammarIncorrectWords.length;

          console.log('this.totalSpellingGrammarCount');
          console.log(this.totalSpellingGrammarCount);

          const activeModulename = $('.analysisCardWrapper.active').data('modulename');
          console.log("ShowSpellingGrammarCount activeModulename");
          console.log(activeModulename);

          if (activeModulename == "spellingGrammar") {
            this.highlightSpellingGrammarWords();
          }
        },
        (error) => {
          console.log('showSpellingGrammarCount mai error aaya.');
          console.log(error);

          $('#spelling_grammar_loader').addClass('display_none');
          $('.spelling_grammar_count').removeClass('display_none');
          this.loaderService.hideLoading('spellingGrammar_loader');

          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showGrammarMistakesData(editorBody) {
    console.log('showGrammarMistakesData called');

    this.loaderService.showLoading('spellingGrammar_loader');
    $('#spelling_grammar_loader').removeClass('display_none');
    $('.spelling_grammar_count').addClass('display_none');

    this.panelService
      .showGrammarMistakes(editorBody)
      .subscribe(
        (data) => {
          console.log('showGrammarMistakesData api response');
          console.log(data);

          // Hide spelling and grammar loading after getting showSpellingGrammarCount api response
          $('#spelling_grammar_loader').addClass('display_none');
          $('.spelling_grammar_count').removeClass('display_none');
          this.loaderService.hideLoading('spellingGrammar_loader');

          this.allGrammarMistakesData = data.corrections;

          console.log("this.allGrammarMistakesData");
          console.log(this.allGrammarMistakesData);

          this.grammarMistakesSentences = Object.keys(this.allGrammarMistakesData).map((key) => this.allGrammarMistakesData[key]);

          console.log('showGrammarMistakes grammarMistakesSentences');
          console.log('this.grammarMistakesSentences');
          console.log(this.grammarMistakesSentences);

          if (this.activeAIAnalysisModuleObject.modulename == "spellingGrammar") {
            this.highlightSelectedSentence();
          }

        },
        (error) => {
          console.log('showSpellingGrammarCount mai error aaya.');
          console.log(error);

          // Hide spelling and grammar loading after getting showSpellingGrammarCount api response
          $('#spelling_grammar_loader').addClass('display_none');
          $('.spelling_grammar_count').removeClass('display_none');
          this.loaderService.hideLoading('spellingGrammar_loader');

          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showSpellingMistakesData(editorBody) {
    console.log('showSpellingMistakesData called');

    this.loaderService.showLoading('spellingGrammar_loader');
    $('#spelling_grammar_loader').removeClass('display_none');
    $('.spelling_grammar_count').addClass('display_none');

    this.panelService
      .showSpellingMistakes(editorBody)
      .subscribe(
        (data) => {
          console.log('showSpellingMistakesData api response');
          console.log(data);

          // Hide spelling and grammar loading after getting showSpellingGrammarCount api response
          $('#spelling_grammar_loader').addClass('display_none');
          $('.spelling_grammar_count').removeClass('display_none');
          this.loaderService.hideLoading('spellingGrammar_loader');

          this.allSpellingMistakesData = data.suggestions;

          console.log("this.allSpellingMistakesData");
          console.log(this.allSpellingMistakesData);

          this.spellingMistakesSentences = Object
            .keys(this.allSpellingMistakesData)
            .map((key) => {
              let item = this.allSpellingMistakesData[key];
              while (true) {
                console.log('check unique id hain');
                let customId = Math.random().toString(36).substr(2, 9);
                if (!this.customIdsArray.includes(customId)) {
                  console.log('Id unique hain');
                  item.wordid = customId;
                  // item.text = word;
                  this.customIdsArray.push(customId);
                  break;
                }
              }
              return item;
            });

          console.log('showGrammarMistakes spellingMistakesSentences');
          console.log('this.spellingMistakesSentences');
          console.log(this.spellingMistakesSentences);

          if (this.activeAIAnalysisModuleObject.modulename == "spellingGrammar") {
            this.highlightSpellingGrammarWords();
          }
        },
        (error) => {
          console.log('showSpellingGrammarCount mai error aaya.');
          console.log(error);

          // Hide spelling and grammar loading after getting showSpellingGrammarCount api response
          $('#spelling_grammar_loader').addClass('display_none');
          $('.spelling_grammar_count').removeClass('display_none');
          this.loaderService.hideLoading('spellingGrammar_loader');

          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showParagraphCount(editorBody) {
    this.panelService.countParagrapgh(editorBody).subscribe((data) => {
      console.log('showParagraphCount');
      console.log(data);
      this.paragraphCount = data[0].Total_Paragraphs;
    });
  }

  fetchGradeLevelCount(editorBody) {
    console.log('fetchGradeLevelCount called');

    $('#readability_count_loader').removeClass('display_none');
    $('.readability_count').addClass('display_none');

    this.panelService
      .getGradeLevelCount(editorBody)
      .subscribe(
        (data) => {
          console.log('fetchGradeLevelCount api response');
          console.log(data);

          $('#readability_count_loader').addClass('display_none');
          $('.readability_count').removeClass('display_none');

          this.gradeLevelCount = data.overall_scores.total_grade_level[0];
          console.log('this.gradeLevelCount');
          console.log(this.gradeLevelCount);
        },
        (error) => {
          $('#readability_count_loader').addClass('display_none');
          $('.readability_count').removeClass('display_none');

          console.log('fetchGradeLevelCount api error');
          console.log(error);

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showWordCount(editorBody) {
    console.log('showWordCount called');

    $('#word_count_loader').removeClass('display_none');
    $('.wordCount').addClass('display_none');

    this.panelService.countWord(editorBody).subscribe(
      (data) => {
        console.log('showWordCount api response');
        $('#word_count_loader').addClass('display_none');
        $('.wordCount').removeClass('display_none');

        console.log(data);
        this.wordCount = data[0].Total_Words;

        // The below line is validating text editor's allowed word limit with current entered word length
        // this.validatedTextEditorLength();
      },
      (error) => {
        $('#word_count_loader').addClass('display_none');
        console.log('word count api error');
        console.log(error);
        $('.wordCount').removeClass('display_none');

        // Showing alert if API responded with any error
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  showCharacterCount(editorBody) {
    console.log('showCharacterCount called');

    $('#character_count_loader').removeClass('display_none');
    $('.characterCount').addClass('display_none');

    this.panelService
      .countCharacter(editorBody)
      .subscribe(
        (data) => {
          console.log('showCharacterCount api response');
          console.log(data);

          $('#character_count_loader').addClass('display_none');
          $('.characterCount').removeClass('display_none');

          this.characterCount = data[0].total_characters;

          // The below line is validating text editor's allowed word limit with current entered word length
          // this.validatedTextEditorLength();
        },
        (error) => {
          console.log('word count api error');
          console.log(error);
          $('#character_count_loader').addClass('display_none');
          $('.characterCount').removeClass('display_none');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  showSentenceCount(editorBody) {
    console.log('showSentenceCount called');
    console.log(editorBody.editorText);

    $('#sentence_count_loader').removeClass('display_none');
    $('.sentenceCount').removeClass('display_none');

    this.panelService.countSentence(editorBody).subscribe(
      (data) => {
        console.log('showSentenceCount api response');
        $('#sentence_count_loader').addClass('display_none');
        $('.sentenceCount').removeClass('display_none');

        console.log(data);
        this.sentenceCount = data[0].Total_Sentences;
      },
      (error) => {
        $('#sentence_count_loader').addClass('display_none');
        $('.sentenceCount').removeClass('display_none');

        console.log('sentence count api error');
        console.log(error);

        // Showing alert if API responded with any error
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  showReadTimeData(editorBody) {
    console.log('showReadTimeData called');

    $('#reading_time_loader').removeClass('display_none');
    $('.readingTimeCount').addClass('display_none');

    this.panelService.showReadTime(editorBody).subscribe(
      (data) => {
        console.log('showReadTime api response');
        $('#reading_time_loader').addClass('display_none');
        $('.readingTimeCount').removeClass('display_none');
        this.readTimeData =
          data.read_time_minutes + 'm:' + data.read_time_seconds + 's';
      },
      (error) => {
        $('#reading_time_loader').addClass('display_none');
        $('.readingTimeCount').removeClass('display_none');
        console.log('reading time api error');
        console.log(error);

        // Showing alert if API responded with any error
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  highlightSelectedSentence(e = null, text = null) {
    console.log('highlightSelectedSentence called.');
    console.log('this.moduleFlagData.highlightText');
    console.log(this.moduleFlagData.highlightText);
    console.log("text");
    console.log(text);

    // if (!this.moduleFlagData.highlightText) {
    //   Swal.fire({
    //     title: `<p class='swalText'>Sorry...</p>`,
    //     html: `<p class='swalText'>Please upgrade you plan to use "Highlight text" feature.</p>`,
    //     icon: 'warning',
    //     buttonsStyling: false,
    //     customClass: { confirmButton: 'btn swal_button_style' },
    //   });
    //   return;
    // }

    // Fetching module name(new ui)
    let moduleName = $('.analysisCardWrapper.active').data('modulename');
    console.log('moduleName');
    console.log(moduleName);

    this.clearEditor();
    let tempFilteredSentenceArray = [],
      moduleBtn;

    // if (text) {
    //   moduleBtn = e.target.id;

    //   console.log('eee');
    //   console.log(e.target);
    //   console.log(e.target.id);

    //   console.log('moduleBtn elemenet');
    //   console.log(document.getElementById(moduleBtn) as HTMLButtonElement);

    //   (document.getElementById(moduleBtn) as HTMLButtonElement).classList.add('active');
    // }

    // Checking which module's button has been clicked before highlighing the sentence
    if (moduleName == "emotionalAnalysis") {
      if (this.emotionalSentences.length) {
        console.log('this.emotionalSentences');
        console.log(this.emotionalSentences);
        this.emotionalSentences.forEach(function (arrayItem) {
          if (arrayItem['emotion_label'] == text) {
            tempFilteredSentenceArray.push({
              text: arrayItem['text'],
              emotion_label: arrayItem['emotion_label'],
            });
          }
        });
      }
    }
    else if (moduleName == "tonalAnalysis") {
      let sentimentSentencesArray = [];
      console.log('inside tonal');
      if (moduleBtn == 'positiveBtn') {
        console.log('inside positiveBtn');
        sentimentSentencesArray = this.positiveSentences;
      } else if (moduleBtn == 'negativeBtn') {
        console.log('inside negativeBtn');
        sentimentSentencesArray = this.negativeSentences;
      } else if (moduleBtn == 'neutralBtn') {
        console.log('inside neutralBtn');
        sentimentSentencesArray = this.neutralSentences;
      }

      console.log('array formed');
      if (sentimentSentencesArray.length) {
        console.log('sentimentSentencesArray');
        console.log(sentimentSentencesArray);
        sentimentSentencesArray.forEach(function (arrayItem) {
          console.log('arrayItem in sentimentSentencesArray case');
          console.log('sentimentSentencesArray ka if true hua.');
          tempFilteredSentenceArray.push({
            text: arrayItem['text'],
            sentiment_label: arrayItem['sentiment_label'],
          });
        });
      }
    }
    else if (moduleName == "clarity") {
      let passiveSentencesArray = [];
      console.log('inside clarity');
      passiveSentencesArray = this.passiveSentences;

      if (passiveSentencesArray.length) {
        console.log('passiveSentencesArray');
        console.log(passiveSentencesArray);

        passiveSentencesArray.forEach(function (arrayItem) {
          console.log('arrayItem in passiveSentencesArray case');
          console.log('passiveSentencesArray ka if true hua.');
          tempFilteredSentenceArray.push({
            text: arrayItem['text'],
            voice_type: arrayItem['voice_type'],
          });
        });
        text = moduleName;
      }
    }
    else if (moduleName == "spellingGrammar") {
      console.log("this.grammarMistakesSentences.length");
      console.log(this.grammarMistakesSentences.length);

      if (this.grammarMistakesSentences.length) {
        console.log('this.grammarMistakesSentences');
        console.log(this.grammarMistakesSentences);

        this.grammarMistakesSentences
          .forEach(function (arrayItem) {
            tempFilteredSentenceArray.push({
              text: arrayItem['text'],
            });
          });
        text = moduleName;
      }
    }

    console.log('tempFilteredSentenceArray');
    console.log(tempFilteredSentenceArray);

    this.allData2 = tempFilteredSentenceArray;
    this.pullOutNegativeWords2(text);

    // The below code is for scroll towards the first highlighted sentence
    var $container = $('#editor');
    var $scrollHighlightedText = $('citispotter').first();

    if ($scrollHighlightedText.prevObject.length) {
      $container.animate(
        {
          scrollTop:
            $scrollHighlightedText.offset().top -
            $container.offset().top +
            $container.scrollTop(),
          scrollLeft: 0,
        },
        300
      );
    }
  }

  pullOutNegativeWords2(val) {
    console.log('called pullOutNegativeWords2');
    // console.log("this.allData2.length2");
    // console.log(this.allData2.length);
    console.log('val');
    console.log(val);

    // this.allData2 = [];
    // this.allData2.push({ text: "their are so many things you need To prepare for, and the best way." })

    // console.log("this.allData2.length3");
    // console.log(this.allData2.length);

    let editorHTML = $('#editor').html();

    // console.log("Before replacing Ampersand");
    // console.log(editorHTML);

    // Replacing the browser rendered &amp; to actual &
    editorHTML = editorHTML.replace(/&nbsp;/g, ' ');
    editorHTML = editorHTML.replace(/&amp;/g, '&');

    console.log("After replacing Ampersand");
    console.log(editorHTML);

    for (let i = 0; i < this.allData2.length; i++) {
      if (i == 1) break;

      editorHTML = this.highlightAndRenderNegativeWords2(i, editorHTML, val);

      $('#editor').html(editorHTML);
    }
  }

  highlightAndRenderNegativeWords2(i, editorHTML, val) {
    console.log(this.allData2);
    console.log('-------------------------' + i + '----------------');

    let data = this.allData2[i];
    let oldString = '';

    console.log("Text before removing \n");
    console.log(data.text);

    // The below code firstly replace all \n with actual space and then split it on the basis of that space
    data.text = data.text
      .replace(/\n/g, ' ')
      .split(' ')
      .filter((d) => d)
      .join(' ');

    let text = data.text;
    console.log("Text after removing \n");
    console.log(text);

    // The data is empty or null simply return
    if (!data) return null;

    // The below code is spliting the text into array so that we  can get the first and last word easily
    let textArray = text.split(' ');
    console.log(textArray);

    // data.startSentenceIndex =  i > 0 ? data[i].lastSentenceIndex : editorHTML.indexOf(textArray[0]);

    data.startSentenceIndexHistory = i > 0 ? this.allData2[i - 1].lastSentenceIndex : 0;

    if (i > 0) {
      oldString = editorHTML.substring(
        0,
        this.allData2[i - 1].lastSentenceIndex
      );
      editorHTML = this.replaceBetween(
        0,
        this.allData2[i - 1].lastSentenceIndex,
        '',
        editorHTML
      );
    }

    // Reset startSentenceIndex to zero every time
    data.startSentenceIndex = 0;

    // Creating the regex to find the starting index of sentence which should be highlighed
    let regexs = ``;

    for (let i = 0; i < textArray.length; i++) {

      // If text is empty or contains white-space only then we simply continue by not creating regex of it
      if (this.isBlank(textArray[i])) continue;

      // firstly replacing all metacharacters with escape
      let a = textArray[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();

      // then finally forming the regex after replacing all metacharacters
      regexs += `(${a})((?:\\s*(?:<\\/?\\w[^<>]*>)?\\s*)*)`;
    }

    console.log('Before regex');
    console.log(regexs);

    let regex = new RegExp(regexs, 'g');
    console.log('regex');
    console.log(regex);

    console.log('Before data.startSentenceIndex');
    console.log(data.startSentenceIndex);
    // console.log('editorHTML');
    // console.log(editorHTML);

    // After creating regex search in the HTML and get the starting index of that sentence which should be highlighted
    data.startSentenceIndex = editorHTML.search(regex);

    console.log('After data.startSentenceIndex');
    console.log(data.startSentenceIndex);

    // Just like starting index the below code is finding the last index of that sentence which should be highlighted
    var c = regex.exec(editorHTML);
    console.log('regex.lastIndex');
    console.log(regex.lastIndex);
    data.lastSentenceIndex = regex.lastIndex;

    // data.lastSentenceIndex = editorHTML.indexOf(textArray[textArray.length - 1], data.startSentenceIndex) + textArray[textArray.length - 1].length;

    console.log('data.startSentenceIndex');
    console.log(data.startSentenceIndex);

    console.log('data.lastSentenceIndex');
    console.log(data.lastSentenceIndex);

    // After finding start and last index of sentence,now simply chop the sentence from the HTML using both indexes
    let str = editorHTML.substring(
      data.startSentenceIndex,
      data.lastSentenceIndex
    );

    console.log('this.modulesHighlightingColorData[val]');
    console.log(this.modulesHighlightingColorData[val]);

    let hightlightColorInfoObj = this.modulesHighlightingColorData[val];


    // console.log('2132321323213213');
    // console.log(str);


    // Adding the highlighting styling to the text
    str = `<citispotter style="background:${hightlightColorInfoObj.textBgColor};
    border-bottom: 2px solid ${hightlightColorInfoObj.borderColor};">${str}</citispotter>`;


    // console.log('2112-------3213213123');
    // console.log(str);

    // After adding styling to the highlighted text now simply replace the normal text with styled text
    editorHTML = this.replaceBetween(
      data.startSentenceIndex,
      data.lastSentenceIndex,
      str,
      editorHTML
    );

    // console.log('dsadsadsadasdsadsad');
    // console.log(editorHTML);


    // The below code is ajust updating the last index of sentence
    data.lastSentenceIndex = i > 0 ? str.length + oldString.length : str.length;
    editorHTML = oldString + editorHTML;

    return editorHTML;
  }

  getTextEditorDataInHTMLFormat() {
    // const editorFullText = $('#editor').html();
    const editorFullText = document.getElementById('editor').innerHTML;
    console.log('getTextEditorDataInHTMLFormat called');
    // console.log(editorFullText);
    // console.log($('#editor').html());
    return {
      user_id: this.userService.userData.id,
      editorText: editorFullText,
      isDocumentEdited: this.isDocumentEdited,
    };
  }

  getTextEditorDataInTextFormat() {
    // const editorFullText = $('#editor').text();
    // console.log($('#editor').text());
    const editorFullText = document.getElementById('editor').innerText;
    console.log('getTextEditorDataInTextFormat called editorFullText');
    // console.log(editorFullText);
    // console.log(document.getElementById('editor').innerText);
    return {
      user_id: this.userService.userData.id,
      editorText: editorFullText,
    };
  }

  sideNavPresent() {
    let sideNav = document.getElementById('side-nav');
    sideNav.classList.toggle('present-sidenav');
  }

  showErrorSuggestionBox() {
    const allTitle = document.getElementsByClassName('suggestion_box_title');
    for (let i = 0; i < allTitle.length; i++) {
      allTitle[i].addEventListener('click', function (e) {
        for (let i = 0; i < allTitle.length; i++) {
          (allTitle[i] as HTMLDivElement).style.display = 'flex';
        }

        (allTitle[i] as HTMLDivElement).style.display = 'none';
        let growDiv = allTitle[i].nextElementSibling as HTMLDivElement;
        let suggDesc = document.getElementsByClassName(
          'suggestion_box_description'
        );

        for (let i = 0; i < suggDesc.length; i++) {
          (suggDesc[i] as HTMLDivElement).style.height = '0';
        }

        if (growDiv.clientHeight) {
          growDiv.style.height = '0';
        } else {
          var wrapper = document.querySelector('.measuringWrapper');
          // growDiv.style.height = wrapper.clientHeight + 'px';
          growDiv.style.height = '170px';
        }
      });
    }
  }

  format(command) {
    document.execCommand(command, false);
  }

  alignParagraph(align) {
    document.getElementById('editor').style.textAlign = align;
  }

  hideAssistentBox() {
    document
      .getElementById('hide_assistent_container')
      .addEventListener('click', () => {
        document
          .getElementById('navbar_hide_section')
          .classList.add('display_none');
        document
          .getElementById('navbar_animation_section')
          .classList.remove('display_none');
        document
          .querySelector('.editor_right_section')
          .classList.add('display_none');
        $('nav').css('grid-template-columns', '1.5fr 1fr');
        $('.text_editor_container').css('grid-template-columns', '1fr');
        $('.editor').css({ width: '60%', margin: '0 auto' });
      });

    document
      .querySelector('.correctAssistantBtn')
      .addEventListener('click', () => {
        document
          .getElementById('navbar_animation_section')
          .classList.add('display_none');
        document
          .getElementById('navbar_hide_section')
          .classList.remove('display_none');
        document
          .querySelector('.editor_right_section')
          .classList.remove('display_none');
        $('.text_editor_container').css('grid-template-columns', '1fr 1fr');
        $('.editor').css({ width: '100%' });
        $('nav').css('grid-template-columns', '1fr 1fr');
      });
  }

  replaceBetween(start, end, str, editorHTML) {
    // console.log('replaceBetween');
    // console.log('start = ' + start + ' end = ' + end);
    // console.log(editorHTML.substring(0, start));
    // console.log(editorHTML.substring(0, start) + str);
    // console.log(editorHTML.substring(end));
    return editorHTML.substring(0, start) + str + editorHTML.substring(end);
  }

  replaceAllHighlightedTag() {
    // console.log("replaceAllHighlightedTag called");
    let originalHTML = $('#editor').html();
    // console.log('originalHTML');
    // console.log(originalHTML);
    let strippedOpeningTag = originalHTML.replace(/<citispotter[^>]*>/g, '');
    // console.log('strippedOpeningTag');
    // console.log(strippedOpeningTag);
    let strippedClosingTag = strippedOpeningTag.replace(/<\/citispotter>/g, ' ');
    // console.log('strippedClosingTag');
    // console.log(strippedClosingTag);
    let finalHTML = strippedClosingTag;
    // let finalHTML = strippedClosingTag.replace(/\s+/g, ' ');
    // console.log('finalHTML');
    // console.log(finalHTML);
    $('#editor').html(finalHTML);
    // this.setCaretToEnd(document.getElementById('editor'));
  }

  clearEditor() {
    this.replaceAllHighlightedTag();
    const emotionBtns = document.getElementsByClassName('emotionBtn');
    for (let i = 0; i < emotionBtns.length; i++) {
      emotionBtns[i].classList.remove('active');
    }
  }

  setCaretToEnd(target /*: HTMLDivElement*/) {
    console.log("setCaretToEnd called");
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(target);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
    target.focus();
    range.detach(); // optimization

    // set scroll to the end if multiline
    target.scrollTop = target.scrollHeight;

    // console.log("target.scrollHeight");
    // console.log(target.scrollHeight);

    // console.log("setCaretToEnd this.temp");
    // console.log(this.temp);

    // target.scrollTop = this.temp;
  }

  copyDivToClipboard() {
    console.log('copyDivToClipboard called');

    var range = document.createRange();
    range.selectNode(document.getElementById('editor'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    // New UI Logic
    $('#copyTextBtn').addClass('borderGreen');
    $('.copyIcon').addClass('display_none');
    $('.copiedIcon').removeClass('display_none');

    setTimeout(function () {
      $('#copyTextBtn').removeClass('borderGreen');
      $('.copyIcon').removeClass('display_none');
      $('.copiedIcon').addClass('display_none');
    }, 2000);

    // Old UILogic
    // $('#copyTextBtn').toggleClass('display_none');
    // $('#copiedBtn').toggleClass('display_none').delay(500);
    // setTimeout(function () {
    //   $('#copyTextBtn').toggleClass('display_none');
    //   $('#copiedBtn').toggleClass('display_none');
    // }, 2000);
  }

  changedTextEditorState() {
    console.log("changedTextEditorState called");

    document.getElementById('editor')
      .addEventListener("keyup", (e) => {

        // console.log('input event fired.');
        let isEditorEmpty = document.getElementById('editor').innerHTML;

        // Reseting the Analysis if text editor is empty
        if (!isEditorEmpty) {
          console.log('andar jao');
          // this.showEmotionalData =
          //   this.showLanguageData =
          //   this.showActivePassiveData =
          //   this.showDictionaryWordData =
          //   this.showSpellingGrammarInfo =
          //   false;
          this.wordCount = this.sentenceCount = this.readTimeData = 0;
        }

        this.documentData = document.getElementById('editor').innerText;
        this.isDocumentEdited = true;
        if (!this.documentCreationLimitOver && !this.moduleFlagData.analyseButton) {
          this.analyseAutomatically(e);
        }
      });

    document.getElementById('editor')
      .addEventListener('paste', (e) => {
        console.log('paste event fired.');
        e.stopPropagation();
        e.preventDefault();
        document.execCommand(
          'insertHTML',
          false,
          e.clipboardData.getData('Text')
        );
        // document.getElementById('editor').innerText += e.clipboardData.getData('Text');
        this.documentData = document.getElementById('editor').innerText;
        // this.setCaretToEnd(document.getElementById('editor'));
        this.isDocumentEdited = true;
        if (!this.documentCreationLimitOver && !this.moduleFlagData.analyseButton) {
          this.analyseAutomatically(e);
        }
      });
  }

  analyseAutomatically(ev) {
    console.log('analyseAutomatically called');

    // clearTimeout(this.timeout);
    // this.timeout = setTimeout(() => {

    //   if ((ev.keyCode != 13) && (this.documentData.split(' ').length > 5)) {
    //     this.showAnalysis('n');
    //     this.setCursor(this.carretIndex);
    //   }
    // }, 1000);

    const editorBody = this.getTextEditorDataInTextFormat();

    // Checking whether user's active subscription has this module or not if yes then analyse word cound in every 2 seconds
    if (this.moduleFlagData.wordCount) {
      setTimeout(() => {
        console.log('pehle mai chaluga');
        this.showWordCount(editorBody);
        console.log('chala gya mai pehle');
      }, 2000);
    }

    // Checking whether user's active subscription has this module or not if yes then analyse readtime in every 2 seconds
    if (this.moduleFlagData.readingTime) {
      setTimeout(() => {
        this.showReadTimeData(editorBody);
      }, 2000);
    }

    // Checking whether user's active subscription has this module or not if yes then analyse characterCount in every 2 seconds
    if (this.moduleFlagData.characterCount) {
      setTimeout(() => {
        this.showCharacterCount(editorBody);
      }, 2000);
    }
  }

  setCursor(cursorPosition) {
    console.log("setCursor called");
    console.log("cursorPosition");
    console.log(cursorPosition);

    var tag = document.getElementById("editor");

    console.log("tag.childNodes");
    console.log(tag.childNodes);

    console.log("tag.childNodes.length");
    console.log(tag.childNodes.length);

    // return;

    // Creates range object
    var setpos = document.createRange();

    // Creates object for selection
    var set = window.getSelection();

    // Set start position of range
    // setpos.setStart((tag.childNodes[1] as HTMLElement).firstElementChild.firstElementChild.firstElementChild.firstElementChild.firstChild, 2);

    // set one counter variable to zero
    let counter = 0, counter2 = 0, node;

    // Run the loop till tag.childNodes.length
    for (let i = 0; i < tag.childNodes.length; i++) {

      console.log(`=======================${i}=======================`);

      node = tag.childNodes[i];
      console.log("node");
      console.log(node);

      if (node.nodeType === Node.TEXT_NODE) {

        console.log("It is a text node");

        console.log("node.textContent");
        console.log(node.textContent);

        console.log("node.textContent.length");
        console.log(node.textContent.length);

        counter2 = counter;
        counter += node.textContent.length;

      } else if (node.nodeType === Node.ELEMENT_NODE) {

        console.log("It is a element node");

        //   $.fn.deepest = function () {
        //     var $level = this.first();
        //     while (!!$level.children(":not(br)").length) {
        //       $level = $level.children();
        //     }
        //     return $level;
        //   };

        let elementNode = (node);
        let flag = false;

        if ((counter + node.textContent.length) >= cursorPosition) flag = true;
        else {
          counter2 = counter;
          counter += node.textContent.length;
        }

        console.log("counter");
        console.log(counter);

        console.log("counter2");
        console.log(counter2);

        console.log("flag");
        console.log(flag);

        while (flag) {

          console.log("Inside parent while loop");

          let nl = elementNode.childNodes;
          console.log("nl");
          console.log(nl);

          console.log("nl.length");
          console.log(nl.length);

          if (!nl.length) {
            flag = false;
            continue;
          }

          console.log("Process on");

          var childNodesArray = Array.prototype.slice.call(nl);

          console.log("childNodesArray");
          console.log(childNodesArray);

          let tempChildNodesArray = [...childNodesArray];

          childNodesArray.forEach(() => this.nodeStack.push(tempChildNodesArray.pop()));

          console.log("Final nodeStack");
          console.log(this.nodeStack);

          console.log("this.nodeStack.length");
          console.log(this.nodeStack.length);


          while (this.nodeStack.length) {
            console.log("Inside child while loop");
            console.log(this.nodeStack.length);

            let popedNode = this.nodeStack.pop();
            console.log("popedNode");
            console.log(popedNode);

            console.log("popedNode.textContent");
            console.log(popedNode.textContent);

            console.log("popedNode.textContent.length");
            console.log(popedNode.textContent.length);

            elementNode = popedNode;

            console.log("counter");
            console.log(counter);

            console.log("counter2");
            console.log(counter2);

            counter2 = counter;

            if (elementNode.childNodes.length == 1) {
              counter += popedNode.textContent.length;
            }

            if (counter >= cursorPosition) {
              console.log("Break kar do");
              break
            }
          }
        }
        node = elementNode;
      }

      // Store every childnode innert text length in counter variable in every iteration
      console.log("counter before");
      console.log(counter);

      console.log("counter2 before");
      console.log(counter2);

      // Now check whether cursorPosition is less than counter if yes
      // then it means this is the NODE where we want to set cursor in it
      if (counter >= cursorPosition) {
        console.log("i caught at = " + i);

        console.log("Final node");
        console.log(node);

        // Now substract counter value from cursorPosition
        cursorPosition -= counter2;

        console.log("Final cursorPosition");
        console.log(cursorPosition);

        // console.log("node.nodeName.includes");
        // console.log(node.nodeName.includes("CITISPOTTER"));

        // Check whether this NODE is a highlighted text node
        // if yes then wen need to substract 1 from cursorPosition
        // if (node.nodeName.includes("CITISPOTTER")) cursorPosition -= 1;

        // node = node.firstChild ? node.firstChild : node;

        // set the cursor finally and then break from the loop
        setpos.setStart(node, Math.abs(cursorPosition));
        // setpos.setStart(tag.childNodes[i], Math.abs(cursorPosition));
        break
      }
    }

    // Collapse range within its boundary points
    // Returns boolean
    setpos.collapse(true);

    // Remove all ranges set
    set.removeAllRanges();

    // Add range with respect to range object.
    set.addRange(setpos);

    // Set cursor on focus
    tag.focus();
  }

  downloadFile(ext) {
    console.log('called downloadFile');
    var blob = new Blob([this.documentData], {
      type: 'text/plain;charset=utf-8',
    });
    var url = URL.createObjectURL(blob),
      div = document.createElement('div'),
      anch = document.createElement('a');
    document.body.appendChild(div);
    div.appendChild(anch);
    anch.innerHTML = '&nbsp;';
    div.style.width = '0';
    div.style.height = '0';
    anch.href = url;
    anch.download = `file${ext}`;

    var ev = new MouseEvent('click', {});
    anch.dispatchEvent(ev);
    document.body.removeChild(div);
  }

  downloadDocxFile() {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: this.documentData,
                  font: 'Arial',
                  size: 24,
                }),
              ],
            }),
          ],
        },
      ],
    });
    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      saveAs(blob, 'file.docx');
    });
  }

  downloadPdfTextFile() {
    this.utilityService.downloadTextAsPdf(this.documentData);
  }

  captureScreen() {
    this.utilityService.downloadFileAsPdf('generateReportBody');
    // this.utilityService.downloadTextAsPdf('generateReportBody');
    // var data = document.getElementById('generateReportBody');
    // console.log('captureScreen called');
    // console.log(data);
    // html2canvas(data, { scale: 3 }).then((canvas) => {
    //   var imgWidth = 208;
    //   var pageHeight = 295;
    //   var imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   const contentDataURL = canvas.toDataURL('image/png');

    //   // Old Logic
    //   // let pdf = new jspdf('p', 'mm', 'a3'); // A4 size page of PDF
    //   // var position = 0;
    //   // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

    //   // New Logic
    //   let pdf;
    //   if (canvas.width > canvas.height) {
    //     pdf = new jspdf('l', 'mm', [canvas.width, canvas.height]);
    //   }
    //   else {
    //     pdf = new jspdf('p', 'mm', [canvas.height, canvas.width]);
    //   }
    //   var position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, canvas.width, canvas.height);

    //   pdf.save('download.pdf'); // Generated PDF
    // });
  }

  shareContentThroughEmail(data) {
    console.log('shareContentThroughEmail');
    console.log(data);
    if (data.email) {
      let shareContentData = {
        email: data.email,
        content: this.documentData,
      };

      console.log('shareContentData');
      console.log(shareContentData);

      $('.share_with_email_loader').toggleClass('display_none');
      $('#shareWithEmailBtn').toggleClass('pointer_events_none');

      this.panelService
        .shareUserContentThroughEmail(shareContentData)
        .subscribe(
          (data) => {
            console.log('shareUserContentThroughEmail api');
            console.log(data);

            $('.share_with_email_loader').toggleClass('display_none');
            $('#shareWithEmailBtn').toggleClass('pointer_events_none');
            $('#shareEmailModal').modal('hide');
            $('#shareEmail').val('');

            if (data == 'success') {
              Swal.fire({
                title: `<p class='swalText'>Success... 🤑</p>`,
                html: `<p class='swalText'>Your content has been shared.</p>`,
                icon: 'success',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' },
              });
            } else if (data.msg == 'validation error') {
              Swal.fire({
                title: `<p class='swalText'>Oops... 😦</p>`,
                html: `<p class='swalText'>${data.err}.</p>`,
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' },
              });
            } else if (data.msg == 'error') {
              Swal.fire({
                title: `<p class='swalText'>Process failed...</p>`,
                html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' },
              });
            }
          },
          (error) => {
            $('.share_with_email_loader').toggleClass('display_none');
            $('#shareWithEmailBtn').toggleClass('pointer_events_none');
            $('#shareEmailModal').modal('hide');
            $('#shareEmail').val('');
            console.log('help api error');
            console.log(error);
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        );
    } else {
      $('#shareEmailModal').modal('hide');
      Swal.fire({
        title: `<p class='swalText'>Invalid... 🚫</p>`,
        html: `<p class='swalText'>Email field couldn't be empty.</p>`,
        icon: 'warning',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
    }
  }

  sendFeedbackToAdmin() {
    console.log('sendFeedbackToAdmin called');
    // console.log(this.myFeedbackForm);
    let data = this.myFeedbackForm.value;
    console.log(data);
    // return;
    if (data.feedback) {
      $('.send_feedback_loader').toggleClass('display_none');
      $('#sendFeedbackBtn').toggleClass('pointer_events_none');

      this.panelService.sendFeedback(data).subscribe(
        (data) => {
          console.log('sendFeedback api');
          console.log(data);

          $('.send_feedback_loader').toggleClass('display_none');
          $('#sendFeedbackBtn').toggleClass('pointer_events_none');
          $('#sendFeedbackModal').modal('hide');
          // $('#sendFeedback').val('');

          this.myFeedbackForm.reset();
          this.images = [];

          if (data == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success... 🤑</p>`,
              html: `<p class='swalText'>Your feedback has been recieved.Thank You.</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (data.msg == 'validation error') {
            Swal.fire({
              title: `<p class='swalText'>Oops... 😦</p>`,
              html: `<p class='swalText'>${data.err}.</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (data.msg == 'error') {
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        },
        (error) => {
          console.log('help api error');
          console.log(error);
          $('.send_feedback_loader').toggleClass('display_none');
          $('#sendFeedbackBtn').toggleClass('pointer_events_none');
          $('#sendFeedbackModal').modal('hide');
          // $('#sendFeedback').val('');
          this.myFeedbackForm.reset();
          this.images = [];
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
    } else {
      $('#sendFeedbackModal').modal('hide');
      Swal.fire({
        title: `<p class='swalText'>Invalid... 🚫</p>`,
        html: `<p class='swalText'>Empty feedback couldn't be submit.</p>`,
        icon: 'warning',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
    }
  }

  sendQueryToAdmin() {
    console.log('text editor sendQueryToAdmin called');
    console.log(this.myQueryForm);
    let data = this.myQueryForm.value;
    // console.log(data);
    // return;
    if (data && data.query) {
      console.log('Aandar aa gaya');
      $('.help_loader').toggleClass('display_none');
      $('#helpBtn').toggleClass('pointer_events_none');
      this.panelService.sendQuery(data).subscribe(
        (result) => {
          console.log('sendQuery api');
          console.log(result);

          $('.help_loader').toggleClass('display_none');
          $('#helpBtn').toggleClass('pointer_events_none');
          $('#sendQueryModal').modal('hide');
          // $('#sendQuery').val('');

          this.myQueryForm.reset();
          this.images = [];

          // data.query = '';
          // $('#query').val('');
          if (result == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success... 🤑</p>`,
              html: `<p class='swalText'>You query has been received we will get in touch soon.</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (result.msg == 'validation error') {
            Swal.fire({
              title: `<p class='swalText'>Oops... 😦</p>`,
              html: `<p class='swalText'>${data.err}.</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          } else if (result.msg == 'error') {
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        },
        (err) => {
          console.log('help api error');
          console.log(err);
          $('.help_loader').toggleClass('display_none');
          $('#helpBtn').toggleClass('pointer_events_none');
          $('#sendQueryModal').modal('hide');
          // $('#sendQuery').val('');
          this.myQueryForm.reset();
          this.images = [];
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
    } else {
      $('#sendQueryModal').modal('hide');
      Swal.fire({
        title: `<p class='swalText'>Invalid... 🚫</p>`,
        html: `<p class='swalText'>Empty query couldn't be submit.</p>`,
        icon: 'warning',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' },
      });
    }
  }

  onQueryAttachmentFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.images.push(event.target.result);

          this.myQueryForm.patchValue({
            fileSource: this.images,
          });
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  onFeedbackAttachmentFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.images.push(event.target.result);

          this.myFeedbackForm.patchValue({
            fileSource: this.images,
          });
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  saveDoc() {
    console.log('saveDocument');

    $('.saveDocLoader').removeClass('display_none');

    let editorBody = this.getTextEditorDataInHTMLFormat();
    console.log('this.documentId');
    console.log(this.documentId);

    let action =
      this.documentId && this.documentId != 'new' ? 'update' : 'insert';
    let sendDocumentId = null;
    if (action == 'update') {
      console.log('action update');
      sendDocumentId = this.documentId;
      console.log('sendDocumentId');
      console.log(sendDocumentId);
    }

    // $('.save_loader').toggleClass('display_none');
    this.panelService.saveDocument(editorBody, sendDocumentId).subscribe(
      (data) => {
        console.log('save my Document');
        console.log(data);

        $('.saveDocLoader').addClass('display_none');

        // $('.save_document_text').toggleClass('display_none');
        // $('.saved_document_text').toggleClass('display_none');
        setTimeout(() => {
          this.redirectTo('text-editor/new');
        }, 1000);
      },
      (error) => {
        console.log('saveDoc api error');
        console.log(error);

        $('.saveDocLoader').addClass('display_none');

        // Showing alert if API responded with any error
        Swal.fire({
          title: `<p class='swalText'>Process failed...</p>`,
          html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
          icon: 'error',
          buttonsStyling: false,
          customClass: { confirmButton: 'btn swal_button_style' },
        });
      }
    );
  }

  redirectTo(uri: string) {
    this.routes
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.routes.navigate([uri]));
  }

  clearEditorText() {
    document.getElementById('editor').innerHTML = '';
    this.documentData = '';
    // this.showEmotionalData =
    //   this.showLanguageData =
    //   this.showActivePassiveData =
    //   this.showDictionaryWordData =
    //   this.showSpellingGrammarInfo =
    //   false;
  }

  showNotificationPopUp() {
    const notifyWrapper = document.querySelector(
      '.notification_popup_wrapper'
    ) as HTMLDivElement;
    notifyWrapper.style.opacity = '1';
    notifyWrapper.style.visibility = 'visible';

    console.log('readAllNotifications called');
    this.panelService.readAllNotifications().subscribe(
      (data) => {
        console.log('readAllNotifications api response');
        console.log(data);
      },
      (error) => {
        console.log('readAllNotifications api error');
        console.log(error);
      }
    );

    // Closing notification popup
    $('.close_notification').click(() => {
      notifyWrapper.style.opacity = '0';
      notifyWrapper.style.visibility = 'hidden';
      this.utilityService.unreadNotificationsCount = 0;
      this.utilityService.allUnreadNotificationsData = [];
    });
  }

  checkAllowedWordLimitToTextEditor() {
    console.log('checkAllowedWordLimitToTextEditor called');
    this.panelService.getAllowedWordLimitToTextEditorData().subscribe(
      (data) => {
        console.log('getAllowedWordLimitToTextEditorData api response');
        console.log(data);
        this.allowedWordLimitToEditor = data ? data : 0;
      },
      (error) => {
        console.log('getAllowedWordLimitToTextEditorData api error');
        console.log(error);
      }
    );
  }

  validatedTextEditorLength() {
    // If allowedWordLimitToEditor value is zero or null then it means it is unlimited no need to proceed
    if (!this.allowedWordLimitToEditor) {
      return;
    }

    let counter = document.querySelector(
      '.text_editor_counter'
    ) as HTMLSpanElement;
    let maxLength = this.allowedWordLimitToEditor;
    let currentlength = this.wordCount;

    console.log('currentlength');
    console.log(currentlength);

    if (currentlength <= 0) {
      counter.style.display = 'none';
      $('.analyseButton').addClass('pointer_events_none');
    } else {
      counter.style.display = 'block';
      $('.analyseButton').removeClass('pointer_events_none');
    }

    counter.innerText = (maxLength - currentlength).toString();

    console.log('counter.innerText');
    console.log(counter.innerText);

    if (currentlength > maxLength) {
      // let overText = element.innerText.substr(maxLength); //extracting over texts
      $('.text_editor_counter').removeClass('editor_word_limit_green');
      $('.text_editor_counter').addClass('editor_word_limit_red');
      $('.analyseButton').addClass('pointer_events_none');
    } else {
      $('.text_editor_counter').removeClass('editor_word_limit_red');
      $('.text_editor_counter').addClass('editor_word_limit_green');
      $('.analyseButton').removeClass('pointer_events_none');
    }
  }

  getDictionaryWordsByModule() {
    console.log('getDictionaryWordsByModule called');

    const activeModulename = this.activeAIAnalysisModuleObject.modulename;
    console.log("getDictionaryWordsByModule activeModulename");
    console.log(activeModulename);

    if (!this.adminDictionarWordsModule.includes(activeModulename)) {
      console.log("Module nahi mila");
      return;
    }

    console.log("getDictionaryWordsByModule this.activeAIAnalysisModuleObject");
    console.log(this.activeAIAnalysisModuleObject);

    this.loaderService.showLoading(this.activeAIAnalysisModuleObject.mainLoaderClass);
    $('.common_tick').removeClass('display_none');
    $('.common_word_count').addClass('display_none');
    $(`.${this.activeAIAnalysisModuleObject.tickClass}`).addClass('display_none');
    $(`.${this.activeAIAnalysisModuleObject.countLoaderClass}`).removeClass('display_none');
    $(`.${this.activeAIAnalysisModuleObject.wordCountLoaderClass}`).addClass('display_none');

    let module_id = this.moduleInfoData.filter(o => o.flag == activeModulename).map(item => item.id)[0];
    console.log("getDictionaryWordsByModule module_id");
    console.log(module_id);

    // Creating an API request object & assign null to module_id because to
    // fetch all dictionary words but not by module
    let data = { user_id: this.userService.userData.id, document_id: this.documentId, module_id: module_id };

    // Calling the getDictionaryWordsByModule API to get user's dictionary word
    this.panelService
      .getDictionaryWordsByModuleWise(data)
      .subscribe(
        (data) => {
          console.log('getDictionaryWordsByModule api response');
          console.log(data);

          // Hiding the loaders
          this.loaderService.hideLoading(this.activeAIAnalysisModuleObject.mainLoaderClass);
          $(`.${this.activeAIAnalysisModuleObject.countLoaderClass}`).addClass('display_none');
          $(`.${this.activeAIAnalysisModuleObject.wordCountLoaderClass}`).removeClass('display_none');

          // If success assign api response data to local object
          if (data.msg == 'success') {
            this.allDictionaryWordsData = this.dictionaryWordFoundArray = [];
            this.allDictionaryWordsData = data.data;

            console.log('Before filtering this.allDictionaryWordsData');
            console.log(this.allDictionaryWordsData);
            this.findDictionaryWordInEditor();
          }
        },
        (error) => {
          console.log('getDictionaryWordsByModule api error');
          console.log(error);

          // Hiding loader from table after recieving API response
          this.loaderService.hideLoading(this.activeAIAnalysisModuleObject.mainLoaderClass);
          // $(`.${this.activeAIAnalysisModuleObject.tickClass}`).addClass('display_none');
          $(`.${this.activeAIAnalysisModuleObject.countLoaderClass}`).addClass('display_none');
          $(`.${this.activeAIAnalysisModuleObject.wordCountLoaderClass}`).removeClass('display_none');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' },
          });
        }
      );
  }

  findDictionaryWordInEditor() {
    // console.log('findDictionaryWordInEditor called');
    let editorHTML = $('#editor').html();
    console.log(editorHTML);

    if (!this.allDictionaryWordsData.length) {
      console.log('allDictionaryWordsData zero');
      // this.showDictionaryWordData = false;
    } else if (this.allDictionaryWordsData.length && editorHTML) {
      console.log('AllDictionaryData editorHTML');

      // The below code is creating a new array of only those dictionary
      // words which found in the user's document text using regex
      this.dictionaryWordFoundArray = this.allDictionaryWordsData
        .filter((item) => {
          let searchWord = item.word;
          console.log('searchWord');
          console.log(searchWord);
          let regEx = new RegExp(
            '(\\b' + searchWord + '\\b)(?!([^<]+)?>)',
            'gi'
          );
          console.log('editorHTML.match(regEx)');
          console.log(editorHTML.match(regEx));
          if (editorHTML.match(regEx)) {
            console.log('mil gaya');
            return item;
          }
        })
        .map((o) => o);

      console.log('After filtering this.dictionaryWordFoundArray');
      console.log(this.dictionaryWordFoundArray);

      if (this.dictionaryWordFoundArray.length) {
        console.log('ek bhi word nahi mila');
        // this.showDictionaryWordData = true;

        // After fetching user custom dictionary words call pullOutDictionaryWords
        // method to highlight the dictionary words one by one
        this.pullOutDictionaryWords();
      }
    }
  }

  pullOutDictionaryWords() {
    console.log('called pullOutDictionaryWords');
    console.log('Before Loop');
    console.log('Dictionary Word Avaialble');
    console.log(this.dictionaryWordFoundArray);

    // Firslty extract all html text from text editor
    let editorHTML = $('#editor').html();

    // Setting the loop on fetched user's dictionary words to highlight one by one
    for (let i = 0; i < this.dictionaryWordFoundArray.length; i++) {
      // Call the highlight function and pass loop i value and extracted html text
      editorHTML = this.highlightAndRenderDictionaryWords(i, editorHTML);

      // assign new returned html from "highlightAndRenderDictionaryWords" function after highlighting dictionary word
      $('#editor').html(editorHTML);
    }
    console.log("pullOutDictionaryWords this.carretIndex");
    console.log(this.carretIndex);

    // this.setCursor(this.carretIndex);

    // After completion of loop on dictionary words set event handler on all the highlighted dictionary word
    this.setEventToOpenSuggestionCard('dictionary_module', 'suggestion_word_wrapper');
  }

  highlightAndRenderDictionaryWords(i, editorHTML) {
    console.log('highlightAndRenderDictionaryWords called');
    console.log('-------------------------' + i + '-------------------------');


    // Extract one by one dictionary word object
    let data = this.dictionaryWordFoundArray[i];

    // If data is empty or null simply return no need to proceed
    if (!data) {
      return;
    }

    // Extract word from dictionary object
    let searchWord = data.word;

    //Form a regex with extracted word from dictionary object to find in the text editor
    var regEx = new RegExp('(\\b' + searchWord + '\\b)(?!([^<]+)?>)', 'gi');

    // Create a custom tag which needs to be replaced with searched dictionary word
    // add required data  attributes and inline css styling
    const tag = `<citispotter-word class="dictionary_module module-${data.module_id}"
    style="background:#d5fcff !important;border-bottom: 2px solid #1ac7d3;cursor:pointer"
    data-wordid=${data.id}>${searchWord}</citispotter-word>`;

    // Find dictionary word in text editor if found then replace it with custom created tag
    editorHTML = editorHTML.replace(regEx, tag);

    // After replacing dictionary word with custom created tag simply return new HTML
    return editorHTML;
  }

  replaceWithDictionarySuggestedWord(action, e, item = null) {
    console.log('replaceWithDictionarySuggestedWord called');
    console.log('action');
    console.log(action);

    console.log('item');
    console.log(item);

    let dictionaryHTML;
    // suggestedWord ;

    let replaceWord = e.target.innerText;
    console.log('replaceWord');
    console.log(replaceWord);

    if (action == 'replaceHovered') {
      // Extract the clicked html element innerHTML value
      // suggestedWord = document.querySelector('.suggestion_word_text').innerHTML;

      // Get the highlighted dictionary word html elemet object which has data-info="hovered" attribute
      dictionaryHTML = document.querySelector('[data-info="hovered"]');
    } else {

      const activeModulename = this.activeAIAnalysisModuleObject.modulename;
      console.log("ReplaceWithDictionarySuggestedWord activeModulename");
      console.log(activeModulename);

      if (this.adminDictionarWordsModule.includes(this.activeAIAnalysisModuleObject.modulename)) {
        dictionaryHTML = $(`*[data-wordid=${item.id}]`);
      }
      else if (activeModulename == 'spellingGrammar') {
        dictionaryHTML = $(`citispotter:contains(${item})`);
      };
    }

    console.log("dictionaryHTML");
    console.log(dictionaryHTML);

    // Replace highlighted dictionary word html element object  with clicked html element innerHTML value
    $(dictionaryHTML).replaceWith(replaceWord);
    $('.suggestion_word_wrapper,.spellingGrammar_suggestion_word_wrapper').css({ display: 'none' });
    this.documentData = document.getElementById('editor').innerText;
    // return;
    this.showAnalysis('n');
  }

  highlightSpellingGrammarWords() {
    console.log('called highlightSpellingGrammarWords');
    // console.log("this.spellingGrammarIncorrectWords");
    // console.log(this.spellingGrammarIncorrectWords);

    // Firslty extract all html text from text editor
    let editorHTML = $('#editor').html();

    // Setting the loop on fetched user's dictionary words to highlight one by one
    // this.spellingGrammarIncorrectWords.length
    for (let i = 0; i < this.spellingMistakesSentences.length; i++) {

      // Extract one by one dictionary word object

      // let data = this.spellingGrammarIncorrectWords[i];
      let data = this.spellingMistakesSentences[i];

      // let searchWord = data.word;
      let searchWord = data.original_word;
      console.log("searchWord");
      console.log(searchWord);

      // If data is empty or null simply return no need to proceed
      if (!searchWord) continue;

      //Form a regex with extracted word from dictionary object to find in the text editor
      var regEx = new RegExp('(\\b' + searchWord + '\\b)(?!([^<]+)?>)', 'gi');


      // Create a custom tag which needs to be replaced with searched dictionary word
      // add required data  attributes and inline css styling
      const tag = `<citispotter class="spellingGrammar_module" data-wordid=${data.wordid}
                      style="background: #ffe5fb !important;border-bottom: 2px solid #ee46d3;cursor:pointer">
                      ${searchWord}
                   </citispotter>`;

      // Find dictionary word in text editor if found then replace it with custom created tag
      editorHTML = editorHTML.replace(regEx, tag);

      // assign new returned html from "highlightAndRenderDictionaryWords" function after highlighting dictionary word
      $('#editor').html(editorHTML);
    }

    this.setEventToOpenSuggestionCard('spellingGrammar_module', 'spellingGrammar_suggestion_word_wrapper');
  }

  setEventToOpenSuggestionCard(tagClass, cardClass) {
    $(`.${tagClass}`).on({
      // If mouse entered on the highlighted dictionary word do the following things
      mouseenter: (e) => {
        console.log(`${tagClass}mouseenter event fired`);
        console.log(e.target);

        // Reset by removing data-info and clicked attribute present anywhere in
        // the html and hide element who has class "suggestion_word_wrapper"
        $(`.${cardClass}`).css({ display: 'none' });
        $('[data-info="hovered"]').removeAttr('clicked');
        $('[data-info="hovered"]').removeAttr('data-info');

        // Set data attribute on hovered highlighted dictionary word
        $(e.target).attr('data-info', 'hovered');

        let suggestedWord = e.target.innerText;

        console.log('spellingGrammar_module suggestedWord');
        console.log(suggestedWord);

        let wordId = $(e.target).data('wordid');
        console.log('wordId');
        console.log(wordId);

        console.log('this.activeAIAnalysisModuleObject');
        console.log(this.activeAIAnalysisModuleObject);

        if (this.activeAIAnalysisModuleObject.modulename == "spellingGrammar") {
          console.log("Active module spellingGrammar hain");

          // this.hoveredDictionaryWordObject = this.allSpellingGrammarData
          //   .filter((item) => item.wordid == wordId)
          //   .map((o) => o)[0];

          this.hoveredDictionaryWordObject = this.spellingMistakesSentences
            .filter((item) => item.wordid == wordId)
            .map((o) => o)[0];

        } else {
          console.log("Active module spellingGrammar nahi hain");

          this.hoveredDictionaryWordObject = this.dictionaryWordFoundArray
            .filter((item) => item.id == wordId)
            .map((o) => o)[0];
        }

        console.log('this.hoveredDictionaryWordObject');
        console.log(this.hoveredDictionaryWordObject);

        // Get text editor scrolled height
        let scrolled = $('#editor').scrollTop();
        console.log('enter scrolled');
        console.log(scrolled);

        // Calculate top and left offset value to place suggestion-word
        // popup the below the hovered highlighted dictionary word
        let x, y;

        x = e.target.offsetLeft - 248 + 'px';
        y = e.target.offsetTop + 21 - scrolled;

        console.log('Top:' + y + ' Left:' + x);
        // y = scrolled == 0 && y > 380 ? y - 170 + 'px' : y + 'px';
        y = y > 380 ? y - 170 + 'px' : y + 'px';
        console.log('Top:' + y + ' Left:' + x);

        // Place the suggestion-word popup according to the calculated value of top and left offset
        $(`.${cardClass}`).css({
          transform: 'translate(' + x + ', ' + y + ')',
          display: 'block',
        });
      },

      // If mouse entered on the highlighted dictionary word do the following things
      mouseleave: function (e) {
        console.log('mouseleave event fired');

        // Check whether custom "clicked" attribute added while user
        // click on hovered highlighted dictionary word
        if ($(this).attr('clicked') != 'yes') {
          console.log(`${tagClass} mouse leave clicked no`);
          // Reset by removing data-info present anywhere in the html
          //  and hide element who has class "suggestion_word_wrapper"
          $(`.${cardClass}`).css({ display: 'none' });
          $(e.target).removeAttr('data-info');
        }
      },

      click: function (e) {
        console.log('spellingGrammar_module click event fired');
        console.log(e.target);

        // Add data-info attribute to the cliked highlighted dictionary word
        $(e.target).attr('data-info', 'hovered');

        console.log(e.target);
        // Get text editor scrolled height
        let scrolled = $('#editor').scrollTop();
        console.log('click scrolled');
        console.log(scrolled);

        // Calculate top and left offset value to place suggestion-word
        // popup the below the hovered highlighted dictionary word
        let x, y;

        x = e.target.offsetLeft - 248 + 'px';
        y = e.target.offsetTop + 21 - scrolled;

        console.log('Top:' + y + ' Left:' + x);
        // y = scrolled == 0 && y > 380 ? y - 170 + 'px' : y + 'px';
        y = y > 380 ? y - 170 + 'px' : y + 'px';
        console.log('Top:' + y + ' Left:' + x);

        // set custom attribute for marking this one as clicked
        $(this).attr('clicked', 'yes');

        // Place the suggestion-word popup according to the calculated value of top and left offset
        $(`.${cardClass}`).css({
          transform: 'translate(' + x + ', ' + y + ')',
          display: 'block',
        });
      },
    });
  }

  setEventHandlers() {
    // Setting scroll event on text editor
    $('#editor').scroll(() => {
      // console.log('scroll event fired');
      $('.suggestion_word_wrapper,.spellingGrammar_suggestion_word_wrapper').css('display', 'none');
    });

    // Setting click event on body
    $('body').on('click', (e) => {
      // console.log('body clicked');
      // console.log(e.target);

      // Checking if clicked element has dictionary_module class or not if not then
      // remove data-info and clicked attribute present anywhere in the html and hide
      // element who has class "suggestion_word_wrapper"
      if (!$(e.target).hasClass('dictionary_module') && !$(e.target).hasClass('spellingGrammar_module')) {
        $('.suggestion_word_wrapper').css({ display: 'none' });
        $('.spellingGrammar_suggestion_word_wrapper').css({ display: 'none' });
        $('[data-info="hovered"]').removeAttr('clicked');
        $('[data-info="hovered"]').removeAttr('data-info');
      }
    });
  }

  toggleSidenav() {
    console.log('toggleSidenav called');
    $('.sidenavInnerSection').toggleClass('display_none');
    $('.editorLeftContainer').toggleClass('closeSidenav');
  }

  menuToggle() {
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
  }

  openSuggestionCard(item, val) {
    console.log('openCardBody');
    console.log(val);
    console.log(item);

    // The below code is for scroll towards the first highlighted sentence
    var $container = $('#editor');
    let activeModule = this.activeAIAnalysisModuleObject.moduleHeadText;
    var $scrollHighlightedText = null;

    console.log("activeModule");
    console.log(activeModule);

    console.log("item.text");
    console.log(item.text);

    if (activeModule == 'Style') {
      $scrollHighlightedText = $(`citispotter-word:contains(${item.word})`).first();
    } else {
      $scrollHighlightedText = $(`citispotter:contains(${item.text})`).first();
    }

    console.log("$scrollHighlightedText");
    console.log($scrollHighlightedText);

    if ($scrollHighlightedText && $scrollHighlightedText.prevObject.length) {
      console.log("scrollHighlightedText if");
      $container.animate(
        {
          scrollTop:
            $scrollHighlightedText.offset().top -
            $container.offset().top +
            $container.scrollTop(),
          scrollLeft: 0,
        },
        300
      );
    }

    // Firstly reset all the class added dynamically to various html elements
    $('.box')
      .not($(`.card${val}`))
      .addClass('cardHeight');
    $('.cardHeader :nth-child(2)')
      .not($(`.card${val} > .cardInnerWrapper > .cardHeader :nth-child(2)`))
      .removeClass('display_none');
    $('.cardHeader :nth-child(3)')
      .not($(`.card${val} > .cardInnerWrapper > .cardHeader :nth-child(3)`))
      .addClass('display_none');
    $('.cardBody')
      .not($(`.card${val} > .cardInnerWrapper > .cardBody`))
      .addClass('display_none');

    // Open click suggestion card by adding classes
    $(`.card${val}`).removeClass('cardHeight');
    $(`.card${val} > .cardInnerWrapper > .cardHeader :nth-child(2)`).addClass(
      'display_none'
    );
    $(
      `.card${val} > .cardInnerWrapper > .cardHeader :nth-child(3)`
    ).removeClass('display_none');
    $(`.card${val} > .cardInnerWrapper > .cardBody`).removeClass(
      'display_none'
    );
  }

  openDocSettingList() {
    const toggleMenu = document.querySelector('.docMenu');
    toggleMenu.classList.toggle('active');

    const elem = document.querySelector('#docEllipsis') as HTMLDivElement;
    let x = elem.offsetLeft + 'px';
    let y = elem.offsetTop + 18 + 'px';
    console.log('docEllipsis Top:' + y + ' docEllipsis Left:' + x);

    $('.docMenuDropdown').css({
      transform: 'translate(' + x + ', ' + y + ')',
      display: 'block',
    });
  }

  loadAnalysisData(modulename) {
    console.log('loadAnalysisData called');
    console.log(modulename);

    this.replaceAllHighlightedTag();
    this.activeAIAnalysisModuleObject = this.allAIAnalysisModulesObject[modulename];

    // Whenever user clicked on any analysis module firstly remove active class from previous
    // clicked tab and add active class to current clicked analysis module tab
    $('.analysis').removeClass('active');
    $(`[data-modulename=${modulename}]`).addClass('active');

    console.log("Hello Jiii");

    const activeModuleName = modulename;

    // Firstly hide all cardOuterWrapper class named elemenets
    $('.cardOuterWrapper').addClass('display_none');

    // Check is any element present by the class of extracted value as modulename if yes
    // unhide that HTML element or else unhide the notFoundWrapper class named HTML element
    if ($(`.${activeModuleName}`).length) {
      console.log('if mai hun bc.');
      $(`.${activeModuleName}`).removeClass('display_none');
    } else {
      console.log('else mai hun bc.');
      $('.notFoundWrapper').removeClass('display_none');
    }

    if (activeModuleName == "spellingGrammar") {
      console.log("loadAnalysisData spellingGrammar if");
      // The below function called to highlight grammar mistakes sentences
      // this.highlightSelectedSentence();

      // The below function called to highlight spelling mistakes words
      this.highlightSpellingGrammarWords();
    }
    else if (activeModuleName == "clarity") {
      console.log("loadAnalysisData first else if");
      this.highlightSelectedSentence();
    }
    else if (this.adminDictionarWordsModule.includes(activeModuleName)) {
      console.log("loadAnalysisData second else if");
      this.getDictionaryWordsByModule();
    }
  }

  deleteDocument(event) {
    console.log('deleteDocument called');
    console.log(this.documentId);
    event.stopPropagation();

    // Before calling deleteDocument api show "Are you sure?" confirmation window
    Swal.fire({
      title: 'Are you sure?',
      showDenyButton: true,
      denyButtonText: 'Cancel',
    }).then((result) => {
      // If user confirmed simply call the deleteDocument API
      if (result.isConfirmed) {
        // Calling the deleteDocument api to delete word from user's dictionary
        this.panelService.deleteDocument(this.documentId).subscribe(
          (data) => {
            console.log('deleteDocument api response');
            console.log(data);

            // Checking api response if success simply show success alert,then fetch dictionary words once again
            if (data.msg == 'success') {
              this.redirectTo('text-editor/new');
            } else {
              Swal.fire({
                title: `<p class='swalText'>Deletion failed...</p>`,
                html: `<p class='swalText'>Please try later.</p>`,
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' },
              });
            }
          },
          (error) => {
            console.log('deleteDocument api error');
            console.log(error);

            // Showing alert if API responded with any error
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' },
            });
          }
        );
      }
    });
  }

  async selectDocumentDownloadFormat(event) {
    console.log('selectDocumentDownloadFormat called.!');
    event.stopPropagation();

    await Swal.fire({
      title: 'Select the format',
      input: 'select',
      inputOptions: {
        txt: 'TXT',
        docx: 'DOCX',
        pdf: 'PDF',
      },
      confirmButtonText: 'Download',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          console.log('value');
          console.log(value);
          if (value && value == 'txt') {
            this.downloadFile('txt');
          } else if (value && value == 'docx') {
            this.downloadDocxFile();
          } else if (value && value == 'pdf') {
            this.downloadPdfTextFile();
          }
          Swal.close();
        });
      },
    });
  }

  openDocumentById(document_id) {
    console.log('openDocumentById called');
    this.redirectTo(`/text-editor/${document_id}`);
  }

  logoutUser() {
    console.log('logoutUser called.');

    //Removing user's fcm token
    this.panelService.deleteUserFcmToken().subscribe(
      (data) => {
        console.log('User token deleted successfully.', data);
      },
      (error) => {
        console.log('deleteUserFcmToken api error', error);
      }
    );

    //User logout_time  storing in the database
    let userActivity = {
      user_id: this.userService.userData.id,
      login_time: this.userService.userData.login_time,
      logout_time: moment().format(this.utilityService.dbDateTimeFormat),
      visited_page: '/login',
      visited_page_time: moment().format(this.utilityService.dbDateTimeFormat),
    };

    this.panelService
      .setUserActivityData(userActivity)
      .subscribe((data) => console.log('User logout successfully.', data));

    //stop the timeout interval which has been used to store the record of user page spend time
    this.userService.stopUpdatingUserPageSpendTime();

    // Finally logging out the user
    this.userService.logout();
  }

  ignoreWordFromUserCustomDictionary(item) {
    console.log('ignoreWordFromUserCustomDictionary called');
    console.log(item);

    // return;
    if (!item) return;

    // Before calling deleteWordFromDictionary api show "Are you sure?" confirmation window
    Swal.fire({
      title: `<p class='swalText'>Are you sure you want to ignore this word for this document</p>`,
      showDenyButton: true,
      denyButtonText: 'Cancel',
      buttonsStyling: false,
      icon: 'question',
      customClass: {
        confirmButton: 'btn swal_button_style margin_right_10',
        denyButton: 'btn btn-primary',
      },
    }).then((result) => {
      // If user confirmed simply call the deleteWordFromDictionary API
      if (result.isConfirmed) {
        // Set word id which wants to delete and send it to the API as a requested object
        let data = { word_id: item.id, user_id: this.userService.userData.id, document_id: this.documentId };

        // Calling the ignoreUserCustomDicitonaryWord api to ignore word from user's dictionary
        this.panelService
          .ignoreUserCustomDicitonaryWord(data)
          .subscribe(
            (data) => {
              // Checking api response if success simply show success alert,then fetch dictionary words once again
              if (data == 'success') {
                $('.suggestion_word_wrapper,.spellingGrammar_suggestion_word_wrapper').css({ display: 'none' });
                this.replaceAllHighlightedTag();
                this.getDictionaryWordsByModule();
              } else {
                Swal.fire({
                  title: `<p class='swalText'>Process failed...</p>`,
                  html: `<p class='swalText'>Please try later</p>`,
                  icon: 'error',
                  buttonsStyling: false,
                  customClass: { confirmButton: 'btn swal_button_style' },
                });
              }
            },
            (error) => {
              console.log('ignoreUserCustomDicitonaryWord api error');
              console.log(error);

              // Showing alert if API responded with any error
              Swal.fire({
                title: `<p class='swalText'>Process failed...</p>`,
                html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' },
              });
            }
          );
      }
    });
  }

  uploadFile(fileList: FileList): void {
    let file = fileList[0];
    console.log(file);

    const fileExtension = file.name.split('.').pop();
    console.log("fileExtension");
    console.log(fileExtension);

    let fileReader: FileReader = new FileReader();
    fileReader.onload = (x) => {

      // Checking whether file is docx or text if file is docx then we need to do unzip the file
      if (fileExtension == "docx") {
        var rawLog: any = fileReader.result;
        var zip = new PizZip(rawLog);
        var doc = new Docxtemplater().loadZip(zip);

        const pre = document.createElement("pre");
        const node = doc.getFullText();
        pre.innerText = node;
        $('#editor').html(pre);

        this.documentData = `${doc.getFullText()}`;
      } else {
        // this.documentData = fileReader.result;

        console.log("fileReader.result");
        console.log(fileReader.result);
        const pre = document.createElement("pre");
        const node = fileReader.result as string;
        pre.innerText = node;
        $('#editor').html(pre);
        this.documentData = `${fileReader.result}`;
      }
    }

    if (fileExtension == "txt") {
      fileReader.readAsText(file);
    } else if (fileExtension == "docx") {
      fileReader.readAsBinaryString(file);
    }
  }

  getSelectionCharacterOffsetWithin(element) {
    console.log("getSelectionCharacterOffsetWithin called");
    // this.temp = 0;
    var start = 0;
    var end = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        var range = win.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        start = preCaretRange.toString().length;
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        end = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != "Control") {
      var textRange = sel.createRange();
      var preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint("EndToStart", textRange);
      start = preCaretTextRange.text.length;
      preCaretTextRange.setEndPoint("EndToEnd", textRange);
      end = preCaretTextRange.text.length;
    }

    console.log("cursor index start");
    console.log(start);

    // this.temp = start;
    // console.log("this.temp");
    // console.log(this.temp);

    // this.setCaretToEnd(document.getElementById('editor'));
    // return { start: start, end: end };
    return start;
  }

  isBlank(str) {
    return (/^\s*$/.test(str));
  }

  testForkJoin(editorBody) {
    console.log("testForkJoin called");
    forkJoin([
      this.panelService.showSpellingGrammarCount(editorBody),
      this.panelService.showSpellingMistakes(editorBody)
    ])
      .subscribe(
        (allResults) => {
          console.log("All forkJoin api resolved");
          console.log(allResults);
        },
        (error) => {
          console.log("forkJoin error");
          console.log(error);
        })
  }

  onEditorEnter(e) {
    document.execCommand('defaultParagraphSeparator', false, 'p');
  }
}
