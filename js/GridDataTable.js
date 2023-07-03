/**
 *-------------------------------------------
 * GridDataTable.js
 *-------------------------------------------
 * @version 1.1.0
 * @createAt 23.11.2018 19:41
 * @updatedAt 18.04.2023 23:52
 * @author NetCoDev
 *-------------------------------------------
 **/

/**
 * ------------------------------------
 * DataTableUtile
 * ------------------------------------
 */
class DataTableUtile
{
    static getStrNumber (i, str)
    {
        let res = "";
        let nextChar = null;
        let doIt = true;
        while (doIt) {
            res += "" + str[i];
            if (i +1 < str.length && /^[\d]$/.test(str[i+1])) {
                i++;
            } else {
                if (i +1 < str.length) { nextChar = str[i+1]; }
                doIt = false;
            }
        }

        return {res:res, nextChar:nextChar};
    }

    static getSortRes (a,b,orderAsc)
    {
        if (a < b) return ((orderAsc) ? 1 : -1);
        if (a > b) return ((orderAsc) ? -1 : 1);
        return 0;
    }

    static getSort (arr, orderAsc, config)
    {
        let res = arr;
        res.sort(function (a,b) { return DataTableUtile.getSortRes(a[1], b[1], orderAsc) });

        return res.sort(function (a,b) {
            if (/^[\d]{2}\.[\d]{2}\.[\d]{4}$/.test(a[1]) && /^[\d]{2}\.[\d]{2}\.[\d]{4}$/.test(b[1])
                //|| /^\d{2}[./-]\d{2}[./-]\d{4}[\s]\d{2}[:]\d{2}$/.test(a[1]) && /^\d{2}[./-]\d{2}[./-]\d{4}[\s]\d{2}[:]\d{2}$/.test(b[1])
            ) {
                return DataTableUtile.sortDate(a[1], b[1], orderAsc, config.dateLang);
            } else {
                return DataTableUtile.sortString(a,b,orderAsc);
            }
        });
    }

    static getLangDate (date, lang)
    {
        date = date.split('.');
        const res = (lang === 'de')  ? new Date(date[2]*1,date[1]*1 - 1,date[0]*1).getTime() : new Date(date[2]*1,date[0]*1 - 1,date[1]*1).getTime();

        return res;
    }

    static sortDate (a, b, orderAsc, dateLang)
    {
        const dateA = DataTableUtile.getLangDate(a, dateLang);
        const dateB = DataTableUtile.getLangDate(b, dateLang);

        return DataTableUtile.getSortRes(dateA, dateB, orderAsc);
    }

    static getValidInpt (obj)
    {
        let intVal = obj.inpt.value.trim();
        let res = null;

        if (/^[\d]+$/.test(intVal) && intVal) {
            if (obj.max < intVal*1) {
                intVal = obj.max;
                obj.inpt.value = intVal;
            }
            res = intVal*1;
        } else {
            obj.inpt.value = obj.default;
        }

        return res;
    }

    static sortString (a, b, orderAsc)
    {
        const arr0 = (a[1] && /^[\d*]$/.test(a[1]))
            ? a[1]
            : ((/^[\W*]$/i.test(a[1]) ) ? a[1].toLowerCase() : "");
        const arr1 = (b[1] && /^[\d*]$/.test(b[1]))
            ? b[1]
            : (( /^[\W*]$/i.test(b[1])) ? b[1].toLowerCase() : "");
        let res0 = "";
        let res1 = "";

        for (let i = 0; i < arr0.length; i++) {
            if (/^[\d]$/.test(arr0[i]) && /^[\d]$/.test(arr1[i])) {
                const objNr0 = this.getStrNumber(i, arr0);
                const objNr1 = this.getStrNumber(i, arr1);
                let n0 = objNr0.res*1;
                let n1 = objNr1.res*1;

                if (n0 === n1) {
                    if (objNr0.nextChar !== null && objNr1.nextChar === null) {
                        n0 = 1;
                        n1 = 0;
                    } else if (objNr1.nextChar !== null && objNr0.nextChar === null) {
                        n0 = 0;
                        n1 = 1;
                    }
                }
                return DataTableUtile.getSortRes(n0, n1, orderAsc);
            }
            if (arr1.length <= i && res0 === res1 || arr0[i] != arr1[i] && /^[\d]$/.test(arr1[i])) {
                return (!orderAsc) ? 1 > 0 :1 < 0;
            } else {
                res0 = arr0[i];
                res1 = arr1[i];
                if (arr0[i] != arr1[i]) {
                    return DataTableUtile.getSortRes(arr0[i], arr1[i], orderAsc);
                }
            }
        }

        return DataTableUtile.getSortRes(res1, res0, orderAsc);
    }
}

/**
 * ------------------------------------
 * DataTableConf
 * ------------------------------------
 */
