// Rebuild the video acquisition queue from the exact catalog offered in the app.
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8'),ctx={window:{location:{hostname:"localhost"}}};
vm.createContext(ctx);
vm.runInContext(html.slice(html.indexOf('const exerciseLibrary='),html.indexOf('function validExerciseName'))+';globalThis.essential=enrichPortugueseExercises(JSON.parse(globalThis.catalogJSON));',Object.assign(ctx,{catalogJSON:fs.readFileSync('exercise-library.json','utf8')}));
vm.runInContext(fs.readFileSync('exercise-media.js','utf8'),ctx);
const exercises=Array.from(ctx.essential,item=>{const video=ctx.window.PersonalProMedia.resolve(item).video;return {name:item.name,group:item.group,equipment:item.equipment||null,sourceId:item.sourceId||null,videoStatus:video?(video.previewOnly?'preview-only':'available'):'needed',...(video?{videoUrl:video.url,license:video.license,source:video.source}:{})}});
fs.writeFileSync('docs/research/essential-library-video-plan.json',JSON.stringify({scope:'130 selected exercises from the user list; six duplicate labels merged',selectionRule:'Exact movement, equipment and grip; commercial use permission required',total:exercises.length,withVideo:exercises.filter(x=>x.videoStatus!=='needed').length,exercises},null,2)+'\n');
console.log(JSON.stringify({total:exercises.length,withVideo:exercises.filter(x=>x.videoStatus!=='needed').length}));
