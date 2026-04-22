import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

const Portal=({inst:init,onUpdate,onLogout,reviews,onFlag})=>{
  const [form,setForm]=useState(init);
  const [tab,setTab]=useState('home');
  const [editing,setEditing]=useState(false);
  const [dvsa,setDvsa]=useState({status:'idle',result:null});
  const [dref,setDref]=useState(init.dvsaRef||'');
  useEffect(()=>setForm(init),[init]);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const tog=(k,v)=>setForm(p=>{const a=Array.isArray(p[k])?p[k]:[];return{...p,[k]:a.includes(v)?a.filter(x=>x!==v):[...a,v]};});
  const ps=calcPS(form);
  const ra=RAVG(form.post);
  const psCol=scCol(ps);

  const verifyDVSA=async()=>{
    setDvsa({status:'loading',result:null});
    const r=await simDVSA(dref);
    setDvsa({status:'done',result:r});
    if(r.ok){onUpdate({...form,verified:true,dvsaRef:dref});setForm(p=>({...p,verified:true,dvsaRef:dref}));}
  };

  const TABS=[
    {v:'home',      l:'Home'},
    {v:'enquiries', l:'Enquiries'},
    {v:'profile',   l:'Profile'},
    {v:'dvsa',      l:'DVSA'},
    {v:'subs',      l:'Upgrade'},
  ];

  const mockEnquiries=[
    {id:1,from:'Emma T.',msg:"Hi, I'm looking for weekday evening lessons. Do you have availability?",time:'2 hours ago',unread:true,date:'Mon 23rd'},
    {id:2,from:'Jordan K.',msg:'Can you do an intensive course in 2 weeks? Need my licence for a new job.',time:'Yesterday',unread:true,date:'Sun 22nd'},
    {id:3,from:'Marcus B.',msg:'Just passed with you — wanted to say thank you so much!',time:'3 days ago',unread:false,date:'Fri 20th'},
  ];
  const unread=mockEnquiries.filter(e=>e.unread).length;

  return<div className="page" style={{background:'#ffffff',minHeight:'100svh'}}>

    {/* ── PORTAL HEADER (replaces double header issue) ── */}
    <div style={{background:'#0a1628',padding:'20px 16px 0'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
            <span style={{fontSize:20,fontWeight:900,color:'#fff',letterSpacing:'-.02em'}}>
              Passd<span style={{color:'#1d6ff3'}}>.</span>
            </span>
            <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',letterSpacing:'.08em',textTransform:'uppercase',background:'rgba(255,255,255,.1)',padding:'2px 8px',borderRadius:4}}>Instructor</span>
          </div>
          <div style={{fontSize:14,color:'rgba(255,255,255,.5)'}}>{form.name}</div>
        </div>
        <button className="btn btn-sm" style={{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',border:'1px solid rgba(255,255,255,.2)',flexShrink:0}} onClick={onLogout}>
          Sign out
        </button>
      </div>

      {/* Tab bar inside navy header */}
      <div style={{display:'flex',gap:0,overflowX:'auto',scrollbarWidth:'none',marginLeft:-16,marginRight:-16,paddingLeft:16}}>
        {TABS.map(({v,l})=>(
          <button key={v} onClick={()=>setTab(v)} style={{
            padding:'11px 16px',background:'none',border:'none',
            borderBottom:`2.5px solid ${tab===v?'#4fffb0':'transparent'}`,
            color:tab===v?'#fff':'rgba(255,255,255,.45)',
            fontWeight:700,fontSize:14,cursor:'pointer',whiteSpace:'nowrap',
            fontFamily:'inherit',position:'relative',flexShrink:0,
          }}>
            {l}
            {v==='enquiries'&&unread>0&&<span style={{position:'absolute',top:8,right:8,width:8,height:8,borderRadius:'50%',background:'#4fffb0'}}/>}
          </button>
        ))}
      </div>
    </div>

    <div style={{padding:'16px',background:'#ffffff'}}>

      {/* ════ HOME TAB — outcome dashboard ════ */}
      {tab==='home'&&<>

        {/* PassScore + tier status */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          <div className="card" style={{padding:'16px'}}>
            <div className="slbl">Your PassScore</div>
            <div style={{fontSize:32,fontWeight:900,color:psCol,letterSpacing:'-.03em',lineHeight:1,marginTop:4}}>{ps}</div>
            <div style={{fontSize:12,color:'#64748b',marginTop:4}}>out of 100</div>
            <div style={{marginTop:8}}><Bench rate={form.rate} avg={ra}/></div>
          </div>
          <div className="card" style={{padding:'16px'}}>
            <div className="slbl">Plan</div>
            <div style={{fontSize:20,fontWeight:800,letterSpacing:'-.02em',marginTop:4}}>{form.tier}</div>
            <div style={{fontSize:12,color:'#475569',marginTop:4,lineHeight:1.5}}>
              {form.tier==='Premium'?'Top 3 guaranteed':form.tier==='Verified'?'Verified badge active':'Limited visibility'}
            </div>
            {form.tier!=='Premium'&&<button className="btn btn-p btn-sm" style={{marginTop:10,width:'100%'}} onClick={()=>setTab('subs')}>Upgrade</button>}
          </div>
        </div>

        {/* Unread enquiries alert */}
        {unread>0&&<div style={{background:'#e8f0fd',border:'1px solid #1d6ff3',borderRadius:14,padding:'14px 16px',marginBottom:12,cursor:'pointer'}} onClick={()=>setTab('enquiries')}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>
                {unread} new {unread===1?'enquiry':'enquiries'}
              </div>
              <div style={{fontSize:13,color:'#475569'}}>Tap to view and reply</div>
            </div>
            <div style={{width:40,height:40,borderRadius:'50%',background:'#1d6ff3',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,flexShrink:0}}>{unread}</div>
          </div>
        </div>}

        {/* New reviews alert */}
        {(reviews||[]).filter(r=>r.status==='pending').length>0&&(
          <div style={{background:'#fef3c7',border:'1px solid rgba(217,119,6,.3)',borderRadius:14,padding:'14px 16px',marginBottom:12}}>
            <div style={{fontWeight:700,fontSize:14,color:'#d97706',marginBottom:3}}>
              {(reviews||[]).filter(r=>r.status==='pending').length} review{(reviews||[]).filter(r=>r.status==='pending').length>1?'s':''} pending
            </div>
            <div style={{fontSize:13,color:'#475569',marginBottom:8}}>Will publish in 24 hours unless you flag inaccuracies.</div>
            {(reviews||[]).filter(r=>r.status==='pending').map(r=>(
              <div key={r.id} style={{background:'#ffffff',borderRadius:10,padding:'12px',marginBottom:6}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{r.author}</div>
                    <Stars r={r.rating} sz={11}/>
                  </div>
                  <button className="btn btn-sm" style={{background:'#fee2e2',color:'#dc2626',border:'1px solid rgba(220,38,38,.2)',height:32,fontSize:12,flexShrink:0}}
                    onClick={()=>onFlag&&onFlag(r.id)}>
                    Flag review
                  </button>
                </div>
                <p style={{fontSize:13,color:'#475569',lineHeight:1.5}}>{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Key metrics */}
        <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>This month</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
          {[
            {l:'Profile views', v:'342', sub:'+18% vs last month', c:'#1d6ff3'},
            {l:'Enquiries',     v:'28',  sub:'5 this week',        c:'#0f1724'},
            {l:'Pass rate',     v:`${form.passRate}%`, sub:form.passRate>=90?'Excellent':'Good', c:form.passRate>=90?'#16a34a':'#1d6ff3'},
            {l:'Your rate',     v:`£${form.rate}`,    sub:`Area avg £${ra}/hr`,  c:'#0f1724'},
          ].map(({l,v,sub,c})=>(
            <div key={l} className="card" style={{padding:'14px'}}>
              <div className="slbl">{l}</div>
              <div style={{fontSize:22,fontWeight:800,color:c,letterSpacing:'-.02em',lineHeight:1,marginTop:4}}>{v}</div>
              <div style={{fontSize:11,color:'#64748b',marginTop:4}}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Profile status */}
        <div className="card" style={{padding:'16px',marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>Profile health</div>
          {[
            {l:'DVSA verified',      ok:form.verified,    fix:'dvsa',    msg:'Learners filter by verified instructors'},
            {l:'Bio written',        ok:form.bio?.length>20, fix:'profile', msg:'Tell learners why to choose you'},
            {l:'Pass rate set',      ok:form.passRate>0,  fix:'profile', msg:'Pass rate is your strongest selling point'},
            {l:'Specialist support', ok:Array.isArray(form.support)&&form.support.length>0, fix:'profile', msg:'Filter for ADHD, anxious drivers etc.'},
          ].map(({l,ok,fix,msg})=>(
            <div key={l} style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
              <div style={{width:22,height:22,borderRadius:'50%',background:ok?'#dcfce7':'#fee2e2',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <span style={{fontSize:12,color:ok?'#16a34a':'#dc2626',fontWeight:700}}>{ok?'✓':'!'}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:ok?'#0f1724':'#475569'}}>{l}</div>
                {!ok&&<div style={{fontSize:12,color:'#64748b'}}>{msg}</div>}
              </div>
              {!ok&&<button className="btn btn-gh btn-sm" style={{flexShrink:0}} onClick={()=>setTab(fix)}>Fix</button>}
            </div>
          ))}
        </div>

        {/* Rate vs area tip */}
        {form.rate>ra&&<div className="cl cl-a" style={{marginBottom:12,fontSize:13}}>
          <strong>Quick win:</strong> Your rate (£{form.rate}/hr) is £{form.rate-ra} above the local average (£{ra}/hr). Dropping to £{ra-1} would move you into the top price tier.
        </div>}
        {form.rate<=ra&&<div className="cl cl-g" style={{marginBottom:12,fontSize:13}}>
          <strong>Great position:</strong> Your rate (£{form.rate}/hr) is at or below the local average (£{ra}/hr). You rank highly on price.
        </div>}

        {/* Upgrade nudge for non-premium */}
        {form.tier!=='Premium'&&<div style={{background:'#0a1628',borderRadius:14,padding:'18px',marginBottom:8}}>
          <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:6}}>Unlock top 3 placement</div>
          <p style={{fontSize:13,color:'rgba(255,255,255,.5)',lineHeight:1.6,marginBottom:12}}>
            Premium guarantees your profile in positions 1–3 on every search in your postcode. Hard-capped at 3 instructors per area.
          </p>
          <div style={{fontSize:13,fontWeight:700,color:'#4fffb0',marginBottom:12}}>£19.99/mo · Founder price · Cancel anytime</div>
          <button className="btn btn-full" style={{background:'#4fffb0',color:'#0a1628',fontWeight:800,height:46}} onClick={()=>setTab('subs')}>
            Claim your slot →
          </button>
        </div>}
      </>}

      {/* ════ ENQUIRIES TAB ════ */}
      {tab==='enquiries'&&<>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <h2 style={{fontSize:18,fontWeight:700}}>Enquiries</h2>
          {unread>0&&<span className="chip chip-b">{unread} unread</span>}
        </div>
        {mockEnquiries.map(eq=>(
          <div key={eq.id} className="card" style={{padding:'16px',marginBottom:10,borderLeft:eq.unread?'3px solid var(--blue)':'3px solid transparent'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                {eq.unread&&<span style={{width:8,height:8,borderRadius:'50%',background:'#1d6ff3',flexShrink:0}}/>}
                <strong style={{fontSize:15}}>{eq.from}</strong>
              </div>
              <span style={{fontSize:12,color:'#64748b'}}>{eq.time}</span>
            </div>
            <p style={{fontSize:14,color:'#475569',lineHeight:1.65,marginBottom:12}}>{eq.msg}</p>
            <button className="btn btn-p btn-sm" style={{width:'100%',height:44}}>{Ic.mail} Reply by email</button>
          </div>
        ))}
        <div className="cl cl-b" style={{fontSize:13,marginTop:4}}>
          Enquiries arrive at your registered email. Passd never reads your messages.
        </div>
      </>}

      {/* ════ PROFILE TAB ════ */}
      {tab==='profile'&&<>
        <div className="row" style={{marginBottom:16}}>
          <h2 style={{fontSize:18,fontWeight:700}}>My Profile</h2>
          {!editing
            ?<button className="btn btn-p btn-sm" onClick={()=>setEditing(true)}>Edit</button>
            :<div style={{display:'flex',gap:8}}>
              <button className="btn btn-gh btn-sm" onClick={()=>{setEditing(false);setForm(init);}}>Cancel</button>
              <button className="btn btn-p btn-sm" onClick={()=>{onUpdate(form);setEditing(false);}}>Save</button>
            </div>}
        </div>

        {!editing?<>
          {/* Read view */}
          <div style={{display:'flex',gap:14,alignItems:'center',background:'#f1f5f9',borderRadius:14,padding:'16px',marginBottom:14}}>
            <img src={form.avatar} style={{width:56,height:56,borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid #f1f5f9'}} alt="" loading="lazy"/>
            <div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:2}}>{form.name}</div>
              <div style={{fontSize:13,color:'#475569',marginBottom:4}}>{form.area} · {form.yrs} yrs experience</div>
              {form.verified
                ?<span style={{display:'inline-flex',alignItems:'center',gap:4,color:'#16a34a',fontSize:12,fontWeight:600}}>{Ic.dvsa} DVSA Verified</span>
                :<span style={{fontSize:12,color:'#dc2626',fontWeight:600}}>⚠ Not verified — click DVSA tab</span>}
            </div>
          </div>
          <p style={{fontSize:14,color:'#475569',lineHeight:1.75,marginBottom:14}}>{form.bio||'No bio yet — add one to stand out to learners.'}</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
            {[['Rate',`£${form.rate}/hr`],['Pass rate',`${form.passRate}%`],['Transmission',(form.tx||[]).join(' & ')],['Availability',form.avail]].map(([l,v])=>(
              <div key={l} style={{padding:'12px',background:'#f1f5f9',borderRadius:10}}>
                <div className="slbl">{l}</div>
                <div style={{fontWeight:700,fontSize:14,marginTop:4}}>{v}</div>
              </div>
            ))}
          </div>
          {Array.isArray(form.types)&&form.types.length>0&&<><div className="slbl">Lesson types</div><div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:12}}>{form.types.map(t=><span key={t} className="chip chip-b">{t}</span>)}</div></>}
          {Array.isArray(form.support)&&form.support.length>0&&<><div className="slbl">Specialist support</div><div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{form.support.map(s=><span key={s} className="chip chip-g">{s}</span>)}</div></>}
        </>:<>
          {/* Edit view — white cards, readable */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            {[['Hourly rate (£)','rate'],['Pass rate (%)','passRate'],['Experience (yrs)','yrs']].map(([l,k])=>(
              <div key={k} className="field">
                <span className="lbl">{l}</span>
                <input className="inp" type="number" value={form[k]} onChange={e=>set(k,+e.target.value)}
                  style={{background:'#ffffff',color:'#0f1724'}}/>
              </div>
            ))}
            <div className="field">
              <span className="lbl">Availability</span>
              <select className="sel" value={form.avail} onChange={e=>set('avail',e.target.value)}
                style={{background:'#ffffff',color:'#0f1724'}}>
                {['Available','Limited','Full'].map(a=><option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="field" style={{marginBottom:12}}>
            <span className="lbl">Bio — tell learners why to choose you</span>
            <textarea className="inp" rows={4} value={form.bio} onChange={e=>set('bio',e.target.value)}
              style={{height:'auto',padding:14,background:'#ffffff',color:'#0f1724'}}/>
          </div>
          {[
            ['Lesson types',['Beginner','Standard','Intensive','Pass Plus','Refresher','Motorbike'],'types'],
            ['Transmission',['Manual','Automatic'],'tx'],
            ['Specialist support',['Anxious Drivers','ADHD Friendly','BSL / Deaf Support','Autism Friendly','Adapted Vehicle'],'support'],
          ].map(([l,opts,k])=>(
            <div key={k} style={{marginBottom:14}}>
              <div className="slbl" style={{marginBottom:8}}>{l}</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {opts.map(o=>{
                  const a=Array.isArray(form[k])?form[k]:[];
                  const on=a.includes(o);
                  return<button key={o} type="button" onClick={()=>tog(k,o)} style={{
                    padding:'8px 14px',borderRadius:99,fontSize:13,fontWeight:600,cursor:'pointer',
                    border:`1.5px solid ${on?'#1d6ff3':'#e2e8f0'}`,
                    background:on?'#e8f0fd':'#ffffff',
                    color:on?'#1d6ff3':'#475569',fontFamily:'inherit',
                  }}>{o}</button>;
                })}
              </div>
            </div>
          ))}
          <button className="btn btn-p btn-full btn-lg" onClick={()=>{onUpdate(form);setEditing(false);}}>Save changes</button>
        </>}
      </>}

      {/* ════ DVSA TAB ════ */}
      {tab==='dvsa'&&<>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:8}}>DVSA Verification</h2>
        <p style={{fontSize:14,color:'#475569',lineHeight:1.65,marginBottom:16}}>
          A verified badge is your single biggest trust signal. Learners filter for verified instructors — unverified profiles get significantly fewer enquiries.
        </p>
        {form.verified
          ?<div style={{display:'flex',alignItems:'center',gap:10,background:'#dcfce7',border:'1px solid rgba(22,163,74,.3)',borderRadius:12,padding:'14px 16px',marginBottom:14}}>
              <span style={{color:'#16a34a',fontSize:20}}>✓</span>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:'#16a34a'}}>DVSA Verified</div>
                <div style={{fontSize:12,color:'#15803d'}}>ADI ref: {form.dvsaRef}</div>
              </div>
            </div>
          :<>
            <div className="cl cl-a" style={{marginBottom:14,fontSize:13}}>
              <strong>Not verified.</strong> Your profile shows a warning to learners. Add your ADI badge number to fix this.
            </div>
            <div style={{display:'flex',gap:10,marginBottom:12}}>
              <input className="inp" value={dref} onChange={e=>setDref(e.target.value)}
                placeholder="e.g. ADI-2847361"
                style={{flex:1,background:'#ffffff',color:'#0f1724'}}/>
              <button className="btn btn-p" style={{flexShrink:0}} disabled={dvsa.status==='loading'||!dref} onClick={verifyDVSA}>
                {dvsa.status==='loading'?'Checking…':'Verify'}
              </button>
            </div>
            {dvsa.status==='done'&&dvsa.result&&(
              dvsa.result.ok
                ?<div className="cl cl-g">{Ic.check} Verified — {dvsa.result.name} · Grade {dvsa.result.grade}</div>
                :<div className="cl cl-a">{dvsa.result.msg}</div>
            )}
            <div className="cl cl-b" style={{marginTop:12,fontSize:13}}>
              Your ADI number is on your badge. Passd cross-references the public DVSA register daily. DVSA helpline: 0300 200 1122.
            </div>
          </>}
      </>}

      {/* ════ UPGRADE TAB ════ */}
      {tab==='subs'&&<>
        <h2 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Upgrade your plan</h2>
        <p style={{fontSize:13,color:'#475569',marginBottom:12,lineHeight:1.6}}>
          Premium is capped at 3 instructors per postcode. The slot exists whether you take it or not.
        </p>
        <div style={{background:'#fef3c7',border:'1px solid rgba(217,119,6,.25)',borderRadius:10,padding:'10px 14px',marginBottom:16,display:'flex',alignItems:'center',gap:8}}>
          <span>⏳</span>
          <span style={{fontSize:13,fontWeight:600,color:'#d97706'}}>Founder pricing — first 30 sign-ups only. Rises to £34.99/mo after.</span>
        </div>
        {[
          {n:'Free',   p:'£0/mo',     ann:null,     b:['Listed in results','3 enquiries/month','Standard placement'],           hi:false},
          {n:'Verified',p:'£9.99/mo', ann:'£99/yr', b:['DVSA badge','Unlimited enquiries','Higher placement','24hr badge'],     hi:false},
          {n:'Premium', p:'£19.99/mo',ann:'£199/yr',b:['Top 3 guaranteed','3 slots per postcode','PassScore badge','Analytics','Featured in learner emails'], hi:true},
        ].map(({n,p,ann,b,hi})=>(
          <div key={n} className={`plan${hi?' feat':''}`}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div>
                <div style={{fontWeight:800,fontSize:16}}>{n}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:2}}>
                  <span style={{fontSize:18,fontWeight:800,color:hi?'#1d6ff3':'#0f1724'}}>{p}</span>
                  {ann&&<span style={{fontSize:11,color:'#16a34a',fontWeight:600}}>{ann}</span>}
                </div>
              </div>
              {form.tier===n
                ?<span className="chip chip-g">Current</span>
                :<button className="btn btn-sm btn-p"
                    onClick={()=>window.open(hi?'https://buy.stripe.com/PREMIUM_LINK':'https://buy.stripe.com/VERIFIED_LINK','_blank')}>
                  {hi?'Claim slot':'Upgrade'}
                </button>}
            </div>
            {b.map(x=><div key={x} style={{display:'flex',gap:8,fontSize:13,color:'#475569',marginBottom:5,alignItems:'flex-start'}}>
              <span style={{color:'#16a34a',flexShrink:0}}>✓</span>{x}
            </div>)}
            {hi&&form.tier!=='Premium'&&<div style={{marginTop:10,padding:'8px 12px',background:'#f4f7fe',borderRadius:8,fontSize:12,color:'#1d6ff3',fontWeight:600}}>
              ⚡ Limited slots in your area — 3 per postcode maximum
            </div>}
          </div>
        ))}
        <div className="cl cl-b" style={{marginTop:12,fontSize:12}}>Annual saves up to £41. To switch to annual billing email hello@passd-ai.co.uk</div>
      </>}

    </div>
  </div>;
};



export default Portal_final;
