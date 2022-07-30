var { getTablePDFDocument } = require('./../reports/table-template');
var { Contract } = require('./../models/contract');
var { Payment } = require('./../models/payment');
const url = require('url');
const moment = require('moment');
const _ = require('lodash');

const REPORT_INCOME_GET_API = (request, response) => {
  var queryData = url.parse(request.url, true).query;

  var title = '已收款清單';
  var subtitle = '';
  var filter = {};
  if (queryData.sy) {
    var startDate = new Date(
      _.toInteger(queryData.sy),
      _.toInteger(queryData.sm - 1),
      _.toInteger(queryData.sd) + 1,
      0,
      0,
      0,
      0
    );
    var endDate = new Date(
      _.toInteger(queryData.ey),
      _.toInteger(queryData.em - 1),
      _.toInteger(queryData.ed) + 1,
      0,
      0,
      0,
      0
    );
    filter.dateCreated = { $gte: startDate, $lt: endDate };
    subtitle =
      queryData.sy +
      '/' +
      queryData.sm +
      '/' +
      queryData.sd +
      ' 至 ' +
      queryData.ey +
      '/' +
      queryData.em +
      '/' +
      queryData.ed;
  }

  Payment.find(filter)
    .populate({
      path: '_contract',
      select: '_customer',
      populate: {
        path: '_customer',
        select: 'pContact',
      },
    })
    .populate({
      path: '_contract',
      select: '_lot',
      populate: {
        path: '_lot',
        select: 'identifier',
      },
    })
    .then(
      (payments) => {
        payments.sort((a, b) => {
          return b.dateCreated - a.dateCreated;
        });
        var rows = [];
        for (i = 0; i < payments.length; i++) {
          var data = [];
          var date = moment(payments[i].dateCreated);
          // Convert to Taiwan Local Time
          date.set('hour', date.hour() - 8);
          data.push(date.year() + '/' + (date.month() + 1) + '/' + date.date());
          data.push(payments[i]._contract._customer.pContact);
          data.push(payments[i]._contract._lot.identifier);
          data.push(
            payments[i].type === 'D'
              ? '押金'
              : payments[i].type === 'RF'
              ? '退租金'
              : payments[i].type === 'R'
              ? '租金'
              : '退押金'
          );
          data.push(payments[i].amount);
          data.push(payments[i].comment);
          rows.push(data);
        }
        var headers = [
          { text: '日期' },
          { text: '付款人' },
          { text: '停車位' },
          { text: '種類' },
          { text: '金額' },
          { text: '備註' },
        ];
        var doc = getTablePDFDocument(title, subtitle, headers, rows);
        let chunks = [];

        doc.on('data', (chunk) => {
          chunks.push(chunk);
        });

        doc.on('end', () => {
          const result = Buffer.concat(chunks);
          response.setHeader('Content-Type', 'application/pdf');
          response.send(result); // Buffer data
        });

        doc.end();
      },
      (err) => {
        response.status(400).send(err);
      }
    );
};

const REPORT_PAYMENT_GET_API = (request, response) => {
  var queryData = url.parse(request.url, true).query;

  var title = '應付款清單';
  var subtitle = '所有項目';
  var filter = { active: true };
  if (queryData.paymentYear) {
    filter.pYear = queryData.paymentYear;
    filter.pMonth = queryData.paymentMonth;
    subtitle = queryData.paymentYear + '年' + queryData.paymentMonth + '月';
  }
  Contract.find(filter)
    .populate({
      path: '_customer',
      select: 'pContact pPhone',
    })
    .populate({
      path: '_lot',
      select: 'identifier rent',
    })
    .then(
      (model) => {
        model.sort((a, b) => {
          return a.pYear - b.pYear !== 0
            ? a.pYear - b.pYear
            : a.pMonth - b.pMonth !== 0
            ? a.pMonth - b.pMonth
            : a.pDay - b.pDay;
        });
        var rows = [];
        for (i = 0; i < model.length; i++) {
          var data = [];
          data.push(model[i]._lot.identifier);
          data.push(model[i]._customer.pContact);
          data.push(model[i]._customer.pPhone);
          var date = `${model[i].pYear}/${model[i].pMonth}/${model[i].pDay}`;
          data.push(date);
          var amount =
            model[i].pFrequency * model[i]._lot.rent -
            (model[i].pTotal % (model[i].pFrequency * model[i]._lot.rent));
          data.push(amount);
          data.push('');
          rows.push(data);
        }
        var headers = [
          { text: '停車位' },
          { text: '聯絡人' },
          { text: '電話' },
          { text: '日期' },
          { text: '金額' },
          { text: '備註' },
        ];
        var doc = getTablePDFDocument(title, subtitle, headers, rows);
        let chunks = [];

        doc.on('data', (chunk) => {
          chunks.push(chunk);
        });

        doc.on('end', () => {
          const result = Buffer.concat(chunks);
          response.setHeader('Content-Type', 'application/pdf');
          response.send(result); // Buffer data
        });

        doc.end();
      },
      (err) => {
        response.status(400).send(err);
      }
    );
};

module.exports = {
  REPORT_PAYMENT_GET_API,
  REPORT_INCOME_GET_API,
};
