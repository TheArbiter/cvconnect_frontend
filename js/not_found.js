function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function(){
    
    var cvconnect_auth_token = localStorage.cvconnect_auth_token;
    
    if (cvconnect_auth_token != null){
        $("#homelink").click(function(){
            window.location.href = "profile.html";
        });
    
        $("#sign-up").click(function(){
            window.location.href = "profile.html";
        });
        
        $("#cvconnect-banner").click(function(){
            window.location.href = "profile.html";
        });
        
        $("#return-home").click(function(){
            window.location.href = "profile.html";
        });
    } else {
        $("#homelink").click(function(){
            window.location.href = "../home.html";
        });
        
        $("#sign-up").click(function(){
            window.location.href = "register.html";
        });
        
        $("#cvconnect-banner").click(function(){
            window.location.href = "../home.html";
        });
        
        $("#return-home").click(function(){
            window.location.href = "../home.html";
        });
    }
    return false;
    
    
});
