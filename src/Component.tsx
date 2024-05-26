
import React, { useState } from 'react';
import SvgComponent from './SvgComponent';

const api = (window as any).api;

function Component() {
    const [searchStr, setSearchStr] = useState("");
    const [searching, setSearching] = useState(false);
    const [guilds, setGuilds] = useState([]);
    return (
        <>
            <input type="text" onChange={e => setSearchStr(e.target.value)} value={searchStr}></input>
            <button
                onClick={async () => {
                    setGuilds([]);
                    setSearching(true);
                    api.invoke("get-guild-page", searchStr);
                    api.on("guild-found", (event: any, value: any) => {
                        setGuilds(prevGuilds => [...prevGuilds, value])
                    }, true);
                    api.once("guild-search-end", () => setSearching(false));
                }}
            >
                Search
            </button>
            {searching && <button onClick={() => { api.invoke("guild-search-stop") }}>Stop</button>}
            {guilds.map(g => <p>{g}</p>)}
            {searching && <p>Searching...</p>}
            <SvgComponent />
        </>
    );
}

export default Component;
