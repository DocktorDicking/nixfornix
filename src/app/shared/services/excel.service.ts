import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  // https://www.ngdevelop.tech/export-to-excel-in-angular-6/
  generateExcel(data) {
    const title = 'Uren export';
    const header = ['Naam', 'Datum', 'Start', 'Eind', 'Pauze', 'Uren'];
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
    const headerRow = worksheet.addRow(header);

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

    // Add Data as rows to the worksheet.
    worksheet.addRows(data);

    // Blank Row
    worksheet.addRow([]);

    // TODO: Add total hours (sum of all rows)

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((excelData) => {
      const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'ExportUren.xlsx');
    });
  }
}