class DataTableConf
{
    static getConf (config)
    {
        const defaultConf = {
            dataTable       : [],
            dataTableCache  : [],
            dataTableClone  : "",
            dataIndex       : 0,
            dataConfig      : {
                dataStep  : 1,
                maxStep   : 0,
                maxLen    : 0,
                stepLen   : 0,
                actualLen   : 0,
                rowLen: 0,
            },
            dateLang       : "de",
            tplLang        : "de",
            arrToggleList  : [],
            arrRowList     : [],
            arrRowIndex    : [],
            arrColType     : {},
            objSortList    : {},
            regEx          : {"date" : /^\d{2}[./-]\d{2}[./-]\d{4}$/, "dateTime" : /^\d{2}[./-]\d{2}[./-]\d{4}[\s]\d{2}[:]\d{2}$/},
            urlGetParam    : [],
            urlPostParam   : null,
            urlSearchParam : null,
            searchDate     : {start : [], end : [], show : false},
            dom            : {container : null},
            domId          : {
                btnNext : 'btn-step-forward',
                btnBack : 'btn-step-back',
                btnStep : 'btn-step',
                btnSearch     : 'btn-search',
                btnShowList   : 'btn-show-list',
                btnShowSelct  : 'btn-show-selection',
                btnRstSelct   : 'btn-reset-selection',
                btnRstGlblSrch   : 'btn-reset-global-search',
                btnContLen    : 'btn-content-length',
                btnConlToggle : 'btn-col-toggle',
                contentInfo   : 'dataTable-content-info',
                maxStep       : 'dataTable-max-step',
                colToggleList : 'dataTable-toggle-list-column',
                colSearchList : 'dataTable-toggle-list-search',
                inptContentLength : 'inpt-content-length',
                inptStep : 'inpt-step',
                wrapper : 'dataTable-wrapper',
                header : 'dataTable-header',
                content : 'dataTable-content',
                colToggleWrapper : 'dataTable-col-toggle-wrapper'
            },
            lang : {
                "de" : {
                    "action"           : "Aktion",
                    "show_list"        : "Liste zeigen",
                    "show_selection"   : "Auswahl zeigen",
                    "show_reset"       : "Auswahl aufheben",
                    "in_column"        : "In Spalte",
                    "search"           : "suchen",
                    "edit"             : "bearbeiten",
                    "delete"           : "löschen",
                    "results_per_page" : "Ergebnisse pro Seite",
                    "page"             : "Seite",
                    "column_hide_show" : "Spalten zeigen / verstecken",
                    "reset-global-search" : "Globalsuche aufheben",
                },
                "en" : {
                    "action"           : "Action",
                    "show_list"        : "Show list",
                    "show_selection"   : "Show selection",
                    "show_reset"       : "Deselect",
                    "in_column"        : "Search in column",
                    "search"           : "search",
                    "edit"             : "edit",
                    "delete"           : "delete",
                    "results_per_page" : "Results per page",
                    "page"             : "Page",
                    "column_hide_show" : "Show / hide columns",
                    "reset-global-search" : "Deselect Globalsearch",
                }
            }
        };
        defaultConf.searchInput = {
            "text" : '<input class="inpt-search" type="text" data-col-index="" data-col-column="">',
            "date" : '<div class="input-wrapper"><input class="inpt-date date-picker" name="date-from" type="text" data-col-index="" data-col-column=""></div><span>-</span><div class="input-wrapper"><input class="inpt-date date-picker" name="date-to" type="text"></div>',
        };

        defaultConf.tpl = {
            "columnHeader" : '<div class="col-header-wrapper"><div class="col-header-label">{%column%}</div><div class="order-box-container"><span class="svg-arrow-item" data-arrow-id="up"><svg class="svg-arrow" viewBox="0 0 640 640" width="10" height="10"><defs><path d="M160.01 320.01L0.02 640.02L320.03 640.01L640.02 640L480.03 320L320.01 0.01L160.01 320.01Z" id="bbbJpxd7D"></path></defs><g><g><g><use xlink:href="#bbbJpxd7D" opacity="1" fill="#30bf2d" fill-opacity="1"></use><g><use xlink:href="#bbbJpxd7D" opacity="1" fill-opacity="0" stroke="#42413f" stroke-width="1" stroke-opacity="1"></use></g></g></g></g></svg></span><span class="svg-arrow-item" data-arrow-id="down"><svg class="svg-arrow" viewBox="0 0 640 640" width="10" height="10"><defs><path d="M480.02 320L640 0L320 0.01L0 0.02L160 320.01L320.01 640.01L480.02 320Z" id="a4wj2R4nkY"></path></defs><g><g><g><use xlink:href="#a4wj2R4nkY" opacity="1" fill="#30bf2d" fill-opacity="1"></use><g><use xlink:href="#a4wj2R4nkY" opacity="1" fill-opacity="0" stroke="#42413f" stroke-width="1" stroke-opacity="1"></use></g></g></g></g></svg></span></div></div>',
            "columnToggleList" : '<span>{%column%}</span><input type="radio" checked="checked"/>',
            "searchToggleList" : '<span>{%column%}</span>',
            "rowIndex" : '<span class="rowIndex">{%rowIndex%}</span>',
            "app" : [
                '<div class="dataTable-toolbar"><button class="btn-show-list btn-blue">{%show_list%}</button><button class="btn-show-selection btn-blue">{%show_selection%}</button><button class="btn-reset-selection btn-blue">{%show_reset%}</button><button class="btn-reset-global-search btn-blue hide">{%reset-global-search%}</button><div class="dataTable-col-toggle-wrapper"><button class="btn-col-toggle btn-blue">{%in_column%} <span class="column-name"></span> {%search%}</button><div class="dataTable-col-toggle-list toggle-top dataTable-toggle-list-search"></div></div><div class="dataTable-search-wrapper-str">' + defaultConf.searchInput.text +'<input name="global-search-text" type="checkbox"><span class="txt-global"> : global</span><div class="btn-search btn-blue"><svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px"><path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"/></svg></div></div><div class="dataTable-search-wrapper-date">' + defaultConf.searchInput.date + '<input name="global-search-text" type="checkbox"><span class="txt-global"> : global</span><div class="btn-search btn-blue"><svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px"><path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"/></svg></div></div></div></div>',
                '<div class="dataTable-wrapper"><table class="dataTable-table"><thead class="dataTable-header"></thead><tbody class="dataTable-content"></tbody></table></div>',
                '<div class="dataTable-toolbar"><button class="btn-step-back btn-green"><div class="svg-wrapper"><svg version="1.1" viewBox="0 0 640 640" width="20" height="20"><defs><path d="M320.02 480.01L640.02 640L640.01 319.99L640 0L320.01 159.99L0.01 320.01L320.02 480.01Z" id="dByRCX4Jj"></path></defs><g><g><g><use xlink:href="#dByRCX4Jj" opacity="1" fill="#96938e" fill-opacity="1"></use><g><use xlink:href="#dByRCX4Jj" opacity="1" fill-opacity="0" stroke="#42413f" stroke-width="1" stroke-opacity="1"></use></g></g></g></g></svg></div></button><div class="dataTable-content-info"></div><button class="btn-step-forward btn-green"><div class="svg-wrapper"><svg version="1.1" viewBox="0 0 640 640" width="20" height="20"><defs><path d="M320.01 160L0 0.02L0.01 320.02L0.02 640.02L320.02 480.02L640.01 320.01L320.01 160Z" id="bIbcTwxec"></path></defs><g><g><g><use xlink:href="#bIbcTwxec" opacity="1" fill="#96938e" fill-opacity="1"></use><g><use xlink:href="#bIbcTwxec" opacity="1" fill-opacity="0" stroke="#42413f" stroke-width="1" stroke-opacity="1"></use></g></g></g></g></svg></div></button><input type="text" class="inpt-content-length"><button class="btn-content-length btn-green">{%results_per_page%}</button><input type="text" class="inpt-step" value="1"><button class="btn-step btn-green"> / <span class="dataTable-max-step">1</span> {%page%}</button><div class="dataTable-col-toggle-wrapper"><button class="btn-col-toggle btn-green">{%column_hide_show%}</button><div class="dataTable-col-toggle-list toggle-bottom dataTable-toggle-list-column"></div></div></div>'
            ]
        };

        return Object.assign(defaultConf,config);
    }
}

