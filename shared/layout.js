/* ============================= */
/* LSPD GLOBAL LAYOUT LOADER     */
/* Header + Login via Partials   */
/* ============================= */

async function __loadPartial(path){
  const res = await fetch(path, { cache: "no-store" });
  if(!res.ok) throw new Error(`Partial failed: ${path} (${res.status})`);
  return await res.text();
}

function __byId(id){ return document.getElementById(id); }

function __safeShow(el, display){
  if(!el) return;
  el.style.display = display;
}

function __safeText(el, text){
  if(!el) return;
  el.textContent = text ?? "";
}

function __safeHtml(el, html){
  if(!el) return;
  el.innerHTML = html ?? "";
}

function __focus(id){
  const el = __byId(id);
  if(!el) return;
  setTimeout(()=>{ try{ el.focus(); }catch{} }, 50);
}

/**
 * Injects missing nodes from a html string that contains #topHeader and #loginOverlay
 * without creating duplicates.
 */
function __injectHeaderLoginIfMissing(combinedHtml){
  const hasHeader = !!__byId("topHeader");
  const hasLogin  = !!__byId("loginOverlay");
  if(hasHeader && hasLogin) return;

  const tmp = document.createElement("div");
  tmp.innerHTML = combinedHtml;

  const headerNode = tmp.querySelector("#topHeader");
  const loginNode  = tmp.querySelector("#loginOverlay");

  // Insert header at top if missing
  if(!hasHeader && headerNode){
    document.body.insertAdjacentElement("afterbegin", headerNode);
  }

  // Insert login right AFTER header (so DOM order is consistent)
  if(!hasLogin && loginNode){
    const hdr = __byId("topHeader");
    if(hdr) hdr.insertAdjacentElement("afterend", loginNode);
    else document.body.insertAdjacentElement("afterbegin", loginNode);
  }
}

window.__layoutReady = (async () => {
  // Load partials
  const headerHtml = await __loadPartial("shared/partials/header.html");
  const loginHtml  = await __loadPartial("shared/partials/login.html");

  // Inject missing layout parts (prevents duplicates)
  __injectHeaderLoginIfMissing(headerHtml + loginHtml);

  // Grab elements (from partials or from page if still hardcoded)
  const topHeader    = __byId("topHeader");
  const loginOverlay = __byId("loginOverlay");
  const loginErr     = __byId("loginErr");

  const globalHeaderTitle = __byId("globalHeaderTitle");
  const globalHeaderSub   = __byId("globalHeaderSub");
  const extra             = __byId("globalHeaderExtra");

  const presencePill = __byId("presencePill");
  const connDot      = __byId("connDot");
  const connText     = __byId("connText");

  // Optional: many pages have an #app container that should hide/show with login
  const app = __byId("app");

  // Global UI API used by pages
  window.UI = {
    showLogin(errMsg=""){
      __safeShow(loginOverlay, "flex");
      __safeShow(topHeader, "none");
      if(app) __safeShow(app, "none");

      if(loginErr){
        loginErr.style.display = errMsg ? "block" : "none";
        loginErr.textContent = errMsg || "";
      }

      __focus("inpLoginName");
    },

    hideLogin(){
      __safeShow(loginOverlay, "none");
      __safeShow(topHeader, "flex");
      if(app) __safeShow(app, "grid");

      if(loginErr){
        loginErr.style.display = "none";
        loginErr.textContent = "";
      }
    },

    setHeader(title, sub){
      __safeText(globalHeaderTitle, title || "LSPD");
      __safeText(globalHeaderSub, sub || "");
    },

    setExtraHTML(html){
      __safeHtml(extra, html || "");
    },

    clearExtra(){
      __safeHtml(extra, "");
    },

    setPresenceVisible(v){
      if(!presencePill) return;
      presencePill.style.display = v ? "inline-flex" : "none";
    },

    /**
     * Optional helper: control the pill state globally
     * (uses your #connDot and #connText from header.html)
     */
    setPresenceState({ online=false, text="Leitstelle" } = {}){
      if(connDot){
        connDot.classList.toggle("on", !!online);
        connDot.classList.toggle("off", !online);
      }
      if(connText){
        connText.textContent = text || "Leitstelle";
      }
    }
  };

  return true;
})();
