import { useState } from 'react';

const AdminLogin=({onLogin})=>{
  const [p,setP]=useState('');
  const [err,setErr]=useState('');
  return <div style={{minHeight:'60svh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
    <div style={{width:'100%',maxWidth:360,background:'#fff',borderRadius:20,padding:'28px 24px'}}>
      <h2 style={{fontSize:26,fontWeight:800,marginBottom:4}}>Admin access</h2>
      <p style={{fontSize:14,color:'#475569',marginBottom:24}}>Internal use only.</p>
      <input className="inp" type="password" placeholder="Password" value={p} onChange={e=>setP(e.target.value)} style={{marginBottom:12}}/>
      {err&&<p style={{color:'#dc2626',fontSize:13,marginBottom:8}}>{err}</p>}
      <button className="btn btn-p btn-full btn-lg" onClick={()=>p==='admin'?onLogin():setErr('Try: admin')}>Access dashboard</button>
    </div>
  </div>;
};

export default AdminLogin;
