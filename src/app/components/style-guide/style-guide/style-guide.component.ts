import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CsvFileUploadService } from 'src/app/services/csv-file-upload/csv-file-upload.service';
import { PanelService } from 'src/app/services/panel/panel.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
declare var $: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.css']
})
export class StyleGuideComponent implements OnInit {

  customDictionaryArray: any = [];
  dictionaryWordsData: any = [];
  moduleInfoData: any = [];
  activeDictionaryObject: any = {};
  // isUserHasPlan: boolean = false;
  // editTermObject: any = {};
  isPlanExpired: any = null;
  public addmore: FormGroup;
  public editmore: FormGroup;

  // customDictionaryWithId: any = {};

  // Creating an  of module flags and checking which module are available for this subscription
  moduleFlagData = {
    bannedWords: false,
    abbreviations: false,
  };

  // Creating an object of module where key as module and value as module id
  moduleDataWithId = {
    bannedWords: '',
    abbreviations: '',
  }

  // Creating reactive form to add new word and setting up the basic validations also
  addNewWordForm = new FormGroup({
    word: new FormControl('', [Validators.required]),
    part_of_speech: new FormControl('none'),
    case_sensitive: new FormControl('Y'),
    description: new FormControl(),
    // suggestion: new FormControl(),
  });

  // Creating reactive form to edit word and setting up the basic validations also
  editWordForm = new FormGroup({
    id: new FormControl(''),
    word: new FormControl('', [Validators.required]),
    part_of_speech: new FormControl('none'),
    case_sensitive: new FormControl('Y'),
    description: new FormControl(),
    suggestion: new FormControl(),
    dictionary_id: new FormControl(''),
  });

