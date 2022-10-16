import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
function EditSongModal(){
    const { store } = useContext(GlobalStoreContext);
    const [ text1, setText1 ] = useState("");
    const [ text2, setText2 ] = useState("");
    const [ text3, setText3 ] = useState("");
    const [ text4, setText4 ] = useState("");
    const [ text5, setText5 ] = useState("");
    const [ text6, setText6 ] = useState("");
    const [startActive, setStartActive ] = useState(true);
    let editSongModal = <div></div>
    function handleCancel(event){
        //event.stopPropagation();
        store.unsetEditSong();
        setStartActive(true);
        console.log("change");
        console.log(startActive);
    }
    function handleConfirm(){
        //event.stopPropagation();
       
        if(!(text1==text4&&text2==text5&&text3==text6)){
            store.addEditSongTransaction(text1,text2,text3,store.editSongId,text4,text5,text6);
        }
        store.unsetEditSong();
        setStartActive(true);
        console.log("change");
        console.log(startActive);
    }
    console.log(startActive);
    let saveText1 = "";
    /*let starting = true;
    if(store.songToBeEdited!=null){
        starting = false;
    }*/
    //console.log(starting);
    if(store.songToBeEdited!=null){
        saveText1 = store.songToBeEdited.title;
        
    }
    function setUpText(){
        setText1(store.songToBeEdited.title);
        setText2(store.songToBeEdited.artist);
        setText3(store.songToBeEdited.youTubeId);
        setText4(store.songToBeEdited.title);
        setText5(store.songToBeEdited.artist);
        setText6(store.songToBeEdited.youTubeId);
        console.log(startActive);
    }

    function handleUpdateText1(event) {
        setText1(event.target.value );
        console.log("title:");
        console.log(text1);
        
    }

    function handleUpdateText2(event) {
        setText2(event.target.value );
        console.log("art:");
        console.log(text2);
    }


    function handleUpdateText3(event) {
        setText3(event.target.value );
        console.log("yt:");
        console.log(text3);
    }
    
    if(store.songToBeEdited!=null){
        console.log("WHAT");
        if(startActive){
            setUpText();
            setStartActive(!startActive);
        }
        editSongModal = <div 
        class="modal is-visible" 
        id="edit-song-modal" 
        data-animation="slideInOutLeft">
            <div class="modal-dialog" id='edit-list-root'>
                <div class="modal-header">
                    Edit Song
                </div>
                    <div id = "model-center-data2" class="modal-center2">
                        <span class = "modal-header">Title:</span>
                        <span id = "hey">
                            <input id = "title-text" type = "text" name = "ntitle" class = "modal-center-right" onChange={handleUpdateText1} defaultValue={store.songToBeEdited.title}/>
                        </span>
                        <span class = "modal-header">Artist:</span>
                        <span>
                            <input id = "artist-text" type = "text" name = "nartist" class = "modal-center-right" onChange={handleUpdateText2} defaultValue={store.songToBeEdited.artist} />
                        </span>
                        <span class = "modal-header">You Tube Id:</span>
                        <span>
                            <input id = "youtube-text" type = "text" name="nyouTubeId"  class = "modal-center-right" onChange={handleUpdateText3} defaultValue={store.songToBeEdited.youTubeId} />
                        </span>
                    </div>
                <div class="modal-footer" id = "confirm-cancel-container">
                    <input type="button" 
                        id="edit-song-confirm-button" 
                        class="modal-button" 
                        onClick={handleConfirm}
                        value='Confirm' />
                    <input type="button" 
                        id="edit-song-cancel-button" 
                        class="modal-button" 
                        onClick={handleCancel}
                        value='Cancel' />
                </div>
            </div>
        </div>
      }
      return (
          editSongModal
      );
  }
  export default EditSongModal;
