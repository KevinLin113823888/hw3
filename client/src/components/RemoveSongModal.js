import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
function RemoveSongModal(){
    const { store } = useContext(GlobalStoreContext);
    //const history = useHistory();

    function handleCancel(event){
        event.stopPropagation();
        store.unsetRemoveSong();
        
    }
    function handleConfirm(event){
        event.stopPropagation();
        console.log(store.songToDelete);
        store.addRemoveSongTransaction(store.songToDelete.title,store.songToDelete.artist,store.songToDelete.youTubeId);
        //store.deletePlayListById();
    }
   

    let removeModal = <div></div>
    //console.log(store.listToBeDeleted);
    if(store.songToBeDeleted!=-1){
        
      removeModal = <div 
        class="modal is-visible" 
        id="remove-song-modal" 
        data-animation="slideInOutLeft">
            <div class="modal-dialog" id='verify-delete-list-root'>
                <div class="modal-header">
                    Remove Song?
                </div>
                <div class="modal-header">
                    <div class="modal-center-content">
                        Are you sure you wish to permanently remove {store.songToDelete.title} from the playlist?
                    </div>
                </div>
                <div class="modal-footer" id = "confirm-cancel-container">
                    <input type="button" 
                        id="remove-song-confirm-button" 
                        class="cancel-modal-button" 
                        onClick={handleConfirm}
                        value='Confirm' />
                    <input type="button" 
                        id="close-modal-button" 
                        class="modal-button" 
                        onClick={handleCancel}
                        value='Cancel' />
                </div>
            </div>
    </div>
    }
    return (
        removeModal
    );
}
export default RemoveSongModal;