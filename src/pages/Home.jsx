const Home=({onNav,onSearch,autoScroll,onScrolled})=>{
  const [pc,setPc]=useState('');
  const [exp,setExp]=useState('Complete Beginner');
  const [tx,setTx]=useState('Any');
  const [adv,setAdv]=useState(false);
  const [locLoading,setLocLoading]=useState(false);
  const [locErr,setLocErr]=useState('');
  const formRef=useRef(null);

  const scrollToForm=()=>{
    if(formRef.current){
      formRef.current.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(()=>{
        const inp=formRef.current.querySelector('input');
        if(inp)inp.focus();
      },400);
    }
  };

  const useLocation=()=>{
    if(!navigator.geolocation){setLocErr('Geolocation not supported on this device');return;}
    setLocLoading(true);setLocErr('');
    navigator.geolocation.getCurrentPosition(
      async pos=>{
        try{
          const {latitude:lat,longitude:lng}=pos.coords;
          const res=await fetch('https://api.postcodes.io/postcodes?lon='+lng+'&lat='+lat+'&limit=1');
          const data=await res.json();
          if(data.result&&data.result[0]){
            const p=data.result[0].postcode;
            setPc(p);
            setLocLoading(false);
            setTimeout(()=>formRef.current?.querySelector('form')?.requestSubmit()||onSearch({postcode:p,exp,tx}),100);
          } else {
            setLocErr('Could not find postcode for your location');
            setLocLoading(false);
          }
        }catch(e){
          setLocErr('Location lookup failed — enter your postcode manually');
          setLocLoading(false);
        }
      },
      err=>{
        setLocErr(err.code===1?'Location access denied — enter your postcode below':'Could not get your location');
        setLocLoading(false);
      },
      {timeout:8000,maximumAge:60000}
    );
  };

  useEffect(()=>{
    if(autoScroll>0&&formRef.current){
      setTimeout(()=>{
        formRef.current.scrollIntoView({behavior:'smooth',block:'center'});
        const inp=formRef.current.querySelector('input');
        if(inp)inp.focus();
        if(onScrolled)onScrolled();
      },100);
    }
  },[autoScroll]);

  return<div className="page fu">

    {/* ── HERO ── */}
    <div style={{background:'#0a1628',padding:'28px 16px 24px',position:'relative',overflow:'hidden'}}>

      {/* Live badge */}
      <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(79,255,176,.12)',border:'1px solid rgba(79,255,176,.25)',borderRadius:99,padding:'5px 12px',marginBottom:20}}>
        <span style={{width:7,height:7,borderRadius:'50%',background:'#4fffb0',flexShrink:0,boxShadow:'0 0 6px #4fffb0'}}/>
        <span style={{fontSize:12,color:'#4fffb0',fontWeight:700,letterSpacing:'.01em'}}>Free to use · No account needed</span>
      </div>

      {/* Headline */}
      <h1 style={{fontSize:'clamp(30px,8vw,42px)',fontWeight:900,color:'#fff',letterSpacing:'-.03em',lineHeight:1.05,marginBottom:16}}>
        Stop guessing.<br/>
        <span style={{color:'#4fffb0'}}>Start comparing.</span>
      </h1>

      {/* Value prop — the actual pain point */}
      <div style={{marginBottom:20}}>
        <p style={{fontSize:16,color:'rgba(255,255,255,.8)',lineHeight:1.6,marginBottom:8,fontWeight:500}}>
          The average learner overpays <strong style={{color:'#fff'}}>£360</strong> on driving lessons — because they picked the first instructor who replied.
        </p>
        <p style={{fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.6}}>
          Passd shows you the <em>total estimated cost to pass</em>, pass rates, and value scores for every instructor near you — in seconds.
        </p>
      </div>

      {/* Search form */}
      <div ref={formRef}>
      <form onSubmit={e=>{e.preventDefault();onSearch({postcode:pc,exp,tx});}}>
        <div style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:16,padding:'14px 14px 10px',marginBottom:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.08em'}}>Your postcode</div>
            <button type="button" onClick={useLocation} disabled={locLoading}
              style={{background:'rgba(79,255,176,.15)',border:'1px solid rgba(79,255,176,.3)',
                      borderRadius:99,padding:'4px 10px',fontSize:11,fontWeight:700,
                      color:'#4fffb0',cursor:'pointer',display:'flex',alignItems:'center',gap:4,
                      fontFamily:'inherit',opacity:locLoading?0.6:1}}>
              {locLoading
                ?<><span style={{fontSize:10}}>⏳</span> Locating…</>
                :<><svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> Use my location</>}
            </button>
          </div>
          {locErr&&<div style={{fontSize:12,color:'#fca5a5',marginBottom:8,lineHeight:1.4}}>{locErr}</div>}
          <input className="inp" value={pc} onChange={e=>setPc(e.target.value)}
            placeholder="e.g. M1 1AA · SW1A 2AA · B1 1BB"
            style={{fontSize:17,height:50,borderRadius:12,border:'1.5px solid rgba(255,255,255,.2)',
                    background:'rgba(255,255,255,.1)',color:'#fff',letterSpacing:'.02em'}}
            required/>
          <button type="button" onClick={()=>setAdv(v=>!v)}
            style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',fontSize:12,fontWeight:600,
                    cursor:'pointer',display:'flex',alignItems:'center',gap:4,marginTop:10,padding:0,fontFamily:'inherit'}}>
            {adv?'▲ Less options':'▼ Experience level & transmission'}
          </button>
          {adv&&<div style={{display:'flex',flexDirection:'column',gap:10,marginTop:12}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>Experience level</div>
              <select className="sel" value={exp} onChange={e=>setExp(e.target.value)}
                style={{background:'rgba(255,255,255,.1)',color:'#fff',border:'1.5px solid rgba(255,255,255,.2)',borderRadius:12,height:46}}>
                {Object.keys(HRS).map(x=><option key={x} style={{background:'#0a1628'}}>{x}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>Transmission</div>
              <select className="sel" value={tx} onChange={e=>setTx(e.target.value)}
                style={{background:'rgba(255,255,255,.1)',color:'#fff',border:'1.5px solid rgba(255,255,255,.2)',borderRadius:12,height:46}}>
                {['Any','Manual','Automatic'].map(x=><option key={x} style={{background:'#0a1628'}}>{x}</option>)}
              </select>
            </div>
          </div>}
        </div>

        <button type="submit" className="btn btn-full btn-lg" style={{
          background:'#4fffb0',color:'#0a1628',fontSize:17,fontWeight:900,
          borderRadius:14,height:56,letterSpacing:'-.01em',
          boxShadow:'0 4px 24px rgba(79,255,176,.25)',border:'none',
        }}>
          Compare instructors near me →
        </button>
      </form>
      </div>

      {/* Social proof strip */}
      <div style={{display:'flex',gap:0,marginTop:20,borderTop:'1px solid rgba(255,255,255,.1)',paddingTop:18}}>
        {[['£360','avg saving'],['91%','top pass rate'],['Free','always']].map(([n,l],i)=>(
          <div key={l} style={{flex:1,textAlign:'center',borderRight:i<2?'1px solid rgba(255,255,255,.1)':'none'}}>
            <div style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'-.03em',lineHeight:1}}>{n}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:3,textTransform:'uppercase',letterSpacing:'.06em',fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* ── WHAT YOU SEE IN THE COMPARISON ── */}
    <div style={{padding:'20px 16px 0'}}>

      {/* Pain point card */}
      <div style={{background:'#fef3c7',border:'1px solid rgba(217,119,6,.2)',borderRadius:16,padding:'18px',marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:'#d97706',marginBottom:6,textTransform:'uppercase',letterSpacing:'.05em'}}>Did you know?</div>
        <p style={{fontSize:15,fontWeight:700,color:'#0f1724',lineHeight:1.5,marginBottom:4}}>Two instructors, same area. One charges £29/hr, one charges £45/hr.</p>
        <p style={{fontSize:14,color:'#475569',lineHeight:1.6}}>Over 47 hours that's a <strong style={{color:'#d97706'}}>£752 difference</strong>. Passd shows you this before you book anyone.</p>
      </div>

      {/* Three core value props */}
      {[
        {icon:Ic.pound,  col:'#3b82f6',
         t:'See your total cost to pass',
         d:'Not just the hourly rate. Passd calculates the full estimated cost using DVSA average hours for your experience level. Know the real number upfront.'},
        {icon:Ic.award,  col:'#8b5cf6',
         t:'PassScore — one number to compare',
         d:'Price competitiveness, star rating and pass rate combined into a single score. Best value is not always the cheapest instructor.'},
        {icon:Ic.shield, col:'#10b981',
         t:'DVSA-verified pass rates',
         d:'Any instructor can claim a 95% pass rate. Verified instructors on Passd have had their rate confirmed against the official DVSA register.'},
      ].map(({icon,col,t,d})=>(
        <div key={t} className="card" style={{marginBottom:10,padding:'18px'}}>
          <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
            <div style={{width:40,height:40,borderRadius:12,background:`${col}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:col}}>{icon}</div>
            <div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:5,letterSpacing:'-.01em'}}>{t}</div>
              <div style={{fontSize:14,color:'#475569',lineHeight:1.65}}>{d}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Accessibility card */}
      <div className="card" style={{marginBottom:10,padding:'20px',background:'#0a1628'}}>
        <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8}}>Built for every learner</div>
        <h2 style={{fontSize:19,fontWeight:800,color:'#fff',marginBottom:8,letterSpacing:'-.02em',lineHeight:1.2}}>Filters nobody else has.</h2>
        <p style={{fontSize:14,color:'rgba(255,255,255,.5)',lineHeight:1.65,marginBottom:14}}>Find ADHD-friendly, BSL/Deaf, autism-friendly and adapted vehicle instructors near you.</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:16}}>
          {['ADHD Friendly','BSL / Deaf','Autism Friendly','Adapted Vehicle','Anxious Drivers'].map(s=>(
            <span key={s} style={{padding:'6px 12px',borderRadius:99,fontSize:12,fontWeight:600,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.18)',color:'rgba(255,255,255,.8)'}}>{s}</span>
          ))}
        </div>
        <button className="btn btn-full" style={{background:'#4fffb0',color:'#0a1628',fontWeight:800,height:46}} onClick={()=>onNav('compare')}>Find a specialist instructor →</button>
      </div>

      {/* How it works */}
      <div className="card" style={{marginBottom:10,padding:'20px'}}>
        <h2 style={{fontSize:17,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>How it works</h2>
        <p style={{fontSize:13,color:'#64748b',marginBottom:16}}>30 seconds. No account. No credit card.</p>
        {[
          {n:'1',t:'Enter your postcode',     d:'See every local instructor instantly.'},
          {n:'2',t:'Compare total costs',     d:'Not just hourly rate — full cost to pass.'},
          {n:'3',t:'Check pass rates',        d:'Verified rates, not self-reported guesses.'},
          {n:'4',t:'Book directly',           d:'No commission. No middleman. Just you and your instructor.'},
        ].map(({n,t,d})=>(
          <div key={n} style={{display:'flex',gap:14,alignItems:'flex-start',marginBottom:14}}>
            <div style={{width:30,height:30,borderRadius:'50%',background:'#0a1628',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,flexShrink:0}}>{n}</div>
            <div><div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{t}</div><div style={{fontSize:13,color:'#475569',lineHeight:1.55}}>{d}</div></div>
          </div>
        ))}
        <button className="btn btn-p btn-full" style={{marginTop:4,height:48,fontWeight:700}} onClick={()=>{if(formRef&&formRef.current){formRef.current.scrollIntoView({behavior:'smooth',block:'center'});const inp=formRef.current.querySelector('input');if(inp)inp.focus();}else onNav('home');}}>
          Start comparing — it is free →
        </button>
      </div>

      {/* Instructor CTA */}
      <div style={{background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:16,padding:'18px',marginBottom:12,display:'flex',alignItems:'center',gap:14}}>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>Are you a driving instructor?</div>
          <div style={{fontSize:13,color:'#475569',lineHeight:1.5}}>List free. Premium placement from £19.99/mo.</div>
        </div>
        <button className="btn btn-gh btn-sm" style={{flexShrink:0}} onClick={()=>onNav('instructors')}>Learn more</button>
      </div>
    </div>

    {/* Footer */}
    <div style={{padding:'24px 16px',borderTop:'1px solid #e2e8f0',marginTop:4,textAlign:'center'}}>
      <div style={{fontSize:12,color:'#64748b',marginBottom:10}}>HHR Holdings Ltd · passd-ai.co.uk</div>
      <div style={{display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap'}}>
        {[['Privacy Policy','legal_privacy'],['Terms of Service','legal_terms'],['Cookie Policy','legal_cookies'],['For Instructors','instructors']].map(([l,v])=>(
          <button key={v} onClick={()=>onNav(v)} style={{background:'none',border:'none',color:'#1d6ff3',cursor:'pointer',fontSize:13,fontWeight:600,fontFamily:'inherit'}}>{l}</button>
        ))}
      </div>
      <div style={{fontSize:11,color:'#94a3b8',marginTop:12,lineHeight:1.6}}>
        Passd is a comparison service. Pass rates are self-reported unless marked DVSA-verified. Always verify your instructor ADI status at gov.uk.
      </div>
    </div>
  </div>;
};


