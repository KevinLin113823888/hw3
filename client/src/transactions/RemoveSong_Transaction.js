import jsTPS_Transaction from "../common/jsTPS.js"

export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, otitle,oartist,oyoutubeId) {
        super();
        this.store = initModel;
        this.title = otitle;
        this.artist = oartist;
        this.youtubeId = oyoutubeId;
        
    }

    doTransaction() {
        this.store.removeSong();
    }
    
    undoTransaction() {
        this.store.addRemovedSong(this.title,this.artist,this.youtubeId);
    }
}