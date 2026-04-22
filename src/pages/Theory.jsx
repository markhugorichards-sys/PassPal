import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

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

export default Theory;
