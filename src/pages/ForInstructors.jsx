import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

const ForInstructors=({onNav})=><div className="page" style={{padding:'0 16px'}}>
  <div style={{background:'#0a1628',margin:'0 -16px',padding:'32px 16px 28px'}}>
    <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,179,0,.2)',border:'1px solid rgba(255,179,0,.4)',borderRadius:99,padding:'4px 12px',marginBottom:14}}>
      <span style={{width:6,height:6,borderRadius:'50%',background:'#d97706',flexShrink:0}}/>
      <span style={{fontSize:12,color:'#d97706',fontWeight:700}}>Founder pricing — first 30 instructors only</span>
    </div>
    <h1 style={{fontSize:30,fontWeight:900,color:'#fff',letterSpacing:'-.03em',lineHeight:1.1,marginBottom:12}}>Fill your diary.<br/><span style={{color:'#4fffb0'}}>Keep your earnings.</span></h1>
    <p style={{fontSize:15,color:'rgba(255,255,255,.55)',lineHeight:1.65,marginBottom:8}}>Join instructors matched with learners by value — not ad spend.</p>
    <p style={{fontSize:13,color:'rgba(255,179,0,.8)',fontWeight:600,marginBottom:20}}>🔒 Premium: 3 slots per postcode. Once they are gone, they are gone.</p>
    <button className="btn btn-full btn-lg" style={{background:'#4fffb0',color:'#0a1628',fontWeight:800}} onClick={()=>window.open('https://tally.so/r/YOURFORMID','_blank')}>Claim your free profile {Ic.arR}</button>
  </div>
  <div style={{paddingTop:16}}>
    {[{icon:Ic.compare,t:'Listed in every comparison',d:'Your rate, pass rate, and PassScore shown to every learner searching your postcode area.'},
      {icon:Ic.award,t:'Ranked by value, not ad spend',d:'Transparent algorithm — a strong pass rate can outrank a lower price.'},
      {icon:Ic.shield,t:'Top 3 guaranteed (Premium)',d:'Limited to 3 slots per postcode. When your area has capacity, you appear in positions 1–3 on every search.'}].map(({icon,t,d})=>(
      <div key={t} className="card" style={{marginBottom:10,padding:'16px'}}>
        <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
          <div style={{color:'#1d6ff3',flexShrink:0,marginTop:2}}>{icon}</div>
          <div><div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{t}</div><div style={{fontSize:14,color:'#475569',lineHeight:1.6}}>{d}</div></div>
        </div>
      </div>
    ))}
    <div className="card" style={{padding:'20px',marginBottom:12}}>
      <h2 style={{fontSize:18,fontWeight:700,marginBottom:14}}>Pricing</h2>
      {[
        {n:'Free',p:'£0/mo',ann:null,b:['Listed in comparison results','3 enquiries per month','Standard placement'],hi:false,sub:null},
        {n:'Verified',p:'£9.99/mo',ann:'£99/yr — save £21',b:['DVSA-verified badge','Unlimited enquiries','Higher placement','24hr response badge'],hi:false,sub:'Founder price — rises to £14.99 after 30 sign-ups'},
        {n:'Premium',p:'£19.99/mo',ann:'£199/yr — save £41',b:['Top 3 guaranteed','Hard cap: 3 slots per postcode','PassScore badge','Full analytics','Featured in learner emails'],hi:true,sub:'Founder price — rises to £34.99 after 30 sign-ups'},
      ].map(({n,p,ann,b,hi,sub})=>(
        <div key={n} className={`plan${hi?' feat':''}`}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
            <div style={{fontWeight:800,fontSize:16}}>{n}</div>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:800,fontSize:18,color:hi?'#1d6ff3':'#0f1724'}}>{p}</div>
              {ann&&<div style={{fontSize:11,color:'#16a34a',fontWeight:600}}>{ann}</div>}
            </div>
          </div>
          {sub&&<div style={{fontSize:11,color:'#d97706',fontWeight:600,marginBottom:10,background:'#fef3c7',padding:'3px 8px',borderRadius:6,display:'inline-block'}}>{sub}</div>}
          <div style={{marginBottom:12,marginTop:sub?4:8}}>
            {b.map(x=><div key={x} style={{display:'flex',gap:8,fontSize:13,color:'#475569',marginBottom:5,alignItems:'flex-start'}}><span style={{color:'#16a34a',flexShrink:0,marginTop:1}}>{Ic.check}</span>{x}</div>)}
          </div>
          <button className={`btn btn-sm btn-full ${hi?'btn-p':'btn-gh'}`} onClick={()=>window.open('https://tally.so/r/YOURFORMID','_blank')}>
            {hi?'Claim your slot':'Get started'} {hi?Ic.arR:''}
          </button>
        </div>
      ))}
    </div>
  </div>
</div>;

/* ── ADMIN ── */

export default ForInstructors_final;
