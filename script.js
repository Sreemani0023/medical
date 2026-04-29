// Aushadhara Health Hub - Script
const appState = {
  currentUser: null, userRole: 'patient', selectedHospital: null,
  selectedDoctor: null, selectedSlot: null, selectedDate: null, consultType: 'in-person',
  currentFilter: 'all', currentDoctorId: null, selectedBookingId: null,
  currentPatientUsername: null, bookingFor: 'myself', triageSeverity: null,
  notifications: [], bedRefreshTimer: null, queueTimer: null
};
window.bookingsDatabase = [];

const hospitalsData = [
  { id:1, name:'Bhimavaram General Hospital', location:'Main Road, Bhimavaram', dist:'1.2 km', totalBeds:250, emergencyBeds:60, icuBeds:25, type:'government',
    doctors:[
      {id:101,name:'Dr. Srinivas Reddy',specialty:'General Medicine',qual:'MBBS, MD',fee:'Free',exp:'18 Yrs',rating:4.8,available:6,booked:14,limit:20},
      {id:102,name:'Dr. Lakshmi Devi',specialty:'Gynecology',qual:'MBBS, MS',fee:'Free',exp:'12 Yrs',rating:4.9,available:3,booked:15,limit:18},
      {id:103,name:'Dr. Raju Kumar',specialty:'Surgery',qual:'MBBS, MS',fee:'Free',exp:'22 Yrs',rating:4.7,available:3,booked:9,limit:12}
    ]},
  { id:2, name:'Sri Sai Medical Center', location:'Station Road, Bhimavaram', dist:'2.5 km', totalBeds:150, emergencyBeds:35, icuBeds:15, type:'private',
    doctors:[
      {id:201,name:'Dr. Harindranath',specialty:'Pediatrics',qual:'MBBS, DCH',fee:'₹400',exp:'20 Yrs',rating:4.7,available:4,booked:12,limit:16},
      {id:202,name:'Dr. Anjali Sharma',specialty:'ENT',qual:'MBBS, MS',fee:'₹350',exp:'9 Yrs',rating:4.6,available:3,booked:11,limit:14}
    ]},
  { id:3, name:'Apollo Health Clinic', location:'College Road, Bhimavaram', dist:'3.1 km', totalBeds:120, emergencyBeds:28, icuBeds:12, type:'private',
    doctors:[
      {id:301,name:'Dr. Suresh Babu',specialty:'Cardiology',qual:'MBBS, DM',fee:'₹500',exp:'15 Yrs',rating:4.9,available:4,booked:10,limit:14},
      {id:302,name:'Dr. Pooja Nair',specialty:'Dermatology',qual:'MBBS, DD',fee:'₹450',exp:'8 Yrs',rating:4.5,available:3,booked:13,limit:16}
    ]},
  { id:4, name:'Bhimavaram MultiSpecialty Hospital', location:'Kothapeta, Bhimavaram', dist:'1.8 km', totalBeds:200, emergencyBeds:50, icuBeds:20, type:'premium',
    doctors:[
      {id:401,name:'Dr. Vikram Verma',specialty:'Orthopedics',qual:'MBBS, MS Ortho',fee:'₹800',exp:'16 Yrs',rating:4.9,available:4,booked:8,limit:12},
      {id:402,name:'Dr. Malini Reddy',specialty:'Neurology',qual:'MBBS, DM Neuro',fee:'₹750',exp:'14 Yrs',rating:4.8,available:3,booked:7,limit:10}
    ]},
  { id:5, name:'Government Area Hospital', location:'Undi Road, Bhimavaram', dist:'4.2 km', totalBeds:500, emergencyBeds:120, icuBeds:45, type:'government',
    doctors:[
      {id:501,name:'Dr. Rajesh Kumar',specialty:'Cardiology',qual:'MBBS, DM Cardio',fee:'Free',exp:'20 Yrs',rating:4.8,available:5,booked:15,limit:20},
      {id:502,name:'Dr. Priya Singh',specialty:'Pediatrics',qual:'MBBS, MD Paeds',fee:'Free',exp:'11 Yrs',rating:4.6,available:3,booked:22,limit:25},
      {id:503,name:'Dr. Amit Patel',specialty:'Orthopedics',qual:'MBBS, MS Ortho',fee:'Free',exp:'13 Yrs',rating:4.7,available:5,booked:10,limit:15}
    ]},
  { id:6, name:'LifeCare Medical Center', location:'Pentapadu Road, Bhimavaram', dist:'3.7 km', totalBeds:350, emergencyBeds:85, icuBeds:30, type:'private',
    doctors:[
      {id:601,name:'Dr. Neha Sharma',specialty:'Neurology',qual:'MBBS, DM Neuro',fee:'₹500',exp:'17 Yrs',rating:4.9,available:6,booked:12,limit:18},
      {id:602,name:'Dr. Vikram Singh',specialty:'Emergency Medicine',qual:'MBBS, MD EM',fee:'₹400',exp:'10 Yrs',rating:4.5,available:2,booked:28,limit:30}
    ]},
  { id:7, name:'Pinnacle Health Institute', location:'Palakol Road, Bhimavaram', dist:'5.4 km', totalBeds:200, emergencyBeds:50, icuBeds:25, type:'premium',
    doctors:[
      {id:701,name:'Dr. Arun Verma',specialty:'Gastroenterology',qual:'MBBS, DM Gastro',fee:'₹900',exp:'19 Yrs',rating:4.8,available:4,booked:8,limit:12},
      {id:702,name:'Dr. Divya Gupta',specialty:'Oncology',qual:'MBBS, DM Onco',fee:'₹1000',exp:'14 Yrs',rating:4.9,available:3,booked:7,limit:10}
    ]},
  { id:8, name:'District Hospital Bhimavaram', location:'Seepudi Road, Bhimavaram', dist:'2.9 km', totalBeds:450, emergencyBeds:110, icuBeds:40, type:'government',
    doctors:[
      {id:801,name:'Dr. Meera Kulkarni',specialty:'Internal Medicine',qual:'MBBS, MD',fee:'Free',exp:'15 Yrs',rating:4.7,available:7,booked:18,limit:25},
      {id:802,name:'Dr. Rohan Desai',specialty:'Dermatology',qual:'MBBS, DD',fee:'Free',exp:'8 Yrs',rating:4.4,available:4,booked:16,limit:20}
    ]},
  { id:9, name:'Elite Care Hospital', location:'Eluru Road, Bhimavaram', dist:'6.1 km', totalBeds:180, emergencyBeds:40, icuBeds:20, type:'premium',
    doctors:[
      {id:901,name:'Dr. Rajeev Chopra',specialty:'Orthopedics',qual:'MBBS, MS Ortho',fee:'₹850',exp:'21 Yrs',rating:4.9,available:5,booked:9,limit:14},
      {id:902,name:'Dr. Kavya Nair',specialty:'Radiology',qual:'MBBS, MD Radio',fee:'₹700',exp:'7 Yrs',rating:4.6,available:3,booked:25,limit:28}
    ]}
];

const timeSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM'];

// ===== INIT =====
function initApp(){ updateNavigation(); populateHospitals(); }

function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg = document.getElementById(name);
  if(pg) pg.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l=>{l.classList.remove('active');if(l.dataset.page===name)l.classList.add('active');});
  if(name==='hospitals') populateHospitals();
  else if(name==='doctors') populateDoctors();
  else if(name==='doctor-bookings') populateDoctorBookings();
  else if(name==='admin-dashboard') populateAdminDashboard();
  else if(name==='bed-tracker') { populateBedTracker(); startBedRefresh(); }
  else if(name==='emergency-triage') resetTriage();
  else if(name==='floor-map') { populateMapSelect(); renderFloorMap(); }
  else if(name==='profile'){document.getElementById('patientNameDisplay').textContent=appState.currentPatientUsername+"'s Profile";populatePatientBookings();}
  else if(name==='booking') populateTimeSlots();
  if(name!=='bed-tracker') stopBedRefresh();
  window.scrollTo({top:0,behavior:'smooth'});
}

function updateNavigation(){
  const login=document.querySelector('a[data-page="login"]'), profile=document.getElementById('profileLink');
  if(appState.currentUser){if(login)login.style.display='none';if(appState.userRole==='patient')profile.style.display='block';}
  else{if(login)login.style.display='block';profile.style.display='none';}
}

// ===== TOAST =====
function toast(title,msg,type='ok'){
  const c=document.getElementById('toastContainer'),t=document.createElement('div');
  t.className='toast '+type;
  t.innerHTML=`<div><h4>${title}</h4><p>${msg}</p></div>`;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='.3s';setTimeout(()=>t.remove(),300);},3500);
}

// ===== AUTH =====
function selectRole(role){
  appState.userRole=role;
  document.querySelectorAll('.role-tab').forEach(t=>t.classList.remove('active'));
  document.querySelector(`[data-role="${role}"]`).classList.add('active');
  const n=document.getElementById('doctorLoginNote');
  if(n) n.style.display=role==='doctor'?'flex':'none';
  const dg=document.getElementById('doctorSelectGroup');
  if(dg) dg.style.display=role==='doctor'?'block':'none';
  if(role==='doctor'){
    const sel=document.getElementById('doctorSelect');
    sel.innerHTML='<option value="">Choose your identity</option>';
    hospitalsData.forEach(h=>{
      h.doctors.forEach(d=>{
        sel.innerHTML+=`<option value="${d.id}">${d.name} — ${d.specialty} (${h.name})</option>`;
      });
    });
  }
  const b=document.getElementById('loginBtn');
  b.textContent=role==='patient'?'Sign in as Patient':role==='admin'?'Sign in as Admin':'Sign in as Doctor';
}

function handleLogin(e){
  e.preventDefault();
  const u=document.getElementById('loginUsername').value.trim();
  if(!u) return toast('Error','Username is required','err');

  let docId=null;
  if(appState.userRole==='doctor'){
    const sel=document.getElementById('doctorSelect');
    docId=sel.value?parseInt(sel.value):null;
    if(!docId) return toast('Error','Please select your doctor identity','err');
  }

  appState.currentUser={username:u,role:appState.userRole};
  appState.currentDoctorId=docId;
  if(appState.userRole==='patient') appState.currentPatientUsername=u;

  document.getElementById('loginUsername').value='';
  document.getElementById('loginPassword').value='';
  toast('Welcome',`Signed in as ${u}`,'ok');
  updateNavigation();

  if(appState.userRole==='doctor'){
    let docName=u;
    hospitalsData.forEach(h=>{const d=h.doctors.find(doc=>doc.id===docId);if(d)docName=d.name;});
    document.getElementById('sidebarDoctorName').textContent=docName;
    showPage('doctor-bookings');
  }
  else if(appState.userRole==='admin') showPage('admin-dashboard');
  else showPage('hospitals');
}

