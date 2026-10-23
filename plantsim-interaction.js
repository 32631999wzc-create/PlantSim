/* Independent local draft store; business snapshots remain immutable. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PlantSimInteraction=factory();})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const key='plantsim.interaction.drafts.v1';
 function read(storage){const raw=storage.getItem(key);if(!raw)return {};const d=JSON.parse(raw);if(!d||d.version!==1||!d.items||typeof d.items!=='object'||Array.isArray(d.items))throw Error('草稿数据损坏，未覆盖原数据；请先导出备份。');return d.items;}
 function put(storage,id,values){const items=read(storage);items[id]={values,updatedAt:new Date().toISOString()};storage.setItem(key,JSON.stringify({version:1,items}));return items[id];}
 function remove(storage,id){const items=read(storage);delete items[id];storage.setItem(key,JSON.stringify({version:1,items}));}
 const draftKey=(project,kind,object)=>[project,kind,object].map(encodeURIComponent).join(':');
 return Object.freeze({key,read,put,remove,draftKey});
});
