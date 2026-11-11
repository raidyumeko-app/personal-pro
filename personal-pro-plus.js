/* Personal Pro+ — read-only entitlement evaluation.
 * Only server-controlled app_metadata may unlock premium features.
 * This module does not initiate payments or change subscription status. */
(function(root){'use strict';
const PRODUCT='personal_pro_plus';
function status(user,now=Date.now()){
  const sub=user&&user.app_metadata&&user.app_metadata.personal_pro_plus;
  const expiry=sub&&typeof sub.current_period_end==='string'?Date.parse(sub.current_period_end):NaN;
  const active=Boolean(user&&user.id&&sub&&sub.product===PRODUCT&&
    (sub.status==='active'||sub.status==='trialing')&&Number.isFinite(expiry)&&expiry>now);
  return Object.freeze({active,product:PRODUCT,expiresAt:active?new Date(expiry).toISOString():null});
}
function fromEntitlements(rows,now=Date.now()){return Boolean(Array.isArray(rows)&&rows.some(row=>row.product===PRODUCT&&Number.isFinite(Date.parse(row.valid_until))&&Date.parse(row.valid_until)>now));}
function isAllowed(user,feature,now){
  // Regra de 11/11/2026: a área de treino do aluno é gratuita; só a nutrição extra é Personal Pro+.
  // The current portal gets trial/paid access from pp_student_access, never client metadata.
  if(['training','workout-session','history','parq','basic-assessment','own-data','body-silhouette','measurement-comparison','evolution-charts','nutrition-view'].includes(feature))return Boolean(user&&user.id);
  if(['nutrition','nutrition-diary','nutrition-photos','nutrition-water','nutrition-import'].includes(feature))return status(user,now).active;
  return false;
}
root.PersonalProPlus=Object.freeze({status,isAllowed,fromEntitlements,monthlyPriceBRL:4.90,product:PRODUCT});
})(window);
