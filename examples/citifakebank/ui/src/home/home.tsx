import React from "react";

const Home = () => {
    return (
        <div>
            <h1>CitiFakeBank</h1>
            <div>This is a fake banking webserver designed to illustrate the value of blueprint.</div>
            <h2>About the bank</h2>
            <a href='/about/team'>about/team</a><br/>
            <a href='/about/history'>about/history</a>
            <h2>Your Account</h2>
            <div><a href='/account'>account</a></div>
        </div>
    );
};

export default Home;