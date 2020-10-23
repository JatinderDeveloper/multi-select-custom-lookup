import { api, LightningElement, track, wire } from 'lwc';
import findRecords from '@salesforce/apex/LookupController.findRecords';
export default class Customlookup extends LightningElement {
    searchKey = '';
    @api objectApiName;
    @track records = [];
    @track selectedName = '';
    @track selectedRecords = [];
    @track selectedId = '';
    @track listVisible;clear
    
    @api iconName = '';
    @api multiSelect = '';
    //boolean 
    @track showSearchIcon = true;
    @track inputReadOnly = false;
    @track mulitpleSelection;
    processing=false;

    //css
    @track boxclass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';


    searchKeyword(event) {
        this.searchKey = event.target.value;
        this.selectedName = event.target.value;
        console.log('Search item' + this.searchKey);
        this.processing=true;
        this.getLookupResult();
        
    }
    clickListItem(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        this.selectedName = selectedName;
        this.boxclass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        let selectedRecords = this.selectedRecords;
       
        if (this.multiSelect == 'Yes') {
            this.showSearchIcon = true;
            this.inputReadOnly = false;
            this.mulitpleSelection = true;
            this.selectedName = '';
            let duplicateValue = false;
            console.log('length--' + selectedRecords.length);
            for (let i = 0; i < selectedRecords.length; i++) {
                if (selectedId === selectedRecords[i].RecordId) {
                    duplicateValue = true;
                    break;
                } else {
                    duplicateValue = false;
                }
            }
            if (!duplicateValue) {
                let newsObject = {
                    'Id': this.selectedRecords[this.selectedRecords.length - 1] ? this.selectedRecords[this.selectedRecords.length - 1].Id + 1 : 0,
                    'Name': selectedName,
                    'RecordId': selectedId
                };
                this.selectedRecords.push(newsObject);
            }
            console.log(JSON.stringify(this.selectedRecords));
            const selectedEvent = new CustomEvent('multiplevalueselected', {
                detail: {
                    selectedRecords
                }
            });
            this.dispatchEvent(selectedEvent);


        } else {
            this.showSearchIcon = false;
            this.inputReadOnly = true;
            this.mulitpleSelection = false;

            const selectedEvent = new CustomEvent('valueselected', {
                detail: {
                    selectedId: event.currentTarget.dataset.id,
                    selectedName: event.currentTarget.dataset.name
                }
            });
            this.dispatchEvent(selectedEvent);
        }


    }

    getLookupResult() {
        findRecords({ searchKey: this.searchKey, objectName: this.objectApiName })
            .then((result) => {
                console.log(result);
                this.records = result;
                this.boxclass = result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                console.log(JSON.stringify(this.records));
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => this.processing=false);
    }

    getFocusout(event) {
        setTimeout(() => {
            this.searchKey = '';
            this.records = [];
            this.processing=false;

        }, 300);

    }

    resetData() {
        this.selectedName = '';
        this.inputReadOnly = false;
        this.showSearchIcon = true;
        const selectedEvent = new CustomEvent('valueselected', {
            detail: {
                selectedId: '',
                selectedName: ''
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    removeRecord(event) {
        let selectedDataId = event.target.name;
        let selectedRecords = this.selectedRecords;
        let selectedRecordsIndex;
        console.log('selectedDataId---' + selectedDataId);
        for (let i = 0; i < selectedRecords.length; i++) {
            if (selectedDataId === selectedRecords[i].Id) {
                selectedRecordsIndex = i;
            }
        }
        selectedRecords.splice(selectedRecordsIndex, 1);
    }
}