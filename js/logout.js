$(document).ready(function(){
    $("#logout").click(function(){
        localStorage.removeItem("cvconnect_auth_token");
        localStorage.removeItem("cvconnect_username");
        window.location.href = "../index.html";

        return false;
    });
});