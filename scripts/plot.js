console.log("Plot.JS loaded..");
import { Runtime, Inspector } from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/d/615db00138777bf8.js?v=3";
// window.Inspector = Inspector;

var runtime = new Runtime();
document.getElementById("refresh").onclick = function () {
    console.log("Clicked");
    var inspectobj = Inspector.into(document.getElementById("obsfunctions"));
    // window.globalmodule = runtime.module(notebook);
    window.globalmodule = runtime.module(notebook, name => {
        if (name != undefined && name === "interval") {
            console.log("Notebook Nodes ", name);
            return {
                rejected(error) {
                    console.error(`${name}: rejected`, error);
                },
                pending() {
                    console.log(`${name}: pending`);
                },
                fulfilled(val) {
                    console.log("Module Value type ", typeof val);
                    var obj = {
                        name: name, type: typeof val, len: val.length
                    }
                    if (typeof val === "object") {
                        window[name] = val;
                        console.log("Saving to window workspace ", name);
                    }

                    inspectobj().fulfilled(obj);
                }

            }
        }



    });
}