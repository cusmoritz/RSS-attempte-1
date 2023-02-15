import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getLinksByUserId } from "../api";
import { deactivateLink } from "../api";
import { createNewLink } from "../api";

const LinkManager = ({links, setLinks}) => {
    const {idSwitch} = useParams();
    // console.log('userId params', idSwitch)

    useEffect(() => {
        const getLinks = async () => {
            const allLinks = await getLinksByUserId(idSwitch)
            setLinks(allLinks)
            // console.log('links in front end', links)
        }
        getLinks();
    }, []);

    const [newURL, setNewUrl] = useState("");
    const [newName, setNewName] = useState("");
    const [createNew, setCreateNew] = useState(false);

    const handleSubmitNewLink = async () => {
        // console.log(`you are adding ${url} to the list of links`);
        const newLink = await createNewLink(newURL, newName, idSwitch);
        setLinks((previousList) => [...previousList, newLink]);
        setNewName("");
        setNewUrl("");
        setCreateNew(!createNew)
        return newLink;
    };

    const handleDelete = async (id) => {
        const linkNoMore = await deactivateLink(id);
        return linkNoMore;
    }

    return (
        <div>
            {createNew
            ? (
                <form  className="container" onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmitNewLink(newURL, newName);
                }}>
                    <label htmlFor='add-rss-link'>Add an RSS link:</label>
                    <input className="add-rss-link" type="text" placeholder="link" value={newURL} onChange={(event) => setNewUrl(event.target.value)}/>
                    <input type="text" placeholder="website name" value={newName} onChange={(event) => setNewName(event.target.value)}/>
                    <button type="submit">Add RSS link</button>
                </form>
            )
            : null}
            {!createNew ? <button onClick={() => setCreateNew(!createNew)}>Add a link</button> : null}

            {!links 
            ? (<p>You don't have any links yet! Why don't you add some?</p>)
            :
            (links.map((eachLink) => {
                return(
                    <div className="link-container"
                    >
                        <h4 className="link-title">{eachLink.link_title}</h4>
                        {eachLink.url}
                        <p>{eachLink.active}</p>
                        <button onClick={() => handleDelete(eachLink.link_id)}>Deactivate</button>
                    </div>
                )
            }))}
        </div>
    )
}

export default LinkManager;