import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from 'react';
import { Ic, Sv, Stars, AvDot, Bench, Sheet, Modal, calcPS, scCol, simDVSA, simEmail } from './shared.jsx';

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



export default Legal;
