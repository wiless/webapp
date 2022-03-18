console.log("Observable Module.JS loaded..");
import { Runtime, Inspector } from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";

// import { define as plotnotebook } from "https://api.observablehq.com/d/615db00138777bf8.js?v=3";
import define from "https://api.observablehq.com/@wiless/configuration-editors.js?v=3";

window.Inspector = Inspector;

var runtime = new Runtime();
var module = {};
var jobnames = {
    "sls": { view: "viewof slseditor", value: "slsparam", info: "slsInfo" }, "m2101": { view: "viewof m2101editor", value: "m2101", info: "" }
};
function loadJob(jobpage, jobname) {
    // jobpage
    var elm = document.getElementById(jobpage);
    if (elm == undefined) {
        console.log("Unknown jobpage ", jobpage);
        return
    }
    module = runtime.module(define, name => {
        if (name === jobnames[jobname].info) {
            return new Inspector(elm.querySelector("#jobinformation"));
        }

        if (name === jobnames[jobname].view) {
            console.log("Loaded ..name");
            return new Inspector(elm.querySelector("#jobconfiguration"));
        }
        if (name === jobnames[jobname].value) {
            console.log("Working for ", jobname, name);
            return {
                rejected(error) {
                    console.error(`${name}: rejected`, error);
                },
                pending() {
                    console.log(`${name}: pending`);
                },
                fulfilled(val) {
                    console.log("Value is ", val);
                    window.jobparam = val;
                    // var elm = elm.getElementById("sampleview");
                    // elm.removeChild(elm.lastChild);
                    // Inspector.into()().fulfilled(jobparam);

                }

            }
        }
        return ["showEditor"].includes(name);


    });


}


function loadSLSConfigs() {


    // 3GPP_InH_configA.json "https://raw.githubusercontent.com/5gif/ituset/main/configs/3GPP_InH_configB.json"
    // ITU_InH_configA.json
    // SIM_InH_configA.json
    var itufilename = "https://raw.githubusercontent.com/5gif/ituset/main/DECT/ITU_UMa_mMTC_configA.json";
    var nrfilename = "https://raw.githubusercontent.com/5gif/ituset/main/DECT/DECT_UMa_mMTC_configA.json";
    var simfilename = "https://raw.githubusercontent.com/5gif/ituset/main/DECT/SIM_UMa_mMTC_configA.json";
    // terms=x.split("/").splice(-1)[0]

    // var itu = fetch(itufilename).then(d => d.json())
    // var nr = fetch(nrfilename).then(d => d.json())
    // var sim = fetch(simfilename).then(d => d.json());
    var [itu, nr, sim] = Promise.all([fetch(itufilename), fetch(nrfilename), fetch(simfilename)])
    return
}
document.getElementById("loaddefaults").onclick = () => {
    // const el = document.querySelector(".mdl-layout")
    // el.MaterialLayout.toggleDrawer();
    // document.getElementById("jobpage").classList.remove("hidden");
    // console.log("Showing Job page plotapps");
    // loadJob("jobpage", "sls");
    var slsconfig = loadSLSConfigs();
    module.redefine("fileobj", { itu: "sendil", nr: "kavish", sls: "sls" });
}



document.getElementById("submitslsjob").onclick = () => {
    const el = document.querySelector(".mdl-layout")
    el.MaterialLayout.toggleDrawer();
    document.getElementById("jobpage").classList.remove("hidden");
    console.log("Showing Job page plotapps");
    loadJob("jobpage", "sls");
}


// const module = runtime.module(define, name => {
//     console.log("Processing ....... ", name);
//     if (name === "viewof slseditor") {
//         console.log("Loaded ..name");
//         return new Inspector(document.getElementById("jobconfiguration"));
//         // return {
//         //     rejected(error) {
//         //         console.error(`${name}: rejected`, error);
//         //     },
//         //     pending() {
//         //         console.log(`${name}: pending`);
//         //     },
//         //     fulfilled(val) {
//         //         console.log("viewof slseditor ", val);
//         //         // window.cfg_test = val;
//         //         document.getElementById("jobconfiguration").appendChild(val);
//         //         // new Inspector(document.getElementById("jobconfiguration"));
//         //     }

//         // }

//     }
//     if (name === "slseditor") {
//         // console.log(name);
//         return {
//             rejected(error) {
//                 console.error(`${name}: rejected`, error);
//             },
//             pending() {
//                 console.log(`${name}: pending`);
//             },
//             fulfilled(val) {
//                 window.jobparam = val;
//                 var elm = document.getElementById("sampleview");
//                 elm.removeChild(elm.lastChild);
//                 Inspector.into(document.getElementById("sampleview"))().fulfilled(jobparam);

//             }

//         }


//     }



// });
// window.module = module;


// document.getElementById("refresh").onclick = function () {
//     console.log("Clicked");
//     var inspectobj = Inspector.into(document.getElementById("obsfunctions"));
//     // window.globalmodule = runtime.module(notebook);
//     window.globalmodule = runtime.module(plotnotebook, name => {
//         if (name != undefined && name === "interval") {
//             console.log("Notebook Nodes ", name);
//             return {
//                 rejected(error) {
//                     console.error(`${name}: rejected`, error);
//                 },
//                 pending() {
//                     console.log(`${name}: pending`);
//                 },
//                 fulfilled(val) {
//                     console.log("Module Value type ", typeof val);
//                     var obj = {
//                         name: name, type: typeof val, len: val.length
//                     }
//                     if (typeof val === "object") {
//                         window[name] = val;
//                         console.log("Saving to window workspace ", name);
//                     }

//                     inspectobj().fulfilled(obj);
//                 }

//             }
//         }



//     });
// }

// document.getElementById("refresh").onclick = function () {
//     console.log("Clicked");
//     var inspectobj = Inspector.into(document.getElementById("obsfunctions"));
//     // window.globalmodule = runtime.module(notebook);
//     window.globalmodule = runtime.module(notebook, name => {
//         if (name != undefined && name === "interval") {
//             console.log("Notebook Nodes ", name);
//             return {
//                 rejected(error) {
//                     console.error(`${name}: rejected`, error);
//                 },
//                 pending() {
//                     console.log(`${name}: pending`);
//                 },
//                 fulfilled(val) {
//                     console.log("Module Value type ", typeof val);
//                     var obj = {
//                         name: name, type: typeof val, len: val.length
//                     }
//                     if (typeof val === "object") {
//                         window[name] = val;
//                         console.log("Saving to window workspace ", name);
//                     }

//                     inspectobj().fulfilled(obj);
//                 }

//             }
//         }



//     });
// }