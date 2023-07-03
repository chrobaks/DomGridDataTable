/**
 *-------------------------------------------
 * GridComponentDataTable.js
 *-------------------------------------------
 * @version 1.1.0
 * @createAt 17.06.2020 17:30
 * @updatedAt 05.04.2023 14:25
 * @author NetCoDev
 *-------------------------------------------
 **/

class GridComponentDataTable extends GridComponent
{
    constructor (obj, nameSpace, callerInput) 
    { 
        super(obj, nameSpace);

        // Create DataTable instance
        this.dataTable = new DataTable(this.container, {
            ajaxUrl : this.containerUrl,
            requestUrl : GridUi.dataSetValue(this.container, "requestUrl"),
            modalAction : () => {this.setEventToShowModal();},
            domAttr : {colWidth : 250, mnWidth : 70}
        });

        [...this.container.querySelectorAll('input.inpt-date')].map(obj => {
            GridDateTimePicker.setDateObject(obj);
        });

        this.requestTriggerUrl = "";

        GridStage.GridWatcher.setWatcher(this.componentId, {meth: [this.nameSpace, this.componentId, "refreshDataTable"]});

        this.setEvents();
    }

    setEventToShowModal () {
        const callBack = {obj:this, method: "setModalRequest"};
        [...this.container.querySelectorAll('span.action')].map(obj => {
            obj.addEventListener("click", event => {
                event.stopPropagation();
                const tr = GridUi.closest('tr', obj)
                const id = tr.querySelector('[data-col-index="0"]').innerText;
                const action = obj.classList.contains('edit') ? "formEdit" : "formDelete";
                const trigger = obj.classList.contains('edit') ? "add" : "delete";
                const modalTitle = obj.classList.contains('edit') ? "Daten speichern" : "Daten löschen";
                const modalType = obj.classList.contains('edit') ? "" : "prompt";
                const modalView = obj.classList.contains('edit') ? "expand" : "";
                const url = this.dataTable.config.requestUrl + action + "/" + id;
                this.requestTriggerUrl = this.dataTable.config.requestUrl + trigger;
                GridStage.modal.modalTitle(modalTitle);
                GridStage.modal.modalRequest({url : url}, {callBack : callBack}, modalType, modalView);
            });
        });
    }

    setModalRequest (formData)
    {
        try {
            this.setComponentRequest(
                "postRequest",
                {
                    url : this.requestTriggerUrl,
                    formData : GridUi.formPostData(formData),
                    response : "setModalResponse"
                });
        } catch (error) {
            console.error(this.componentId + ".setModalRequest",  error.message);
        }
    }

    setModalResponse (res)
    {
        try {
            this.setComponentAction(['GridAppElement', 'setMessage', res]);
            if (GridUi.requestStatus(res)) {
                this.refreshDataTable();
            }
        } catch (error) {
            console.error(this.componentId + ".setModalResponse",  error.message);
        }
    }

    refreshDataTable (runWatcherOk = true)
    {
        try {
            this.dataTable.setRequest();
            if (runWatcherOk && this.gridWatcher) {
                this.runWatcher();
            }
        } catch (error) {console.error(this.componentId + ".refreshDataTable",  error.message);}
    }
}