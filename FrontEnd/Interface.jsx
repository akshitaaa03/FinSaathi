import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Outfit',sans-serif;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:#a78bfa44;border-radius:99px;}
    input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer;width:100%;}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:18px;width:18px;border-radius:50%;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid #a78bfa;margin-top:-6px;}
    input[type=range]::-webkit-slider-runnable-track{height:6px;border-radius:99px;background:rgba(255,255,255,0.08);}
  `}</style>
);

const C = { violet:"#7c3aed",lav:"#a78bfa",sky:"#38bdf8",mint:"#34d399",peach:"#fb923c",rose:"#f472b6",amber:"#fbbf24" };

const fmt = (n) => {
  if(n>=10000000) return `₹${(n/10000000).toFixed(1)}Cr`;
  if(n>=100000) return `₹${(n/100000).toFixed(1)}L`;
  if(n>=1000) return `₹${(n/1000).toFixed(0)}K`;
  return `₹${n}`;
};

const GOALS = [
  {id:"emergency",label:"Emergency Fund",icon:"🛡️",months:6,multiplier:"expenses"},
  {id:"car",label:"Buy a Car",icon:"🚗",target:800000,months:36},
  {id:"travel",label:"Dream Vacation",icon:"✈️",target:150000,months:12},
  {id:"home",label:"Own a Home",icon:"🏠",target:5000000,months:84},
  {id:"freedom",label:"Financial Freedom",icon:"🦋",target:10000000,months:120},
  {id:"wedding",label:"Dream Wedding",icon:"💍",target:500000,months:24},
];

function calcScore(inc,exp,sav,loans,inv){
  if(!inc) return {score:0,insights:[],status:"Risky"};
  const sr=sav/inc, er=exp/inc;
  let s=0; const ins=[];
  if(sr>=0.3){s+=40;ins.push({t:"good",txt:`Saving ${Math.round(sr*100)}% of income — superb! 🎯`});}
  else if(sr>=0.2){s+=28;ins.push({t:"ok",txt:`Saving ${Math.round(sr*100)}% — aim for 30%+ to accelerate wealth`});}
  else if(sr>=0.1){s+=16;ins.push({t:"warn",txt:`Only ${Math.round(sr*100)}% savings rate — automate savings first`});}
  else{s+=4;ins.push({t:"bad",txt:`Critically low savings (${Math.round(sr*100)}%) — prioritize this immediately`});}
  if(er<=0.4){s+=30;ins.push({t:"good",txt:"Spending only 40% of income — excellent expense control 💚"});}
  else if(er<=0.6){s+=22;ins.push({t:"ok",txt:`Spending ${Math.round(er*100)}% — slightly high, audit discretionary spend`});}
  else if(er<=0.75){s+=12;ins.push({t:"warn",txt:`${Math.round(er*100)}% expense ratio → thin margin for emergencies`});}
  else{s+=0;ins.push({t:"bad",txt:`${Math.round(er*100)}% expense ratio → dangerously high ⚠️`});}
  if(inv){s+=20;ins.push({t:"good",txt:"Investing regularly — compounding works for you 📈"});}
  else{ins.push({t:"warn",txt:"Not investing yet — even ₹500/mo SIP makes a huge difference"});}
  if(!loans){s+=10;ins.push({t:"good",txt:"Debt-free — maximum financial flexibility 🏆"});}
  else{ins.push({t:"warn",txt:"Active loans reduce wealth growth — prioritize clearing EMIs"});}
  const score=Math.min(100,Math.max(5,s));
  return{score,insights:ins,status:score>=80?"Excellent":score>=60?"Good":score>=40?"Needs Work":"Risky"};
}

function ScoreRing({score,status}){
  const r=70, circ=2*Math.PI*r;
  const cols={Excellent:[C.mint,C.sky],Good:[C.lav,C.sky],"Needs Work":[C.amber,C.peach],Risky:["#f87171",C.amber]};
  const [c1,c2]=(cols[status]||cols.Good);
  const [disp,setDisp]=useState(0);
  useEffect(()=>{
    let s=0,start=null,dur=1200;
    const t=(ts)=>{if(!start)start=ts;const p=Math.min((ts-start)/dur,1);const e=1-Math.pow(1-p,3);setDisp(Math.round(e*score));if(p<1)requestAnimationFrame(t);};
    requestAnimationFrame(t);
  },[score]);
  return(
    <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${c1}33,transparent 70%)`,filter:"blur(24px)"}}/>
      <svg width={170} height={170} style={{transform:"rotate(-90deg)"}}>
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/>
          </linearGradient>
          <filter id="gf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={85} cy={85} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={12}/>
        <motion.circle cx={85} cy={85} r={r} fill="none" stroke="url(#rg)" strokeWidth={12} strokeLinecap="round"
          strokeDasharray={circ} initial={{strokeDashoffset:circ}}
          animate={{strokeDashoffset:circ-(score/100)*circ}}
          transition={{duration:1.4,ease:[0.34,1.56,0.64,1]}} filter="url(#gf)"/>
      </svg>
      <div style={{position:"absolute",textAlign:"center"}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:42,fontWeight:700,background:`linear-gradient(135deg,${c1},${c2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>{disp}</div>
        <div style={{fontFamily:"'Outfit'",fontSize:10,color:"#475569",marginTop:2}}>/100</div>
      </div>
    </div>
  );
}

function PieChart({income,expenses,savings}){
  const surplus=Math.max(0,income-expenses-savings);
  const total=income||1;
  const slices=[
    {l:"Expenses",v:expenses,c:"#f472b6"},
    {l:"Savings",v:savings,c:"#34d399"},
    {l:"Surplus",v:surplus,c:"#38bdf8"},
  ].filter(s=>s.v>0);
  const cx=80,cy=80,r=62,inner=38;
  let cum=0;
  const paths=slices.map(s=>{
    const pct=s.v/total, angle=pct*360, start=cum; cum+=angle;
    const tr=d=>(d*Math.PI)/180;
    const x1=cx+r*Math.cos(tr(start-90)),y1=cy+r*Math.sin(tr(start-90));
    const x2=cx+r*Math.cos(tr(start+angle-90)),y2=cy+r*Math.sin(tr(start+angle-90));
    const ix1=cx+inner*Math.cos(tr(start-90)),iy1=cy+inner*Math.sin(tr(start-90));
    const ix2=cx+inner*Math.cos(tr(start+angle-90)),iy2=cy+inner*Math.sin(tr(start+angle-90));
    const lg=angle>180?1:0;
    return{...s,pct,path:`M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${lg} 0 ${ix1} ${iy1} Z`};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <svg width={160} height={160}>
        {paths.map((s,i)=>(
          <motion.path key={s.l} d={s.path} fill={s.c}
            initial={{opacity:0,scale:0.6}} animate={{opacity:1,scale:1}}
            transition={{delay:i*0.1,type:"spring"}}
            style={{transformOrigin:`${cx}px ${cy}px`,filter:`drop-shadow(0 0 8px ${s.c}66)`}}/>
        ))}
        <circle cx={cx} cy={cy} r={inner-2} fill="rgba(15,23,42,0.8)"/>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {paths.map(s=>(
          <div key={s.l} style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:s.c,boxShadow:`0 0 6px ${s.c}`,flexShrink:0}}/>
            <span style={{fontFamily:"'Outfit'",fontSize:12,color:"#64748b"}}>{s.l}</span>
            <span style={{fontFamily:"'Outfit'",fontSize:12,color:"#e2e8f0",fontWeight:600,marginLeft:"auto",paddingLeft:8}}>{Math.round(s.pct*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slider({label,icon,value,min,max,step,onChange,accent}){
  const pct=((value-min)/(max-min))*100;
  return(
    <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:18,padding:"16px 18px",backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:10,background:`${accent}22`,border:`1px solid ${accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{icon}</div>
          <span style={{fontFamily:"'Outfit'",fontWeight:500,color:"#64748b",fontSize:13}}>{label}</span>
        </div>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,background:`linear-gradient(135deg,${accent},${accent}bb)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{fmt(value)}</span>
      </div>
      <div style={{position:"relative",height:20,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:0,right:0,height:6,borderRadius:99,background:"rgba(255,255,255,0.07)"}}>
          <motion.div animate={{width:`${pct}%`}} transition={{type:"spring",stiffness:180,damping:22}}
            style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${accent}77,${accent})`}}/>
        </div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}
          style={{position:"absolute",left:0,right:0,width:"100%",opacity:0,cursor:"pointer",height:20,zIndex:2}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        <span style={{fontSize:10,color:"#334155"}}>{fmt(min)}</span>
        <span style={{fontSize:10,color:"#334155"}}>{fmt(max)}</span>
      </div>
    </div>
  );
}

