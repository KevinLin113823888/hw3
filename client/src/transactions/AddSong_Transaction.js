import jsTPS_Transaction from "../common/jsTPS.js"

export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initModel,idd){
        super();
        this.store = initModel;
        this.id = idd;
    }
    doTransaction() {
        this.store.addSong(this.id);
    }
    
    undoTransaction() {
        this.store.removeNewSong(this.id);
    }
}