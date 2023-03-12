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

    useEffect(() => {
        const fetchAllLinks = async(idSwitch) => {
            setAllLinks( await getAllLinksByUserId(idSwitch))
        };
        fetchAllLinks(idSwitch);
    }, [])

    const handleSubmitNewLink = async () => {
        // console.log(`you are adding ${url} to the list of links`);
        const newLink = await createNewLink(newURL, newName, idSwitch);
        setLinks((previousList) => [...previousList, newLink]);
        setNewName("");
        setNewUrl("");
        setCreateNew(!createNew)
        alert('Link added!')
        return newLink;
    };

    const handleActivate = async (id) => {
        const reactivating = await reactivateLink(id); 
        getAllLinksByUserId(idSwitch);
        return reactivating;
    }

    const handleDelete = async (id) => {
        const linkNoMore = await deactivateLink(id);
        const rechecking = await getActiveLinksByUserId(idSwitch);
        setLinks(rechecking)
        return linkNoMore;
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
                </form>
            )
            : null}
            {!createNew ? <button onClick={() => setCreateNew(!createNew)}>Add a link</button> : null}

            {(allLinks.length < 1) 
            ? (<p>You don't have any links yet! Why don't you add some?</p>)
            :
            (allLinks.map((eachLink) => {
                console.log('each link', eachLink)
                return(
                    <div className="link-container" key={eachLink.id}>
                        <h4 className="link-title">{eachLink.link_title}</h4>
                        <p>{eachLink.url}</p>
                        {eachLink.active === false 
                        ? 
                        (<button id="activate-button" onClick={() => handleActivate(eachLink.link_id)}>Re-activate</button>) 
                        : 
                        (<button id="deactivate-button" onClick={() => handleDelete(eachLink.link_id)}>Deactivate</button>)}
                    </div>
                )
            }))}
        </div>
    )
}

// UCXjvsikVclbNRGRlzr8jTEg


export default LinkManager;