function Toggle({label,icon,value,onChange,accent}){
  return(
    <div onClick={()=>onChange(!value)} style={{background:"rgba(255,255,255,0.05)",border:`1px solid ${value?accent+"44":"rgba(255,255,255,0.08)"}`,borderRadius:16,padding:"13px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",backdropFilter:"blur(20px)",boxShadow:value?`0 0 20px ${accent}18`:"none",transition:"all 0.3s"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:17}}>{icon}</span>
        <span style={{fontFamily:"'Outfit'",fontSize:13,fontWeight:500,color:"#64748b"}}>{label}</span>
      </div>
      <motion.div animate={{background:value?`linear-gradient(135deg,${accent},${accent}bb)`:"rgba(255,255,255,0.08)"}}
        style={{width:42,height:22,borderRadius:99,position:"relative",flexShrink:0}}>
        <motion.div animate={{x:value?20:2}} transition={{type:"spring",stiffness:500,damping:30}}
          style={{position:"absolute",top:2,width:18,height:18,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"}}/>
      </motion.div>
    </div>
  );
}

function GCard({children,style={},hover=true}){
  return(
    <motion.div whileHover={hover?{y:-3,boxShadow:"0 24px 60px rgba(0,0,0,0.35)"}:{}} transition={{type:"spring",stiffness:300}}
      style={{background:"rgba(255,255,255,0.05)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:24,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",...style}}>
      {children}
    </motion.div>
  );
}

function ChatBot({financials,open,onClose}){
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Namaste! 🙏 I'm FinSathi AI — your personal money mentor. I've already seen your financial snapshot. Ask me anything!"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,loading]);

  const send=async()=>{
    const text=input.trim(); if(!text||loading)return;
    setInput(""); const newMsgs=[...msgs,{role:"user",content:text}]; setMsgs(newMsgs); setLoading(true);
    const ctx=`User finances: Income ${fmt(financials.income)}/mo, Expenses ${fmt(financials.expenses)}/mo, Savings ${fmt(financials.savings)}/mo, Loans: ${financials.loans?"Yes":"No"}, Investing: ${financials.investments?"Yes":"No"}, Score: ${financials.score}/100 (${financials.status}), Goal: ${financials.goal}. Savings rate: ${Math.round(financials.savings/(financials.income||1)*100)}%, Expense ratio: ${Math.round(financials.expenses/(financials.income||1)*100)}%.`;
    try{
      const res=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"placeholder","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`You are FinSathi AI — a warm, brilliant Indian personal finance mentor. ${ctx} Give advice that is: personalized to exact numbers, concise (2-4 sentences), action-oriented with specific ₹ amounts, uses Indian instruments (SIP, PPF, FD, ELSS, NPS, liquid funds). Be encouraging, never preachy. Use emojis sparingly.`,
          messages:newMsgs.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      const reply=data.content?.filter(b=>b.type==="text").map(b=>b.text).join("")||"Let me think on that 🤔";
      setMsgs(m=>[...m,{role:"assistant",content:reply}]);
    }catch{setMsgs(m=>[...m,{role:"assistant",content:"Connection hiccup! Try again? 🙏"}]);}
    setLoading(false);
  };

  const qs=["How to improve my score?","Best SIP for me?","When will I reach my goal?","How to reduce expenses?"];
  return(
    <AnimatePresence>
      {open&&(
        <motion.div initial={{opacity:0,y:16,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:16,scale:0.95}}
          transition={{type:"spring",stiffness:300,damping:28}}
          style={{position:"fixed",bottom:88,right:20,width:"min(360px,calc(100vw - 40px))",height:500,borderRadius:28,
            background:"rgba(8,15,30,0.95)",backdropFilter:"blur(40px)",
            border:"1px solid rgba(167,139,250,0.3)",boxShadow:"0 32px 80px rgba(0,0,0,0.6)",
            display:"flex",flexDirection:"column",zIndex:1000,overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"linear-gradient(135deg,rgba(124,58,237,0.3),rgba(56,189,248,0.12))",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,borderRadius:12,background:"linear-gradient(135deg,#7c3aed,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 4px 16px rgba(124,58,237,0.4)"}}>🤖</div>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:"#f1f5f9"}}>FinSathi AI</div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#34d399",boxShadow:"0 0 6px #34d399"}}/>
                  <span style={{fontFamily:"'Outfit'",fontSize:10,color:"#34d399",fontWeight:500}}>Online · Ready to help</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",borderRadius:9,width:28,height:28,cursor:"pointer",color:"#64748b",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>
          <div ref={ref} style={{flex:1,overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:8}}>
            {msgs.map((m,i)=>(
              <motion.div key={i} initial={{opacity:0,x:m.role==="user"?10:-10}} animate={{opacity:1,x:0}}
                style={{alignSelf:m.role==="user"?"flex-end":"flex-start",maxWidth:"86%",
                  background:m.role==="user"?"linear-gradient(135deg,#7c3aed,#38bdf8)":"rgba(255,255,255,0.06)",
                  borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                  padding:"10px 14px",fontFamily:"'Outfit'",fontSize:12,lineHeight:1.65,
                  color:m.role==="user"?"#fff":"#94a3b8",
                  border:m.role==="assistant"?"1px solid rgba(255,255,255,0.07)":"none",
                  whiteSpace:"pre-wrap"}}>
                {m.content}
              </motion.div>
            ))}
            {loading&&(
              <div style={{alignSelf:"flex-start",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"18px 18px 18px 4px",padding:"12px 16px",display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map(i=>(
                  <motion.div key={i} animate={{y:[0,-5,0]}} transition={{repeat:Infinity,duration:0.7,delay:i*0.15}}
                    style={{width:6,height:6,borderRadius:"50%",background:"#a78bfa"}}/>
                ))}
              </div>
            )}
          </div>
          {msgs.length<=1&&(
            <div style={{padding:"0 12px 8px",display:"flex",flexWrap:"wrap",gap:5}}>
              {qs.map(q=>(
                <button key={q} onClick={()=>setInput(q)}
                  style={{background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:99,padding:"4px 11px",fontFamily:"'Outfit'",fontSize:10,color:"#a78bfa",cursor:"pointer",whiteSpace:"nowrap"}}>
                  {q}
                </button>
              ))}
            </div>
          )}
          <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:8,flexShrink:0}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Ask about your finances..."
              style={{flex:1,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"9px 13px",fontFamily:"'Outfit'",fontSize:12,color:"#f1f5f9",outline:"none"}}/>
            <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={send}
              style={{width:38,height:38,borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#38bdf8)",color:"#fff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 16px rgba(124,58,237,0.4)"}}>↑</motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function FinSathiAI(){
  const [step,setStep]=useState("hero");
  const [income,setIncome]=useState(80000);
  const [expenses,setExpenses]=useState(45000);
  const [savings,setSavings]=useState(15000);
  const [loans,setLoans]=useState(false);
  const [investments,setInvestments]=useState(false);
  const [goal,setGoal]=useState("car");
  const [goalMonths,setGoalMonths]=useState(36);
  const [chatOpen,setChatOpen]=useState(false);

  const {score,insights,status}=calcScore(income,expenses,savings,loans,investments);
  const goalData=GOALS.find(g=>g.id===goal)||GOALS[1];
  const target=goal==="emergency"?expenses*6:(goalData.target||0);
  const monthly=goalMonths>0?Math.ceil(target/goalMonths):target;
  const sipAmt=Math.ceil(monthly*0.7/500)*500;
  const feasible=monthly<=(income-expenses);

  const stCols={Excellent:C.mint,Good:C.lav,"Needs Work":C.amber,Risky:"#f87171"};
  const sc=stCols[status]||C.lav;
  const blobs=[{c:"#7c3aed",x:"4%",y:"6%",s:380},{c:"#0ea5e9",x:"74%",y:"12%",s:300},{c:"#10b981",x:"52%",y:"68%",s:240},{c:"#f472b6",x:"12%",y:"75%",s:180},{c:"#f59e0b",x:"86%",y:"78%",s:160}];

  return(
    <div style={{minHeight:"100vh",background:"#070d1a",position:"relative",overflowX:"hidden"}}>
      <FontImport/>
      {blobs.map((b,i)=>(
        <motion.div key={i} animate={{x:[0,16,-8,0],y:[0,-12,6,0],scale:[1,1.04,0.97,1]}}
          transition={{repeat:Infinity,duration:10+i*2,ease:"easeInOut"}}
          style={{position:"fixed",left:b.x,top:b.y,width:b.s,height:b.s,borderRadius:"50%",background:`${b.c}22`,filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
      ))}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:"linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>

      <div style={{position:"relative",zIndex:1}}>
        <AnimatePresence mode="wait">

          {/* ═══════ HERO ═══════ */}
          {step==="hero"&&(
            <motion.div key="hero" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,y:-20}}
              style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",textAlign:"center"}}>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(124,58,237,0.14)",border:"1px solid rgba(124,58,237,0.32)",borderRadius:99,padding:"6px 18px",marginBottom:32,backdropFilter:"blur(12px)"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:C.mint,boxShadow:`0 0 8px ${C.mint}`}}/>
                <span style={{fontFamily:"'Outfit'",fontSize:11,fontWeight:600,color:"#a78bfa",letterSpacing:"0.6px"}}>AI-POWERED · INDIA'S SMARTEST MONEY MENTOR</span>
              </motion.div>

              <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.3,type:"spring",stiffness:80}}
                style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(52px,10vw,92px)",fontWeight:700,lineHeight:1.06,marginBottom:20,
                  background:"linear-gradient(135deg,#f1f5f9 0%,#a78bfa 38%,#38bdf8 68%,#34d399 100%)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",maxWidth:760}}>
                Your AI Money<br/>Mentor
              </motion.h1>

              <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
                style={{fontFamily:"'Outfit'",fontSize:"clamp(15px,2.5vw,18px)",fontWeight:300,color:"#475569",maxWidth:460,lineHeight:1.75,marginBottom:52}}>
                Know your financial health in 60 seconds.<br/>Personalized insights, real AI guidance, beautiful clarity.
              </motion.p>

              <motion.div initial={{opacity:0,y:40,scale:0.95}} animate={{opacity:1,y:0,scale:1}} transition={{delay:0.6,type:"spring",stiffness:70}}>
                <GCard style={{padding:"32px 40px",maxWidth:400,width:"100%",textAlign:"left"}} hover={false}>
                  <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:26}}>
                    {[
                      {i:"🎯",t:"Money Health Score (0–100)"},
                      {i:"📊",t:"Visual Spending Analytics"},
                      {i:"⚡",t:"What-If Simulator"},
                      {i:"🗺️",t:"Goal-Based Roadmap"},
                      {i:"💬",t:"Real AI Chat Mentor"},
                    ].map((f,idx)=>(
                      <motion.div key={f.t} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.7+idx*0.07}}
                        style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:32,height:32,borderRadius:10,background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{f.i}</div>
                        <span style={{fontFamily:"'Outfit'",fontSize:13,fontWeight:400,color:"#64748b"}}>{f.t}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button whileHover={{scale:1.02,boxShadow:"0 20px 50px rgba(124,58,237,0.5)"}} whileTap={{scale:0.98}}
                    onClick={()=>setStep("app")}
                    style={{width:"100%",padding:"14px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#7c3aed,#38bdf8)",color:"#fff",fontSize:15,fontWeight:600,fontFamily:"'Outfit'",cursor:"pointer",boxShadow:"0 12px 36px rgba(124,58,237,0.4)",letterSpacing:"0.3px"}}>
                    Start My Financial Journey ✨
                  </motion.button>
                </GCard>
              </motion.div>

              {[{e:"💹",x:"7%",y:"28%",d:1.2},{e:"🪙",x:"88%",y:"32%",d:0.9},{e:"📈",x:"5%",y:"70%",d:1.5},{e:"🌱",x:"91%",y:"68%",d:1.8}].map((el,i)=>(
                <motion.div key={i} initial={{opacity:0}} animate={{opacity:0.45,y:[0,-11,0]}}
                  transition={{delay:el.d,opacity:{duration:0.5},y:{repeat:Infinity,duration:3.2+i*0.4,ease:"easeInOut"}}}
                  style={{position:"absolute",left:el.x,top:el.y,fontSize:26,pointerEvents:"none",userSelect:"none"}}>{el.e}</motion.div>
              ))}
            </motion.div>
          )}

          {/* ═══════ APP ═══════ */}
          {step==="app"&&(
            <motion.div key="app" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{type:"spring",stiffness:80}}
              style={{maxWidth:960,margin:"0 auto",padding:"36px 18px 150px"}}>

              {/* Nav */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:44}}>
                <button onClick={()=>setStep("hero")} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:11,padding:"7px 15px",color:"#475569",fontFamily:"'Outfit'",fontSize:12,cursor:"pointer"}}>← Back</button>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,background:"linear-gradient(135deg,#a78bfa,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>FinSathi AI</div>
                <div style={{width:70}}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:22,alignItems:"start"}}>

                {/* ── LEFT ── */}
                <div style={{display:"flex",flexDirection:"column",gap:18}}>

                  {/* Sliders */}
                  <div>
                    <div style={{marginBottom:16}}>
                      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#f1f5f9",marginBottom:4}}>Your Financial Picture</h2>
                      <p style={{fontFamily:"'Outfit'",fontSize:13,color:"#334155"}}>Adjust any slider — everything updates live ⚡</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:11}}>
                      <Slider label="Monthly Income" icon="💼" value={income} min={10000} max={500000} step={5000} onChange={setIncome} accent={C.violet}/>
                      <Slider label="Monthly Expenses" icon="🛒" value={expenses} min={5000} max={400000} step={5000} onChange={setExpenses} accent={C.rose}/>
                      <Slider label="Monthly Savings" icon="🏦" value={savings} min={0} max={300000} step={1000} onChange={setSavings} accent={C.mint}/>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        <Toggle label="Active Loans" icon="💳" value={loans} onChange={setLoans} accent={C.amber}/>
                        <Toggle label="SIP / Investing" icon="📈" value={investments} onChange={setInvestments} accent={C.mint}/>
                      </div>
                    </div>
                  </div>

                  {/* Goal Selector */}
                  <div>
                    <div style={{marginBottom:14}}>
                      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#f1f5f9",marginBottom:3}}>Your Financial Goal</h2>
                      <p style={{fontFamily:"'Outfit'",fontSize:12,color:"#334155"}}>Pick what you're working towards</p>
                    </div>
                    <GCard style={{padding:18}} hover={false}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                        {GOALS.map(g=>(
                          <motion.button key={g.id} whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>{setGoal(g.id);setGoalMonths(g.months||36);}}
                            style={{background:goal===g.id?"linear-gradient(135deg,rgba(124,58,237,0.28),rgba(56,189,248,0.18))":"rgba(255,255,255,0.03)",
                              border:`1px solid ${goal===g.id?"rgba(167,139,250,0.45)":"rgba(255,255,255,0.07)"}`,
                              borderRadius:12,padding:"11px 8px",cursor:"pointer",fontFamily:"'Outfit'",
                              fontSize:11,color:goal===g.id?"#c4b5fd":"#475569",fontWeight:goal===g.id?600:400,
                              textAlign:"center",transition:"all 0.2s"}}>
                            <div style={{fontSize:20,marginBottom:4}}>{g.icon}</div>
                            {g.label}
                          </motion.button>
                        ))}
                      </div>
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                          <span style={{fontFamily:"'Outfit'",fontSize:12,color:"#334155"}}>Timeline</span>
                          <span style={{fontFamily:"'Outfit'",fontSize:12,color:"#a78bfa",fontWeight:600}}>{goalMonths} months ({Math.round(goalMonths/12*10)/10} yrs)</span>
                        </div>
                        <Slider label="" icon="" value={goalMonths} min={3} max={120} step={3} onChange={setGoalMonths} accent={C.lav}/>
                      </div>
                    </GCard>
                  </div>

                  {/* Pie chart */}
                  <div>
                    <div style={{marginBottom:14}}>
                      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#f1f5f9",marginBottom:3}}>Spending Snapshot</h2>
                      <p style={{fontFamily:"'Outfit'",fontSize:12,color:"#334155"}}>Where your money actually goes</p>
                    </div>
                    <GCard style={{padding:22}} hover={false}>
                      <PieChart income={income} expenses={expenses} savings={savings}/>
                      <div style={{marginTop:18,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                        {[
                          {l:"Savings Rate",v:`${Math.round(savings/(income||1)*100)}%`,c:C.mint},
                          {l:"Expense Ratio",v:`${Math.round(expenses/(income||1)*100)}%`,c:"#f472b6"},
                          {l:"Free Cash",v:fmt(Math.max(0,income-expenses-savings)),c:C.sky},
                        ].map(s=>(
                          <div key={s.l} style={{textAlign:"center",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"11px 6px"}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,background:`linear-gradient(135deg,${s.c},${s.c}99)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div>
                            <div style={{fontFamily:"'Outfit'",fontSize:9,color:"#334155",marginTop:3}}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                    </GCard>
                  </div>
                </div>

                {/* ── RIGHT ── */}
                <div style={{display:"flex",flexDirection:"column",gap:18}}>

                  {/* Score */}
                  <div>
                    <div style={{marginBottom:14}}>
                      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:"#f1f5f9",marginBottom:3}}>Money Health Score</h2>
                      <p style={{fontFamily:"'Outfit'",fontSize:12,color:"#334155"}}>Updates live as you adjust your numbers</p>
                    </div>
                    <GCard style={{padding:"28px 22px",textAlign:"center"}} hover={false}>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:18}}>
                        <ScoreRing score={score} status={status}/>
                      </div>
                      <motion.div key={status} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                        style={{display:"inline-block",padding:"5px 18px",borderRadius:99,marginBottom:18,background:`${sc}18`,border:`1px solid ${sc}44`,fontFamily:"'Outfit'",fontWeight:700,fontSize:12,color:sc,letterSpacing:"0.6px"}}>
                        {status.toUpperCase()}
                      </motion.div>
                      <div style={{display:"flex",flexDirection:"column",gap:9}}>
                        {[
                          {l:"Savings Rate",v:Math.min(100,Math.round(savings/(income||1)*333)),c:C.mint},
                          {l:"Expense Control",v:Math.min(100,Math.round((1-expenses/(income||1))*130)),c:C.sky},
                          {l:"Investing",v:investments?100:0,c:C.lav},
                          {l:"Debt-Free",v:loans?0:100,c:C.peach},
                        ].map(b=>(
                          <div key={b.l}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                              <span style={{fontFamily:"'Outfit'",fontSize:10,color:"#475569"}}>{b.l}</span>
                              <span style={{fontFamily:"'Outfit'",fontSize:10,color:b.c,fontWeight:600}}>{b.v}%</span>
                            </div>
                            <div style={{height:4,borderRadius:99,background:"rgba(255,255,255,0.06)"}}>
                              <motion.div animate={{width:`${b.v}%`}} transition={{type:"spring",stiffness:100,damping:20}}
                                style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${b.c}66,${b.c})`}}/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GCard>
                  </div>

                  {/* Insights */}
                  <div>
                    <div style={{marginBottom:14}}>
                      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#f1f5f9",marginBottom:3}}>AI Insights</h2>
                      <p style={{fontFamily:"'Outfit'",fontSize:12,color:"#334155"}}>What your numbers are telling me</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:9}}>
                      {insights.map((ins,i)=>{
                        const m={good:{c:C.mint,e:"✅"},ok:{c:C.sky,e:"💡"},warn:{c:C.amber,e:"⚠️"},bad:{c:"#f87171",e:"🚨"}}[ins.t]||{c:C.sky,e:"💡"};
                        return(
                          <motion.div key={i} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:i*0.05,type:"spring"}}
                            style={{background:`${m.c}0c`,border:`1px solid ${m.c}2a`,borderRadius:13,padding:"11px 14px",display:"flex",alignItems:"flex-start",gap:10}}>
                            <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{m.e}</span>
                            <span style={{fontFamily:"'Outfit'",fontSize:12,color:"#64748b",lineHeight:1.6}}>{ins.txt}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Roadmap */}
                  <div>
                    <div style={{marginBottom:14}}>
                      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#f1f5f9",marginBottom:3}}>{goalData.icon} Goal Roadmap</h2>
                      <p style={{fontFamily:"'Outfit'",fontSize:12,color:"#334155"}}>Your personalised path to {goalData.label}</p>
                    </div>
                    <GCard style={{padding:22}} hover={false}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
                        {[
                          {l:"Target",v:fmt(target),c:C.violet},
                          {l:"Need/Month",v:fmt(monthly),c:feasible?C.mint:"#f87171"},
                          {l:"SIP Amount",v:fmt(sipAmt),c:C.sky},
                          {l:"Timeline",v:`${goalMonths}mo`,c:C.lav},
                        ].map(s=>(
                          <div key={s.l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:13,padding:"12px",textAlign:"center"}}>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,background:`linear-gradient(135deg,${s.c},${s.c}aa)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div>
                            <div style={{fontFamily:"'Outfit'",fontSize:9,color:"#334155",marginTop:2}}>{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{position:"relative",paddingLeft:22}}>
                        <div style={{position:"absolute",left:7,top:4,bottom:4,width:2,background:"rgba(255,255,255,0.06)",borderRadius:99}}>
                          <motion.div initial={{height:0}} animate={{height:"100%"}} transition={{duration:1,delay:0.3}}
                            style={{width:"100%",background:"linear-gradient(180deg,#7c3aed,#38bdf8)",borderRadius:99}}/>
                        </div>
                        {[
                          {l:"Start saving today",t:"Month 0",done:true},
                          {l:`Reach ₹${Math.round(target*0.25/1000)}K milestone`,t:`Month ${Math.round(goalMonths*0.25)}`,done:false},
                          {l:`Hit halfway mark`,t:`Month ${Math.round(goalMonths*0.5)}`,done:false},
                          {l:`🎉 ${goalData.label} achieved!`,t:`Month ${goalMonths}`,done:false},
                        ].map((s,i)=>(
                          <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.15+i*0.1}}
                            style={{display:"flex",gap:13,marginBottom:13,alignItems:"flex-start"}}>
                            <div style={{width:9,height:9,borderRadius:"50%",flexShrink:0,background:s.done?C.mint:"rgba(255,255,255,0.15)",border:`2px solid ${s.done?C.mint:"rgba(255,255,255,0.12)"}`,marginLeft:-18,marginTop:3,boxShadow:s.done?`0 0 8px ${C.mint}`:"none"}}/>
                            <div>
                              <div style={{fontFamily:"'Outfit'",fontSize:12,color:"#64748b"}}>{s.l}</div>
                              <div style={{fontFamily:"'Outfit'",fontSize:10,color:"#334155",marginTop:1}}>{s.t}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {!feasible&&(
                        <div style={{marginTop:12,background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.22)",borderRadius:11,padding:"9px 13px"}}>
                          <span style={{fontFamily:"'Outfit'",fontSize:11,color:"#f87171"}}>⚠️ Monthly need ({fmt(monthly)}) exceeds savings gap. Extend timeline or cut expenses by {fmt(monthly-(income-expenses))}.</span>
                        </div>
                      )}
                    </GCard>
                  </div>

                  {/* Suggestion Cards */}
                  <div>
                    <div style={{marginBottom:14}}>
                      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:"#f1f5f9",marginBottom:3}}>Smart Suggestions</h2>
                      <p style={{fontFamily:"'Outfit'",fontSize:12,color:"#334155"}}>Three actions to transform your finances</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {[
                        {i:"💰",t:"Monthly Savings Target",v:fmt(Math.round((income-expenses)*0.3/500)*500),s:"30% of surplus — the golden rule of wealth building",g:[C.violet,C.lav]},
                        {i:"📈",t:"Recommended SIP",v:fmt(sipAmt),s:`Index fund SIP — at 12% p.a. over ${goalMonths}mo you'll reach ${fmt(sipAmt*goalMonths*1.4)}`,g:["#0ea5e9",C.sky]},
                        {i:"🛡️",t:"Emergency Fund Goal",v:fmt(expenses*6),s:"6 months of expenses — park in a liquid fund or FD",g:["#10b981",C.mint]},
                      ].map((card,i)=>(
                        <motion.div key={card.t} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.08,type:"spring"}}
                          whileHover={{y:-3,boxShadow:`0 20px 50px rgba(0,0,0,0.3)`}}
                          style={{background:`linear-gradient(135deg,${card.g[0]}16,${card.g[1]}0a)`,border:`1px solid ${card.g[0]}2e`,borderRadius:17,padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}>
                          <div style={{width:46,height:46,borderRadius:14,flexShrink:0,background:`linear-gradient(135deg,${card.g[0]},${card.g[1]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 8px 24px ${card.g[0]}44`}}>{card.i}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:"'Outfit'",fontSize:10,color:"#475569",marginBottom:2}}>{card.t}</div>
                            <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:20,background:`linear-gradient(135deg,${card.g[0]},${card.g[1]})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:3}}>{card.v}</div>
                            <div style={{fontFamily:"'Outfit'",fontSize:10,color:"#334155",lineHeight:1.5}}>{card.s}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Chat CTA */}
                  <motion.div whileHover={{scale:1.01}} whileTap={{scale:0.99}} onClick={()=>setChatOpen(true)}
                    style={{background:"linear-gradient(135deg,rgba(124,58,237,0.22),rgba(56,189,248,0.13))",border:"1px solid rgba(167,139,250,0.32)",borderRadius:20,padding:"18px 22px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,boxShadow:"0 8px 32px rgba(124,58,237,0.12)"}}>
                    <div style={{width:50,height:50,borderRadius:15,flexShrink:0,background:"linear-gradient(135deg,#7c3aed,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 8px 24px rgba(124,58,237,0.4)"}}>🤖</div>
                    <div>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"#f1f5f9",marginBottom:2}}>Ask FinSathi AI</div>
                      <div style={{fontFamily:"'Outfit'",fontSize:11,color:"#334155"}}>Get personalized answers based on your exact numbers</div>
                    </div>
                    <div style={{marginLeft:"auto",fontSize:18,color:"#a78bfa"}}>→</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating chat btn */}
        <AnimatePresence>
          {step==="app"&&(
            <motion.button initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
              whileHover={{scale:1.1,boxShadow:"0 16px 48px rgba(124,58,237,0.6)"}} whileTap={{scale:0.93}}
              onClick={()=>setChatOpen(!chatOpen)}
              style={{position:"fixed",bottom:22,right:18,width:56,height:56,borderRadius:19,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#7c3aed,#38bdf8)",boxShadow:"0 8px 32px rgba(124,58,237,0.45)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,zIndex:999}}>
              <motion.span animate={{rotate:chatOpen?45:0}} transition={{type:"spring",stiffness:400}}>{chatOpen?"✕":"🤖"}</motion.span>
            </motion.button>
          )}
        </AnimatePresence>

        <ChatBot financials={{income,expenses,savings,loans,investments,score,status,goal}} open={chatOpen} onClose={()=>setChatOpen(false)}/>
      </div>
    </div>
  );
}
