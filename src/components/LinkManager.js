import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { getLinksByUserId } from "../api";

const LinkManager = () => {
    const {idSwitch} = useParams();
    console.log('userId params', idSwitch)

    const [links, setLinks] = useState([]);

    useEffect(() => {
        const getLinks = async () => {
            const allLinks = await getLinksByUserId(idSwitch)
            setLinks(allLinks)
        }

        getLinks();
    }, [])

    return (
        <div>
            {!links 
            ? (<p>You don't have any links yet! Why don't you create some?</p>)
            :
            (links.map((eachLink) => {
                <div>
                    <p>There are links</p>
                </div>
            }))}
        </div>
    )
}

export default LinkManager;