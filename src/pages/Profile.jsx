import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

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

export default Profile;
