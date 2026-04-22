import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

const Signup=({onSignup,onNav})=>{
  const [name,setName]=useState('');const [email,setEmail]=useState('');
  return<div className="auth-wrap page">
    <div className="auth-card">
      <h2 style={{fontSize:26,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>Start comparing.</h2>
      <p style={{fontSize:14,color:'#475569',marginBottom:20}}>Free forever. No card needed.</p>
      <form onSubmit={e=>{e.preventDefault();onSignup(name,email);}} style={{display:'flex',flexDirection:'column',gap:14}}>
        <div className="field"><span className="lbl">Full name</span><input className="inp" value={name} onChange={e=>setName(e.target.value)} required/></div>
        <div className="field"><span className="lbl">Email</span><input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <button type="submit" className="btn btn-p btn-full btn-lg">Create free account</button>
        <p style={{textAlign:'center',fontSize:14,color:'#475569'}}>Have an account? <button type="button" onClick={()=>onNav('login')} style={{background:'none',border:'none',color:'#1d6ff3',fontWeight:600,cursor:'pointer',fontSize:14}}>Sign in</button></p>
      </form>
    </div>
  </div>;
};

/* ── THEORY ── */

export default Signup;
