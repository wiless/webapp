console.log("Firebase jS loaded");
/* <script type="module"> */
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
import { getAuth, signOut, signInWithPopup, EmailAuthProvider, GoogleAuthProvider, SignInMethod, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, child, get, query, orderByKey, limitToLast, ref, onChildAdded, update, set, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js"
// import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging.js";
import { collection, getFirestore, doc, getDoc, getDocs, query as dbquery, where, limit, orderBy } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
import { getStorage, listAll, ref as sref, getMetadata, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";
import { Inspector } from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";

// Initialize Firebase
var firebaseConfig = await window.loadfbConfig("inside module");
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const gprovider = new GoogleAuthProvider();

const rtdb = getDatabase();
const db = getFirestore();

const storage = getStorage(app, "gs://gcrapps");

// const firestore=
// All module related callback functions

var currentUser;

auth.onAuthStateChanged(user => {
    if (user != null) {
        console.log("onAuthStateChanged()", user);
        currentUser = user;
        user.getIdToken(/* forceRefresh */ false).then(function (idToken) {
            // Send token to your backend via HTTPS
            wiless.id_token = idToken;
        }).catch(function (error) {
            // Handle error
            console.log("Error Getting token ", error);
        });
        displayUserInfo(user);
    }

});
document.getElementById("loadjobs").onclick = () => {
    if (currentUser === undefined) {
        return
    }
    console.log("For user ", currentUser);
    getRecentJobs(currentUser.uid);

}
var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#show-dialog');
if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function () {
    // dialog.show();
    const el = document.querySelector(".mdl-layout")
    el.MaterialLayout.toggleDrawer();

    dialog.querySelector("h4").innerHTML = "Submit SLS Simulation"
    // module.redefine("slsdefault", {name: "sendil", son: "kavish" });

    dialog.showModal();

});
dialog.close();
dialog.querySelector('.accept').addEventListener('click', function () {
    console.log("Accepting ..", window.jobparam);
    submitJob("sls", window.jobparam);
    dialog.close();
});

dialog.querySelector('.close').addEventListener('click', function () {
    dialog.close();
});
function submitJob(jobname, jobparams) {
    wiless.APIcalls("submitjob", jobparams, jobname).then(result => {
        console.log("Job ", jobname, "Result", result);
        watch(result.data, jobname);
    });
}
document.getElementById("runsls").onclick = () => {
    var jobparams = { ...slsinfo[globalcounter] };
    submitJob("sls", jobparams);


};
document.getElementById("runm2101").onclick = () => {
    var jobparams = { imt: editor.get() };
    submitJob("m2101", jobparams);
};
function watch(jobid, appname) {
    console.log("Current user ", currentUser);
    var jobpath = "users/" + currentUser.uid + "/status/" + jobid;
    console.log("Watching Path ", jobpath, jobid);
    const inspector = Inspector.into("#jobstatus"); //(document.querySelector("#jobstatus")).fulfilled(status);
    onValue(ref(rtdb, jobpath), (d) => {
        const status = d.val();
        console.log("Status is ", status);
        document.getElementById("jobstatus").innerHTML = `${appname} :  ${jobid}`;
        inspector().fulfilled(status);
        // new Inspector(document.querySelector("#jobstatus")).fulfilled(status);
        // Notification.requestPermission(function (result) {
        //     if (result === 'granted') {
        //         navigator.serviceWorker.ready.then(function (registration) {
        //             registration.showNotification("DG is " + (status.DG ? "ON" : "OFF"));
        //         });
        //     }
        // });

    });
}

function PlotScatter(data, xfield, yfield, el) {
    var plt = Plot.plot({
        grid: true,
        y: { line: true, clip: true, zero: true },
        x: { line: true, clip: true, zero: true, nice: true },
        marks: [
            Plot.ruleY([0.0], { stroke: "red", strokeDasharray: [5, 5] }),
            Plot.ruleX([0.0], { stroke: "red", strokeDasharray: [5, 5] }),
            Plot.link(
                data,
                { y: "Y", x: "X", x2: "X2", y2: "Y2" }

            )
        ]
    })
    document.getElementById("nwlayout").appendChild(plt);
}
function PlotCDF(data, xfield) {
    var plt = Plot.plot({
        grid: true,
        y: { line: true, clip: true, zero: true },
        x: { line: true, clip: true, zero: true, nice: true },
        marks: [
            Plot.ruleY([0.05, 0.95], { stroke: "red", strokeDasharray: [5, 5] }),
            Plot.lineY(
                data,
                Plot.binX(
                    { y: "proportion", title: "proportion" },
                    { x: xfield, clip: true, cumulative: true }
                )
            )
        ]
    })
    document.getElementById("vis").appendChild(plt);
    var dlurl = setDownloader(plt);

    // var svgData = plt.outerHTML;// $("#figureSvg")[0].outerHTML;
    // var svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8" });
    // var svgUrl = URL.createObjectURL(svgBlob);
    // var downloadLink = document.createElement("a");
    var downloadLink = document.getElementById("visshare");
    downloadLink.href = dlurl;
    // downloadLink.innerText = "Click to download svg";
    downloadLink.download = "DL_CDF.svg";
    // document.getElementById("vis").appendChild(downloadLink);
    // downloadLink.click();
    // document.body.removeChild(downloadLink);

}



function setDownloader(svgobj) {
    //get svg element.
    // var svg = document.getElementById(svgId);

    //get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svgobj);

    //add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    //set url value to a element's href attribute.
    return url;
}

// get the Details of the configuration and CSV files
function getDetails(jobid) {
    ///
    var jobpath = "users/" + currentUser.uid + "/status";
    console.log(jobpath)
    var mycollection = collection(db, "users/ssendilkumar@gmail.com/jobs/");
    const docRef = doc(db, "users/ssendilkumar@gmail.com/jobs/", jobid);
    console.log("mycolleciont", mycollection)
    // const docSnap = await getDoc(docRef);
    // const querySnapshot =
    console.log("Listing documents in collection ", mycollection);
    // const inspect = Inspector.into("#plotbubble");

    getDoc(docRef, jobid).then(snapshot => {
        console.log("existis ", snapshot.exists());
        console.log("snapshot ", snapshot.data());
    }
    );

    var outpath = "SLS/" + currentUser.uid + "/" + jobid;
    console.log("Look for files here ", outpath);
    /// STORAGE
    {
        const fileref = sref(storage, outpath + "/output.json")
        console.log("OUTPUT File ", outpath + "/output.json");
        getDownloadURL(fileref).then(url => {
            console.log("Download 1", fileref.name, " url is ", url);
            d3.json(url).then(obj => {
                new Inspector(document.getElementById("filelist")).fulfilled(obj);
                console.log("Downloading nwlayout ", obj.nwlayout.MediaLink);
                // d3.csv(obj.nwlayout.MediaLink, d3.autoType).then(data => {PlotScatter(data)});
            }
            );
        }).catch((error) => {
            console.log(error.code);
        });
    }
    {
        const fileref = sref(storage, outpath + "/nwlayout.csv")
        getDownloadURL(fileref).then(url => {
            console.log("Download 1", fileref.name, " url is ", url);
            d3.csv(url, d3.autoType).then(obj => {
                new Inspector(document.getElementById("nwlayout")).fulfilled(obj);
                PlotScatter(obj);
            }
            );
        }).catch((error) => {
            console.log(error.code);
        });
    }
    {
        const fileref = sref(storage, outpath + "/slsprofile.csv")
        getDownloadURL(fileref).then(url => {
            console.log("Download 2", fileref.name, " url is ", url);
            d3.csv(url, d3.autoType).then(obj => {
                new Inspector(document.getElementById("vis")).fulfilled(obj);
                PlotCDF(obj, "BestSINR");
            }
            );
        }).catch((error) => {
            // https://firebase.google.com/docs/storage/web/handle-errors
            console.log(error.code);
        });
    }

    return;

    //skipng
    const listRef = sref(storage, "results/c8lqacopv5b9tohrdvi0");
    // Find all the prefixes and items.
    listAll(listRef)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {
                // All the prefixes under listRef.
                // You may call listAll() recursively on them.
                console.log("Folder in Storage ", folderRef);
            });
            res.items.forEach((itemRef) => {
                // All the items under listRef.
                console.log("Document ", itemRef.name, " in Storage ", itemRef);
                if (itemRef.name == "slsprofile.csv") {
                    getMetadata(itemRef).then(metadata =>
                        console.log("Meta Info ", itemRef.fullPath, " is ", metadata.size, metadata.contentType)
                    );
                    getDownloadURL(itemRef).then(url => {
                        console.log("Download", itemRef.name, " url is ", url);
                        d3.csv(url, d3.autoType).then(obj => {
                            new Inspector(document.getElementById("vis")).fulfilled(obj);
                            PlotCDF(obj, "BestSINR");
                        }
                        );
                    }).catch((error) => {
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        console.log(error.code);
                    });
                }
            });



        }).catch((error) => {
            // Uh-oh, an error occurred!
            console.log("Error Fetching list ALl DOCUMENTS in storage");
        });;
}
/**
* @param {string} uid - is the UID of the user
* */
function getRecentJobs(uid) {
    var jobpath = "users/" + uid + "/status";
    console.log("getRecentJobs : ", jobpath);
    document.getElementById("joblist").innerHTML = "";
    var count = 0;
    var badgelem = document.querySelector("span.mdl-badge");
    console.log(badgelem);
    onValue(ref(rtdb, jobpath), (snapshot) => {

        if (snapshot.exists()) {
            const inspect = Inspector.into(document.getElementById("joblist"));
            const jobs = snapshot.val();
            snapshot.forEach((childSnapshot) => {
                count++;
                badgelem.setAttribute("data-badge", count);
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // new Inspector().fulfilled(childKey);
                childData["jobid"] = childKey;
                var divel = document.createElement("label");
                divel.innerText = childKey;
                // mdl - button mdl - js - button mdl - button--raised mdl - js - ripple - effect mdl - button--primary
                divel.classList.add("mdl-button", "mdl-js-button", "mdl-js-ripple-effect");
                if (childData.Completed) {
                    divel.classList.add("mdl-button--primary",);
                    divel.onclick = function () {
                        getDetails(childKey);
                    };
                } else {
                    divel.classList.add("mdl-button--disabled",);
                }
                document.getElementById("joblist").appendChild(divel);
                inspect().fulfilled(childData);


                // ...
            });
            // new Inspector(document.getElementById("joblist")).fulfilled(jobs);
        } else {
            document.getElementById("joblist").innerHTML = "No Jobs Found";
            console.log("No data available");
        }
    }, { onlyOnce: true });
    // .catch((error) => {
    // console.error(error);
    // });

}




