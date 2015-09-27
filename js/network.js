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

    readActions: function(action) {
        var ref = firebase.child('actions').child('actions').on("child_added", function(childSnapshot, prevChildKey) {
            console.log("Action received: " + childSnapshot.val());
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    },

    registerAction: function(action) {
        var ref = firebase.child('actions');
        ref.child('counter').transaction(function(currentValue) {
            return (currentValue || 0) + 1;
        }, function(error, committed, data) {
            if( error ) {
                setError(error);
            }
            else if( committed ) {
                // if counter update succeeds, then create record
                // probably want a recourse for failures too
                var value = data.val()
                action['time'] = Firebase.ServerValue.TIMESTAMP;
                ref.child('actions').child(value).child(firebase.getAuth().uid).set(action, function(error) {
                    if (error) {
                        alert("Data could not be saved." + error);
                    }
                });
            }
        });
    }
};
