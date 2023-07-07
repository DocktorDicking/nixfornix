import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import {SettingModel} from '../models/setting.model';
import {SettingService} from './setting.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private settingCache: {[key: string]: any};

  constructor() { }

  public initialize(settingData: { [p: string]: any }) {
    this.settingCache = settingData;
  }

  // https://www.ngdevelop.tech/export-to-excel-in-angular-6/
  generateExcel(data) {
    const title = 'Nix4Nix Uren export';
    const headers = this.getHeaders();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Uren export');

    // Add new row
    const titleRow = worksheet.addRow([title]);

    // Set font, size and style in title row.
    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true };

    // Blank Row
    worksheet.addRow([]);

    // Add row with current formatted date
    const nowDate = new Date();
    const date = nowDate.getDate() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getFullYear();
    worksheet.addRow(['Export datum : ' + date]);

    // Add Header Row
    const headerRow = worksheet.addRow(headers);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '50C878' },
        bgColor: { argb: 'FF0000FF' }
      };

      // TODO: Config column width?
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Check for numbers in the dataset otherwise excel will not let the user so math
    data.forEach((array) => {
      array.forEach((element, index) => {
        if (!isNaN(element)) {
          array[index] = Number(element);
        }
      });
    });

    // Add Data as rows to the worksheet.
    worksheet.addRows(data);

    // Blank Row
    worksheet.addRow([]);

    // TODO: Add total hours (sum of all rows)
    const filename = 'Nix4Nix_Export_' + date.toString();
    const fileExtension = '.xlsx';

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((excelData) => {
      const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, filename + fileExtension);
    });
  }

  // ['Naam', 'Datum', 'Start', 'Eind', 'Pauze', 'Uren', 'Omschrijving', 'Locatie']
  private getHeaders() {
    const headers = [];
    if (this.settingCache[SettingService.TABLE_SHOW_COL_EMPLOYEE]) {
      headers.push('Werknemer');
    }

    // Default headers
    headers.push('Datum registratie');
    headers.push('Starttijd');
    headers.push('Eindtijd');
    headers.push('Pauze');
    headers.push('Uren gewerkt');

    if (this.settingCache[SettingService.TABLE_SHOW_COL_DESCRIPTION]) {
      headers.push('Omschrijving');
    }
    if (this.settingCache[SettingService.TABLE_SHOW_COL_LOCATION]) {
      headers.push(environment.locationLabel);
    }

    return headers;
  }
}
