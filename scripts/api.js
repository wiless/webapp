// "use strict";

let wiless = new API();

function API() {
  let _magicword = "sendil";
  let headers;
  let id_token;
  let funcpaths = new Map();

  (function () {

    funcpaths.set("new", { path: "/new", method: "get" })
      .set("system", { path: "/system", method: "get" })
      .set("login", { path: "/login", method: "post" })
      .set("logout", { path: "/logout", method: "get" })
      .set("hexgrid", { path: "/geom/hexgrid", method: "get" })
      .set("gcr", { path: "/gcr", method: "get" })
      .set("sls", { path: "/gcr/sls", method: "post" })
      .set("submitjob", { path: "/submitjobv2", method: "post" })
      .set("google", { path: "/auth/google", method: "post" });

    headers = { 'Authorization': "Bearer " + id_token };
    console.log("Wiless API : " + " Instance Created..");
  })();

  this.APIhost = "http://localhost:8080";
  this.Ping = () => {
    // console.log("Ping");
    return "ping";
  }

  this.Hello = (name) => {
    // console.log("Hello ", name);
    return "Hello " + name + " " + _magicword;
  }

  this.Logout = () => {
    this.id_token = "";
    this.APIcalls("logout");
  }
  this.Token = () => {
    return this.id_token;
  }

  this.APIcalls = function (arg, jdata, appname) {
    if (arg == "logout") {
      id_token = "";
      this.id_token = "";
      headers = { 'Authorization': "Bearer " + id_token };
    }
    var val = funcpaths.get(arg);

    if (arg == "login") {
      return this.CallAPI(val.path, val.method, jdata).then(d => { headers = { 'Authorization': "Bearer " + d.token }; this.id_token = d.token; return d.token });
    }

    if (val == undefined) {
      console.error("Unknown api ", arg);
      return;
    }


    return this.CallAPI(val.path, val.method, jdata, appname);


  }

  this.LoginViaGoogle = function (gtoken) {
    var val = funcpaths.get("google");
    var jdata = { "token": gtoken };
    return this.CallAPI(val.path, val.method, jdata).then(d => { headers = { 'Authorization': "Bearer " + d.token }; this.id_token = d.token; return d.token });
  }

  this.CallAPI = function (path, method, data, appname) {
    if (method == undefined) {
      method = "GET"
    }
    const url = new URL(this.APIhost);
    url.pathname = path;
    if (appname != undefined) {
      url.searchParams.append("appname", appname);
    }

    console.log("URL object : ", url);
    console.log("CallAPI href: ", url.href);
    // for (const [k, v] of Object.entries(argobj)) { url.searchParams.append(k, v); }

    var headers = {};
    if (wiless.Token() != undefined) {
      headers = { 'Authorization': "Bearer " + wiless.Token() };
      // console.log("Header is  ", headers);
      // console.log("Bearer Token is ", wiless.Token());
    } else {
      console.log("No AUTH token found !");
    }


    // headers = {};
    return fetch(url, {
      method: method,
      credentials: "include",
      headers: headers,
      body: JSON.stringify(data)
    }).then(function (resp) {
      console.log("fetch : status", resp.status);
      return resp.json();
    }).then(function (rdata) {
      console.log(method, ":", path, '=>', rdata);
      return rdata;
    }).catch(error => {
      throw (error);
    });
  }

}

(function () {

  var el = document.getElementById("btnsignin");

  if (el != null) {
    if (el.nodeName == "BUTTON") {
      el.hidden = false;
    }
  }

  var el2 = document.getElementById("btnsignout");
  if (el2 != null) {
    console.log("Hiding buttons", el, el2);
    if (el2.nodeName == "BUTTON") {
      el2.hidden = true;
    }
  }

  console.log("Wiless API Library Initialized");
})()


// Google API 
var userprofile;
var googleauth;

function signIn() {
  //{prompt:"select_account"}

  var scopes = "https://www.googleapis.com/auth/devstorage.read_only profile email";
  console.log("Trying to log with more scope", scopes);
  var gauth = gapi.auth2.getAuthInstance();
  gauth.signIn({ scope: scopes }).then(guser => onSignIn(guser));

}

