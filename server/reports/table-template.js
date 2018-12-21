// PDF Printer
const PdfPrinter = require('pdfmake/src/printer');

// Constants Font Object for the PDF
const fonts = {
    Roboto: {
        normal: './asset/fonts/Roboto-Regular.ttf',
        bold: './asset/fonts/Roboto-Medium.ttf',
        italics: './asset/fonts/Roboto-Italic.ttf',
        bolditalics: './asset/fonts/Roboto-MediumItalic.ttf'
    },
    Chinese: {
        normal: './asset/fonts/msyh.ttf',
        bold: './asset/fonts/msyh.ttf',
        italics: './asset/fonts/msyh.ttf',
        bolditalics: './asset/fonts/msyh.ttf',
    }
};

const getTablePDFDocument = (title, subtitle, headers, rows) => {

    var printer = new PdfPrinter(fonts);
    var widthsArray = [];
    headers.forEach((element, index) => {
        headers[index]['style'] = 'tableHeader';
        widthsArray.push('*');
    });

    var data = [ headers ];

    for(i = 0; i < rows.length; i++) {
        data.push(rows[i]);
    }

    var docDefinition = {
        content: [
            { text: title, style: 'header'},
            { text: subtitle, style: 'subheader'},
            {
                style: 'tableExample',
                table: {
                    widths: widthsArray,
                    headerRows: 1,
                    body: data
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        if(rowIndex === 0) return '#4c90ff';
                        return (rowIndex % 2 === 0) ? '#eff5ff' : null;
                    }
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 5]
            },
            subheader: {
                fontSize: 13,
                bold: true,
                margin: [0, 0, 0, 5]
            },
            tableExample: {
                margin: [0, 0, 0, 10]
            },
            tableHeader: {
                bold: true,
                fontSize: 12,
                color: 'black'
            }
        },
        defaultStyle: {
            font: 'Chinese'
        }
    };

    return printer.createPdfKitDocument(docDefinition);
};

module.exports = {
    getTablePDFDocument
};