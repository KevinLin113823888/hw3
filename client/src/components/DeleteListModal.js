import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
function DeleteListModal(){
    const { store } = useContext(GlobalStoreContext);
    //const history = useHistory();

    function handleCancel(event){
        event.stopPropagation();
        store.setExitModal();
        
    }
    function handleConfirm(event){
        event.stopPropagation();
        store.deletePlayListById();
        //store.setExitModal();
       
        togglewhat();
    }
    function togglewhat(){
        //history.push("/");
        console.log("hey");
        store.loadIdNamePairs();
    }

    let deleteModal = <div></div>
    //console.log(store.listToBeDeleted);
    if(store.listToBeDeleted!=""){
        
      deleteModal = <div 
        class="modal is-visible" 
        id="delete-list-modal" 
        data-animation="slideInOutLeft">
            <div class="modal-dialog" id='verify-delete-list-root'>
                <div class="modal-header">
                    Delete playlist?
                </div>
                <div class="modal-header">
                    <div class="modal-center-content">
                        Are you sure you wish to permanently delete the  playlist?
                    </div>
                </div>
                <div class="modal-footer" id = "confirm-cancel-container">
                    <input type="button" 
                        id="delete-list-confirm-button" 
                        class="modal-button" 
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
        deleteModal
    );
}
export default DeleteListModal;