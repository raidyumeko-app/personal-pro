const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function boot(host = 'localhost') {
  const window = {location:{hostname:host}};
  for (const file of ['exercise-media.js','personal-pro-generated-videos.js','personal-pro-ymove-verified.js']) {
    vm.runInNewContext(fs.readFileSync(file,'utf8'),{window});
  }
  return window;
}
test('all generated clips remain available for audit but never become exercise demonstrations', () => {
  const root=boot(), catalog=JSON.parse(fs.readFileSync('exercise-library.json'));
  assert.equal(root.PersonalProGeneratedVideos.items.length,49);
  for (const item of root.PersonalProGeneratedVideos.items) {
    assert.equal(item.linkAllowed,false,item.name);
    const ex={sourceId:'unverified-'+item.id,name:item.appName||item.name,series:'4',rest:90};
    const result=root.PersonalProMedia.resolve(ex);
    assert.equal(result.video,undefined,item.name);
    assert.equal(result.series,'4'); assert.equal(result.rest,90);
  }
  for (const ex of catalog) {
    const result=root.PersonalProMedia.resolve(ex);
    assert.ok(!/artlist/.test(result.video?.url||''),ex.name);
    assert.notEqual(result.generatedVideoReviewPending,true,ex.name);
  }
});
test('YMove unilateral pulldown is never attached to a V-bar prescription', () => {
  for (const host of ['localhost','personal-123456789-raidyumeko-9261.vercel.app','personalpro.app']) {
    const media=boot(host).PersonalProMedia;
    for (const name of ['Puxada com pegada neutra','Puxada com triângulo','Puxada unilateral na polia']) {
      assert.ok(!/5971eaa2/.test(media.resolve({sourceId:'V-Bar_Pulldown',name}).video?.url||''));
    }
    assert.match(media.resolve({sourceId:'selected-puxada-unilateral-na-polia',name:'Puxada unilateral na polia'}).video.url,/5971eaa2/);
    assert.ok(!/d3fece95/.test(media.resolve({sourceId:'One-Arm_Dumbbell_Row',name:'Remada unilateral com halter'}).video?.url||''));
  }
});
test('goblet dumbbell and kettlebell prescriptions retain their own equipment and media', () => {
  const root=boot();
  for (const ex of [{sourceId:'Goblet_Squat',name:'Agachamento goblet',equipment:'Halteres'}, {sourceId:'Goblet_Squat',name:'Agachamento goblet com halter'}]) {
    const result=root.PersonalProMedia.resolve(ex);
    assert.match(result.video.url,/a2a797d0/);
    assert.equal(result.images[0],result.poster);
  }
  assert.match(root.PersonalProMedia.resolve({sourceId:'Goblet_Squat',name:'Agachamento goblet com kettlebell',equipment:'Kettlebell'}).video.url,/198d4a7d/);
});
test('verified overlays preserve prescriptions and every clip uses the official source', () => {
  const root=boot(); assert.equal(root.PersonalProVerifiedYMove.clips.length,14);
  for (const clip of root.PersonalProVerifiedYMove.clips) {
    const ex={sourceId:clip.sourceId,name:clip.name,series:'3',repetitions:'8',rest:120,load:'24 kg'};
    const result=root.PersonalProMedia.resolve(ex);
    assert.equal(result.video.url,clip.url);
    assert.match(result.video.url,/^https:\/\/ymove.app\/api\/free\//);
    for (const key of ['series','repetitions','rest','load']) assert.equal(result[key],ex[key]);
  }
});