/**
 * ------------------------------------
 * DataTableSearch
 * ------------------------------------
 */
class DataTableSearch
{
    constructor() {
        this.config = {};
    }

    getSearch (srchConf)
    {
        const list = this.config.content.querySelectorAll('.data-row');
        let result = [];
        let revertIndex = list.length - 1;
        srchConf.val = srchConf.val.toLowerCase();
        srchConf.colIndex = srchConf.colIndex*1;

        for (let i = 0;i < list.length;i++) {

            let colVal1 = list[i].querySelectorAll('.data-col')[srchConf.index].innerHTML.toLowerCase();
            let colVal2 = list[revertIndex].querySelectorAll('.data-col')[srchConf.index].innerHTML.toLowerCase();

            if (srchConf.type === 'date' && srchConf.hasOwnProperty('dateEnd')) {

                let sDate = DataTableUtile.getLangDate(srchConf.val, this.config.dateLang);
                let eDate = DataTableUtile.getLangDate(srchConf.dateEnd, this.config.dateLang);
                colVal1 = DataTableUtile.getLangDate(colVal1, this.config.dateLang);
                colVal2 = DataTableUtile.getLangDate(colVal2, this.config.dateLang);

                if (colVal1 >= sDate && colVal1 <= eDate) {
                    result.push(list[i].dataset.rowIndex*1);
                }
                if(revertIndex > i) {
                    if (colVal2 >= sDate && colVal2 <= eDate) {
                        result.push(list[revertIndex].dataset.rowIndex*1);
                    }
                    revertIndex--;
                }

            } else {
                if (colVal1 === srchConf.val) {
                    result.push(list[i].dataset.rowIndex*1);
                }
                if(revertIndex > i) {
                    if (colVal2 === srchConf.val) {
                        result.push(list[revertIndex].dataset.rowIndex*1);
                    }
                    revertIndex--;
                }
            }

            if (revertIndex === i) { break; }
        }

        return result;
    }

