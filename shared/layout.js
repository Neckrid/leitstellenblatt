/* ============================= */
/* LSPD GLOBAL LAYOUT LOADER    */
/* ============================= */

async function loadPartial(path){
  const res = await fetch(path);
  return await res.text();
}

async function initLayout(){
  const body = document.body;

  const headerHtml = await loadPartial("shared/partials/header.html");
  const loginHtml = await loadPartial("shared/partials/login.html");

  body.insertAdjacentHTML("afterbegin", headerHtml + loginHtml);

  window.UI = {
    showLogin(msg=""){
      const overlay = document.getElementById("loginOverlay");
      const header = document.getElementById("topHeader");
      overlay.style.display = "flex";
      header.style.display = "none";
      const err = document.getElementById("loginErr");
      if(msg){
        err.style.display = "block";
        err.textContent = msg;
      }else{
        err.style.display = "none";
      }
    },

    hideLogin(){
      document.getElementById("loginOverlay").style.display = "none";
      document.getElementById("topHeader").style.display = "flex";
    },

    setHeader(title, sub){
      document.getElementById("globalHeaderTitle").textContent = title;
      document.getElementById("globalHeaderSub").textContent = sub;
    }
  };

  document.addEventListener("click", e=>{
    if(e.target.id === "btnLogout"){
      location.reload();
    }
  });
}

document.addEventListener("DOMContentLoaded", initLayout);
