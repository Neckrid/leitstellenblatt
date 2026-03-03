/* ============================= */
/* LSPD GLOBAL LAYOUT LOADER     */
/* ============================= */

async function __loadPartial(path){
  const res = await fetch(path, { cache: "no-store" });
  if(!res.ok) throw new Error(`Partial failed: ${path} (${res.status})`);
  return await res.text();
}

window.__layoutReady = (async () => {
  const headerHtml = await __loadPartial("shared/partials/header.html");
  const loginHtml  = await __loadPartial("shared/partials/login.html");

  document.body.insertAdjacentHTML("afterbegin", headerHtml + loginHtml);

  const topHeader = document.getElementById("topHeader");
  const loginOverlay = document.getElementById("loginOverlay");
  const loginErr = document.getElementById("loginErr");
  const globalHeaderTitle = document.getElementById("globalHeaderTitle");
  const globalHeaderSub = document.getElementById("globalHeaderSub");
  const extra = document.getElementById("globalHeaderExtra");
  const presencePill = document.getElementById("presencePill");

  window.UI = {
    showLogin(errMsg=""){
      loginOverlay.style.display = "flex";
      topHeader.style.display = "none";
      loginErr.style.display = errMsg ? "block" : "none";
      loginErr.textContent = errMsg || "";
      setTimeout(()=> document.getElementById("inpLoginName")?.focus(), 50);
    },
    hideLogin(){
      loginOverlay.style.display = "none";
      topHeader.style.display = "flex";
      loginErr.style.display = "none";
      loginErr.textContent = "";
    },
    setHeader(title, sub){
      globalHeaderTitle.textContent = title || "LSPD";
      globalHeaderSub.textContent = sub || "";
    },
    setExtraHTML(html){
      extra.innerHTML = html || "";
    },
    clearExtra(){
      extra.innerHTML = "";
    },
    setPresenceVisible(v){
      presencePill.style.display = v ? "inline-flex" : "none";
    }
  };

  return true;
})();
