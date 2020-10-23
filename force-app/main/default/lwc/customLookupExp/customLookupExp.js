import { LightningElement, track } from 'lwc';

export default class CustomLookupExp extends LightningElement {
    @track selectedRecordId = '';
    @track selectedName = '';
    @track singleValue=false;
    @track multipleValue=false;
    @track multipleRecord=[];

    handleValueSelcted(event) {
        this.selectedRecordId = event.detail.selectedId;
        this.selectedName = event.detail.selectedName;
        if(this.selectedRecordId !=null){
            this.singleValue=true;
        }
        
    }
    multipleValueSelected(event){
        this.multipleRecord=event.detail.selectedRecords;
        if(this.multipleRecord.length > 0){
            this.multipleValue=true;
        }
    }
}