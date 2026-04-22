import { useState, useMemo, useEffect, useCallback, Fragment, useRef } from 'react';

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


const Compare=({insts,sp,isGuest,onNav,onProfile,onBook})=>{
  const [sort,setSort]=useState('ps');
  const [filterOpen,setFO]=useState(false);
  const [maxRate,setMR]=useState(60);
  const [tx,setTx]=useState(sp?.tx||'Any');
  const [gender,setG]=useState('Any');
  const [ltype,setLt]=useState('Any');
  const [specs,setSpecs]=useState([]);
  const [verOnly,setVO]=useState(false);
  const [loading,setLoad]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoad(false),600);return()=>clearTimeout(t);},[sp]);
  const pc=sp?.postcode||'';
  const exp=sp?.exp||'Complete Beginner';
  const hrs=HRS[exp]||47;
  const ravg=RAVG(pc);
  const togSpec=s=>setSpecs(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);
  const reset=()=>{setTx('Any');setG('Any');setLt('Any');setVO(false);setMR(60);setSpecs([]);};
  const activeF=[tx!=='Any',gender!=='Any',ltype!=='Any',verOnly,...specs.map(()=>true)].filter(Boolean).length;

  const results=useMemo(()=>{
    let r=insts.filter(i=>(tx==='Any'||i.tx.includes(tx))&&(gender==='Any'||i.gender===gender)&&(ltype==='Any'||i.types.includes(ltype))&&(!verOnly||i.verified)&&i.rate<=maxRate&&(specs.length===0||specs.every(s=>i.support.includes(s)))).map(i=>({...i,total:i.rate*hrs,ps:calcPS(i)}));
    switch(sort){case 'rate':return r.sort((a,b)=>a.rate-b.rate);case 'total':return r.sort((a,b)=>a.total-b.total);case 'pass':return r.sort((a,b)=>b.passRate-a.passRate);case 'rating':return r.sort((a,b)=>b.rating-a.rating);default:return r.sort((a,b)=>b.ps-a.ps);}
  },[insts,tx,gender,ltype,verOnly,maxRate,specs,sort,hrs]);

  const maxSave=results.length>1?results[results.length-1].total-results[0].total:0;

  return<div className="page">

    {/* Context banner — tells learner exactly what they're looking at */}
    <div style={{background:'#0a1628',padding:'14px 16px 12px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:8}}>
        <div>
          <div style={{fontSize:16,fontWeight:800,color:'#fff',letterSpacing:'-.01em'}}>
            {results.length} instructors
            {pc&&<span style={{color:'rgba(255,255,255,.5)',fontWeight:500,fontSize:14}}> near {pc}</span>}
          </div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.45)',marginTop:3}}>
            {exp||'Complete Beginner'} · approx {hrs} hrs to pass
          </div>
        </div>
        {maxSave>50&&(
          <div style={{background:'rgba(22,163,74,.2)',border:'1px solid rgba(22,163,74,.3)',borderRadius:10,padding:'6px 10px',textAlign:'center',flexShrink:0}}>
            <div style={{fontSize:15,fontWeight:900,color:'#4fffb0',lineHeight:1}}>£{Math.round(maxSave)}</div>
            <div style={{fontSize:10,color:'rgba(255,255,255,.5)',fontWeight:600,marginTop:2}}>max saving</div>
          </div>
        )}
      </div>
      {/* Sort pills inside navy banner */}
      <div style={{display:'flex',gap:6,overflowX:'auto',scrollbarWidth:'none',paddingBottom:2}}>
        <button className="filt-btn" style={{flexShrink:0,height:32,padding:'0 12px',fontSize:12}} onClick={()=>setFO(true)}>
          {Ic.filter}
          {activeF>0
            ?<span style={{marginLeft:4,background:'#fff',color:'#1d6ff3',borderRadius:99,fontSize:10,fontWeight:800,padding:'1px 5px'}}>{activeF}</span>
            :<span style={{marginLeft:4}}>Filter</span>}
        </button>
        {[
          {v:'ps',   l:'Best value', tip:'Price + pass rate + rating'},
          {v:'rate', l:'Cheapest',   tip:'Lowest hourly rate'},
          {v:'total',l:'Total cost', tip:'Estimated full cost to pass'},
          {v:'pass', l:'Pass rate',  tip:'Highest first-time pass rate'},
          {v:'rating',l:'Top rated', tip:'Highest learner rating'},
        ].map(({v,l})=>(
          <button key={v} onClick={()=>setSort(v)} style={{
            flexShrink:0,height:32,padding:'0 12px',borderRadius:99,fontSize:12,fontWeight:600,
            border:'none',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',
            background:sort===v?'#fff':'rgba(255,255,255,.12)',
            color:sort===v?'#0a1628':'rgba(255,255,255,.7)',
            transition:'all .15s',
          }}>{l}</button>
        ))}
      </div>
    </div>

    {/* How we rank explainer — shown once, dismissable */}
    <div style={{padding:'8px 16px',background:'#f4f7fe',borderBottom:'1px solid #bfdbfe',display:'flex',alignItems:'center',gap:8}}>
      <div style={{flex:1,fontSize:12,color:'#1558cc',lineHeight:1.5}}>
        <strong>Best value</strong> = price + pass rate + rating combined.
        {sort==='ps'&&' Sorted by PassScore — our fairest ranking.'}
        {sort==='rate'&&' Sorted cheapest hourly rate first.'}
        {sort==='total'&&` Sorted by total estimated cost for ${hrs} hrs.`}
        {sort==='pass'&&' Sorted by highest first-time pass rate.'}
        {sort==='rating'&&' Sorted by learner star rating.'}
      </div>
    </div>

    {/* Cards */}
    <div style={{padding:'0 16px',background:'#f1f5f9'}}>
      {loading?[0,1,2,3].map(i=><Skel key={i}/>):
       results.length===0?<div className="card card-p" style={{textAlign:'center',padding:32}}>
          <div style={{fontSize:32,marginBottom:10}}>🔍</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No instructors found</div>
          <div style={{fontSize:14,color:'#475569',lineHeight:1.6,marginBottom:16}}>
            {pc?`We don't have instructors in ${pc} yet — showing nearby results instead.`:'Try adjusting your filters.'}
          </div>
          <button className="btn btn-gh btn-sm" onClick={reset}>Clear filters</button>
        </div>:
       results.map((inst,idx)=>{
         const locked=isGuest&&idx>=3;
         const sc=scCol(inst.ps);
         const saving=results.length>1?results[results.length-1].total-inst.total:0;
         const pCls=inst.rate<=ravg-3?'mnum-g':inst.rate>=ravg+3?'mnum-a':'';

         const card=<div className={`ic${idx===0&&sort==='ps'?' ':''}`} style={idx===0&&sort==='ps'?{border:'2px solid var(--blue)'}:{}}>
           {idx===0&&sort==='ps'&&<div style={{background:'#1d6ff3',color:'#fff',fontSize:11,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}><span style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.6)',flexShrink:0}}/> Best score in your area</div>}
           {idx===0&&sort==='rate'&&<div style={{background:'#16a34a',color:'#fff',fontSize:11,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}><span style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.6)',flexShrink:0}}/> Cheapest in your area</div>}
           {idx===0&&sort==='pass'&&<div style={{background:'#7c3aed',color:'#fff',fontSize:11,fontWeight:800,letterSpacing:'.05em',textTransform:'uppercase',padding:'6px 14px',display:'flex',alignItems:'center',gap:6}}><span style={{width:6,height:6,borderRadius:'50%',background:'rgba(255,255,255,.6)',flexShrink:0}}/> Highest pass rate</div>}
           {inst.tier==='Premium'&&idx>0&&<div style={{background:'#f1f5f9',color:'#64748b',fontSize:10,fontWeight:700,padding:'3px 12px',textAlign:'right',letterSpacing:'.04em'}}>SPONSORED</div>}

           <div className="ic-body" onClick={()=>onProfile(inst.id)}>
             <div className="ic-top">
               <img src={inst.avatar} alt={inst.name} className="ic-av" loading="lazy" onError={e=>e.target.style.display='none'}/>
               <div style={{flex:1,minWidth:0}}>
                 <div className="ic-name">{inst.name}</div>
                 <div className="ic-meta">
                   <Stars r={inst.rating}/><span style={{fontWeight:700,fontSize:13}}>{inst.rating}</span><span style={{fontSize:12,color:'#64748b'}}>({inst.reviews})</span>
                   {inst.verified&&<span style={{display:'inline-flex',alignItems:'center',gap:3,color:'#1d6ff3',fontSize:12,fontWeight:600}}>{Ic.shield} Verified</span>}
                 </div>
                 <div className="ic-chips">
                   <span style={{fontSize:12,color:'#475569',display:'flex',alignItems:'center',gap:3}}>{Ic.pin} {inst.area} · {inst.dist.toFixed(1)} mi</span>
                   {saving>80&&<span className="save-p" style={{fontSize:11,padding:'3px 8px'}}>Save £{Math.round(saving)}</span>}
                 </div>
               </div>
             </div>
           </div>

           {/* 4-stat strip */}
           <div className="mstrip">
             <div className="mbox">
               <div className={`mnum ${pCls}`}>£{inst.rate}</div>
               <div className="mlbl">Per hour</div>
             </div>
             <div className="mbox">
               <div className="mnum mnum-b" style={{fontSize:inst.total>=1000?13:17}}>£{inst.total.toLocaleString()}</div>
               <div className="mlbl">Est. total</div>
             </div>
             <div className="mbox">
               <div className={`mnum ${inst.passRate>=90?'mnum-g':inst.passRate>=80?'mnum-b':'mnum-a'}`}>{inst.passRate}%</div>
               <div className="mlbl">Pass rate</div>
             </div>
             <div className="mbox">
               <div className="mnum" style={{color:sc,fontWeight:900}}>{inst.ps}</div>
               <div className="mlbl" style={{color:sc,fontWeight:700}}>PassScore</div>
             </div>
           </div>
           {/* Bench below strip — doesn't disturb grid height */}
           <div style={{padding:'5px 12px 2px',display:'flex',alignItems:'center',gap:6}}>
             <Bench rate={inst.rate} avg={ravg}/>
             {inst.avail==='Available'&&<span style={{fontSize:11,color:'#16a34a',fontWeight:600,display:'flex',alignItems:'center',gap:3,marginLeft:4}}><AvDot s="Available"/> Available</span>}
             {inst.avail!=='Available'&&<span style={{fontSize:11,color:'#d97706',fontWeight:600,display:'flex',alignItems:'center',gap:3,marginLeft:4}}><AvDot s={inst.avail}/> {inst.avail}</span>}
           </div>

           <div className="ic-acts">
             <button className="btn btn-p btn-full" style={{height:48}} onClick={e=>{e.stopPropagation();onBook(inst);}}>Book lesson</button>
             <button className="btn btn-gh" style={{height:48,padding:'0 16px',flexShrink:0}} onClick={e=>{e.stopPropagation();onProfile(inst.id);}}>{Ic.arR}</button>
           </div>
         </div>;

         if(locked)return<div key={`g${inst.id}`} className="gate">
           <div className="gate-blur">{card}</div>
           <div className="gate-panel">
             <div style={{marginBottom:8}}>{Ic.lock}</div>
             <div style={{fontWeight:800,fontSize:18,marginBottom:6}}>See all {results.length} results</div>
             <p style={{fontSize:14,color:'#475569',marginBottom:16,lineHeight:1.5}}>Sign up free to unlock the full comparison.</p>
             <button className="btn btn-p btn-full btn-lg" onClick={()=>onNav('signup')}>Unlock free</button>
           </div>
         </div>;
         return<Fragment key={inst.id}>{card}</Fragment>;
       })}
      {!loading&&results.length>0&&<p style={{fontSize:11,color:'#64748b',textAlign:'center',padding:'8px 0 4px',lineHeight:1.6}}>Sponsored placements labelled. Pass rates self-reported unless verified.</p>}
    </div>

    {/* Filter Sheet */}
    <Sheet open={filterOpen} onClose={()=>setFO(false)} title="Filters"
      footer={<button className="btn btn-p btn-full btn-lg" onClick={()=>setFO(false)}>Show {results.length} results</button>}>
      <FilterContent maxRate={maxRate} setMR={setMR} tx={tx} setTx={setTx} gender={gender} setG={setG} ltype={ltype} setLt={setLt} verOnly={verOnly} setVO={setVO} specs={specs} toggleSpec={togSpec} onReset={reset}/>
    </Sheet>
  </div>;
};

/* ── INSTRUCTOR PROFILE ── */

/* ── REVIEWS TAB ── */
const ReviewsTab=({i,reviews,onReview,isGuest,onNav})=>{
  const [showForm,setShowForm]=useState(false);
  const [rating,setRating]=useState(5);
  const [reviewText,setReviewText]=useState('');
  const [submitted,setSubmitted]=useState(false);
  const [hov,setHov]=useState(0);

  const allReviews=[
    ...i.rviews.map(r=>({...r,status:'published',id:'s_'+r.author})),
    ...(reviews||[]).filter(r=>r.status==='published'),
  ];
  const pendingCount=(reviews||[]).filter(r=>r.status==='pending').length;

  const doSubmit=()=>{
    if(!reviewText.trim()||reviewText.length<20)return;
    onReview(rating,reviewText);
    setSubmitted(true);
    setShowForm(false);
    setReviewText('');
  };

  return<>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
      <div>
        <span style={{fontWeight:700,fontSize:16}}>{allReviews.length} review{allReviews.length!==1?'s':''}</span>
        {pendingCount>0&&<span style={{fontSize:12,color:'#64748b',marginLeft:8}}>{pendingCount} pending</span>}
      </div>
      {!isGuest&&!submitted&&!showForm&&(
        <button className="btn btn-p btn-sm" onClick={()=>setShowForm(true)}>Leave a review</button>
      )}
      {isGuest&&(
        <button className="btn btn-gh btn-sm" onClick={()=>onNav('signup')}>Sign in to review</button>
      )}
    </div>

    {submitted&&<div className="cl cl-g" style={{marginBottom:16,fontSize:13}}>
      ✓ Review submitted — it will appear within 24 hours.
    </div>}

    {showForm&&<div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:14,padding:'18px',marginBottom:18}}>
      <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Your review of {i.name.split(' ')[0]}</div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:'#64748b',marginBottom:8}}>Rating</div>
        <div style={{display:'flex',gap:6}}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} type="button"
              onMouseEnter={()=>setHov(n)} onMouseLeave={()=>setHov(0)}
              onClick={()=>setRating(n)}
              style={{fontSize:28,background:'none',border:'none',cursor:'pointer',
                      color:(hov||rating)>=n?'#f59e0b':'#e2e8f0',padding:'0 2px',lineHeight:1}}>
              ★
            </button>
          ))}
          <span style={{fontSize:14,color:'#64748b',alignSelf:'center',marginLeft:4}}>
            {['','Poor','Below average','Average','Good','Excellent'][hov||rating]}
          </span>
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:'#64748b',marginBottom:6}}>Your experience</div>
        <textarea className="inp" value={reviewText} onChange={e=>setReviewText(e.target.value)}
          placeholder={'Tell other learners about your experience with '+i.name.split(' ')[0]+'...'}
          rows={4} style={{height:'auto',padding:14,fontSize:14,lineHeight:1.6,background:'#ffffff',color:'#0f1724'}}/>
        <div style={{fontSize:11,color:'#94a3b8',marginTop:4,textAlign:'right'}}>{reviewText.length}/500</div>
      </div>
      <div className="cl cl-b" style={{marginBottom:14,fontSize:12}}>
        Reviews publish after 24 hours. Instructors may flag inaccurate reviews for moderation.
      </div>
      <div style={{display:'flex',gap:10}}>
        <button className="btn btn-p btn-full" style={{height:46}}
          disabled={!reviewText.trim()||reviewText.length<20} onClick={doSubmit}>
          Submit review
        </button>
        <button className="btn btn-gh" style={{height:46,padding:'0 16px',flexShrink:0}}
          onClick={()=>{setShowForm(false);setReviewText('');}}>Cancel</button>
      </div>
      {reviewText.length>0&&reviewText.length<20&&(
        <p style={{fontSize:12,color:'#d97706',marginTop:8}}>Please write at least 20 characters.</p>
      )}
    </div>}

    {allReviews.length===0
      ?<div style={{textAlign:'center',padding:'24px 0'}}>
          <div style={{fontSize:32,marginBottom:8}}>💬</div>
          <div style={{fontWeight:600,fontSize:15,marginBottom:4}}>No reviews yet</div>
          <p style={{fontSize:14,color:'#64748b'}}>Be the first to review.</p>
        </div>
      :allReviews.map((r,idx)=>(
        <div key={r.id||idx} style={{paddingBottom:16,marginBottom:16,
          borderBottom:idx<allReviews.length-1?'1px solid #f1f5f9':undefined}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'#1d6ff3',
                           color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',
                           fontSize:13,fontWeight:700,flexShrink:0}}>
                {r.author[0].toUpperCase()}
              </div>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{r.author}</div>
                <Stars r={r.rating} sz={12}/>
              </div>
            </div>
            <span style={{fontSize:12,color:'#64748b',flexShrink:0}}>{r.date}</span>
          </div>
          <p style={{fontSize:14,color:'#475569',lineHeight:1.65,marginLeft:40}}>{r.text}</p>
        </div>
      ))
    }
  </>;
};