document.getElementById("reloadSamples").onclick = function (ev) {
    var startdate = new Date(2021, 0, 20);
    console.log("Hello DB", startdate);
    var mycollection = collection(db, "SARE/logs/" + selectedbot);
    // const docRef = doc(db, "users", "sendil");

    // const docSnap = await getDoc(docRef);
    // const querySnapshot =
    console.log("Listing documents in collection ", mycollection);
    const inspect = Inspector.into("#plotbubble");

    getDocs(query(mycollection, where("Timestamp", ">=", startdate), limitToLast(5))).then(
        querySnapshot => {
            var eventlog = [];
            inspect().fulfilled("Total Entries " + querySnapshot.size);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                var data = doc.data();
                var mydata = ({ ...data, Timestamp: data.Timestamp.toDate(), time: data.Timestamp.toDate().toGMTString() })
                console.log(doc.id, " DATA => ", data);
                console.log(doc.id, " MYDATA => ", mydata);

                // document.getElementById("")
                inspect().fulfilled(mydata);

                // Inspector.into("#plotbubble")(doc.data());
                // document.getElementById("plotbubble").appendChild(plotbubble(dgevents));
            });


        }

    );
    // const docRef = doc(mycollection, "3RCmhxrY4OSUY1tVNctR");
    // console.log("Fetching document ", docRef);

    // getDoc(docRef).then(docSnap => {
    // if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    // } else {
    // // doc.data() will be undefined in this case
    // console.log("No such document!");
    // }

    // });
    // const docRef = doc(collection(db, "SARE"), "logs");
    // // const docSnap = await getDoc(docRef);
    // getDoc(docRef).then(docSnap => {
    // if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    // } else {
    // // doc.data() will be undefined in this case
    // console.log("No such document!");
    // }
    // });
};

