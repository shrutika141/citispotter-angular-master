import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  ngOnInit() {

  }
  constructor(private spinner: NgxSpinnerService) { }

  // showAllLoading(loaderclass) {
  //   // let totalOverlay = document.querySelectorAll('.' + overlayclass);
  //   if (loaderclass) {
  //     let totalLoader = document.querySelectorAll('.' + loaderclass);
  //     for (let i = 0; i < totalLoader.length; i++) {
  //       // totalOverlay[i].classList.remove('display_none');
  //       if(totalLoader[i]){
  //         totalLoader[i].classList.remove('display_none');
  //       }
  //     }
  //   }
  // }

  // hideAllLoading(loaderclass) {
  //   // let totalOverlay = document.querySelectorAll('.' + overlayclass);
  //   if (loaderclass) {
  //     let totalLoader = document.querySelectorAll('.' + loaderclass);
  //     for (let i = 0; i < totalLoader.length; i++) {
  //       // totalOverlay[i].classList.remove('display_none');
  //       if(totalLoader[i]){
  //         totalLoader[i].classList.remove('display_none');
  //       }
  //     }
  //   }
  // }

  toggleAllLoading(loaderclass) {
    // let totalOverlay = document.querySelectorAll('.' + overlayclass);
    if (loaderclass) {
      let totalLoader = document.querySelectorAll('.' + loaderclass);
      for (let i = 0; i < totalLoader.length; i++) {
        // totalOverlay[i].classList.remove('display_none');
        if (totalLoader[i]) {
          totalLoader[i].classList.remove('display_none');
        }
      }
    }
  }

  showLoading(loaderclass) {
    console.log('showLoading called.');
    console.log(loaderclass);
    if (loaderclass) {
      let element = ((document.querySelector("." + loaderclass)) as HTMLDivElement)
      if (element) {
        element.classList.remove('display_none');
      }
    }
  }

  hideLoading(loaderclass) {
    console.log('hideLoading called.');
    console.log(loaderclass);
    if (loaderclass) {
      let element = ((document.querySelector("." + loaderclass)) as HTMLDivElement);
      if (element) {
        element.classList.add('display_none');
      }
    }
  }

  showLoadingWithOverlay(overlayclass, loaderclass) {
    if (overlayclass && loaderclass) {
      let totalOverlay = document.querySelectorAll('.' + overlayclass);
      let totalLoader = document.querySelectorAll('.' + loaderclass);
      for (let i = 0; i < totalLoader.length; i++) {
        if (totalOverlay[i]) {
          totalOverlay[i].classList.remove('display_none');
        }
        if (totalLoader[i]) {
          totalLoader[i].classList.remove('display_none');
        }
      }
    }
  }

  hideLoadingWithOverlay(overlayclass, loaderclass) {
    if (overlayclass && loaderclass) {
      let totalOverlay = document.querySelectorAll('.' + overlayclass);
      let totalLoader = document.querySelectorAll('.' + loaderclass);
      for (let i = 0; i < totalLoader.length; i++) {
        if (totalOverlay[i]) {
          totalOverlay[i].classList.add('display_none');
        }
        if (totalLoader[i]) {
          totalLoader[i].classList.add('display_none');
        }
      }
    }
  }
}
