var chatSelector=""
var chatList=[];
var nameList={};

function startNewChat(){
   var input = document.getElementById("inputLeft").value.trim();
         if (!nameList[input]){
            var newChat = document.createElement("div");
            newChat.addEventListener("click", function (){createNewChat(input);});
            newChat.addEventListener("contextmenu", (e)=>{e.preventDefault();
                                                        showContextMenu(input,e,show=true);});
            newChat.className="chatMenu";
            newChat.id=input+"Button";
            var inputText = document.createTextNode(input);
            newChat.appendChild(inputText);
            document.getElementById("chatList").appendChild(newChat);
            document.getElementById("inputLeft").value="";
            putDB (input,"");
            nameList[input]=true;
            }
         else{
            alert("Chat with same name is already exist!");
            document.getElementById("inputLeft").value="";
            }
}

function startConversation(){
   if (!chatSelector){
   alert("Start with selecting any chat!");
   }else{
      var inputText=document.getElementById("inputRight").value.trim();
      if (inputText){      
         var rightNow=new Date();
         var time =rightNow.toString().split("").splice(16,5);
         var timeString =time[0]+time[1]+time[2]+time[3]+time[4];
         
         document.getElementById("inputRight").value="";
         inputDiv(inputText,timeString,chatSelector)
         chatList.push({messageText:inputText,messageTime:timeString});
         putDB(chatSelector,chatList);
         }
      }   
}

function createNewChat(idTXT){
   if(chatSelector){
      clearChat(chatSelector);
      document.getElementById(chatSelector+"Button").className="chatMenu";
      }
   var newDivConvers = document.createElement("div");
   newDivConvers.id=idTXT+"Div";
   newDivConvers.className="MessageDiv";
   document.getElementById("newMessage").appendChild(newDivConvers);
   chatSelector=idTXT;
   writeChat(chatSelector);
   document.getElementById(idTXT+"Button").className="Selected";
}
    
function clearChat (chatSelector){
    if (document.getElementById(chatSelector+"Div")){
   document.getElementById("newMessage").removeChild(document.getElementById(chatSelector+"Div"));
   chatList=[];}
}

function inputDiv (a,b,chatSelector){
   var newDiv = document.createElement("div");
   newDiv.className="Message";
   var idMeta=Math.random();
   newDiv.id=a+idMeta;
   var input = document.createTextNode(a);
   newDiv.appendChild(input);
   document.getElementById(chatSelector+"Div").appendChild(newDiv);
       
   var newDate = document.createElement("div");
   newDate.className="dateClass"
   var dateInput=document.createTextNode(b);
   newDate.appendChild(dateInput);       
   document.getElementById(a+idMeta).appendChild(newDate);
}

function showContextMenu (input,e,show) {
    
    document.getElementById("custom_menu_div").removeChild(document.querySelector(".custom_menu"));

    var CustomMenu = document.createElement("div");
    CustomMenu.className = "custom_menu";
    CustomMenu.id = "custom_menu"+input;
    var deleteItem = document.createElement("div");
    deleteItem.className = "cm_item";
    deleteItem.id = "cm_item"+input;
    deleteItem.addEventListener("click", ()=>{var sure = confirm ("You wanna delete chat "+input.toUpperCase()+"!!!\n \nAre you sure?");
                                            if (sure){deleteChat(input);}});
    var deleteItemText = document.createTextNode("DELETE CHAT");
    deleteItem.appendChild(deleteItemText);
    CustomMenu.appendChild(deleteItem);
    document.getElementById("custom_menu_div").appendChild(CustomMenu);

    const cm = document.getElementById("custom_menu"+input);
    cm.style.top = e.y+"px";
    cm.style.left = e.x+"px";
    cm.style.display = show ? "block" : "none";
    
    
}

window.addEventListener("click", (e) => {
    showContextMenu(input="",e,show=false);});

function deleteChat (input){
    document.getElementById("chatList").removeChild(document.getElementById(input+"Button"));
    clearChat (input);
    chatSelector="";
    deleteDB (input);
    nameList[input] = false;
}




