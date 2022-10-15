import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import MoveSong_Transaction from '../transactions/MoveSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listToBeDeleted: ""
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToBeDeleted: "",
                    isDragging: false,
                    draggedTo: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToBeDeleted: "",
                    isDragging: false,
                    draggedTo: false
                });
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listToBeDeleted: "",
                    isDragging: false,
                    draggedTo: false
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToBeDeleted: "",
                    isDragging: false,
                    draggedTo: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToBeDeleted: payload,
                    isDragging: false,
                    draggedTo: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToBeDeleted: "",
                    isDragging: false,
                    draggedTo: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listToBeDeleted: "",
                    isDragging: false,
                    draggedTo: false
                });
            }
            case GlobalStoreActionType.SET_EXIT_MODAL: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToBeDeleted: payload,
                    isDragging: false,
                    draggedTo: false
                });
            }
            case GlobalStoreActionType.SET_DRAG_UPDATE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listToBeDeleted: null,
                    isDragging: payload.isDragging,
                    draggedTo: payload.draggedTo

                });
            }
            
            
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
    
            if (response.data.success) {
                let playlist = response.data.playlist;
               
                playlist.name = newName;

                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                

                if (response.data.success) {
                    
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    store.setListToBeDeleted= function (id){
        console.log(id);
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: id
        });
    }
    store.deletePlayListById= function(){
        async function asyncDeleteList() {
            let response = await api.deletePlayListById(store.listToBeDeleted);
            if (response.data.success) {
                store.loadIdNamePairs();
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: ""
                });
            }
            //store.loadIdNamePairs();
        }asyncDeleteList();
        //store.loadIdNamePairs();

    }
    store.addAddSongTransaction = function(id){
        let transaction = new AddSong_Transaction(store,id);
        tps.addTransaction(transaction);
    }
    store.addMoveSongTransaction = function(start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.addSong = function(id){
        async function asyncAddSong(){
            let response = await api.getPlaylistById(id);
            let hexValue3 = "";
            if (response.data.success) {
                let playlist = response.data.playlist;
                if(store.getPlaylistSize()>0){
                let length = playlist.songs[store.getPlaylistSize()-1]._id.length;
                let hexValue = playlist.songs[store.getPlaylistSize()-1]._id.substring(length-4);
                let hexValue2 = playlist.songs[store.getPlaylistSize()-1]._id.substring(0,length-4);
                console.log(hexValue2);
                console.log(playlist.songs[store.getPlaylistSize()-1]._id);
                hexValue = "0x" + hexValue;
                hexValue = parseInt(hexValue, 16);
                hexValue++;
                hexValue = hexValue.toString(16);
                hexValue3 = hexValue2 +"" +hexValue;
                
                }else{
                    let length = playlist._id.length;
                    let hexValue = playlist._id.substring(length-4);
                    let hexValue2 = playlist._id.substring(0,length-4);
                    hexValue = "0x" + hexValue;
                    hexValue = parseInt(hexValue, 16);
                    hexValue++;
                    
                    hexValue = hexValue.toString(16);
                    hexValue3 = hexValue2 + "" + hexValue;
                    console.log(hexValue);
                    console.log(hexValue2);
                    console.log(hexValue3);
                }
                let newsong = {_id: hexValue3, title:"Untitled",artist:"Unknown",youTubeId:"dQw4w9WgXcQ"};
                playlist.songs.push(newsong);
                async function updateList(playlist) {   
                    response = await api.updatePlaylistById(playlist._id, playlist); 
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: playlist
                        });
                    }
                }updateList(playlist);
            }
        }asyncAddSong();
    }
    store.removeNewSong = function(id){
        async function asyncAddSong(){
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.songs.pop();
                async function updateList(playlist) {   
                    response = await api.updatePlaylistById(playlist._id, playlist); 
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: playlist
                        });
                    }
                }updateList(playlist);
            }
        }asyncAddSong();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }
    store.setExitModal = function(){
        storeReducer({
            type: GlobalStoreActionType.SET_EXIT_MODAL,
            payload: ""
        });
    }
    store.createNewList = function(){
        async function asyncCreateNewList(){
            const payload = {name:"Untitled","songs": []};
            let response = await api.createPlaylist(payload);
            if(response.data.success){
                response = await api.getAllPlaylists();
                if (response.data.success) {
                let playlist = response.data.data[response.data.data.length-1];
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });
                store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncCreateNewList();
    }
   
    store.moveSong=function(start,end){
        async function asyncAddSong(){
            let response = await api.getPlaylistById(store.currentList._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                start = parseInt(start);
                end = parseInt(end);
                if (start < end) {
                    let temp = playlist.songs[start];
                    for (let i = start; i < end; i++) {
                        playlist.songs[i] = playlist.songs[i + 1];
                    }
                    playlist.songs[end] = temp;
                }
                else if (start > end) {
                    let temp = playlist.songs[start];
                    for (let i = start; i > end; i--) {
                        playlist.songs[i] = playlist.songs[i - 1];
                    }
                    playlist.songs[end] = temp;
                }
                
                async function updateList(playlist) {   
                    response = await api.updatePlaylistById(playlist._id, playlist); 
                    if (response.data.success) {
                        storeReducer({
                            type: GlobalStoreActionType.SET_CURRENT_LIST,
                            payload: playlist
                        });
                    }
                }updateList(playlist);
            }   
        }asyncAddSong();
    }
    
    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}