import express from "express";
import {User} from "../../shared/src/apps/userProfile";
const app = express();

const db = {
    email: "",
    firstName: "",
    lastName: ""
};

const queryUser = (): Promise<User> =>
    Promise.resolve({email: db.email, firstName: db.firstName, lastName: db.lastName});

const updateUser = (email: string, firstName: string, lastName: string): Promise<string> => {
    db.email = email;
    db.firstName = firstName;
    db.lastName = lastName;
    return Promise.resolve("Saved to db!");
};

const userName = (email: string, firstName: string, lastName: string): Promise<string> => {
    return Promise.resolve(`${email}_${firstName}_${lastName}`);
};


app.get("/user", async (req, res) => {
    const user = await queryUser();
    res.json(user);
});

app.post("/user", async (req, res) => {
    await updateUser(req);
    const user = await queryUser();
    res.json(user);
});

app.get("/userName", async (req, res) => {
    const userNam = await userName(req.body.email, req.body.firstName, req.body.lastName)
    res.json(userNam);
});