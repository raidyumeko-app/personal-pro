/* Only resolve identities already present in a saved prescription; never offer archive entries as choices. */
(function(root){'use strict';
async function forWorkouts(catalog,translations,workouts,fetcher=root.fetch.bind(root)){
 const ids=new Set(catalog.map(x=>x.id)),needed=new Set((workouts||[]).map(x=>x.sourceId).filter(id=>id&&!ids.has(id)));
 if(!needed.size)return {catalog,translations};
 try{
  const responses=await Promise.all(['/docs/compatibility/exercise-source-archive.json','/docs/compatibility/exercise-instructions-archive.pt.json'].map(url=>fetcher(url)));
  if(responses.some(r=>!r.ok))return {catalog,translations};
  const [archive,steps]=await Promise.all(responses.map(r=>r.json()));
  const referenced=archive.filter(x=>needed.has(x.id));
  return {catalog:[...catalog,...referenced],translations:{...Object.fromEntries(referenced.map(x=>[x.id,steps[x.id]])),...translations}};
 }catch{return {catalog,translations}}
}
root.PersonalProExerciseCompatibility={forWorkouts};
})(window);
