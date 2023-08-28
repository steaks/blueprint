import React from "react";
import {HangOrBang, Match, useAllMatches, usePotentialMatches, useGetPotentialMatches} from "../apps/hangOrBang";

const Foo = () => (
  <HangOrBang>
    <HangOrBangUI />
  </HangOrBang>
);

const HangOrBangUI = () => {
  // const [addMatch] = useAddMatch();
  const [allMatches, setAllMatches] = useAllMatches();
  const [potentialMatches, setPotentialMatches] = usePotentialMatches();
  const [, triggerGetPotentialMatches] = useGetPotentialMatches();

  if (!potentialMatches || !allMatches) {
    return <></>;
  }

  const PotentialMatchUI = ({match}: {readonly match: Match}) => {
    const removePotentialMatch = (match: Match) => {
      const newPMatches = potentialMatches.filter(m => m.id !== match.id);
      setPotentialMatches(newPMatches);
    };

    const addMatch = (match: Match, hang: boolean, bang: boolean) => {
      const newMatches = [...allMatches, {...match, hang, bang}];
      removePotentialMatch(match);
      setAllMatches(newMatches);
    };

    return (
      <div>
        <div>Name: {match.name}</div>
        <div>Age: {match.age}</div>
        <button onClick={() => addMatch(match, true, false)}>Hang</button>
        <button onClick={() => addMatch(match, false, true)}>Bang</button>
        <button onClick={() => addMatch(match, true, true)}>Hang AND Bang!</button>
        <button onClick={() => removePotentialMatch(match)}>No hang no bang :(</button>
      </div>
    );
  };

  const MatchUI = ({match}: {readonly match: Match}) => {
    const removeMatch = (match: Match) => {
      const newMatches = allMatches.filter(m => m.id !== match.id);
      setAllMatches(newMatches);
    };

    return (
      <div>
        <div>Name: {match.name}</div>
        <div>Age: {match.age}</div>
        <button onClick={() => removeMatch(match)}>Remove</button>
      </div>
    );
  };

  const hangs = allMatches.filter(m => m.hang && !m.bang);
  const bangs = allMatches.filter(m => !m.hang && m.bang);
  const hangAndBangs = allMatches.filter(m => m.hang && m.bang);

  return (
    <div>
      <h2>Your Matches</h2>
      <h3>Hangs</h3>
      <div>
        {hangs.map(m => <MatchUI match={m} />)}
      </div>
      <h3>Bangs</h3>
      <div>
        {bangs.map(m => <MatchUI match={m} />)}
      </div>
      <h3>Hang and Bangs</h3>
      <div>
        {hangAndBangs.map(m => <MatchUI match={m} />)}
      </div>
      <br />
      <h2>Potential Matches</h2>
      <div>
        {potentialMatches.map(m => <PotentialMatchUI match={m} />)}
      </div>
      <br />
      {potentialMatches.length === 0 && <button onClick={() => triggerGetPotentialMatches()}>See More Matches</button>}
    </div>
  );
};

export default Foo;