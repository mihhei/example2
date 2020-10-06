var chatSelector=""
var chatList={};




function startNewChat(){
   var newChat = document.createElement("div");
   var input = document.getElementById("inputLeft").value;
   newChat.addEventListener("click", function (){createNewChat(input);});
   newChat.className="chatMenu";
   newChat.id=input+"Button";
   var inputText = document.createTextNode(input);
   newChat.appendChild(inputText);
   document.getElementById("left").appendChild(newChat);
   document.getElementById("inputLeft").value="";
   chatList[input]=[];
   }


function startConversation(){
   if (chatSelector==""){
   alert("Start with selecting any chat!");
   }else{
      var inputText=document.getElementById("inputRight").value;
      if (inputText!=""){      
         var rightNow=new Date();
         var time =rightNow.toString().split("").splice(16,5);
         var timeString =time[0]+time[1]+time[2]+time[3]+time[4];
         
         document.getElementById("inputRight").value="";
         
         inputDiv(inputText,timeString,chatSelector)
         
         chatList[chatSelector].push(inputText,timeString);
         }
      }   
}


function createNewChat(idTXT){
   if(chatSelector!=""){clearChat(chatSelector);
      document.getElementById(chatSelector+"Button").className="chatMenu";
      }

   var newDivConvers = document.createElement("div");
   var idMeta=Math.random();
   newDivConvers.id=idTXT+"Div";
   newDivConvers.className="MessageDiv";
   document.getElementById("newMessage").appendChild(newDivConvers);
   chatSelector=idTXT;
   writeChat(chatSelector);
   document.getElementById(idTXT+"Button").className="Selected";
}
    
function clearChat (chatSelector){
   document.getElementById("newMessage").removeChild(document.getElementById(chatSelector+"Div"));
}

function writeChat(chatSelector) {
   if (chatList[chatSelector].length!=0){
      for (var i=0; i<chatList[chatSelector].length; i+=2){
      var first=chatList[chatSelector][i];
      var sec=chatList[chatSelector][(i+1)];
      inputDiv(first,sec,chatSelector);
      }
   }
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

   