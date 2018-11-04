var { getTablePDFDocument } = require('./../reports/table-template');
var { Contract } = require('./../models/contract');

const REPORT_PAYMENT_GET_API = (request, response) => {

    Contract.find({ active: true }).populate({
        path: '_customer',
        select: 'pContact pPhone'
    }).populate({
        path: '_lot',
        select: 'identifier rent'
    }).then((model) => {
        model.sort((a, b) => {
            return a.pYear - b.pYear !== 0 ? a.pYear - b.pYear :
                   a.pMonth - b.pMonth !== 0 ? a.pMonth - b.pMonth :
                   a.pDay - b.pDay;
        });
        var rows = [];
        for (i = 0; i < model.length; i++) {
            var data = [];
            data.push(model[i]._lot.identifier);
            data.push(model[i]._customer.pContact);
            data.push(model[i]._customer.pPhone);
            var date = `${model[i].pYear}/${model[i].pMonth}/${model[i].pDay}`;
            data.push(date);
            var amount = (model[i].pFrequency * model[i]._lot.rent) - (model[i].pTotal % (model[i].pFrequency * model[i]._lot.rent));
            data.push(amount);
            data.push('');
            rows.push(data);
        }
        var headers = [{ text: '停車位' }, { text: '聯絡人' }, { text: '電話' }, { text: '付款日期' }, { text: '金額' }, { text: '備註' }];
        var doc = getTablePDFDocument(headers, rows);
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

    }, (err) => {
        response.status(400).send(err);
    });

};

module.exports = {
    REPORT_PAYMENT_GET_API
};