    getSort (colIndex, order)
    {
        let arrRes = [];
        let arrIndex = [];
        let arrRowIndex = [];
        const asc = (order === 'down') ? 1 : 0;

        for (let i = 0; i < this.config.dataTable.length; i++) {
            let rowId = this.config.content.getElementsByClassName("data-row")[i].dataset.rowIndex*1;
            arrIndex.push([rowId, this.config.dataTable[rowId][colIndex]]);
        }
        arrIndex = DataTableUtile.getSort(arrIndex,asc, this.config);

        for (let n = 0; n < arrIndex.length; n++) {
            arrRes.push(this.config.dataTable[arrIndex[n][0]*1]);
            arrRowIndex.push(arrIndex[n][0]*1);
        }

        return {arrRes:arrRes, arrRowIndex:arrRowIndex};
    };

    set _config (obj) { this.config = Object.assign(this.config,obj); }
}

/**
 * ------------------------------------
 * DataTableEvent
 * ------------------------------------
 */
class DataTableEvent
{
    constructor(DataTable) {
        this.DataTable = DataTable;
        this.config    = DataTable.config;
    }

    headerEvent ()
    {
        // Create event onclick for each datatable header column (td)
        [...this.config.dom.header.getElementsByClassName("col-header")].map((col) => {
            col.onclick = () => {
                // If active arrow than 1 or 0
                const activeArrow = col.querySelectorAll('.svg-arrow-item.active').length;
                // Arrow is first svg-arrow-item (desc)
                let arrow = col.querySelectorAll('.svg-arrow-item')[0];
                // If active arrow already set, toggle desc and asc
                if (activeArrow) {
                    arrow = (col.querySelectorAll('.svg-arrow-item')[0].classList.contains('active'))
                        ? col.querySelectorAll('.svg-arrow-item')[1]
                        : col.querySelectorAll('.svg-arrow-item')[0];
                }
                // Sort datatable by column index and sort rule (desc/asc)
                this.DataTable.setSortDataTable(col.dataset.colIndex, arrow);
            };
        });
    }

    contentEvent ()
    {
        // Create event onclick for each datatable row (tr)
        [...this.config.dom.content.getElementsByClassName("data-row")].map((row) => {
            row.onclick = () => {this.DataTable.View.toggleDataRow(row); }
        });
    }

    colToggleEvent (obj)
    {
        const radio = obj.getElementsByTagName("input")[0];
        const status = !!(radio.getAttribute('checked'));

        if (!status) {
            radio.setAttribute('checked','checked');
            this.config.arrToggleList.splice(this.config.arrToggleList.indexOf(obj.dataset.colIndex), 1);
        } else {
            radio.removeAttribute('checked');
            this.config.arrToggleList.push(obj.dataset.colIndex);
        }
        this.DataTable.View.setColumnUpdate(obj.dataset.colIndex, status);
    }

    searchToggleEvent (obj, val, index, column)
    {
        const parent = this.DataTable.View.getClosest('dataTable-col-toggle-wrapper',obj);
        const container = this.DataTable.View.getClosest('dataTable-toolbar',parent);
        parent.getElementsByClassName("column-name")[0].innerHTML = val;

        const strSearchWrapper = container.getElementsByClassName("dataTable-search-wrapper-str")[0];
        const dateSearchWrapper = container.getElementsByClassName("dataTable-search-wrapper-date")[0];

        if (!this.config.arrColType.hasOwnProperty("col_" +index)) {
            this.config.arrColType["col_" +index] = this.DataTable.View.getColumnType(index);
        }

        this.toggleSearchWrapper (strSearchWrapper, dateSearchWrapper, this.config.arrColType["col_" +index]);

        if (this.config.arrColType["col_" +index] === "string") {
            strSearchWrapper.getElementsByClassName("inpt-search")[0].dataset.colIndex = index;
            strSearchWrapper.getElementsByClassName("inpt-search")[0].dataset.colColumn = column;
            strSearchWrapper.getElementsByClassName("inpt-search")[0].value = "";
            strSearchWrapper.getElementsByClassName("inpt-search")[0].focus();
        } else {
            dateSearchWrapper.getElementsByClassName("inpt-date")[0].dataset.colIndex = index;
            dateSearchWrapper.getElementsByClassName("inpt-date")[0].dataset.colColumn = column;
            dateSearchWrapper.getElementsByClassName("inpt-date")[0].value = "";
            dateSearchWrapper.getElementsByClassName("inpt-date")[1].value = "";
            dateSearchWrapper.getElementsByClassName("inpt-date")[0].focus();
        }
    }

    toggleSearchWrapper (strSearchWrapper, dateSearchWrapper, colType = "string")
    {
        if (colType === "string") {
            if (!strSearchWrapper.classList.contains('active')) {
                strSearchWrapper.classList.add('active');
            }
            if (dateSearchWrapper.classList.contains('active')) {
                dateSearchWrapper.classList.remove('active');
            }
        } else {
            if (strSearchWrapper.classList.contains('active')) {
                strSearchWrapper.classList.remove('active');
            }
            if (!dateSearchWrapper.classList.contains('active')) {
                dateSearchWrapper.classList.add('active');
            }
        }
    }
}

/**
 * ------------------------------------
 * DataTableView
 * ------------------------------------
 */
class DataTableView
{
    constructor(DataTable) {
        this.Event  = DataTable.Event;
        this.config = DataTable.config;
    }

