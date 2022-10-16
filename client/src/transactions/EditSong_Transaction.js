import jsTPS_Transaction from "../common/jsTPS.js"

export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, nntitle, nnartist,nnyoutubeId,nnind,ootitle,ooartist,ooyoutubeId) {
        super();
        this.store = initModel;
        this.title = nntitle;
        this.artist = nnartist;
        this.youtubeId = nnyoutubeId;
        this.songIndex = nnind;
        this.oldtitle = ootitle;
        this.oldartist = ooartist;
        this.oldyoutubeId = ooyoutubeId;
    }

    doTransaction() {
        this.store.editCurrentSong(this.title,this.artist,this.youtubeId,this.songIndex);
    }
    
    undoTransaction() {
        this.store.editCurrentSong(this.oldtitle,this.oldartist,this.oldyoutubeId,this.songIndex);
    }
}