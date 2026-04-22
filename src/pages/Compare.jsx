import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

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


export default Compare_final;