    setHeader (arrData)
    {
        const tr = document.createElement("tr");
        const stickyBox = document.createElement("th");
        stickyBox.classList.add('th-sticky');
        // If index is shown insteed of edit/delete button
        // stickyBox.appendChild(document.createTextNode("Nr.:"));
        // If edit/delete button is visible
        stickyBox.innerText = this.config.lang[this.config.tplLang]["action"];
        tr.appendChild(stickyBox);
        this.config.dom.colToggleList.innerHTML = "";
        this.config.dom.colSearchList.innerHTML = "";
        // Map Array or Object entries
        if (arrData.hasOwnProperty('length')) {
            arrData.map((colVal) => {this.setHeaderColumn(tr, colVal)});
        } else {
            for (const [key, value] of Object.entries(arrData)) {this.setHeaderColumn(tr, `${value}`, `${key}`)}
        }
        this.config.dom.header.innerHTML = "";
        this.config.dom.header.appendChild(tr);
        this.config.dataIndex = 0;
    }

    setHeaderColumn (tr, colVal, colKey= "")
    {
        const objVal = (!colKey) ? [colVal,colVal] : [colKey,colVal];
        const listColKey = (!colKey) ? colVal : colKey;
        this.setColumn(tr, objVal, "col-header", colKey);
        this.setColumnToggleList(this.config.dom.colToggleList, colVal, listColKey);
        this.setSearchToggleList(this.config.dom.colSearchList, colVal, listColKey);
        this.config.dataIndex++;
    }

    setContent (val)
    {
        let colIndex = 0;
        let rowIndex = (this.config.dataConfig.stepLen >= this.config.dataConfig.actualLen)
            ? this.config.dataIndex + 1
            : (this.config.dataConfig.actualLen - this.config.dataConfig.rowLen) + (this.config.dataIndex + 1);

        const tr = document.createElement("tr");
        const stickyBox = document.createElement("td");
        const actionTpl = '<span class="action edit">' + this.config.lang[this.config.tplLang]["edit"] + '</span> | <span class="action delete">' + this.config.lang[this.config.tplLang]["delete"] + '</span>'
        //stickyBox.innerHTML = this.config.tpl.rowIndex.replace('{%rowIndex%}', rowIndex);
        stickyBox.innerHTML = this.config.tpl.rowIndex.replace('{%rowIndex%}', actionTpl);
        stickyBox.classList.add('td-sticky');
        tr.className = "data-row";
        tr.setAttribute(tr.className + '-index', (this.config.arrRowIndex.length) ? this.config.arrRowIndex[this.config.dataIndex] : this.config.dataIndex);
        tr.appendChild(stickyBox);
        val.map((colVal) => {  this.setColumn(tr, colVal, "data-col", colIndex++);  });
        this.config.dom.content.appendChild(tr);
        this.config.dataIndex++;
    }

    setColumn (parent, val, css, colIndex = -1)
    {
        const col = (css === 'col-header') ? document.createElement("th") : document.createElement("td");

        if (css === 'col-header') {
            col.innerHTML = this.config.tpl.columnHeader.replace("{%column%}", val[1]);
        } else {
            col.appendChild(document.createTextNode(val));
        }

        if (css) {
            col.className = css;
            if (css === 'col-header') {
                col.setAttribute('data-col-index', this.config.dataIndex);
                col.setAttribute('data-col-column', val[0]);
            }
            if (css === 'data-col') {
                col.setAttribute('data-col-index', colIndex);
                if (this.config.arrToggleList.indexOf(colIndex + "") !== -1) {
                    col.style.display = "none";
                }
            }
        }
        parent.appendChild(col);
    }

    setColumnUpdate (colIndex, hide)
    {
        this.config.dom.content.querySelectorAll('.data-row').forEach( (row) => {
            if (hide) {
                this.config.dom.header.getElementsByClassName("col-header")[colIndex].style.display = "none";
                row.getElementsByClassName("data-col")[colIndex].style.display = "none";
            } else {
                this.config.dom.header.getElementsByClassName("col-header")[colIndex].removeAttribute('style');
                row.getElementsByClassName("data-col")[colIndex].removeAttribute('style');
            }
        });
    }

    setColumnToggleList (parent, val)
    {
        const col = document.createElement("div");
        col.setAttribute('data-col-index', this.config.dataIndex);
        col.className = 'col-toggle-list';
        col.innerHTML = this.config.tpl.columnToggleList.replace("{%column%}", val);
        parent.appendChild(col);
        col.onclick = () => {this.Event.colToggleEvent(col);}
    }

    setSearchToggleList (parent, val, listColKey)
    {
        const col = document.createElement("div");
        const index = this.config.dataIndex;
        //col.setAttribute('data-col-index', index);
        col.setAttribute('data-col-column', listColKey);
        col.className = 'col-toggle-list';
        col.innerHTML = this.config.tpl.searchToggleList.replace("{%column%}", val);
        parent.appendChild(col);
        col.onclick = () => { this.Event.searchToggleEvent(col, val, index, listColKey); };
    }

