import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getAllLinksByUserId, getActiveLinksByUserId, createNewLink, deactivateLink, reactivateLink } from "../api";

const LinkManager = ({setLinks}) => {
    const {idSwitch} = useParams();
    console.log('id switch', idSwitch)

    const [newURL, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");
    const [createNew, setCreateNew] = useState(false);
    const [allLinks, setAllLinks] = useState([]);

    const fetchAllLinks = async(idSwitch) => {
        setAllLinks( await getAllLinksByUserId(idSwitch))
    };

    useEffect(() => {
        console.log('in use efect?');
        fetchAllLinks(idSwitch);
    }, [])

    console.log('all links LinkManager', allLinks)
    const handleSubmitNewLink = async () => {
        const newLink = await createNewLink(newURL, newName, idSwitch);
        setLinks((previousList) => [...previousList, newLink]);
        setNewName("");
        setNewUrl("");
        setCreateNew(!createNew)
        alert('Link added!')
        return newLink;
    };

    const handleActivate = async (link_id) => {
        const reactivating = await reactivateLink(link_id, idSwitch); 
        const rechecking = await fetchAllLinks(idSwitch);
        setLinks(rechecking);
        return reactivating;
    }

    const handleDeactivate = async (link_id) => {
        const linkNoMore = await deactivateLink(link_id, idSwitch);
        const rechecking = await fetchAllLinks(idSwitch);
        // setLinks(rechecking)
        // return linkNoMore;

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
                    <div className="link-container" key={eachLink.id}>
                        <h4 className="link-title">{eachLink.link_title}</h4>
                        <p>{eachLink.url}</p>
                        {eachLink.active === false 
                        ? 
                        (<button id="activate-button" onClick={() => handleActivate(eachLink.link_id)}>Re-activate</button>) 
                        : 
                        (<button id="deactivate-button" onClick={() => handleDeactivate(eachLink.link_id)}>Deactivate</button>)}
                    </div>
                )
            }))}
        </div>
    )
}

// UCXjvsikVclbNRGRlzr8jTEg


export default LinkManager;