const Profile=({inst:i,exp,pc,onBack,onBook,isGuest,onNav,reviews,onReview})=>{
  const hrs=HRS[exp||'Complete Beginner']||47;
  const total=i.rate*hrs;
  const ravg=RAVG(pc||'');
  const ps=calcPS(i);
  const sc=scCol(ps);
  const [tab,setTab]=useState('about');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [msg,setMsg]=useState('');
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);

  const sendEnquiry=async e=>{e.preventDefault();if(isGuest){onNav('login');return;}setSending(true);await simEmail(i.email,`Enquiry — ${name}`,`From: ${name} (${email})\n\n${msg}`);setSending(false);setSent(true);};

  return<div className="page">
    {/* Hero */}
    <div className="prof-hero">
      <div style={{marginBottom:12}}>
        <button onClick={onBack} style={{background:'none',border:'none',color:'rgba(255,255,255,.6)',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:14,fontWeight:600,padding:'0 0 8px'}}>
          {Ic.arL} Back
        </button>
        <div style={{display:'flex',gap:14,alignItems:'center'}}>
          <img src={i.avatar} alt={i.name} style={{width:72,height:72,borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(255,255,255,.2)',flexShrink:0}} loading="lazy" onError={e=>e.target.style.display='none'}/>
          <div>
            <h1 style={{fontSize:24,fontWeight:800,color:'#fff',letterSpacing:'-.02em',marginBottom:5,lineHeight:1.1}}>{i.name}</h1>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              {i.verified?<span style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(79,255,176,.15)',border:'1px solid rgba(79,255,176,.3)',borderRadius:99,padding:'3px 10px',fontSize:12,fontWeight:600,color:'#4fffb0'}}>{Ic.dvsa} DVSA Verified</span>:<span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Not verified</span>}
              <span style={{fontSize:13,color:'rgba(255,255,255,.5)'}}>{i.area} · {i.yrs} yrs</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:5}}><Stars r={i.rating}/><span style={{fontSize:13,fontWeight:600,color:'#fff'}}>{i.rating}</span><span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>({i.reviews})</span><AvDot s={i.avail}/><span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>{i.avail}</span></div>
          </div>
        </div>
      </div>

      {/* 3 stats — always horizontal */}
      <div className="prof-stats">
        {[{n:`£${i.rate}`,l:'Per hour',c:'#fff'},{n:`${i.passRate}%`,l:'Pass rate',c:i.passRate>=90?'#4fffb0':'#fff'},{n:String(ps),l:'PassScore',c:sc}].map(({n,l,c})=>(
          <div key={l} className="pstat"><div className="pstat-n" style={{color:c}}>{n}</div><div className="pstat-l">{l}</div></div>
        ))}
      </div>

      {/* Total cost */}
      <div className="prof-cost">
        <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>Estimated total to pass</div>
        <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap'}}>
          <span style={{fontSize:32,fontWeight:900,color:'#93b4f0',letterSpacing:'-.03em',lineHeight:1}}>£{total.toLocaleString()}</span>
          <span style={{fontSize:13,color:'rgba(255,255,255,.4)'}}>{hrs} hrs × £{i.rate}/hr</span>
        </div>
        {total<ravg*hrs&&<div style={{fontSize:13,color:'#4fffb0',fontWeight:600,marginTop:4}}>£{Math.round(ravg*hrs-total)} cheaper than local average</div>}
      </div>
    </div>

    {/* Book CTA */}
    <div style={{padding:'16px 16px 0'}}>
      <button className="btn btn-p btn-full btn-lg" onClick={()=>onBook(i)}>Book a lesson with {i.name.split(' ')[0]}</button>
    </div>

    {/* Tabs */}
    <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#ffffff',marginTop:16,overflowX:'auto',scrollbarWidth:'none'}}>
      {[{v:'about',l:'About'},{v:'reviews',l:`Reviews (${i.rviews.length})`},{v:'contact',l:'Contact'}].map(({v,l})=>(
        <button key={v} onClick={()=>setTab(v)} style={{padding:'13px 18px',background:'none',border:'none',borderBottom:`2.5px solid ${tab===v?'#1d6ff3':'transparent'}`,color:tab===v?'#1d6ff3':'#475569',fontWeight:700,fontSize:14,cursor:'pointer',whiteSpace:'nowrap',minHeight:48,fontFamily:'inherit'}}>{l}</button>
      ))}
    </div>

    <div style={{padding:'16px',background:'#fff'}}>
      {tab==='about'&&<>
        <p style={{fontSize:15,color:'#475569',lineHeight:1.75,marginBottom:20}}>{i.bio}</p>
        <div className="slbl">Qualifications</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>{i.quals.map(q=><span key={q} className="chip chip-b" style={{padding:'6px 12px'}}>{i.verified&&<span style={{marginRight:3}}>{Ic.check}</span>}{q}</span>)}</div>
        <div className="slbl">Lesson types</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>{i.types.map(t=><span key={t} className="chip chip-n">{t}</span>)}</div>
        <div className="slbl">Transmission</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>{i.tx.map(t=><span key={t} className="chip chip-n">{t}</span>)}</div>
        {i.support.length>0&&<><div className="slbl">Specialist support</div><div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>{i.support.map(s=><span key={s} className="chip chip-g" style={{padding:'6px 12px'}}>{s}</span>)}</div></>}
        <div className="slbl">Price history — 4 weeks</div>
        <div className="pbars">{i.history.map((p,ii)=><div key={ii} className={`pb${ii===i.history.length-1?' now':''}`} style={{height:`${((p-20)/50)*100}%`}}/>)}</div>
        {(()=>{const d=i.history[i.history.length-1]-i.history[0];return d<0?<span style={{fontSize:13,color:'#16a34a',fontWeight:600}}>↓ £{Math.abs(d)} cheaper than 4 weeks ago</span>:d>0?<span style={{fontSize:13,color:'#dc2626',fontWeight:600}}>↑ £{d} more expensive now</span>:<span style={{fontSize:13,color:'#64748b'}}>Stable price</span>;})()}
      </>}
      {tab==='reviews'&&<ReviewsTab i={i} reviews={reviews} onReview={onReview} isGuest={isGuest} onNav={onNav}/>}
      {tab==='contact'&&<>
        {sent?<div style={{textAlign:'center',padding:'20px 0'}}>
          <div style={{color:'#16a34a',display:'flex',justifyContent:'center',marginBottom:12}}>{Ic.check}</div>
          <h3 style={{fontWeight:800,marginBottom:6}}>Message sent!</h3>
          <p style={{fontSize:14,color:'#475569',lineHeight:1.6}}>Your enquiry is on its way to <strong>{i.name}</strong>. They'll reply directly to your email.</p>
        </div>:isGuest?<div style={{textAlign:'center',padding:'16px 0'}}>
          <p style={{fontSize:14,color:'#475569',marginBottom:16}}>Sign up free to send enquiries directly to instructors.</p>
          <button className="btn btn-p btn-full btn-lg" onClick={()=>onNav('signup')}>Sign up to enquire</button>
        </div>:<form onSubmit={sendEnquiry} style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="field"><span className="lbl">Your name</span><input className="inp" value={name} onChange={e=>setName(e.target.value)} required/></div>
          <div className="field"><span className="lbl">Your email</span><input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <div className="field"><span className="lbl">Message</span><textarea className="inp" rows={4} value={msg} onChange={e=>setMsg(e.target.value)} placeholder={`Hi ${i.name.split(' ')[0]}, I'm interested in booking lessons…`} required style={{height:'auto',padding:14}}/></div>
          <button type="submit" className="btn btn-p btn-full btn-lg" disabled={sending}>{sending?'Sending…':<>{Ic.mail} Send enquiry</>}</button>
          <p style={{fontSize:12,color:'#64748b',textAlign:'center'}}>Delivered directly. Passd does not read your messages.</p>
        </form>}
      </>}
    </div>

    {/* Second book CTA */}
    <div style={{padding:'0 16px 8px'}}>
      <button className="btn btn-p btn-full btn-lg" onClick={()=>onBook(i)}>Book · £{i.rate}/hr</button>
    </div>
  </div>;
};

