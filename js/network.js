var firebase = new Firebase("https://radiant-torch-3804.firebaseio.com");

var Network = function (firebase) {};

Network.prototype =
{
    connect: function () {

        if (!firebase.getAuth()) {
            //firebase.authWithOAuthRedirect("google", function (error) {
            firebase.authWithOAuthPopup("google", function (error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:");
                }
            });
        } else{
            console.log("Authenticated.");
        }
    },
};
