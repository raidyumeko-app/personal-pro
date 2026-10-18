/* Accessible names for legacy controls, keyboard navigation and dialog focus. */
(() => {
  let lastDialog=null;
  const returnFocus=new WeakMap();
  const visible=element=>Boolean(element&&element.getClientRects().length);
  const focusables=dialog=>[...dialog.querySelectorAll('button,input,select,textarea,a[href],summary,[tabindex="0"]')].filter(el=>!el.disabled&&visible(el));
  function enhance(){
    for(const control of document.querySelectorAll('input,textarea,select')){
      if(!control.hasAttribute('aria-label')&&!control.hasAttribute('aria-labelledby')&&!control.labels?.length){const label=control.getAttribute('placeholder');if(label)control.setAttribute('aria-label',label)}
    }
    const dialog=[...document.querySelectorAll('[role="dialog"]')].filter(visible).at(-1)||null;
    if(dialog!==lastDialog){
      const old=lastDialog;lastDialog=dialog;
      if(old&&!old.isConnected){const target=returnFocus.get(old);if(visible(target)){target.focus();return}}
      if(dialog&&!returnFocus.has(dialog)){returnFocus.set(dialog,document.activeElement);const heading=dialog.querySelector('h2,h3,h4');if(heading){heading.tabIndex=-1;heading.focus()}else focusables(dialog)[0]?.focus()}
    }
  }
  document.addEventListener('keydown',event=>{
    const dialog=lastDialog;if(!dialog)return;
    if(event.key==='Escape'){const close=[...dialog.querySelectorAll('button')].find(button=>/^(fechar|cancelar|voltar)/i.test(button.getAttribute('aria-label')||button.textContent.trim()));if(close){event.preventDefault();close.click()}return}
    if(event.key!=='Tab')return;
    const controls=focusables(dialog);if(!controls.length){event.preventDefault();return}
    const first=controls[0],last=controls.at(-1),active=document.activeElement;
    if(event.shiftKey&&(active===first||!controls.includes(active))){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&(active===last||!controls.includes(active))){event.preventDefault();first.focus()}
  });
  new MutationObserver(enhance).observe(document.documentElement,{childList:true,subtree:true});enhance();
})();