/* ── BOOK MODAL ── */
const BookModal=({inst,onClose,learner,onNav,onSent})=>{
  const [date,setDate]=useState('');
  const [time,setTime]=useState('');
  const [msg,setMsg]=useState('');
  const [name,setName]=useState(learner?.name||'');
  const [email,setEmail]=useState(learner?.email||'');
  const [phone,setPhone]=useState('');
  const [sent,setSent]=useState(false);
  const [busy,setBusy]=useState(false);

  const send=async()=>{
    setBusy(true);
    const body='Booking request from '+name+'\nEmail: '+email+'\nPhone: '+phone+'\nDate: '+date+' at '+time+'\n\n'+msg;
    await simEmail(inst.email,'Lesson request from '+name,body);
    if(onSent)onSent(inst,{name,email,phone,date,time,msg});
    setBusy(false);setSent(true);
  };

  return<Modal open={true} onClose={onClose} title={`Book with ${inst.name.split(' ')[0]}`}>
    {sent
      ?<div style={{textAlign:'center',padding:'16px 0'}}>
          <div style={{color:'#16a34a',display:'flex',justifyContent:'center',marginBottom:12}}>{Ic.check}</div>
          <h3 style={{fontWeight:800,marginBottom:8,fontSize:20}}>Request sent!</h3>
          <p style={{fontSize:14,color:'#475569',lineHeight:1.65,marginBottom:6}}><strong>{inst.name}</strong> will reply directly to:</p>
          <div style={{background:'#f1f5f9',borderRadius:10,padding:'10px 14px',fontSize:14,fontWeight:600,marginBottom:16}}>{email}</div>
          <p style={{fontSize:13,color:'#64748b',lineHeight:1.6}}>Check your inbox — including spam — within 24 hours. Passd does not read your messages.</p>
          <button className="btn btn-p btn-full" style={{marginTop:20}} onClick={onClose}>Done</button>
        </div>
      :<div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Instructor summary */}
          <div style={{display:'flex',gap:12,alignItems:'center',padding:14,background:'#f1f5f9',borderRadius:12}}>
            <img src={inst.avatar} style={{width:44,height:44,borderRadius:'50%',objectFit:'cover',flexShrink:0}} alt="" loading="lazy"/>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{inst.name}</div>
              <div style={{fontSize:12,color:'#475569',marginTop:2}}>£{inst.rate}/hr · {inst.passRate}% pass rate · {inst.area}</div>
            </div>
          </div>

          {/* Contact details — always required so instructor can reply */}
          <div style={{background:'#f4f7fe',border:'1px solid #bfdbfe',borderRadius:10,padding:'10px 14px'}}>
            <div style={{fontSize:12,fontWeight:700,color:'#1558cc',marginBottom:2}}>📬 How will the instructor reply to you?</div>
            <div style={{fontSize:13,color:'#475569'}}>Your contact details go directly to {inst.name.split(' ')[0]}. Passd never reads your messages.</div>
          </div>

          <div className="field"><span className="lbl">Your name</span>
            <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" required/>
          </div>
          <div className="field"><span className="lbl">Your email</span>
            <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="so the instructor can reply" required/>
          </div>
          <div className="field"><span className="lbl">Your mobile number</span>
            <input className="inp" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="optional — for quicker response"/>
          </div>

          <div style={{height:1,background:'#e2e8f0'}}/>

          <div className="field"><span className="lbl">Preferred date</span>
            <input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}/>
          </div>
          <div className="field"><span className="lbl">Preferred time</span>
            <select className="sel" value={time} onChange={e=>setTime(e.target.value)}>
              <option value="">Select time…</option>
              {['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field"><span className="lbl">Message (optional)</span>
            <textarea className="inp" value={msg} onChange={e=>setMsg(e.target.value)}
              placeholder={`Hi ${inst.name.split(' ')[0]}, I'm interested in booking lessons. I'm a complete beginner…`}
              style={{height:'auto',padding:14}} rows={3}/>
          </div>

          <button className="btn btn-p btn-full btn-lg"
            disabled={!name||!email||!date||!time||busy}
            onClick={send}>
            {busy?'Sending…':`Send request to ${inst.name.split(' ')[0]}`}
          </button>
          <p style={{fontSize:12,color:'#64748b',textAlign:'center',lineHeight:1.5}}>
            {inst.name.split(' ')[0]} replies directly to your email. No account needed.
          </p>
          <button className="btn btn-gh btn-full" onClick={onClose}>Cancel</button>
        </div>}
  </Modal>;
};