    setAppTpl ()
    {
        let res = "";
        this.config.tpl.app.map((row) => {res += row;});

        for (let key in this.config.lang[this.config.tplLang]) {
            res = res.replace("{%" + key + "%}", this.config.lang[this.config.tplLang][key]);
        }

        this.config.dom.container.innerHTML = res;
    }

    getColumnType (colIndex)
    {
        let res = {date:0, str:0};

        this.config.dom.content.querySelectorAll('.data-row').forEach( (row) =>
        {
            const colVal = row.getElementsByClassName("data-col")[colIndex].innerHTML.trim();

            if (this.config.regEx["date"].test(colVal) || this.config.regEx["dateTime"].test(colVal)) {
                res.date++;
            } else {
                res.str++;
            }
        });

        return (res.str < 1 && res.date) ? 'date' : "string";
    }

    getClosest (selector, obj)
    {
        if (obj.parentElement.hasAttribute("class") && obj.parentElement.getAttribute("class") === selector) {
            return obj.parentElement;
        } else {
            if (obj.parentElement.nodeName.toLowerCase() !== 'body') {
                return this.getClosest(selector, obj.parentElement)
            } else {
                return null;
            }
        }
    }

    toggleDataRow (obj, reset = false)
    {
        if (!reset) {
            if (obj.classList.contains('active')) {
                let index = 0;
                this.config.arrRowList.map((val) => {
                    if (val === obj.dataset.rowIndex) {
                        this.config.arrRowList.splice(index, 1);
                        return false;
                    }
                    index++;
                });
            } else {
                this.config.arrRowList.push(obj.dataset.rowIndex);
            }
            obj.classList.toggle('active');
        } else {
            if (obj.classList.contains('active')) {
                obj.classList.toggle('active');
            }
        }
    }

    resetOrder ()
    {
        if (this.config.dom.header.querySelector('span.svg-arrow-item.active')) {
            this.config.dom.header.querySelector('span.svg-arrow-item.active').classList.toggle('active');
            this.config.objSortList = {};
        }
    }

    resetActiveSelection ()
    {
        if (this.config.arrRowList.length) {
            this.config.dom.content.querySelectorAll('.data-row').forEach( (row) => { this.toggleDataRow(row, true); });
            this.config.arrRowList = [];
        }
    }
}

/**
 * ------------------------------------
 * DataTableToolBar
 * ------------------------------------
 */
class DataTableToolBar
{
    constructor(DataTable) {
        this.DataTable = DataTable;
        this.config    = DataTable.config;
    }

    setToolbarEvent ()
    {
        // Show default data list button event
        this.config.dom.btnShowList.onclick = () => { this.DataTable.setDataTableCache(true); };
        // Select marked data row button event
        this.config.dom.btnShowSelct.onclick = () => { this.DataTable.setDataTableCache(false); };
        // Reset marked data row button event
        this.config.dom.btnRstSelct.onclick = () => { this.DataTable.View.resetActiveSelection(); };
        // Reset global search button event
        this.config.dom.btnRstGlblSrch.onclick = () => { this.resetGlobalSearch(); };
        // Search button event
        [...this.config.dom.container.getElementsByClassName('btn-search')].map((btn) => {
            btn.onclick = () => {this.setSearch(btn)};
        });
        // Step button event
        this.config.dom.btnNext.onclick = () => {this.setStep(1);};
        this.config.dom.btnBack.onclick = () => {this.setStep(0);};
        this.config.dom.btnStep.onclick = () => {
            let intVal = DataTableUtile.getValidInpt({
                inpt : this.config.dom.inptStep,
                max  : this.config.dataConfig.maxStep,
                default : this.config.dataConfig.dataStep
            });
            if (intVal !== null) {
                this.config.dataConfig.dataStep = intVal;
                this.setStep(intVal, 0);
            }
        };
        // Button entries per page event
        this.config.dom.btnContLen.onclick = () => { this.setEntriesPerPage(); };
        //Dropdowns event
        document.querySelectorAll('.dataTable-col-toggle-wrapper').forEach( (wrapper) => {
            wrapper.onmouseenter = () => { wrapper.getElementsByClassName('dataTable-col-toggle-list')[0].style.display = 'block' };
            wrapper.onmouseleave = () => { wrapper.getElementsByClassName('dataTable-col-toggle-list')[0].style.display = 'none' };
        });
        // Show date form event
        this.config.dom.container.getElementsByClassName('dataTable-search-wrapper-date')[0].onmouseenter = () => { this.config.searchDate.show = true; };
        this.config.dom.container.getElementsByClassName('dataTable-search-wrapper-date')[0].onmouseleave = () => { this.config.searchDate.show = false; };
    }

    setEntriesPerPage () {
        let intVal = DataTableUtile.getValidInpt({
            inpt : this.config.dom.inptContentLength,
            max  : this.config.dataConfig.maxLen,
            default : this.config.dataConfig.stepLen
        });
        if (intVal !== null) {
            this.config.dom.inptStep.value = 1;
            this.config.dataConfig.dataStep = 1;
            this.DataTable.setRequest({stepLen: intVal});
            this.DataTable.setUrlPostParam("stepLen", intVal);
        }
    }

