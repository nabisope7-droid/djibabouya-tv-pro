const STORE_ID = 1;
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_MEDIA_BYTES = 12 * 1024 * 1024;
const MAX_DATA_URL_CHARS = 17 * 1024 * 1024;
const MEDIA_CHUNK_BYTES = 1_500_000;

const DEFAULT_STATE = {
  home:"DJIBABOUYA", away:"KANSIDI", sh:0, sa:0, status:"DIRECT", extra:0, message:"",
  running:false, elapsed:0, startedAt:0, extraMode:false, extraElapsed:0, extraStartedAt:0,
  homeColor:"#ffffff", homeOutline:"#000000", homeBg:"#0964e8",
  awayColor:"#ffffff", awayOutline:"#000000", awayBg:"#f4c400",
  scoreColor:"#111111", scoreBg:"#ffffff", clockColor:"#ffffff", extraColor:"#ffffff",
  scoreVisible:true, scoreScale:100, scoreWidth:100, scoreHeight:100, mediaSize:100, scoreX:0, scoreY:12, scoreAttached:true,
  adImage:"", adVideo:"", adVideoDuration:0, adPublicationId:"",
  replayVideo:"", replayStartedAt:0, replayDuration:0, replayClipStart:0, replayClipEnd:0, replaySpeed:0.5, replayPublicationId:"",
  adTitle:"", adText:"", adTextColor:"#ffffff", adBgColor:"#1a1a1a", adStartedAt:0, adDuration:0,
  posterImage:"", posterStartedAt:0, posterPublicationId:"",
  subOutPhoto:"", subOutName:"", subOutNumber:"", subOutTeam:"",
  subInPhoto:"", subInName:"", subInNumber:"", subInTeam:"", subStartedAt:0, subDuration:0,
  goalEvents:[], goalReminderVisible:true, goalReminderDuration:12,
  compositionVisible:false, compositionFormation:"4-4-2", compositionTeam:"home", compositionPlayers:[], compositionPublicationId:"",
  updatedAt:0
};
const ALLOWED = new Set(Object.keys(DEFAULT_STATE));

