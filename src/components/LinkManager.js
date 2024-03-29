import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getAllLinksByUserId, getActiveLinksByUserId, createNewLink, deactivateLink, reactivateLink } from "../api";

const LinkManager = ({setLinks}) => {
    const {idSwitch} = useParams();

    const [newURL, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");
    const [createNew, setCreateNew] = useState(false);
    const [allLinks, setAllLinks] = useState([]);
    const [changeTitle, setChangeTitle] = useState("");
    const [changeTitleState, setChangeTitleState] = useState(false);

    const fetchAllLinks = async(idSwitch) => {
        setAllLinks( await getAllLinksByUserId(idSwitch))
    };

    useEffect(() => {
        fetchAllLinks(idSwitch);
    }, [])

    const handleSubmitNewLink = async () => {
        const newLink = await createNewLink(newURL, newName, idSwitch);
        setAllLinks((previousList) => [...previousList, newLink]);
        setNewName("");
        setNewUrl("");
        fetchAllLinks(idSwitch);
        setCreateNew(!createNew)
        alert('Link added!')
        return newLink;
    };

    const handleActivate = async (link_id) => {
        const reactivating = await reactivateLink(link_id, idSwitch); 
        await fetchAllLinks(idSwitch);
        return reactivating;
    }

    const handleDeactivate = async (link_id) => {
        const linkNoMore = await deactivateLink(link_id, idSwitch);
        await fetchAllLinks(idSwitch);
        return linkNoMore;
    }

    const handleTitleChange = async (link_id) => {
        console.log('new name here: ', changeTitle, link_id)

    }

    return (
        <div className="container">
            {createNew
            ? (
                <form  className="container" onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmitNewLink(newURL, newName);
                }}>
                    <label htmlFor='add-rss-link'>Add an RSS link:</label>
                    <input className="add-rss-link" type="text" required placeholder="link" value={newURL} onChange={(event) => setNewUrl(event.target.value)}/>
                    <input type="text" placeholder="website name" required value={newName} onChange={(event) => setNewName(event.target.value)}/>
                    <button type="submit">Add RSS link</button>
                    <button id="deactivate-button" onClick={() => setCreateNew(!createNew)}>Cancel</button>
                </form>
            )
            : null}
            {!createNew ? <button onClick={() => setCreateNew(!createNew)}>Add a link</button> : null}

            {(allLinks.length < 1) 
            ? (<p>You don't have any links yet! Why don't you add some?</p>)
            :
            (allLinks.map((eachLink) => {
                return(
                    <div className="link-container">
                        <h4 className="link-title" key={eachLink.id}>{eachLink.link_title}</h4>
                        <p>{eachLink.url}</p>
                        {eachLink.active === false 
                        ? 
                        (<button id="activate-button" onClick={() => handleActivate(eachLink.link_id)}>Re-activate</button>) 
                        : 
                        (   
                            <div>
                            <button id="deactivate-button" onClick={() => handleDeactivate(eachLink.link_id)}>Deactivate</button>
                            {/* <button onClick={() => setChangeTitleState(!changeTitleState)}>
                                Change title
                            </button>
                            {!changeTitleState ? null : 
                                <form onSubmit={(event) => event.preventDefault()}>
                                    <label htmlFor="changeName">New title:</label>
                                    <input 
                                        id="changeName" 
                                        placeholder="Type new name here" 
                                        value={changeTitle} 
                                        onChange={(event) => setChangeTitle(event.target.value)}/>
                                    <button type="submit" onClick={handleTitleChange(eachLink.id)}>Submit</button>
                                    <button>Cancel</button>
                                </form>
                            } */}
                            </div>
                        )}
                    </div>
                )
            }))}
        </div>
    )
}

// UCXjvsikVclbNRGRlzr8jTEg


export default LinkManager;