    setSearch (btn)
    {
        const container = btn.parentElement;
        const srchConf = {val:null, type:'', column:''};
        const checkGlobal = container.querySelectorAll('input[name="global-search-text"]')[0];
        // Set searchSpace to list (search in list) or global (search gloobal)
        const searchSpace = (checkGlobal.checked) ? "global" : "list";

        if (container.classList.contains('dataTable-search-wrapper-str')) {
            srchConf.val = container.getElementsByClassName('inpt-search')[0].value.trim();
            srchConf.column = container.getElementsByClassName('inpt-search')[0].dataset.colColumn;;
            srchConf.index = container.getElementsByClassName('inpt-search')[0].dataset.colIndex;
            srchConf.type = 'string';
        } else {
            srchConf.val = container.getElementsByClassName('inpt-date')[0].value.trim();
            srchConf.column = container.getElementsByClassName('inpt-date')[0].dataset.colColumn;
            srchConf.index = container.getElementsByClassName('inpt-date')[0].dataset.colIndex;
            srchConf.type = 'date';

            if (container.getElementsByClassName('inpt-date')[1].value.trim()) {
                srchConf.dateEnd = container.getElementsByClassName('inpt-date')[1].value.trim();
            }
        }

        if (srchConf.val && srchConf.index >= 0) {
            if (searchSpace === "list") { // List Search
                this.DataTable.setSearchDataTable(srchConf);
            } else { // Global Search
                if (this.config.dom.btnRstGlblSrch.classList.contains('hide')) {
                    this.config.dom.btnRstGlblSrch.classList.toggle('hide');
                }
                this.config.urlSearchParam = {...srchConf};
                this.setStep(1, 0);
            }

        } else {
            alert('Kein Suchbegriff gefunden.');
        }
    }

    setStep (next, isOneStep = 1)
    {
        if (!isOneStep
            || next && this.config.dataConfig.dataStep+1 <= this.config.dataConfig.maxStep
            || !next && this.config.dataConfig.dataStep-1 > 0) {
            this.config.dataConfig.dataStep = (next)
                ? ((isOneStep) ? this.config.dataConfig.dataStep+1 : next)
                : this.config.dataConfig.dataStep-1;
            const filter = (!this.config.urlPostParam)
                ? {step : this.config.dataConfig.dataStep}
                : {step : this.config.dataConfig.dataStep, ...this.config.urlPostParam};

            if (isOneStep){
                this.config.dom.inptStep.value = this.config.dataConfig.dataStep;
            }
            this.DataTable.setRequest(filter);
        }
    }

    setToolbarInfo ()
    {
        this.config.dom.contentInfo.innerHTML = (this.config.dataConfig.actualLen <= this.config.dataConfig.maxLen)
            ? this.config.dataConfig.actualLen + " / " + this.config.dataConfig.maxLen
            : this.config.dataConfig.maxLen + " / " + this.config.dataConfig.maxLen;
        this.config.dom.inptContentLength.value = this.config.dataConfig.stepLen;
        this.config.dom.maxStep.innerHTML = this.config.dataConfig.maxStep;
        this.config.dom.inptStep.value = this.config.dataConfig.dataStep;
    }

    resetGlobalSearch ()
    {
        this.config.dom.btnRstGlblSrch.classList.toggle('hide');
        this.config.urlSearchParam = null;
        this.setStep(1, 0);
    }
}

/**
 * ------------------------------------
 * DataTable
 * ------------------------------------
 */
class DataTable
{
    constructor(container, config)
    {
        // Set config
        this.config = DataTableConf.getConf(config);
        this.config.dom.container = container;
        // Init components
        this.Search  = new DataTableSearch();
        this.Event   = new DataTableEvent(this);
        this.View    = new DataTableView(this);
        this.Toolbar = new DataTableToolBar(this);
        // Render app
        this.setApp();
        // Set data request
        this.setRequest();
    }

    setApp ()
    {
        this.View.setAppTpl();

        for (let key in this.config.domId) {
            this.config.dom[key] = this.config.dom.container.getElementsByClassName(this.config.domId[key])[0];
        }

        this.Search._config = {"dateLang": this.config.dateLang};

        GridStage.GridWatcher.registerCallWatcher("changeLang", {inst: this, meth: "setAppLang"});
    }

    setAppLang (lang)
    {
        if (this.config.lang.hasOwnProperty(lang)) {
            this.config.tplLang = lang;
            this.setApp();
            this.setRequest();
        }
    }

    setRequest (postParam = null)
    {
        let formData = (this.config.urlSearchParam !== null) ? {...this.config.urlSearchParam} : {};
        if (postParam !== null) { formData = {...formData, ...postParam}; }
        this.config.dom.wrapper.scrollTop = 0;

        GridAjax.postRequest({
            url: this.config.ajaxUrl,
            formData: GridUi.formPostData(formData),
            component: this,
            response: 'setResponse'
        });
        // const xhttp = new XMLHttpRequest();
        // const _this = this;
        // // Create object with Form parameter
        // // Add Search Param if exists
        // let formData = (this.config.urlSearchParam !== null) ? {...this.config.urlSearchParam} : {};
        // // Add postParam  if not empty
        // if (postParam !== null) { formData = {...formData, ...postParam}; }
        // // Scroll data table view to top
        // this.config.dom.wrapper.scrollTop = 0;
        //
        // // Send ajax request
        // xhttp.open("POST", this.config.ajaxUrl, true);
        // xhttp.send(GridUi.formData(formData));
        // xhttp.onreadystatechange = function() {
        //     if (this.readyState == 4 && this.status == 200) {
        //         const responseData = JSON.parse(this.responseText);
        //         if (responseData.status === "success"){
        //             _this.config.dom.container.style.display = 'block';
        //             _this.setDataTable(responseData.dataTable);
        //         } else {
        //             if (responseData?.dataTable && responseData.dataTable.length < 1) {
        //                 _this.config.dom.container.style.display = 'none';
        //             }
        //         }
        //     }
        // };
    }

