import React from "react";
import {HangOrBang, Match, useAllMatches, usePotentialMatches, useMyHook} from "../apps/hangOrBang";

const HangOrBangUI = () => {
  // const [addMatch] = useAddMatch();
  const [allMatches, setAllMatches] = useAllMatches();
  const [potentialMatches, setPotentialMatches] = usePotentialMatches();
  const [myHook] = useMyHook();

  const MatchUI = ({match}: {readonly match: Match}) => {
    return (
      <div>
        <div>Name: {match.name}</div>
        <div>Age: {match.age}</div>
      </div>
    );
  };

  const PotentialMatchUI = ({match, matches}: {readonly match: Match, readonly matches: Match[]}) => {
    // const newMatches = [...matches, {...match, type: "hang"}];
    // console.log("new matches: ", newMatches);
    const addMatch = (match: Match, type: string) => {
      const newMatches = [...matches, {...match, type: "hang"}];
      console.log("IN NEW MATCHES: ", newMatches);
      setAllMatches(newMatches);
    };

    return (
      <div>
        <div>Name: {match.name}</div>
        <div>Age: {match.age}</div>
        <button onClick={() => addMatch(match, "hang")}>Add</button>
      </div>
    );
  };

  console.log("ALL MATCHES: ", allMatches);
  return (
    <HangOrBang>
      <h2>Your Matches</h2>
      <div>
        {allMatches ? allMatches.map(m => <MatchUI match={m} />) : <></>}
      </div>
      <br />
      <h2>Potential Matches</h2>
      <div>
        {potentialMatches && allMatches ? potentialMatches.map(m => <PotentialMatchUI match={m} matches={allMatches} />) : <></>}
      </div>
      {/*<div>*/}
      {/*  <button onClick={fireMyEvent}>Fire My Event (FYI no one is listening)</button>*/}
      {/*</div>*/}
      <br />
      {/*<div>*/}
        {/*<input defaultValue={myState} onChange={e => setMyState(e.currentTarget.value)}/>*/}
      {/*</div>*/}
      <br />
      {/*<div>My Hook Value: {myHook}</div>*/}
    </HangOrBang>
  );
};

export default HangOrBangUI;