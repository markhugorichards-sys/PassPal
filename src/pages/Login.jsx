import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

const LEARNERS=[{id:1,name:"Alex Doe",email:"alex@passd-ai.co.uk",emailVerified:true,postcode:"M1 1AA"}];
const Login=({onLogin,onNav,insts})=>{
  const [isInst,setIsInst]=useState(false);
  const [e,setE]=useState(isInst?'instructor@passd-ai.co.uk':'alex@passd-ai.co.uk');
  const [p,setP]=useState('password');
  const [err,setErr]=useState('');
  const sub=ev=>{ev.preventDefault();if(isInst){const i=insts.find(x=>x.email===e);if(i&&p==='password')onLogin('inst',i);else setErr('Try instructor@passd-ai.co.uk / password');}else{const u=LEARNERS.find(l=>l.email===e);if(u&&p==='password')onLogin('learner',u);else setErr('Try alex@passd-ai.co.uk / password');}};
  return<div className="auth-wrap page">
    <div className="auth-card">
      <h2 style={{fontSize:26,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>Sign in</h2>
      <p style={{fontSize:14,color:'#475569',marginBottom:20}}>Access your Passd account.</p>
      <div style={{display:'flex',gap:8,marginBottom:20}}>
        {['Learner','Instructor'].map((t,ii)=>(
          <button key={t} className={`btn btn-full ${!ii&&!isInst||ii&&isInst?'btn-p':'btn-gh'}`} style={{height:42,fontSize:14}} onClick={()=>{setIsInst(!!ii);setErr('');setE(ii?'instructor@passd-ai.co.uk':'alex@passd-ai.co.uk');}}>{t}</button>
        ))}
      </div>
      <form onSubmit={sub} style={{display:'flex',flexDirection:'column',gap:14}}>
        <div className="field"><span className="lbl">Email</span><input className="inp" type="email" value={e} onChange={ev=>setE(ev.target.value)}/></div>
        <div className="field"><span className="lbl">Password</span><input className="inp" type="password" value={p} onChange={ev=>setP(ev.target.value)}/></div>
        {err&&<p style={{fontSize:13,color:'#dc2626'}}>{err}</p>}
        <button type="submit" className="btn btn-p btn-full btn-lg">Sign in</button>
        <p style={{textAlign:'center',fontSize:14,color:'#475569'}}>No account? <button type="button" onClick={()=>onNav('signup')} style={{background:'none',border:'none',color:'#1d6ff3',fontWeight:600,cursor:'pointer',fontSize:14}}>Sign up free</button></p>
      </form>
      <div className="cl cl-b" style={{marginTop:16,fontSize:13}}>Demo: alex@passd-ai.co.uk or instructor@passd-ai.co.uk / password</div>
    </div>
  </div>;
};


export default Login;