    setResponse (data)
    {
        if (data.status === "success"){
            this.config.dom.container.style.display = 'block';
            this.setDataTable(data.dataTable);
        } else {
            if (data?.dataTable && data.dataTable.length < 1) {
                this.config.dom.container.style.display = 'none';
            }
        }
    }

    setDataTable (dataTable)
    {
        const headerLength = (!dataTable.hasOwnProperty('header'))
            ? 0
            : ((dataTable.header.hasOwnProperty('length')) ? dataTable.header.length : Object.keys(dataTable.header).length);
        this.config.dataIndex = 0;

        if (headerLength) {
            this.View.setHeader(dataTable.header);
            this.Event.headerEvent();
            this.Toolbar.setToolbarEvent();
        } else {
            if (this.config.dom.header.querySelectorAll('.svg-arrow-item.active').length) {
                this.config.dom.header.querySelectorAll('.svg-arrow-item.active')[0].setAttribute('class', 'svg-arrow-item');
            }
        }
        this.setDataConfig(dataTable);
        this.setDataTableContent(dataTable.content);
        this.Toolbar.setToolbarInfo();
        this.Search._config = {"dataTable": dataTable.content};
        this.config.dataTableClone = this.config.dom.content.innerHTML;
        this.config.dataTableCache = dataTable.content;
    }

    setDataTableContent (dataTable)
    {
        this.config.dataIndex = 0;
        this.config.dom.content.innerHTML = "";
        dataTable.map((val) => this.View.setContent(val));
        this.Search._config = {content : this.config.dom.content};
        this.Event.contentEvent();
        this.config.modalAction();
    }

    setDataTableCache (reset = false)
    {
        if (reset) {
            this.config.dataTable = this.config.dataTableCache;
            this.Search._config = {"dataTable" : this.config.dataTable};
            this.config.dom.content.innerHTML = this.config.dataTableClone;
            this.View.resetOrder();
            this.Event.contentEvent();
            this.config.modalAction();
        } else {
            if (this.config.arrRowList.length) {
                const dataTable = [];
                this.config.arrRowList.map((val) => { dataTable.push(this.config.dataTable[val*1]); });
                this.config.arrRowList = [];
                this.config.arrRowIndex = [];
                this.View.resetOrder();
                this.setDataTableContent(dataTable);
                this.Search._config = {"dataTable" : dataTable};
                this.config.dataTable = dataTable;
            } else { alert("Keine markierten Daten gefunden.")}
        }
    }

    setSortDataTable (index, obj)
    {
        this.config.objSortList = {};
        this.config.objSortList['sortId_' + index] = obj.dataset.arrowId;
        this.Search._config = {content : this.config.dom.content};
        const dataTable = this.Search.getSort(index, obj.dataset.arrowId);

        this.config.arrRowIndex = dataTable.arrRowIndex;

        if (this.config.dom.header.querySelectorAll('.svg-arrow-item.active').length) {
            this.config.dom.header.querySelectorAll('.svg-arrow-item.active')[0].setAttribute('class', 'svg-arrow-item');
        }
        obj.setAttribute('class', 'svg-arrow-item active');
        this.setDataTableContent(dataTable.arrRes);
    }

    setSearchDataTable (srchConf)
    {
        if (srchConf.val) {

            this.Search._config = {content : this.config.dom.content};
            const dataTable = [];
            const searchRes = this.Search.getSearch(srchConf);

            if (searchRes.length) {
                searchRes.map((val) => { dataTable.push(this.config.dataTable[val*1]); });
                this.config.arrRowList = [];
                this.config.arrRowIndex = [];
                this.View.resetOrder();
                this.setDataTableContent(dataTable);
                this.Search._config = {"dataTable" : dataTable};
                this.config.dataTable = dataTable;
            } else {
                alert("Kein Ergebniss gefunden für: " + srchConf.val);
            }
        }
    }

    setUrlPostParam (key, val)
    {
        if (this.config.urlPostParam === null) {
            this.config.urlPostParam = {};
        }
        this.config.urlPostParam[key] = val;
    }

    setDataConfig (dataTable)
    {
        for (let key in this.config.dataConfig) {
            if (dataTable.hasOwnProperty(key)) { this.config.dataConfig[key] = dataTable[key]; }
        }
        this.config.dataTable = dataTable.content;
        this.config.objSortList = {};
        this.config.arrRowIndex = [];
    }
}
