
import React, { useEffect, useRef, useState } from 'react';
import SvgComponent from './SvgComponent';

const api = (window as any).api;

function Component() {
    const [searchStr, setSearchStr] = useState("");
    const [searching, setSearching] = useState(false);
    const [guilds, setGuilds] = useState<{ name: string, url: string }[]>([]);
    const [selectedGuild, setSelectedGuild] = useState<{ name: string, url: string } | undefined>();
    const [players, setPlayers] = useState<{ name: string, gp: string, teams?: number }[]>([]);
    const minTeams = useRef<any>();
    const maxTeams = useRef<any>();
    const totalTeams = useRef<any>();

    useEffect(() => {
        setGuilds([]);
        selectedGuild
            && api.invoke("get-players", "https://swgoh.gg" + selectedGuild?.url)
                .then((p: any) => setPlayers(p));
    }, [selectedGuild]);

    return (
        <>
            <input type="text" onChange={e => setSearchStr(e.target.value)} value={searchStr}></input>
            <button
                onClick={async () => {
                    setGuilds([]);
                    setPlayers([]);
                    setSelectedGuild(undefined);
                    setSearching(true);
                    api.invoke("get-guild-page", searchStr);
                    api.on("guild-found", (event: any, value: any) => {
                        try {
                            setGuilds(prevGuilds => [...prevGuilds, JSON.parse(value)]);
                        } catch (e) {
                            console.error(e);
                        }
                    }, true);
                    api.once("guild-search-end", () => setSearching(false));
                }}
            >
                Search
            </button>
            {searching && <button onClick={() => { api.invoke("guild-search-stop"); }}>Stop</button>}
            {!!players.length && (
                <div>
                    <input type="text" ref={minTeams} placeholder="Min teams per player"></input>
                    <input type="text" ref={maxTeams} placeholder="Max teams per player"></input>
                    <input type="text" ref={totalTeams} placeholder="Total teams"></input>
                    <button
                        onClick={async () => {
                            const teams =
                                await api.invoke(
                                    "calculate-teams",
                                    Number(totalTeams.current?.value),
                                    Number(minTeams.current?.value),
                                    Number(maxTeams.current?.value),
                                    players
                                );
                            teams?.length
                                && setPlayers(prevPlayers =>
                                    prevPlayers.map(p => (
                                        {
                                            ...p,
                                            teams: teams.find((t: any) => t.name === p.name)?.teams
                                        }
                                    ))
                                        .sort((a, b) => Number(b.gp) - Number(a.gp))
                                );
                        }}
                    >
                        Calculate teams
                    </button>
                </div>
            )}
            {guilds.map(g => (
                <>
                    <p>
                        {g.name}
                        <button
                            style={{ marginLeft: 30 }}
                            onClick={() => {
                                api.invoke("guild-search-stop");
                                setSelectedGuild(g);
                            }}
                        >
                            Select
                        </button>
                    </p>
                </>
            ))}
            {searching && <p>Searching...</p>}
            {!!players.length
                && players.map(p => (
                    <p>{p.name + " (" + p.gp + ")" + (p.teams ? " = " + p.teams : "")}</p>
                )
            )}
            {/* <SvgComponent /> */}
        </>
    );
}

export default Component;
