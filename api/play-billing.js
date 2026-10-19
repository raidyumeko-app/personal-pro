/* Server-only Google Play verification. Missing configuration fails closed. */
const {createSign,createHash}=require('node:crypto');
const json=(res,status,data)=>{res.setHeader('Cache-Control','no-store');return res.status(status).json(data)};
const hash=text=>createHash('sha256').update(text).digest('hex');
async function checked(url,options){const r=await fetch(url,{...options,signal:AbortSignal.timeout(15000)});const text=await r.text();let data;try{data=text?JSON.parse(text):{}}catch{throw Error('Resposta inválida do provedor')};if(!r.ok)throw Error('Falha na validação com o provedor');return data}
async function googleToken(account){const b64=value=>Buffer.from(JSON.stringify(value)).toString('base64url'),now=Math.floor(Date.now()/1000),body=b64({alg:'RS256',typ:'JWT'})+'.'+b64({iss:account.client_email,scope:'https://www.googleapis.com/auth/androidpublisher',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});const signer=createSign('RSA-SHA256');signer.update(body);signer.end();const assertion=body+'.'+signer.sign(account.private_key).toString('base64url');return (await checked('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})})).access_token}
function validatePurchase(purchase,productId,userId,now=Date.now()){
 if(!['SUBSCRIPTION_STATE_ACTIVE','SUBSCRIPTION_STATE_IN_GRACE_PERIOD','SUBSCRIPTION_STATE_CANCELED'].includes(purchase.subscriptionState))throw Error('Assinatura sem acesso ativo');
 if(purchase.externalAccountIdentifiers?.obfuscatedExternalAccountId!==hash(userId))throw Error('Compra não pertence à conta autenticada');
 const item=(purchase.lineItems||[]).filter(x=>x.productId===productId&&Date.parse(x.expiryTime)>now).sort((a,b)=>Date.parse(b.expiryTime)-Date.parse(a.expiryTime))[0];
 if(!item||!Number.isFinite(Date.parse(purchase.startTime)))throw Error('Produto ou validade inválidos');
 return {until:item.expiryTime,start:purchase.startTime};
}
async function handler(req,res){
 if(req.method!=='POST'){res.setHeader('Allow','POST');return json(res,405,{error:'Método não permitido'})}
 const env=process.env,required=['GOOGLE_PLAY_SERVICE_ACCOUNT_JSON','ANDROID_PACKAGE_NAME','PLAY_TRAINER_PRODUCT_ID','PLAY_STUDENT_PLUS_PRODUCT_ID','SUPABASE_SERVICE_ROLE_KEY'];
 if(required.some(k=>!env[k]))return json(res,503,{error:'Integração Google Play indisponível. Nenhuma compra foi confirmada.'});
 const authorization=req.headers.authorization||'';if(!authorization.startsWith('Bearer '))return json(res,401,{error:'Autenticação necessária'});
 const {purchaseToken,product}=req.body||{};if(!['trainer','personal_pro_plus'].includes(product)||typeof purchaseToken!=='string'||!purchaseToken||purchaseToken.length>4096)return json(res,400,{error:'Compra inválida'});
 const url='https://lnlwkjsfcpeofhajqesh.supabase.co',key='sb_publishable_6pdzzn9QCSJTcZSF60NuBA_gC02pygI';
 let user;try{user=await checked(url+'/auth/v1/user',{headers:{apikey:key,Authorization:authorization}})}catch{return json(res,401,{error:'Sessão inválida'})}
 try{
  const productId=product==='trainer'?env.PLAY_TRAINER_PRODUCT_ID:env.PLAY_STUDENT_PLUS_PRODUCT_ID,token=await googleToken(JSON.parse(env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON));
  const base='https://androidpublisher.googleapis.com/androidpublisher/v3/applications/'+encodeURIComponent(env.ANDROID_PACKAGE_NAME)+'/purchases/';
  const purchase=await checked(base+'subscriptionsv2/tokens/'+encodeURIComponent(purchaseToken),{headers:{Authorization:'Bearer '+token}});
  const validity=validatePurchase(purchase,productId,user.id);
  if(purchase.acknowledgementState!=='ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED')await checked(base+'subscriptions/'+encodeURIComponent(productId)+'/tokens/'+encodeURIComponent(purchaseToken)+':acknowledge',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:'{}'});
  const result=await checked(url+'/rest/v1/rpc/pp_record_verified_purchase',{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY,Authorization:'Bearer '+env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({p_user:user.id,p_product:product,p_token_hash:hash(purchaseToken),p_start:validity.start,p_end:validity.until})});
  return json(res,200,{verified:true,product,validUntil:validity.until,benefit:result});
 }catch{return json(res,422,{error:'Não foi possível validar esta assinatura. Nenhum acesso foi ativado.'})}
}
module.exports=handler;module.exports.validatePurchase=validatePurchase;
