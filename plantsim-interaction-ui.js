/* Interaction policy: inline help, contextual editors, persistent drafts, guarded loss. */
const IX=window.PlantSimInteraction;
let ixEditor=null,ixStack=[],ixAnalysis=null,ixTrigger=null,ixUndo=null,ixFilter=null,ixSubmitted=false;
const ixMemory=new Map(),ixBaseModal=modal,ixBaseClose=close;
const ixMainDrafts=new Map();
let ixLastPageKey='';
function ixPageKey(){return [P.id,U.page,U.version,U.path].join('/');}
function ixMainValues(){const values=ixValues($('#app'));for(const key of Object.keys(values))if(!/^(goal|task-|environment-json|decision|adopt|chatInput)/.test(key))delete values[key];return values;}
function ixAlert(message){let host=$('#ix-page-alert');if(!host){host=document.createElement('div');host.id='ix-page-alert';host.className='ix-alert';host.setAttribute('role','alert');$('#app').prepend(host);}host.textContent=message;}
function ixFields(root){return [...root.querySelectorAll('input,textarea,select')].filter(e=>e.type!=='file'&&e.type!=='password'&&e.type!=='hidden'&&!e.disabled);}
function ixValues(root){return Object.fromEntries(ixFields(root).filter(e=>e.name||e.id).map(e=>[e.name||e.id,e.type==='checkbox'?e.checked:e.value]));}
function ixRestore(root,values){for(const e of ixFields(root)){const k=e.name||e.id;if(Object.hasOwn(values,k)){if(e.type==='checkbox')e.checked=values[k];else e.value=values[k];}}}
function ixDraftId(title,root){const form=root.querySelector('form');return form?.dataset.material?IX.draftKey(enterpriseState().project,'purchase',form.dataset.material):form?.dataset.work?IX.draftKey(enterpriseState().project,'review',form.dataset.work):IX.draftKey(P.id,title,U.version+'/'+U.path);}
function ixSaveEditor(){if(!ixEditor)return true;const d=$('#overlay'),values=ixValues(d);ixMemory.set(ixEditor.key,values);try{IX.put(localStorage,ixEditor.key,values);ixEditor.failed=false;const h=$('#ix-draft-status');if(h)h.textContent='未提交内容已自动暂存到此浏览器';return true;}catch(e){ixEditor.failed=true;const h=$('#ix-draft-status');if(h){h.setAttribute('role','alert');h.textContent='暂存失败：内容仍在当前窗口。请导出备份或继续编辑，不要刷新。';}return false;}}
function interactionSubmitted(){if(!ixEditor)return;try{IX.remove(localStorage,ixEditor.key);}catch(e){ixAlert('记录已保存，但旧草稿清理失败。重新打开时请核对，避免重复登记。');}ixMemory.delete(ixEditor.key);ixSubmitted=true;}
function ixFocusReturn(){const e=ixTrigger;if(e?.isConnected)e.focus();else{const h=$('#app h1');if(h){h.tabIndex=-1;h.focus();}}}
function ixClose(force=false){if(repairTimer)return;if(ixEditor&&!ixSubmitted&&!force&&!ixSaveEditor()){ixLeavePrompt();return;}ixEditor=null;ixSubmitted=false;ixStack=[];ixBaseClose();ixFocusReturn();}
close=function(){ixClose();};
function ixLeavePrompt(){const root=$('#overlay .modal-body');if(!root||$('#ix-leave-warning'))return;root.insertAdjacentHTML('afterbegin',`<section id="ix-leave-warning" class="ix-alert" role="alert"><p>未保存内容无法暂存。放弃将丢失本次填写。</p>${btn('继续编辑','ix-continue')}${btn('导出填写备份','ix-export')}${btn('放弃本次填写','ix-force-close')}</section>`);$('#ix-leave-warning button')?.focus();}
function ixPurchaseFeedback(){const f=$('#ops-purchase-form');if(!f)return;let box=$('#ix-purchase-summary');if(!box){box=document.createElement('aside');box.id='ix-purchase-summary';box.className='ix-info';box.setAttribute('aria-live','polite');f.querySelector('.ops-form-error').before(box);}const inv=ES.inventory(f.dataset.material,enterpriseState().project),qty=+f.elements.quantity.value,q=ES.quotes.find(q=>q.materialId===f.dataset.material&&q.supplierId===f.elements.supplier.value),valid=Number.isInteger(qty)&&qty>0;box.classList.toggle('ix-late',f.elements.date.value>inv.deadline);box.innerHTML=`<b>计划测算（未下单）</b><p>原缺口 ${inv.gapByDeadline} 株 · 计划 ${valid?qty:'—'} 株 · 计划尚未覆盖 ${valid?Math.max(0,inv.gapByDeadline-qty):'—'} 株</p><p>估算货款 ${valid&&q?'¥'+(qty*q.price).toLocaleString():'—'} · 不含运费</p><p>${f.elements.date.value>inv.deadline?'⚠ 计划到货晚于进场期限，无法按期覆盖缺口。':'交期是计划目标，尚未获得供应商确认。'}</p>`;}
function ixSetupEditor(title){const d=$('#overlay');if(!ixFields(d).length)return;const key=ixDraftId(title,d);ixEditor={key,title,initial:ixValues(d),failed:false};ixSubmitted=false;let saved=ixMemory.get(key);try{saved=saved||IX.read(localStorage)[key]?.values;}catch(e){ixEditor.failed=true;}if(saved)ixRestore(d,saved);d.querySelector('.modal-body').insertAdjacentHTML('afterbegin',`<p id="ix-draft-status" class="ix-info" role="status">${saved?'已恢复未提交草稿。':'填写时自动暂存，暂存不代表提交。'}</p>`);if(ixEditor.failed)$('#ix-draft-status').textContent='读取草稿失败；未覆盖原数据，请先备份。';d.querySelector('.modal-actions').insertAdjacentHTML('afterbegin',btn('放弃未提交草稿','ix-discard'));d.querySelectorAll('[data-act=close]').forEach(b=>{if(b.textContent!=='×')b.textContent='暂存并关闭';});if($('#ops-purchase-form button[type=submit]'))$('#ops-purchase-form button[type=submit]').textContent='保存本地采购草稿';ixPurchaseFeedback();}
function ixShowAnalysis(title,body,actions){ixAnalysis={title,body,actions,returnPage:U.page};if($('#overlay').open)ixClose();ixRenderAnalysis();}
function ixRenderAnalysis(){if(!ixAnalysis)return;const x=ixAnalysis;$('#app').innerHTML=`<section class="page ix-analysis"><div class="head"><h1 tabindex="-1">${esc(x.title)}</h1>${btn('返回原页面','ix-analysis-back')}</div><div class="modal-body">${x.body}</div><div class="button-row">${x.actions.replaceAll('data-act="close"','data-act="ix-analysis-back"')}</div></section>`;$('#app h1').focus();window.scrollTo(0,0);}
modal=function(title,body,actions=''){
 if(/趋势|费用明细|累计价值明细/.test(title)){ixShowAnalysis(title,body,actions);return;}
 const d=$('#overlay');if(d.open&&d.classList.contains('ix-drawer')){if(ixEditor&&!ixSaveEditor())return;ixStack.push({html:d.innerHTML,className:d.className,editor:ixEditor});}
 else if(!d.open){ixStack=[];ixTrigger=document.activeElement;}
 ixEditor=null;ixSubmitted=false;ixBaseModal(title,body,actions);
 const strong=/重置|从头自动|确认评审|放弃未保存/.test(title),drawer=!strong;
 d.className=drawer?'ix-drawer':'ix-confirm';
 if(ixStack.length)d.querySelector('.modal-head').insertAdjacentHTML('afterbegin',btn('返回上一层','ix-back'));
 ixSetupEditor(title);if(!ixEditor&&drawer)ixRecordNavigation(title);
 requestAnimationFrame(()=>{const target=d.querySelector('.modal-body input:not([type=hidden]),.modal-body textarea,.modal-body select')||d.querySelector('.modal-head button');target?.focus();});
};
function ixRecordNavigation(title){if(!/记录详情/.test(title))return;const current=dummyRecordId();if(!current)return;const records=ES.workOrders.some(x=>x.id===current)?ES.workOrders.filter(x=>x.projectId===enterpriseState().project):ES.stocks.some(x=>x.id===current)?ES.stocks:[];const index=records.findIndex(r=>r.id===current);if(index<0)return;$('#overlay .modal-actions').insertAdjacentHTML('afterbegin',`${btn('上一条','ix-record-switch',`data-id="${records[index-1]?.id||''}" ${index===0?'disabled':''}`)}${btn('下一条','ix-record-switch',`data-id="${records[index+1]?.id||''}" ${index===records.length-1?'disabled':''}`)}`);}
function dummyRecordId(){return $('#modalTitle')?.textContent.match(/(?:WO|LOT|QUO)-\d+/)?.[0];}
function ixBackup(){const blob=new Blob([JSON.stringify({format:'PlantSim-working-backup-v1',project:P,editor:ixEditor?{key:ixEditor.key,values:ixValues($('#overlay'))}:null,localOperations:operations},null,2)],{type:'application/json'}),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='PlantSim-工作备份.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function ixHasWork(){return P.status!=='completed'&&(P.imports.length||P.goals.length||P.runs.length||U.goalText!==E.DEFAULT_TEXT||U.goalDraft||U.decisionDraft?.note);}
function ixConfirmReset(next){modal('重置当前会话？',`<div class="ix-alert"><p>当前未归档的项目、模拟结果及会话内容会被清除。企业采购与复核的本地记录不受影响。</p><p>建议先导出工作备份。导出文件用于保留材料，不代表已完成项目归档。</p></div>`,btn('继续工作','close')+btn('导出备份','ix-export')+btn(next==='new-project'?'放弃会话并新建':'放弃会话并重置','ix-reset-confirm',`data-next="${next}"`,true));}
function ixUndoToast(id){ixUndo=id;clearTimeout(toastTimer);$('#toast').innerHTML=`<div class="toast" role="status">采购草稿已撤回 ${btn('撤销撤回','ix-restore',`data-id="${id}"`)}</div>`;toastTimer=setTimeout(()=>$('#toast').replaceChildren(),10000);}
function ixMatchMaterial(id){return !ixFilter||ES.materials.find(m=>m.id===id)?.entityId===ixFilter;}
function ixMatchEntity(id){return !ixFilter||id===ixFilter;}
const ixAnswer=enterpriseAnswer;
enterpriseAnswer=function(r){return ixAnswer(r).replaceAll('data-act="nav"',`data-act="ix-related" data-entity="${r.entity?.id||''}"`);};
const ixRender=render;
render=function(){const nextKey=ixPageKey(),entering=nextKey!==ixLastPageKey;ixRender();ixLastPageKey=nextKey;if(!U.auth)return;if(entering&&ixMainDrafts.has(nextKey))ixRestore($('#app'),ixMainDrafts.get(nextKey));const resetButton=$('[data-action=reset]');if(resetButton){resetButton.setAttribute('aria-label','重置当前会话');resetButton.title='重置当前会话';}if(ixAnalysis){ixRenderAnalysis();return;}if(ixFilter&&[10,11].includes(U.page))$('#app .head')?.insertAdjacentHTML('afterend',`<div class="ix-info">已筛选：${esc(ES.entities.find(e=>e.id===ixFilter)?.name||'')} ${btn('清除筛选','ix-filter-clear')}</div>`);$('#app .ops-boundary')?.insertAdjacentHTML('beforeend','<span class="ix-context-note">企业台账使用独立演示项目，不是当前模拟项目的真实 ERP 数据。</span>');$('#app').querySelectorAll('[data-act=ix-restore]').forEach(b=>b.disabled=operations.plans.some(x=>x.status==='草稿'&&x.id!==b.dataset.id&&x.projectId===operations.plans.find(p=>p.id===b.dataset.id)?.projectId&&x.materialId===operations.plans.find(p=>p.id===b.dataset.id)?.materialId));};
const ixAct=act;
act=function(a,b={}){
 switch(a){
 case 'close':ixClose();return;
 case 'ix-force-close':ixClose(true);return;
 case 'ix-continue':$('#ix-leave-warning')?.remove();return;
 case 'ix-export':ixBackup();return;
 case 'ix-discard':{if($('#ix-discard-warning'))return;$('#overlay .modal-body').insertAdjacentHTML('afterbegin',`<div class="ix-alert" id="ix-discard-warning" role="alert"><p>放弃后将删除这份未提交草稿，不影响已登记的业务记录。</p>${btn('保留并继续编辑','ix-discard-cancel')}${btn('放弃这份草稿','ix-discard-confirm')}</div>`);$('#ix-discard-warning button').focus();return;}
 case 'ix-discard-cancel':$('#ix-discard-warning')?.remove();return;
 case 'ix-discard-confirm':try{IX.remove(localStorage,ixEditor.key);ixMemory.delete(ixEditor.key);ixClose(true);}catch(e){$('#ix-draft-status').textContent='删除草稿失败，已保留内容。';}return;
 case 'ix-back':{if(ixEditor&&!ixSaveEditor())return;const prev=ixStack.pop();if(!prev)return;const d=$('#overlay');d.innerHTML=prev.html;d.className=prev.className;ixEditor=prev.editor;if(ixEditor){const v=ixMemory.get(ixEditor.key);if(v)ixRestore(d,v);}d.querySelector('.modal-head button')?.focus();return;}
 case 'ix-record-switch':ixStack=[];$('#overlay').close();enterpriseRecordDialog(b.id);return;
 case 'ix-analysis-back':ixAnalysis=null;render();ixFocusReturn();return;
 case 'value-period':if(ixAnalysis){U.valuePeriod=b.period;ixAnalysis.body=valueTrend(b.valueMetric,b.period);ixRenderAnalysis();return;}break;
 case 'stat-period':if(ixAnalysis){U.statPeriod=b.period;ixAnalysis.body=metricTrend(b.metric,b.period);ixRenderAnalysis();return;}break;
 case 'reset':if(ixHasWork()){ixConfirmReset('reset');return;}break;
 case 'new-project':if(ixHasWork()){ixConfirmReset('new-project');return;}break;
 case 'ix-reset-confirm':ixClose(true);ixFilter=null;ixAnalysis=null;ixAct('reset');if(b.next==='new-project')ixAct('new-project');return;
 case 'ops-withdraw':try{opsCommit(OP.withdraw(operations,b.id));render();ixUndoToast(b.id);}catch(e){ixAlert(e.message);}return;
 case 'ix-restore':try{opsCommit(OP.restore(operations,b.id));render();toast('采购草稿已恢复，尚未下单');}catch(e){ixAlert(e.message);}return;
 case 'erp-entity':{const e=ES.entities.find(x=>x.id===b.id),trigger=document.activeElement;if(!e)return;const parent=trigger?.closest('.erp-recognized,.erp-result-row')||$('#app .erp-conversation');if(!parent)return;let help=parent.querySelector('.ix-name-help');if(help){help.remove();trigger?.setAttribute('aria-expanded','false');return;}parent.insertAdjacentHTML('beforeend',`<div class="ix-info ix-name-help"><b>${esc(e.name)}</b><p>也称：${esc(e.aliases.join('、'))}</p><p>${esc(e.note)}</p>${enterpriseSources(e.sourceIds)}</div>`);trigger?.setAttribute('aria-expanded','true');return;}
 case 'ix-related':ixFilter=b.entity||null;enterpriseState().navOpen=true;ixAnalysis=null;route(+b.page);return;
 case 'ix-filter-clear':ixFilter=null;render();return;
 case 'nav':ixAnalysis=null;ixFilter=null;break;
 case 'erp-project-query':ixFilter=null;break;
 }
 const editing=ixEditor,result=ixAct(a,b);if(editing&&['save-message','create-version','resolve','create-project'].includes(a)&&!$('#overlay').open){try{IX.remove(localStorage,editing.key);ixMemory.delete(editing.key);}catch(e){ixAlert('操作已完成，但旧填写草稿未能清理；重新进入时请核对。');}}return result;
};
document.addEventListener('input',e=>{if(e.target.getAttribute('aria-invalid')==='true'&&e.target.validity?.valid){e.target.removeAttribute('aria-invalid');e.target.removeAttribute('aria-describedby');}if(e.target.closest('#overlay')&&ixEditor){ixSaveEditor();ixPurchaseFeedback();}else if(e.target.closest('#app'))ixMainDrafts.set(ixPageKey(),ixMainValues());});
document.addEventListener('change',e=>{if(e.target.closest('#overlay')&&ixEditor){ixSaveEditor();ixPurchaseFeedback();}});
document.addEventListener('cancel',e=>{if(e.target.id!=='overlay'||repairTimer)return;e.preventDefault();ixClose();},true);
document.addEventListener('keydown',e=>{const d=$('#overlay');if(e.key!=='Tab'||!d?.open)return;const items=[...d.querySelectorAll('button,input:not([type=hidden]),textarea,select,a[href],summary,[tabindex]')].filter(x=>!x.disabled&&x.tabIndex>=0&&x.getClientRects().length),first=items[0],last=items.at(-1);if(!first){e.preventDefault();d.focus();return;}if(!d.contains(document.activeElement)||(e.shiftKey&&document.activeElement===first)){e.preventDefault();(e.shiftKey?last:first).focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}},true);
document.addEventListener('invalid',e=>{if(!e.target.closest('#overlay'))return;e.target.setAttribute('aria-invalid','true');const error=$('#overlay .ops-form-error');if(error){error.id='ix-field-error';error.textContent=e.target.validationMessage;e.target.setAttribute('aria-describedby',error.id);}},true);
document.addEventListener('submit',e=>{if(!e.target.closest('#overlay'))return;queueMicrotask(()=>{const error=$('#overlay .ops-form-error');if(error?.textContent){error.tabIndex=-1;error.focus();}});},true);
window.addEventListener('beforeunload',e=>{if((ixEditor&&!ixSaveEditor())||ixHasWork()){e.preventDefault();e.returnValue='';}});
