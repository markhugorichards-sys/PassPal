import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';

export { useState, useEffect, useRef, useCallback, useMemo, Fragment };

const Sv=({d,s=20,...p})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}><path d={d}/></svg>;
export { Sv };

export const Ic={
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
  filter:  <Sv d="M22 3H2l8 9.46V19l4 2v-8.54L22 3"/>,
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

export const calcPS=i=>{const p=Math.max(0,Math.min(100,100-((i.rate-20)/50)*100));return Math.round(p*.4+(i.rating/5*100)*.3+i.passRate*.3);};
export const scCol=s=>s>=85?'#16a34a':s>=70?'#1d6ff3':s>=55?'#d97706':'#dc2626';
export const Stars=({r,sz=13})=><span className="stars">{Array.from({length:5},(_,i)=><span key={i} style={{opacity:i<Math.floor(r)?1:i<r?.5:.2,fontSize:sz}}>{Ic.star}</span>)}</span>;
export const AvDot=({s})=><span className={`avdot ${s==='Available'?'av-g':s==='Limited'?'av-a':'av-r'}`}/>;
export const Bench=({rate,avg})=>{const d=rate-avg;if(d<=-3)return<span className="bench b-lo">↓ £{Math.abs(d)} below avg</span>;if(d>=3)return<span className="bench b-hi">↑ £{d} above avg</span>;return<span className="bench b-av">Near avg</span>;};
export const simDVSA=async ref=>{await new Promise(r=>setTimeout(r,1400));return ref?{ok:true,name:'Verified',grade:'A',renewed:'Jan 2027'}:{ok:false,msg:'Not found in DVSA register.'};};
export const simEmail=async(to,sub,body)=>{await new Promise(r=>setTimeout(r,700));return{ok:true,id:`msg_${Date.now()}`,to,preview:body.slice(0,100)};};

export const Sheet=({open,onClose,title,children,footer})=>{
  if(!open)return null;
  return<>
    <div className="sh-ov" onClick={onClose}/>
    <div className="sh">
      <div className="sh-bar"/>
      <div className="sh-hd">
        <span style={{fontSize:18,fontWeight:700}}>{title}</span>
        <button className="xbtn" onClick={onClose} aria-label="Close">{Ic.x}</button>
      </div>
      <div className="sh-scroll"><div className="sh-bd">{children}</div></div>
      {footer&&<div className="sh-foot">{footer}</div>}
    </div>
  </>;
};

export const Modal=({open,onClose,title,children,footer})=>{
  if(!open)return null;
  return<div className="modal-ov" onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal">
      <div className="modal-hd">
        <span style={{fontSize:18,fontWeight:700}}>{title}</span>
        <button className="xbtn" onClick={onClose} aria-label="Close">{Ic.x}</button>
      </div>
      <div className="modal-bd">{children}</div>
      {footer&&<div className="sh-foot">{footer}</div>}
    </div>
  </div>;
};
