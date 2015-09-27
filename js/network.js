var Network = function () {
    this.firebase_ = new Firebase("https://radiant-torch-3804.firebaseio.com");
};

Network.prototype =
{
    connect: function () {
        function authDataCallback(authData) {
            if (!authData) {
                console.log(authData);
                this.firebase_.authWithOAuthRedirect("google", function (error) {
                    console.log("Login Failed!", error);
                });
            }
            else {
                console.log("Authenticated successfully with payload:", authData);
            }
        }

        this.firebase_.onAuth(authDataCallback);
    },

    readActions: function(action) {
        var ref = this.firebase_.child('actions').child('actions').on("child_added", function(childSnapshot, prevChildKey) {
            console.log("Action received: " + childSnapshot.val());
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    },

    registerAction: function(action) {
        var ref = this.firebase_.child('actions');
        var this_obj = this;
        ref.child('counter').transaction(function(currentValue) {
            return (currentValue || 0) + 1;
        }, function(error, committed, data) {
            if( error ) {
                console.error(error);
            }
            else if( committed ) {
                // if counter update succeeds, then create record
                // probably want a recourse for failures too
                var value = data.val()
                action['time'] = Firebase.ServerValue.TIMESTAMP;
                ref.child('actions').child(value).child(this_obj.firebase_.getAuth().uid).set(action, function(error) {
                    if (error) {
                        alert("Data could not be saved." + error);
                    }
                });
            }
        });
    },

    registerCharacter: function() {
        var ref = this.firebase_.child('characters');
        ref.child('counter').transaction(function(currentValue) {
            return (currentValue || 0) + 1;
        }, function(error) {
            if( error ) {
                console.error(error);
            }
        });
    }
};
