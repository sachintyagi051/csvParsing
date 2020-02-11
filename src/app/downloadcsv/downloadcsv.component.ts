
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from "file-saver";
import * as Papa from "papaparse";


export interface CSVData {
  id: number;
  name: string;
  username: string;
  email: number;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  phone: string;
  website: string;
  companyName: string;
  catchPhrase: string;
  bs: string;
}



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'downloadcsv',
  templateUrl: './downloadcsv.component.html',
  styleUrls: ['./downloadcsv.component.scss']
})
export class DownloadcsvComponent implements OnInit {
  [x: string]: any;

  displayedColumns: string[] = [
    'id',
    'name',
    'username',
    'email',
    'street',
    'suite',
    'city',
    'zipcode',
    'phone',
    'website',
    'companyName',
    'catchPhrase',
    'bs',
  ];
  dataSource: CSVData[] = [];
  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.toGet();
  }

  toGet() {
    this.http
      .get('https://jsonplaceholder.typicode.com/users')
      .subscribe(
        (res: any) => {
          // console.log('result', res);
          if (res) {
            this.dataSource = this.mapUrl(res);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }


  downloadCSV() {
    let CSVdata: any[] = this.dataSource.map(data => {
      return {
        'id': data.id,
        'name': data.name,
        'username': data.username,
        'email': data.email,
        'street': data.street,
        'suite': data.suite,
        'city': data.city,
        'zipcode': data.zipcode,
        'phone': data.phone,
        'website': data.website,
        'companyName': data.companyName,
        'catchPhrase': data.catchPhrase,
        'bs': data.bs
      }
    });

    let orderCsv: any = Papa.unparse(CSVdata, { header: true });
    var blob = new Blob([orderCsv], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, 'CSVdata' + '.csv');
  }

  uploadCSV(files: FileList) {

    if (files && files.length > 0) {
      let file: File = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let csv: string = reader.result as string;

        let csvUpload: any = Papa.parse(csv, {
          header: true,
          complete: function (csv) {
            console.log("Finished:", csv.data);
           
          }
        })
        
        this.dataSource = csvUpload.data;
      }
    }
    
  }


  mapUrl(data: any) {
    return data.map(d => {
      return {
        'id': d.id,
        'name': d.name,
        'username': d.username,
        'email': d.email,
        'street': d.address.street,
        'suite': d.address.suite,
        'city': d.address.city,
        'zipcode': d.address.zipcode,
        'phone': d.phone,
        'website': d.website,
        'companyName': d.company.name,
        'catchPhrase': d.company.catchPhrase,
        'bs': d.company.bs
      }
    });
  }


}
