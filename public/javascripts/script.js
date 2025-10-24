/* ---------- App-wide helpers ---------- */
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
function confirmLogout() {
  // Show browser confirmation popup
  const confirmed = confirm("Are you sure you want to logout?");
  
  if (confirmed) {
    // Redirect to logout route or perform logout action
    window.location.href = "/"; // change this to your logout URL
  } else {
    // Do nothing, user canceled
    console.log("Logout cancelled");
  }
}

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  const pre = qs('#preloader');
  if (pre) setTimeout(()=>pre.style.display='none', 650);
  initApp(); // initialize after load
});

/* ---------- THEME (dark/light) ---------- */
function setTheme(theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('mc_theme', theme);
}
const savedTheme = localStorage.getItem('mc_theme') || 'light';
setTheme(savedTheme);
qsa('#themeToggle').forEach(btn => btn && btn.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setTheme(cur === 'dark' ? 'light' : 'dark');
  showToast('Theme changed', 'success');
}));

/* ---------- MOBILE MENU ---------- */
qsa('#menuToggle').forEach(btn => btn && btn.addEventListener('click', () => {
  const nav = qs('#navLinks');
  nav && nav.classList.toggle('show');
}));

/* ---------- TOASTS ---------- */
function showToast(message, type='info', timeout=3000){
  const container = qs('#toasts');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<strong>${message}</strong>`;
  container.appendChild(el);
  setTimeout(()=> el.style.opacity = '1', 10);
  setTimeout(()=> {
    el.style.opacity = '0';
    setTimeout(()=> el.remove(), 400);
  }, timeout);
}

/* ---------- MOCK DOCTORS DATA ---------- */
const defaultDoctors = [
  { id: 'd1', name: 'Dr. Ali Khan', specialty: 'Cardiologist', fee: 2000, img:'https://images.unsplash.com/photo-1606813902843-7a7b2d3d6e6a?auto=format&fit=crop&w=400&q=60' },
  { id: 'd2', name: 'Dr. Sara Ahmed', specialty: 'Dermatologist', fee: 1500, img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60' },
  { id: 'd3', name: 'Dr. Ahmed Raza', specialty: 'Dentist', fee: 1200, img:'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=400&q=60' },
  { id: 'd4', name: 'Dr. Fatima Noor', specialty: 'Pediatrician', fee: 1800, img:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60' },
  { id: 'd5', name: 'Dr. Bilal Qureshi', specialty: 'Orthopedic', fee: 2200, img:'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=60' }
];

function getDoctors(){
  const raw = localStorage.getItem('mc_doctors');
  if (!raw) {
    localStorage.setItem('mc_doctors', JSON.stringify(defaultDoctors));
    return defaultDoctors;
  }
  try { return JSON.parse(raw); } catch(e){ return defaultDoctors; }
}

/* ---------- APPOINTMENTS storage ---------- */
function getAppointments(){
  const raw = localStorage.getItem('mc_appts') || '[]';
  try { return JSON.parse(raw); } catch(e){ return []; }
}
function saveAppointments(list){ localStorage.setItem('mc_appts', JSON.stringify(list)); }

/* ---------- INIT APP ---------- */
function initApp(){
  if (qs('#doctorsGrid')) renderDoctors();
  if (qs('#doctorSelect')) populateDoctorSelect();
  updateStats();

  const contact = qs('#contactForm');
  if (contact) contact.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent — thanks!', 'success', 2500);
    contact.reset();
  });

  const bookForm = qs('#bookForm');
  if (bookForm) bookForm.addEventListener('submit', handleBooking);

  initCalendar();

  if (qs('#appointmentsList')) renderAppointments();

  const searchDoctor = qs('#searchDoctor');
  if (searchDoctor) searchDoctor.addEventListener('input', renderDoctors);
  const filterSpec = qs('#filterSpec');
  if (filterSpec) filterSpec.addEventListener('change', renderDoctors);

  const loginForm = qs('#loginForm');
  if (loginForm) loginForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Login successful (mock)', 'success');
    setTimeout(()=> location.href='index.html', 600);
  });
  const registerForm = qs('#registerForm');
  if (registerForm) registerForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Account created (mock)', 'success');
    setTimeout(()=> location.href='login.html', 700);
  });

  const searchAppts = qs('#searchAppointments');
  if (searchAppts) searchAppts.addEventListener('input', renderAppointments);
  const filterStatus = qs('#filterStatus');
  if (filterStatus) filterStatus.addEventListener('change', renderAppointments);

  const scrollBtn = qs('#scrollTopBtn');
  if (scrollBtn) scrollBtn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
}

/* ---------- DOCTORS PAGE RENDER ---------- */
function renderDoctors(){
  const grid = qs('#doctorsGrid');
  if (!grid) return;
  const all = getDoctors();
  const specSet = new Set(all.map(d=>d.specialty));
  const filterSpec = qs('#filterSpec');
  if (filterSpec && filterSpec.children.length <= 1) {
    specSet.forEach(s => {
      const opt = document.createElement('option'); opt.value = s; opt.textContent = s;
      filterSpec.appendChild(opt);
    });
  }

  const q = (qs('#searchDoctor') && qs('#searchDoctor').value.toLowerCase()) || '';
  const spec = (filterSpec && filterSpec.value) || '';
  const filtered = all.filter(d => {
    return (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
      && (spec ? d.specialty === spec : true);
  });

  grid.innerHTML = filtered.map(d => `
    <div class="doc-card">
      <img src="${d.img}" alt="${d.name}">
      <div class="doc-info">
        <h4>${d.name}</h4>
        <p>${d.specialty} • Fee: Rs ${d.fee}</p>
        <div><span class="badge">${d.specialty}</span></div>
      </div>
      <div style="margin-left:auto">
        <button class="btn" onclick="startBooking('${d.id}')">Book</button>
      </div>
    </div>
  `).join('') || `<p style="padding:8px;color:var(--muted)">No doctors found.</p>`;
}

/* ---------- POPULATE DOCTOR SELECT ---------- */
function populateDoctorSelect(){
  const sel = qs('#doctorSelect');
  if (!sel) return;
  const docs = getDoctors();
  sel.innerHTML = '<option value="">Select doctor</option>' + docs.map(d =>
    `<option value="${d.id}">${d.name} — ${d.specialty} (Rs ${d.fee})</option>
 ` ).join('');
}

/* ---------- START BOOKING ---------- */
function startBooking(doctorId){
  localStorage.setItem('mc_pref_doctor', doctorId);
  location.href = 'book.html';
}

/* ---------- BOOKING HANDLER ---------- */
function handleBooking(e){
  e.preventDefault();
  const docId = qs('#doctorSelect').value;
  const date = qs('#dateInput').value;
  const time = qs('#timeSelect').value;
  const notes = qs('#notes').value || '';
  if (!docId || !date || !time) return showToast('Please fill doctor, date & time', 'danger');
  const docs = getDoctors();
  const doc = docs.find(d => d.id === docId);
  const appts = getAppointments();
  const newAppt = {
    id: 'a' + Date.now(),
    doctorId: docId,
    doctorName: doc.name,
    specialty: doc.specialty,
    date, time, notes,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  appts.push(newAppt);
  saveAppointments(appts);
  showToast('Appointment booked ✔', 'success', 2800);
  updateStats();
  qs('#bookForm').reset();
  setTimeout(()=> location.href = 'appointments.html', 900);
}

/* ---------- UPDATE STATISTICS ---------- */
function updateStats(){
  const docs = getDoctors();
  const appts = getAppointments();
  const upcoming = appts.filter(a => new Date(a.date) >= new Date()).length;
  if (qs('#statDoctors')) qs('#statDoctors').textContent = docs.length;
  if (qs('#statBookings')) qs('#statBookings').textContent = appts.length;
  if (qs('#statUpcoming')) qs('#statUpcoming').textContent = upcoming;
}

/* ---------- RENDER APPOINTMENTS ---------- */
function renderAppointments(){
  const cont = qs('#appointmentsList');
  if (!cont) return;
  const appts = getAppointments();
  const q = (qs('#searchAppointments') && qs('#searchAppointments').value.toLowerCase()) || '';
  const status = (qs('#filterStatus') && qs('#filterStatus').value) || '';

  const filtered = appts.filter(a => {
    const matchesQ = a.doctorName.toLowerCase().includes(q) || a.date.includes(q);
    const matchesStatus = status ? a.status === status : true;
    return matchesQ && matchesStatus;
  });

  if (!filtered.length) {
    cont.innerHTML =` <p style="color:var(--muted)">No appointments found.</p>`;
    return;
  }
  cont.innerHTML = filtered.map(a => `
    <div class="app-card">
      <div class="left">
        <div><strong>${a.doctorName}</strong> <small class="meta">(${a.specialty})</small></div>
        <div class="meta">${a.date} • ${a.time}</div>
      </div>
      <div class="app-actions">
        <span class="badge">${a.status}</span>
        ${a.status !== 'Cancelled' ? `<button onclick="changeStatus('${a.id}','Cancelled')" class="btn ghost small">Cancel</button>` : ''}
        ${a.status === 'Pending' ? `<button onclick="changeStatus('${a.id}','Confirmed')" class="btn small">Confirm</button>` : ''}
      </div>
    </div>
  `).join('');
}

/* ---------- CHANGE STATUS ---------- */
function changeStatus(id, status){
  const appts = getAppointments();
  const idx = appts.findIndex(a => a.id === id);
  if (idx === -1) return;
  appts[idx].status = status;
  saveAppointments(appts);
  showToast(`Appointment ${status}`, 'success');
  renderAppointments();
  updateStats();
}

/* ---------- CALENDAR ---------- */
function initCalendar(){
  const popup = qs('#calendarPopup');
  const dateInput = qs('#dateInput');
  if (!dateInput || !popup) return;

  function buildCalendar(){
    const now = new Date();
    let html = '<div style="display:flex;flex-wrap:wrap;gap:8px">';
    for (let i=0;i<60;i++){
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate()+i);
      const label = d.toISOString().slice(0,10);
      const isPast = d < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      html += `<button class="cal-day" data-date="${label}" style="padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);background:${isPast? '#f4f4f4':'transparent'}">${label}</button>`;
    }
    html += '</div>';
    popup.innerHTML = html;
    qsa('.cal-day').forEach(btn => {
      btn.addEventListener('click', ()=>{
        if (btn.dataset.date) {
          dateInput.value = btn.dataset.date;
          popup.classList.add('hidden');
        }
      });
    });
  }

  dateInput.addEventListener('focus', () => {
    buildCalendar();
    popup.classList.remove('hidden');
  });
  window.addEventListener('click', e => {
    if (!popup.contains(e.target) && e.target !== dateInput) popup.classList.add('hidden');
  });

  const pref = localStorage.getItem('mc_pref_doctor');
  if (pref && qs('#doctorSelect')) qs('#doctorSelect').value = pref;
  localStorage.removeItem('mc_pref_doctor');
}



/* ---------- FALLBACK INIT ---------- */
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initApp, 250);
}

window.startBooking = startBooking;
window.changeStatus = changeStatus;