function json(data,status=200,extra={}) {
  const h = new Headers({"content-type":"application/json; charset=utf-8","cache-control":"no-store, no-cache, must-revalidate, max-age=0","x-content-type-options":"nosniff"});
  for (const [k,v] of Object.entries(extra)) h.set(k,v);
  return new Response(JSON.stringify(data),{status,headers:h});
}
function corsHeaders() {
  return {"access-control-allow-origin":"*","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"Content-Type"};
}
function dataUrlParts(data) {
  const m = /^data:([^;,]+);base64,([\s\S]+)$/.exec(String(data||""));
  return m ? {mime:m[1], b64:m[2]} : null;
}
function decodeBase64(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
  return bytes;
}
function safeExt(mime) {
  const map={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/gif":"gif","video/mp4":"mp4","video/webm":"webm","video/quicktime":"mov"};
  return map[mime] || "bin";
}
function cleanState(input) {
  const out={...DEFAULT_STATE};
  if (!input || typeof input!=="object") return out;
  const text=new Set(["home","away","status","message","adTitle","adText","adPublicationId","replayPublicationId","posterPublicationId","subOutName","subOutNumber","subOutTeam","subInName","subInNumber","subInTeam","compositionFormation","compositionTeam","compositionPublicationId"]);
  const nums=new Set(["sh","sa","extra","elapsed","startedAt","extraElapsed","extraStartedAt","scoreScale","scoreWidth","scoreHeight","mediaSize","scoreX","scoreY","adStartedAt","adDuration","posterStartedAt","subStartedAt","subDuration","adVideoDuration","replayStartedAt","replayDuration","replayClipStart","replayClipEnd","replaySpeed","goalReminderDuration"]);
  const bools=new Set(["running","extraMode","scoreVisible","scoreAttached","goalReminderVisible","compositionVisible"]);
  const colors=new Set(["homeColor","homeOutline","homeBg","awayColor","awayOutline","awayBg","scoreColor","scoreBg","clockColor","extraColor","adTextColor","adBgColor"]);
  const media=new Set(["adImage","adVideo","replayVideo","posterImage","subOutPhoto","subInPhoto"]);
  for(const k of ALLOWED){
    if(!(k in input) || k==="updatedAt") continue;
    const v=input[k];
    if(text.has(k)) out[k]=String(v??"").slice(0,(k==="adText"||k==="message")?1000:160);
    else if(nums.has(k)){const n=Number(v);if(Number.isFinite(n))out[k]=n;}
    else if(bools.has(k)&&typeof v==="boolean")out[k]=v;
    else if(colors.has(k)&&typeof v==="string"&&/^#[0-9a-fA-F]{6}$/.test(v))out[k]=v;
    else if(media.has(k)&&typeof v==="string"&&v.length<=2048)out[k]=v; // only URLs after media migration
    else if(k==="goalEvents"&&Array.isArray(v))out[k]=v.slice(-6);
    else if(k==="compositionPlayers"&&Array.isArray(v))out[k]=v.slice(0,11);
  }
  out.sh=Math.max(0,Math.floor(out.sh)); out.sa=Math.max(0,Math.floor(out.sa));
  out.extra=Math.max(0,Math.min(99,Math.floor(out.extra)));
  out.scoreScale=Math.max(50,Math.min(150,Number(out.scoreScale)||100));
  out.scoreWidth=Math.max(50,Math.min(150,Number(out.scoreWidth)||100));
  out.scoreHeight=Math.max(50,Math.min(150,Number(out.scoreHeight)||100));
  out.mediaSize=Math.max(60,Math.min(160,Number(out.mediaSize)||100));
  out.scoreX=Math.max(0,Number(out.scoreX)||0); out.scoreY=Math.max(0,Number(out.scoreY)||12);
  out.adDuration=Math.max(0,Math.min(180,Math.floor(Number(out.adDuration)||0)));
  out.subDuration=Math.max(0,Math.min(30,Math.floor(Number(out.subDuration)||0)));
  out.adVideoDuration=Math.max(0,Math.min(120,Math.floor(Number(out.adVideoDuration)||0)));
  out.replayDuration=Math.max(0,Math.min(240,Math.floor(Number(out.replayDuration)||0)));
  out.replayClipStart=Math.max(0,Number(out.replayClipStart)||0);
  out.replayClipEnd=Math.max(out.replayClipStart,Number(out.replayClipEnd)||0);
  out.replaySpeed=Math.max(.25,Math.min(1,Number(out.replaySpeed)||.5));
  out.goalReminderDuration=Math.max(1,Math.min(60,Number(out.goalReminderDuration)||12));
  out.scoreAttached=true;
  out.goalEvents=(Array.isArray(out.goalEvents)?out.goalEvents:[]).map(ev=>({
    id:String(ev?.id||Date.now()),player:String(ev?.player||"").slice(0,80),
    minute:Math.max(0,Math.min(130,Number(ev?.minute)||0)),team:ev?.team==="away"?"away":"home",
    ball:ev?.ball!==false,playerColor:/^#[0-9a-fA-F]{6}$/.test(ev?.playerColor||"")?ev.playerColor:"#fff",
    ballColor:/^#[0-9a-fA-F]{6}$/.test(ev?.ballColor||"")?ev.ballColor:"#fff",
    teamColor:/^#[0-9a-fA-F]{6}$/.test(ev?.teamColor||"")?ev.teamColor:"#fff",
    bgColor:/^#[0-9a-fA-F]{6}$/.test(ev?.bgColor||"")?ev.bgColor:"#111111",createdAt:Number(ev?.createdAt)||Date.now()
  }));
  out.compositionPlayers=(Array.isArray(out.compositionPlayers)?out.compositionPlayers:[]).map(p=>({name:String(p?.name||"Joueur").slice(0,80),photo:typeof p?.photo==="string"&&p.photo.length<=2048?p.photo:""}));
  if(!["4-4-2","4-3-3","3-4-3","3-5-2","4-2-3-1","4-1-4-1","5-3-2","5-4-1"].includes(out.compositionFormation))out.compositionFormation="4-4-2";
  out.compositionTeam=out.compositionTeam==="away"?"away":"home";
  out.updatedAt=Date.now();
  return out;
}
async function validToken(env,token){
  if(!token)return false;
  const r=await env.DB.prepare("SELECT expires_at FROM admin_sessions WHERE token=?").bind(String(token)).first();
  if(!r || Number(r.expires_at)<=Date.now()){ if(r) await env.DB.prepare("DELETE FROM admin_sessions WHERE token=?").bind(String(token)).run(); return false; }
  return true;
}
async function getState(env){
  const r=await env.DB.prepare("SELECT state_json FROM app_state WHERE id=?").bind(STORE_ID).first();
  if(!r)return DEFAULT_STATE;
  try{return {...DEFAULT_STATE,...JSON.parse(r.state_json)}}catch{return DEFAULT_STATE}
}
async function saveState(env,state){
  await env.DB.prepare("INSERT INTO app_state(id,state_json,updated_at) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET state_json=excluded.state_json,updated_at=excluded.updated_at")
    .bind(STORE_ID,JSON.stringify(state),state.updatedAt).run();
}
async function handleStorage(request,env){
  if(request.method!=="GET")return json({error:"Méthode non autorisée"},405);
  const token=request.headers.get("x-admin-token")||new URL(request.url).searchParams.get("token");
  if(!(await validToken(env,token)))return json({error:"Session admin expirée ou invalide"},401);
  const r=await env.DB.prepare("SELECT COALESCE(SUM(size),0) AS media_bytes, COUNT(*) AS media_count FROM media_files").first();
  const stateRow=await env.DB.prepare("SELECT length(state_json) AS state_bytes FROM app_state WHERE id=?").bind(STORE_ID).first();
  const mediaBytes=Number(r?.media_bytes)||0;
  const stateBytes=Number(stateRow?.state_bytes)||0;
  const usedBytes=mediaBytes+stateBytes;
  const limitBytes=500*1024*1024;
  const percent=Math.min(100,(usedBytes/limitBytes)*100);
  return json({ok:true,usedBytes,mediaBytes,stateBytes,limitBytes,percent,mediaCount:Number(r?.media_count)||0,warning:percent>=100?"full":percent>=90?"critical":percent>=80?"warning":"ok"});
}
async function handleMedia(request,env){
  if(request.method!=="POST")return json({error:"Méthode non autorisée"},405);
  let body; try{body=await request.json()}catch{return json({error:"JSON invalide"},400)}
  if(!(await validToken(env,body.token)))return json({error:"Session admin expirée ou invalide"},401);
  if(typeof body.data!=="string" || body.data.length>MAX_DATA_URL_CHARS)return json({error:"Fichier média invalide ou trop volumineux"},400);
  const p=dataUrlParts(body.data);
  if(!p)return json({error:"Fichier média invalide"},400);
  if(!/^(image|video)\/(jpeg|png|webp|gif|mp4|webm|quicktime)$/.test(p.mime))return json({error:"Type média non autorisé"},415);
  let bytes; try{bytes=decodeBase64(p.b64)}catch{return json({error:"Encodage média invalide"},400)}
  if(bytes.byteLength>MAX_MEDIA_BYTES)return json({error:"Média trop volumineux (12 Mo maximum)."},413);
  const id=crypto.randomUUID();
  const ext=safeExt(p.mime);
  const key=`media/${id}.${ext}`;
  const chunkCount=Math.max(1,Math.ceil(bytes.byteLength/MEDIA_CHUNK_BYTES));
  try{
    const statements=[env.DB.prepare("INSERT INTO media_files(id,key,mime,size,chunk_count,created_at) VALUES(?,?,?,?,?,?)")
      .bind(id,key,p.mime,bytes.byteLength,chunkCount,Date.now())];
    for(let i=0;i<chunkCount;i++){
      const start=i*MEDIA_CHUNK_BYTES;
      const chunk=bytes.slice(start,Math.min(start+MEDIA_CHUNK_BYTES,bytes.byteLength));
      statements.push(env.DB.prepare("INSERT INTO media_chunks(media_id,chunk_index,data) VALUES(?,?,?)").bind(id,i,chunk.buffer));
    }
    await env.DB.batch(statements);
  }catch(err){
    try{await env.DB.prepare("DELETE FROM media_chunks WHERE media_id=?").bind(id).run();await env.DB.prepare("DELETE FROM media_files WHERE id=?").bind(id).run();}catch{}
    return json({error:"Impossible d’enregistrer le média dans D1",detail:String(err?.message||err)},500);
  }
  return json({ok:true,url:`/media/${key}`},200);
}

function parseRangeHeader(header,size){
  if(!header || !/^bytes=\d*-\d*$/.test(header))return null;
  const raw=header.slice(6);
  if(raw.includes(","))return null;
  const [a,b]=raw.split("-");
  let start,end;
  if(a===""){
    const suffix=Number(b); if(!Number.isFinite(suffix)||suffix<=0)return null;
    start=Math.max(0,size-suffix); end=size-1;
  }else{
    start=Number(a); if(!Number.isInteger(start)||start<0||start>=size)return "invalid";
    end=b===""?size-1:Number(b);
    if(!Number.isInteger(end)||end<start) return "invalid";
    end=Math.min(end,size-1);
  }
  return {start,end};
}
async function readMediaBytes(env,file){
  const rows=await env.DB.prepare(
    "SELECT chunk_index,data FROM media_chunks WHERE media_id=? ORDER BY chunk_index ASC"
  ).bind(file.id).all();

  const out=new Uint8Array(file.size);
  let offset=0;

  for(const row of (rows.results||[])){
    const data=row.data;
    const chunk=data instanceof Uint8Array?data:new Uint8Array(data||[]);
    out.set(chunk,offset);
    offset+=chunk.byteLength;
  }

  if(offset!==file.size)throw new Error("Média incomplet");
  return out;
}

async function readMediaRange(env,file,start,end){
  const firstChunk=Math.floor(start/MEDIA_CHUNK_BYTES);
  const lastChunk=Math.floor(end/MEDIA_CHUNK_BYTES);

  const rows=await env.DB.prepare(
    "SELECT chunk_index,data FROM media_chunks WHERE media_id=? AND chunk_index BETWEEN ? AND ? ORDER BY chunk_index ASC"
  ).bind(file.id,firstChunk,lastChunk).all();

  const out=new Uint8Array(end-start+1);

  for(const row of (rows.results||[])){
    const data=row.data;
    const chunk=data instanceof Uint8Array?data:new Uint8Array(data||[]);

    const chunkStart=Number(row.chunk_index)*MEDIA_CHUNK_BYTES;
    const chunkEnd=chunkStart+chunk.byteLength-1;

    const from=Math.max(start,chunkStart);
    const to=Math.min(end,chunkEnd);

    if(to<from)continue;

    const part=chunk.slice(
      from-chunkStart,
      to-chunkStart+1
    );

    out.set(part,from-start);
  }

  return out;
}

async function handleMediaGet(request,env,key){
  if(request.method!=="GET"&&request.method!=="HEAD"){
    return new Response("Méthode non autorisée",{status:405});
  }

  const file=await env.DB.prepare(
    "SELECT id,key,mime,size FROM media_files WHERE key=? LIMIT 1"
  ).bind(key).first();

  if(!file){
    return new Response("Média introuvable",{
      status:404,
      headers:{"content-type":"text/plain"}
    });
  }

  const common={
    "content-type":file.mime,
    "cache-control":"public, max-age=31536000, immutable",
    "accept-ranges":"bytes",
    "etag":`W/"${file.id}-${file.size}"`,
    "x-content-type-options":"nosniff"
  };

  if(request.method==="HEAD"){
    return new Response(null,{
      status:200,
      headers:{
        ...common,
        "content-length":String(file.size)
      }
    });
  }

  const range=parseRangeHeader(
    request.headers.get("range"),
    file.size
  );

  if(range==="invalid"){
    return new Response(null,{
      status:416,
      headers:{
        ...common,
        "content-range":`bytes */${file.size}`
      }
    });
  }

  try{
    if(range){
      const part=await readMediaRange(
        env,
        file,
        range.start,
        range.end
      );

      return new Response(part,{
        status:206,
        headers:{
          ...common,
          "content-range":`bytes ${range.start}-${range.end}/${file.size}`,
          "content-length":String(part.byteLength)
        }
      });
    }

    const bytes=await readMediaBytes(env,file);

    return new Response(bytes,{
      status:200,
      headers:{
        ...common,
        "content-length":String(file.size)
      }
    });
  }catch(err){
    return new Response("Média illisible",{
      status:500,
      headers:common
    });
  }
}async function handleMediaDelete(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Méthode non autorisée" }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON invalide" }, 400);
  }

  if (!(await validToken(env, body.token))) {
    return json({ error: "Session admin expirée ou invalide" }, 401);
  }

  const key = String(body.key || "").trim();
  if (!key) {
    return json({ error: "Média invalide" }, 400);
  }

  const file = await env.DB
    .prepare("SELECT id FROM media_files WHERE key=? LIMIT 1")
    .bind(key)
    .first();

  if (!file) {
    return json({ error: "Média introuvable" }, 404);
  }

  try {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM media_chunks WHERE media_id=?").bind(file.id),
      env.DB.prepare("DELETE FROM media_files WHERE id=?").bind(file.id)
    ]);

    return json({ ok: true }, 200);
  } catch (err) {
    return json({
      error: "Impossible de supprimer le média",
      detail: String(err?.message || err)
    }, 500);
  }
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(request.method==="OPTIONS")return new Response(null,{status:204,headers:corsHeaders()});
    try{
      if(url.pathname==="/api/state"){
        if(request.method==="GET")return json(await getState(env),200,corsHeaders());
        if(request.method!=="POST")return json({error:"Méthode non autorisée"},405,corsHeaders());
        let body;try{body=await request.json()}catch{return json({error:"JSON invalide"},400,corsHeaders())}
        if(body.action==="auth"){
          if(!env.ADMIN_PASSWORD)return json({error:"ADMIN_PASSWORD non configuré dans Cloudflare."},500,corsHeaders());
          if(String(body.password||"")!==String(env.ADMIN_PASSWORD))return json({ok:false,error:"Mot de passe incorrect"},401,corsHeaders());
          const token=crypto.randomUUID(); await env.DB.prepare("INSERT INTO admin_sessions(token,expires_at) VALUES(?,?)").bind(token,Date.now()+TOKEN_TTL_MS).run();
          return json({ok:true,token},200,corsHeaders());
        }
        if(!(await validToken(env,body.token)))return json({ok:false,error:"Session admin expirée ou invalide"},401,corsHeaders());
        if(body.action==="save"){
          const previous=await getState(env), next=cleanState(body.state);
          if(previous.adPublicationId&&previous.adPublicationId===next.adPublicationId)next.adStartedAt=previous.adStartedAt||next.adStartedAt;
          if(previous.replayPublicationId&&previous.replayPublicationId===next.replayPublicationId)next.replayStartedAt=previous.replayStartedAt||next.replayStartedAt;
          await saveState(env,next); return json({ok:true,state:next},200,corsHeaders());
        }
        return json({ok:false,error:"Action inconnue"},400,corsHeaders());
      }
      if(url.pathname==="/api/media")return handleMedia(request,env);  
      if(url.pathname==="/api/media/delete")return handleMediaDelete(request,env);
      if(url.pathname==="/api/storage")return handleStorage(request,env);
      if(url.pathname.startsWith("/media/")&&(request.method==="GET"||request.method==="HEAD")){
        const key=decodeURIComponent(url.pathname.slice("/media/".length)); return handleMediaGet(request,env,key);
      }
      return env.ASSETS.fetch(request);
    }catch(e){
      console.error("DJIBABOUYA TV Cloudflare Worker:",e);
      return json({ok:false,error:"Erreur serveur Cloudflare"},500,corsHeaders());
    }
  }
};