document.getElementById("vegaplot").onclick = function (ev) {
    d3.json("/plot2.vega").then(
        vspec => {
            console.log("Found VEGA Spec ", vspec);
            vegaEmbed('#vis', vspec)
        }
    );


};



// document.getElementById("googlesignin").onclick = function () {
//     console.log("Google Signin");

//     signInWithPopup(auth, gprovider).then(result => {
//         const credential = GoogleAuthProvider.credentialFromResult(result);
//         const token = credential.accessToken;
//         // The signed-in user info.
//         const user = result.user;
//         console.log("User is ", user);
//         const userId = auth.currentUser; // .uid
//         console.log("Goolge User - Check token", userId);
//         console.log("Goolge  User ID ", userId.uid);

//         displayUserInfo(user);
//     });

// };


document.getElementById("submit").onclick = function (ev) {
    var email = document.getElementsByName("email")[0].value;
    var psw = document.getElementsByName("psw")[0].value;
    signInWithEmailAndPassword(auth, email, psw)
        .then((userCredential) => {
            // Signed in
            closeForm();
            const user = userCredential.user;
            console.log("Current User ", user);
            // ...
            const userId = auth.currentUser; // .uid
            console.log("User - Check token", userId);
            console.log("User ID ", userId.uid);


            auth.updateCurrentUser(user).then(
                (d) => {
                    console.log("success ");
                    // displayUserInfo(user);
                }
            );
            displayUserInfo(user);
            getRecentJobs()

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error signing in ", error); //errorCode, errorMessage);
            closeForm();
        });

}