/* ── AUTH ── */
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
const Theory=({topics,setTopics,mockLeft,setMockLeft,isGuest,onNav})=>{
  const [quiz,setQuiz]=useState(null);
  const [qIdx,setQIdx]=useState(0);const [sel,setSel]=useState(null);const [ans,setAns]=useState(false);const [score,setScore]=useState(0);const [done,setDone]=useState(false);

  if(quiz){
    const q=quiz.qs[qIdx];
    if(done){
      const pct=Math.round(score/quiz.qs.length*100);const c=pct>=75?'#16a34a':pct>=50?'#d97706':'#dc2626';
      return<div className="page" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 20px',textAlign:'center'}}>
        <div style={{fontSize:72,fontWeight:900,color:c,letterSpacing:'-.03em',lineHeight:1,marginBottom:8}}>{pct}%</div>
        <p style={{fontSize:16,color:'#475569',marginBottom:24}}>{score} of {quiz.qs.length} correct</p>
        {isGuest&&<div className="card card-p" style={{width:'100%',maxWidth:380,marginBottom:16,textAlign:'left'}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>Save your score</div>
          <p style={{fontSize:14,color:'#475569',marginBottom:12}}>Create a free account to track progress over time.</p>
          <button className="btn btn-p btn-full" onClick={()=>onNav('signup')}>Sign up free</button>
        </div>}
        <div style={{display:'flex',gap:10,width:'100%',maxWidth:380}}>
          <button className="btn btn-gh btn-full" onClick={()=>{setQuiz(null);setDone(false);setScore(0);setQIdx(0);setSel(null);setAns(false);}}>Back</button>
          <button className="btn btn-p btn-full" onClick={()=>{setDone(false);setScore(0);setQIdx(0);setSel(null);setAns(false);}}>{Ic.refresh} Retry</button>
        </div>
      </div>;
    }
    return<div className="page" style={{padding:'16px'}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#64748b',marginBottom:8}}><span>Q{qIdx+1} / {quiz.qs.length}</span><span>{score} correct</span></div>
      <div className="prog" style={{marginBottom:20}}><div className="prog-f" style={{width:`${(qIdx/quiz.qs.length)*100}%`}}/></div>
      <div className="card card-p">
        <h2 style={{fontSize:19,fontWeight:700,marginBottom:20,lineHeight:1.35,letterSpacing:'-.01em'}}>{q.text}</h2>
        {q.opts.map((opt,ii)=>{let cls='qopt';if(ans&&ii===q.correct)cls+=' cor';else if(ans&&ii===sel)cls+=' wr';return<button key={ii} className={cls} onClick={()=>{if(ans)return;setSel(ii);setAns(true);if(ii===q.correct)setScore(s=>s+1);}} disabled={ans}><span>{opt}</span>{ans&&ii===q.correct&&<span style={{color:'#16a34a'}}>{Ic.check}</span>}{ans&&ii===sel&&ii!==q.correct&&<span style={{color:'#dc2626'}}>{Ic.x}</span>}</button>;})}
        {ans&&<div className="cl cl-b" style={{marginTop:12}}><strong>Explanation:</strong> {q.exp}</div>}
        <div style={{textAlign:'right',marginTop:16}}><button className="btn btn-p" onClick={()=>{if(qIdx<quiz.qs.length-1){setQIdx(i=>i+1);setSel(null);setAns(false);}else setDone(true);}} disabled={!ans}>{qIdx<quiz.qs.length-1?'Next':' Finish'} {Ic.arR}</button></div>
      </div>
    </div>;
  }

  return<div className="page" style={{padding:'0 16px'}}>
    <div style={{padding:'20px 0 14px'}}>
      <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>Theory Practice</h1>
      <p style={{fontSize:14,color:'#475569'}}>Official DVSA questions. Free and unlimited.</p>
    </div>
    {isGuest&&<div className="cl cl-b" style={{marginBottom:16,fontSize:13}}>Practising as guest — scores won't be saved. <button onClick={()=>onNav('signup')} style={{background:'none',border:'none',color:'#1d6ff3',fontWeight:600,cursor:'pointer',fontSize:13}}>Sign up free →</button></div>}

    {/* Mock test card */}
    <div className="card" style={{padding:'20px',marginBottom:12,background:'#0a1628'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div>
          <div style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:2}}>Mock test</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.5)'}}>{mockLeft} attempts left this week</div>
        </div>
        <div style={{fontSize:40,fontWeight:900,color:'#4fffb0',lineHeight:1}}>{mockLeft}</div>
      </div>
      <button className="btn btn-full" style={{background:'rgba(255,255,255,.15)',color:'#fff',height:46,fontWeight:700,borderRadius:12}} disabled={mockLeft<=0} onClick={()=>{setQuiz({qs:MQS.slice(0,10)});setQIdx(0);setSel(null);setAns(false);setScore(0);setDone(false);setMockLeft(m=>m-1);}}>Start mock test</button>
    </div>

    <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>Study topics</div>
    {topics.map(t=>(
      <div key={t.id} className="card" style={{marginBottom:10,padding:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <span style={{fontWeight:700,fontSize:15}}>{t.name}</span>
          <button className="btn btn-p btn-sm" onClick={()=>{setQuiz({qs:t.questions});setQIdx(0);setSel(null);setAns(false);setScore(0);setDone(false);}}>Practice</button>
        </div>
        <div className="prog"><div className="prog-f" style={{width:`${t.progress}%`}}/></div>
        <div style={{fontSize:12,color:'#64748b',textAlign:'right',marginTop:4}}>{t.progress}% complete</div>
      </div>
    ))}
  </div>;
};

/* ── DASHBOARD ── */
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
    <div key={view} className="fu">{render()}</div>

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


/* ── LEGAL PAGES ── */
const Legal=({page,onBack})=>{
  const pages={
    privacy:{
      title:'Privacy Policy',
      updated:'January 2025',
      company:'HHR Holdings Ltd',
      sections:[
        {h:'1. Who we are',t:`HHR Holdings Ltd ("Passd", "we", "us") operates passd-ai.co.uk, a driving instructor comparison platform. We are the data controller for personal data collected through this service.

Contact: hello@passd-ai.co.uk
Address: [Your registered address]
ICO Registration: [ICO REGISTRATION NUMBER — register at ico.org.uk before going live]`},
        {h:'2. What data we collect',t:`Learner visitors:
• Postcode (to show local results)
• Email address (if you sign up or subscribe to alerts)
• Usage data (pages visited, search terms) via anonymous analytics

Instructor accounts:
• Full name, email address, phone number
• Business postcode and area
• ADI badge number
• Hourly rate, pass rate, qualifications
• Profile photo (if provided)
• Payment information (processed by Stripe — we never see your card details)
• Communication history

Special category data: If you provide or search for specialist support needs (ADHD, BSL, autism, anxiety, adapted vehicle), this is processed under Article 9(2)(a) UK GDPR — explicit consent — solely for matching purposes.`},
        {h:'3. How we use your data',t:`We use your data to:
• Display your instructor profile to learner visitors
• Process subscription payments via Stripe
• Send transactional emails (booking enquiries, account notices)
• Send marketing emails (only with your explicit consent, unsubscribe anytime)
• Verify ADI credentials against the public DVSA register
• Improve the platform through anonymised analytics

We do not sell your data to third parties. We do not read messages sent between learners and instructors.`},
        {h:'4. Legal basis for processing',t:`• Contract performance: processing your account and subscription
• Legitimate interests: fraud prevention, platform security, anonymised analytics
• Legal obligation: compliance with tax and financial regulations
• Consent: marketing emails, special category data (support needs)`},
        {h:'5. Data sharing',t:`We share data only with:
• Stripe (payment processing) — Stripe Privacy Policy: stripe.com/privacy
• Resend (transactional email delivery) — resend.com/legal/privacy-policy
• Airtable (internal CRM) — airtable.com/privacy
• DVSA public register (for ADI verification — we query, we don't share)

All processors are contractually bound to process data only on our instructions.`},
        {h:'6. Data retention',t:`• Active accounts: retained while your account is live
• Instructor profiles: deleted within 30 days of account closure on request
• Payment records: retained for 7 years (legal requirement)
• Marketing consent records: retained for duration of consent + 3 years
• Learner email addresses: retained until unsubscribe or deletion request`},
        {h:'7. Your rights',t:`Under UK GDPR you have the right to:
• Access your personal data (Subject Access Request)
• Correct inaccurate data
• Delete your data ("right to be forgotten")
• Restrict or object to processing
• Data portability
• Withdraw consent at any time

To exercise any right: hello@passd-ai.co.uk. We will respond within 30 days. You also have the right to complain to the ICO: ico.org.uk`},
        {h:'8. Cookies',t:`Essential cookies (always active):
• Session management — keeps you logged in
• Security tokens — protects against CSRF attacks

Analytics cookies (consent required):
• Anonymous usage analytics to improve the platform
• No third-party advertising cookies

You can manage cookie preferences at any time via the banner at the bottom of the screen.`},
        {h:'9. Security',t:`We use HTTPS encryption for all data transmission. Passwords are hashed using bcrypt. Payment data is handled entirely by Stripe and never touches our servers. We conduct regular security reviews.`},
        {h:'10. Changes',t:`We will notify registered users by email of any material changes to this policy at least 14 days before they take effect.`},
      ]
    },
    terms:{
      title:'Terms of Service',
      updated:'January 2025',
      sections:[
        {h:'1. About Passd',t:`HHR Holdings Ltd ("Passd") operates a driving instructor comparison platform at passd-ai.co.uk. By using our service you agree to these terms.

These terms govern both learner visitors and instructor account holders. Additional terms apply to paid subscriptions (Section 8).`},
        {h:'2. Eligibility',t:`You must be 16 or older to use Passd. Instructor accounts require a valid ADI or PDI licence issued by the DVSA. By registering as an instructor you confirm you hold a valid licence and have permission to offer driving instruction in the UK.`},
        {h:'3. Instructor accounts — your obligations',t:`You agree to:
• Provide accurate information including your ADI number, hourly rate and pass rate
• Keep your profile up to date — rates and availability must reflect your current offering
• Respond to learner enquiries within 24 hours (Premium accounts) or 48 hours (Verified/Free)
• Not use automated tools to manipulate your PassScore or placement
• Not create multiple accounts for the same instructor
• Comply with DVSA regulations and UK driving instruction law at all times

Pass rates: You may display your self-reported pass rate. Passd verifies pass rates for Verified and Premium accounts against the DVSA register where possible. Knowingly misrepresenting your pass rate is grounds for immediate account termination.`},
        {h:'4. Learner use',t:`Passd is a comparison and discovery tool only. We do not guarantee the quality, safety or suitability of any instructor listed. The contract for driving lessons is between you and the instructor directly. Passd is not party to any lesson booking.

Verify your instructor's ADI status independently at gov.uk/check-driving-instructor if you have any concerns.`},
        {h:'5. PassScore and rankings',t:`PassScore is a proprietary algorithm combining price competitiveness (40%), star rating (30%) and pass rate (30%). Premium subscribers receive boosted placement within the top 3 positions where their PassScore is within 5 points of organic results. All paid placements are labelled "Sponsored." The methodology is disclosed at passd-ai.co.uk.`},
        {h:'6. Content and conduct',t:`You must not:
• Post false reviews or ratings
• Use the platform to harass, defame or threaten any person
• Scrape, copy or redistribute our comparison data
• Attempt to reverse-engineer our algorithm or systems
• Use Passd to market competing comparison services

Passd reserves the right to remove any content or suspend any account that violates these terms without notice.`},
        {h:'7. Intellectual property',t:`Passd, PassScore, and associated branding are trademarks of HHR Holdings Ltd. You may not use our branding without written permission. Instructor profile content remains owned by the instructor; by listing on Passd you grant us a licence to display it on the platform.`},
        {h:'8. Subscriptions and payments',t:`Subscriptions are billed monthly or annually via Stripe. All prices shown are inclusive of VAT where applicable.

Cancellation: Cancel anytime from your portal. Your access continues until the end of the billing period. No refunds for partial periods.

Free trial / founder pricing: Where founder pricing is offered, the rate will be honoured for the duration of your active subscription. If you cancel and resubscribe, current pricing applies.

Premium slot guarantee: The top 3 guarantee is per-postcode and requires a minimum of 1 active learner search per month in your area. Passd reserves the right to adjust postcode boundaries. If your postcode area has no learner searches in a given month, a pro-rata credit will be applied.`},
        {h:'9. Limitation of liability',t:`Passd provides a comparison and discovery service only. We are not liable for:
• The conduct of any instructor or learner
• The outcome of any driving lesson or test
• Loss of business resulting from ranking position changes
• Technical downtime (we target 99.5% uptime but do not guarantee it)

Our total liability to you in any 12-month period shall not exceed the total subscription fees paid by you in that period.`},
        {h:'10. Governing law',t:`These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.`},
        {h:'11. Contact',t:`HHR Holdings Ltd
hello@passd-ai.co.uk
passd-ai.co.uk`},
      ]
    },
    cookies:{
      title:'Cookie Policy',
      updated:'January 2025',
      sections:[
        {h:'What are cookies',t:`Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.`},
        {h:'Cookies we use',t:`Essential cookies (always active — no consent required):

• pp_session — keeps you logged in during your visit. Expires: end of session.
• pp_csrf — security token to prevent cross-site request forgery. Expires: end of session.
• pp_c — records your cookie consent choice. Expires: 1 year.

Analytics cookies (consent required):

• We use anonymous analytics to understand how learners and instructors use the platform. No personally identifiable data is collected. No data is shared with advertising networks.

We do not use:
• Advertising cookies
• Social media tracking cookies
• Any third-party marketing cookies`},
        {h:'Managing cookies',t:`You can withdraw consent at any time by clearing your browser cookies and revisiting the site. Most browsers also allow you to block cookies entirely — see your browser's help documentation.

Blocking essential cookies will prevent you from staying logged in to your account.`},
        {h:'Contact',t:`Questions about our cookie use: hello@passd-ai.co.uk`},
      ]
    },
    instructor_agreement:{
      title:'Instructor Listing Agreement',
      updated:'January 2025',
      sections:[
        {h:'Overview',t:`This agreement governs the listing of driving instructor profiles on Passd. By creating a profile you agree to these terms in addition to our general Terms of Service.`},
        {h:'Profile accuracy',t:`You are responsible for the accuracy of your profile at all times including:
• Your hourly rate (must reflect your actual rate charged to new learners)
• Your pass rate (must be your genuine overall pass rate — inflated figures are grounds for removal)
• Your qualifications and certifications
• Your availability status
• Your specialist support capabilities

Passd reserves the right to verify any profile information against public records including the DVSA ADI register.`},
        {h:'Enquiry handling',t:`Free accounts: respond to enquiries within 48 hours or your response rate score will be affected.
Verified accounts: respond within 24 hours.
Premium accounts: 24-hour response is a condition of maintaining your guaranteed top 3 placement.

Failure to respond to 3 or more consecutive enquiries may result in your placement being reduced or your account being suspended.`},
        {h:'Premium placement guarantee',t:`Premium placement guarantees that your profile appears in positions 1–3 in search results for your registered postcode area, subject to:
• A minimum of 1 learner search per month in your postcode
• Your profile remaining complete and up to date
• Your account remaining in good standing
• The cap of 3 Premium instructors per postcode

Passd will not be liable if placement is temporarily affected by technical issues, though we will apply credits where downtime exceeds 24 hours.`},
        {h:'Termination',t:`You may close your account at any time. Passd may terminate your listing without notice for:
• Providing false information
• Holding an invalid or lapsed ADI/PDI licence
• Receiving verified complaints of misconduct
• Attempting to manipulate the comparison algorithm

On termination, your profile will be removed within 24 hours.`},
        {h:'Disputes',t:`Any disputes regarding your listing should be directed to hello@passd-ai.co.uk. We aim to respond within 3 working days.`},
      ]
    },
  };

  const p = pages[page];
  if(!p) return null;

  return<div className="page" style={{padding:'0 16px'}}>
    <div style={{padding:'16px 0 12px'}}>
      <button onClick={onBack} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontSize:14,fontWeight:600,color:'#475569',padding:'0 0 8px'}}>
        {Ic.arL} Back
      </button>
      <h1 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>{p.title}</h1>
      <p style={{fontSize:13,color:'#64748b'}}>HHR Holdings Ltd · Last updated {p.updated}</p>
    </div>
    {p.sections.map((s,i)=>(
      <div key={i} className="card" style={{padding:'16px',marginBottom:10}}>
        <h2 style={{fontSize:15,fontWeight:700,marginBottom:8,color:'#0f1724'}}>{s.h}</h2>
        <div style={{fontSize:14,color:'#475569',lineHeight:1.75,whiteSpace:'pre-line'}}>{s.t}</div>
      </div>
    ))}
    <div style={{padding:'16px 0 8px',textAlign:'center',fontSize:12,color:'#64748b'}}>
      Questions? Email hello@passd-ai.co.uk
    </div>
  </div>;
};

/* ── LEGAL HUB ── */
const LegalHub=({onNav})=><div className="page" style={{padding:'0 16px'}}>
  <div style={{padding:'20px 0 14px'}}>
    <h1 style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',marginBottom:4}}>Legal</h1>
    <p style={{fontSize:14,color:'#475569'}}>HHR Holdings Ltd · passd-ai.co.uk</p>
  </div>
  {[
    {v:'privacy',l:'Privacy Policy',sub:'How we collect, use and protect your data',icon:Ic.shield},
    {v:'terms',l:'Terms of Service',sub:'Rules governing use of Passd',icon:Ic.dvsa},
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
    HHR Holdings Ltd · Registered in England & Wales. Trading as Passd-AI. · hello@passd-ai.co.uk
  </div>
</div>;


export default App;
