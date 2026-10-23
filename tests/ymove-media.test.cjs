const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function boot(host='localhost'){
 const window={location:{hostname:host},PersonalProUI:{Icon(){}}};
 for(const path of ['exercise-media.js','personal-pro-generated-videos.js'])vm.runInNewContext(fs.readFileSync(path,'utf8'),{window});
 return window;
}
test('YMove reference clips are not included in active exercise media',()=>{
 const source=fs.readFileSync('exercise-media.js','utf8');
 assert.equal(source.includes('https://ymove.app/api/free/'),false);
 const media=boot().PersonalProMedia;
 assert.equal(media.entries.length,8);
 assert.ok(media.entries.every(item=>!/ymove\.app/i.test(item.video?.url||'')));
 for(const ex of JSON.parse(fs.readFileSync('exercise-library.json','utf8'))){
   const result=media.resolve(ex);
   assert.ok(!/ymove\.app/i.test(result.video?.url||''),ex.name);
   assert.ok(!/ymove\.app/i.test(result.poster||''),ex.name);
 }
});
test('original YMove videos are stripped from old prescribed media without changing prescription',()=>{
 const media=boot().PersonalProMedia;
 const source='https://ymove.app/api/free/af0c3d19-5ee2-4a19-8688-f8504bb33e3c';
 const old={id:'old',name:'Cadeira extensora',load:'42.5 kg',rest:75,poster:source+'?type=thumbnail',images:[source+'?type=thumbnail','/media/safe.jpg'],video:{url:source,author:'YMove / Your Move',licensed:true}};
 const result=media.resolve(old);
 assert.equal(result.video,undefined);
 assert.equal(result.poster,null);
 assert.equal(result.images.length,1);
 assert.equal(result.images[0],'/media/safe.jpg');
 assert.equal(result.load,'42.5 kg');
 assert.equal(result.rest,75);
 assert.equal(result.originalYMoveVideo,false);
});
test('only generated Personal Pro videos remain for mapped exercise IDs',()=>{
 const root=boot(),item=root.PersonalProGeneratedVideos.forExercise('Hammer_Curls')[0];
 assert.ok(item&&item.linkAllowed);
 const e=root.PersonalProMedia.resolve({sourceId:'Hammer_Curls',name:'Rosca martelo',series:'3',rest:90});
 assert.equal(e.video.generationId,item.id);
 assert.equal(e.video.url,item.url);
 assert.ok(!e.video.url.includes('ymove.app'));
 assert.equal(e.series,'3');
 assert.equal(e.rest,90);
});
test('app and review pages never load or play original YMove videos',()=>{
 for(const page of ['index.html','video-preview.html','videos-gerados.html']){
   const html=fs.readFileSync(page,'utf8');
   assert.ok(!html.includes('personal-pro-ymove-verified.js'),page);
   assert.ok(!html.includes('ymove.app/api/free'),page);
 }
 const gallery=fs.readFileSync('videos-gerados.html','utf8');
 assert.ok(!gallery.includes('renderYMove'));
 assert.ok(!gallery.includes('ymove-grid'));
});