function plotDGevents(ev) {

    // const radioButtons = document.querySelectorAll('input[name="options"]');
    // let selectedPath;
    // for (const radioButton of radioButtons) {
    // if (radioButton.checked) {
    // selectedPath = radioButton.value;
    // break;
    // }
    // }
    let path = "/SAREPH3/" + selectedbot;

    console.log("Reload clicked");
    //get(ref(db, basepath+"/log/bootevents/currentversion"))
    get(query(ref(rtdb, path + "/log/dgevents"), orderByKey())).then((snapshot) => {
        // get(ref(db, basepath + "/log/dgevents")).then((snapshot) => {
        if (snapshot.exists()) {
            var data = snapshot.val();
            var dgevents = [];
            const d3parser = d3.timeParse("%s")
            for (const [key, value] of Object.entries(data)) {
                var newvalue = { StartTime: d3parser(value.StartTime), StopTime: d3parser(value.StopTime) }
                dgevents.push(newvalue)
            }
            const formatMonth = d3.timeFormat("%B");
            const formatDay = d3.timeFormat("%a");
            // const epochparser = d3.timeParse("%s");
            // formatMonth(date); // "May"
            // var currentmonth = (new Date()).getMonth() - 1;
            dgevents = dgevents.filter(d => d.StopTime > 0);
            console.log("DGEvents ", dgevents);
            // runtime.redefine("sampledata", dgevents);
            // facet: {
            // data: anscombe,
            // x: "series"
            // },
            var x = document.getElementById("plotbubble");
            x.removeChild(x.lastChild);
            // console.log(x);
            // x.appendChild(theplot);
            document.getElementById("plotbubble").appendChild(plotbubble(dgevents));

            // plotbubble
            var theplot =
                Plot.plot({
                    grid: true,
                    width: "1500", marginBottom: 50,
                    style: { background: `rgba(250, 235, 215, 0.842) ` },
                    y: { nice: true, zero: true, label: "Day of Month", }, ///domain: [0, 31]
                    x: { nice: true, tickRotate: -30 }, ///domain: [0, 31]
                    color: {
                        legend: true,
                    },
                    facet: {
                        data: dgevents,
                        grid: true,
                        x: d => formatMonth((d.StopTime))
                    },
                    marks: [
                        Plot.frame(),
                        Plot.barX(dgevents, {
                            facet: "include",
                            // x1: d => d.StartTime.getHours(),
                            // x2: d => d.StopTime.getHours(),

                            x1: d => d.StartTime,
                            x2: d => d.StopTime,
                            // .getHours()
                            // y1: d => (d.StartTime).getDate() + ".0",
                            y: d => formatDay(d.StartTime),
                            // y: d => (d.StartTime).getDate(),
                            // y1: (d, i) => (d.StartTime).getHours(),
                            // stroke: "black",
                            fillOpacity: 0.5,

                            fill: (d) => formatDay((d.StartTime)),
                            strokeWidth: 1,
                            strokeOpacity: 1,
                            stroke: (d) => formatDay((d.StartTime))
                        }),
                        // Plot.text(dgevents, {
                        // x: (d) => (d.StartTime).getHours(),
                        // y: (d) => (d.StartTime).getDate(),
                        // text: (d) => [6, 0].includes((d.StartTime).getDay()) ? formatDay((d.StartTime)) : ""

                        // })
                    ]
                });
            var x = document.getElementById("plot");
            x.removeChild(x.lastChild);
            x.appendChild(theplot);
        }
    });
}

// document.getElementById("reload").onclick = plotDGevents;








