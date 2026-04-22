import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

const Dashboard=({learner,onNav,enquiries})=>{
  const theoryPct=Math.round((THEORY.reduce((a,t)=>a+t.progress,0)/THEORY.length));
  const r=40,circ=2*Math.PI*r,dash=circ*(theoryPct/100);
  const firstName=learner.name.split(' ')[0];

  return<div className="page">

    {/* Header */}
    <div style={{background:'#0a1628',padding:'24px 16px 20px'}}>
      <h1 style={{fontSize:26,fontWeight:900,color:'#fff',letterSpacing:'-.02em',marginBottom:4}}>
        Hi, {firstName} 👋
      </h1>
      <p style={{fontSize:14,color:'rgba(255,255,255,.5)'}}>
        {enquiries.length>0
          ?`You have ${enquiries.length} enquiry${enquiries.length>1?'s':''} out`
          :'Start comparing instructors to find the best value near you'}
      </p>
    </div>

    <div style={{padding:'16px'}}>

      {/* ── ENQUIRIES ── the most important thing ── */}
      {enquiries.length>0&&<>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div style={{fontWeight:700,fontSize:16}}>Your enquiries</div>
          <button className="btn btn-gh btn-sm" onClick={()=>onNav('compare')}>Compare more</button>
        </div>
        {enquiries.map(eq=>(
          <div key={eq.id} className="card" style={{padding:'14px',marginBottom:10}}>
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:10}}>
              <img src={eq.instAvatar} style={{width:44,height:44,borderRadius:'50%',objectFit:'cover',flexShrink:0,border:'2px solid #f1f5f9'}} alt="" loading="lazy"/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>{eq.instName}</div>
                <div style={{fontSize:13,color:'#475569'}}>{eq.instArea} · £{eq.instRate}/hr · {eq.instPassRate}% pass rate</div>
              </div>
              <span className="chip chip-b" style={{flexShrink:0,fontSize:11}}>{eq.status}</span>
            </div>
            <div style={{display:'flex',gap:16,fontSize:12,color:'#64748b',paddingTop:8,borderTop:'1px solid #f1f5f9'}}>
              <span>Sent {eq.date} at {eq.time}</span>
              {eq.details?.date&&<span>Requested: {eq.details.date}</span>}
            </div>
            <div className="cl cl-b" style={{marginTop:10,fontSize:12,lineHeight:1.5}}>
              {eq.instName.split(' ')[0]} will reply to your email directly. Check your inbox — including spam.
            </div>
          </div>
        ))}
      </>}

      {/* ── NO ENQUIRIES YET — show value prop ── */}
      {enquiries.length===0&&<div className="card" style={{padding:'20px',marginBottom:12,textAlign:'center'}}>
        <div style={{fontSize:36,marginBottom:10}}>🔍</div>
        <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>Find your instructor</div>
        <p style={{fontSize:14,color:'#475569',lineHeight:1.65,marginBottom:16}}>
          Compare every instructor near you by price, pass rate and total cost to pass. Most learners save <strong>£360</strong> vs picking the first one they find.
        </p>
        <button className="btn btn-p btn-full btn-lg" onClick={()=>onNav('home')}>
          Start comparing →
        </button>
      </div>}

      {/* ── THEORY PROGRESS ── real data ── */}
      <div style={{fontWeight:700,fontSize:16,marginBottom:10,marginTop:enquiries.length>0?4:0}}>Theory practice</div>
      <div className="card" style={{padding:'16px',marginBottom:10,display:'flex',alignItems:'center',gap:16}}>
        <div style={{position:'relative',flexShrink:0}}>
          <svg width={80} height={80} viewBox="0 0 90 90" style={{transform:'rotate(-90deg)'}}>
            <circle cx={45} cy={45} r={r} fill="none" stroke="#f1f5f9" strokeWidth={7}/>
            <circle cx={45} cy={45} r={r} fill="none" stroke="var(--blue)" strokeWidth={7}
              strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
          </svg>
          <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontWeight:900,fontSize:17,letterSpacing:'-.02em'}}>{theoryPct}%</div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:2}}>Overall progress</div>
          <div style={{fontSize:13,color:'#475569',marginBottom:10}}>{THEORY.length} topics · practice anytime</div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-p btn-sm" onClick={()=>onNav('theory')}>Continue</button>
            <button className="btn btn-gh btn-sm" onClick={()=>onNav('theory')}>Mock test</button>
          </div>
        </div>
      </div>

      {/* Topic breakdown */}
      <div className="card" style={{padding:'16px',marginBottom:12}}>
        {THEORY.map((t,i)=>(
          <div key={t.id} style={{marginBottom:i<THEORY.length-1?12:0}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:5}}>
              <span style={{fontWeight:600}}>{t.name}</span>
              <span style={{color:t.progress>=80?'#16a34a':t.progress>=50?'#1d6ff3':'#d97706',fontWeight:700}}>{t.progress}%</span>
            </div>
            <div className="prog"><div className="prog-f" style={{width:`${t.progress}%`,background:t.progress>=80?'#16a34a':t.progress>=50?'#1d6ff3':'#d97706'}}/></div>
          </div>
        ))}
      </div>

      {/* ── UNLOCK CTA ── */}
      <div className="card" style={{padding:'18px',background:'#0a1628',marginBottom:8}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,marginBottom:12}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:4}}>Unlock verified pass rates</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.5)',lineHeight:1.55}}>DVSA-confirmed pass rates, full review history, guaranteed 24hr instructor response.</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:22,fontWeight:900,color:'#4fffb0',lineHeight:1}}>£4.99</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:2}}>one-time</div>
          </div>
        </div>
        <div style={{fontSize:12,color:'#4fffb0',fontWeight:600,marginBottom:12}}>
          Spend £4.99. Save up to £400 choosing the right instructor.
        </div>
        <button className="btn btn-full" style={{background:'#4fffb0',color:'#0a1628',fontWeight:800,height:46}}
          onClick={()=>window.open('https://buy.stripe.com/LEARNER_UNLOCK','_blank')}>
          Unlock now
        </button>
      </div>
    </div>
  </div>;
};

/* ── INSTRUCTOR PORTAL ── */

export default Dashboard_final;
