import { useState, useMemo, useEffect, useCallback, Fragment, useRef, lazy, Suspense } from 'react';

/* ── LAZY PAGE IMPORTS (split into separate chunks) ─────── */
const Compare       = lazy(()=>import('./pages/Compare.jsx'));
const Profile       = lazy(()=>import('./pages/Profile.jsx'));
const Theory        = lazy(()=>import('./pages/Theory.jsx'));
const Dashboard     = lazy(()=>import('./pages/Dashboard.jsx'));
const Login         = lazy(()=>import('./pages/Login.jsx'));
const Signup        = lazy(()=>import('./pages/Signup.jsx'));
const Portal        = lazy(()=>import('./pages/Portal.jsx'));
const ForInstructors= lazy(()=>import('./pages/ForInstructors.jsx'));
const Admin         = lazy(()=>import('./pages/Admin.jsx'));
const AdminLogin    = lazy(()=>import('./pages/AdminLogin.jsx'));
const Legal         = lazy(()=>import('./pages/Legal.jsx'));
const LegalHub      = lazy(()=>import('./pages/LegalHub.jsx'));

/* ── PAGE LOADER SPINNER ─────────────────────────────────── */
const PageLoader=()=><div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60svh'}}>
  <div style={{width:32,height:32,border:'3px solid #e2e8f0',borderTopColor:'#1d6ff3',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
</div>;


/* ── DATA ── */
const HRS = {'Complete Beginner':47,'A Few Hours':35,'Some Experience':22,'Returning Driver':12};
const RAVG = pc => {const p=pc.toUpperCase();if(/^M/.test(p))return 34;if(/^(LS|BD)/.test(p))return 32;if(/^(E[0-9]|W[0-9]|N[0-9]|SW|SE)/.test(p))return 56;if(/^B/.test(p))return 36;return 34;};
const INSTS=[
  {id:1,name:'Sarah Mitchell',email:'sarah@passd-ai.co.uk',post:'M1',area:'Central Manchester',dist:1.2,tx:['Manual','Automatic'],gender:'Female',quals:['ADI','Pass Plus Registered'],types:['Standard','Pass Plus','Refresher'],support:['Anxious Drivers','ADHD Friendly'],rate:32,passRate:91,yrs:12,rating:4.9,reviews:187,verified:true,dvsaRef:'ADI-2847361',tier:'Premium',avail:'Available',bio:'Twelve years specialising in anxious learners and those with ADHD. Calm, structured lessons with a 91% first-time pass rate.',avatar:'https://i.pravatar.cc/200?u=s1',history:[35,34,34,33,32],rviews:[{author:'Emma T.',rating:5,text:'Sarah is incredible. Passed first time!',date:'2 weeks ago'},{author:'Jordan K.',rating:5,text:'Best decision I made.',date:'1 month ago'}]},
  {id:2,name:'James Okafor',email:'james@passd-ai.co.uk',post:'M3',area:'Salford',dist:2.5,tx:['Automatic'],gender:'Male',quals:['ADI','Advanced Driving'],types:['Intensive','Beginner','Standard'],support:['Anxious Drivers'],rate:39,passRate:94,yrs:8,rating:5.0,reviews:96,verified:true,dvsaRef:'ADI-1938274',tier:'Premium',avail:'Limited',bio:'Intensive specialist. Zero to test-ready in 10 days. 94% pass rate. Tesla Model 3.',avatar:'https://i.pravatar.cc/200?u=j2',history:[40,40,39,39,39],rviews:[{author:'Marcus B.',rating:5,text:'Passed in 8 days. Absolute legend.',date:'3 weeks ago'}]},
  {id:3,name:'Priya Sharma',email:'priya@passd-ai.co.uk',post:'M14',area:'Fallowfield',dist:3.8,tx:['Manual'],gender:'Female',quals:['ADI'],types:['Standard','Beginner','Refresher'],support:['BSL / Deaf Support','Autism Friendly'],rate:29,passRate:86,yrs:6,rating:4.7,reviews:54,verified:true,dvsaRef:'ADI-3726481',tier:'Verified',avail:'Available',bio:'BSL-trained and autism-friendly. Patient, structured approach.',avatar:'https://i.pravatar.cc/200?u=p3',history:[31,30,30,29,29],rviews:[{author:'Alex W.',rating:5,text:'Understood my needs straight away.',date:'1 month ago'}]},
  {id:4,name:'Tom Barker',email:'tom@passd-ai.co.uk',post:'M20',area:'Didsbury',dist:5.6,tx:['Automatic','Manual'],gender:'Male',quals:['ADI','Pass Plus','Motorbike'],types:['Standard','Pass Plus','Motorbike','Refresher'],support:['Adapted Vehicle'],rate:45,passRate:89,yrs:14,rating:4.8,reviews:231,verified:true,dvsaRef:'ADI-9274651',tier:'Premium',avail:'Limited',bio:'14 years. Cars, motorbikes and adaptive driving. Adapted dual-control vehicle available.',avatar:'https://i.pravatar.cc/200?u=t4',history:[46,46,45,45,45],rviews:[{author:'Dan H.',rating:5,text:'Taught me car and motorbike. Exceptional.',date:'2 weeks ago'}]},
  {id:5,name:'David Nkosi',email:'david@passd-ai.co.uk',post:'M8',area:'Moston',dist:6.2,tx:['Manual'],gender:'Male',quals:['PDI'],types:['Standard','Beginner'],support:[],rate:24,passRate:78,yrs:2,rating:4.3,reviews:18,verified:false,dvsaRef:'',tier:'Free',avail:'Available',bio:'Affordable lessons. Flexible evenings and weekends.',avatar:'https://i.pravatar.cc/200?u=d5',history:[25,25,24,24,24],rviews:[]},
  {id:6,name:'Claire Hughes',email:'claire@passd-ai.co.uk',post:'M16',area:'Stretford',dist:4.1,tx:['Automatic','Manual'],gender:'Female',quals:['ADI','Intensive Specialist'],types:['Intensive','Beginner','Standard'],support:['Anxious Drivers'],rate:36,passRate:93,yrs:9,rating:4.8,reviews:142,verified:true,dvsaRef:'ADI-5847293',tier:'Premium',avail:'Available',bio:'Intensive specialist. Zero to licence in 10 days. 93% pass rate.',avatar:'https://i.pravatar.cc/200?u=c6',history:[38,37,37,36,36],rviews:[{author:'Riley M.',rating:5,text:'Passed in 9 days. Claire is magic.',date:'3 weeks ago'}]},
  {id:7,name:'Ryan Casey',email:'ryan@passd-ai.co.uk',post:'M21',area:'Chorlton',dist:4.8,tx:['Manual','Automatic'],gender:'Male',quals:['ADI'],types:['Standard','Refresher'],support:[],rate:33,passRate:84,yrs:7,rating:4.6,reviews:89,verified:true,dvsaRef:'ADI-6374821',tier:'Verified',avail:'Available',bio:'Calm and methodical. Most learners pass within 35 hours.',avatar:'https://i.pravatar.cc/200?u=r7',history:[35,34,34,33,33],rviews:[]},
  {id:8,name:'Aisha Rahman',email:'aisha@passd-ai.co.uk',post:'M13',area:'Longsight',dist:2.9,tx:['Manual','Automatic'],gender:'Female',quals:['ADI'],types:['Standard','Beginner','Intensive'],support:['ADHD Friendly','Anxious Drivers'],rate:31,passRate:88,yrs:5,rating:4.7,reviews:67,verified:true,dvsaRef:'ADI-8374629',tier:'Verified',avail:'Available',bio:'ADHD-friendly structured lessons. 88% pass rate.',avatar:'https://i.pravatar.cc/200?u=a8',history:[33,32,32,31,31],rviews:[]},
  {id:9,name:'Demo Instructor',email:'instructor@passd-ai.co.uk',post:'M2',area:'Manchester City',dist:1.8,tx:['Automatic'],gender:'Any',quals:['ADI'],types:['Standard','Refresher'],support:[],rate:33,passRate:82,yrs:5,rating:4.5,reviews:45,verified:false,dvsaRef:'',tier:'Free',avail:'Available',bio:'Demo account.',avatar:'https://i.pravatar.cc/200?u=x9',history:[34,34,33,33,33],rviews:[]},
];
const LEARNERS=[{id:1,name:'Alex Doe',email:'alex@passd-ai.co.uk',emailVerified:true,postcode:'M1 1AA'}];
const THEORY=[
  {id:'signs',name:'Road Signs',progress:65,questions:[
    {id:1,text:'What does a circular sign with a red border indicate?',opts:['Warning','Information','Orders — must not do','Direction'],correct:2,exp:'Circular signs with red borders give mandatory orders.'},
    {id:2,text:'What shape is the UK STOP sign?',opts:['Triangle','Circle','Square','Octagon'],correct:3,exp:'The octagonal shape makes STOP uniquely identifiable.'},
    {id:3,text:'A triangular road sign means…',opts:['Warning ahead','Give way','Info only','No entry'],correct:0,exp:'Triangular signs always warn of a hazard ahead.'},
  ]},
  {id:'hazard',name:'Hazard Perception',progress:80,questions:[
    {id:4,text:'When should you use the two-second rule?',opts:['Wet weather only','Checking mirrors','Safe following distance','Motorways only'],correct:2,exp:'The two-second rule ensures safe following distance.'},
    {id:5,text:'A ball rolls into the road. What do you do?',opts:['Speed up','Swerve','Prepare to stop','Sound horn'],correct:2,exp:'A ball often means a child may follow.'},
  ]},
  {id:'vehicle',name:'Vehicle Handling',progress:40,questions:[{id:6,text:'Correct hand position on the steering wheel?',opts:["12 o'clock",'10 and 2','9 and 3','8 and 4'],correct:2,exp:'9 and 3 keeps hands away from the airbag zone.'}]},
  {id:'motorway',name:'Motorway Driving',progress:95,questions:[{id:7,text:'National speed limit on a UK motorway?',opts:['60 mph','70 mph','80 mph','No limit'],correct:1,exp:'70 mph is the national limit.'}]},
  {id:'vulnerable',name:'Vulnerable Road Users',progress:55,questions:[{id:8,text:'Minimum clearance when overtaking a cyclist?',opts:['0.5m','1m','1.5m','2m'],correct:2,exp:'The Highway Code recommends at least 1.5 metres.'}]},
];
const MQS=THEORY.flatMap(t=>t.questions);

/* ── ICONS ── */
const Sv=({d,s=20,...p})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d={d}/></svg>;
const Ic={
  home:    <Sv d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10"/>,
  compare: <Sv d="M18 20V10M12 20V4M6 20v-6"/>,
  theory:  <Sv d="M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>,
  user:    <Sv d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8"/>,
  more:    <Sv d="M4 6h16M4 12h16M4 18h16"/>,
  check:   <Sv d="M20 6L9 17l-5-5"/>,
  x:       <Sv d="M18 6L6 18M6 6l12 12"/>,
  arR:     <Sv d="M5 12h14M12 5l7 7-7 7"/>,
  arL:     <Sv d="M19 12H5M12 19l-7-7 7-7"/>,
  pin:     <Sv d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z M12 10a2 2 0 100-4 2 2 0 000 4"/>,
  shield:  <Sv d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  star:    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>,
  filter:  <Sv d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>,
  pound:   <Sv d="M9 17H5m14 0h-4m-6 0V9a3 3 0 116 0v8m-6 0h6"/>,
  book:    <Sv d="M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>,
  logout:  <Sv d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>,
  refresh: <Sv d="M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15"/>,
  mail:    <Sv d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"/>,
  tag:     <Sv d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01"/>,
  chart:   <Sv d="M18 20V10M12 20V4M6 20v-6"/>,
  award:   <Sv d="M12 15a6 6 0 100-12 6 6 0 000 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>,
  dvsa:    <Sv d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>,
  lock:    <Sv d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4"/>,
  zap:     <Sv d="M13 2L3 14h9l-1 8 10-12h-9z"/>,
  instruc: <Sv d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75"/>,
};

/* ── HELPERS ── */
const calcPS=i=>{const p=Math.max(0,Math.min(100,100-((i.rate-20)/50)*100));return Math.round(p*.4+(i.rating/5*100)*.3+i.passRate*.3);};
const scCol=s=>s>=85?'#16a34a':s>=70?'#1d6ff3':s>=55?'#d97706':'#dc2626';
const Stars=({r,sz=13})=><span className="stars">{Array.from({length:5},(_,i)=><span key={i} style={{opacity:i<Math.floor(r)?1:i<r?.5:.2,fontSize:sz}}>{Ic.star}</span>)}</span>;
const AvDot=({s})=><span className={`avdot ${s==='Available'?'av-g':s==='Limited'?'av-a':'av-r'}`}/>;
const Bench=({rate,avg})=>{const d=rate-avg;if(d<=-3)return<span className="bench b-lo">↓ £{Math.abs(d)} below avg</span>;if(d>=3)return<span className="bench b-hi">↑ £{d} above avg</span>;return<span className="bench b-av">Near avg</span>;};

/* simulate DVSA */
const simDVSA=async ref=>{await new Promise(r=>setTimeout(r,1400));const f=INSTS.find(i=>i.dvsaRef===ref);return f?{ok:true,name:f.name,grade:'A',renewed:'Jan 2027'}:{ok:false,msg:'Not found in DVSA register.'};};
const simEmail=async(to,sub,body)=>{await new Promise(r=>setTimeout(r,700));return{ok:true,id:`msg_${Date.now()}`,to,preview:body.slice(0,100)};};

/* ── SHEET ── */
const Sheet=({open,onClose,title,children,footer})=>{
  if(!open)return null;
  return<>
    <div className="sh-ov" onClick={onClose}/>
    <div className="sh">
      <div className="sh-bar"/>
      <div className="sh-hd">
        <span style={{fontSize:18,fontWeight:700}}>{title}</span>
        <button className="xbtn" onClick={onClose}>{Ic.x}</button>
      </div>
      <div className="sh-scroll">
        <div className="sh-bd">{children}</div>
      </div>
      {footer&&<div className="sh-foot">{footer}</div>}
    </div>
  </>;
};

/* ── MODAL ── */
const Modal=({open,onClose,title,children,footer})=>{
  if(!open)return null;
  return<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal">
      <div className="modal-hd">
        <span style={{fontSize:18,fontWeight:700}}>{title}</span>
        <button className="xbtn" onClick={onClose}>{Ic.x}</button>
      </div>
      <div className="modal-bd">{children}</div>
      {footer&&<div style={{padding:'0 20px 8px',display:'flex',gap:10}}>{footer}</div>}
    </div>
  </div>;
};

/* ── FILTER CONTENT ── */
const FilterContent=({maxRate,setMR,tx,setTx,gender,setG,ltype,setLt,verOnly,setVO,specs,toggleSpec,onReset})=>{
  const specOpts=['Anxious Drivers','ADHD Friendly','BSL / Deaf Support','Autism Friendly','Adapted Vehicle'];
  const Row=({label,children})=><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'12px 0',borderBottom:'1px solid #f1f5f9'}}><span style={{fontSize:15,fontWeight:600,color:'#0f1724',flexShrink:0}}>{label}</span>{children}</div>;
  return<div style={{display:'flex',flexDirection:'column'}}>
    {/* Rate slider */}
    <div style={{padding:'12px 0 16px',borderBottom:'1px solid #f1f5f9'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <span style={{fontSize:15,fontWeight:600}}>Max rate</span>
        <span style={{fontSize:17,fontWeight:800,color:'#1d6ff3'}}>£{maxRate}<span style={{fontSize:13,fontWeight:600,color:'#64748b'}}>/hr</span></span>
      </div>
      <input type="range" min={20} max={80} value={maxRate} onChange={e=>setMR(+e.target.value)}/>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#64748b',marginTop:4}}><span>£20</span><span>£80</span></div>
    </div>
    {/* Selects — compact inline layout */}
    <Row label="Transmission">
      <select className="sel" value={tx} onChange={e=>setTx(e.target.value)} style={{width:'auto',height:38,fontSize:14,padding:'0 10px',borderRadius:10,maxWidth:160}}>
        {['Any','Manual','Automatic'].map(o=><option key={o}>{o}</option>)}
      </select>
    </Row>
    <Row label="Lesson type">
      <select className="sel" value={ltype} onChange={e=>setLt(e.target.value)} style={{width:'auto',height:38,fontSize:14,padding:'0 10px',borderRadius:10,maxWidth:160}}>
        {['Any','Beginner','Standard','Intensive','Pass Plus','Refresher','Motorbike'].map(o=><option key={o}>{o}</option>)}
      </select>
    </Row>
    <Row label="Gender">
      <select className="sel" value={gender} onChange={e=>setG(e.target.value)} style={{width:'auto',height:38,fontSize:14,padding:'0 10px',borderRadius:10,maxWidth:160}}>
        {['Any','Male','Female'].map(o=><option key={o}>{o}</option>)}
      </select>
    </Row>
    {/* Verified only — inline row */}
    <Row label="Verified only">
      <label className="tog"><input type="checkbox" checked={verOnly} onChange={e=>setVO(e.target.checked)}/><span className="tog-t"/></label>
    </Row>
    {/* Specialist support — compact chips */}
    <div style={{padding:'12px 0'}}>
      <div style={{fontSize:12,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10}}>Specialist support</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
        {specOpts.map(s=>{const on=specs.includes(s);return<button key={s} type="button"
          onClick={()=>toggleSpec(s)}
          style={{padding:'8px 14px',borderRadius:99,fontSize:13,fontWeight:600,cursor:'pointer',border:`1.5px solid ${on?'#1d6ff3':'#e2e8f0'}`,background:on?'#e8f0fd':'#ffffff',color:on?'#1d6ff3':'#475569',transition:'all .15s'}}>
          {on&&'✓ '}{s}
        </button>;})}
      </div>
    </div>
    {/* Reset */}
    <button className="btn btn-gh btn-full" style={{marginTop:4,height:40,fontSize:14}} onClick={onReset}>Reset all filters</button>
  </div>;
};

/* ── SKELETON ── */
const Skel=()=><div className="ic" style={{pointerEvents:'none'}}>
  <div className="ic-body">
    <div className="ic-top">
      <div className="sk" style={{width:56,height:56,borderRadius:'50%',flexShrink:0}}/>
      <div style={{flex:1}}>
        <div className="sk" style={{height:18,width:'55%',marginBottom:8}}/>
        <div className="sk" style={{height:13,width:'70%',marginBottom:6}}/>
        <div className="sk" style={{height:13,width:'40%'}}/>
      </div>
    </div>
    <div className="sk" style={{height:52,borderRadius:12}}/>
  </div>
</div>;

/* ── HOME ── */
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


const App=()=>{
  const [view,setView]=useState('home');
  const [insts,setInsts]=useState(INSTS);
  const [learners,setLearners]=useState(LEARNERS);
  const [sp,setSp]=useState(null);
  const [selId,setSelId]=useState(null);
  const [lu,setLu]=useState(null);
  const [iu,setIu]=useState(null);
  const [admin,setAdmin]=useState(false);
  const [bookI,setBookI]=useState(null);
  const [enquiries,setEnquiries]=useState([]);
  const [reviews,setReviews]=useState([]);

  // Submit review — goes to pending for 24hrs, auto-publishes unless flagged
  const submitReview=(instId,rating,text,authorName)=>{
    const rev={
      id:Date.now(),
      instId,
      author:authorName,
      rating,
      text,
      date:'Just now',
      status:'pending', // pending | published | flagged
      submitted:Date.now(),
    };
    setReviews(p=>[rev,...p]);
    // Simulate 24hr auto-publish (use 3s in demo)
    setTimeout(()=>{
      setReviews(p=>p.map(r=>r.id===rev.id&&r.status==='pending'?{...r,status:'published',date:'Just now'}:r));
    },3000);
    return rev.id;
  };

  const flagReview=(reviewId)=>{
    setReviews(p=>p.map(r=>r.id===reviewId?{...r,status:'flagged'}:r));
  };
  const addEnquiry=(inst,details)=>setEnquiries(p=>[{
    id:Date.now(),instId:inst.id,instName:inst.name,instAvatar:inst.avatar,
    instRate:inst.rate,instArea:inst.area,instPassRate:inst.passRate,
    date:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),
    time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),
    status:'Sent',details,
  },...p]);
  const [topics,setTopics]=useState(THEORY);
  const [mockLeft,setMockLeft]=useState(3);
  const [cookie,setCookie]=useState(()=>{try{return localStorage.getItem('pp_c');}catch(e){return null;}});
  const [menuOpen,setMenuOpen]=useState(false);
  const [autoScroll,setAutoScroll]=useState(0);
  const [lc,setLc]=useState(0);

  const nav=useCallback(v=>{window.scrollTo(0,0);setMenuOpen(false);if(v==='dashboard'&&!lu){setView('login');return;}setView(v);},[lu]);

  const handleLogin=(t,u)=>{if(t==='inst'){setIu(u);nav('portal');}else{setLu(u);nav('dashboard');}};
  const render=()=>{
    if(admin&&view==='admin')return<Admin insts={insts} learners={learners} onApprove={id=>setInsts(p=>p.map(i=>i.id===id?{...i,verified:true}:i))} onLogout={()=>{setAdmin(false);nav('home');}}/>;
    if(view==='adminLogin')return<AdminLogin onLogin={()=>{setAdmin(true);setView('admin');}}/>;
    switch(view){
      case 'home':      return<Home onNav={nav} onSearch={p=>{setSp(p);nav('compare');}} autoScroll={autoScroll} onScrolled={()=>setAutoScroll(0)}/>;
      case 'compare':   return<Compare insts={insts} sp={sp} isGuest={!lu} onNav={nav} onProfile={id=>{setSelId(id);nav('profile');}} onBook={i=>setBookI(i)}/>;
      case 'profile':   {const i=insts.find(x=>x.id===selId);return i?<Profile inst={i} exp={sp?.exp} pc={sp?.postcode} isGuest={!lu} onBack={()=>nav('compare')} onBook={i=>setBookI(i)} onNav={nav} reviews={reviews.filter(r=>r.instId===i.id)} onReview={(rating,text)=>submitReview(i.id,rating,text,lu?.name||'Anonymous')}/>:<Home onNav={nav} onSearch={p=>{setSp(p);nav('compare');}}/>;}
      case 'theory':    return<Theory topics={topics} setTopics={setTopics} mockLeft={mockLeft} setMockLeft={setMockLeft} isGuest={!lu} onNav={nav}/>;
      case 'dashboard': return lu?<Dashboard learner={lu} onNav={nav} enquiries={enquiries}/>:<Login onLogin={handleLogin} onNav={nav} insts={insts}/>;
      case 'login':     return<Login onLogin={handleLogin} onNav={nav} insts={insts}/>;
      case 'signup':    return<Signup onSignup={(name,email)=>{const u={...LEARNERS[0],id:99,name,email};setLearners(p=>[...p,u]);setLu(u);nav('compare');}} onNav={nav}/>;
      case 'portal':    return iu?<Portal inst={iu} onUpdate={u=>{setInsts(p=>p.map(i=>i.id===u.id?u:i));setIu(u);}} onLogout={()=>{setIu(null);nav('home');}} reviews={reviews.filter(r=>r.instId===iu.id)} onFlag={flagReview}/>:<Login onLogin={handleLogin} onNav={nav} insts={insts}/>;
      case 'instructors':return<ForInstructors onNav={nav}/>;
      case 'legal':     return<LegalHub onNav={nav}/>;
      case 'legal_privacy':            return<Legal page="privacy" onBack={()=>nav('legal')}/>;
      case 'legal_terms':              return<Legal page="terms" onBack={()=>nav('legal')}/>;
      case 'legal_cookies':            return<Legal page="cookies" onBack={()=>nav('legal')}/>;
      case 'legal_instructor_agreement':return<Legal page="instructor_agreement" onBack={()=>nav('legal')}/>;
      default:          return<Home onNav={nav} onSearch={p=>{setSp(p);nav('compare');}}/>;
    }
  };

  const isPortal=['portal','admin'].includes(view)&&(iu||admin);
  const TAB_ITEMS=[
    {v:'home',l:'Home',icon:Ic.home},
    {v:'compare',l:'Compare',icon:Ic.compare},
    {v:'theory',l:'Theory',icon:Ic.theory},
    {v:lu?'dashboard':iu?'portal':'login',l:lu||iu?'Account':'Sign in',icon:Ic.user},
    {v:'__more__',l:'More',icon:Ic.more},
  ];

  const logoClick=()=>{const n=lc+1;setLc(n);if(n>=5){nav('adminLogin');setLc(0);}else nav('home');};

  return<>
    {/* Header */}
    <div className="hdr">
      {/* Logo + tagline */}
      <div style={{display:'flex',flexDirection:'column',gap:0,cursor:'pointer'}} onClick={logoClick}>
        <div style={{display:'flex',alignItems:'baseline',gap:0}}>
          <span className="logo-m"><span style={{color:'#0a1628'}}>Pass</span><span style={{color:'#1d6ff3'}}>d</span><span style={{color:'#1d6ff3'}}>.</span></span>
        </div>
        {!lu&&!iu&&view==='home'&&(
          <span style={{fontSize:11,color:'#64748b',fontWeight:500,letterSpacing:'-.01em',marginTop:1,lineHeight:1}}>
            Compare driving instructors
          </span>
        )}
        {(view==='compare'||view==='profile')&&(
          <span style={{fontSize:11,color:'#1d6ff3',fontWeight:600,letterSpacing:'-.01em',marginTop:1,lineHeight:1}}>
            Price · Pass rate · Total cost
          </span>
        )}
      </div>
      {/* Right side — context aware */}
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {lu
          ?<><span style={{fontSize:13,fontWeight:600,color:'#475569',maxWidth:80,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Hi, {lu.name.split(' ')[0]}</span><button className="btn btn-gh btn-sm" onClick={()=>{setLu(null);nav('home');}}>Sign out</button></>
          :iu
          ?<><span style={{fontSize:13,fontWeight:600,color:'#475569'}}>Portal</span><button className="btn btn-gh btn-sm" onClick={()=>{setIu(null);nav('home');}}>Sign out</button></>
          :view==='home'
          ?<><button className="btn btn-gh btn-sm" onClick={()=>nav('login')}>Sign in</button><button className="btn btn-p btn-sm" onClick={()=>{setAutoScroll(n=>n+1);nav('home');}}>Compare free</button></>
          :view==='compare'||view==='profile'
          ?<button className="btn btn-gh btn-sm" onClick={()=>nav('home')}>↩ New search</button>
          :<><button className="btn btn-gh btn-sm" onClick={()=>nav('login')}>Sign in</button><button className="btn btn-p btn-sm" onClick={()=>nav('compare')}>Compare</button></>
        }
      </div>
    </div>

    {/* Page */}
    <Suspense fallback={<PageLoader/>}><div key={view} className="fu">{render()}</div></Suspense>

    {/* Tab bar */}
    {!isPortal&&<div className="tabbar">
      {TAB_ITEMS.map(({v,l,icon})=>(
        <button key={v} className={`tbi${view===v||(v==='__more__'&&menuOpen)?' on':''}`}
          onClick={v==='__more__'?()=>setMenuOpen(m=>!m):()=>nav(v)}>
          {icon}<span>{l}</span>
        </button>
      ))}
    </div>}

    {/* More menu */}
    {menuOpen&&<>
      <div style={{position:'fixed',inset:0,zIndex:98}} onClick={()=>setMenuOpen(false)}/>
      <div className="nmenu">
        <div style={{width:36,height:4,background:'#e2e8f0',borderRadius:99,margin:'12px auto 8px'}}/>
        {[
          {v:'instructors',l:'For Instructors',sub:'List your profile, top 3 placement',icon:Ic.instruc},
          {v:'theory',l:'Theory Practice',sub:'DVSA questions, mock tests',icon:Ic.theory},
          {v:'compare',l:'Compare Instructors',sub:'Find the best value near you',icon:Ic.compare},
          {v:lu?'dashboard':iu?'portal':'login',l:lu||iu?'My Account':'Sign in / Sign up',sub:lu?'Progress & bookings':iu?'Portal & subscription':'Free account',icon:Ic.user},
          {v:'legal',l:'Legal & Privacy',sub:'Terms, privacy policy, cookies',icon:Ic.lock},
        ].map(({v,l,sub,icon})=>(
          <button key={v} className="nmenu-item" onClick={()=>nav(v)}>
            <span style={{color:'#1d6ff3',flexShrink:0}}>{icon}</span>
            <span style={{flex:1}}>
              <span style={{display:'block',fontWeight:700,fontSize:15,color:'#0f1724'}}>{l}</span>
              <span style={{display:'block',fontSize:12,color:'#64748b',marginTop:1}}>{sub}</span>
            </span>
            <span style={{color:'#94a3b8',flexShrink:0}}><Sv d="M9 18l6-6-6-6" s={16}/></span>
          </button>
        ))}
      </div>
    </>}

    {/* Book modal */}
    {bookI&&<BookModal inst={bookI} onClose={()=>setBookI(null)} learner={lu} onNav={nav} onSent={addEnquiry}/>}

    {/* Cookie */}
    {!cookie&&<div className="cookie">
      <span style={{flex:1,lineHeight:1.5}}>We use cookies. <button onClick={()=>nav('legal_cookies')} style={{background:'none',border:'none',color:'rgba(255,255,255,.7)',cursor:'pointer',textDecoration:'underline',fontSize:'inherit',fontFamily:'inherit'}}>Learn more</button></span>
      <div style={{display:'flex',gap:8,flexShrink:0}}>
        <button className="btn btn-sm" style={{background:'rgba(255,255,255,.15)',color:'#fff',height:36}} onClick={()=>{setCookie('d');try{localStorage.setItem('pp_c','d');}catch(e){}}}>No</button>
        <button className="btn btn-p btn-sm" onClick={()=>{setCookie('a');try{localStorage.setItem('pp_c','a');}catch(e){}}}>Accept</button>
      </div>
    </div>}
  </>;
};



export default App;
