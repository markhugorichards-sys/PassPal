import { Ic } from './shared.jsx';

const Sv=({d,s=20,...p})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d={d}/></svg>;

const LegalHub=({onNav})=><div className="page" style={{padding:'0 16px'}}>
  <div style={{padding:'20px 0 14px'}}>
    <h1 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>Legal</h1>
    <p style={{fontSize:14,color:'#475569'}}>HHR Holdings Ltd · passd-ai.co.uk</p>
  </div>
  {[
    {v:'privacy',l:'Privacy Policy',sub:'How we collect, use and protect your data',icon:Ic.shield},
    {v:'terms',l:'Terms of Service',sub:'Rules governing use of Passd-AI',icon:Ic.dvsa},
    {v:'cookies',l:'Cookie Policy',sub:'What cookies we use and why',icon:Ic.lock},
    {v:'instructor_agreement',l:'Instructor Listing Agreement',sub:'Additional terms for instructor accounts',icon:Ic.instruc},
  ].map(({v,l,sub,icon})=>(
    <button key={v} onClick={()=>onNav('legal_'+v)}
      style={{display:'flex',alignItems:'center',gap:14,width:'100%',padding:'16px',background:'#ffffff',border:'none',cursor:'pointer',textAlign:'left',borderRadius:14,marginBottom:10}}>
      <span style={{color:'#1d6ff3',flexShrink:0}}>{icon}</span>
      <span style={{flex:1}}>
        <span style={{display:'block',fontWeight:700,fontSize:15,color:'#0f1724'}}>{l}</span>
        <span style={{display:'block',fontSize:13,color:'#64748b',marginTop:2}}>{sub}</span>
      </span>
      <span style={{color:'#94a3b8',flexShrink:0}}><Sv d="M9 18l6-6-6-6" s={16}/></span>
    </button>
  ))}
  <div className="cl cl-b" style={{fontSize:13,marginTop:4}}>
    HHR Holdings Ltd · Registered in England &amp; Wales · hello@passd-ai.co.uk
  </div>
</div>;

export default LegalHub;