function initgapi() {

  console.log("Loaded Google Platform Library");
  gapi.load('auth2', function () {
    /* Ready. Make a call to gapi.auth2.init or some other API */
    var SCOPES = "https://www.googleapis.com/auth/devstorage.read_only profile email";
    var param = { client_id: '565126014426-fis7623ann950k0i711upje0o5kt3qhp.apps.googleusercontent.com', scope: SCOPES };
    googleauth = gapi.auth2.init(param);
    //   google.auth.https://www.googleapis.com/auth/cloud-platform
    googleauth.then(
      d => {

        console.log("Google Auth is ready")
        //signIn();
      }, e => console.log("Error ", e)
    );

  });
}

function initBackend(token) {

  // Do things if user is logged in.. on client side..
  wiless.id_token = token;
  wiless.headers = { 'Authorization': "Bearer " + token };

}

function setProfilePic(elid) {

  var el = document.getElementById(elid);
  if (el != null) {
    if (el.nodeName == "IMG") {
      el.setAttribute("src", userprofile.getImageUrl());
    }
  }
}

function getSubscriptionToken() {
  return subsriptiontoken;
}
var subsriptiontoken;
function RegisterSubscription() {


  if ('serviceWorker' in navigator) {
    console.log("Registering for subscription");

    navigator.serviceWorker.register('/service.js').then(registration => {
      ///  Find if pushManager found.. 
      registration.pushManager.getSubscription().then(function (subs) {
        if (!subs) {
          console.log("No subscription found");
          console.log("Creating new subscription...");

          const opts = { userVisibleOnly: true, applicationServerKey: "BD2HbjsgFOqfDxRYffjEw0xBNQYObUkQ32YkPAoa0a-Pr_9nTMNa55mTQToqQ_l3zZS-GGRarxMjDcK5IMOkAGo" };
          registration.pushManager.subscribe(opts)
            .then(newsub => {
              subsriptiontoken = newsub;
              console.log("Received ", JSON.stringify(newsub));
              return subsriptiontoken;
            });

        } else {
          subsriptiontoken = subs;
          console.log("Found old subscriptions JSON", subsriptiontoken.toJSON());
          return subsriptiontoken;
        }
        ///
      });

    })


  }
  console.log("Service Worker not supported");
  return subsriptiontoken
}


function UnSubscribe() {
  console.log("Unscribing from FCM");

}

function onSignIn(googleUser) {


  el = document.getElementById("btnsignin");
  if (el != null) {
    if (el.nodeName == "BUTTON") {
      el.hidden = true;
    }
  }

  var el = document.getElementById("btnsignout");
  if (el != null) {
    if (el.nodeName == "BUTTON") {
      el.hidden = false;
    }
  }

  userprofile = googleUser.getBasicProfile();
  console.log('Logged in as ' + userprofile.getEmail()); // This is null if the 'email' scope is not present.
  setProfilePic("profile");
  var token = googleUser.getAuthResponse().id_token;
  var subscription = RegisterSubscription();
  initBackend(token); // Update new initBackend with subscription info as second parameter

  // var opts = { "token": gtoken };
  //       wiless.LoginViaGoogle(gtoken).then(
  //         console.log("Google Signed In")
  //       );
  //       wiless.APIcalls("gcr"); 
  //     TestSLSservice("/);

}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();

  UnSubscribe(); // Unsubscribe user-specific notifications from backend
  auth2.signOut().then(function () {

    var el = document.getElementById("btnsignin");
    if (el != null) {
      if (el.nodeName == "BUTTON") {
        el.hidden = false;
      }
    }

    var el = document.getElementById("btnsignout");
    if (el != null) {
      if (el.nodeName == "BUTTON") {
        el.hidden = true;
      }
    }



    //             document.getElementById("googlebtn").hidden = false;
    //             document.getElementById("signout").hidden = true;
    wiless.Logout();
    //             fetch("/logout").then().then();
    console.log('User signed out.');
  });


  //wiless.APIcalls("logout").then(console.log("Logged out Wiless API"));
}

const bc = new BroadcastChannel("counterupdates")
bc.onmessage = (event) => {
  console.log("Broadcast Message received : type=", event.type, "event.data = ", event.data);
  updateBadge(event.data.count);
  appendLog(event.data);
}

function updateBadge(count) {
  var badge = document.getElementById("badge")
  badge.childNodes[1].nodeValue = count;
  //   badge.innerText=count;
  //   document.getElementById("badge").childNodes[1].nodeValue++
  //   var logbox=document.getElementById("logbox");
  //   if (logbox)
  //     logbox.innerText+=JSON.stringify(event.data);     
}
