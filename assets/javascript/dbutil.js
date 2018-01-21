firebaseConfig = {
    apiKey: "AIzaSyCxL4l6YBouk-C92wcTeZ_sZbzQDcR00hE",
    authDomain: "crammingclique.firebaseapp.com",
    databaseURL: "https://crammingclique.firebaseio.com",
    projectId: "crammingclique",
    storageBucket: "crammingclique.appspot.com",
    messagingSenderId: "321767599885"
};
firebase.initializeApp(firebaseConfig);


// Create a variable to reference the database
var database = firebase.database();

async function getUserDetailsByEmail(email) {
    console.log("I am at 2");

    var usersSnapshot = await database.ref("/crammingUsers").orderByChild("email").equalTo(email).once("value");
    console.log(usersSnapshot.val());
    var users = [];
    if (usersSnapshot.val() === null) {
        console.log("Error!! record not found: ");
        return null;
    } else {
        console.log("user found");
        usersSnapshot.forEach(function(child) {
            console.log(child.val());
            users.push(child.val());
        });
        console.log(users);
        return users;
    }
};

async function updateUserDetailsByEmail(email, userDetails) {
    console.log("I am at 2");

    var usersSnapshot = await database.ref("/crammingUsers").orderByChild("email").equalTo(email).once("value");
    console.log(usersSnapshot.val());

    if (usersSnapshot.val() === null) {
        console.log("Error!! record not found: ");
        return false;
    } else {
        console.log("user found");
        usersSnapshot.forEach(function(child) {
            child.ref.update(userDetails);
        });
        return true;
    }
};

async function insertNewUserDetails(userDetails) {
    console.log("I am at 2");

    await database.ref("/crammingUsers").push(crammingUser);
};

async function insertNewEventDetails(crammingClique) {
    console.log("I am at 2");

    try {
        var newCliqueSnapshot = await database.ref("/crammingClique").push(crammingClique);
        await newCliqueSnapshot.ref.update({
            "id": newCliqueSnapshot.key
        });
        return true;
    } catch (e) {
        return false;
    }
};

async function getAllCliques() {
    console.log("I am at 2");

    var cliqueSnapshot = await database.ref("/crammingClique").orderByChild("date").once("value");
    console.log(cliqueSnapshot.val());
    var cliques = [];
    if (cliqueSnapshot.val() === null) {
        console.log("Error!! record not found: ");
        return null;
    } else {
        console.log("cliques found");
        cliqueSnapshot.forEach(function(clique) {
            console.log(clique.val());
            cliques.push(clique.val());
        });
        console.log(cliques);
        return cliques;
    }
};

async function registerCliques(cliqueId, user) {
    console.log("I am at 2");

    var cliqueSnapshot = await database.ref("/crammingClique").orderByChild("id").equalTo(cliqueId).once("value");
    console.log(cliqueSnapshot.val());

    if (cliqueSnapshot.val() === null) {
        console.log("Error!! record not found: ");
        return false;
    } else {
        console.log("user found");
        cliqueSnapshot.forEach(function(child) {
            child.ref.child("attendees").push({
                "attendee": user
            });
            console.log("updated attendees");
        });
        return true;
    }
};


async function deregisterCliques(cliqueId, user) {
    console.log("In function deregisterCliques " + user);
    var clique;
    var cliqueKey;
    var attendeeKey;
    var cliqueSnapshots = await database.ref("/crammingClique").orderByChild("id").equalTo(cliqueId).once("value");
    
    if (cliqueSnapshots.val() === null) {
        console.log("Error: Clique not found");
        return false;
    } else {
        console.log("Cliques found");
        cliqueSnapshots.forEach( function(element) {
            cliqueKey = element.key;
            clique = element.val();
        });
        console.log(cliqueKey);
        console.log(clique);

    }

    console.log(clique.attendees);

    Object.keys(clique.attendees).map(function(key) {
        if (clique.attendees[key].attendee === user) {
            attendeeKey = key;
        }
    });

    if (attendeeKey !== null) {
        await database.ref("/crammingClique/" + cliqueKey + "/attendees/" + attendeeKey).remove();
        console.log("Attendee removed");
        return true
    } else {
        console.log("Attendee not found");
        return false;
    }

};