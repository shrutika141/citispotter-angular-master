import { Injectable, ViewChild } from '@angular/core';
import { CSVRecord } from '../../CSVModel';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CsvFileUploadService {

  public records: any[] = [];
  public csvFileErrorMsg: string = '';

  @ViewChild('csvReader') csvReader: any;

  constructor() { }

  uploadListener($event: any): void {

    let text = [];
    let wordHeaderColumns = ['Word', 'Part_of_speech', 'Case_sensitive', 'Description', 'Suggestion'];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/).filter(Boolean);
        let headersRow = this.getHeaderArray(csvRecordsArray);

        $('#upload_csv_btn').addClass('pointer_events_none');
        let isHeaderMatched = wordHeaderColumns.toString().toLowerCase().includes(headersRow.toString().toLowerCase());

        console.log("headersRow");
        console.log(headersRow);
        console.log("wordHeaderColumns");
        console.log(wordHeaderColumns);
        console.log("isHeaderMatched");
        console.log(isHeaderMatched);

        this.csvFileErrorMsg = '';
        if (headersRow.length < 5) {
          this.csvFileErrorMsg = "Missing header column in file.";
          return;
        } else if (!isHeaderMatched) {
          this.csvFileErrorMsg = "Mismatched header columns found.";
          return;
        }

        $('#upload_csv_btn').removeClass('pointer_events_none');
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    console.log("csvRecordsArray");
    console.log(csvRecordsArray);

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');

      console.log("before curruntRecord");
      console.log(curruntRecord);

      console.log(curruntRecord[0]);
      if (!curruntRecord[0]) {
        $('#upload_csv_btn').addClass('pointer_events_none');
        this.csvFileErrorMsg = "Word column could not contain empty value.";
        break;
      }

      console.log("Hello Jii");
      curruntRecord = curruntRecord.filter(function (el) { return el && el != " "; });

      console.log("After curruntRecord");
      console.log(curruntRecord);

      if (curruntRecord.length) {
        let wordObject = {
          word: curruntRecord[0],
          part_of_speech: curruntRecord[1],
          case_sensitive: curruntRecord[2],
          description: curruntRecord[3],
          suggestion: curruntRecord.slice(4, curruntRecord.length).map(function (o) {
            return o.replace(/"/g, '');
          })
        }

        console.log("wordObject");
        console.log(wordObject);

        csvArr.push(wordObject);
      }
      // console.log("headerLength");
      // console.log(headerLength);
      // return;
      // if (curruntRecord.length == headerLength) {
      //   let csvRecord: CSVRecord = new CSVRecord();
      //   csvRecord.word = curruntRecord[0].trim();
      //   csvRecord.part_of_speech = curruntRecord[1].trim();
      //   csvRecord.case_sensitive = curruntRecord[2].trim();
      //   csvRecord.description = curruntRecord[3].trim();
      //   csvRecord.suggestion = curruntRecord[4].split(',');
      //   csvArr.push(csvRecord);
      // }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
