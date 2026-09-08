/* Business services: design bills, audited cost aggregation and compact completion archives. */
(function(root){'use strict';
function install(E){
const clone=E.clone,KEY='plantsim.completed.v1',sum=a=>a.reduce((n,x)=>n+x,0);
const HOURS=[{name:'资料整理',traditional:12,assisted:4},{name:'方案评审',traditional:24,assisted:10},{name:'结果汇总',traditional:8,assisted:2}];
const CASES=[{id:'case-park',name:'社区公园改造',baseCost:186000,chosenCost:162000,traditional:64,assisted:28},{id:'case-campus',name:'校园步道更新',baseCost:128000,chosenCost:113000,traditional:48,assisted:20},{id:'case-water',name:'滨水绿地优化',baseCost:245000,chosenCost:221000,traditional:80,assisted:36}].map(x=>({...x,source:'内置案例',cost:x.baseCost-x.chosenCost,hours:x.traditional-x.assisted}));
const PRESETS={balanced:{name:'四区域均衡优化',note:'入口替换与重排；滨水疏密及滴灌；步道补植错位；休息区局部根系保护'},resilient:{name:'极端环境韧性强化',note:'扩大入口间距；滨水排水；扩大根系保护；增加风害支撑及应急供水设施'}};
function bill(v){const ps=v.baseline.plants,tier=v.strategy||'original',items=[];const add=(category,target,quantity,unit,unitPrice)=>items.push({id:v.id+'/bill/'+items.length,category,target,quantity,unit,unitPrice,amount:quantity*unitPrice,priceVersion:'cost-4.0'});
for(const p of ps){const price=p.spec.includes('m²')?8:p.name==='火焰木'?700:p.spec.includes('胸径')?420:35;add('植物采购',p.id,p.quantity,p.spec.includes('m²')?'m²':'株',price);if(p.companionPoint)add('植物采购',p.id+'补植',2,'株',420);}
add('种植施工','四区域',20,'记录',260);add('土壤改良','四区域',40,'m³',130);
if(tier!=='original'){add('移除与移植','入口与滨水',8,'株群',160);add('灌溉排水','B03/B04滴灌',2,'组',1400);add('支撑与根系保护','D01局部保护',1,'组',1800);add('种植施工','步道补植',2,'株',220);}
if(tier==='resilient'){add('灌溉排水','滨水排水沟',40,'米',95);add('支撑与根系保护','乔木抗风支撑',8,'套',280);add('支撑与根系保护','扩展保护区',3,'组',900);add('灌溉排水','应急供水设施',1,'组',2400);}
v.costItems=items;v.cost=sum(items.map(x=>x.amount));return items;}
const oldNew=E.newProject;E.newProject=function(...args){const p=oldNew(...args);p.id='project-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);p.hours=clone(HOURS);p.status='active';p.versions[0].strategy='original';bill(p.versions[0]);return p;};
const oldCreate=E.createVersion;E.createVersion=function(p,base,patch={}){if(p.status==='completed')throw Error('已完成项目只读，请先继续优化');const strategy=patch.strategy||(patch.comprehensive||base.strategy==='balanced'?'resilient':'balanced'),v=oldCreate(p,base,{...patch,comprehensive:true,note:patch.note||PRESETS[strategy].note});v.strategy=strategy;if(strategy==='balanced'){delete v.emergencyWater;for(const plant of v.baseline.plants){delete plant.drainage;delete plant.windSupport;if(plant.id!=='D01')plant.rootProtection=false;}}const by=id=>v.baseline.plants.find(p=>p.id===id);by('B04').quantity=14;by('B04').drip=true;by('C02').quantity=6;by('D01').protectionRadius=strategy==='resilient'?5:2;
v.layoutChanges.push({plant:'B04',type:'减少',from:base.baseline.plants.find(p=>p.id==='B04').quantity,to:14,reason:'降低滨水密度并配置滴灌'},{plant:'C02',type:'补植',from:base.baseline.plants.find(p=>p.id==='C02').quantity,to:6,reason:'补足步道冠幅连续性'});
if(strategy==='resilient'){for(const p of v.baseline.plants){p.drainage=p.area==='滨水区';p.windSupport=p.spec.includes('胸径');if(p.area==='休息区')p.rootProtection=true;}by('A02').y=Math.max(35,by('A02').y-12);v.emergencyWater=2;v.layoutChanges.push({plant:'滨水/乔木',type:'设施',to:'排水、抗风支撑、应急供水',reason:'复合极端事件防护'});}bill(v);return v;};
function costs(run,pathId='all'){const paths=pathId==='all'?run.paths:run.paths.filter(p=>p.id===pathId);if(!paths.length)throw Error('没有对应路径');const factor=paths.length,categories=['遮阳覆盖','灌溉保湿','病害防治','修剪支撑','排水','根系保护','巡检'],category=c=>/巡检|维持/.test(c.action)?'巡检':/灌溉/.test(c.action)?'灌溉保湿':/病/.test(c.action)?'病害防治':/排水/.test(c.action)?'排水':/围栏|根系保护/.test(c.action)?'根系保护':/支撑/.test(c.action)?'修剪支撑':'遮阳覆盖';const actions=paths.flatMap(p=>p.history.flatMap(h=>h.care||[])).filter(c=>c.decision==='执行');const maintenance=categories.map(name=>({name,amount:sum(actions.filter(c=>category(c)===name).map(c=>c.cost))/factor,records:actions.filter(c=>category(c)===name)}));const ev=E.evaluate(run),reworkRows=ev.calls.find(c=>c.tool==='EvaluationTools.rework').details.filter(x=>paths.some(p=>p.id===x.pathId));return {construction:run.design.cost,items:run.design.costItems||[],maintenance:sum(maintenance.map(x=>x.amount)),rework:sum(reworkRows.map(x=>x.value))/factor,categories:maintenance,reworkRows,pathId};}
function completionIssues(p){const a=p.adoption,r=p.runs.find(r=>r.id===a?.runId);return [!r||r.status!=='complete'||r.replayOf?'请完成正式模拟':null,!a?'请选择采纳方案':null,!a?.note?.trim()?'请填写采纳理由':null,!E.latestRun(p,'V1')?'缺少原方案完整结果':null].filter(Boolean);}
function compactRun(r){const c=clone({...r,logs:[],failures:[],paths:[]});c.evaluation=clone(E.evaluate(r));delete c.evaluation.signature;c.archived=true;delete c.knowledgeGraph;delete c.fairness;c.paths=r.paths.map(p=>({id:p.id,cycle:p.cycle,horizon:p.horizon,history:p.history.map(h=>({cycle:h.cycle,events:h.events.map(e=>[e.plant,e.severity,e.dominant,+e.loss.toFixed(4),+e.predicted.toFixed(4)]),care:h.care.map(a=>[a.plant,a.decision,a.action,a.cost,a.waterM3,a.laborHours]),state:h.state.map(s=>[s.id,+s.health.toFixed(6),+s.crown.toFixed(6),s.risk,s.x,s.y,+s.rootDamage.toFixed(6)])}))}));return c;}
function archive(p){const issues=completionIssues(p);if(issues.length)throw Error(issues.join('；'));const base=E.latestRun(p,'V1'),chosen=p.runs.find(r=>r.id===p.adoption.runId),hours=clone(p.hours||HOURS);if(hours.some(x=>![x.traditional,x.assisted].every(n=>Number.isFinite(n)&&n>=0)))throw Error('评审工时必须为非负数');const results=p.versions.map(v=>E.latestRun(p,v.id)).filter(Boolean),snapshot={...clone({...p,runs:[]}),status:'completed',runs:results.map(compactRun)},contribution={projectId:p.id,name:p.name,source:'当前项目',baseCost:E.evaluate(base).total,chosenCost:E.evaluate(chosen).total,cost:E.evaluate(base).total-E.evaluate(chosen).total,hours:sum(hours.map(x=>x.traditional-x.assisted)),hourRows:hours};return {schemaVersion:1,id:p.id,completedAt:new Date().toISOString(),adoption:clone(p.adoption),contribution,project:snapshot,knowledgeGraph:clone(base.knowledgeGraph||E.domain.graph)};}
function load(storage){const raw=storage.getItem(KEY);if(!raw)return [];const data=JSON.parse(raw);if(data.schemaVersion!==1||!Array.isArray(data.projects))throw Error('本地归档格式不兼容，请先导出备份');return data.projects;}
function save(storage,records,item){const next=[...records.filter(x=>x.id!==item.id),item];storage.setItem(KEY,JSON.stringify({schemaVersion:1,projects:next}));return next;}
function restore(item){const p=clone(item.project);for(const r of p.runs){r.knowledgeGraph=clone(item.knowledgeGraph);r.maintenanceActions=r.maintenanceActions||clone(E.domain.actions);r.evaluation.signature=JSON.stringify(r.evaluationSpec);r.fairness=JSON.stringify({cards:r.cards,goal:r.goal,seed:r.seed,rule:r.ruleVersion,evaluation:r.evaluationSpec,knowledge:r.knowledgeGraph,maintenanceActions:r.maintenanceActions});for(const path of r.paths){path.pending=null;path.blocked=null;for(const h of path.history){h.pathId=path.id;h.environment=clone(r.cards.find(c=>c.pathId===path.id).environment.months[h.cycle-1]);h.state=h.state.map(([id,health,crown,risk,x,y,rootDamage])=>({...clone(r.design.baseline.plants.find(p=>p.id===id)),id,health,crown,risk,x,y,rootDamage,designVersionId:r.versionId}));h.events=h.events.map(([plant,severity,dominant,loss,predicted])=>({id:r.id+'/'+path.id+'/C'+h.cycle+'/'+plant,plant,severity,dominant,loss,predicted,title:plant+'：'+(E.domain.graph.nodes.find(n=>n.id===dominant)?.label||dominant)}));h.care=h.care.map(([plant,decision,action,cost,waterM3,laborHours])=>({id:r.id+'/'+path.id+'/C'+h.cycle+'/care/'+plant,path:path.id,cycle:h.cycle,plant,decision,action,cost,waterM3,laborHours}));}path.state=clone(path.history.at(-1).state);}}return p;}
function totals(records){const rows=[...CASES,...records.map(x=>x.contribution)];return {rows,cost:sum(rows.map(x=>x.cost)),hours:sum(rows.map(x=>x.hours)),count:rows.length};}

function recordDecision(p,input){
 if(p.status==='completed')throw Error('已归档项目请先继续优化');
 const outcomes=['adopt','conditional','defer','reject'];
 if(!outcomes.includes(input.outcome))throw Error('请选择评审结论');
 const r=E.latestRun(p,input.versionId);
 if(!r)throw Error('方案必须完成正式模拟');
 for(const k of ['note','reviewer','risks'])if(!input[k]?.trim())throw Error('请填写评审人、决策理由与风险取舍');
 if(!input.reasons?.length)throw Error('请选择至少一个决策依据');
 if(input.outcome!=='adopt'&&!input.conditions?.trim())throw Error('请填写落实条件或下一步要求');
 const decision=clone({...input,id:p.id+'/decision/'+((p.decisions?.length||0)+1),runId:r.id,at:new Date().toISOString(),
 evidence:{runId:r.id,dimensions:E.evaluate(r).dimensions.map(d=>({id:d.id,name:d.name,score:d.score})),cost:costs(r)}});
 delete decision.evidence.cost.reworkRows;
 decision.evidence.cost.categories=decision.evidence.cost.categories.map(c=>({name:c.name,amount:c.amount}));
 p.decisions=p.decisions||[];p.decisions.push(decision);
 p.adoption=['adopt','conditional'].includes(input.outcome)?clone(decision):null;
 return decision;
}

E.business={recordDecision,KEY,HOURS,CASES,PRESETS,bill,costs,completionIssues,archive,load,save,restore,totals};return E.business;
}
if(typeof module!=='undefined'&&module.exports)module.exports=install;else root.PlantSimBusiness=install;
})(typeof window==='undefined'?globalThis:window);
