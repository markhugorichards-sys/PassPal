import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

const Admin=({insts,learners,onApprove,onLogout})=>{
  const [tab,setTab]=useState('overview');
  const AM={learners:1847,instructors:312,premium:94,mrr:1220};
  return<div className="page">
    <div style={{padding:'16px 16px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{fontSize:20,fontWeight:800}}>Admin</div>
      <button className="btn btn-gh btn-sm" onClick={onLogout}>{Ic.logout} Sign out</button>
    </div>
    <div className="admin-tabs">
      {[{v:'overview',l:'Overview'},{v:'instructors',l:'Instructors'},{v:'learners',l:'Learners'},{v:'finance',l:'Finance'},{v:'dvsa',l:'DVSA Queue'}].map(({v,l})=>(
        <button key={v} className={`ptab${tab===v?' on':''}`} onClick={()=>setTab(v)}>{l}</button>
      ))}
    </div>
    <div style={{padding:'16px'}}>
      {tab==='overview'&&<>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          {[{l:'Learners',v:AM.learners.toLocaleString(),c:'#1d6ff3'},{l:'Instructors',v:AM.instructors,c:'#0f1724'},{l:'Premium subs',v:AM.premium,c:'#16a34a'},{l:'MRR',v:`£${AM.mrr}`,c:'#d97706'}].map(({l,v,c})=>(
            <div key={l} className="card" style={{padding:'16px'}}><div className="slbl">{l}</div><div style={{fontSize:24,fontWeight:800,letterSpacing:'-.02em',marginTop:4,color:c}}>{v}</div></div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          {[{l:'Comparisons today',v:'247'},{l:'Conversion',v:'31%'},{l:'Open tickets',v:'6'},{l:'DVSA pending',v:'4'}].map(({l,v})=>(
            <div key={l} className="card" style={{padding:'14px'}}><div className="slbl">{l}</div><div style={{fontSize:20,fontWeight:800,marginTop:4}}>{v}</div></div>
          ))}
        </div>
      </>}
      {tab==='instructors'&&<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:500}}>
        <thead><tr style={{borderBottom:'1px solid #e2e8f0'}}>{['Name','Tier','Rate','Pass%','Status',''].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:700,color:'#64748b',fontSize:11,textTransform:'uppercase',letterSpacing:'.06em',background:'#ffffff'}}>{h}</th>)}</tr></thead>
        <tbody>{insts.map(i=><tr key={i.id} style={{borderBottom:'1px solid #f1f5f9'}}><td style={{padding:'12px',fontWeight:600}}>{i.name}</td><td style={{padding:'12px'}}><span className={`chip ${i.tier==='Premium'?'chip-b':i.tier==='Verified'?'chip-g':'chip-n'}`}>{i.tier}</span></td><td style={{padding:'12px',fontWeight:600}}>£{i.rate}</td><td style={{padding:'12px',color:i.passRate>=90?'#16a34a':'#0f1724',fontWeight:600}}>{i.passRate}%</td><td style={{padding:'12px'}}><span className={`chip ${i.verified?'chip-g':'chip-a'}`}>{i.verified?'Verified':'Pending'}</span></td><td style={{padding:'12px'}}>{!i.verified&&<button className="btn btn-p btn-sm" onClick={()=>onApprove(i.id)}>Approve</button>}</td></tr>)}</tbody>
      </table></div>}
      {tab==='learners'&&<div style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{borderBottom:'1px solid #e2e8f0'}}>{['Name','Email','Verified'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:700,color:'#64748b',fontSize:11,textTransform:'uppercase',background:'#ffffff'}}>{h}</th>)}</tr></thead>
        <tbody>{learners.map(l=><tr key={l.id} style={{borderBottom:'1px solid #f1f5f9'}}><td style={{padding:'12px',fontWeight:600}}>{l.name}</td><td style={{padding:'12px',color:'#475569'}}>{l.email}</td><td style={{padding:'12px'}}><span className={`chip ${l.emailVerified?'chip-g':'chip-a'}`}>{l.emailVerified?'Yes':'Pending'}</span></td></tr>)}</tbody>
      </table></div>}
      {tab==='finance'&&<>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
          {[{l:'MRR',v:`£${AM.mrr}`},{l:'ARR',v:`£${AM.mrr*12}`},{l:'Rev/sub',v:`£${(AM.mrr/AM.premium).toFixed(2)}`},{l:'ARR target',v:'£500K'}].map(({l,v})=>(
            <div key={l} className="card" style={{padding:'14px'}}><div className="slbl">{l}</div><div style={{fontSize:20,fontWeight:800,color:'#16a34a',marginTop:4}}>{v}</div></div>
          ))}
        </div>
        <div className="cl cl-b" style={{fontSize:13}}>Full Stripe revenue data available in production.</div>
      </>}
      {tab==='dvsa'&&<>
        <p style={{fontSize:14,color:'#475569',marginBottom:14}}>Instructors awaiting manual DVSA cross-reference.</p>
        {insts.filter(i=>!i.verified).map(i=>(
          <div key={i.id} style={{padding:'14px',background:'#f1f5f9',borderRadius:12,marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <div><div style={{fontWeight:600,fontSize:14}}>{i.name}</div><div style={{fontSize:12,color:'#64748b',fontFamily:'monospace'}}>{i.dvsaRef||'No ref provided'}</div></div>
            <button className="btn btn-p btn-sm" onClick={()=>onApprove(i.id)}>Verify</button>
          </div>
        ))}
        {insts.filter(i=>!i.verified).length===0&&<p style={{fontSize:14,color:'#64748b'}}>No pending verifications.</p>}
        <div className="cl cl-a" style={{fontSize:13,marginTop:12}}>Daily DVSA register data feed in production. Target: 2 working day turnaround.</div>
      </>}
    </div>
  </div>;
};

/* ── ADMIN LOGIN ── */
const AdminLogin=({onLogin})=>{
  const [p,setP]=useState('');const [err,setErr]=useState('');
  return<div className="auth-wrap page"><div className="auth-card">
    <h2 style={{fontSize:26,fontWeight:800,marginBottom:4}}>Admin access</h2>
    <div style={{display:'flex',flexDirection:'column',gap:14,marginTop:16}}>
      <div className="field"><span className="lbl">Password</span><input className="inp" type="password" value={p} onChange={e=>setP(e.target.value)}/></div>
      {err&&<p style={{fontSize:13,color:'#dc2626'}}>{err}</p>}
      <button className="btn btn-p btn-full btn-lg" onClick={()=>p==='admin'?onLogin():setErr('Try: admin')}>Access dashboard</button>
    </div>
    <div className="cl cl-b" style={{marginTop:14,fontSize:13}}>Demo: admin</div>
  </div></div>;
};

/* ── APP ── */

export default Admin;
