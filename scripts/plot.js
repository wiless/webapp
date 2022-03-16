console.log("Observable Module.JS loaded..");
import { Runtime, Inspector } from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";

// import { define as plotnotebook } from "https://api.observablehq.com/d/615db00138777bf8.js?v=3";
import define from "https://api.observablehq.com/@wiless/configuration-editors.js?v=3";

// https://observablehq.com/@wiless/configuration-editors
// window.Inspector = Inspector;

var runtime = new Runtime();
// new Runtime().module(define, name => {
//     if (name === "viewof example") return new Inspector(document.querySelector("#sampleview"));
//     return ["viewof myval"].includes(name);
// });
const module = runtime.module(define, name => {
    // console.log("Processing ....... ", name);
    if (name === "viewof slseditor") {
        console.log(name);
        return new Inspector(document.getElementById("jobconfiguration"));
        // return {
        //     rejected(error) {
        //         console.error(`${name}: rejected`, error);
        //     },
        //     pending() {
        //         console.log(`${name}: pending`);
        //     },
        //     fulfilled(val) {
        //         console.log("viewof slseditor ", val);
        //         // window.cfg_test = val;
        //         document.getElementById("jobconfiguration").appendChild(val);
        //         // new Inspector(document.getElementById("jobconfiguration"));
        //     }

        // }

    }
    if (name === "slseditor") {
        console.log(name);
        return {
            rejected(error) {
                console.error(`${name}: rejected`, error);
            },
            pending() {
                console.log(`${name}: pending`);
            },
            fulfilled(val) {
                console.log("Value of slsparam changed ", val);
                // var jobparam = JSON.parse(val)
                window.jobparam = val;
                var elm = document.getElementById("sampleview");
                elm.removeChild(elm.lastChild);
                Inspector.into(document.getElementById("sampleview"))().fulfilled(jobparam);
                // new Inspector(document.getElementById("sampleview"));
            }

        }

        // new Inspector(document.getElementById("sampleview"));
    }
    // if (name === "showEditor") {
    //     return {
    //         rejected(error) {
    //             console.error(`${name}: rejected`, error);
    //         },
    //         pending() {
    //             console.log(`${name}: pending`);
    //         },
    //         fulfilled(val) {
    //             console.log("Value is ", val);
    //             window.showEditor = val;
    //         }

    //     }

    // }


});
window.module = module;


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