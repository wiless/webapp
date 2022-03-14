console.log("App jS loaded");

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
            // itueditor = new JSONEditor(document.getElementById('ituspec'), { mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, d);
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
            // nreditor = new JSONEditor(document.getElementById('nrspec'), { mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, d);

            //createJSONCard("nr",d);
        });
    fetch(simfilename).then(d => d.json()).then(
        obj => {

            loadspec("sim", obj, "github:SIM_UMa_mMTC_configA.json");
            // new Inspector(document.querySelector("#sim")).fulfilled(d);
            // slsinfo[globalcounter].sim = d;
            // if (document.getElementById("simspec").firstElementChild)
            //     document.getElementById("simspec").firstElementChild.remove();
            // simeditor = new JSONEditor(document.getElementById('simspec'), { mode: 'code', modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], maxVisibleChilds: 25 }, d);
            //createJSONCard("sim",d);
        });
}


