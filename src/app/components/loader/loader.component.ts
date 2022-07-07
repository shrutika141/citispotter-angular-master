import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  @Input() width: string;
  @Input() height: string;

  // width: string = "";
  // height: string = "";

  constructor() { }

  ngOnInit(): void {
    // console.log('width');
    // console.log(this.width);
    this.width = this.width + "px";
    // console.log('height');
    this.height = this.height + "px"
    // console.log(this.height);
  }

}
