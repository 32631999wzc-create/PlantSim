/* Offline enterprise snapshot. Public facts and synthetic transactions are separate.
 * No API, model, tracking request or background refresh is used. */
(function(root){'use strict';
const snapshot={id:'enterprise-2026-10-22-v1',date:'2026-10-22',mode:'offline',label:'2026.10 企业协同快照'};
const sources=[
 {id:'ZB',title:'蚜虫的危害与防治方法',publisher:'淄博市农业农村局',published:'2022-07-03',accessed:'2026-10-22',url:'https://ny.zibo.gov.cn/art/2022/7/3/art_980_2308150.html',summary:'记载蚜虫也称腻虫；本快照仅据此建立类群俗称，不把俗称定位到某个种。',supports:['昆虫俗称']},
 {id:'SH',title:'市绿化管理指导站开展重点商圈行道树蚜虫专项排查工作',publisher:'上海市绿化市容局',published:'2026-09-04',accessed:'2026-10-22',url:'https://www.shanghai.gov.cn/nw18454/20260904/184cb5b5713b4ca9b5a40249bd334ba8.html',summary:'公开报道9月2日对海平路、乌鲁木齐北路、永源路、新闸路栾树开展排查；新闸路污渍经检查排除蚜虫蜜露所致。未公开内部工单编号和费用。',supports:['真实公开排查报道','结论边界']},
 {id:'GZ',title:'广州桥梁绿化明星——簕杜鹃',publisher:'广州市林业和园林局',published:'2022-08-02',accessed:'2026-10-22',url:'https://lyylj.gz.gov.cn/kpyd/dwbk/zw/content/post_8469070.html',summary:'记录簕杜鹃、叶子花、三角梅、九重葛等名称及广州桥梁绿化应用。贸易名不用于断定具体品种。',supports:['植物名称','应用场景']},
 {id:'SZ',title:'深圳市市花簕杜鹃应如何日常养护？',publisher:'深圳市城市管理和综合执法局',published:'2026-01-26',accessed:'2026-10-22',url:'https://www.sz.gov.cn/ztfw/gysy/wyw_183970/ywzsk_184570/content/post_12660970.html',summary:'养护知识涉及光照、排水、浇灌和修剪。此处仅摘记养护方向，未导入施肥或药剂配方。',supports:['养护知识']},
 {id:'IP',title:'朱槿 · 植物智物种信息',publisher:'中国科学院植物研究所 · 植物智',published:null,accessed:'2026-10-22',url:'https://www.iplant.cn/info/%E6%9C%B1%E6%A7%BF',summary:'朱槿的学名为 Hibiscus rosa-sinensis，列有扶桑、大红花、佛桑等俗名。资料页面未标注发布日期。',supports:['物种名称','学名','俗名']},
 {id:'TA',title:'花生叶螨发生预警',publisher:'泰安市农业农村局',published:'2026-08-24',accessed:'2026-10-22',url:'https://nyncj.taian.gov.cn/art/2026/8/24/art_172634_10319687.html',summary:'花生植保语境中使用红蜘蛛、白蜘蛛称呼叶螨；该农业预警不构成本项目现场虫情或物种鉴定。',supports:['俗称歧义','寄主限定']},
 {id:'FJ',title:'春季柑橘主要病虫发生动态',publisher:'福建省植保植检总站',published:'2026-03-27',accessed:'2026-10-22',url:'https://nynct.fujian.gov.cn/ztzl/bcfsyfk/202604/t20260402_7118523.htm',summary:'柑橘植保语境中红蜘蛛对应柑橘全爪螨，文章包含监测和防控信息。寄主不同，不能沿用同一鉴定。',supports:['俗称歧义','柑橘寄主']},
 {id:'FX',title:'沣西新城2025、2026年度园林绿化养护服务采购中标结果公告',publisher:'全国公共资源交易平台（陕西省·西咸新区）',published:'2025-06-17',accessed:'2026-10-22',url:'https://ggzyjy.xixianxinqu.gov.cn/jydt/001001/001001004/001001004003/20250617/8a69c7c2977baa5001977c272ac7775d.html',summary:'项目编号 SXZM-GK-2025017；本快照收录第一标段中标金额与服务期限。其金额不是实际付款，也不代表已完工。',supports:['公开项目','采购结果','服务期限']},
 {id:'SJZ',title:'2026年园林绿化服务（第一批）政府购买服务项目公开招标公告',publisher:'中国政府采购网 · 石家庄市园林局本级',published:'2026-03-13',accessed:'2026-10-22',url:'https://www.ccgp.gov.cn/cggg/dfgg/gkzb/202603/t20260313_26267734.htm',summary:'项目 HBBJ-2026-021 预算45317767元；采购需求涵盖日常管护、补植辅助及专业指导下的病虫害防治。公告未披露履约工单。',supports:['公开项目','采购预算','养护工作分类']}
];
const entities=[
 {id:'pest-aphids',name:'蚜虫类（待鉴定到种）',latin:'未确定到种',type:'昆虫类群',aliases:['蚜虫','腻虫'],sourceIds:['ZB','SH'],note:'腻虫对应蚜虫类群，仍需寄主和虫体特征鉴定；地面黏污不能单独证明蚜虫发生。',knowledge:'可以联查上海公开排查报道；报道中特定路段污渍经检查排除蚜虫蜜露所致，不能把所有黏污都归因于蚜虫。'},
 {id:'plant-bougainvillea',name:'簕杜鹃／三角梅',latin:'Bougainvillea spp.（贸易名称组）',type:'植物名称组',aliases:['簕杜鹃','三角梅','叶子花','九重葛'],sourceIds:['GZ','SZ'],note:'先定位贸易名称组，再确认品种、花色与规格；不把名称组等同于单一物种。',knowledge:'关注光照、排水与花后修剪；采购匹配还需核对花色和苗型。'},
 {id:'plant-hibiscus',name:'朱槿',latin:'Hibiscus rosa-sinensis',type:'植物物种',aliases:['朱槿','扶桑','大红花','佛桑','hibiscus rosa-sinensis'],sourceIds:['IP'],note:'俗名映射到物种后，仍需核对单瓣／重瓣及高度、冠幅等物料属性。',knowledge:'名称来源已核对；本快照未收录该物种的现场诊断和具体用药建议。'},
 {id:'pest-mites',name:'叶螨类（待鉴定）',latin:'未确定到种',type:'害螨类群',aliases:['红蜘蛛','白蜘蛛','叶螨'],sourceIds:['TA'],note:'来源是花生寄主的公开植保资料。园林现场需补充寄主、地点与检查记录。',knowledge:'仅据俗称不能确认种；先核查寄主和现场证据，不自动生成药剂处方。'},
 {id:'pest-citrus',name:'柑橘全爪螨（柑橘语境候选）',latin:'本快照不另行校验拉丁学名',type:'害螨候选',aliases:['柑橘全爪螨','柑橘红蜘蛛','柑桔红蜘蛛','红蜘蛛'],sourceIds:['FJ'],note:'适用于来源中的柑橘语境；选择候选是查询范围确认，不等同于现场鉴定。',knowledge:'公开监测与防控资料可供查阅，不能当作园林项目已发生的病虫害记录。'}
];
const fixture={kind:'synthetic',sourceIds:['SJZ'],basis:'参考公开采购需求中的修剪、补植与植保工作分类；以下数量、价格、日期、供货与工单均为自行编制的演示数据。'};
const materials=[
 {id:'MAT-B01',entityId:'plant-bougainvillea',name:'簕杜鹃 · 大叶紫',spec:'灌木，高80–100cm，冠幅60–80cm',unit:'株',region:'华南',sourceName:'ERP物料快照',provenance:fixture},
 {id:'MAT-B02',entityId:'plant-bougainvillea',name:'簕杜鹃 · 金心双色',spec:'灌木，高80–100cm，冠幅60–80cm',unit:'株',region:'华南',sourceName:'ERP物料快照',provenance:fixture},
 {id:'MAT-H01',entityId:'plant-hibiscus',name:'朱槿 · 红色单瓣',spec:'高80cm，冠幅50–60cm',unit:'株',region:'华南',sourceName:'ERP物料快照',provenance:fixture}
];
const suppliers=[
 {id:'SUP-A',name:'演示苗圃甲',region:'广州（演示）',leadDays:7,projects:['DEMO-PARK','DEMO-COURT'],provenance:fixture},
 {id:'SUP-B',name:'演示苗圃乙',region:'佛山（演示）',leadDays:14,projects:['DEMO-PARK'],provenance:fixture}
];
const stocks=[
 {id:'LOT-101',materialId:'MAT-B01',supplierId:'SUP-A',nursery:'演示苗圃东区',physical:52,reserved:18,blocked:4,incoming:20,eta:'2026-11-05',provenance:fixture},
 {id:'LOT-102',materialId:'MAT-B01',supplierId:'SUP-B',nursery:'演示苗圃南区',physical:24,reserved:20,blocked:0,incoming:0,eta:null,provenance:fixture},
 {id:'LOT-201',materialId:'MAT-B02',supplierId:'SUP-B',nursery:'演示苗圃南区',physical:16,reserved:0,blocked:0,incoming:12,eta:'2026-11-12',provenance:fixture},
 {id:'LOT-301',materialId:'MAT-H01',supplierId:'SUP-A',nursery:'演示苗圃东区',physical:35,reserved:10,blocked:5,incoming:8,eta:'2026-10-29',provenance:fixture}
];
const quotes=[
 {id:'QUO-101',materialId:'MAT-B01',supplierId:'SUP-A',price:85,tax:'含税',freight:'不含运费',validUntil:'2026-10-31',provenance:fixture},
 {id:'QUO-102',materialId:'MAT-B01',supplierId:'SUP-B',price:78,tax:'含税',freight:'不含运费',validUntil:'2026-10-01',provenance:fixture},
 {id:'QUO-201',materialId:'MAT-B02',supplierId:'SUP-B',price:110,tax:'含税',freight:'不含运费',validUntil:'2026-11-10',provenance:fixture},
 {id:'QUO-301',materialId:'MAT-H01',supplierId:'SUP-A',price:32,tax:'含税',freight:'不含运费',validUntil:'2026-11-10',provenance:fixture}
];
const projects=[
 {id:'DEMO-PARK',name:'华南公园入口更新 · 演示项目',kind:'synthetic',region:'华南',demand:{'MAT-B01':40,'MAT-B02':12,'MAT-H01':8},deadline:'2026-11-01',sourceIds:['SJZ'],note:'用于演示需求、供苗与养护闭环；不是石家庄或沣西新城实际履约记录。'},
 {id:'DEMO-COURT',name:'庭院更新 · 演示项目',kind:'synthetic',region:'华南',demand:{'MAT-B01':18},deadline:'2026-11-15',sourceIds:['SJZ'],note:'演示供应商跨项目追溯。'},
 {id:'PUBLIC-FX-01',name:'沣西新城2025、2026年度园林绿化养护服务采购 · 第一标段',kind:'public',region:'陕西',number:'SXZM-GK-2025017',amount:19588000,amountType:'中标金额',supplier:'陕西西咸海绵城市工程技术有限公司',period:'两年；非日常养护项目质量保修期为验收后12个月',sourceIds:['FX'],note:'仅收录公告事实；未取得采购明细、执行台账与实际支付数据。'},
 {id:'PUBLIC-SJZ',name:'2026年园林绿化服务（第一批）政府购买服务项目',kind:'public',region:'河北',number:'HBBJ-2026-021',amount:45317767,amountType:'采购预算',supplier:null,period:'2026年度',sourceIds:['SJZ'],note:'招标公告不是中标结果；未推定供应商或执行进度。'}
];
const publicRecords=[
 {id:'PUB-SH-20260902',entityId:'pest-aphids',kind:'public',date:'2026-09-02',published:'2026-09-04',task:'上海重点商圈行道树蚜虫专项排查',status:'公开报道',location:'海平路、乌鲁木齐北路、永源路、新闸路',finding:'排查对象为栾树。报道记载前三条道路人行道整体整洁，新闸路可见少量污渍。',result:'新闸路未监测到蚜虫活动迹象，报道排除该处污渍为蚜虫蜜露所致。',note:'PUB编号是本快照索引，不是主管部门工单号；报道未披露内部工单、用料和费用。',sourceIds:['SH']}
];
const workOrders=[
 {id:'WO-101',projectId:'DEMO-PARK',entityId:'plant-bougainvillea',materialId:'MAT-B01',supplierId:'SUP-A',batchId:'LOT-101',date:'2026-10-12',status:'已复查',task:'入口簕杜鹃排水与修剪检查',finding:'演示：雨后根区积水，清理排水口并修剪残枝。',result:'演示：10月19日复查排水通畅；不推断生长改善的因果关系。',provenance:{...fixture,sourceIds:['SJZ','SZ']}},
 {id:'WO-102',projectId:'DEMO-PARK',entityId:'plant-hibiscus',materialId:'MAT-H01',supplierId:'SUP-A',batchId:'LOT-301',date:'2026-10-18',status:'待鉴定',task:'朱槿叶背检查',finding:'演示：巡检员记录俗称“红蜘蛛”，缺少物种鉴定结果。',result:'待专业复核寄主、虫体与现场记录；没有用药或结案记录。',provenance:fixture},
 {id:'WO-103',projectId:'DEMO-COURT',entityId:'plant-bougainvillea',materialId:'MAT-B01',supplierId:'SUP-A',batchId:'LOT-101',date:'2026-09-20',status:'已验收',task:'庭院簕杜鹃到货验收',finding:'演示：按高度与冠幅检查18株。',result:'演示验收通过；公开项目供应商未参与本演示。',provenance:fixture}
];
const costs=[
 {id:'COST-V1',projectId:'DEMO-PARK',version:'V1',budget:24000,actual:6800,committed:3200,forecast:22000,provenance:fixture},
 {id:'COST-V2',projectId:'DEMO-PARK',version:'V2',budget:28000,actual:7800,committed:4200,forecast:26800,provenance:fixture}
];
const systems=[
 {id:'knowledge',name:'物种与植保知识库',domain:'植物名称、俗称、养护依据',date:'2026-10-22',status:'ready',count:entities.length,sourceIds:['GZ','SZ','IP','TA','FJ','ZB']},
 {id:'erp',name:'ERP业务快照',domain:'物料、采购报价、项目成本',date:'2026-10-22',status:'ready',count:materials.length+quotes.length+costs.length,sourceIds:['SJZ']},
 {id:'nursery',name:'苗圃与库存快照',domain:'批次、预留、隔离、在途',date:'2026-10-22',status:'ready',count:stocks.length,sourceIds:['SJZ']},
 {id:'care',name:'养护与验收快照',domain:'巡检、待鉴定、复查',date:'2026-10-22',status:'ready',count:workOrders.length+publicRecords.length,sourceIds:['SJZ','SZ','SH']},
 {id:'public',name:'公开项目资料库',domain:'采购公告与中标结果',date:'2026-10-22',status:'ready',count:2,sourceIds:['FX','SJZ']}
];
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
const available=s=>Math.max(0,s.physical-s.reserved-s.blocked);
function resolve(text){const q=normalize(text);const hits=entities.flatMap(e=>e.aliases.filter(a=>q.includes(normalize(a))).map(alias=>({entity:e,alias,length:normalize(alias).length})));if(!hits.length)return {status:'missing',candidates:[]};const longest=Math.max(...hits.map(h=>h.length)),best=hits.filter(h=>h.length===longest),seen=new Set();const candidates=best.filter(h=>!seen.has(h.entity.id)&&seen.add(h.entity.id));return {status:candidates.length===1?'matched':'ambiguous',alias:candidates[0].alias,candidates:candidates.map(h=>h.entity)};}
function inventory(materialId,projectId='DEMO-PARK',deadline){const material=materials.find(m=>m.id===materialId);if(!material)return null;const project=projects.find(p=>p.id===projectId),lots=stocks.filter(s=>s.materialId===materialId),need=project?.demand?.[materialId]||0,due=deadline||project?.deadline||snapshot.date,usable=lots.reduce((n,s)=>n+available(s),0),arriving=lots.filter(s=>s.eta&&s.eta<=due).reduce((n,s)=>n+s.incoming,0);return {material,lots,need,available:usable,incomingBefore:arriving,incoming:lots.reduce((n,s)=>n+s.incoming,0),gap:Math.max(0,need-usable),gapByDeadline:Math.max(0,need-usable-arriving),deadline:due,project};}
function entityGraph(entityId){const entity=entities.find(e=>e.id===entityId);if(!entity)return {nodes:[],edges:[]};const nodes=[{id:entity.id,label:entity.name,type:'实体'}],edges=[];const add=(id,label,type,from,relation)=>{if(!nodes.some(n=>n.id===id))nodes.push({id,label,type});edges.push({from,to:id,relation});};entity.aliases.forEach((a,i)=>add('alias-'+i,a,'别名',entity.id,'检索名称'));const ms=materials.filter(m=>m.entityId===entityId);for(const m of ms){add(m.id,m.name,'物料',entity.id,'规格映射');for(const s of stocks.filter(s=>s.materialId===m.id)){add(s.id,s.id+' · '+available(s)+'株可用','批次',m.id,'库存批次');const sup=suppliers.find(v=>v.id===s.supplierId);add(sup.id,sup.name,'供应商',s.id,'供苗');}for(const w of workOrders.filter(w=>w.materialId===m.id))add(w.id,w.id+' · '+w.task,'工单',m.id,'涉及');}entity.sourceIds.forEach(id=>add('source-'+id,sources.find(s=>s.id===id).publisher,'来源',entity.id,'名称依据'));return {nodes,edges};}
function query(text,options={}){
 const q=normalize(text),context={...(options.context||{})},disabled=new Set(options.disabled||[]),allowed=new Set(options.systems||systems.map(s=>s.id));
 const used=[],warnings=[],rows=[],sourceIds=new Set();let title='',answer='',type='knowledge',candidates=[];
 const use=id=>{if(!allowed.has(id)){warnings.push(systems.find(s=>s.id===id).name+'不在本次查询范围');return false;}if(disabled.has(id)){warnings.push(systems.find(s=>s.id===id).name+'快照暂不可用，本项未查询');return false;}used.push(id);return true;};
 if(!q)return {type:'empty',title:'请输入问题',answer:'可以输入植物别名、物料编号或公开项目名称。',rows,sourceIds:[],used,warnings,context};
 const resolution=resolve(text);let entity=resolution.status==='matched'?resolution.candidates[0]:null;
 if(resolution.status==='ambiguous'&&!options.chosenEntityId){const ready=use('knowledge');return {type:ready?'clarify':'unavailable',title:ready?'“'+resolution.alias+'”需要确认查询范围':'名称知识快照未参与查询',answer:ready?'该俗称在不同寄主语境下指向不同类群。请选择候选或补充植物名称；选择仅用于检索，不代表完成现场鉴定。':'恢复知识快照或扩大资料范围后，再进行俗称消歧。',candidates:ready?resolution.candidates:[],rows,sourceIds:ready?[...new Set(resolution.candidates.flatMap(e=>e.sourceIds))]:[],used,warnings,context,question:text};}
 if(options.chosenEntityId){entity=entities.find(e=>e.id===options.chosenEntityId);if(!entity)throw Error('未知的识别候选');}
 const materialHit=materials.find(m=>q.includes(normalize(m.id)));if(materialHit)entity=entities.find(e=>e.id===materialHit.entityId);
 if(!entity&&resolution.status==='missing'&&/刚才|这种|这些|这批|那批|它|该植物|那家/.test(q))entity=entities.find(e=>e.id===context.entityId);
 if(entity){if(context.entityId!==entity.id){delete context.materialId;delete context.supplierId;}context.entityId=entity.id;entity.sourceIds.forEach(s=>sourceIds.add(s));}
 const selectedMaterial=options.materialId||materialHit?.id;const ms=entity?materials.filter(m=>m.entityId===entity.id):[];
 const publicHit=/沣西|石家庄|中标|采购预算|公开项目/.test(q)||!entity&&/公开|养护项目/.test(q);
 if(publicHit){type='public';title='公开项目资料';if(use('public')){const ps=projects.filter(p=>p.kind==='public'&&(!/沣西/.test(q)||p.id==='PUBLIC-FX-01')&&(!/石家庄/.test(q)||p.id==='PUBLIC-SJZ'));for(const p of ps){rows.push({kind:'public',id:p.id,label:p.name,detail:p.amountType+' ¥'+p.amount.toLocaleString()+' · '+p.period,sourceIds:p.sourceIds});p.sourceIds.forEach(s=>sourceIds.add(s));}answer='已检索公告事实。采购预算和中标金额均不表示实际支付；本快照没有这些项目的真实履约工单。';}}
 else if(/成本|预算|多花|花费|费用|实际|v1|v2/.test(q)){type='cost';title='方案成本与发生口径';if(options.role==='designer'){warnings.push('当前为设计师视角演示，财务明细未展示；这不是生产权限系统。');answer='可查询公开项目金额，内部成本明细请切换评审视角演示。';}else if(use('erp')){const cs=costs.filter(c=>c.projectId===(options.projectId||'DEMO-PARK'));for(const c of cs)rows.push({kind:'cost',id:c.id,label:c.version+' · 企业演示成本包',detail:`预算¥${c.budget} / 已发生¥${c.actual} / 未转实际承诺¥${c.committed} / 完工预测¥${c.forecast}`,sourceIds:['SJZ']});if(cs.length>=2){const a=cs[0],b=cs[1];answer=`演示V2相对V1：完工预测增加¥${b.forecast-a.forecast}；已发生增加¥${b.actual-a.actual}；尚未转实际的承诺增加¥${b.committed-a.committed}。三种口径分别展示，不能把预测再次加到实际成本中。`;}else answer='所选项目没有已收录的V1/V2成本包；未借用其他项目的成本。';sourceIds.add('SJZ');}}
 else if(/供应商|供货商|那家|苗圃甲|苗圃乙/.test(q)){type='supplier';title='供应商与项目追溯';const explicit=suppliers.find(s=>q.includes(normalize(s.name))),sid=explicit?.id||context.supplierId;if(!sid){answer='请先选择供应商。可以从库存批次或报价记录进入，避免把多家供应商混成一家。';candidates=suppliers.map(s=>({id:s.id,name:s.name,type:'供应商'}));}else if(use('erp')){const s=suppliers.find(v=>v.id===sid);if(s){context.supplierId=s.id;answer=s.name+'的供苗记录关联如下演示项目。公开中标企业与这些演示供苗方相互独立。';if(use('care'))for(const w of workOrders.filter(w=>w.supplierId===sid))rows.push({kind:'work',id:w.id,label:projects.find(p=>p.id===w.projectId).name,detail:w.task+' · '+w.status,sourceIds:w.provenance.sourceIds});sourceIds.add('SJZ');}}}
 else if(/库存|有货|还有货|够|能不能|施工|交期|供应|报价|多少钱|价格|缺口|下月|有苗/.test(q)){type='inventory';title='需求、库存与供苗';if(!entity||!ms.length){answer='当前快照没有该对象的物料映射。请输入三角梅、扶桑或物料编号；缺少记录不等于库存为零。';}else if(!selectedMaterial&&ms.length>1){type='material';answer='已识别'+entity.name+'；存在多个花色物料，请确认规格后计算需求缺口。';candidates=ms.map(m=>({id:m.id,name:m.name,type:m.spec}));}else{const m=ms.find(m=>m.id===selectedMaterial)||ms[0];context.materialId=m.id;const projectId=options.projectId||'DEMO-PARK';const inv=inventory(m.id,projectId);if(use('nursery')){if(inv.need===0)warnings.push('所选演示项目未登记该物料需求，无法判断是否够用。');answer=`${m.name}：现存可用${inv.available}株，演示需求${inv.need}株，当前缺口${inv.gap}株；在途${inv.incoming}株中，${inv.deadline}前预计到货${inv.incomingBefore}株。${inv.need?`截至该日仍缺${inv.gapByDeadline}株。`:'需求未知，未作充足性结论。'}交期按快照日期解释。`;for(const s of inv.lots)rows.push({kind:'stock',id:s.id,label:s.nursery+' · '+suppliers.find(v=>v.id===s.supplierId).name,detail:`现存${s.physical} − 预留${s.reserved} − 隔离${s.blocked} = 可用${available(s)}株；在途${s.incoming}株${s.eta?' / '+s.eta:''}`,sourceIds:['SJZ']});}if(use('erp')){for(const p of quotes.filter(p=>p.materialId===m.id))rows.push({kind:'quote',id:p.id,label:suppliers.find(s=>s.id===p.supplierId).name,detail:`¥${p.price}/${m.unit} · ${p.tax} · ${p.freight} · 有效至${p.validUntil}${p.validUntil<snapshot.date?'（已过期，不能作为有效报价）':''}`,sourceIds:['SJZ']});}sourceIds.add('SJZ');}}
 else if(entity){type=/以前|历史|处理|工单|巡检|记录|复查|排查/.test(q)?'care':'knowledge';title=entity.name+(type==='care'?' · 知识与历史记录':' · 名称与知识');if(use('knowledge')){answer=entity.knowledge;rows.push({kind:'knowledge',id:entity.id,label:entity.name,detail:entity.note,sourceIds:entity.sourceIds});}if(type==='care'&&use('care')){const ws=workOrders.filter(w=>w.projectId===(options.projectId||'DEMO-PARK')&&(w.entityId===entity.id||['pest-mites','pest-citrus'].includes(entity.id)&&w.id==='WO-102'));ws.forEach(w=>rows.push({kind:'work',id:w.id,label:w.task,detail:w.date+' · '+w.status+' · '+w.result,sourceIds:w.provenance.sourceIds}));const records=publicRecords.filter(r=>r.entityId===entity.id);records.forEach(r=>{rows.push({kind:'public',id:r.id,label:r.task,detail:r.date+' · '+r.result+'（快照索引，非原始工单编号）',sourceIds:r.sourceIds});r.sourceIds.forEach(id=>sourceIds.add(id));});if(!ws.length)warnings.push('该对象没有已收录的演示工单；不推断现场未发生。');if(ws.length)sourceIds.add('SJZ');}}
 else {type='missing';title='快照中未找到可支持的回答';answer='未命中当前名称库或查询类型。可尝试植物别名、物料编号、公开项目、库存、历史工单或V1/V2成本；离线检索不生成无来源的答案。';}
 if(!answer)answer='本次没有取得可用记录；请检查查询范围和快照状态。';
 return {type,title,answer,entity,rows,candidates,sourceIds:[...sourceIds],used:[...new Set(used)],warnings,context,question:text,materialId:context.materialId};
}
function freeze(o){if(o&&typeof o==='object'){Object.freeze(o);Object.values(o).forEach(freeze);}return o;}
const api={snapshot,sources,entities,materials,suppliers,stocks,quotes,projects,publicRecords,workOrders,costs,systems,available,resolve,inventory,entityGraph,query};freeze(api);
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PlantSimEnterprise=api;
})(typeof window==='undefined'?globalThis:window);
