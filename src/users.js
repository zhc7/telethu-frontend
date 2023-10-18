import {token} from "./auth.js";
import axios from "axios";
import BASE_API_URL from "./constants.js";
import {fakeContacts} from "./testdata/fakechats.js";


const getFriends = async () => {
    return fakeContacts;
}