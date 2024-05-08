
import { url, setRouter } from "../router/router.js";

const logout = document.getElementById("logout");

logout.onclick = async () => {
 
    const formData = new FormData();

    const response = await fetch(url + "/api/logout", {
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    });
    if (response.ok) {
        localStorage.clear();
        window.location.href = "/index.html";

    } else {
        const json = await response.json();
        console.log(json.errors);
    }
};