function logout(){
  appState.currentUser=null;appState.currentDoctorId=null;appState.currentPatientUsername=null;
  updateNavigation();showPage('home');toast('Signed Out','You have been signed out.','ok');
}

// ===== HOSPITALS =====
function setFilter(f){
  appState.currentFilter=f;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`[data-filter="${f}"]`).classList.add('active');
  populateHospitals();
}

function filterHospitals(){
  const q=document.getElementById('hospitalSearch').value.toLowerCase();
  document.querySelectorAll('.h-card').forEach(c=>{c.style.display=c.textContent.toLowerCase().includes(q)?'flex':'none';});
}

function populateHospitals(){
  const g=document.getElementById('hospitalsGrid');if(!g)return;g.innerHTML='';
  let list=hospitalsData.filter(h=>appState.currentFilter==='all'||h.type===appState.currentFilter);
  if(appState.currentFilter==='emergency') list=hospitalsData.filter(h=>h.emergencyBeds>0||h.icuBeds>0).sort((a,b)=>(b.emergencyBeds+b.icuBeds)-(a.emergencyBeds+a.icuBeds));
  list.forEach(h=>{
    const label=h.type==='government'?'GOVT':h.type==='premium'?'PREMIUM':'PRIVATE';
    g.innerHTML+=`
    <div class="h-card">
      <div class="h-card-img">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 21v-4h6v4M9 7h.01M15 7h.01M9 11h.01M15 11h.01"/></svg>
        <span class="h-badge">${label}</span>
      </div>
      <div class="h-card-body">
        <h3>${h.name}</h3>
        <p class="h-card-loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${h.location} · <strong>${h.dist}</strong></p>
        <div class="bed-stats">
          <div class="bed-stat"><span>Total</span><strong>${h.totalBeds}</strong></div>
          <div class="bed-stat warn"><span>Emergency</span><strong>${h.emergencyBeds}</strong></div>
          <div class="bed-stat crit"><span>ICU</span><strong>${h.icuBeds}</strong></div>
        </div>
        <div class="h-card-foot">
          <span class="ts">Updated: Today, 08:00 AM</span>
          <button class="btn btn-primary" onclick="viewDoctors(${h.id})">View Doctors</button>
        </div>
      </div>
    </div>`;
  });
}

function sortByNearest(){
  appState.currentFilter='all';
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  document.querySelector('[data-filter="all"]').classList.add('active');
  hospitalsData.sort((a,b)=>parseFloat(a.dist)-parseFloat(b.dist));
  populateHospitals();
  toast('Sorted','Showing nearest hospitals first','ok');
}

// ===== DOCTORS =====
function viewDoctors(id){
  appState.selectedHospital=hospitalsData.find(h=>h.id===id);
  document.getElementById('doctorHospitalName').textContent=appState.selectedHospital.name;
  showPage('doctors');
}

function populateDoctors(){
  const g=document.getElementById('doctorsGrid');g.innerHTML='';
  if(!appState.selectedHospital)return;
  appState.selectedHospital.doctors.forEach(d=>{
    const avail=d.available>0;
    g.innerHTML+=`
    <div class="doc-card">
      <div class="doc-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div class="doc-info">
        <h3>${d.name}</h3>
        <p class="specialty">${d.specialty}</p>
        <p class="doc-qual">${d.qual}</p>
        <div class="doc-meta">
          <span class="rating">★ ${d.rating}</span>
          <span>${d.exp}</span>
          <span style="color:${avail?'var(--green)':'var(--red)'}">${d.booked}/${d.limit} booked · ${d.available} left</span>
          <span class="doc-fee">${d.fee}</span>
        </div>
      </div>
      <button class="btn ${avail?'btn-primary':'btn-outline'}" ${avail?'':'disabled'} onclick="startBooking(${d.id})">${avail?'Book Now':'Full'}</button>
    </div>`;
  });
}

