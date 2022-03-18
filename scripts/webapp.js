console.log("App jS loaded");
var selectedbot = "";

function selectBot(params) {

    if (params == "local") {
        wiless.APIhost = "http://localhost:8080"
        document.getElementById("servicehost").innerText = "cloud_off";
    }

    if (params == "gae") {
        wiless.APIhost = "https://wilessapi.appspot.com/"
        document.getElementById("servicehost").innerText = "cloud_sync";
    }

    selectedbot = params;
}

function switchImage() {
    document.querySelector("img").toggleAttribute("portrait");
    if (document.querySelector("img").getAttribute("portrait") != null) {
        document.querySelector("img").src = "/static/mark2.png"


    } else {
        document.querySelector("img").src = "/static/mark1.png"
    }

}


function displayUserInfo(user) {
    console.log("displayUserInfo() : ", user);
    if (user.photoURL != null) {
        document.querySelector("profile-pic").src = user.photoURL;
    }


    if (user.displayName != null) {
        document.getElementById("username").innerText = user.displayName;
    } else {
        document.getElementById("username").innerText = user.email;
    }

    document.querySelector("#username + div[data-mdl-for='username']").innerHTML = `${user.metadata.lastSignInTime} </br> <i>By  ${user.providerData[0].providerId} </i> </br >
    ${user.uid} `
    user.getIdTokenResult().then(
        d => {
            // for (const [k, v] of Object.entries(d.claims)) { console.log(k, v) }
            var key = "slsuser"
            var enabled = d.claims[key];
            if (enabled != undefined) {
                console.log(key, enabled);
            }

        }
    );

}

function openForm() {
    console.log("Opening login form");
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

// document.getElementById('inputfile')
//     .addEventListener('change', function (e) {

//         var fr = new FileReader();
//         var fname = this.files[0].name;
//         document.getElementById("filename").innerText = fname; // this.files[0].name;


//         fr.onload = function () {
//             el = document.getElementById('output');
//             // el.removeChild(el.lastChild);
//             // el.textContent=fr.result; 

//             try {
//                 json = JSON.parse(fr.result);
//                 if (!el.firstElementChild) {
//                     editor = new JSONEditor(el, { mode: 'view', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, json);
//                 } else {
//                     editor.set(jsob)

//                 }
//             } catch (e) {
//                 document.getElementById("filename").innerText = fname + " Not JSON parsable";
//             }


//             // const editor = new JSONEditor(el, {mode: 'view', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, json);

//         }
//         fr.readAsText(this.files[0]);
//     });





window.onload = function () {

    console.log("window.location.href", window.location.href);
    if (window.location.href.startsWith("http://localhost")) {

        selectBot("local");
    } else {
        selectBot("gae");
    }
};
// });




function loadspec(specname, obj, fname) {

    if (slsinfo[globalcounter] == undefined) {
        slsinfo[globalcounter] = { itu: {}, nr: {}, sim: {} };
    }



    slsinfo[globalcounter][specname] = obj;

    //  new Inspector(document.getElementById(specname)).fulfilled(obj);
    var elem = specname + "spec";
    if (document.getElementById(elem).firstElementChild)
        document.getElementById(elem).firstElementChild.remove();
    switch (specname) {
        case "itu":
            document.querySelector("#itu-file ~ span").innerText = fname
            itueditor = new JSONEditor(document.getElementById(elem), { mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, obj);
            break;
        case "nr":
            document.querySelector("#nr-file ~ span").innerText = fname
            nreditor = new JSONEditor(document.getElementById(elem), { mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, obj);
            break;

        case "sim":
            document.querySelector("#sim-file ~ span").innerText = fname
            simeditor = new JSONEditor(document.getElementById(elem), { mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, obj);
            break;

        default:
            break;
    }

}


function loadSLSConfigs() {
    globalcounter++;
    console.log("Loading defaults");
    slsinfo[globalcounter] = { itu: {}, nr: {}, sim: {} };
    // 3GPP_InH_configA.json "https://raw.githubusercontent.com/5gif/ituset/main/configs/3GPP_InH_configB.json"
    // ITU_InH_configA.json
    // SIM_InH_configA.json
    var itufilename = "https://raw.githubusercontent.com/5gif/ituset/main/DECT/ITU_UMa_mMTC_configA.json";
    var nrfilename = "https://raw.githubusercontent.com/5gif/ituset/main/DECT/DECT_UMa_mMTC_configA.json";
    var simfilename = "https://raw.githubusercontent.com/5gif/ituset/main/DECT/SIM_UMa_mMTC_configA.json";
    // terms=x.split("/").splice(-1)[0]
    fetch(itufilename).then(d => d.json()).then(
        obj => {
            // console.log(d);
            loadspec("itu", obj, "github:ITU_UMa_mMTC_configA.json");
            // new Inspector(document.querySelector("#itu")).fulfilled(d)
            // slsinfo[globalcounter].itu = d;
            // if (document.getElementById("ituspec").firstElementChild)
            //     document.getElementById("ituspec").firstElementChild.remove();
            // itueditor = new JSONEditor(document.getElementById('ituspec'), {mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, d);
            // console.log("itu editor", itueditor);
            //createJSONCard("itu",d);
        });
    fetch(nrfilename).then(d => d.json()).then(
        obj => {
            //console.log(d); 
            loadspec("nr", obj, "github:DECT_UMa_mMTC_configA.json");
            // slsinfo[globalcounter].nr = d;
            // // new Inspector(document.querySelector("#nr")).fulfilled(d);
            // if (document.getElementById("nrspec").firstElementChild)
            //     document.getElementById("nrspec").firstElementChild.remove();
            // nreditor = new JSONEditor(document.getElementById('nrspec'), {mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, d);

            //createJSONCard("nr",d);
        });
    fetch(simfilename).then(d => d.json()).then(
        obj => {

            loadspec("sim", obj, "github:SIM_UMa_mMTC_configA.json");
            // new Inspector(document.querySelector("#sim")).fulfilled(d);
            // slsinfo[globalcounter].sim = d;
            // if (document.getElementById("simspec").firstElementChild)
            //     document.getElementById("simspec").firstElementChild.remove();
            // simeditor = new JSONEditor(document.getElementById('simspec'), {mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, d);
            //createJSONCard("sim",d);
        });
}


