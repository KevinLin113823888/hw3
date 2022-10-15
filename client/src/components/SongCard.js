import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ isDragging, setIsDragging ] = useState(false);
    const [ draggedTo, setDraggedTo ] = useState(false);

    function handleDragStart(event){
        //event.preventDefault();
        event.dataTransfer.setData("song", event.target.id);
        //console.log("HEY THERE");
        //let newDragging = !isDragging;
        //setIsDragging(newDragging);
        setIsDragging(true);
        //console.log(isDragging);
        //store.setDragStart();
    }

    function handleDragOver(event) {
        event.preventDefault();
        setDraggedTo(true);
        console.log("SUP BRO");
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }
    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }
    function handleDrop(event) {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1,targetId.indexOf("c")-1);
        console.log(targetId);
        if(targetId!==""){

            let sourceId = event.dataTransfer.getData("song");
            sourceId = sourceId.substring(sourceId.indexOf("-") + 1,sourceId.indexOf("c")-1);
            console.log(sourceId);
            if(targetId!==sourceId){
                //perform a move
                store.addMoveSongTransaction(sourceId,targetId);
            }
        }
        setIsDragging(false);
        setDraggedTo(false);
    }
    const { song, index } = props;
    //let cardClass = "list-card unselected-list-card";
        let itemClass = "playlister-song list-card unselected-list-card";
        if (draggedTo) {
            itemClass = "playlister-song-dragged-to list-card unselected-list-card";
        }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={itemClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;