  // Creating reactive form to add new word and setting up the basic validations also
  addNewCustomDictionaryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(),
    action: new FormControl(),
  });

  // Creating reactive form to edit word and setting up the basic validations also
  editCustomDictionaryForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    description: new FormControl(),
    action: new FormControl(),
  });

  constructor(
    private panelService: PanelService,
    private userService: UserService,
    public utilityService: UtilityService,
    public csvUploadService: CsvFileUploadService,
    private _location: Location,
    private _fb: FormBuilder
  ) { }

  async ngOnInit(): Promise<void> {
    console.log("Style guide ngOnInit called");

    // Checking whether user'subscription got expired or not if yes then disable everthing in the page
    this.checkUserSubscriptionExpiryDate();

    // $('#addNewTermModal').modal('show');

    // Fetching user's subscription modules
    // await this.getModuleInfoBySubscription();

    this.addmore = this._fb.group({
      word: '',
      part_of_speech: '',
      case_sensitive: '',
      description: '',
      // itemRows: this._fb.array([this.initItemRows()])
      itemRows: this._fb.array([])

    });

    console.log("this.initItemRows2()");
    console.log(this.initItemRows2());

    // ['Sonia', 'John'].filter(item => {
    //   this.addDynamicNewRow2(item);
    // })

    this.editmore = this._fb.group({
      id: '',
      word: '',
      part_of_speech: '',
      case_sensitive: '',
      description: '',
      itemRows2: this._fb.array([])
    });

  }

  get formArr() {
    return this.addmore.get('itemRows') as FormArray;
  }

  initItemRows() {
    return this._fb.group({
      suggestion: [''],
    });
  }

  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  get formArr2() {
    return this.editmore.get('itemRows2') as FormArray;
  }

  initItemRows2() {
    return this._fb.group({
      suggestion: [''],
    });
  }

  createItem(item) {
    return this._fb.group({
      suggestion: [item],
    });
  }

  addNewRow2() {
    this.formArr2.push(this.initItemRows2());
  }

  addNewRow3(item) {
    this.formArr2.push(this.createItem(item));
  }

  deleteRow2(index: number) {
    this.formArr2.removeAt(index);
  }

  checkUserSubscriptionExpiryDate() {
    console.log('checkUserSubscriptionExpiryDate called');

    // Calling the API to check whether user'subscription got expired or not
    this.panelService
      .checkUserPlanExpiry()
      .subscribe(
        (data) => {
          console.log('checkUserPlanExpiry api response');
          console.log(data);

          // Changing status of variable isPlanExpired on the basis of api respose
          this.isPlanExpired = data.expiry_date == 'expired' ? false : true;

          console.log('this.isPlanExpired');
          console.log(this.isPlanExpired);
          console.log("customDictionaryArray.length");
          console.log(this.customDictionaryArray.length);

          // Firstly checking whether user'subscription got expired or not if not then fetch all user's custom dictionary
          if (this.isPlanExpired) {
            console.log('andar hun');
            this.getAllUserCustomDictionary();
          }
        },
        (error) => {
          console.log("checkUserPlanExpiry api error");
          console.log(error);

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  getAllUserCustomDictionary() {
    console.log("getAllUserCustomDictionary called");

    // Empty the previous stored dictionary words data
    this.customDictionaryArray = [];

    // Showing loader in table till API response get
    $('.customDictionaryLoader').removeClass('display_none');

    // Calling the API
    this.panelService
      .fetchAllUserCustomDictionary()
      .subscribe(
        (data) => {
          console.log('fetchAllUserCustomDictionary api response');
          console.log(data);

          // Hiding loader from table after recieving API response
          $('.customDictionaryLoader').addClass('display_none');

          // If success assign api response data to local object
          if (data.msg == 'success') {
            // let tempArray = [];
            this.customDictionaryArray = data.data;
            console.log("this.customDictionaryArray");
            console.log(this.customDictionaryArray);
            // this.customDictionaryArray
            //   .map(item => {
            //     this.customDictionaryWithId.push({ [item.id]: item })
            //   });

            // console.log("this.customDictionaryWithId");
            // console.log(this.customDictionaryWithId);

            if (this.customDictionaryArray.length) {
              console.log("phir bhi");
              this.getAllWordsByDictionaryWise();
            }
          }
        },
        (error) => {
          console.log('getDictionaryWords api error');
          console.log(error);

          // Hiding loader from table after recieving API response
          $('.table_loader').addClass('display_none');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  addNewCustomDictionary() {
    console.log("addNewCustomDictionary called");

    // Extracting value from addNewCustomDictionaryForm reactive form object to local varibale
    let data = this.addNewCustomDictionaryForm.value;
    console.log(data);

    // Showing loader and disabling add new dictionary button
    $('.add_dictionary_loader').removeClass('display_none');
    $('#add_dictionary_btn').addClass('pointer_events_none');

    // Calling the API to add new custom dictionary
    this.panelService
      .addNewUserCustomDictionary(data)
      .subscribe(
        (data) => {
          console.log("addNewUserCustomDictionary api response");
          console.log(data);

          // Hiding loader and enabling add new dictionary button and closing add new dictionary modal window
          $('.add_dictionary_loader').addClass('display_none');
          $(`#add_dictionary_btn`).removeClass('pointer_events_none');
          $('#addNewCustomDictionaryModal').modal('hide');

          // Resetting the addNewCustomDictionary reactive form object values
          this.addNewCustomDictionaryForm.reset();

          // Checking api response if success simply show success alert,then fetch custom dictionary once again
          if (data == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Dictionary created successfully</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
            this.getAllUserCustomDictionary();
          }
          else if (data != "success") {
            Swal.fire({
              title: `<p class='swalText'>Oops..</p>`,
              html: `<p class='swalText'>Your ${data}.</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
          }
        },
        (error) => {
          console.log('addNewUserCustomDictionary api error.');
          console.log(error);

          // Hiding loader and enabling add new dictionary button and closing add new dictionary modal window
          $('.add_dictionary_loader').addClass('display_none');
          $(`#add_dictionary_btn`).removeClass('pointer_events_none');
          $('#addNewCustomDictionaryModal').modal('hide');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  openEditCustomDictionaryModal() {
    console.log("openEditCustomDictionaryModal called");
    // console.log(data);

    // let dictionary_id = this.getActiveDictionaryObjectId();
    let dictionary_id = document.querySelector('.nav-link.active').getAttribute('data-dictionaryid');
    let data = this.customDictionaryArray.filter(item => item.id == dictionary_id).map(o => o)[0];

    // Prefilling the value to the edit word form
    this.editCustomDictionaryForm
      .patchValue({
        id: data.id,
        name: data.name,
        description: data.description,
        action: data.action,
      });

    // After setting up the value open the edit word modal
    $('#editCustomDictionaryModal').modal('show');
  }

  editCustomDictionary() {
    console.log('editCustomDictionary called');

    // Extracting value from addNewWordForm reactive form object to local varibale
    let data = this.editCustomDictionaryForm.value;
    console.log(data);

    // Showing loader and disabling edit dictionary button
    $('.edit_dictionary_loader').removeClass('display_none');
    $('#edit_dictionary_btn').addClass('pointer_events_none');

    // Calling the API to edit user's custom dictionary
    this.panelService
      .editUserCustomDictionary(data)
      .subscribe(
        (data) => {
          console.log("editUserCustomDictionary api response");
          console.log(data);

          // Hiding loader and enabling edit word button and closing edit dictionary modal window
          $('.edit_dictionary_loader').addClass('display_none');
          $('#edit_dictionary_btn').removeClass('pointer_events_none');
          $('#editCustomDictionaryModal').modal('hide');

          // Resetting the editWord reactive form object values
          this.editCustomDictionaryForm.reset();

          // Checking api response if success simply show success alert,then fetch all custom dictionary once again
          if (data == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Dictionary updated successfully</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });

            this.getAllUserCustomDictionary();
          }
          else if (data != "success") {
            Swal.fire({
              title: `<p class='swalText'>Process failed..</p>`,
              html: `<p class='swalText'>Your ${data}.</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
          }

        },
        (error) => {
          console.log('editWord api error.');
          console.log(error);

          // Hiding loader and enabling edit word button and closing edit dictionary modal window
          $('.edit_dictionary_loader').addClass('display_none');
          $('#edit_dictionary_btn').removeClass('pointer_events_none');
          $('#editCustomDictionaryModal').modal('hide');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed..</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  deleteCustomDictionary() {
    console.log('deleteCustomDictionary called.!');

    // let dictionary_id = this.getActiveDictionaryObjectId();

    // let element = document.querySelector('.nav-link.active');
    // console.log("element");
    // console.log(element);
    // console.log(element.getAttribute('data-dictionaryid'));

    let dictionary_id = document.querySelector('.nav-link.active').getAttribute('data-dictionaryid');

    let data = this.customDictionaryArray.filter(item => item.id == dictionary_id).map(o => o)[0];

    console.log(dictionary_id);
    // event.stopPropagation();

    // Before calling deleteCustomDictionary api show "Are you sure?" confirmation window
    Swal.fire({
      title: `<p class='swalText'>Are you sure</p>`,
      showDenyButton: true,
      denyButtonText: 'Cancel',
      buttonsStyling: false,
      icon: 'question',
      customClass: { confirmButton: 'btn swal_button_style margin_right_10', denyButton: 'btn btn-primary' }
    }).then((result) => {
      // If user confirmed simply call the deleteCustomDictionary API
      if (result.isConfirmed) {

        // Set dictionary id which wants to delete and send it to the API as a requested object
        let data = { id: dictionary_id }

        // Calling the deleteWordFromDictionary api to delete word from user's dictionary
        this.panelService
          .deleteUserCustomDictionary(data)
          .subscribe(
            (data) => {

              // Checking api response if success simply show success alert,then fetch all custom dictionary once again
              if (data == "success") {
                this.getAllUserCustomDictionary();
              } else {
                Swal.fire({
                  title: `<p class='swalText'>Deletion failed...</p>`,
                  html: `<p class='swalText'>Please try later</p>`,
                  icon: 'error',
                  buttonsStyling: false,
                  customClass: { confirmButton: 'btn swal_button_style' }
                });

                // Swal.fire('Deletion failed.', '<h4>Please try later.</h4>', 'error');
              }
            },
            (error) => {
              console.log('deleteWordFromDictionary api error');
              console.log(error);

              // Showing alert if API responded with any error
              Swal.fire({
                title: `<p class='swalText'>Process failed...</p>`,
                html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' }
              });
            });
      }
    });
  }

  getAllWordsByDictionaryWise() {
    console.log("getAllWordsByDictionaryWise called");
    // Wrapped inside setTimeout because wait for 1 second till active class got added to clicked dictionary tab
    setTimeout(() => {

      // this.changeDictionaryName();

      // return;

      // After active class added to clicked dictionary tab get modulename from that element's data attribute
      // let element = document.querySelector('.nav-link.active');
      // console.log("element");
      // console.log(element.getAttribute('data-dictionaryid'));
      // let dictionary_id = element.getAttribute('data-dictionaryid');
      // console.log("getAllWordsByDictionaryWise dictionary_id");
      // console.log(dictionary_id);

      // let element = document.querySelector('.nav-link.active');
      // console.log("element");
      // console.log(element);
      // console.log(element.getAttribute('data-dictionaryid'));

      // let dictionary_id = element.getAttribute('data-dictionaryid');
      // console.log("getAllWordsByDictionaryWise dictionary_id");
      // console.log(dictionary_id);

      // let dictionary_id = this.getActiveDictionaryObjectId();
      let dictionary_id = document.querySelector('.nav-link.active').getAttribute('data-dictionaryid');
      console.log("dictionary_id");
      console.log(dictionary_id);

      this.activeDictionaryObject = this.customDictionaryArray
        .filter(item => item.id == dictionary_id)
        .map(o => o)[0];

      console.log("this.activeDictionaryObject");
      console.log(this.activeDictionaryObject);

      this.dictionaryWordsData = this.customDictionaryArray.filter(item => item.id == dictionary_id).map(o => o.wordInfo)[0];
      console.log("this.dictionaryWordsData");
      console.log(this.dictionaryWordsData);
    }, 100)
  }

  changeDictionaryName() {
    console.log("changeDictionaryName called");

    let activeTab = document.querySelector('.tab-pane.active');
    console.log("activeTab");
    console.log(activeTab);

    const activeTabId = activeTab.getAttribute('id');
    console.log("activeTabId");
    console.log(activeTabId);

    let activeDicitonary = document.querySelector('.nav-link.active').innerHTML;

    console.log("activeDicitonary");
    console.log(activeDicitonary);

    $(`#${activeTabId} > .tabFirstChildWrapper > .dictionaryName`).text(activeDicitonary);

    let dictionaryToggleStatus = document.querySelector('.nav-link.active').getAttribute('data-dictionarystatus');
    console.log("dictionaryToggleStatus");
    console.log(dictionaryToggleStatus);

    let flag = dictionaryToggleStatus == 'Y' ? true : false;
    $('.tab-pane.active > .tabFirstChildWrapper > .switch > .dictionaryToggle').prop("checked", flag);

  }

  addNewWord(modalId, modalBtn) {
    console.log('addNewWord called');

    // Extracting value from addNewWordForm reactive form object to local varibale
    let data = this.addmore.value;
    let newWordObject = {
      word: data.word,
      part_of_speech: data.part_of_speech,
      case_sensitive: data.case_sensitive,
      description: data.description,
      suggestions: data.itemRows,
      dictionary_id: ''
    }
    // console.log(this.addNewWordForm.value);
    // console.log(this.addmore.value);
    console.log('newWordObject');
    console.log(newWordObject);

    // Get modulename on which active class has been added while clicked
    // let moduleName = $('.nav-link.active').data('modulename');
    // console.log("moduleName");
    // console.log(moduleName);

    // let element = document.querySelector('.nav-link.active');
    // console.log("element");
    // console.log(element);
    // console.log(element.getAttribute('data-dictionaryid'));
    let dictionary_id = document.querySelector('.nav-link.active').getAttribute('data-dictionaryid');
    // let dictionary_id = $('.active').data('dictionaryid');
    console.log("addNewWord dictionary_id");
    console.log(dictionary_id);

    // Creating an API request object
    newWordObject.dictionary_id = dictionary_id;
    // let data = { dictionary_id: dictionary_id, user_id: this.userService.userData.id }

    // Extrating module id and adding it in the form object to send as a requested object to the API
    // data.module_id = this.moduleDataWithId[moduleName].id;
    // console.log("After adding module_id");
    // console.log(data);

    // Showing loader and disabling add new word button
    $('.add_word_loader').removeClass('display_none');
    $(`#${modalBtn}`).addClass('pointer_events_none');

    // Calling the API to add new word in user's dictionary
    this.panelService
      .addWordToUserCustomDictionary(newWordObject)
      .subscribe(
        (data) => {
          console.log("addWordToDictionary api response");
          console.log(data);

          // Hiding loader and enabling add new word button and closing add new word modal window
          $('.add_word_loader').addClass('display_none');
          $(`#${modalBtn}`).removeClass('pointer_events_none');
          $(`#${modalId}`).modal('hide');

          // Resetting the addNewWord reactive form object values
          this.addmore.reset();
          this.formArr.clear();

          // Checking api response if success simply show success alert,then fetch dictionary words once again
          if (data == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Word added to dictionary successfully</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
            // this.getAllWordsByDictionaryWise();
            this.getAllUserCustomDictionary();
          }
          else if (data != "success") {
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>${data}.</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
          }
        },
        (error) => {
          console.log('addNewWord api error.');
          console.log(error);

          // Hiding loader and enabling add new word button and closing add new word modal window
          $('.add_word_loader').addClass('display_none');
          $(`#${modalBtn}`).removeClass('pointer_events_none');
          $(`#${modalId}`).modal('hide');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  openEditTermModal(data, moduleId) {
    console.log("openEditTermModal called");
    console.log(data);
    this.formArr2.clear();

    let suggestionRows = data.suggestionWordInfo.filter(o => o).map(item => item.suggestion);
    suggestionRows.filter(item => {
      this.addNewRow3(item);
    })

    console.log("suggestionRows");
    console.log(suggestionRows);

    // Prefilling the value to the edit word form
    // this.editWordForm
    //   .patchValue({
    //     id: data.id,
    //     word: data.word,
    //     part_of_speech: data.part_of_speech,
    //     case_sensitive: data.case_sensitive,
    //     description: data.description,
    //     suggestion: data.suggestion,
    //     dictionary_id: data.dictionary_id,
    //   });

    this.editmore
      .patchValue({
        id: data.id,
        word: data.word,
        part_of_speech: data.part_of_speech,
        case_sensitive: data.case_sensitive,
        description: data.description,
        // itemRows2: data.suggestionWordInfo.filter(o => o).map(item => item.suggestion),
        itemRows2: suggestionRows,
      });

    console.log("this.editmore.value");
    console.log(this.editmore.value);

    // After setting up the value open the edit word modal
    $(`#${moduleId}`).modal('show');
  }

  editWord(modalId, moduleBtn) {
    console.log('editWord called');

    // Extracting value from addNewWordForm reactive form object to local varibale
    // let data = this.editWordForm.value;
    // console.log(data);
    let data = this.editmore.value;
    let updateWordObject = {
      id: data.id,
      word: data.word,
      part_of_speech: data.part_of_speech,
      case_sensitive: data.case_sensitive,
      description: data.description,
      suggestions: data.itemRows2,
      dictionary_id: ''
    }
    // console.log(this.addNewWordForm.value);
    // console.log(this.addmore.value);
    console.log(updateWordObject);

    // console.log(this.addNewWordForm.value);
    // console.log(this.editmore.value);

    // return;
    // let element = document.querySelector('.nav-link.active');
    // console.log("element");
    // console.log(element);
    // console.log(element.getAttribute('data-dictionaryid'));
    // let dictionary_id = element.getAttribute('data-dictionaryid');

    let dictionary_id = document.querySelector('.nav-link.active').getAttribute('data-dictionaryid');
    console.log("editWord dictionary_id");
    console.log(dictionary_id);



    // // // Creating an API request object
    // data.dictionary_id = dictionary_id;
    updateWordObject.dictionary_id = dictionary_id;

    // Get modulename on which active class has been added while clicked
    // let moduleName = $('.nav-link.active').data('modulename');
    // console.log("editWord moduleName");
    // console.log(moduleName);

    // return;
    // Extrating module id and adding it in the form object to send to the API as a request object
    // data.module_id = this.moduleDataWithId[moduleName].id;
    // console.log("In editWordForm After adding module_id");
    // console.log(data);

    // Showing loader and disabling edit word button
    $('.edit_word_loader').removeClass('display_none');
    $(`#${moduleBtn}`).addClass('pointer_events_none');

    // Calling the API to edit user's dictionary word
    this.panelService
      .editUserCustomDictionaryWord(updateWordObject)
      .subscribe(
        (data) => {
          console.log("editWordToDictionary api response");
          console.log(data);

          // Hiding loader and enabling edit word button and closing edit word modal window
          $('.edit_word_loader').addClass('display_none');
          $(`#${moduleBtn}`).removeClass('pointer_events_none');
          $(`#${modalId}`).modal('hide');

          // Resetting the editWord reactive form object values
          this.editmore.reset();
          this.formArr2.clear();
          // Checking api response if success simply show success alert,then fetch dictionary words once again
          if (data == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Word updated successfully</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });

            this.getAllUserCustomDictionary();
            // this.getAllWordsByDictionaryWise();
          }
          else if (data != "success") {
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>${data}</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
          }

        },
        (error) => {
          console.log('editWord api error.');
          console.log(error);

          // Hiding loader and enabling edit word button and closing edit word modal window
          $('.edit_word_loader').addClass('display_none');
          $(`#${moduleBtn}`).removeClass('pointer_events_none');
          $(`#${modalId}`).modal('hide');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  deleteWord(word_id, event) {
    console.log('deleteWord called.!');
    console.log(word_id);
    event.stopPropagation();

    // Before calling deleteWordFromDictionary api show "Are you sure?" confirmation window
    Swal.fire({
      title: `<p class='swalText'>Are you sure</p>`,
      showDenyButton: true,
      denyButtonText: 'Cancel',
      buttonsStyling: false,
      icon: 'question',
      customClass: { confirmButton: 'btn swal_button_style margin_right_10', denyButton: 'btn btn-primary' }
    }).then((result) => {
      // If user confirmed simply call the deleteWordFromDictionary API
      if (result.isConfirmed) {

        // Set word id which wants to delete and send it to the API as a requested object
        let data = { id: word_id }

        // Calling the deleteWordFromDictionary api to delete word from user's dictionary
        this.panelService
          .deleteUserCustomDictionaryWord(data)
          .subscribe(
            (data) => {

              // Checking api response if success simply show success alert,then fetch dictionary words once again
              if (data == "success") {
                this.getAllUserCustomDictionary();
                // this.getAllWordsByDictionaryWise();
              } else {
                Swal.fire({
                  title: `<p class='swalText'>Deletion failed...</p>`,
                  html: `<p class='swalText'>Please try later</p>`,
                  icon: 'error',
                  buttonsStyling: false,
                  customClass: { confirmButton: 'btn swal_button_style' }
                });
              }
            },
            (error) => {
              console.log('deleteWordFromDictionary api error');
              console.log(error);

              // Showing alert if API responded with any error
              Swal.fire({
                title: `<p class='swalText'>Process failed...</p>`,
                html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
                icon: 'error',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' }
              });
            });
      }
    });
  }

  uploadWordsCSV() {
    console.log('uploadWordsCSV called');

    if (!$('#txtFileUpload').val()) {
      $('#uploadCSVFileModal').modal('hide');
      Swal.fire({
        title: `<p class='swalText'>File not found</p>`,
        html: `<p class='swalText'>Please select the file</p>`,
        icon: 'warning',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn swal_button_style' }
      });
      return;
    }

    // Extracting all csv file records(data)
    let csvRecords = this.csvUploadService.records;
    console.log("csvRecords");
    console.log(csvRecords);

    let dictionary_id = document.querySelector('.nav-link.active').getAttribute('data-dictionaryid');
    console.log("uploadWordsCSV dictionary_id");
    console.log(dictionary_id);

    // Adding extracted module id to the form object to send as a requested object to the API
    let data = { csvData: csvRecords, dictionary_id: dictionary_id }

    // Showing loader and disabling upload csv file button
    $('.upload_csv_loader').removeClass('display_none');
    if (!$('#upload_csv_btn').hasClass('pointer_events_none')) {
      $('#upload_csv_btn').addClass('pointer_events_none');
    }

    // Calling the API to add new wordin bulk via CSV file in user's dictionary
    this.panelService
      .addWordsToUserCustomDictionaryThroughCSV(data)
      .subscribe(
        (data) => {
          console.log('addWordsToDictionaryThroughCSVFile api response');
          console.log(data);

          // Hiding loader and enabling upload csv file button and closing upload csv file modal window
          $('.upload_csv_loader').addClass('display_none');
          $('#upload_csv_btn').removeClass('pointer_events_none');
          $('#uploadCSVFileModal').modal('hide');

          // Clear upload csv file input fiel value
          $('#txtFileUpload').val('');

          // Clear all table data in which csv file data previwed to user
          // $('#uploadCSVTableBody > tr').remove();

          // Checking api response if success simply show success alert,then fetch dictionary words once again
          if (data.msg == 'success') {

            // Checking whether any duplicate words found if no then simply show success alert
            if (!data.duplicateFound) {
              Swal.fire({
                title: `<p class='swalText'>Success..</p>`,
                html: `<p class='swalText'>Words added to dictionary successfully</p>`,
                icon: 'success',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' }
              });
            }
            else {
              let responseData = JSON.parse(data.data);

              // Parsing the api response object to check whether any duplicate words
              // found or not if yes then show those words within success alert
              Swal.fire({
                title: `<p class='swalText'>Success</p>`,
                html: `<p class='swalText'>Words added successfully.But these are duplicate words [${responseData}] so it's not added.</p>`,
                icon: 'success',
                buttonsStyling: false,
                customClass: { confirmButton: 'btn swal_button_style' }
              });
            }

            // Calling the getAllDictionaryWordsByModule API to refresh the dictionary table
            // this.getAllWordsByDictionaryWise();
            this.getAllUserCustomDictionary();
          }
          else if (data != "success") {
            Swal.fire({
              title: `<p class='swalText'>Process failed...</p>`,
              html: `<p class='swalText'>${data}</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
          }

        },
        (error) => {
          console.log('addWordsToDictionaryThroughCSVFile api error');
          console.log(error);

          // Hiding loader and enabling upload csv file button and closing upload csv file modal window
          $('.upload_csv_loader').addClass('display_none');
          $('#upload_csv_btn').removeClass('pointer_events_none');
          $('#uploadCSVFileModal').modal('hide');
          $('#txtFileUpload').val('');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  downloadCsvFile() {
    let link = document.createElement("a");
    link.download = "sample-words.csv";
    link.href = "assets/assets/csv/sample-words.csv";
    link.click();
  }

  toggleDictionary(event) {
    console.log("toggleDictionary called");
    console.log(event.target);

    console.log($(event.target).is(":checked"));
    let toggleStatus = $(event.target).is(":checked") ? 'Y' : 'N';
    console.log("toggleStatus");
    console.log(toggleStatus);

    let activeTab = document.querySelector('.tab-pane.active');
    console.log("activeTab");
    console.log(activeTab);

    const activeTabId = activeTab.getAttribute('id');
    console.log("activeTabId");
    console.log(activeTabId);

    let activeDictionaryId = document.querySelector('.nav-link.active').getAttribute('data-dictionaryid');
    console.log("activeDictionaryId");
    console.log(activeDictionaryId);

    let data = { id: activeDictionaryId, user_id: this.userService.userData.id, status: toggleStatus }

    // Hiding loader and enabling add new word button and closing
    $(`#${activeTabId} > .tabFirstChildWrapper > .toggleDictionaryLoader`).removeClass('display_none');
    $(`#${activeTabId} > .tabFirstChildWrapper > .switch`).addClass('pointer_events_none');
    // return

    this.panelService
      .toggleDictionaryStatus(data)
      .subscribe(
        (data) => {
          console.log("toggleDictionaryStatus api response");
          console.log(data);

          // Hiding loader and enabling add new word button and closing
          $(`#${activeTabId} > .tabFirstChildWrapper > .toggleDictionaryLoader`).addClass('display_none');
          $(`#${activeTabId} > .tabFirstChildWrapper > .switch`).removeClass('pointer_events_none');

          // Checking api response if success simply show success alert,then fetch dictionary words once again
          if (data == 'success') {
            Swal.fire({
              title: `<p class='swalText'>Success</p>`,
              html: `<p class='swalText'>Dictionary status changed successfully</p>`,
              icon: 'success',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
          }
          else if (data != "success") {
            Swal.fire({
              title: `<p class='swalText'>Process failed..</p>`,
              html: `<p class='swalText'>${data}.</p>`,
              icon: 'error',
              buttonsStyling: false,
              customClass: { confirmButton: 'btn swal_button_style' }
            });
          }
        },
        (error) => {
          console.log('addNewWord api error.');
          console.log(error);

          let flag = $(event.target).is(":checked") ? false : true;
          $(event.target).prop("checked", flag);


          // Hiding loader and enabling add new word button and closing
          $(`#${activeTabId} > .tabFirstChildWrapper > .toggleDictionaryLoader`).addClass('display_none');
          $(`#${activeTabId} > .tabFirstChildWrapper > .switch`).removeClass('pointer_events_none');

          // Showing alert if API responded with any error
          Swal.fire({
            title: `<p class='swalText'>Process failed...</p>`,
            html: `<p class='swalText'>Some error occured.Please try again or contact the helpdesk at help@citispotter.com</p>`,
            icon: 'error',
            buttonsStyling: false,
            customClass: { confirmButton: 'btn swal_button_style' }
          });
        });
  }

  backClicked() {
    this._location.back();
  }

  exportTableData() {
    console.log("Called exportTableData");

    let exportTableDated = this.dictionaryWordsData.map(o => {
      o.suggestionWordInfo = o.suggestionWordInfo.map(item => item.suggestion)

      return {
        Word: o.word, "Part_of_speech": o.part_of_speech, "Case_sensitive": o.case_sensitive,
        Description: o.description, Suggestion: o.suggestionWordInfo,
      };
    });

    console.log("exportTableDated");
    console.log(exportTableDated);

    this.csvUploadService.exportToCsv('myCsvDocumentName.csv', exportTableDated);
  }
}