window.indexedDB = window.indexedDB || window.webkitIndexedDB ||
window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
window.IDBTransaction = window.webkitIDBTransaction;
window.IDBKeyRange = window.webkitIDBKeyRange;
}

function putDB(chatName,chatMessage){
   let request = window.indexedDB.open("Chat",1),
       db,
       tx,
       store;
   request.onupgradeneeded = function (e) {
       let db = request.result,
           store = db.createObjectStore ("chatSelector", {keyPath:"chat"})
   }
   request.onerror = function (e) {
       alert ("There was an error: " + e.target.errorCode);
   }

   request.onsuccess = function (e) {
       db = request.result;
       tx= db.transaction("chatSelector", "readwrite");
       store = tx.objectStore("chatSelector");

       db.onerror = function (e){
           alert ("error"+e.target.errorCode);
       }
       store.put ({chat : chatName, message: chatMessage});
       tx.oncomplete = function () {
       db.close();
       }
   }
}
function deleteDB(chatName){
    let request = window.indexedDB.open("Chat",1),
        db,
        tx,
        store;
    request.onupgradeneeded = function (e) {
        let db = request.result,
            store = db.createObjectStore ("chatSelector", {keyPath:"chat"})
    }
    request.onerror = function (e) {
        alert ("There was an error: " + e.target.errorCode);
    }
 
    request.onsuccess = function (e) {
        db = request.result;
        tx= db.transaction("chatSelector", "readwrite");
        store = tx.objectStore("chatSelector");
 
        db.onerror = function (e){
            alert ("error"+e.target.errorCode);
        }
        store.delete (chatName);
        tx.oncomplete = function () {
        db.close();
        }
    }
 }

function writeChat(chatSelector){
   let request = window.indexedDB.open("Chat",1),
       db,
       tx,
       store;
   request.onupgradeneeded = function (e) {
       let db = request.result,
           store = db.createObjectStore ("chatSelector", {keyPath:"chat"});
   }
   request.onerror = function (e) {
       alert ("There was an error: " + e.target.errorCode);
   }
   request.onsuccess = function (e) {
       db = request.result;
       tx= db.transaction("chatSelector", "readwrite");
       store = tx.objectStore("chatSelector");
       db.onerror = function (e){
           alert ("error"+e.target.errorCode);
       }
       let q1 = store.get(chatSelector);
       q1.onsuccess = function(){ 
          x= q1.result.message;
         if (x.length!=0){
            for (var i=0; i<x.length; i++){
                var first = x[i].messageText;
                var sec = x[i].messageTime;
            inputDiv(first,sec,chatSelector);
            chatList.push({messageText:first,messageTime:sec});
                }    
            }
       tx.oncomplete = function () {
           db.close();
            }
        }
    }
}
 
function init (){
   let request = window.indexedDB.open("Chat",1),
       db,
       tx,
       store;
   request.onupgradeneeded = function (e) {
       let db = request.result,
           store = db.createObjectStore ("chatSelector", {keyPath:"chat"});
   }
   request.onerror = function (e) {
       alert ("There was an error: " + e.target.errorCode);
   }
   request.onsuccess = function (e) {
       db = request.result;
       tx= db.transaction("chatSelector", "readwrite");
       store = tx.objectStore("chatSelector");

       var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);

      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(!!result == false)
          return;
        renderChat(result.value.chat);
        result.continue();
      };
      cursorRequest.onerror = function (e) {
         alert ("There was an error: " + e.target.errorCode);
    };
}
}

function renderChat(chatName){
      var newChat = document.createElement("div");
      newChat.addEventListener("click", function (){createNewChat(chatName);});
      newChat.addEventListener("contextmenu", (e)=>{e.preventDefault();
        showContextMenu(chatName,e,show=true);});
      newChat.className="chatMenu";
      newChat.id=chatName+"Button";
      var inputText = document.createTextNode(chatName);
      newChat.appendChild(inputText);
      document.getElementById("chatList").appendChild(newChat);
      nameList[chatName]=true;
}

window.addEventListener("DOMContentLoaded", init, false);