// ===== BOOKING =====
function startBooking(dId){
  appState.selectedDoctor=appState.selectedHospital.doctors.find(d=>d.id===dId);
  document.getElementById('bookingDoctorName').textContent='with '+appState.selectedDoctor.name+' · '+appState.selectedDoctor.specialty+' · Fee: '+appState.selectedDoctor.fee;
  appState.selectedSlot=null;appState.selectedDate=null;appState.consultType='in-person';appState.bookingFor='myself';
  document.querySelectorAll('.ct-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('[data-type="in-person"]').classList.add('active');
  document.querySelectorAll('.bf-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.bf-btn').classList.add('active');
  document.getElementById('confirmBookingBtn').disabled=true;
  document.getElementById('selectedSlotInfo').style.display='none';
  document.getElementById('bookingForm').style.display='block';
  document.getElementById('bookingSuccess').style.display='none';
  // Pre-fill name if logged in as patient
  const nameField=document.getElementById('patientName');
  if(appState.currentPatientUsername) nameField.value=appState.currentPatientUsername;
  else nameField.value='';
  document.getElementById('patientAge').value='';
  document.getElementById('patientGender').value='';
  document.getElementById('patientPhone').value='';
  document.getElementById('visitReason').value='';
  document.getElementById('patientSymptoms').value='';
  populateDateChips();
  showPage('booking');
}

function setBookingFor(who,el){
  appState.bookingFor=who;
  document.querySelectorAll('.bf-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  const nameField=document.getElementById('patientName');
  if(who==='myself'&&appState.currentPatientUsername) nameField.value=appState.currentPatientUsername;
  else nameField.value='';
}

function populateDateChips(){
  const c=document.getElementById('dateChips');c.innerHTML='';
  const days=['Today','Tomorrow','Day After'];
  for(let i=0;i<3;i++){
    const d=new Date();d.setDate(d.getDate()+i);
    const label=days[i];
    const dateStr=d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
    c.innerHTML+=`<div class="date-chip${i===0?' active':''}" onclick="pickDate('${d.toLocaleDateString()}','${label}',this)"><span class="day">${label}</span><span class="date">${dateStr}</span></div>`;
  }
  appState.selectedDate={label:'Today',value:new Date().toLocaleDateString()};
}

function pickDate(val,label,el){
  appState.selectedDate={label,value:val};
  document.querySelectorAll('.date-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  updateSlotInfo();
}

function populateTimeSlots(){
  const g=document.getElementById('timeSlotsGrid');g.innerHTML='';
  timeSlots.forEach(t=>{g.innerHTML+=`<button class="slot-btn" onclick="pickSlot('${t}',this)">${t}</button>`;});
}

function selectConsultType(type,el){
  appState.consultType=type;
  document.querySelectorAll('.ct-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  updateSlotInfo();
}

function pickSlot(time,el){
  appState.selectedSlot=time;
  document.querySelectorAll('.slot-btn').forEach(b=>b.classList.remove('picked'));
  el.classList.add('picked');
  document.getElementById('confirmBookingBtn').disabled=false;
  updateSlotInfo();
}

function updateSlotInfo(){
  if(!appState.selectedSlot)return;
  const info=document.getElementById('selectedSlotInfo');
  info.style.display='block';
  const dateLabel=appState.selectedDate?appState.selectedDate.label:'Today';
  info.innerHTML=`<strong>${appState.consultType==='video'?'📹 Video':'🏥 In-Person'}</strong> — ${dateLabel} at <strong>${appState.selectedSlot}</strong> with ${appState.selectedDoctor.name}`;
}

function confirmBooking(){
  const name=document.getElementById('patientName').value.trim()||appState.currentPatientUsername||'Guest';
  const age=document.getElementById('patientAge').value||'—';
  const gender=document.getElementById('patientGender').value||'—';
  const phone=document.getElementById('patientPhone').value||'—';
  const reason=document.getElementById('visitReason').value||'—';
  const symptoms=document.getElementById('patientSymptoms').value||'';
  if(!appState.selectedSlot) return toast('Error','Please select a time slot','err');
  if(!name) return toast('Error','Please enter patient name','err');
  
  const dateVal=appState.selectedDate?appState.selectedDate.value:new Date().toLocaleDateString();
  const dateLabel=appState.selectedDate?appState.selectedDate.label:'Today';
  
  const booking = {
    id:Date.now(), patientName:name, age, gender, phone, reason, symptoms,
    doctor:appState.selectedDoctor.name, doctorId:appState.selectedDoctor.id,
    hospital:appState.selectedHospital.name, time:appState.selectedSlot,
    date:dateVal, dateLabel, type:appState.consultType, status:'pending', prescription:null
  };
  window.bookingsDatabase.push(booking);
  appState.selectedDoctor.available--;appState.selectedDoctor.booked++;

  document.getElementById('bookingForm').style.display='none';
  document.getElementById('bookingSuccess').style.display='block';
  
  // Build queue monitor
  const queuePos = Math.floor(Math.random()*4)+1;
  const waitMin = queuePos * 8;
  document.getElementById('queueMonitor').innerHTML=`
    <h3>📊 Queue Monitor</h3>
    <div class="queue-stats">
      <div class="queue-stat"><div class="q-num">#${queuePos}</div><div class="q-label">Your Position</div></div>
      <div class="queue-stat"><div class="q-num" id="waitCountdown">${waitMin}</div><div class="q-label">Est. Minutes</div></div>
      <div class="queue-stat"><div class="q-num">${appState.selectedDoctor.booked}</div><div class="q-label">In Queue</div></div>
    </div>
    <p class="queue-countdown" id="queueCountdownText">Estimated wait: ~${waitMin} minutes</p>
  `;
  // Start countdown
  let remaining = waitMin * 60;
  if(appState.queueTimer) clearInterval(appState.queueTimer);
  appState.queueTimer = setInterval(()=>{
    remaining--;
    if(remaining<=0){clearInterval(appState.queueTimer);return;}
    const m=Math.floor(remaining/60), s=remaining%60;
    const el=document.getElementById('waitCountdown');
    if(el) el.textContent=m;
    const txt=document.getElementById('queueCountdownText');
    if(txt) txt.textContent=`Estimated wait: ${m}m ${s}s remaining`;
  },1000);

  // Build summary card
  document.getElementById('bookingSummary').innerHTML=`
    <h3>Appointment Summary</h3>
    <div class="summary-grid">
      <div class="summary-item"><span>Patient</span><strong>${name}</strong></div>
      <div class="summary-item"><span>Age / Gender</span><strong>${age} / ${gender}</strong></div>
      <div class="summary-item"><span>Phone</span><strong>${phone}</strong></div>
      <div class="summary-item"><span>Reason</span><strong>${reason}</strong></div>
      <div class="summary-item"><span>Doctor</span><strong>${booking.doctor}</strong></div>
      <div class="summary-item"><span>Hospital</span><strong>${booking.hospital}</strong></div>
      <div class="summary-item"><span>Date & Time</span><strong>${dateLabel}, ${booking.time}</strong></div>
      <div class="summary-item"><span>Type</span><strong>${booking.type==='video'?'Video Consult':'In-Person'}</strong></div>
    </div>
    <button class="btn btn-primary btn-full" onclick="showPage('profile')">Go to My Bookings</button>
  `;
  toast('Confirmed','Appointment booked successfully!','ok');

  // Automated notifications
  addNotification('✅ Booking Confirmed',`Your appointment with ${booking.doctor} is on ${dateLabel} at ${booking.time}.`);
  setTimeout(()=>addNotification('⏰ Reminder',`Your appointment with ${booking.doctor} is coming up soon!`),15000);
  setTimeout(()=>addNotification('🏥 Check-in Ready',`Please arrive at ${booking.hospital} 10 minutes before your slot.`),30000);
}

// ===== PROFILE =====
function switchProfileTab(tab,el){
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(tab+'-tab').classList.add('active');
  document.getElementById(tab+'-tab').style.display='block';
  // hide other
  const other=tab==='bookings'?'prescriptions':'bookings';
  document.getElementById(other+'-tab').style.display='none';
  el.classList.add('active');
  if(tab==='bookings') populatePatientBookings(); else populatePatientPrescriptions();
}

function populatePatientBookings(){
  const g=document.getElementById('patientBookingsGrid');g.innerHTML='';
  const list=window.bookingsDatabase.filter(b=>b.patientName===appState.currentPatientUsername);
  if(!list.length){g.innerHTML='<p style="color:var(--text2)">No bookings yet.</p>';return;}
  list.forEach(b=>{
    const badge=b.status==='pending'?'<span class="badge badge-warn">Pending</span>':
                b.status==='visited'?'<span class="badge badge-info">Visited</span>':
                '<span class="badge badge-ok">Prescribed ✓</span>';
    const rxBtn=b.status==='prescribed'&&b.prescription?`<button class="btn btn-primary" onclick="viewPrescription(${b.id})">View Rx</button>`:'';
    g.innerHTML+=`<div class="list-card"><div class="info"><h3>${b.doctor}</h3><p>${b.hospital} · ${b.date} · ${b.time} · ${b.type==='video'?'Video':'In-Person'}</p></div>${badge}${rxBtn}</div>`;
  });
}

function populatePatientPrescriptions(){
  const g=document.getElementById('patientPrescriptionsGrid');g.innerHTML='';
  const list=window.bookingsDatabase.filter(b=>b.patientName===appState.currentPatientUsername&&b.prescription);
  if(!list.length){g.innerHTML='<p style="color:var(--text2)">No prescriptions yet.</p>';return;}
  list.forEach(b=>{
    g.innerHTML+=`<div class="list-card"><div class="info"><h3>Rx from ${b.doctor}</h3><p>${b.prescription.dateGiven}</p></div><button class="btn btn-outline" onclick="viewPrescription(${b.id})">Open</button></div>`;
  });
}

// ===== DOCTOR DASHBOARD =====
function populateDoctorBookings(){
  const g=document.getElementById('doctorBookingsContainer');g.innerHTML='';
  const list=window.bookingsDatabase.filter(b=>b.doctorId===appState.currentDoctorId);
  if(!list.length){g.innerHTML='<p style="color:var(--text2)">No appointments scheduled.</p>';return;}
  list.forEach(b=>{
    let act=b.status==='pending'?`<button class="btn btn-primary" onclick="markVisited(${b.id})">Mark Visited</button>`:
            b.status==='visited'?`<button class="btn btn-outline" onclick="openRxModal(${b.id})">Issue Rx</button>`:
            '<span class="badge badge-ok">Done</span>';
    g.innerHTML+=`<div class="list-card"><div class="info"><h3>${b.patientName}</h3><p>${b.age}yr, ${b.gender} · ${b.phone}</p><p>${b.time} · ${b.type==='video'?'📹 Video':'🏥 In-Person'} · ${b.dateLabel||b.date}</p><p style="font-size:.8rem;color:var(--teal);margin-top:4px;">${b.reason}${b.symptoms?' — '+b.symptoms:''}</p></div>${act}</div>`;
  });
}

function markVisited(id){
  const b=window.bookingsDatabase.find(x=>x.id===id);
  if(b){b.status='visited';b.visitTime=new Date().toLocaleTimeString();populateDoctorBookings();toast('Updated','Patient marked as visited.');}
}

function openRxModal(id){
  appState.selectedBookingId=id;
  const b=window.bookingsDatabase.find(x=>x.id===id);
  hospitalsData.forEach(h=>{const d=h.doctors.find(doc=>doc.id===b.doctorId);if(d){appState.selectedDoctor=d;appState.selectedHospital=h;}});
  document.getElementById('prescriptionPatientInfo').innerHTML=`
    <p><strong>Patient:</strong> ${b.patientName} &nbsp;|&nbsp; <strong>Age:</strong> ${b.age} &nbsp;|&nbsp; <strong>Gender:</strong> ${b.gender}</p>
    <p><strong>Reason:</strong> ${b.reason} ${b.symptoms?'— '+b.symptoms:''}</p>
    <p style="font-size:.8rem;color:var(--text3);margin-top:4px;">${b.date} · ${b.time}</p>`;
  document.getElementById('medicinesContainer').innerHTML='';
  addMedicineField();
  document.getElementById('prescriptionModal').classList.add('open');
}

function closePrescriptionModal(){document.getElementById('prescriptionModal').classList.remove('open');}

function addMedicineField(){
  const d=document.createElement('div');
  d.style.cssText='display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px;margin-bottom:12px;';
  d.className='med-row';
  d.innerHTML=`<input type="text" placeholder="Medicine" class="mn" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:.85rem;">
    <input type="text" placeholder="Dosage" class="md" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:.85rem;">
    <input type="text" placeholder="Freq" class="mf" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:.85rem;">
    <input type="text" placeholder="Days" class="my" style="padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-family:inherit;font-size:.85rem;">
    <button class="btn btn-outline" style="padding:6px 10px;" onclick="this.parentElement.remove()">✕</button>`;
  document.getElementById('medicinesContainer').appendChild(d);
}

function submitPrescription(){
  const b=window.bookingsDatabase.find(x=>x.id===appState.selectedBookingId);
  const meds=[];
  document.querySelectorAll('.med-row').forEach(r=>{
    const n=r.querySelector('.mn').value;
    if(n) meds.push({name:n,dose:r.querySelector('.md').value,freq:r.querySelector('.mf').value,days:r.querySelector('.my').value});
  });
  if(!meds.length) return toast('Error','Add at least one medicine','err');
  b.prescription={dateGiven:new Date().toLocaleDateString(),medicines:meds,doctorName:appState.selectedDoctor.name,specialty:appState.selectedDoctor.specialty};
  b.status='prescribed';
  closePrescriptionModal();populateDoctorBookings();toast('Success','Prescription issued.');
}

// ===== PRESCRIPTION VIEW =====
function viewPrescription(id){
  const b=window.bookingsDatabase.find(x=>x.id===id);
  if(!b||!b.prescription)return;
  document.getElementById('rxHospitalName').textContent=b.hospital;
  document.getElementById('rxDate').textContent='Date: '+b.prescription.dateGiven;
  document.getElementById('rxNumber').textContent='Rx #'+Math.floor(Math.random()*90000+10000);
  document.getElementById('rxPatientName').textContent=b.patientName+' ('+b.age+'yr, '+b.gender+')';
  document.getElementById('rxDoctorName').textContent=b.doctor;
  document.getElementById('rxSpecialty').textContent=b.prescription.specialty||'';
  document.getElementById('rxSignName').textContent=b.doctor;
  document.getElementById('rxSignReg').textContent='NMC/'+Math.floor(10000+Math.random()*90000);
  const mg=document.getElementById('rxMedicines');mg.innerHTML='';
  if(b.reason&&b.reason!=='—'){
    mg.innerHTML+=`<div style="margin-bottom:16px;padding:10px 14px;background:#f0fdfa;border-radius:8px;font-size:.85rem;"><strong>Chief Complaint:</strong> ${b.reason}${b.symptoms?' — '+b.symptoms:''}</div>`;
  }
  b.prescription.medicines.forEach(m=>{
    mg.innerHTML+=`<div class="rx-med"><h4>${m.name}</h4><div class="rx-med-info"><span>Dose: ${m.dose}</span><span>Freq: ${m.freq}</span><span>Duration: ${m.days}</span></div></div>`;
  });
  showPage('prescription');
}

// ===== ADMIN DASHBOARD =====
function populateAdminDashboard(){
  const totalBeds=hospitalsData.reduce((s,h)=>s+h.totalBeds,0);
  const totalER=hospitalsData.reduce((s,h)=>s+h.emergencyBeds,0);
  const totalICU=hospitalsData.reduce((s,h)=>s+h.icuBeds,0);
  const totalDocs=hospitalsData.reduce((s,h)=>s+h.doctors.length,0);
  const totalBookings=window.bookingsDatabase.length;
  const todayBookings=window.bookingsDatabase.filter(b=>b.date===new Date().toLocaleDateString()).length;

  const sc=document.getElementById('adminStatsCards');
  if(sc) sc.innerHTML=`
    <div class="stat-card"><span>Hospitals</span><strong>${hospitalsData.length}</strong></div>
    <div class="stat-card"><span>Total Beds</span><strong>${totalBeds}</strong></div>
    <div class="stat-card"><span>Emergency Beds</span><strong>${totalER}</strong></div>
    <div class="stat-card"><span>ICU Beds</span><strong>${totalICU}</strong></div>
    <div class="stat-card"><span>Doctors</span><strong>${totalDocs}</strong></div>
    <div class="stat-card"><span>Today's Bookings</span><strong>${todayBookings}</strong></div>
  `;

  const hg=document.getElementById('adminHospitalGrid');
  if(hg){hg.innerHTML='';
    hospitalsData.forEach(h=>{
      const docCount=h.doctors.length;
      const totalSlots=h.doctors.reduce((s,d)=>s+d.limit,0);
      const bookedSlots=h.doctors.reduce((s,d)=>s+d.booked,0);
      const pct=totalSlots?Math.round((bookedSlots/totalSlots)*100):0;
      const label=h.type==='government'?'Govt':h.type==='premium'?'Premium':'Private';
      hg.innerHTML+=`<div class="list-card">
        <div class="info">
          <h3>${h.name} <span class="badge badge-info">${label}</span></h3>
          <p>${h.location} · ${h.dist}</p>
          <p style="font-size:.8rem;margin-top:4px;">Beds: ${h.totalBeds} Total · ${h.emergencyBeds} ER · ${h.icuBeds} ICU | Doctors: ${docCount} | Slots: ${bookedSlots}/${totalSlots} (${pct}%)</p>
        </div>
      </div>`;
    });
  }

  const bg=document.getElementById('adminBookingsGrid');
  if(bg){bg.innerHTML='';
    if(!window.bookingsDatabase.length){bg.innerHTML='<p style="color:var(--text2)">No bookings recorded yet.</p>';return;}
    window.bookingsDatabase.forEach(b=>{
      const badge=b.status==='pending'?'<span class="badge badge-warn">Pending</span>':
                  b.status==='visited'?'<span class="badge badge-info">Visited</span>':
                  '<span class="badge badge-ok">Prescribed</span>';
      bg.innerHTML+=`<div class="list-card"><div class="info"><h3>${b.patientName}</h3><p>${b.doctor} · ${b.hospital} · ${b.date} · ${b.time}</p></div>${badge}</div>`;
    });
  }
}

// ===== 1. LIVE BED TRACKER =====
function populateBedTracker(){
  const g=document.getElementById('bedTrackerGrid');if(!g)return;g.innerHTML='';
  hospitalsData.forEach(h=>{
    const occ=Math.floor(h.totalBeds*(.5+Math.random()*.35));
    const cln=Math.floor(Math.random()*15)+2;
    const avl=Math.max(0,h.totalBeds-occ-cln);
    const occPct=Math.round((occ/h.totalBeds)*100);
    const clnPct=Math.round((cln/h.totalBeds)*100);
    const avlPct=100-occPct-clnPct;
    const barColor=occPct>80?'red':occPct>60?'orange':'green';
    g.innerHTML+=`<div class="bt-card">
      <h3>${h.name}</h3>
      <p class="bt-loc">${h.location} · ${h.dist}</p>
      <div class="bt-bar-wrap">
        <div class="bt-bar-label"><span>Available</span><span style="color:var(--green)">${avl} beds</span></div>
        <div class="bt-bar"><div class="bt-bar-fill green" style="width:${avlPct}%"></div></div>
      </div>
      <div class="bt-bar-wrap">
        <div class="bt-bar-label"><span>Occupied</span><span style="color:var(--red)">${occ} beds</span></div>
        <div class="bt-bar"><div class="bt-bar-fill red" style="width:${occPct}%"></div></div>
      </div>
      <div class="bt-bar-wrap">
        <div class="bt-bar-label"><span>Cleaning</span><span style="color:var(--orange)">${cln} beds</span></div>
        <div class="bt-bar"><div class="bt-bar-fill orange" style="width:${clnPct}%"></div></div>
      </div>
      <div class="bt-legend"><span class="avl">Available</span><span class="occ">Occupied</span><span class="cln">Cleaning</span></div>
    </div>`;
  });
}
function startBedRefresh(){
  stopBedRefresh();
  appState.bedRefreshTimer=setInterval(()=>{
    populateBedTracker();
  },10000);
}
function stopBedRefresh(){
  if(appState.bedRefreshTimer){clearInterval(appState.bedRefreshTimer);appState.bedRefreshTimer=null;}
}

// ===== 4. NOTIFICATIONS =====
function addNotification(title,msg){
  appState.notifications.unshift({title,msg,time:new Date().toLocaleTimeString()});
  renderNotifications();
  document.getElementById('notifDot').style.display='block';
  toast(title,msg,'ok');
}
function renderNotifications(){
  const g=document.getElementById('notifList');
  if(!appState.notifications.length){g.innerHTML='<p style="color:var(--text3);padding:20px;text-align:center;">No notifications yet.</p>';return;}
  g.innerHTML='';
  appState.notifications.forEach(n=>{
    g.innerHTML+=`<div class="notif-item"><div class="notif-icon" style="background:#f0fdfa;">\ud83d\udce8</div><div class="notif-text"><strong>${n.title}</strong><span>${n.msg}</span><br><small>${n.time}</small></div></div>`;
  });
}
function toggleNotifPanel(){
  document.getElementById('notifPanel').classList.toggle('open');
  document.getElementById('notifDot').style.display='none';
}
function clearNotifs(){
  appState.notifications=[];
  renderNotifications();
  document.getElementById('notifPanel').classList.remove('open');
}

// ===== 5. EMERGENCY TRIAGE =====
function setSeverity(level,el){
  appState.triageSeverity=level;
  document.querySelectorAll('.sev-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
}
function resetTriage(){
  appState.triageSeverity=null;
  document.querySelectorAll('.sev-btn').forEach(b=>b.classList.remove('active'));
  const n=document.getElementById('triageName');if(n)n.value='';
  const d=document.getElementById('triageDesc');if(d)d.value='';
  const r=document.getElementById('triageResults');if(r)r.innerHTML='';
}
function runTriage(){
  const name=document.getElementById('triageName').value.trim();
  const desc=document.getElementById('triageDesc').value.trim();
  if(!name) return toast('Error','Enter patient name','err');
  if(!appState.triageSeverity) return toast('Error','Select severity level','err');

  // Score hospitals: ER beds + ICU beds, weighted by severity
  const weight=appState.triageSeverity==='critical'?3:appState.triageSeverity==='urgent'?2:1;
  const scored=hospitalsData.map(h=>({
    ...h,
    score:(h.emergencyBeds*weight)+(h.icuBeds*(weight+1)),
    eta:parseFloat(h.dist)*2 // rough ETA in minutes
  })).sort((a,b)=>b.score-a.score);

  const r=document.getElementById('triageResults');
  r.innerHTML=`<h2 style="font-size:1.1rem;margin-bottom:16px;">Recommended Hospitals for <strong>${name}</strong> (${appState.triageSeverity.toUpperCase()})</h2>`;
  scored.slice(0,5).forEach((h,i)=>{
    const rankClass=i===0?'r1':i===1?'r2':'r3';
    r.innerHTML+=`<div class="triage-result">
      <div class="triage-rank ${rankClass}">#${i+1}</div>
      <div class="info" style="flex:1;">
        <h3>${h.name}</h3>
        <p style="font-size:.85rem;color:var(--text2);">${h.location} · ${h.dist} · ETA ~${Math.round(h.eta)} min</p>
        <p style="font-size:.8rem;margin-top:4px;">ER: <strong>${h.emergencyBeds}</strong> beds · ICU: <strong>${h.icuBeds}</strong> beds · Score: ${h.score}</p>
      </div>
      <button class="btn btn-primary" onclick="viewDoctors(${h.id})">Go</button>
    </div>`;
  });

  addNotification('\ud83d\udea8 Emergency Triage',`Priority allocation for ${name} (${appState.triageSeverity}). Top: ${scored[0].name}`);
}

// ===== 6. FLOOR MAP =====
const floorRooms=[
  {id:'reception',label:'Reception',x:20,y:20,w:160,h:80,color:'#dbeafe',directions:['Enter through the main entrance','Reception is straight ahead on your left']},
  {id:'emergency',label:'Emergency',x:200,y:20,w:160,h:80,color:'#fee2e2',directions:['From reception, turn right','Follow the red signs to Emergency Ward']},
  {id:'opd',label:'OPD',x:380,y:20,w:160,h:80,color:'#dcfce7',directions:['From reception, go straight','OPD rooms are in the central corridor']},
  {id:'pharmacy',label:'Pharmacy',x:560,y:20,w:200,h:80,color:'#fef3c7',directions:['From reception, take the left corridor','Pharmacy is at the end of the hall']},
  {id:'lab',label:'Laboratory',x:20,y:140,w:160,h:80,color:'#f3e8ff',directions:['Take the elevator to 1st floor','Lab is the first door on the right']},
  {id:'radiology',label:'Radiology',x:200,y:140,w:160,h:80,color:'#e0e7ff',directions:['Take the elevator to 1st floor','Radiology is at the end of the corridor']},
  {id:'icu',label:'ICU',x:380,y:140,w:160,h:80,color:'#fce7f3',directions:['Take the elevator to 2nd floor','ICU is through the double doors on the left','Visitor pass required']},
  {id:'surgery',label:'Surgery',x:560,y:140,w:200,h:80,color:'#fef2f2',directions:['Take the elevator to 2nd floor','Surgery OT is at the end of the corridor','Staff access only']},
  {id:'ward1',label:'General Ward',x:20,y:260,w:240,h:80,color:'#f0fdfa',directions:['Take the stairs/elevator to 3rd floor','General ward is the entire left wing']},
  {id:'ward2',label:'Maternity Ward',x:280,y:260,w:240,h:80,color:'#fff1f2',directions:['Take the elevator to 3rd floor','Maternity ward is in the right wing']},
  {id:'cafeteria',label:'Cafeteria',x:540,y:260,w:220,h:80,color:'#fef9c3',directions:['Ground floor, exit the main building','Cafeteria is in the annex building on the right']},
  {id:'parking',label:'Parking',x:20,y:380,w:200,h:80,color:'#e2e8f0',directions:['Exit through the main entrance','Parking lot is on the left side']},
  {id:'billing',label:'Billing',x:240,y:380,w:160,h:80,color:'#cffafe',directions:['Ground floor near reception','Billing counter is behind the reception desk']},
  {id:'blood-bank',label:'Blood Bank',x:420,y:380,w:170,h:80,color:'#ffe4e6',directions:['Ground floor, take the right corridor','Blood bank is next to the laboratory entrance']},
];

function populateMapSelect(){
  const s=document.getElementById('mapHospitalSelect');
  if(!s||s.options.length>1) return;
  s.innerHTML='';
  hospitalsData.forEach(h=>{
    s.innerHTML+=`<option value="${h.id}">${h.name}</option>`;
  });
}
function renderFloorMap(){
  const svg=document.getElementById('floorMapSvg');
  svg.innerHTML='';
  // Corridor lines
  svg.innerHTML+=`<rect x="0" y="0" width="800" height="500" fill="#f8fafc" rx="12"/>`;
  svg.innerHTML+=`<text x="400" y="490" text-anchor="middle" fill="#94a3b8" font-size="11">Tap any department for directions</text>`;
  // Rooms
  floorRooms.forEach(r=>{
    svg.innerHTML+=`<rect class="room" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="8" fill="${r.color}" stroke="#cbd5e1" stroke-width="1.5" onclick="showMapDirections('${r.id}')"/>`;
    svg.innerHTML+=`<text x="${r.x+r.w/2}" y="${r.y+r.h/2+5}" text-anchor="middle" fill="#1e293b" font-size="13" font-weight="600">${r.label}</text>`;
  });
}
function showMapDirections(roomId){
  const room=floorRooms.find(r=>r.id===roomId);
  if(!room) return;
  const d=document.getElementById('mapDirections');
  d.style.display='block';
  d.innerHTML=`<h3>\ud83d\udccd Directions to ${room.label}</h3><ol>${room.directions.map(s=>`<li>${s}</li>`).join('')}</ol>`;
  // Highlight room
  document.querySelectorAll('.floor-svg rect.room').forEach(r=>r.setAttribute('stroke-width','1.5'));
  const sel=document.querySelector(`.floor-svg rect[onclick*="'${roomId}'"]`);
  if(sel){sel.setAttribute('stroke','#0d9488');sel.setAttribute('stroke-width','4');}
  d.scrollIntoView({behavior:'smooth'});
}

document.addEventListener('DOMContentLoaded',initApp);
