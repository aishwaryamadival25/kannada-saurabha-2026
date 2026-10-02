/* ---------- language ---------- */
function setLang(l){
  document.body.classList.toggle('lang-kn', l==='kn');
  document.getElementById('btnEN').classList.toggle('active', l==='en');
  document.getElementById('btnKN').classList.toggle('active', l==='kn');
  try{localStorage.setItem('rajyotsava_lang', l);}catch(e){}
  renderData();
}
(function(){
  var saved='en';
  try{saved=localStorage.getItem('rajyotsava_lang')||'en';}catch(e){}
  document.body.classList.toggle('lang-kn', saved==='kn');
})();

/* ---------- nav + hash routing ---------- */
var pages=['home','about','schedule','events','guests','members','sponsorship','gallery','venue'];
function showPage(id){
  if(pages.indexOf(id)===-1) id='home';
  pages.forEach(function(p){
    document.getElementById('page-'+p).classList.toggle('active', p===id);
  });
  document.querySelectorAll('[data-nav]').forEach(function(a){
    var h=a.getAttribute('href').replace('#','');
    a.classList.toggle('active', h===id);
  });
  document.getElementById('mobileMenu').style.display='none';
  document.getElementById('siteHeader').classList.remove('open');
  if(id === 'sponsorship'){
    try{
      var raw = localStorage.getItem('kv_packages_v1');
      if(raw){
        var parsed = JSON.parse(raw);
        if(Array.isArray(parsed) && parsed.length > 0){
          packages = parsed;
        }
      }
      var rawV = localStorage.getItem('kv_venue_v1');
      if(rawV) venueData = JSON.parse(rawV);
      var rawSC = localStorage.getItem('kv_sponsor_contact_v1');
      if(rawSC) sponsorContact = JSON.parse(rawSC);
    }catch(e){}
    renderPackageCards();
    renderSponsorContact();
  }
  window.scrollTo({top:0,behavior:'instant' in window ? 'instant':'auto'});
}
document.querySelectorAll('[data-nav]').forEach(function(a){
  a.addEventListener('click', function(e){
    var id=a.getAttribute('href').replace('#','');
    location.hash=id;
  });
});
window.addEventListener('hashchange', function(){
  showPage(location.hash.replace('#','')||'home');
});
document.getElementById('hamBtn').addEventListener('click', function(){
  var h=document.getElementById('siteHeader');
  var open=h.classList.toggle('open');
  document.getElementById('mobileMenu').style.display = open?'flex':'none';
});

/* ---------- video modal ---------- */
var VIDEO_SRC = {
  melam: "assets/videos/melam-2025.mp4",
  vaibhava: "assets/videos/kannada-vaibhava-2025.mp4",
  melam2026: "assets/videos/melam-2026.mp4",
  suvarna2023: "assets/videos/suvarna-mahothsava-2023.mp4",
  suvarna: "assets/videos/suvarna-mahothsava-2023.mp4"
};
var VIDEO_POSTER = {
  melam: "assets/images/melam-2025.jpg",
  vaibhava: "assets/images/kannada-vaibhava-2025.jpg",
  melam2026: "assets/images/melam-2026.jpg",
  suvarna2023: "assets/images/suvarna-mahothsava-2023.jpg",
  suvarna: "assets/images/suvarna-mahothsava-2023.jpg"
};
function openVideo(key){
  key = key || 'vaibhava';
  var v=document.getElementById('modalVideo');
  if(!VIDEO_SRC[key]) key = 'vaibhava';
  v.querySelector('source').src = VIDEO_SRC[key];
  v.setAttribute('poster', VIDEO_POSTER[key] || '');
  v.load();
  document.getElementById('videoModal').classList.add('open');
  try{
    var p = v.play();
    if(p && p.catch) p.catch(function(){});
  }catch(e){}
}
function closeVideo(){
  document.getElementById('videoModal').classList.remove('open');
  var v=document.getElementById('modalVideo');
  v.pause();
}
document.getElementById('videoModal').addEventListener('click', function(e){
  if(e.target===this) closeVideo();
});

/* ---------- data-driven content: schedule / events / guests / gallery ---------- */
/* ================================================================
   EDIT HERE: add your own events and members.
   Copy one line inside [ ], change the text, keep the commas.
   ================================================================ */
/* ================================================================
   EVENTS: manage them from the Events page (Add / Edit / Delete).
   - image: a picture (leave "" to show a red placeholder)
   - coordinators: up to 5 per event, each with nameEn, nameKn, contact
   ================================================================ */
const CONCLAVE_EVENT = {
  id: "karnataka-conclave",
  titleEn: "Karnataka Conclave",
  titleKn: "ಕರ್ನಾಟಕ ಕಾನ್ಕ್ಲೇವ್",
  tagline: "ನಮ್ಮ ನುಡಿ ನಮ್ಮ ಹೆಮ್ಮೆ",
  date: "4 November 2026",
  time: "11:30 AM – 12:00 PM",
  venue: "HKBK College of Engineering",
  descriptionEn: "As part of the Karnataka Rajyotsava celebrations, Kannada Saurabha brings together Kannada faculty from VTU to honour their dedication to teaching the Kannada language and preserving its literature and culture. The event recognises their contribution to shaping students' values and pride in Kannada heritage. Through felicitations, interaction and cultural engagement, it celebrates the people who keep our language and traditions alive.",
  descriptionKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ ಸಂಭ್ರಮದ ಅಂಗವಾಗಿ, ಕನ್ನಡ ಸೌರಭ ಕಾರ್ಯಕ್ರಮವು ವಿಟಿಯು (VTU) ವ್ಯಾಪ್ತಿಯ ಕನ್ನಡ ಪ್ರಾಧ್ಯಾಪಕರನ್ನು ಗೌರವಿಸಲು ಒಗ್ಗೂಡಿಸುತ್ತದೆ. ಕನ್ನಡ ಭಾಷೆ ಬೋಧನೆ ಮತ್ತು ಸಾಹಿತ್ಯ ಹಾಗೂ ಸಂಸ್ಕೃತಿಯನ್ನು ಸಂರಕ್ಷಿಸುವಲ್ಲಿ ಅವರ ಸಮರ್ಪಣಾ ಮನೋಭಾವವನ್ನು ಈ ಕಾರ್ಯಕ್ರಮ ಗೌರವಿಸುತ್ತದೆ. ವಿದ್ಯಾರ್ಥಿಗಳಲ್ಲಿ ಕನ್ನಡ ಪರಂಪರೆಯ ಹೆಮ್ಮೆ ಮತ್ತು ಮೌಲ್ಯಗಳನ್ನು ಬೆಳೆಸುವಲ್ಲಿ ಅವರ ಕೊಡುಗೆ ಅಪಾರ. ಸನ್ಮಾನ, ಸಂವಾದ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಒಡನಾಟದ ಮೂಲಕ, ನಮ್ಮ ಭಾಷೆ ಮತ್ತು ಸಂಪ್ರದಾಯಗಳನ್ನು ಜೀವಂತವಾಗಿರಿಸುವ ಗಣ್ಯರನ್ನು ಇದು ಗೌರವಿಸುತ್ತದೆ.",
  image: "",
  icon: "🏛️",
  coordinators: []
};

const DEFAULT_EVENTS=[
  {
    titleEn: "Kannada Quiz",
    titleKn: "ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ",
    date: "27 Oct",
    time: "10:00 - 11:30 AM",
    venue: "CSE Seminar Hall",
    descriptionEn: "A thrilling quiz competition celebrating Karnataka's heritage, history, literature, cinema, and achievements.",
    descriptionKn: "ಕರ್ನಾಟಕದ ಪರಂಪರೆ, ಇತಿಹಾಸ, ಸಾಹಿತ್ಯ, ಸಿನಿಮಾ ಮತ್ತು ಸಾಧನೆಗಳ ಕುರಿತ ರೋಮಾಂಚಕ ರಸಪ್ರಶ್ನೆ ಸ್ಪರ್ಧೆ.",
    image: "",
    icon: "🎭",
    coordinators: []
  },
  {
    titleEn: "Dumb Charades",
    titleKn: "ಡಮ್ ಶರೇಡ್ಸ್",
    date: "27 Oct",
    time: "11:30 - 1:00 PM",
    venue: "CSE Seminar Hall",
    descriptionEn: "An exciting and fun-filled dumb charades competition based on Kannada movies, proverbs, and cultural themes.",
    descriptionKn: "ಕನ್ನಡ ಚಲನಚಿತ್ರಗಳು, ಗಾದೆಗಳು ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ವಿಷಯಗಳನ್ನಾಧರಿಸಿದ ರೋಮಾಂಚಕ ಮೂಕಾಭಿನಯ ಸ್ಪರ್ಧೆ.",
    image: "",
    icon: "🎭",
    coordinators: []
  },
  {titleEn:"Cultural Performances", titleKn:"ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"A showcase of Karnataka's performing arts.", descriptionKn:"ಕರ್ನಾಟಕದ ಪ್ರದರ್ಶನ ಕಲೆಗಳ ಪ್ರದರ್ಶನ.", image:"", icon:"💃", coordinators:[]},
  {titleEn:"Classical Dance", titleKn:"ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"Bharatanatyam and Kuchipudi recitals.", descriptionKn:"ಭರತನಾಟ್ಯ ಮತ್ತು ಕೂಚಿಪುಡಿ ಪ್ರದರ್ಶನಗಳು.", image:"", icon:"🩰", coordinators:[]},
  {titleEn:"Folk Dance", titleKn:"ಜಾನಪದ ನೃತ್ಯ", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"Dollu Kunitha and regional folk forms.", descriptionKn:"ಡೊಳ್ಳು ಕುಣಿತ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಜಾನಪದ ಕಲೆಗಳು.", image:"", icon:"🥁", coordinators:[]},
  {titleEn:"Music", titleKn:"ಸಂಗೀತ", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"Live vocal and instrumental performances.", descriptionKn:"ನೇರ ಗಾಯನ ಮತ್ತು ವಾದ್ಯ ಪ್ರದರ್ಶನಗಳು.", image:"", icon:"🎶", coordinators:[]},
  {titleEn:"Kannada Literature", titleKn:"ಕನ್ನಡ ಸಾಹಿತ್ಯ", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"Poetry readings and author talks.", descriptionKn:"ಕವನ ವಾಚನ ಮತ್ತು ಲೇಖಕರ ಮಾತುಕತೆ.", image:"", icon:"📖", coordinators:[]},
  {titleEn:"Awards", titleKn:"ಪ್ರಶಸ್ತಿಗಳು", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"Recognising outstanding community members.", descriptionKn:"ಗಮನಾರ್ಹ ಸಮುದಾಯ ಸದಸ್ಯರ ಗೌರವ.", image:"", icon:"🏅", coordinators:[]},
  {titleEn:"Children's Programs", titleKn:"ಮಕ್ಕಳ ಕಾರ್ಯಕ್ರಮಗಳು", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"Fun activities and performances for kids.", descriptionKn:"ಮಕ್ಕಳಿಗಾಗಿ ಮೋಜಿನ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಪ್ರದರ್ಶನಗಳು.", image:"", icon:"🧒", coordinators:[]},
  {titleEn:"Community Activities", titleKn:"ಸಮುದಾಯ ಚಟುವಟಿಕೆಗಳು", date:"4 November 2026", time:"", venue:"HKBK College of Engineering", descriptionEn:"Food stalls, games and get-togethers.", descriptionKn:"ಆಹಾರ ಮಳಿಗೆಗಳು, ಆಟಗಳು ಮತ್ತು ಸಮಾಗಮ.", image:"", icon:"🍛", coordinators:[]}
];

let events=DEFAULT_EVENTS;
try{
  var _s=JSON.parse(localStorage.getItem('kv_events_v2'));
  if(Array.isArray(_s)){
    var cleaned = _s.filter(function(item){
      return !isConclaveEvent(item);
    });

    var quizIdx = -1;
    for(var q = 0; q < cleaned.length; q++){
      if((cleaned[q].titleEn && cleaned[q].titleEn.toLowerCase().includes('quiz')) || (cleaned[q].titleKn && cleaned[q].titleKn.includes('ರಸಪ್ರಶ್ನೆ'))){
        quizIdx = q; break;
      }
    }
    var quizObj = quizIdx >= 0 ? Object.assign({}, cleaned[quizIdx], {
      titleEn: "Kannada Quiz",
      titleKn: "ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ",
      date: "27 Oct",
      time: "10:00 - 11:30 AM",
      venue: "CSE Seminar Hall",
      icon: "🎭"
    }) : DEFAULT_EVENTS[0];
    if(quizIdx >= 0) cleaned.splice(quizIdx, 1);

    var dcIdx = -1;
    for(var d = 0; d < cleaned.length; d++){
      if((cleaned[d].titleEn && cleaned[d].titleEn.toLowerCase().includes('charades')) || (cleaned[d].titleKn && cleaned[d].titleKn.includes('ಶರೇಡ್ಸ್'))){
        dcIdx = d; break;
      }
    }
    var dcObj = dcIdx >= 0 ? Object.assign({}, cleaned[dcIdx], {
      titleEn: "Dumb Charades",
      titleKn: "ಡಮ್ ಶರೇಡ್ಸ್",
      date: "27 Oct",
      time: "11:30 - 1:00 PM",
      venue: "CSE Seminar Hall",
      icon: "🎭"
    }) : DEFAULT_EVENTS[1];
    if(dcIdx >= 0) cleaned.splice(dcIdx, 1);

    cleaned.unshift(dcObj);
    cleaned.unshift(quizObj);

    events = cleaned;
    localStorage.setItem('kv_events_v2', JSON.stringify(events));
  }
}catch(e){}

function saveEvents(){try{localStorage.setItem('kv_events_v2',JSON.stringify(events)); return true;}catch(e){return false;}}

/* ---------- Karnataka Conclave: Professors & Faculty ---------- */
const DEFAULT_CONCLAVE_PROFESSORS = [
  {
    nameEn: "Dr. L. Ramesh",
    nameKn: "ಡಾ. ಎಲ್. ರಮೇಶ್",
    roleEn: "Professor of Kannada",
    roleKn: "ಕನ್ನಡ ಪ್ರಾಧ್ಯಾಪಕರು",
    collegeEn: "Visvesvaraya Technological University (VTU), Belagavi",
    collegeKn: "ವಿಶ್ವೇಶ್ವರಯ್ಯ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ (ವಿಟಿಯು), ಬೆಳಗಾವಿ",
    contact: "+91 98451 23456",
    photo: ""
  },
  {
    nameEn: "Prof. Manjunath Swamy",
    nameKn: "ಪ್ರೊ. ಮಂಜುನಾಥ ಸ್ವಾಮಿ",
    roleEn: "Associate Professor & Kannada Coordinator",
    roleKn: "ಸಹ ಪ್ರಾಧ್ಯಾಪಕರು ಮತ್ತು ಕನ್ನಡ ಸಂಯೋಜಕರು",
    collegeEn: "HKBK College of Engineering, Bengaluru",
    collegeKn: "ಎಚ್‌ಕೆಬಿಕೆ ಇಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು, ಬೆಂಗಳೂರು",
    contact: "+91 97410 98765",
    photo: ""
  }
];

let conclaveProfessors = DEFAULT_CONCLAVE_PROFESSORS;
try{
  var _cp = JSON.parse(localStorage.getItem('conclave_professors_v1'));
  if(Array.isArray(_cp) && _cp.length > 0){
    conclaveProfessors = _cp;
  } else {
    localStorage.setItem('conclave_professors_v1', JSON.stringify(DEFAULT_CONCLAVE_PROFESSORS));
  }
}catch(e){}

function saveConclaveProfessors(){
  try{
    localStorage.setItem('conclave_professors_v1', JSON.stringify(conclaveProfessors));
    return true;
  }catch(e){
    return false;
  }
}

function isConclaveEvent(e){
  if(!e) return false;
  return (e.id === 'karnataka-conclave') ||
         (e.titleEn && e.titleEn.toLowerCase().includes('conclave')) ||
         (e.titleKn && e.titleKn.includes('ಕಾನ್ಕ್ಲೇವ್'));
}

let members=[];
try{
  var _m=JSON.parse(localStorage.getItem('studentCommitteeMembers') || localStorage.getItem('kv_members_v2'));
  if(Array.isArray(_m)) members=_m;
}catch(e){}
function saveMembers(){
  try{
    var d=JSON.stringify(members);
    localStorage.setItem('studentCommitteeMembers', d);
    localStorage.setItem('kv_members_v2', d);
    return true;
  }catch(e){return false;}
}
let mgmtMembers=[];
try{
  var _mm=JSON.parse(localStorage.getItem('managementCommitteeMembers') || localStorage.getItem('kv_mgmt_members_v1'));
  if(Array.isArray(_mm)) mgmtMembers=_mm;
}catch(e){}
function saveMgmtMembers(){
  try{
    var d=JSON.stringify(mgmtMembers);
    localStorage.setItem('managementCommitteeMembers', d);
    localStorage.setItem('kv_mgmt_members_v1', d);
    return true;
  }catch(e){return false;}
}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function pick(o,k){return esc(isKN()&&o[k+'_kn']?o[k+'_kn']:(o[k+'_en']||''));}
var currentEv=-1;
var PHONE_SVG='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8102E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
function evImg(e){return '<div class="evimg"><span>'+esc(e.icon||'🎭')+'</span>'+(e.image?'<img src="'+esc(e.image)+'" alt="" onerror="this.remove()">':'')+'</div>';}
function evTitle(e){return esc(isKN()?(e.titleKn||e.titleEn):(e.titleEn||e.titleKn));}
function evDesc(e){return esc(isKN()?(e.descriptionKn||e.descriptionEn):(e.descriptionEn||e.descriptionKn));}

function renderConclaveSection(){
  var container = document.getElementById('conclaveSpecialSection');
  if(!container) return;
  var kn = isKN();

  var profCardsHtml = conclaveProfessors.length ? conclaveProfessors.map(function(p, pIdx){
    var tel = String(p.contact || '').replace(/[^0-9+]/g, '');
    var pName = kn ? (p.nameKn || p.nameEn) : (p.nameEn || p.nameKn);
    var pRole = kn ? (p.roleKn || p.roleEn) : (p.roleEn || p.roleKn);
    var pCollege = kn ? (p.collegeKn || p.collegeEn) : (p.collegeEn || p.collegeKn);
    var avatarHtml = p.photo
      ? '<img src="' + esc(p.photo) + '" alt="' + esc(pName) + '" style="width:62px; height:62px; border-radius:50%; object-fit:cover; border:2.5px solid var(--yellow); flex-shrink:0; box-shadow:0 3px 8px rgba(0,0,0,0.1);">'
      : '<div style="width:62px; height:62px; border-radius:50%; background:linear-gradient(135deg, #FFC400, #C8102E); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:1.35rem; flex-shrink:0; box-shadow:0 4px 10px rgba(200,16,46,0.22);">👨‍🏫</div>';

    return '<div class="prof-card">' +
      avatarHtml +
      '<div style="flex:1; min-width:0;">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">' +
          '<div>' +
            '<h5 style="margin:0 0 3px; font-size:1.02rem; color:var(--ink); font-weight:700;">' + esc(pName) + '</h5>' +
            (pRole ? '<div style="color:var(--red); font-weight:700; font-size:.85rem; margin-bottom:3px;">' + esc(pRole) + '</div>' : '') +
            (pCollege ? '<div style="color:var(--ink-soft); font-size:.82rem; display:flex; align-items:center; gap:5px; margin-bottom:5px;"><span>🏛️</span><span>' + esc(pCollege) + '</span></div>' : '') +
          '</div>' +
          '<div class="prof-admin-actions" style="display:flex; gap:6px; flex-shrink:0;">' +
            '<button class="abtn" type="button" onclick="openProfForm(' + pIdx + ')" style="padding:4px 9px; font-size:.78rem;">' + (kn ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
            '<button class="abtn del" type="button" onclick="askDeleteProf(' + pIdx + ')" style="padding:4px 9px; font-size:.78rem;">' + (kn ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
          '</div>' +
        '</div>' +
        (tel ? '<div style="margin-top:6px; display:flex; align-items:center; gap:6px; font-size:.84rem;">' + PHONE_SVG + '<a href="tel:' + tel + '" style="color:var(--ink); font-weight:600; text-decoration:none;">' + esc(p.contact) + '</a></div>' : '') +
      '</div>' +
    '</div>';
  }).join('') : '<div style="grid-column:1/-1; text-align:center; padding:26px 16px; background:rgba(255,255,255,0.7); border-radius:14px; border:1.5px dashed rgba(200,16,46,0.25); color:var(--ink-soft); font-size:.9rem;">' +
    (kn ? 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರಾಧ್ಯಾಪಕರ ವಿವರಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ.' : 'No professors or faculty members added yet.') +
  '</div>';

  container.innerHTML =
    '<div class="conclave-special-box">' +
      '<div style="position:absolute; top:-30px; right:-30px; width:180px; height:180px; background:radial-gradient(circle, rgba(255,196,0,0.28) 0%, transparent 70%); border-radius:50%; pointer-events:none;"></div>' +
      
      '<!-- Top Icon & Tagline -->' +
      '<div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:14px;">' +
        '<span style="font-size:1.75rem; line-height:1;">🏛️</span>' +
        '<span style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,196,0,0.24); color:#8E0C22; font-weight:800; font-size:.88rem; padding:6px 16px; border-radius:100px; border:1.5px solid rgba(200,16,46,0.22);">' +
          '✨ ನಮ್ಮ ನುಡಿ ನಮ್ಮ ಹೆಮ್ಮೆ' +
        '</span>' +
      '</div>' +

      '<!-- Title -->' +
      '<h2 style="font-size:clamp(1.75rem,3.4vw,2.35rem); margin:0 0 12px; color:var(--ink); font-weight:800; line-height:1.25;">' +
        (kn ? CONCLAVE_EVENT.titleKn : CONCLAVE_EVENT.titleEn) +
      '</h2>' +

      '<!-- Date / Time / Venue -->' +
      '<div style="display:flex; gap:10px 18px; flex-wrap:wrap; margin-bottom:18px; font-size:.92rem; font-weight:600; color:var(--ink);">' +
        '<span style="display:inline-flex; align-items:center; gap:6px; background:#fff; padding:6px 14px; border-radius:100px; border:1px solid rgba(200,16,46,0.18); box-shadow:0 2px 6px rgba(0,0,0,0.03);">📅 ' + (kn ? '೪ ನವೆಂಬರ್ ೨೦೨೬' : CONCLAVE_EVENT.date) + '</span>' +
        '<span style="display:inline-flex; align-items:center; gap:6px; background:#fff; padding:6px 14px; border-radius:100px; border:1px solid rgba(200,16,46,0.18); box-shadow:0 2px 6px rgba(0,0,0,0.03);">🕐 ' + (kn ? '೧೧:೩೦ AM – ೧೨:೦೦ PM' : CONCLAVE_EVENT.time) + '</span>' +
        '<span style="display:inline-flex; align-items:center; gap:6px; background:#fff; padding:6px 14px; border-radius:100px; border:1px solid rgba(200,16,46,0.18); box-shadow:0 2px 6px rgba(0,0,0,0.03);">📍 ' + (kn ? 'ಎಚ್‌ಕೆಬಿಕೆ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು' : CONCLAVE_EVENT.venue) + '</span>' +
      '</div>' +

      '<!-- Description -->' +
      '<p style="margin:0 0 26px; color:var(--ink-soft); font-size:1rem; line-height:1.72; max-width:980px;">' +
        (kn ? CONCLAVE_EVENT.descriptionKn : CONCLAVE_EVENT.descriptionEn) +
      '</p>' +

      '<!-- SPECIAL PROFESSOR SECTION -->' +
      '<div style="border-top:1.5px dashed rgba(200,16,46,0.25); padding-top:24px; margin-top:20px;">' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:12px;">' +
          '<div>' +
            '<h3 style="margin:0; font-size:1.32rem; color:var(--deepred); font-weight:800; display:flex; align-items:center; gap:8px;">' +
              '👨‍🏫 ' + (kn ? 'ವಿಟಿಯು ಕನ್ನಡ ಪ್ರಾಧ್ಯಾಪಕರ ಸಮಾವೇಶ' : 'VTU Kannada Faculty Conclave') +
            '</h3>' +
            '<div style="font-size:.85rem; color:var(--ink-soft); margin-top:3px;">' +
              (kn ? 'ವಿಟಿಯು ವ್ಯಾಪ್ತಿಯ ಕನ್ನಡ ಪ್ರಾಧ್ಯಾಪಕರು ಮತ್ತು ಅಧ್ಯಾಪಕ ವೃಂದ (' + conclaveProfessors.length + ')' : 'Recognising & honouring VTU Kannada Faculty (' + conclaveProfessors.length + ')') +
            '</div>' +
          '</div>' +
          '<button class="btn btn-dark admin-only-control" type="button" onclick="openProfForm(-1)" style="padding:9px 18px; font-size:.86rem; box-shadow:0 4px 12px rgba(200,16,46,0.2);">' +
            '+ ' + (kn ? 'ಪ್ರಾಧ್ಯಾಪಕರನ್ನು ಸೇರಿಸಿ' : 'Add Professor') +
          '</button>' +
        '</div>' +

        '<!-- Professor Cards Grid -->' +
        '<div class="prof-grid">' +
          profCardsHtml +
        '</div>' +
      '</div>' +

    '</div>';
}

function renderEventCards(){
  renderConclaveSection();
  var box = document.getElementById('eventsList'); if(!box) return;
  var normalList = events.filter(function(e){ return !isConclaveEvent(e); });

  box.innerHTML = normalList.length ? normalList.map(function(e){
    var realIdx = events.indexOf(e);
    return '<div class="evcard" onclick="openEvent(' + realIdx + ')">' +
      evImg(e) +
      '<div class="evbody">' +
        '<h4>' + evTitle(e) + '</h4>' +
        '<div class="evmeta">' +
          (e.date ? '<span>📅 ' + esc(e.date) + '</span>' : '') +
          (e.time ? '<span>🕐 ' + esc(e.time) + '</span>' : '') +
          (e.venue ? '<span>📍 ' + esc(e.venue) + '</span>' : '') +
        '</div>' +
        '<p class="evdesc">' + evDesc(e) + '</p>' +
        '<div class="evactions">' +
          '<button class="abtn" type="button" onclick="event.stopPropagation();openEventForm(' + realIdx + ')">' + (isKN() ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
          '<button class="abtn del" type="button" onclick="event.stopPropagation();askDelete(' + realIdx + ')">' + (isKN() ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('') : '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:18px 0;">' + (isKN() ? 'ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟಿಸಲಾಗುವುದು.' : 'Events will be announced soon.') + '</div>';

  if(currentEv >= 0) renderEventModal();
}

function renderEventModal(){
  var e=events[currentEv]; if(!e) return; var kn=isKN();
  var row=function(l,k,v){return v?'<div class="ev-row"><b>'+(kn?k:l)+'</b><span>'+esc(v)+'</span></div>':'';};

  var cs=(e.coordinators||[]).slice(0,5).map(function(c){
    var t=String(c.contact||'').replace(/[^0-9+]/g,'');
    return '<div class="coord"><div class="cic">'+PHONE_SVG+'</div><div class="cinfo"><div class="cn">'+esc(kn?(c.nameKn||c.nameEn):(c.nameEn||c.nameKn))+'</div>'+(t?'<a class="tel" href="tel:'+t+'">'+esc(c.contact)+'</a>':'')+'</div>'+(t?'<a class="callbtn" href="tel:'+t+'">'+(kn?'ಕರೆ ಮಾಡಿ':'Call')+'</a>':'')+'</div>';
  }).join('');

  var coordSectionHtml = '<div style="margin-top:24px; padding-top:20px; border-top:1.5px dashed var(--border);">' +
    '<h4 class="ev-sub" style="margin-top:0;">' + (kn ? 'ಕಾರ್ಯಕ್ರಮದ ಸಂಯೋಜಕರು' : 'Event Coordinators') + '</h4>' +
    (cs || '<p style="margin:0;color:var(--ink-soft);font-size:.9rem;">' + (kn ? 'ಸಂಯೋಜಕರ ವಿವರಗಳನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟಿಸಲಾಗುವುದು.' : 'Coordinator details will be announced soon.') + '</p>') +
  '</div>';

  document.getElementById('eventModalBody').innerHTML = evImg(e)+
    '<div class="ev-pad">' +
      '<h3 style="margin-top:0;">'+evTitle(e)+'</h3>' +
      row('Date','ದಿನಾಂಕ',e.date)+row('Time','ಸಮಯ',e.time)+row('Venue','ಸ್ಥಳ',e.venue)+
      '<p style="margin:14px 0 0;color:var(--ink-soft);line-height:1.65;font-size:.95rem;">'+evDesc(e)+'</p>' +
      coordSectionHtml +
    '</div>';
}

function openEvent(i){currentEv=i; renderEventModal(); document.getElementById('eventModal').classList.add('open');}
function closeEvent(){currentEv=-1; document.getElementById('eventModal').classList.remove('open');}
document.getElementById('eventModal').addEventListener('click',function(ev){if(ev.target===this) closeEvent();});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape') closeEvent();});

function gid(id){ return document.getElementById(id); }
function lab(en,kn){ return '<span class="en">'+en+'</span><span class="kn">'+kn+'</span>'; }

/* ---------- Professors CRUD for Karnataka Conclave ---------- */
var profEditIdx = -1, profPendingDel = -1, profPhotoData = '';

function openProfForm(idx){
  profEditIdx = idx;
  var p = (idx >= 0 && conclaveProfessors[idx]) ? conclaveProfessors[idx] : {};
  gid('profTitle').innerHTML = idx >= 0
    ? lab('Edit Professor', 'ಪ್ರಾಧ್ಯಾಪಕರ ವಿವರ ಸಂಪಾದಿಸಿ')
    : lab('Add Professor', 'ಪ್ರಾಧ್ಯಾಪಕರನ್ನು ಸೇರಿಸಿ');
  gid('profSave').innerHTML = idx >= 0
    ? lab('Save Changes', 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ')
    : lab('Save Professor', 'ಉಳಿಸಿ');

  gid('profNameEn').value = p.nameEn || '';
  gid('profNameKn').value = p.nameKn || '';
  gid('profRoleEn').value = p.roleEn || '';
  gid('profRoleKn').value = p.roleKn || '';
  gid('profCollegeEn').value = p.collegeEn || '';
  gid('profCollegeKn').value = p.collegeKn || '';
  gid('profContact').value = p.contact || '';
  profPhotoData = p.photo || '';
  showProfPhotoPreview();
  gid('profErr').style.display = 'none';
  gid('profFormModal').classList.add('open');
}

function closeProfForm(){
  gid('profFormModal').classList.remove('open');
}

function showProfPhotoPreview(){
  var wrap = gid('profPhotoWrap');
  var prev = gid('profPhotoPrev');
  if(profPhotoData){
    if(prev) prev.src = profPhotoData;
    if(wrap) wrap.style.display = 'block';
  } else {
    if(wrap) wrap.style.display = 'none';
    if(prev) prev.src = '';
  }
}

function clearProfPhoto(){
  profPhotoData = '';
  if(gid('profPhotoFile')) gid('profPhotoFile').value = '';
  showProfPhotoPreview();
}

function saveProfForm(){
  var v = function(id){ return gid(id) ? gid(id).value.trim() : ''; };
  if(!v('profNameEn') && !v('profNameKn')){
    var x = gid('profErr');
    x.textContent = isKN() ? 'ದಯವಿಟ್ಟು ಪ್ರಾಧ್ಯಾಪಕರ ಹೆಸರು ನಮೂದಿಸಿ.' : 'Please enter professor name.';
    x.style.display = 'block';
    return;
  }
  var obj = {
    nameEn: v('profNameEn'),
    nameKn: v('profNameKn'),
    roleEn: v('profRoleEn'),
    roleKn: v('profRoleKn'),
    collegeEn: v('profCollegeEn'),
    collegeKn: v('profCollegeKn'),
    contact: v('profContact'),
    photo: profPhotoData
  };

  var backup = JSON.stringify(conclaveProfessors);
  if(profEditIdx >= 0){
    conclaveProfessors[profEditIdx] = obj;
  } else {
    conclaveProfessors.push(obj);
  }

  if(!saveConclaveProfessors()){
    conclaveProfessors = JSON.parse(backup);
    var y = gid('profErr');
    y.textContent = isKN() ? 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಲಿಲ್ಲ.' : 'Could not save on this device.';
    y.style.display = 'block';
    return;
  }

  closeProfForm();
  renderConclaveSection();
}

function askDeleteProf(idx){
  profPendingDel = idx;
  gid('profConfirmModal').classList.add('open');
}

function closeProfConfirm(){
  profPendingDel = -1;
  gid('profConfirmModal').classList.remove('open');
}

function confirmDeleteProf(){
  if(profPendingDel >= 0){
    conclaveProfessors.splice(profPendingDel, 1);
    saveConclaveProfessors();
    renderConclaveSection();
  }
  closeProfConfirm();
}

gid('profFormModal').addEventListener('click', function(ev){ if(ev.target === this) closeProfForm(); });
gid('profConfirmModal').addEventListener('click', function(ev){ if(ev.target === this) closeProfConfirm(); });
document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape'){ closeProfForm(); closeProfConfirm(); } });
gid('profPhotoFile').addEventListener('change', function(){
  var f = this.files && this.files[0];
  if(!f) return;
  var fr = new FileReader();
  fr.onload = function(){
    var im = new Image();
    im.onload = function(){
      var w = Math.min(400, im.width), hgt = Math.round(im.height * w / im.width);
      var c = document.createElement('canvas');
      c.width = w; c.height = hgt;
      c.getContext('2d').drawImage(im, 0, 0, w, hgt);
      profPhotoData = c.toDataURL('image/jpeg', 0.75);
      showProfPhotoPreview();
    };
    im.src = fr.result;
  };
  fr.readAsDataURL(f);
});

var editIdx=-1, fImg='', fRows=[], pendingDel=-1;

/* ---------- English → Kannada translation ---------- */
var TITLE_MAP = [
  { re: /^(Dr\.|Dr)\s+/i, kn: 'ಡಾ. ' },
  { re: /^(Prof\.|Prof)\s+/i, kn: 'ಪ್ರೊ. ' },
  { re: /^(Sri|Shri|Mr\.|Mr)\s+/i, kn: 'ಶ್ರೀ ' },
  { re: /^(Smt\.|Smt|Mrs\.|Mrs|Ms\.|Ms)\s+/i, kn: 'ಶ್ರೀಮತಿ ' }
];

var ROLE_DICT = {
  "president": "ಅಧ್ಯಕ್ಷರು",
  "vice president": "ಉಪಾಧ್ಯಕ್ಷರು",
  "vice-president": "ಉಪಾಧ್ಯಕ್ಷರು",
  "secretary": "ಕಾರ್ಯದರ್ಶಿ",
  "gen secretary": "ಪ್ರಧಾನ ಕಾರ್ಯದರ್ಶಿ",
  "general secretary": "ಪ್ರಧಾನ ಕಾರ್ಯದರ್ಶಿ",
  "joint secretary": "ಜಂಟಿ ಕಾರ್ಯದರ್ಶಿ",
  "treasurer": "ಖಜಾಂಚಿ",
  "convener": "ಸಂಚಾಲಕರು",
  "convenor": "ಸಂಚಾಲಕರು",
  "co-convener": "ಸಹ-ಸಂಚಾಲಕರು",
  "co-convenor": "ಸಹ-ಸಂಚಾಲಕರು",
  "coordinator": "ಸಂಯೋಜಕರು",
  "co-coordinator": "ಸಹ-ಸಂಯೋಜಕರು",
  "student coordinator": "ವಿದ್ಯಾರ್ಥಿ ಸಂಯೋಜಕರು",
  "faculty coordinator": "ಅಧ್ಯಾಪಕ ಸಂಯೋಜಕರು",
  "management representative": "ನಿರ್ವಹಣಾ ಪ್ರತಿನಿಧಿ",
  "management representatives": "ನಿರ್ವಹಣಾ ಪ್ರತಿನಿಧಿಗಳು",
  "student representative": "ವಿದ್ಯಾರ್ಥಿ ಪ್ರತಿನಿಧಿ",
  "faculty representative": "ಅಧ್ಯಾಪಕ ಪ್ರತಿನಿಧಿ",
  "representative": "ಪ್ರತಿನಿಧಿ",
  "manager": "ವ್ಯವಸ್ಥಾಪಕರು",
  "managers": "ವ್ಯವಸ್ಥಾಪಕರು",
  "general manager": "ಸಾಮಾನ್ಯ ವ್ಯವಸ್ಥಾಪಕರು",
  "event manager": "ಕಾರ್ಯಕ್ರಮ ವ್ಯವಸ್ಥಾಪಕರು",
  "management committee member": "ಆಡಳಿತ ಸಮಿತಿ ಸದಸ್ಯರು",
  "student committee member": "ವಿದ್ಯಾರ್ಥಿ ಸಮಿತಿ ಸದಸ್ಯರು",
  "core member": "ಮುಖ್ಯ ಸದಸ್ಯರು",
  "committee member": "ಸಮಿತಿ ಸದಸ್ಯರು",
  "member": "ಸದಸ್ಯರು",
  "members": "ಸದಸ್ಯರು",
  "volunteer": "ಸ್ವಯಂಸೇವಕರು",
  "head volunteer": "ಮುಖ್ಯ ಸ್ವಯಂಸೇವಕರು",
  "advisor": "ಸಲಹೆಗಾರರು",
  "adviser": "ಸಲಹೆಗಾರರು",
  "chief advisor": "ಮುಖ್ಯ ಸಲಹೆಗಾರರು",
  "patron": "ಪೋಷಕರು",
  "chief patron": "ಮುಖ್ಯ ಪೋಷಕರು",
  "trustee": "ಟ್ರಸ್ಟಿ",
  "managing trustee": "ವ್ಯವಸ್ಥಾಪಕ ಟ್ರಸ್ಟಿ",
  "chairman": "ಅಧ್ಯಕ್ಷರು",
  "vice chairman": "ಉಪಾಧ್ಯಕ್ಷರು",
  "chairperson": "ಅಧ್ಯಕ್ಷರು",
  "vice chairperson": "ಉಪಾಧ್ಯಕ್ಷರು",
  "director": "ನಿರ್ದೇಶಕರು",
  "managing director": "ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರು",
  "principal": "ಪ್ರಾಂಶುಪಾಲರು",
  "vice principal": "ಉಪ ಪ್ರಾಂಶುಪಾಲರು",
  "dean": "ಡೀನ್",
  "professor": "ಪ್ರಾಧ್ಯಾಪಕರು",
  "associate professor": "ಸಹ ಪ್ರಾಧ್ಯಾಪಕರು",
  "assistant professor": "ಸಹಾಯಕ ಪ್ರಾಧ್ಯಾಪಕರು",
  "professor & head": "ಪ್ರಾಧ್ಯಾಪಕರು ಮತ್ತು ಮುಖ್ಯಸ್ಥರು",
  "professor and head": "ಪ್ರಾಧ್ಯಾಪಕರು ಮತ್ತು ಮುಖ್ಯಸ್ಥರು",
  "professor of kannada": "ಕನ್ನಡ ಪ್ರಾಧ್ಯಾಪಕರು",
  "kannada professor": "ಕನ್ನಡ ಪ್ರಾಧ್ಯಾಪಕರು",
  "kannada coordinator": "ಕನ್ನಡ ಸಂಯೋಜಕರು",
  "associate professor & kannada coordinator": "ಸಹ ಪ್ರಾಧ್ಯಾಪಕರು ಮತ್ತು ಕನ್ನಡ ಸಂಯೋಜಕರು",
  "associate professor and kannada coordinator": "ಸಹ ಪ್ರಾಧ್ಯಾಪಕರು ಮತ್ತು ಕನ್ನಡ ಸಂಯೋಜಕರು",
  "assistant professor of kannada": "ಕನ್ನಡ ಸಹಾಯಕ ಪ್ರಾಧ್ಯಾಪಕರು",
  "senior professor": "ಹಿರಿಯ ಪ್ರಾಧ್ಯಾಪಕರು",
  "senior lecturer": "ಹಿರಿಯ ಉಪನ್ಯಾಸಕರು",
  "guest lecturer": "ಅತಿಥಿ ಉಪನ್ಯಾಸಕರು",
  "guest faculty": "ಅತಿಥಿ ಬೋಧಕರು",
  "visiting professor": "ಸಂದರ್ಶಕ ಪ್ರಾಧ್ಯಾಪಕರು",
  "faculty": "ಅಧ್ಯಾಪಕರು",
  "kannada faculty": "ಕನ್ನಡ ಅಧ್ಯಾಪಕರು",
  "lecturer": "ಉಪನ್ಯಾಸಕರು",
  "hod": "ವಿಭಾಗ ಮುಖ್ಯಸ್ಥರು",
  "head of department": "ವಿಭಾಗ ಮುಖ್ಯಸ್ಥರು",
  "cultural coordinator": "ಸಾಂಸ್ಕೃತಿಕ ಸಂಯೋಜಕರು",
  "technical coordinator": "ತಾಂತ್ರಿಕ ಸಂಯೋಜಕರು",
  "sports coordinator": "ಕ್ರೀಡಾ ಸಂಯೋಜಕರು",
  "media coordinator": "ಮಾಧ್ಯಮ ಸಂಯೋಜಕರು",
  "stage coordinator": "ವೇದಿಕೆ ಸಂಯೋಜಕರು",
  "registration coordinator": "ನೋಂದಣಿ ಸಂಯೋಜಕರು",
  "hospitality coordinator": "ಆತಿಥ್ಯ ಸಂಯೋಜಕರು",
  "finance coordinator": "ಹಣಕಾಸು ಸಂಯೋಜಕರು",
  "discipline coordinator": "ಶಿಸ್ತು ಸಂಯೋಜಕರು",
  "lead": "ಮುಖ್ಯಸ್ಥರು",
  "team lead": "ತಂಡದ ಮುಖ್ಯಸ್ಥರು",
  "student": "ವಿದ್ಯಾರ್ಥಿ",
  "management": "ಆಡಳಿತ"
};

var ORG_DICT = {
  "vtu": "ವಿಟಿಯು",
  "vtu belagavi": "ವಿಟಿಯು ಬೆಳಗಾವಿ",
  "visvesvaraya technological university": "ವಿಶ್ವೇಶ್ವರಯ್ಯ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ",
  "visvesvaraya technological university (vtu)": "ವಿಶ್ವೇಶ್ವರಯ್ಯ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ (ವಿಟಿಯು)",
  "visvesvaraya technological university (vtu), belagavi": "ವಿಶ್ವೇಶ್ವರಯ್ಯ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ (ವಿಟಿಯು), ಬೆಳಗಾವಿ",
  "visvesvaraya technological university, belagavi": "ವಿಶ್ವೇಶ್ವರಯ್ಯ ತಾಂತ್ರಿಕ ವಿಶ್ವವಿದ್ಯಾಲಯ, ಬೆಳಗಾವಿ",
  "vtu center for pg studies": "ವಿಟಿಯು ಸ್ನಾತಕೋತ್ತರ ಕೇಂದ್ರ",
  "center for pg studies": "ಸ್ನಾತಕೋತ್ತರ ಅಧ್ಯಯನ ಕೇಂದ್ರ",
  "hkbk college of engineering": "ಎಚ್‌ಕೆಬಿಕೆ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು",
  "hkbk college of engineering, bengaluru": "ಎಚ್‌ಕೆಬಿಕೆ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು, ಬೆಂಗಳೂರು",
  "hkbk college of engineering, bangalore": "ಎಚ್‌ಕೆಬಿಕೆ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು, ಬೆಂಗಳೂರು",
  "bangalore institute of technology": "ಬೆಂಗಳೂರು ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್ ಆಫ್ ಟೆಕ್ನಾಲಜಿ",
  "bms college of engineering": "ಬಿಎಂಎಸ್ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು",
  "ms ramaiah institute of technology": "ಎಂ ಎಸ್ ರಾಮಯ್ಯ ತಾಂತ್ರಿಕ ಮಹಾವಿದ್ಯಾಲಯ",
  "r v college of engineering": "ಆರ್ ವಿ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು",
  "rv college of engineering": "ಆರ್ ವಿ ಎಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು",
  "university": "ವಿಶ್ವವಿದ್ಯಾಲಯ",
  "college": "ಕಾಲೇಜು",
  "institute": "ಸಂಸ್ಥೆ",
  "engineering": "ಎಂಜಿನಿಯರಿಂಗ್",
  "technology": "ತಂತ್ರಜ್ಞಾನ",
  "department of kannada": "ಕನ್ನಡ ಅಧ್ಯಯನ ವಿಭಾಗ",
  "kannada department": "ಕನ್ನಡ ವಿಭಾಗ"
};

var EVENT_DICT = {
  // Explicit examples requested by user
  "singing": "ಹಾಡುವುದು",
  "dancing": "ನೃತ್ಯ ಮಾಡುವುದು",
  "dance": "ನೃತ್ಯ",
  "song": "ಹಾಡು",
  "songs": "ಹಾಡುಗಳು",
  "quiz": "ಪ್ರಶ್ನೋತ್ತರ",
  "kannada quiz": "ಕನ್ನಡ ಪ್ರಶ್ನೋತ್ತರ",
  "dumb charades": "ಡಂಬ್ ಚರೇಡ್ಸ್",
  "dumb charade": "ಡಂಬ್ ಚರೇಡ್ಸ್",
  "charades": "ಚರೇಡ್ಸ್",
  "competition": "ಸ್ಪರ್ಧೆ",
  "competitions": "ಸ್ಪರ್ಧೆಗಳು",
  "contest": "ಸ್ಪರ್ಧೆ",
  "cultural program": "ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ",
  "cultural programs": "ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು",
  "cultural event": "ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ",
  "cultural events": "ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು",
  "cultural fest": "ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವ",
  "welcome": "ಸ್ವಾಗತ",
  "welcome speech": "ಸ್ವಾಗತ ಭಾಷಣ",

  // Specific sentence requested by user
  "test your knowledge of kannada language, culture and history": "ಕನ್ನಡ ಭಾಷೆ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಇತಿಹಾಸದ ಕುರಿತು ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ.",
  "test your knowledge of kannada language, culture and history.": "ಕನ್ನಡ ಭಾಷೆ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಇತಿಹಾಸದ ಕುರಿತು ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ.",

  // Conclave & Festival specific terms
  "karnataka conclave": "ಕರ್ನಾಟಕ ಕಾನ್ಕ್ಲೇವ್",
  "conclave": "ಕಾನ್ಕ್ಲೇವ್",
  "kannada rajyotsava": "ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ",
  "rajyotsava": "ರಾಜ್ಯೋತ್ಸವ",
  "kannada vaibhava": "ಕನ್ನಡ ವೈಭವ",
  "kannada saurabha": "ಕನ್ನಡ ಸೌರಭ",
  "inauguration": "ಉದ್ಘಾಟನೆ",
  "inaugural ceremony": "ಉದ್ಘಾಟನಾ ಸಮಾರಂಭ",
  "closing ceremony": "ಮುಕ್ತಾಯ ಸಮಾರಂಭ",
  "valedictory": "ಮುಕ್ತಾಯ ಸಮಾರಂಭ",
  "valedictory ceremony": "ಮುಕ್ತಾಯ ಸಮಾರಂಭ",
  "opening ceremony": "ಆರಂಭಿಕ ಸಮಾರಂಭ",
  "prize distribution": "ಬಹುಮಾನ ವಿತರಣೆ",
  "felicitation": "ಸನ್ಮಾನ ಸಮಾರಂಭ",
  "honoring": "ಗೌರವ ಸಮರ್ಪಣೆ",
  "vote of thanks": "ಧನ್ಯವಾದ ಸಮರ್ಪಣೆ",
  "national anthem": "ರಾಷ್ಟ್ರಗೀತೆ",
  "state anthem": "ನಾಡಗೀತೆ",
  "nada geethe": "ನಾಡಗೀತೆ",
  "prayer": "ಪ್ರಾರ್ಥನೆ",
  "prayer song": "ಪ್ರಾರ್ಥನಾ ಗೀತೆ",

  // Existing default event titles & descriptions
  "awards": "ಪ್ರಶಸ್ತಿಗಳು",
  "recognising outstanding community members": "ಗಮನಾರ್ಹ ಸಮುದಾಯ ಸದಸ್ಯರ ಗೌರವ.",
  "recognising outstanding community members.": "ಗಮನಾರ್ಹ ಸಮುದಾಯ ಸದಸ್ಯರ ಗೌರವ.",
  "children's programs": "ಮಕ್ಕಳ ಕಾರ್ಯಕ್ರಮಗಳು",
  "children programs": "ಮಕ್ಕಳ ಕಾರ್ಯಕ್ರಮಗಳು",
  "fun activities and performances for kids": "ಮಕ್ಕಳಿಗಾಗಿ ಮೋಜಿನ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಪ್ರದರ್ಶನಗಳು.",
  "fun activities and performances for kids.": "ಮಕ್ಕಳಿಗಾಗಿ ಮೋಜಿನ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಪ್ರದರ್ಶನಗಳು.",
  "community activities": "ಸಮುದಾಯ ಚಟುವಟಿಕೆಗಳು",
  "food stalls, games and get-togethers": "ಆಹಾರ ಮಳಿಗೆಗಳು, ಆಟಗಳು ಮತ್ತು ಸಮಾಗಮ.",
  "food stalls, games and get-togethers.": "ಆಹಾರ ಮಳಿಗೆಗಳು, ಆಟಗಳು ಮತ್ತು ಸಮಾಗಮ.",

  // Common college cultural events
  "drama": "ನಾಟಕ",
  "skit": "ಕಿರು ನಾಟಕ",
  "play": "ನಾಟಕ",
  "debate": "ಚರ್ಚಾ ಸ್ಪರ್ಧೆ",
  "debate competition": "ಚರ್ಚಾ ಸ್ಪರ್ಧೆ",
  "essay": "ಪ್ರಬಂಧ",
  "essay writing": "ಪ್ರಬಂಧ ರಚನೆ ಸ್ಪರ್ಧೆ",
  "essay competition": "ಪ್ರಬಂಧ ಸ್ಪರ್ಧೆ",
  "elocution": "ಭಾಷಣ ಸ್ಪರ್ಧೆ",
  "speech": "ಭಾಷಣ",
  "drawing": "ಚಿತ್ರಕಲೆ",
  "drawing competition": "ಚಿತ್ರಕಲೆ ಸ್ಪರ್ಧೆ",
  "painting": "ಚಿತ್ರಕಲೆ",
  "painting competition": "ಚಿತ್ರಕಲೆ ಸ್ಪರ್ಧೆ",
  "rangoli": "ರಂಗೋಲಿ",
  "rangoli competition": "ರಂಗೋಲಿ ಸ್ಪರ್ಧೆ",
  "folk dance": "ಜಾನಪದ ನೃತ್ಯ",
  "folk song": "ಜಾನಪದ ಗೀತೆ",
  "folk songs": "ಜಾನಪದ ಗೀತೆಗಳು",
  "classical dance": "ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯ",
  "classical music": "ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ",
  "music": "ಸಂಗೀತ",
  "musical night": "ಸಂಗೀತ ಸಂಜೆ",
  "orchestra": "ವಾದ್ಯಗೋಷ್ಠಿ",
  "standup comedy": "ಹಾಸ್ಯ ಕಾರ್ಯಕ್ರಮ",
  "mime": "ಮೂಕಾಭಿನಯ",
  "mono acting": "ಏಕಪಾತ್ರಾಭಿನಯ",
  "poetry": "ಕವನ",
  "poetry recitation": "ಕವನ ವಾಚನ",
  "kavi sammelana": "ಕವಿ ಸಮ್ಮೇಳನ",
  "fashion show": "ಸಾಂಪ್ರದಾಯಿಕ ವಸ್ತ್ರವಿನ್ಯಾಸ",
  "traditional dress": "ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಗೆ",
  "traditional day": "ಸಾಂಪ್ರದಾಯಿಕ ದಿನ",
  "exhibition": "ಪ್ರದರ್ಶನ",
  "treasure hunt": "ನಿಧಿ ಶೋಧ",
  "cooking without fire": "ಅಗ್ನಿ ರಹಿತ ಅಡುಗೆ ಸ್ಪರ್ಧೆ",
  "anthakshari": "ಅಂತಾಕ್ಷರಿ",
  "antyakshari": "ಅಂತಾಕ್ಷರಿ",
  "tug of war": "ಹಗ್ಗಜಗ್ಗಾಟ",
  "lunch": "ಮಧ್ಯಾಹ್ನದ ಊಟ",
  "dinner": "ರಾತ್ರಿಯ ಊಟ",
  "refreshments": "ಉಪಾಹಾರ",
  "tea break": "ಚಹಾ ವಿರಾಮ"
};

function offlineTransliterateToKn(text){
  if(!text) return "";
  var vowels = {
    "aa":"ಾ", "a":"", "ii":"ೀ", "ee":"ೀ", "i":"ಿ", "uu":"ೂ", "oo":"ೂ", "u":"ು",
    "ai":"ೈ", "au":"ೌ", "ou":"ೌ", "e":"ೆ", "o":"ೊ"
  };
  var initVowels = {
    "aa":"ಆ", "a":"ಅ", "ii":"ಈ", "ee":"ಈ", "i":"ಇ", "uu":"ಊ", "oo":"ಊ", "u":"ಉ",
    "ai":"ಐ", "au":"ಔ", "ou":"ಔ", "e":"ಎ", "o":"ಒ"
  };
  var consonants = [
    ["ksh", "ಕ್ಷ"], ["shh", "ಷ"], ["sh", "ಶ"], ["ch", "ಚ"], ["th", "ತ"], ["dh", "ಧ"],
    ["kh", "ಖ"], ["gh", "ಘ"], ["jh", "ಝ"], ["ph", "ಫ"], ["bh", "ಭ"], ["gn", "ಜ್ಞ"], ["jn", "ಜ್ಞ"],
    ["k", "ಕ"], ["g", "ಗ"], ["c", "ಕ"], ["j", "ಜ"], ["t", "ತ"], ["d", "ದ"], ["n", "ನ"],
    ["p", "ಪ"], ["f", "ಫ"], ["b", "ಬ"], ["m", "ಮ"], ["y", "ಯ"], ["r", "ರ"], ["l", "ಲ"],
    ["v", "ವ"], ["w", "ವ"], ["s", "ಸ"], ["h", "ಹ"], ["z", "ಜ"]
  ];
  return text.split(/(\s+)/).map(function(word){
    if(/^\s+$/.test(word)) return word;
    var w = word.toLowerCase();
    var out = "";
    var i = 0;
    while(i < w.length){
      var matchedCons = null;
      for(var c = 0; c < consonants.length; c++){
        var len = consonants[c][0].length;
        if(w.substr(i, len) === consonants[c][0]){
          matchedCons = consonants[c];
          break;
        }
      }
      if(matchedCons){
        i += matchedCons[0].length;
        var matchedVowel = null;
        var vKeys = ["aa", "ii", "ee", "uu", "oo", "ai", "au", "ou", "a", "i", "u", "e", "o"];
        for(var v = 0; v < vKeys.length; v++){
          var vlen = vKeys[v].length;
          if(w.substr(i, vlen) === vKeys[v]){
            matchedVowel = vKeys[v];
            break;
          }
        }
        if(matchedVowel){
          i += matchedVowel.length;
          out += matchedCons[1] + vowels[matchedVowel];
        } else {
          if(i < w.length && /[a-z]/i.test(w[i])){
            out += matchedCons[1] + "್";
          } else {
            out += matchedCons[1];
          }
        }
      } else {
        var matchedInitVowel = null;
        var initVKeys = ["aa", "ii", "ee", "uu", "oo", "ai", "au", "ou", "a", "i", "u", "e", "o"];
        for(var iv = 0; iv < initVKeys.length; iv++){
          var ivlen = initVKeys[iv].length;
          if(w.substr(i, ivlen) === initVKeys[iv]){
            matchedInitVowel = initVKeys[iv];
            break;
          }
        }
        if(matchedInitVowel){
          i += matchedInitVowel.length;
          out += initVowels[matchedInitVowel];
        } else {
          out += w[i];
          i++;
        }
      }
    }
    return out;
  }).join("");
}

function isPureEntity(text){
  var t = String(text || '').trim();
  // Pure URL
  if(/^https?:\/\/[^\s]+|www\.[^\s]+$/i.test(t)) return true;
  // Pure Phone (e.g. +91 98451 23456 or standard numbers)
  if(/^(?:\+?\d{1,4}[-.\s]*)?(?:\(?\d{2,5}\)?[-.\s]*)?\d{3,5}[-.\s]*\d{3,5}$/.test(t)) return true;
  // Pure Time (e.g. 10:00 AM, 11:30 - 1:00 PM, 9:00 AM – 10:00 AM)
  if(/^\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?(?:\s*[-–—]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?)?$/i.test(t)) return true;
  // Pure Date (e.g. 4 November 2026, 27 Oct, 27/10/2026)
  if(/^(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s*,?\s*\d{2,4})?|\d{1,4}[-\/.]\d{1,2}[-\/.]\d{1,4})$/i.test(t)) return true;
  return false;
}

function protectEntities(text){
  var items = [];
  var s = text;
  // URLs
  s = s.replace(/https?:\/\/[^\s<>"\']+|www\.[^\s<>"\']+/gi, function(m){
    items.push(m);
    return '__PROT_' + (items.length - 1) + '__';
  });
  // Phone numbers
  s = s.replace(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\+?\d{1,3}[-.\s]\(?\d{2,4}\)?[-.\s]\d{3,4}[-.\s]\d{3,4}/g, function(m){
    items.push(m);
    return '__PROT_' + (items.length - 1) + '__';
  });
  // Dates
  s = s.replace(/\b\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s*,?\s*\d{2,4})?\b/gi, function(m){
    items.push(m);
    return '__PROT_' + (items.length - 1) + '__';
  });
  // Times
  s = s.replace(/\b\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)\b|\b\d{1,2}:\d{2}\b/gi, function(m){
    items.push(m);
    return '__PROT_' + (items.length - 1) + '__';
  });
  return { protectedText: s, items: items };
}

function restoreEntities(text, items){
  var res = text;
  for(var i = 0; i < items.length; i++){
    var re = new RegExp('__\\s*PROT_' + i + '\\s*__', 'gi');
    res = res.replace(re, items[i]);
  }
  return res;
}

// ==================================================================
// PERSONAL NAME TRANSLITERATION ENGINE (Local Offline JavaScript)
// Converts English personal names into natural Kannada script transliteration
// ==================================================================
var NAME_INITIALS_MAP = {
  a: 'ಎ', b: 'ಬಿ', c: 'ಸಿ', d: 'ಡಿ', e: 'ಇ', f: 'ಎಫ್', g: 'ಜಿ', h: 'ಎಚ್',
  i: 'ಐ', j: 'ಜೆ', k: 'ಕೆ', l: 'ಎಲ್', m: 'ಎಂ', n: 'ಎನ್', o: 'ಒ', p: 'ಪಿ',
  q: 'ಕ್ಯೂ', r: 'ಆರ್', s: 'ಎಸ್', t: 'ಟಿ', u: 'ಯು', v: 'ವಿ', w: 'ಡಬ್ಲ್ಯೂ',
  x: 'ಎಕ್ಸ್', y: 'ವೈ', z: 'ಝಡ್'
};

var NAME_LOOKUP_DICT = {
  // Required examples
  "rahul": "ರಾಹುಲ್",
  "kumar": "ಕುಮಾರ್",
  "kumara": "ಕುಮಾರ",
  "kumari": "ಕುಮಾರಿ",
  "aishwarya": "ಐಶ್ವರ್ಯ",
  "priya": "ಪ್ರಿಯಾ",
  "suresh": "ಸುರೇಶ್",
  "ramesh": "ರಮೇಶ್",
  "anil": "ಅನಿಲ್",
  "shiva": "ಶಿವ",
  "shivakumar": "ಶಿವಕುಮಾರ್",
  "sivakumar": "ಶಿವಕುಮಾರ್",
  "vijay": "ವಿಜಯ್",
  "kiran": "ಕಿರಣ್",
  "ibrahim": "ಇಬ್ರಾಹಿಂ",
  "faiz": "ಫೈಜ್",

  // Common Indian/Kannada personal names
  "abhishek": "ಅಭಿಷೇಕ್",
  "adarsh": "ಆದರ್ಶ",
  "aditya": "ಆದಿತ್ಯ",
  "ajay": "ಅಜಯ್",
  "akash": "ಆಕಾಶ್",
  "akhil": "ಅಖಿಲ್",
  "amar": "ಅಮರ್",
  "amith": "ಅಮಿತ್",
  "amit": "ಅಮಿತ್",
  "anand": "ಆನಂದ್",
  "anitha": "ಅನಿತಾ",
  "anita": "ಅನಿತಾ",
  "anjali": "ಅಂಜಲಿ",
  "ankita": "ಅಂಕಿತಾ",
  "anoop": "ಅನೂಪ್",
  "anup": "ಅನೂಪ್",
  "anusha": "ಅನುಷಾ",
  "arun": "ಅರುಣ್",
  "aravind": "ಅರವಿಂದ್",
  "arvind": "ಅರವಿಂದ್",
  "archana": "ಅರ್ಚನಾ",
  "ashok": "ಅಶೋಕ್",
  "ashwini": "ಅಶ್ವಿನಿ",
  "avinash": "ಅವಿನಾಶ್",
  "balaji": "ಬಾಲಾಜಿ",
  "basavaraj": "ಬಸವರಾಜ್",
  "basavaraju": "ಬಸವರಾಜು",
  "bharath": "ಭರತ್",
  "bharat": "ಭರತ್",
  "bhaskar": "ಭಾಸ್ಕರ್",
  "bhavya": "ಭವ್ಯ",
  "bindu": "ಬಿಂದು",
  "chaithra": "ಚೈತ್ರಾ",
  "chaitra": "ಚೈತ್ರಾ",
  "chandana": "ಚಂದನಾ",
  "chandan": "ಚಂದನ್",
  "chandrashekar": "ಚಂದ್ರಶೇಖರ್",
  "chandrashekhar": "ಚಂದ್ರಶೇಖರ್",
  "chethan": "ಚೇತನ್",
  "chetan": "ಚೇತನ್",
  "chittaranjan": "ಚಿತ್ತರಂಜನ್",
  "darshan": "ದರ್ಶನ್",
  "deepa": "ದೀಪಾ",
  "deepak": "ದೀಪಕ್",
  "deeksha": "ದೀಕ್ಷಾ",
  "dhanush": "ಧನುಷ್",
  "dinesh": "ದಿನೇಶ್",
  "divya": "ದಿವ್ಯ",
  "ganesh": "ಗಣೇಶ್",
  "gangadhar": "ಗಂಗಾಧರ್",
  "gayathri": "ಗಾಯತ್ರಿ",
  "geetha": "ಗೀತಾ",
  "girish": "ಗಿರೀಶ್",
  "gopal": "ಗೋಪಾಲ್",
  "govind": "ಗೋವಿಂದ್",
  "guru": "ಗುರು",
  "gururaj": "ಗುರುರಾಜ್",
  "harish": "ಹರೀಶ್",
  "harsha": "ಹರ್ಷ",
  "hemanth": "ಹೇಮಂತ್",
  "jagadeesh": "ಜಗದೀಶ್",
  "jagadish": "ಜಗದೀಶ್",
  "jayanth": "ಜಯಂತ್",
  "kavitha": "ಕವಿತಾ",
  "kavya": "ಕಾವ್ಯ",
  "keerthi": "ಕೀರ್ತಿ",
  "kishore": "ಕಿಶೋರ್",
  "krishna": "ಕೃಷ್ಣ",
  "lakshmi": "ಲಕ್ಷ್ಮಿ",
  "madhu": "ಮಧು",
  "mahesh": "ಮಹೇಶ್",
  "mallikarjun": "ಮಲ್ಲಿಕಾರ್ಜುನ್",
  "manjunath": "ಮಂಜುನಾಥ್",
  "manjunatha": "ಮಂಜುನಾಥ",
  "manoj": "ಮನೋಜ್",
  "meghana": "ಮೇಘನ",
  "mohan": "ಮೋಹನ್",
  "murali": "ಮುರಳಿ",
  "nandini": "ನಂದಿನಿ",
  "narendra": "ನರೇಂದ್ರ",
  "naveen": "ನವೀನ್",
  "nikhil": "ನಿಖಿಲ್",
  "nirmala": "ನಿರ್ಮಲಾ",
  "nithin": "ನಿಥಿನ್",
  "nitin": "ನಿತಿನ್",
  "pallavi": "ಪಲ್ಲವಿ",
  "pavan": "ಪವನ್",
  "pooja": "ಪೂಜಾ",
  "pradeep": "ಪ್ರದೀಪ್",
  "prakash": "ಪ್ರಕಾಶ್",
  "pramod": "ಪ್ರಮೋದ್",
  "prasad": "ಪ್ರಸಾದ್",
  "prashanth": "ಪ್ರಶಾಂತ್",
  "praveen": "ಪ್ರವೀಣ್",
  "preethi": "ಪ್ರೀತಿ",
  "punith": "ಪುನೀತ್",
  "puneeth": "ಪುನೀತ್",
  "radha": "ರಾಧಾ",
  "raghu": "ರಘು",
  "rajesh": "ರಾಜೇಶ್",
  "raju": "ರಾಜು",
  "rakesh": "ರಾಕೇಶ್",
  "rakshith": "ರಕ್ಷಿತ್",
  "ramakrishna": "ರಾಮಕೃಷ್ಣ",
  "ravi": "ರವಿ",
  "ravichandran": "ರವಿಚಂದ್ರನ್",
  "rohit": "ರೋಹಿತ್",
  "roopa": "ರೂಪಾ",
  "sahana": "ಸಹನ",
  "sandhya": "ಸಂಧ್ಯಾ",
  "sandeep": "ಸಂದೀಪ್",
  "sanjay": "ಸಂಜಯ್",
  "santhosh": "ಸಂತೋಷ್",
  "santosh": "ಸಂತೋಷ್",
  "sarita": "ಸರಿತಾ",
  "satish": "ಸತೀಶ್",
  "shankar": "ಶಂಕರ್",
  "sharath": "ಶರತ್",
  "shilpa": "ಶಿಲ್ಪಾ",
  "shivaraj": "ಶಿವರಾಜ್",
  "shobha": "ಶೋಭಾ",
  "shruthi": "ಶ್ರುತಿ",
  "shruti": "ಶ್ರುತಿ",
  "sneha": "ಸ್ನೇಹಾ",
  "somesh": "ಸೋಮೇಶ್",
  "soumya": "ಸೌಮ್ಯ",
  "sudhir": "ಸುಧೀರ್",
  "suhas": "ಸುಹಾಸ್",
  "sujatha": "ಸುಜಾತಾ",
  "sunil": "ಸುನಿಲ್",
  "sushma": "ಸುಷ್ಮಾ",
  "swathi": "ಸ್ವಾತಿ",
  "tejas": "ತೇಜಸ್",
  "uma": "ಉಮಾ",
  "usha": "ಉಷಾ",
  "varun": "ವರುಣ್",
  "vasanth": "ವಸಂತ್",
  "venkatesh": "ವೆಂಕಟೇಶ್",
  "vidya": "ವಿದ್ಯಾ",
  "vignesh": "ವಿಘ್ನೇಶ್",
  "vikram": "ವಿಕ್ರಮ್",
  "vinay": "ವಿನಯ್",
  "vinod": "ವಿನೋದ್",
  "vishal": "ವಿಶಾಲ್",
  "vishnu": "ವಿಷ್ಣು",
  "yash": "ಯಶ್",
  "yashwanth": "ಯಶವಂತ್",

  // Surnames / titles
  "bhat": "ಭಟ್",
  "deshpande": "ದೇಶಪಾಂಡೆ",
  "gowda": "ಗೌಡ",
  "hegde": "ಹೆಗಡೆ",
  "hosmani": "ಹೊಸಮನಿ",
  "joshi": "ಜೋಷಿ",
  "kulkarni": "ಕುಲಕರ್ಣಿ",
  "murthy": "ಮೂರ್ತಿ",
  "nayak": "ನಾಯಕ್",
  "patil": "ಪಾಟೀಲ್",
  "poojary": "ಪೂಜಾರಿ",
  "rao": "ರಾವ್",
  "reddy": "ರೆಡ್ಡಿ",
  "sharma": "ಶರ್ಮಾ",
  "shetty": "ಶೆಟ್ಟಿ",
  "swamy": "ಸ್ವಾಮಿ"
};

var NAME_SUFFIXES = [
  { en: "kumar", kn: "ಕುಮಾರ್" }, { en: "kumara", kn: "ಕುಮಾರ" },
  { en: "prasad", kn: "ಪ್ರಸಾದ್" }, { en: "swamy", kn: "ಸ್ವಾಮಿ" },
  { en: "murthy", kn: "ಮೂರ್ತಿ" }, { en: "gowda", kn: "ಗೌಡ" },
  { en: "reddy", kn: "ರೆಡ್ಡಿ" }, { en: "shetty", kn: "ಶೆಟ್ಟಿ" },
  { en: "nayak", kn: "ನಾಯಕ್" }, { en: "rao", kn: "ರಾವ್" },
  { en: "nath", kn: "ನಾಥ್" }, { en: "raj", kn: "ರಾಜ್" },
  { en: "raju", kn: "ರಾಜು" }
];

function transliterateToken(token) {
  if (!token) return "";

  // 1. Single letter initial with dot: "C." -> "ಸಿ."
  var mInitDot = token.match(/^([a-z])\.$/i);
  if (mInitDot) {
    var c = mInitDot[1].toLowerCase();
    return (NAME_INITIALS_MAP[c] || token) + ".";
  }

  // 2. Dotted initials without space: "C.M." -> "ಸಿ.ಎಂ."
  if (/^([a-z]\.)+$/i.test(token)) {
    return token.replace(/([a-z])\./gi, function (match, ch) {
      var low = ch.toLowerCase();
      return (NAME_INITIALS_MAP[low] || ch) + ".";
    });
  }

  // 3. Standalone single letter: "C" -> "ಸಿ", "M" -> "ಎಂ"
  if (/^[a-z]$/i.test(token)) {
    var lowLetter = token.toLowerCase();
    return NAME_INITIALS_MAP[lowLetter] || token;
  }

  var clean = token.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return token;

  // 4. Exact dictionary lookup
  if (NAME_LOOKUP_DICT[clean]) {
    return NAME_LOOKUP_DICT[clean];
  }

  // 5. Compound suffix check (e.g. shivakumar -> shiva + kumar)
  for (var s = 0; s < NAME_SUFFIXES.length; s++) {
    var suf = NAME_SUFFIXES[s];
    if (clean.length > suf.en.length && clean.slice(-suf.en.length) === suf.en) {
      var pfx = clean.slice(0, clean.length - suf.en.length);
      if (NAME_LOOKUP_DICT[pfx]) {
        return NAME_LOOKUP_DICT[pfx] + suf.kn;
      }
    }
  }

  // 6. Rule-based phonetic transliteration fallback
  return ruleBasedTransliterate(clean);
}

function ruleBasedTransliterate(text) {
  var INDEP_VOWELS = {
    "aa": "ಆ", "a": "ಅ", "ee": "ಈ", "ii": "ಈ", "i": "ಇ",
    "oo": "ಊ", "uu": "ಊ", "u": "ಉ", "ai": "ಐ", "au": "ಔ",
    "ou": "ಔ", "e": "ಎ", "o": "ಒ"
  };

  var DEP_VOWELS = {
    "aa": "ಾ", "a": "", "ee": "ೀ", "ii": "ೀ", "i": "ಿ",
    "oo": "ೂ", "uu": "ೂ", "u": "ು", "ai": "ೈ", "au": "ೌ",
    "ou": "ೌ", "e": "ೆ", "o": "ೊ"
  };

  var CONSONANTS = [
    { en: "ksh", kn: "ಕ್ಷ" }, { en: "shh", kn: "ಷ" }, { en: "sh", kn: "ಶ" },
    { en: "chh", kn: "ಛ" }, { en: "ch", kn: "ಚ" }, { en: "th", kn: "ತ" },
    { en: "dh", kn: "ಧ" }, { en: "kh", kn: "ಖ" }, { en: "gh", kn: "ಘ" },
    { en: "jh", kn: "ಝ" }, { en: "ph", kn: "ಫ" }, { en: "bh", kn: "ಭ" },
    { en: "k", kn: "ಕ" }, { en: "g", kn: "ಗ" }, { en: "j", kn: "ಜ" },
    { en: "t", kn: "ಟ" }, { en: "d", kn: "ದ" }, { en: "n", kn: "ನ" },
    { en: "p", kn: "ಪ" }, { en: "f", kn: "ಫ" }, { en: "b", kn: "ಬ" },
    { en: "m", kn: "ಮ" }, { en: "y", kn: "ಯ" }, { en: "r", kn: "ರ" },
    { en: "l", kn: "ಲ" }, { en: "v", kn: "ವ" }, { en: "w", kn: "ವ" },
    { en: "s", kn: "ಸ" }, { en: "h", kn: "ಹ" }, { en: "z", kn: "ಝ" }
  ];

  var VOWEL_PATTERNS = ["aa", "ee", "ii", "oo", "uu", "ai", "au", "ou", "a", "i", "u", "e", "o"];
  var VIRAMA = "\u0CCD";
  var result = "";
  var i = 0;
  var n = text.length;

  while (i < n) {
    var matchedVowel = null;
    for (var v = 0; v < VOWEL_PATTERNS.length; v++) {
      var pat = VOWEL_PATTERNS[v];
      if (text.substr(i, pat.length) === pat) {
        matchedVowel = pat;
        break;
      }
    }

    if (matchedVowel && (i === 0 || result === "")) {
      result += INDEP_VOWELS[matchedVowel];
      i += matchedVowel.length;
      continue;
    }

    var matchedCons = null;
    for (var c = 0; c < CONSONANTS.length; c++) {
      var cpat = CONSONANTS[c].en;
      if (text.substr(i, cpat.length) === cpat) {
        matchedCons = CONSONANTS[c];
        break;
      }
    }

    if (matchedCons) {
      i += matchedCons.en.length;
      var followVowel = null;
      for (var fv = 0; fv < VOWEL_PATTERNS.length; fv++) {
        var vpat = VOWEL_PATTERNS[fv];
        if (text.substr(i, vpat.length) === vpat) {
          followVowel = vpat;
          break;
        }
      }

      if (followVowel) {
        result += matchedCons.kn + DEP_VOWELS[followVowel];
        i += followVowel.length;
      } else {
        result += matchedCons.kn + VIRAMA;
      }
    } else if (matchedVowel) {
      result += DEP_VOWELS[matchedVowel];
      i += matchedVowel.length;
    } else {
      i++;
    }
  }

  return result;
}

function transliterateNameToKannada(name) {
  if (!name || !name.trim()) return "";
  var tokens = name.trim().split(/(\s+)/);
  var out = [];
  for (var t = 0; t < tokens.length; t++) {
    var tok = tokens[t];
    if (/^\s+$/.test(tok)) {
      out.push(tok);
    } else {
      out.push(transliterateToken(tok));
    }
  }
  return out.join("");
}
window.transliterateNameToKannada = transliterateNameToKannada;

function translateText(text, hint, callback){
  var prefix = '';
  var cleanText = String(text || '').trim();
  if(!cleanText){
    callback('');
    return;
  }

  // 1. Do not translate pure dates, times, phone numbers or URLs
  if(isPureEntity(cleanText)){
    callback(cleanText);
    return;
  }

  // 2. Check title/honorific prefix
  for(var t = 0; t < TITLE_MAP.length; t++){
    var m = cleanText.match(TITLE_MAP[t].re);
    if(m){
      prefix = TITLE_MAP[t].kn;
      cleanText = cleanText.replace(TITLE_MAP[t].re, '').trim();
      break;
    }
  }

  if(!cleanText){
    callback(prefix.trim());
    return;
  }

  var lower = cleanText.toLowerCase();
  var lowerClean = lower.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();

  // 3. Exact dictionary lookup
  if(EVENT_DICT[lower] || EVENT_DICT[lowerClean]){
    callback(prefix + (EVENT_DICT[lower] || EVENT_DICT[lowerClean]));
    return;
  }
  if(ROLE_DICT[lower] || ROLE_DICT[lowerClean]){
    callback(prefix + (ROLE_DICT[lower] || ROLE_DICT[lowerClean]));
    return;
  }
  if(ORG_DICT[lower] || ORG_DICT[lowerClean]){
    callback(prefix + (ORG_DICT[lower] || ORG_DICT[lowerClean]));
    return;
  }

  // Multi-word role dictionary check
  if(hint === 'role'){
    var parts = lowerClean.split(/\s+/);
    if(parts.length > 1){
      var translatedParts = [];
      var allFound = true;
      for(var p = 0; p < parts.length; p++){
        if(ROLE_DICT[parts[p]]){
          translatedParts.push(ROLE_DICT[parts[p]]);
        } else {
          allFound = false;
          break;
        }
      }
      if(allFound){
        callback(prefix + translatedParts.join(' '));
        return;
      }
    }
  }

  // Helper: Google Input Tools (Phonetic Transliteration - ONLY FOR NAMES!)
  function tryInputTools(onSuccess, onFail){
    var cbName = '__kn_itc_' + Math.floor(Math.random() * 10000000);
    var timeoutId;
    var scriptEl = null;

    var cleanup = function(){
      if(timeoutId) clearTimeout(timeoutId);
      try { delete window[cbName]; } catch(e){}
      if(scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
    };

    window[cbName] = function(res){
      cleanup();
      try {
        if(res && res[0] === 'SUCCESS' && res[1] && res[1][0] && res[1][0][1] && res[1][0][1][0]){
          onSuccess(res[1][0][1][0]);
          return;
        }
      } catch(e){}
      onFail();
    };

    timeoutId = setTimeout(function(){
      cleanup();
      onFail();
    }, 4500);

    try {
      scriptEl = document.createElement('script');
      scriptEl.src = 'https://inputtools.google.com/request?text=' + encodeURIComponent(cleanText) + '&itc=kn-t-i0-und&num=1&cb=' + cbName;
      scriptEl.onerror = function(){
        cleanup();
        onFail();
      };
      document.head.appendChild(scriptEl);
    } catch(e){
      cleanup();
      onFail();
    }
  }

  // Helper: Google Translate GTX endpoint (Real Semantic Meaning Translation)
  function tryGoogleGtx(queryText, onSuccess, onFail){
    if(typeof fetch === 'undefined'){ onFail(); return; }
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=kn&dt=t&q=' + encodeURIComponent(queryText);
    fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(data){
        var translated = '';
        if(data && data[0]){
          data[0].forEach(function(seg){ if(seg && seg[0]) translated += seg[0]; });
        }
        if(translated && translated.trim()){
          onSuccess(translated.trim());
        } else {
          onFail();
        }
      })
      .catch(function(){
        onFail();
      });
  }

  // Helper: MyMemory API (Real Semantic Meaning Translation)
  function tryMyMemory(queryText, onSuccess, onFail){
    if(typeof fetch === 'undefined'){ onFail(); return; }
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(queryText) + '&langpair=en|kn';
    fetch(url)
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d && d.responseData && d.responseData.translatedText){
          var res = String(d.responseData.translatedText).trim();
          if(res && res.toLowerCase() !== queryText.toLowerCase() && !res.toLowerCase().includes('quota') && !res.toLowerCase().includes('limit') && !res.toLowerCase().includes('http')){
            onSuccess(res);
            return;
          }
        }
        onFail();
      })
      .catch(function(){
        onFail();
      });
  }

  // 4. Branch based on hint:
  if(hint === 'name'){
    // When a role/title phrase was entered in the name field, use meaningful translation
    if(ROLE_DICT[lower] || ROLE_DICT[lowerClean]){
      callback(prefix + (ROLE_DICT[lower] || ROLE_DICT[lowerClean]));
      return;
    }
    // Check composite multi-word role
    var parts = lowerClean.split(/\s+/);
    if(parts.length > 1){
      var transParts = [];
      var allPartsFound = true;
      for(var pi = 0; pi < parts.length; pi++){
        if(parts[pi] === 'of' || parts[pi] === 'the' || parts[pi] === 'in') continue;
        if(ROLE_DICT[parts[pi]]){
          transParts.push(ROLE_DICT[parts[pi]]);
        } else {
          allPartsFound = false;
          break;
        }
      }
      if(allPartsFound && transParts.length > 0){
        callback(prefix + transParts.join(' '));
        return;
      }
    }
    // Convert personal name into natural Kannada-script transliteration
    callback(prefix + transliterateNameToKannada(cleanText));
    return;
  } else {
    // REAL ENGLISH -> KANNADA MEANING TRANSLATION (NO TRANSLITERATION!)
    // Protect embedded dates, times, phone numbers, and URLs
    var prot = protectEntities(cleanText);
    tryGoogleGtx(prot.protectedText, function(res){
      var restored = restoreEntities(res, prot.items);
      callback(prefix + restored);
    }, function(){
      tryMyMemory(prot.protectedText, function(res){
        var restored = restoreEntities(res, prot.items);
        callback(prefix + restored);
      }, function(){
        // Last resort: check if any individual words exist in dictionaries
        var words = lowerClean.split(/\s+/);
        var partial = [];
        var anyFound = false;
        for(var w = 0; w < words.length; w++){
          var wordTrans = EVENT_DICT[words[w]] || ROLE_DICT[words[w]] || ORG_DICT[words[w]];
          if(wordTrans){
            partial.push(wordTrans);
            anyFound = true;
          } else {
            partial.push(words[w]);
          }
        }
        if(anyFound){
          callback(prefix + restoreEntities(partial.join(' '), prot.items));
        } else {
          // Fallback cleanly to preserve text so administrator can edit
          callback(prefix + cleanText);
        }
      });
    });
  }
}

function translateField(srcId, tgtId, hint, btn){
  if(srcId === 'cmContact' || tgtId === 'cmContact') return;
  var srcEl = gid(srcId);
  var tgtEl = gid(tgtId);
  if(!srcEl || !tgtEl) return;
  var text = srcEl.value.trim();
  if(!text){
    showTranslateErr(srcEl, isKN() ? 'ದಯವಿಟ್ಟು ಮೊದಲು ಇಂಗ್ಲಿಷ್ ಪಠ್ಯವನ್ನು ನಮೂದಿಸಿ.' : 'Please enter English text first.');
    try { srcEl.focus(); } catch(e){}
    return;
  }

  /* find the button that was clicked (passed via onclick or discover it) */
  if(!btn && typeof event !== 'undefined' && event){
    btn = (event.currentTarget && event.currentTarget.classList && event.currentTarget.classList.contains('btn-translate'))
      ? event.currentTarget
      : (event.target ? event.target.closest('.btn-translate') : null);
  }
  if(!btn){
    var p = tgtEl.previousElementSibling;
    if(p) btn = p.querySelector('.btn-translate');
  }

  /* spinner state */
  var origText = '';
  if(btn){
    btn.disabled = true;
    origText = btn.innerHTML;
    btn.innerHTML = '⏳ <span class="en">Translating...</span><span class="kn">ಅನುವಾದಿಸಲಾಗುತ್ತಿದೆ...</span>';
  }

  translateText(text, hint, function(translated){
    if(btn){
      btn.disabled = false;
      if(origText) btn.innerHTML = origText;
    }

    if(translated){
      tgtEl.value = translated;
      /* flash animation */
      tgtEl.classList.remove('fld-translated');
      void tgtEl.offsetWidth; /* reflow */
      tgtEl.classList.add('fld-translated');
      tgtEl.addEventListener('animationend', function(){ tgtEl.classList.remove('fld-translated'); }, {once:true});
    } else {
      showTranslateErr(tgtEl, isKN() ? 'ಅನುವಾದ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಿ.' : 'Translation unavailable. Please type manually.');
    }
  });
}

function translateCoordRow(i, btn){
  if(!fRows[i] || !fRows[i].nameEn) return;
  var text = fRows[i].nameEn.trim();
  if(!text) return;
  var orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '⏳';
  translateText(text, 'name', function(translated){
    btn.disabled = false;
    btn.innerHTML = orig;
    if(translated){
      fRows[i].nameKn = translated;
      renderCoordRows();
    }
  });
}

function showTranslateErr(field, msg){
  if(!field) return;
  /* red border + tooltip */
  field.style.borderColor = 'var(--red)';
  field.title = msg;

  /* Show in modal form error container if available */
  var modal = field.closest ? field.closest('.modal-overlay') : null;
  var formErr = modal ? modal.querySelector('#fErr, #profErr, #cmErr, #pkErr, #gmErr, #vmErr, #galErr') : null;
  if(formErr){
    formErr.textContent = msg;
    formErr.style.display = 'block';
  }

  /* Show visible inline tip directly below the field */
  var parent = field.parentNode;
  if(parent){
    var tip = parent.querySelector('.translate-tip');
    if(!tip){
      tip = document.createElement('div');
      tip.className = 'translate-tip';
      tip.style.cssText = 'color:var(--red); font-size:.82rem; margin-top:4px; font-weight:600; line-height:1.3;';
      parent.appendChild(tip);
    }
    tip.textContent = msg;
    tip.style.display = 'block';
  }

  var clearErr = function(){
    field.style.borderColor = '';
    field.title = '';
    if(parent){
      var t = parent.querySelector('.translate-tip');
      if(t) t.style.display = 'none';
    }
    if(formErr && formErr.textContent === msg){
      formErr.style.display = 'none';
    }
  };

  field.addEventListener('input', clearErr, {once:true});
  setTimeout(clearErr, 4500);
}
function renderCoordRows(){
  gid('fCoords').innerHTML=fRows.map(function(r,i){
    return '<div class="crow"><input class="fld" type="text" placeholder="Name (English)" value="'+esc(r.nameEn)+'" oninput="fRows['+i+'].nameEn=this.value"><input class="fld" type="text" placeholder="ಹೆಸರು (ಕನ್ನಡ)" value="'+esc(r.nameKn)+'" oninput="fRows['+i+'].nameKn=this.value"><button type="button" class="btn-translate" onclick="translateCoordRow('+i+',this)" title="Translate name to Kannada">🌐</button><input class="fld" type="tel" placeholder="+91 XXXXX XXXXX" value="'+esc(r.contact)+'" oninput="fRows['+i+'].contact=this.value"><button type="button" onclick="removeCoordRow('+i+')" aria-label="Remove">✕</button></div>';
  }).join('');
  gid('fCount').textContent='('+fRows.length+'/5)';
  gid('fAddCoord').style.display=fRows.length>=5?'none':'inline';
}
function addCoordRow(){if(fRows.length>=5) return; fRows.push({nameEn:'',nameKn:'',contact:''}); renderCoordRows();}
function removeCoordRow(i){fRows.splice(i,1); renderCoordRows();}
function showFormImage(){gid('fImgWrap').style.display=fImg?'block':'none'; if(fImg) gid('fImgPrev').src=fImg;}
function clearFormImage(){fImg=''; gid('fImageFile').value=''; showFormImage();}
function openEventForm(i){
  editIdx=i; var e=i>=0?events[i]:{};
  gid('fTitle').innerHTML=i>=0?lab('Edit Event','ಕಾರ್ಯಕ್ರಮ ಸಂಪಾದಿಸಿ'):lab('Add Event','ಕಾರ್ಯಕ್ರಮ ಸೇರಿಸಿ');
  gid('fSave').innerHTML=i>=0?lab('Save Changes','ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ'):lab('Save Event','ಕಾರ್ಯಕ್ರಮ ಉಳಿಸಿ');
  gid('fTitleEn').value=e.titleEn||''; gid('fTitleKn').value=e.titleKn||'';
  gid('fDate').value=e.date||''; gid('fTime').value=e.time||''; gid('fVenue').value=e.venue||'';
  gid('fDescEn').value=e.descriptionEn||''; gid('fDescKn').value=e.descriptionKn||'';
  fImg=e.image||''; gid('fImageFile').value=''; showFormImage();
  fRows=(e.coordinators||[]).slice(0,5).map(function(c){return {nameEn:c.nameEn||'',nameKn:c.nameKn||'',contact:c.contact||''};});
  renderCoordRows(); gid('fErr').style.display='none';
  gid('eventFormModal').classList.add('open');
}
function closeEventForm(){gid('eventFormModal').classList.remove('open');}
function formError(en,kn){var x=gid('fErr'); x.textContent=isKN()?kn:en; x.style.display='block';}
function saveEventForm(){
  var v=function(id){return gid(id).value.trim();};
  if(!v('fTitleEn')&&!v('fTitleKn')){formError('Please enter an event name.','ದಯವಿಟ್ಟು ಕಾರ್ಯಕ್ರಮದ ಹೆಸರು ನಮೂದಿಸಿ.'); return;}
  var obj={titleEn:v('fTitleEn'),titleKn:v('fTitleKn'),date:v('fDate'),time:v('fTime'),venue:v('fVenue'),descriptionEn:v('fDescEn'),descriptionKn:v('fDescKn'),image:fImg,
    coordinators:fRows.filter(function(r){return r.nameEn.trim()||r.nameKn.trim()||r.contact.trim();}).slice(0,5).map(function(r){return {nameEn:r.nameEn.trim(),nameKn:r.nameKn.trim(),contact:r.contact.trim()};})};
  var backup=JSON.stringify(events);
  if(editIdx>=0) events[editIdx]=Object.assign({},events[editIdx],obj); else events.push(Object.assign({icon:'🎭'},obj));
  if(!saveEvents()){events=JSON.parse(backup); formError('Could not save on this device (storage full). Try a smaller image.','ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಲಿಲ್ಲ (ಸಂಗ್ರಹಣೆ ತುಂಬಿದೆ). ಚಿಕ್ಕ ಚಿತ್ರ ಬಳಸಿ.'); return;}
  closeEventForm(); renderEventCards();
}
function askDelete(i){pendingDel=i; gid('confirmModal').classList.add('open');}
function closeConfirm(){pendingDel=-1; gid('confirmModal').classList.remove('open');}
function confirmDelete(){
  if(pendingDel>=0){closeEvent(); events.splice(pendingDel,1); saveEvents(); renderEventCards();}
  closeConfirm();
}
gid('confirmModal').addEventListener('click',function(ev){if(ev.target===this) closeConfirm();});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape'){closeEventForm(); closeConfirm();}});
gid('fImageFile').addEventListener('change',function(){
  var f=this.files&&this.files[0]; if(!f) return;
  var fr=new FileReader();
  fr.onload=function(){
    var im=new Image();
    im.onload=function(){
      var w=Math.min(800,im.width), hgt=Math.round(im.height*w/im.width);
      var c=document.createElement('canvas'); c.width=w; c.height=hgt;
      c.getContext('2d').drawImage(im,0,0,w,hgt);
      fImg=c.toDataURL('image/jpeg',0.72); showFormImage();
    };
    im.src=fr.result;
  };
  fr.readAsDataURL(f);
});

var cmIdx = -1, cmPending = -1, cmType = 'student', currentCommittee = null;

function mName(m){return esc(isKN()?(m.nameKn||m.nameEn):(m.nameEn||m.nameKn));}
function mRole(m){return esc(isKN()?(m.roleKn||m.roleEn):(m.roleEn||m.roleKn));}

function updateCommitteeTabsVisual(){
  var sTab = gid('btnStudentTab');
  var mTab = gid('btnMgmtTab');

  var applyActive = function(btn){
    if(!btn) return;
    btn.classList.add('active');
    btn.classList.remove('inactive');
    btn.setAttribute('aria-selected', 'true');
    btn.style.setProperty('background', 'linear-gradient(135deg, #C8102E 0%, #8E0C22 100%)', 'important');
    btn.style.setProperty('color', '#ffffff', 'important');
    btn.style.setProperty('border', '3px solid #FFC400', 'important');
    btn.style.setProperty('box-shadow', '0 12px 28px -4px rgba(200, 16, 46, 0.55), 0 0 0 3px rgba(255, 196, 0, 0.4)', 'important');
    btn.style.setProperty('transform', 'translateY(-2px)', 'important');
  };

  var applyInactive = function(btn){
    if(!btn) return;
    btn.classList.remove('active');
    btn.classList.add('inactive');
    btn.setAttribute('aria-selected', 'false');
    btn.style.setProperty('background', '#ffffff', 'important');
    btn.style.setProperty('color', '#241209', 'important');
    btn.style.setProperty('border', '2.5px solid rgba(142, 12, 34, 0.25)', 'important');
    btn.style.setProperty('box-shadow', '0 4px 14px rgba(0, 0, 0, 0.06)', 'important');
    btn.style.setProperty('transform', 'none', 'important');
  };

  if(!currentCommittee){
    applyInactive(sTab);
    applyInactive(mTab);
  } else if(currentCommittee === 'student'){
    applyActive(sTab);
    applyInactive(mTab);
  } else if(currentCommittee === 'management'){
    applyActive(mTab);
    applyInactive(sTab);
  }
}

function selectCommittee(type){
  var normalized = (type === 'management' || type === 'mgmt') ? 'management' : 'student';
  if(currentCommittee === normalized){
    // Toggle: if currently active button is clicked, CLOSE the section
    currentCommittee = null;
  } else {
    currentCommittee = normalized;
  }

  updateCommitteeTabsVisual();
  renderCommitteeSection();
}

function renderCommitteeSection(){
  var area = gid('committeeContentArea');
  if(!area) return;
  var kn = isKN();

  updateCommitteeTabsVisual();

  // State 1: Nothing selected yet on page load or toggled off -> empty
  if(!currentCommittee){
    area.innerHTML = '';
    return;
  }

  // State 2: Student Committee Selected
  if(currentCommittee === 'student'){
    var studentCardsHtml = members.length ? members.map(function(m, i){
      var t = String(m.contact || '').replace(/[^0-9+]/g, '');
      return '<div class="mcard">' +
        '<h4>' + mName(m) + '</h4>' +
        (mRole(m) ? '<div class="mrole">' + mRole(m) + '</div>' : '') +
        (t ? '<div class="mtel">' + PHONE_SVG + '<a href="tel:' + t + '">' + esc(m.contact) + '</a></div>' : '') +
        '<div class="evactions">' +
          '<button class="abtn" type="button" onclick="openMemberForm(' + i + ', \'student\')">' + (kn ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
          '<button class="abtn del" type="button" onclick="askDeleteMember(' + i + ', \'student\')">' + (kn ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
        '</div>' +
      '</div>';
    }).join('') : '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:36px 20px;background:#fff;border-radius:var(--r-md);border:1.5px dashed var(--border);font-size:1.05rem;font-weight:600;">' +
      (kn ? 'ವಿದ್ಯಾರ್ಥಿ ಸಮಿತಿ ಸದಸ್ಯರ ಪಟ್ಟಿಯನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಇಲ್ಲಿ ಪ್ರಕಟಿಸಲಾಗುವುದು.' : 'No student committee members added yet.') +
    '</div>';

    area.innerHTML = '<div class="admin-only-control" style="display:flex; justify-content:flex-end; margin-bottom:24px;">' +
      '<button class="btn btn-dark" type="button" onclick="openMemberForm(-1, \'student\')">+ ' +
        '<span class="en">Add Student Committee Member</span>' +
        '<span class="kn">ವಿದ್ಯಾರ್ಥಿ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ</span>' +
      '</button>' +
    '</div>' +
    '<div class="cardgrid egrid" id="membersGrid">' + studentCardsHtml + '</div>';
    return;
  }

  // State 3: Management Committee Selected
  if(currentCommittee === 'management'){
    var mgmtCardsHtml = mgmtMembers.length ? mgmtMembers.map(function(m, i){
      var t = String(m.contact || '').replace(/[^0-9+]/g, '');
      return '<div class="mcard">' +
        '<h4>' + mName(m) + '</h4>' +
        (mRole(m) ? '<div class="mrole">' + mRole(m) + '</div>' : '') +
        (t ? '<div class="mtel">' + PHONE_SVG + '<a href="tel:' + t + '">' + esc(m.contact) + '</a></div>' : '') +
        '<div class="evactions">' +
          '<button class="abtn" type="button" onclick="openMgmtMemberForm(' + i + ')">' + (kn ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
          '<button class="abtn del" type="button" onclick="askDeleteMgmtMember(' + i + ')">' + (kn ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
        '</div>' +
      '</div>';
    }).join('') : '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:36px 20px;background:#fff;border-radius:var(--r-md);border:1.5px dashed var(--border);font-size:1.05rem;font-weight:600;">' +
      (kn ? 'ಯಾವುದೇ ಆಡಳಿತ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಇನ್ನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ.' : 'No management committee members added yet.') +
    '</div>';

    area.innerHTML = '<div class="admin-only-control" style="display:flex; justify-content:flex-end; margin-bottom:24px;">' +
      '<button class="btn btn-dark" type="button" onclick="openMgmtMemberForm(-1)">+ ' +
        '<span class="en">Add Management Committee Member</span>' +
        '<span class="kn">ಆಡಳಿತ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ</span>' +
      '</button>' +
    '</div>' +
    '<div class="cardgrid egrid" id="mgmtMembersGrid">' + mgmtCardsHtml + '</div>';
    return;
  }
}

// Backward compatibility helpers
function renderMemberCards(){ renderCommitteeSection(); }
function renderMgmtMemberCards(){ renderCommitteeSection(); }
function switchCommitteeTab(type){ selectCommittee(type); }

function openMemberForm(i, type){
  cmIdx = i;
  cmType = type || (currentCommittee || 'student');
  var isMgmt = (cmType === 'management' || cmType === 'mgmt');
  var list = isMgmt ? mgmtMembers : members;
  var m = (i >= 0 && list && list[i]) ? list[i] : {};

  if(isMgmt){
    gid('cmTitle').innerHTML = i >= 0 ? lab('Edit Management Committee Member','ಆಡಳಿತ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಸಂಪಾದಿಸಿ') : lab('Add Management Committee Member','ಆಡಳಿತ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ');
  } else {
    gid('cmTitle').innerHTML = i >= 0 ? lab('Edit Student Committee Member','ವಿದ್ಯಾರ್ಥಿ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಸಂಪಾದಿಸಿ') : lab('Add Student Committee Member','ವಿದ್ಯಾರ್ಥಿ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ');
  }

  gid('cmSave').innerHTML = i >= 0 ? lab('Save Changes','ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ') : lab('Save','ಉಳಿಸಿ');
  gid('cmNameEn').value = m.nameEn || '';
  gid('cmNameKn').value = m.nameKn || '';
  gid('cmRoleEn').value = m.roleEn || '';
  gid('cmRoleKn').value = m.roleKn || '';
  gid('cmContact').value = m.contact || '';
  gid('cmErr').style.display = 'none';
  gid('memberFormModal').classList.add('open');
}

function openMgmtMemberForm(i){
  openMemberForm(i, 'management');
}

function closeMemberForm(){
  gid('memberFormModal').classList.remove('open');
}

function saveMemberForm(){
  var v = function(id){ return gid(id).value.trim(); };
  if(!v('cmNameEn') && !v('cmNameKn')){
    var x = gid('cmErr');
    x.textContent = isKN() ? 'ದಯವಿಟ್ಟು ಹೆಸರು ನಮೂದಿಸಿ.' : 'Please enter a name.';
    x.style.display = 'block';
    return;
  }
  var obj = {
    nameEn: v('cmNameEn'),
    nameKn: v('cmNameKn'),
    roleEn: v('cmRoleEn'),
    roleKn: v('cmRoleKn'),
    contact: v('cmContact')
  };

  var isMgmt = (cmType === 'management' || cmType === 'mgmt');
  if(isMgmt){
    var backup = JSON.stringify(mgmtMembers);
    if(cmIdx >= 0) mgmtMembers[cmIdx] = obj; else mgmtMembers.push(obj);
    if(!saveMgmtMembers()){
      mgmtMembers = JSON.parse(backup);
      var y = gid('cmErr');
      y.textContent = isKN() ? 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಲಿಲ್ಲ.' : 'Could not save on this device.';
      y.style.display = 'block';
      return;
    }
    closeMemberForm();
    renderCommitteeSection();
  } else {
    var backup = JSON.stringify(members);
    if(cmIdx >= 0) members[cmIdx] = obj; else members.push(obj);
    if(!saveMembers()){
      members = JSON.parse(backup);
      var y = gid('cmErr');
      y.textContent = isKN() ? 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಲಿಲ್ಲ.' : 'Could not save on this device.';
      y.style.display = 'block';
      return;
    }
    closeMemberForm();
    renderCommitteeSection();
  }
}

function askDeleteMember(i, type){
  cmPending = i;
  cmType = type || (currentCommittee || 'student');
  var isMgmt = (cmType === 'management' || cmType === 'mgmt');
  var confEl = gid('cmConfirmText');
  if(confEl){
    confEl.innerHTML = isMgmt
      ? lab('Are you sure you want to delete this management committee member?', 'ನೀವು ಈ ಆಡಳಿತ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?')
      : lab('Are you sure you want to delete this committee member?', 'ನೀವು ಈ ಸಮಿತಿ ಸದಸ್ಯರನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?');
  }
  gid('memberConfirmModal').classList.add('open');
}

function askDeleteMgmtMember(i){
  askDeleteMember(i, 'management');
}

function closeMemberConfirm(){
  cmPending = -1;
  gid('memberConfirmModal').classList.remove('open');
}

function confirmDeleteMember(){
  if(cmPending >= 0){
    var isMgmt = (cmType === 'management' || cmType === 'mgmt');
    if(isMgmt){
      mgmtMembers.splice(cmPending, 1);
      saveMgmtMembers();
      renderCommitteeSection();
    } else {
      members.splice(cmPending, 1);
      saveMembers();
      renderCommitteeSection();
    }
  }
  closeMemberConfirm();
}

gid('memberFormModal').addEventListener('click', function(ev){ if(ev.target === this) closeMemberForm(); });
gid('memberConfirmModal').addEventListener('click', function(ev){ if(ev.target === this) closeMemberConfirm(); });
document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape'){ closeMemberForm(); closeMemberConfirm(); } });

/* ---------- sponsorship packages ---------- */
const DEFAULT_PACKAGES = [
  {
    id: "pkg-title-sponsor",
    nameEn: "Title Sponsor",
    nameKn: "ಶೀರ್ಷಿಕೆ ಪ್ರಾಯೋಜಕರು (Title Sponsor)",
    amountEn: "₹1,00,000",
    amountKn: "₹೧,೦೦,೦೦೦",
    descEn: "Become the principal sponsor of Kannada Saurabha 2026 with premium brand visibility throughout the event.",
    descKn: "ಸಂಪೂರ್ಣ ಕಾರ್ಯಕ್ರಮದಾದ್ಯಂತ ಪ್ರೀಮಿಯಂ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯೊಂದಿಗೆ ಕನ್ನಡ ಸೌರಭ ೨೦೨೬ ರ ಮುಖ್ಯ ಪ್ರಾಯೋಜಕರಾಗಿ.",
    benefitsEn: "Brand name associated with the event — “Kannada Saurabha 2026, Powered by [Brand Name]”\nPremium logo placement on the main event poster\nProminent branding on the main stage/backdrop\nPremium banners across the event venue\nBrand mention by the emcee during the event\nDedicated social media promotion\nOpportunity to set up a promotional stall\nOpportunity to distribute promotional materials/samples\nLogo on digital creatives\nSpecial acknowledgement during the event\nCertificate/appreciation from the organising committee",
    benefitsKn: "ಕಾರ್ಯಕ್ರಮದೊಂದಿಗೆ ಸಂಸ್ಥೆಯ ಹೆಸರು — “ಕನ್ನಡ ಸೌರಭ ೨೦೨೬, Powered by [Brand Name]”\nಮುಖ್ಯ ಕಾರ್ಯಕ್ರಮದ ಪೋಸ್ಟರ್‌ನಲ್ಲಿ ಪ್ರಮುಖ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಮುಖ್ಯ ವೇದಿಕೆ ಮತ್ತು ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಪ್ರಮುಖ ಬ್ರ್ಯಾಂಡಿಂಗ್\nಕಾರ್ಯಕ್ರಮದ ಆವರಣದಾದ್ಯಂತ ಪ್ರೀಮಿಯಂ ಬ್ಯಾನರ್‌ಗಳು\nಕಾರ್ಯಕ್ರಮದ ನಿರೂಪಕರಿಂದ ಸಂಸ್ಥೆಯ ಹೆಸರಿನ ಉಲ್ಲೇಖ\nಮೀಸಲಾದ ಸಾಮಾಜಿಕ ಜಾಲತಾಣ ಪ್ರಚಾರ\nಪ್ರಚಾರ ಮಳಿಗೆ (Stall) ಸ್ಥಾಪಿಸಲು ಅವಕಾಶ\nಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳು/ಮಾದರಿಗಳನ್ನು ವಿತರಿಸುವ ಅವಕಾಶ\nಡಿಜಿಟಲ್ ಪೋಸ್ಟರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ವಿಶೇಷ ಕೃತಜ್ಞತೆ ಮತ್ತು ಸನ್ಮಾನ\nಸಂಘಟನಾ ಸಮಿತಿಯಿಂದ ಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ",
    order_index: 0
  },
  {
    id: "pkg-platinum-sponsor",
    nameEn: "Platinum Sponsor",
    nameKn: "ಪ್ಲಾಟಿನಂ ಪ್ರಾಯೋಜಕರು (Platinum Sponsor)",
    amountEn: "₹50,000",
    amountKn: "₹೫೦,೦೦೦",
    descEn: "A premium sponsorship opportunity offering prominent brand visibility across the event.",
    descKn: "ಕಾರ್ಯಕ್ರಮದಾದ್ಯಂತ ಪ್ರಮುಖ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯನ್ನು ಒದಗಿಸುವ ಪ್ರೀಮಿಯಂ ಪ್ರಾಯೋಜಕತ್ವದ ಅವಕಾಶ.",
    benefitsEn: "Prominent logo placement on event creatives\nStage/venue branding\nMultiple banner placements\nSocial media promotion\nBrand mention during the event\nPromotional stall opportunity\nDistribution of promotional materials\nLogo on selected digital promotions\nCertificate/appreciation",
    benefitsKn: "ಕಾರ್ಯಕ್ರಮದ ಕ್ರಿಯೇಟಿವ್‌ಗಳಲ್ಲಿ ಪ್ರಮುಖ ಲೋಗೋ ಪ್ರದರ್ಶನ\nವೇದಿಕೆ ಮತ್ತು ಆವರಣದಲ್ಲಿ ಬ್ರ್ಯಾಂಡಿಂಗ್\nಹಲವಾರು ಸ್ಥಳಗಳಲ್ಲಿ ಬ್ಯಾನರ್ ಪ್ರದರ್ಶನ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಪ್ರಚಾರ\nಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ಸಂಸ್ಥೆಯ ಉಲ್ಲೇಖ\nಪ್ರಚಾರ ಮಳಿಗೆ (Stall) ಸ್ಥಾಪಿಸಲು ಅವಕಾಶ\nಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳ ವಿತರಣೆ\nಆಯ್ದ ಡಿಜಿಟಲ್ ಪ್ರಚಾರಗಳಲ್ಲಿ ಲೋಗೋ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ",
    order_index: 1
  },
  {
    id: "pkg-gold-sponsor",
    nameEn: "Gold Sponsor",
    nameKn: "ಚಿನ್ನದ ಪ್ರಾಯೋಜಕರು (Gold Sponsor)",
    amountEn: "₹25,000",
    amountKn: "₹೨೫,೦೦೦",
    descEn: "Gain valuable brand exposure among students and event attendees through event and promotional branding.",
    descKn: "ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಪ್ರಚಾರ ಬ್ರ್ಯಾಂಡಿಂಗ್ ಮೂಲಕ ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕರಲ್ಲಿ ಮೌಲ್ಯಯುತ ಪ್ರಚಾರ ಪಡೆಯಿರಿ.",
    benefitsEn: "Logo placement on event banners\nLogo on selected promotional creatives\nSocial media mention\nBrand acknowledgement during the event\nPromotional stall opportunity, subject to venue availability\nDistribution of promotional materials\nCertificate/appreciation",
    benefitsKn: "ಕಾರ್ಯಕ್ರಮದ ಬ್ಯಾನರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಆಯ್ದ ಪ್ರಚಾರ ಪೋಸ್ಟರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಉಲ್ಲೇಖ\nಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಸಂಸ್ಥೆಯ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ\nಸ್ಥಳಾವಕಾಶಕ್ಕೆ ಒಳಪಟ್ಟು ಪ್ರಚಾರ ಮಳಿಗೆ ಅವಕಾಶ\nಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳ ವಿತರಣೆ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ",
    order_index: 2
  },
  {
    id: "pkg-silver-sponsor",
    nameEn: "Silver Sponsor",
    nameKn: "ಬೆಳ್ಳಿ ಪ್ರಾಯೋಜಕರು (Silver Sponsor)",
    amountEn: "₹10,000",
    amountKn: "₹೧೦,೦೦೦",
    descEn: "Support Kannada Saurabha 2026 while receiving meaningful brand visibility during the celebration.",
    descKn: "ಸಂಭ್ರಮಾಚರಣೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಥಪೂರ್ಣ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯನ್ನು ಪಡೆಯುವುದರೊಂದಿಗೆ ಕನ್ನಡ ಸೌರಭ ೨೦೨೬ ಅನ್ನು ಬೆಂಬಲಿಸಿ.",
    benefitsEn: "Logo placement on event banner\nLogo on selected digital creatives\nSocial media acknowledgement\nSponsor acknowledgement during the event\nCertificate/appreciation",
    benefitsKn: "ಕಾರ್ಯಕ್ರಮದ ಬ್ಯಾನರ್‌ನಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಆಯ್ದ ಡಿಜಿಟಲ್ ಕ್ರಿಯೇಟಿವ್‌ಗಳಲ್ಲಿ ಲೋಗೋ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಕೃತಜ್ಞತೆ\nಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಪ್ರಾಯೋಜಕರ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ",
    order_index: 3
  },
  {
    id: "pkg-associate-sponsor",
    nameEn: "Associate Sponsor",
    nameKn: "ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರು (Associate Sponsor)",
    amountEn: "₹5,000",
    amountKn: "₹೫,೦೦೦",
    descEn: "Support the celebration while receiving recognition as an associate sponsor.",
    descKn: "ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರಾಗಿ ಮನ್ನಣೆ ಪಡೆಯುವುದರೊಂದಿಗೆ ಸಂಭ್ರಮಾಚರಣೆಯನ್ನು ಬೆಂಬಲಿಸಿ.",
    benefitsEn: "Logo placement with associate sponsors\nSocial media acknowledgement\nEvent acknowledgement\nCertificate/appreciation",
    benefitsKn: "ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರೊಂದಿಗೆ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಕೃತಜ್ಞತೆ\nಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ",
    order_index: 4
  }
];

const PKG_STORAGE_VERSION = 'v4_5official_sponsorship_pkgs';
let packages = DEFAULT_PACKAGES;
try{
  var savedVer = localStorage.getItem('kv_packages_ver');
  var rawLocal = localStorage.getItem('kv_packages_v1');
  if(savedVer === PKG_STORAGE_VERSION && rawLocal){
    var _pk = JSON.parse(rawLocal);
    if(Array.isArray(_pk) && _pk.length > 0){
      packages = _pk;
    } else {
      packages = DEFAULT_PACKAGES;
      localStorage.setItem('kv_packages_v1', JSON.stringify(DEFAULT_PACKAGES));
      localStorage.setItem('kv_packages_ver', PKG_STORAGE_VERSION);
    }
  } else {
    // If upgrading from older version, preserve any custom edits made by admin while updating to the 5 official packages
    var existingList = [];
    try { existingList = JSON.parse(rawLocal) || []; } catch(e){}
    if (Array.isArray(existingList) && existingList.length) {
      packages = DEFAULT_PACKAGES.map(function(official, idx) {
        var match = existingList.find(function(ex) {
          return (ex.nameEn || '').toLowerCase() === official.nameEn.toLowerCase();
        });
        if (match) {
          return {
            id: match.id || official.id,
            nameEn: official.nameEn,
            nameKn: official.nameKn,
            amountEn: official.amountEn,
            amountKn: official.amountKn,
            descEn: match.descEn || official.descEn,
            descKn: match.descKn || official.descKn,
            benefitsEn: official.benefitsEn,
            benefitsKn: official.benefitsKn,
            order_index: idx
          };
        }
        return Object.assign({}, official, { order_index: idx });
      });
    } else {
      packages = DEFAULT_PACKAGES;
    }
    localStorage.setItem('kv_packages_v1', JSON.stringify(packages));
    localStorage.setItem('kv_packages_ver', PKG_STORAGE_VERSION);
  }
}catch(e){
  packages = DEFAULT_PACKAGES;
}

function savePackages(){
  try{
    localStorage.setItem('kv_packages_v1', JSON.stringify(packages));
    localStorage.setItem('kv_packages_ver', PKG_STORAGE_VERSION);
    return true;
  }catch(e){
    return false;
  }
}

window.addEventListener('storage', function(e) {
  if (e.key === 'kv_venue_v1' || e.key === 'kv_sponsor_contact_v1') {
    try {
      if (e.key === 'kv_venue_v1' && e.newValue) venueData = JSON.parse(e.newValue);
      if (e.key === 'kv_sponsor_contact_v1' && e.newValue) sponsorContact = JSON.parse(e.newValue);
      renderSponsorContact();
      renderVenue();
    } catch(err){}
  }
  if (e.key === 'kv_packages_v1' && e.newValue) {
    try {
      var updated = JSON.parse(e.newValue);
      if (Array.isArray(updated) && updated.length > 0) {
        packages = updated;
        renderPackageCards();
      }
    } catch(err){}
  }
});

function pkName(p){return esc(isKN() ? (p.nameKn || p.nameEn) : (p.nameEn || p.nameKn));}
function pkAmount(p){return esc(isKN() ? (p.amountKn || p.amountEn) : (p.amountEn || p.amountKn));}
function pkDesc(p){return esc(isKN() ? (p.descKn || p.descEn) : (p.descEn || p.descKn));}
function pkBenefitsList(p){
  var raw = isKN() ? (p.benefitsKn || p.benefitsEn) : (p.benefitsEn || p.benefitsKn);
  if(!raw) return [];
  return String(raw).split('\n').map(function(s){return s.trim();}).filter(Boolean);
}

function renderPackageCards(){
  var box = gid('packagesList');
  if(!box) return;
  var kn = isKN();
  if(!packages.length){
    box.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:24px 0;">' +
      (kn ? 'ಯಾವುದೇ ಪ್ರಾಯೋಜಕತ್ವ ಪ್ಯಾಕೇಜ್ ಲಭ್ಯವಿಲ್ಲ. ಹೊಸ ಪ್ಯಾಕೇಜ್ ಸೇರಿಸಲು "+ ಪ್ರಾಯೋಜಕತ್ವ ಪ್ಯಾಕೇಜ್ ಸೇರಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.' : 'No sponsorship packages available. Click "+ Add Sponsorship Package" to create one.') +
      '</div>';
    return;
  }

  box.innerHTML = packages.map(function(p, i){
    var bList = pkBenefitsList(p);
    var benefitsHtml = bList.length ?
      '<ul class="pkg-benefits">' + bList.map(function(b){ return '<li><span>' + esc(b) + '</span></li>'; }).join('') + '</ul>' :
      '<ul class="pkg-benefits"><li style="color:var(--ink-soft);font-style:italic;">' + (kn ? 'ವಿವರಗಳು ಶೀಘ್ರದಲ್ಲೇ ಲಭ್ಯವಾಗಲಿವೆ' : 'Details available upon request') + '</li></ul>';

    return '<div class="pkg-card" onclick="openPackageDetails(' + i + ')">' +
      '<div class="pkg-head">' +
        '<h3>' + pkName(p) + '</h3>' +
        '<div class="pkg-amount">' + (pkAmount(p) || '[ADD AMOUNT]') + '</div>' +
      '</div>' +
      '<p class="pkg-desc">' + pkDesc(p) + '</p>' +
      benefitsHtml +
      '<div class="pkg-actions">' +
        '<button type="button" class="btn btn-dark" style="width:100%; justify-content:center; padding:10px 14px; font-size:.9rem;" onclick="event.stopPropagation(); openSponsorContact(' + i + ')">' +
          '<span class="en">Sponsor / Contact Us</span><span class="kn">ಪ್ರಾಯೋಜಕರಾಗಿ / ಸಂಪರ್ಕಿಸಿ</span>' +
        '</button>' +
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">' +
          '<button type="button" class="abtn" style="padding:4px 12px; font-size:.78rem;" onclick="event.stopPropagation(); openPackageDetails(' + i + ')">' +
            (kn ? 'ವಿವರಗಳು' : 'Details') +
          '</button>' +
          '<div class="evactions" style="margin-top:0;">' +
            '<button type="button" class="abtn" onclick="event.stopPropagation(); openPackageForm(' + i + ')">' + (kn ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
            '<button type="button" class="abtn del" onclick="event.stopPropagation(); askDeletePackage(' + i + ')">' + (kn ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* Package Details Modal */
function openPackageDetails(i){
  var p = packages[i];
  if(!p) return;
  var kn = isKN();
  var bList = pkBenefitsList(p);
  var body = gid('pkgDetailsModalBody');
  body.innerHTML = '<div class="ev-pad">' +
    '<div class="eyebrow">' + (kn ? 'ಪ್ರಾಯೋಜಕತ್ವ ಹಂತ' : 'Sponsorship Tier') + '</div>' +
    '<h3 style="margin:0 0 6px;">' + pkName(p) + '</h3>' +
    '<div style="font-size:1.4rem; font-weight:800; color:var(--red); margin-bottom:14px;">' + (pkAmount(p) || '[ADD AMOUNT]') + '</div>' +
    '<p style="color:var(--ink-soft); line-height:1.6; margin-bottom:20px;">' + pkDesc(p) + '</p>' +
    '<h4 class="ev-sub" style="margin-top:16px;">' + (kn ? 'ಒಳಗೊಂಡಿರುವ ಪ್ರಯೋಜನಗಳು' : 'Included Benefits') + '</h4>' +
    (bList.length ?
      '<ul class="pkg-benefits" style="margin-bottom:24px;">' + bList.map(function(b){ return '<li><span>' + esc(b) + '</span></li>'; }).join('') + '</ul>' :
      '<p style="color:var(--ink-soft); font-size:.9rem;">' + (kn ? 'ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ವಿವರಗಳಿಲ್ಲ.' : 'Custom benefits negotiable.') + '</p>') +
    '<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:20px;">' +
      '<button type="button" class="btn btn-dark" style="flex:1; justify-content:center;" onclick="closePackageDetails(); openSponsorContact(' + i + ')">' +
        (kn ? 'ಈ ಹಂತವನ್ನು ಪ್ರಾಯೋಜಿಸಿ / ಸಂಪರ್ಕಿಸಿ' : 'Sponsor This Tier / Contact Us') +
      '</button>' +
      '<button type="button" class="btn" style="background:#fff; border:1.5px solid var(--border); color:var(--ink-soft);" onclick="closePackageDetails()">' +
        (kn ? 'ಮುಚ್ಚಿ' : 'Close') +
      '</button>' +
    '</div>' +
  '</div>';
  gid('pkgDetailsModal').classList.add('open');
}
function closePackageDetails(){
  gid('pkgDetailsModal').classList.remove('open');
}

/* Package Add/Edit Form */
var pkIdx = -1;
function openPackageForm(i){
  pkIdx = i;
  var p = i >= 0 ? packages[i] : {};
  gid('pkTitle').innerHTML = i >= 0 ? lab('Edit Sponsorship Package', 'ಪ್ರಾಯೋಜಕತ್ವ ಪ್ಯಾಕೇಜ್ ಸಂಪಾದಿಸಿ') : lab('Add Sponsorship Package', 'ಪ್ರಾಯೋಜಕತ್ವ ಪ್ಯಾಕೇಜ್ ಸೇರಿಸಿ');
  gid('pkSave').innerHTML = i >= 0 ? lab('Save Changes', 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ') : lab('Save Package', 'ಪ್ಯಾಕೇಜ್ ಉಳಿಸಿ');
  gid('pkNameEn').value = p.nameEn || '';
  gid('pkNameKn').value = p.nameKn || '';
  gid('pkAmountEn').value = p.amountEn || '';
  gid('pkAmountKn').value = p.amountKn || '';
  gid('pkDescEn').value = p.descEn || '';
  gid('pkDescKn').value = p.descKn || '';
  gid('pkBenefitsEn').value = p.benefitsEn || '';
  gid('pkBenefitsKn').value = p.benefitsKn || '';
  gid('pkErr').style.display = 'none';
  gid('pkgFormModal').classList.add('open');
}
function closePackageForm(){
  gid('pkgFormModal').classList.remove('open');
}
function savePackageForm(){
  var v = function(id){ return gid(id).value.trim(); };
  var nameEn = v('pkNameEn'), nameKn = v('pkNameKn');
  if(!nameEn && !nameKn){
    var err = gid('pkErr');
    err.textContent = isKN() ? 'ದಯವಿಟ್ಟು ಪ್ಯಾಕೇಜ್ ಹೆಸರು ನಮೂದಿಸಿ.' : 'Please enter a package name.';
    err.style.display = 'block';
    return;
  }
  var obj = {
    nameEn: nameEn,
    nameKn: nameKn,
    amountEn: v('pkAmountEn') || '[ADD AMOUNT]',
    amountKn: v('pkAmountKn') || (v('pkAmountEn') || '[ಮೊತ್ತ ಸೇರಿಸಿ]'),
    descEn: v('pkDescEn'),
    descKn: v('pkDescKn'),
    benefitsEn: v('pkBenefitsEn'),
    benefitsKn: v('pkBenefitsKn')
  };
  var backup = JSON.stringify(packages);
  if(pkIdx >= 0) packages[pkIdx] = obj; else packages.push(obj);
  if(!savePackages()){
    packages = JSON.parse(backup);
    var err2 = gid('pkErr');
    err2.textContent = isKN() ? 'ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಲಿಲ್ಲ.' : 'Could not save on this device.';
    err2.style.display = 'block';
    return;
  }
  closePackageForm();
  renderPackageCards();
}

/* Package Delete */
var pkPendingDel = -1;
function askDeletePackage(i){
  pkPendingDel = i;
  gid('pkgConfirmModal').classList.add('open');
}
function closePackageConfirm(){
  pkPendingDel = -1;
  gid('pkgConfirmModal').classList.remove('open');
}
function confirmDeletePackage(){
  if(pkPendingDel >= 0){
    packages.splice(pkPendingDel, 1);
    savePackages();
    renderPackageCards();
  }
  closePackageConfirm();
}

/* Sponsor Contact Modal */
function openSponsorContact(i){
  var kn = isKN();
  var p = (i >= 0 && packages[i]) ? packages[i] : null;
  var selBox = gid('scSelectedPkg');
  var pkgNameEl = gid('scPkgName');
  if(p){
    selBox.style.display = 'block';
    pkgNameEl.textContent = pkName(p) + ' (' + (pkAmount(p) || '[ADD AMOUNT]') + ')';
  } else {
    selBox.style.display = 'none';
  }
  renderSponsorContact();
  gid('sponsorContactModal').classList.add('open');
}
function closeSponsorContact(){
  gid('sponsorContactModal').classList.remove('open');
}

/* ---------- editable sponsorship contact details ---------- */
const DEFAULT_SPONSOR_CONTACT = {
  venue: "HKBK College of Engineering",
  address: "",
  date: "4 November 2026",
  time: "9:00 AM onwards",
  phone: "9980321527",
  email: "jaipalreddy9980321527@gmail.com"
};

let sponsorContact = DEFAULT_SPONSOR_CONTACT;
try{
  var _sc = JSON.parse(localStorage.getItem('kv_sponsor_contact_v1'));
  if(_sc && typeof _sc === 'object') sponsorContact = Object.assign({}, DEFAULT_SPONSOR_CONTACT, _sc);
}catch(e){}

if(!sponsorContact.phone || sponsorContact.phone === '[ADD CONTACT NUMBER]'){
  sponsorContact.phone = '9980321527';
}
if(!sponsorContact.email || sponsorContact.email === '[ADD EMAIL]'){
  sponsorContact.email = 'jaipalreddy9980321527@gmail.com';
}

function saveSponsorContact(){
  try{
    localStorage.setItem('kv_sponsor_contact_v1', JSON.stringify(sponsorContact));
    return true;
  }catch(e){
    return false;
  }
}

function renderFooterContact(){
  /* Contact information is strictly restricted to the Sponsorship page only */
}

function renderSponsorContact(){
  var kn = isKN();
  var venueLabel = kn ? 'ಸ್ಥಳ' : 'Venue';
  var dateTimeLabel = kn ? 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ' : 'Date & Time';
  var phoneLabel = kn ? 'ದೂರವಾಣಿ' : 'Phone';
  var emailLabel = kn ? 'ಇಮೇಲ್' : 'Email';

  var venueVal = (sponsorContact && sponsorContact.venue) ? sponsorContact.venue : 'HKBK College of Engineering';
  var addressPart = (sponsorContact && sponsorContact.address && sponsorContact.address.trim() && sponsorContact.address.trim() !== '[ADD ADDRESS]') ?
    ' · ' + esc(sponsorContact.address.trim()) : '';
  var venueFull = esc(venueVal) + addressPart;

  var dateVal = (sponsorContact && sponsorContact.date) ? sponsorContact.date : '4 November 2026';
  var timeVal = (sponsorContact && sponsorContact.time && sponsorContact.time.trim()) ? ' · ' + esc(sponsorContact.time.trim()) : ' · 9:00 AM onwards';
  var dateTimeFull = esc(dateVal) + timeVal;

  var currentPhone = (venueData && venueData.phone && venueData.phone !== '+91 98450 00000' && venueData.phone !== '[ADD CONTACT NUMBER]') ?
    venueData.phone : ((sponsorContact && sponsorContact.phone && sponsorContact.phone.trim() && sponsorContact.phone !== '[ADD CONTACT NUMBER]') ? sponsorContact.phone : '9980321527');

  var currentEmail = (venueData && venueData.email && venueData.email !== 'info@hkbk.edu.in' && venueData.email !== '[ADD EMAIL]') ?
    venueData.email : ((sponsorContact && sponsorContact.email && sponsorContact.email.trim() && sponsorContact.email !== '[ADD EMAIL]') ? sponsorContact.email : 'jaipalreddy9980321527@gmail.com');

  var telLink = String(currentPhone).replace(/[^0-9+]/g, '');
  var phoneHtml = '<a href="tel:' + esc(telLink) + '" style="color:var(--red); font-weight:600; text-decoration:underline;">' + esc(currentPhone) + '</a>';

  var mailtoLink = String(currentEmail).trim();
  var emailHtml = '<a href="mailto:' + esc(mailtoLink) + '" style="color:var(--red); font-weight:600; text-decoration:underline;">' + esc(currentEmail) + '</a>';

  var html = 
    '<div class="infoline">' +
      '<div class="ic2">📍</div>' +
      '<div>' +
        '<h5>' + venueLabel + '</h5>' +
        '<p>' + venueFull + '</p>' +
      '</div>' +
    '</div>' +
    '<div class="infoline">' +
      '<div class="ic2">📅</div>' +
      '<div>' +
        '<h5>' + dateTimeLabel + '</h5>' +
        '<p>' + dateTimeFull + '</p>' +
      '</div>' +
    '</div>' +
    '<div class="infoline">' +
      '<div class="ic2">📞</div>' +
      '<div>' +
        '<h5>' + phoneLabel + '</h5>' +
        '<p>' + phoneHtml + '</p>' +
      '</div>' +
    '</div>' +
    '<div class="infoline">' +
      '<div class="ic2">✉️</div>' +
      '<div>' +
        '<h5>' + emailLabel + '</h5>' +
        '<p>' + emailHtml + '</p>' +
      '</div>' +
    '</div>';

  var pageBox = gid('sponsorshipContactDetails');
  if(pageBox) pageBox.innerHTML = html;

  var modalBox = gid('modalSponsorContactDetails');
  if(modalBox) modalBox.innerHTML = html;
}

/* Public contact information is strictly READ-ONLY. Administrative edits are performed via Admin Portal -> Venue & Contact */

/* ---------- OUR SPONSORS MANAGEMENT ---------- */
var sponsors = [];
try {
  var _sp = JSON.parse(localStorage.getItem('kv_sponsors_v1'));
  if (Array.isArray(_sp)) {
    sponsors = _sp;
  }
} catch(e){}

function saveSponsors(){
  try {
    localStorage.setItem('kv_sponsors_v1', JSON.stringify(sponsors));
    return true;
  } catch(e){
    return false;
  }
}

var spIdx = -1;
var spPendingDel = -1;
var spPhotoData = '';

function renderSponsors(){
  var box = gid('sponsorsList');
  if(!box) return;
  var kn = isKN();

  if(!sponsors || !sponsors.length){
    box.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:36px 20px;background:#fff;border-radius:var(--r-md);border:1.5px dashed var(--border);font-size:1.05rem;font-weight:600;">' +
      (kn ? 'ಯಾವುದೇ ಪ್ರಾಯೋಜಕರನ್ನು ಇನ್ನೂ ಸೇರಿಸಲಾಗಿಲ್ಲ.' : 'No sponsors added yet.') +
      '</div>';
    return;
  }

  box.innerHTML = sponsors.map(function(s, i){
    var displayName = esc(kn ? (s.nameKn || s.nameEn) : (s.nameEn || s.nameKn));
    var displayOrg = esc(kn ? (s.orgKn || s.orgEn) : (s.orgEn || s.orgKn));
    var displayDesc = esc(kn ? (s.descKn || s.descEn) : (s.descEn || s.descKn));
    var displayPkg = esc(s.package || '');
    var displayAmt = esc(s.amount || '');

    var initial = (s.nameEn || s.nameKn || s.orgEn || s.orgKn || 'S').trim().charAt(0).toUpperCase();

    var mediaHtml = '';
    if(s.photo){
      mediaHtml = '<div class="sponsor-logo-box"><img src="' + esc(s.photo) + '" alt="' + (displayName || displayOrg || 'Sponsor') + '"></div>';
    } else {
      mediaHtml = '<div class="sponsor-logo-box"><div class="sponsor-logo-placeholder">' + esc(initial) + '</div></div>';
    }

    var badgeHtml = displayPkg ? '<span class="sponsor-badge">' + displayPkg + '</span>' : '';
    var nameHtml = displayName ? '<h3 class="sponsor-name">' + displayName + '</h3>' : '';
    var orgHtml = displayOrg ? '<div class="sponsor-org">' + displayOrg + '</div>' : '';
    
    var amtHtml = displayAmt ? 
      '<div class="sponsor-amount"><span style="font-size:.82rem; font-weight:600; color:var(--ink-soft);">' + (kn ? 'ಮೊತ್ತ:' : 'Amount:') + '</span> <span class="amt-val">' + displayAmt + '</span></div>' : '';
    
    var descHtml = displayDesc ? '<p class="sponsor-desc">' + displayDesc + '</p>' : '';

    return '<div class="sponsor-card">' +
      mediaHtml +
      badgeHtml +
      nameHtml +
      orgHtml +
      amtHtml +
      descHtml +
      '<div class="evactions" style="margin-top:auto; padding-top:14px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:8px;">' +
        '<button type="button" class="abtn" onclick="openSponsorForm(' + i + ')">' + (kn ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
        '<button type="button" class="abtn del" onclick="askDeleteSponsor(' + i + ')">' + (kn ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openSponsorForm(i){
  spIdx = i;
  var s = (i >= 0 && sponsors && sponsors[i]) ? sponsors[i] : {};
  gid('spTitle').innerHTML = i >= 0 
    ? lab('Edit Sponsor', 'ಪ್ರಾಯೋಜಕರನ್ನು ಸಂಪಾದಿಸಿ') 
    : lab('Add Sponsor', 'ಪ್ರಾಯೋಜಕರನ್ನು ಸೇರಿಸಿ');
  gid('spSave').innerHTML = i >= 0 
    ? lab('Save Changes', 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ') 
    : lab('Save', 'ಉಳಿಸಿ');

  gid('spNameEn').value = s.nameEn || '';
  gid('spNameKn').value = s.nameKn || '';
  gid('spOrgEn').value = s.orgEn || '';
  gid('spOrgKn').value = s.orgKn || '';
  gid('spPackage').value = s.package || '';
  gid('spAmount').value = s.amount || '';
  gid('spDescEn').value = s.descEn || '';
  gid('spDescKn').value = s.descKn || '';

  spPhotoData = s.photo || '';
  showSponsorPhotoPreview(spPhotoData);
  var fileInput = gid('spPhotoFile');
  if(fileInput) fileInput.value = '';

  gid('spErr').style.display = 'none';
  gid('sponsorFormModal').classList.add('open');
}

function closeSponsorForm(){
  gid('sponsorFormModal').classList.remove('open');
  spIdx = -1;
  spPhotoData = '';
}

function showSponsorPhotoPreview(src){
  var box = gid('spPhotoPreviewBox');
  var img = gid('spPhotoPreview');
  if(!box || !img) return;
  if(src){
    img.src = src;
    box.style.display = 'flex';
  } else {
    img.src = '';
    box.style.display = 'none';
  }
}

function removeSponsorPhoto(){
  spPhotoData = '';
  var f = gid('spPhotoFile');
  if(f) f.value = '';
  showSponsorPhotoPreview('');
}

function saveSponsorForm(){
  var v = function(id){ return gid(id) ? gid(id).value.trim() : ''; };
  var nameEn = v('spNameEn');
  var nameKn = v('spNameKn');
  var orgEn = v('spOrgEn');
  var orgKn = v('spOrgKn');
  var pkg = v('spPackage');
  var amount = v('spAmount');
  var descEn = v('spDescEn');
  var descKn = v('spDescKn');

  if(!nameEn && !nameKn && !orgEn && !orgKn){
    var err = gid('spErr');
    err.textContent = isKN() 
      ? 'ದಯವಿಟ್ಟು ಪ್ರಾಯೋಜಕರ ಹೆಸರು ಅಥವಾ ಸಂಸ್ಥೆಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' 
      : 'Please enter at least a sponsor name or organization name.';
    err.style.display = 'block';
    return;
  }

  var item = {
    nameEn: nameEn,
    nameKn: nameKn,
    orgEn: orgEn,
    orgKn: orgKn,
    package: pkg,
    amount: amount,
    photo: spPhotoData,
    descEn: descEn,
    descKn: descKn
  };

  if(spIdx >= 0 && spIdx < sponsors.length){
    sponsors[spIdx] = item;
  } else {
    sponsors.push(item);
  }

  saveSponsors();
  closeSponsorForm();
  renderSponsors();
}

function askDeleteSponsor(i){
  spPendingDel = i;
  gid('sponsorConfirmModal').classList.add('open');
}

function closeSponsorConfirm(){
  gid('sponsorConfirmModal').classList.remove('open');
  spPendingDel = -1;
}

function confirmDeleteSponsor(){
  if(spPendingDel >= 0 && spPendingDel < sponsors.length){
    sponsors.splice(spPendingDel, 1);
    saveSponsors();
    renderSponsors();
  }
  closeSponsorConfirm();
}

/* Photo upload event listener initialization */
(function initSponsorPhotoListener(){
  var fileInput = gid('spPhotoFile');
  if(!fileInput) return;
  fileInput.addEventListener('change', function(e){
    var f = e.target.files && e.target.files[0];
    if(!f) return;
    if(f.size > 5 * 1024 * 1024){
      alert(isKN() ? 'ಚಿತ್ರದ ಗಾತ್ರವು 5MB ಗಿಂತ ಕಡಿಮೆಯಿರಬೇಕು.' : 'Image size must be under 5MB.');
      fileInput.value = '';
      return;
    }
    var fr = new FileReader();
    fr.onload = function(){
      var im = new Image();
      im.onload = function(){
        var maxW = 600;
        var w = Math.min(maxW, im.width);
        var hgt = Math.round(im.height * w / im.width);
        var c = document.createElement('canvas');
        c.width = w;
        c.height = hgt;
        var ctx = c.getContext('2d');
        ctx.drawImage(im, 0, 0, w, hgt);
        spPhotoData = c.toDataURL('image/jpeg', 0.8);
        showSponsorPhotoPreview(spPhotoData);
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(f);
  });
})();

/* Modal Overlay Click & Esc Listeners */
gid('pkgFormModal').addEventListener('click',function(ev){if(ev.target===this) closePackageForm();});
gid('pkgConfirmModal').addEventListener('click',function(ev){if(ev.target===this) closePackageConfirm();});
gid('pkgDetailsModal').addEventListener('click',function(ev){if(ev.target===this) closePackageDetails();});
gid('sponsorContactModal').addEventListener('click',function(ev){if(ev.target===this) closeSponsorContact();});
if(gid('sponsorFormModal')) gid('sponsorFormModal').addEventListener('click',function(ev){if(ev.target===this) closeSponsorForm();});
if(gid('sponsorConfirmModal')) gid('sponsorConfirmModal').addEventListener('click',function(ev){if(ev.target===this) closeSponsorConfirm();});

document.addEventListener('keydown',function(ev){
  if(ev.key==='Escape'){
    closePackageForm(); closePackageConfirm();
    closePackageDetails(); closeSponsorContact();
    closeSponsorForm(); closeSponsorConfirm();
  }
});

function renderExtra(){
  var kn=isKN();
  var empty=function(en,k){return '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:18px 0;">'+(kn?k:en)+'</div>';};
  renderEventCards();
  renderCommitteeSection();
  renderSponsors();
  renderPackageCards();
  renderSponsorContact();
  renderGuestCards();
  renderVenue();
  renderGallery(curGalleryFilter);
}
var SCHEDULE=[
  {
    t_en:'9:00 – 10:00 AM',
    t_kn:'ಬೆಳಿಗ್ಗೆ ೯:೦೦ – ೧೦:೦೦',
    h_en:'Nashik Dhol',
    h_kn:'ನಾಸಿಕ್ ಢೋಲ್',
    d_en:'Nashik dhol from the gate to the food court.',
    d_kn:'ಮುಖ್ಯ ಗೇಟ್‌ನಿಂದ ಫುಡ್ ಕೋರ್ಟ್‌ವರೆಗೆ ನಾಸಿಕ್ ಢೋಲ್ ಮೆರವಣಿಗೆ.'
  },
  {
    t_en:'10:00/10:30 – 11:30 AM (max)',
    t_kn:'ಬೆಳಿಗ್ಗೆ ೧೦:೦೦/೧೦:೩೦ – ೧೧:೩೦ (ಗರಿಷ್ಠ)',
    h_en:'Cultural Parade',
    h_kn:'ಸಾಂಸ್ಕೃತಿಕ ಮೆರವಣಿಗೆ',
    d_en:'Cultural parade from the food court to the stage.',
    d_kn:'ಫುಡ್ ಕೋರ್ಟ್‌ನಿಂದ ವೇದಿಕೆಯವರೆಗೆ ಸಾಂಸ್ಕೃತಿಕ ಮೆರವಣಿಗೆ.'
  },
  {
    t_en:'11:30 AM – 12:00 PM',
    t_kn:'ಬೆಳಿಗ್ಗೆ ೧೧:೩೦ – ಮಧ್ಯಾಹ್ನ ೧೨:೦೦',
    h_en:'Karnataka Conclave',
    h_kn:'ಕರ್ನಾಟಕ ಕಾನ್ಕ್ಲೇವ್',
    d_en:'Special conclave session and panel discussions celebrating Karnataka\'s culture, heritage, and growth.',
    d_kn:'ಕರ್ನಾಟಕದ ಸಂಸ್ಕೃತಿ, ಪರಂಪರೆ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ಕುರಿತು ವಿಶೇಷ ಕಾನ್ಕ್ಲೇವ್ ಗೋಷ್ಠಿ.'
  },
  {
    t_en:'By 12:00 PM (max) – 1:00 PM',
    t_kn:'ಮಧ್ಯಾಹ್ನ ೧೨:೦೦ (ಗರಿಷ್ಠ) – ೧:೦೦',
    h_en:'Main Function & Lunch',
    h_kn:'ಮುಖ್ಯ ಸಮಾರಂಭ ಮತ್ತು ಭೋಜನ',
    d_en:'Main function: prize distribution, speeches by the Director and Principal (till 12:30–1:00 PM). Lunch is served at the same time.',
    d_kn:'ಮುಖ್ಯ ಸಮಾರಂಭ: ಪ್ರಶಸ್ತಿ ವಿತರಣೆ, ನಿರ್ದೇಶಕರು ಮತ್ತು ಪ್ರಾಂಶುಪಾಲರ ಭಾಷಣ (ಮಧ್ಯಾಹ್ನ ೧೨:೩೦–೧:೦೦ ರವರೆಗೆ). ಇದೇ ಸಮಯದಲ್ಲಿ ಊಟದ ವ್ಯವಸ್ಥೆ.'
  },
  {
    t_en:'Till 4:00 PM',
    t_kn:'ಸಂಜೆ ೪:೦೦ ರವರೆಗೆ',
    h_en:'Cultural Performances',
    h_kn:'ಸಾಂಸ್ಕೃತಿಕ ಪ್ರದರ್ಶನಗಳು',
    d_en:'Cultural performances on the main stage (e.g. Bharatanatyam, Yakshagana).',
    d_kn:'ಮುಖ್ಯ ವೇದಿಕೆಯಲ್ಲಿ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು (ಉದಾ: ಭರತನಾಟ್ಯ, ಯಕ್ಷಗಾನ).'
  },
  {
    t_en:'Afternoon Break',
    t_kn:'ವಿರಾಮ',
    h_en:'Break (20 to 30 minutes)',
    h_kn:'ವಿರಾಮ (೨೦ ರಿಂದ ೩೦ ನಿಮಿಷ)',
    d_en:'20 to 30 minutes break before the evening concert.',
    d_kn:'ಸಂಜೆಯ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಮುನ್ನ ೨೦ ರಿಂದ ೩೦ ನಿಮಿಷಗಳ ವಿರಾಮ.'
  },
  {
    t_en:'4:30 – 7:00 PM (max)',
    t_kn:'ಸಂಜೆ ೪:೩೦ – ೭:೦೦ (ಗರಿಷ್ಠ)',
    h_en:'Concert & Night Crackers',
    h_kn:'ಕನ್ಸರ್ಟ್ ಮತ್ತು ಪಟಾಕಿ ಸಂಭ್ರಮ',
    d_en:'Concert with karaoke singers, band and DJ, with night crackers.',
    d_kn:'ಕರೋಕೆ ಗಾಯಕರು, ಬ್ಯಾಂಡ್ ಮತ್ತು ಡಿಜೆ (DJ) ಜೊತೆಗೆ ಕನ್ಸರ್ಟ್, ಹಾಗೂ ರಾತ್ರಿ ಪಟಾಕಿ ಸಂಭ್ರಮ.'
  }
];

/* ---------- image compression helper ---------- */
function compressImage(file, maxDim, quality, cb){
  if(!file){ cb(''); return; }
  var r = new FileReader();
  r.onload = function(e){
    var img = new Image();
    img.onload = function(){
      var w = img.width, h = img.height;
      if(w > maxDim || h > maxDim){
        if(w > h){
          h = Math.round(h * (maxDim / w));
          w = maxDim;
        } else {
          w = Math.round(w * (maxDim / h));
          h = maxDim;
        }
      }
      var c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      cb(c.toDataURL('image/jpeg', quality || 0.78));
    };
    img.onerror = function(){ cb(''); };
    img.src = e.target.result;
  };
  r.onerror = function(){ cb(''); };
  r.readAsDataURL(file);
}

/* ========================================================
   1. GUESTS CRUD & LOCALSTORAGE
======================================================== */
var DEFAULT_GUESTS = [
  {
    nameEn: 'Dr. K. S. Rajanna',
    nameKn: 'ಡಾ. ಕೆ. ಎಸ್. ರಾಜಣ್ಣ',
    roleEn: 'Chief Guest',
    roleKn: 'ಮುಖ್ಯ ಅತಿಥಿ',
    orgEn: 'Former State Commissioner for Persons with Disabilities',
    orgKn: 'ಮಾಜಿ ರಾಜ್ಯ ಆಯುಕ್ತರು, ವಿಕಲಚೇತನರ ಕಲ್ಯಾಣ ಇಲಾಖೆ',
    photo: '',
    descEn: 'Renowned social activist and inspirational leader dedicated to community empowerment.',
    descKn: 'ಖ್ಯಾತ ಸಮಾಜ ಸೇವಕರು ಮತ್ತು ಪ್ರೇರಣಾದಾಯಕ ಸಾಧಕರು.'
  },
  {
    nameEn: 'Prof. Chandrashekar Patil',
    nameKn: 'ಪ್ರೊ. ಚಂದ್ರಶೇಖರ ಪಾಟೀಲ',
    roleEn: 'Guest of Honour',
    roleKn: 'ಗೌರವ ಅತಿಥಿ',
    orgEn: 'Kannada Sahitya Parishat',
    orgKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪರಿಷತ್ತು',
    photo: '',
    descEn: 'Eminent scholar and cultural ambassador promoting Karnataka’s literary traditions.',
    descKn: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆಯ ಸಂರಕ್ಷಕರು.'
  },
  {
    nameEn: 'Smt. Roopa Rao',
    nameKn: 'ಶ್ರೀಮತಿ ರೂಪಾ ರಾವ್',
    roleEn: 'Cultural Ambassador',
    roleKn: 'ಸಾಂಸ್ಕೃತಿಕ ರಾಯಭಾರಿ',
    orgEn: 'Karnataka Nataka Academy',
    orgKn: 'ಕರ್ನಾಟಕ ನಾಟಕ ಅಕಾಡೆಮಿ',
    photo: '',
    descEn: 'Celebrated filmmaker and dramatist contributing to contemporary Kannada arts.',
    descKn: 'ಕನ್ನಡ ರಂಗಭೂಮಿ ಹಾಗೂ ಸಾಂಸ್ಕೃತಿಕ ಕ್ಷೇತ್ರದ ಖ್ಯಾತ ನಿರ್ದೇಶಕರು.'
  },
  {
    nameEn: 'Sri Manjunath Prasad',
    nameKn: 'ಶ್ರೀ ಮಂಜುನಾಥ್ ಪ್ರಸಾದ್',
    roleEn: 'Community Leader',
    roleKn: 'ಸಮುದಾಯ ನಾಯಕ',
    orgEn: 'Bengaluru Youth Forum',
    orgKn: 'ಬೆಂಗಳೂರು ಯುವ ವೇದಿಕೆ',
    photo: '',
    descEn: 'Dedicated organizer empowering student initiatives across educational institutions.',
    descKn: 'ಯುವ ಮಾರ್ಗದರ್ಶಕರು ಮತ್ತು ಸಮಾಜ ಸೇವಕರು.'
  }
];

var guests = (function(){
  try{
    var raw = localStorage.getItem('kv_guests_v1');
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_GUESTS.slice();
})();

function saveGuests(){
  try{
    localStorage.setItem('kv_guests_v1', JSON.stringify(guests));
    return true;
  }catch(e){
    return false;
  }
}

var gmIdx = -1, gmPending = -1, curGuestPhoto = '';

function gInitials(n){
  if(!n) return 'KV';
  var clean = n.replace(/[[\]]/g, '').trim();
  var parts = clean.split(/\s+/);
  if(parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderGuestCards(){
  var box = gid('guestsGrid');
  if(!box) return;
  var kn = isKN();
  if(!guests.length){
    box.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:36px 0;">' +
      (kn ? 'ಯಾವುದೇ ಅತಿಥಿಗಳ ವಿವರ ಲಭ್ಯವಿಲ್ಲ.' : 'No guests listed yet.') +
      '<div style="margin-top:14px;"><button class="btn btn-dark" type="button" onclick="openGuestForm(-1)">+ ' +
      (kn ? 'ಅತಿಥಿ ಸೇರಿಸಿ' : 'Add Guest') + '</button></div></div>';
    return;
  }
  box.innerHTML = guests.map(function(g, i){
    var name = esc(kn ? (g.nameKn || g.nameEn) : (g.nameEn || g.nameKn));
    var role = esc(kn ? (g.roleKn || g.roleEn) : (g.roleEn || g.roleKn));
    var org = esc(kn ? (g.orgKn || g.orgEn) : (g.orgEn || g.orgKn));
    var desc = esc(kn ? (g.descKn || g.descEn) : (g.descEn || g.descKn));
    var photoHtml = g.photo ? '<img src="' + g.photo + '" alt="' + name + '">' : gInitials(name);
    return '<div class="guestcard">' +
      '<div class="ph">' + photoHtml + '</div>' +
      '<div class="gb">' +
        '<h4>' + name + '</h4>' +
        (role ? '<div class="role">' + role + '</div>' : '') +
        (org ? '<div class="org">' + org + '</div>' : '') +
        (desc ? '<p>' + desc + '</p>' : '') +
        '<div class="evactions" style="margin-top:14px; justify-content:center;">' +
          '<button class="abtn" type="button" onclick="openGuestForm(' + i + ')">' + (kn ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
          '<button class="abtn del" type="button" onclick="askDeleteGuest(' + i + ')">' + (kn ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openGuestForm(i){
  gmIdx = i;
  var g = i >= 0 ? guests[i] : {};
  gid('gmTitle').innerHTML = i >= 0 ? lab('Edit Guest Details', 'ಅತಿಥಿ ವಿವರಗಳನ್ನು ಸಂಪಾದಿಸಿ') : lab('Add New Guest', 'ಹೊಸ ಅತಿಥಿ ಸೇರಿಸಿ');
  gid('gmSave').innerHTML = i >= 0 ? lab('Save Changes', 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ') : lab('Save Guest', 'ಉಳಿಸಿ');
  gid('gmNameEn').value = g.nameEn || '';
  gid('gmNameKn').value = g.nameKn || '';
  gid('gmRoleEn').value = g.roleEn || '';
  gid('gmRoleKn').value = g.roleKn || '';
  gid('gmOrgEn').value = g.orgEn || '';
  gid('gmOrgKn').value = g.orgKn || '';
  gid('gmDescEn').value = g.descEn || '';
  gid('gmDescKn').value = g.descKn || '';
  curGuestPhoto = g.photo || '';
  gid('gmPhotoFile').value = '';
  if(curGuestPhoto){
    gid('gmPhotoPreview').src = curGuestPhoto;
    gid('gmPhotoPreviewBox').style.display = 'flex';
    gid('gmPhotoRemove').style.display = 'inline-block';
  } else {
    gid('gmPhotoPreview').src = '';
    gid('gmPhotoPreviewBox').style.display = 'none';
    gid('gmPhotoRemove').style.display = 'none';
  }
  gid('gmErr').style.display = 'none';
  gid('guestFormModal').classList.add('open');
}

function closeGuestForm(){
  gid('guestFormModal').classList.remove('open');
}

function removeGuestPhoto(){
  curGuestPhoto = '';
  gid('gmPhotoFile').value = '';
  gid('gmPhotoPreview').src = '';
  gid('gmPhotoPreviewBox').style.display = 'none';
  gid('gmPhotoRemove').style.display = 'none';
}

function saveGuestForm(){
  var v = function(id){ return gid(id).value.trim(); };
  var nameEn = v('gmNameEn'), nameKn = v('gmNameKn');
  if(!nameEn && !nameKn){
    var err = gid('gmErr');
    err.textContent = isKN() ? 'ದಯವಿಟ್ಟು ಅತಿಥಿಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter guest name.';
    err.style.display = 'block';
    return;
  }
  var obj = {
    nameEn: nameEn,
    nameKn: nameKn,
    roleEn: v('gmRoleEn'),
    roleKn: v('gmRoleKn'),
    orgEn: v('gmOrgEn'),
    orgKn: v('gmOrgKn'),
    photo: curGuestPhoto,
    descEn: v('gmDescEn'),
    descKn: v('gmDescKn')
  };
  var backup = JSON.stringify(guests);
  if(gmIdx >= 0) guests[gmIdx] = obj;
  else guests.push(obj);

  if(!saveGuests()){
    guests = JSON.parse(backup);
    var errBox = gid('gmErr');
    errBox.textContent = isKN() ? 'ಸಾಧನದಲ್ಲಿ ಸ್ಥಳಾವಕಾಶ ಸಾಲುತ್ತಿಲ್ಲ (ಚಿತ್ರದ ಗಾತ್ರ ಕಡಿಮೆ ಮಾಡಿ).' : 'Storage limit reached. Please use a smaller photo.';
    errBox.style.display = 'block';
    return;
  }
  closeGuestForm();
  renderGuestCards();
}

function askDeleteGuest(i){
  gmPending = i;
  gid('guestConfirmModal').classList.add('open');
}

function closeGuestConfirm(){
  gmPending = -1;
  gid('guestConfirmModal').classList.remove('open');
}

function confirmDeleteGuest(){
  if(gmPending >= 0){
    guests.splice(gmPending, 1);
    saveGuests();
    renderGuestCards();
  }
  closeGuestConfirm();
}

var gmPhotoEl = gid('gmPhotoFile');
if(gmPhotoEl){
  gmPhotoEl.addEventListener('change', function(ev){
    var file = ev.target.files && ev.target.files[0];
    if(!file) return;
    compressImage(file, 640, 0.78, function(dataUrl){
      if(dataUrl){
        curGuestPhoto = dataUrl;
        gid('gmPhotoPreview').src = dataUrl;
        gid('gmPhotoPreviewBox').style.display = 'flex';
        gid('gmPhotoRemove').style.display = 'inline-block';
      }
    });
  });
}

/* ========================================================
   2. VENUE CRUD & LOCALSTORAGE
======================================================== */
var DEFAULT_VENUE = {
  nameEn: 'HKBK College of Engineering',
  nameKn: 'ಎಚ್‌ಕೆಬಿಕೆ ಇಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು',
  addrEn: 'Opp. Manyata Tech Park, Nagawara, Bengaluru, Karnataka 560045',
  addrKn: 'ಮಾನ್ಯತಾ ಟೆಕ್ ಪಾರ್ಕ್ ಎದುರು, ನಾಗವಾರ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ ೫೬೦೦೪೫',
  date: 'Wednesday, 4 November 2026',
  time: '9:00 AM onwards',
  descEn: 'State-of-the-art campus featuring an open-air amphitheatre, main auditorium, food court, and ample parking facilities for attendees.',
  descKn: 'ಆಧುನಿಕ ಸೌಲಭ್ಯಗಳುಳ್ಳ ಕ್ಯಾಂಪಸ್, ತೆರೆದ ಸಭಾಂಗಣ, ಆಡಿಟೋರಿಯಂ, ಫುಡ್ ಕೋರ್ಟ್ ಮತ್ತು ವಿಶಾಲವಾದ ಪಾರ್ಕಿಂಗ್ ಸೌಲಭ್ಯವನ್ನು ಹೊಂದಿದೆ.',
  image: '',
  mapsUrl: 'https://maps.google.com/?q=HKBK+College+of+Engineering+Nagawara+Bengaluru',
  phone: '9980321527',
  email: 'jaipalreddy9980321527@gmail.com'
};

var venueData = (function(){
  try{
    var raw = localStorage.getItem('kv_venue_v1');
    if(raw !== null) {
      if(raw === 'null' || raw === '') return null;
      var parsed = JSON.parse(raw);
      if(parsed){
        if(!parsed.phone || parsed.phone === '+91 98450 00000' || parsed.phone === '[ADD CONTACT NUMBER]') parsed.phone = '9980321527';
        if(!parsed.email || parsed.email === 'info@hkbk.edu.in' || parsed.email === '[ADD EMAIL]') parsed.email = 'jaipalreddy9980321527@gmail.com';
      }
      return parsed;
    }
  }catch(e){}
  return Object.assign({}, DEFAULT_VENUE);
})();

function saveVenue(){
  try{
    localStorage.setItem('kv_venue_v1', venueData ? JSON.stringify(venueData) : 'null');
    return true;
  }catch(e){
    return false;
  }
}

var curVenueImage = '';

function renderVenue(){
  var box = gid('venueContainer');
  if(!box) return;
  var kn = isKN();
  if(!venueData){
    box.innerHTML = '<div style="text-align:center; padding:54px 20px; background:#fff; border:1.5px dashed var(--border); border-radius:var(--r-lg);">' +
      '<p style="color:var(--ink-soft); font-size:1.05rem; margin-bottom:18px;">' +
        (kn ? 'ಸ್ಥಳದ ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No venue information currently set.') +
      '</p>' +
      '<button class="btn btn-dark" type="button" onclick="openVenueForm()">+ ' +
        (kn ? 'ಸ್ಥಳ ಸೇರಿಸಿ' : 'Add Venue') +
      '</button>' +
    '</div>';
    return;
  }

  var name = esc(kn ? (venueData.nameKn || venueData.nameEn) : (venueData.nameEn || venueData.nameKn));
  var addr = esc(kn ? (venueData.addrKn || venueData.addrEn) : (venueData.addrEn || venueData.addrKn));
  var dateStr = esc(venueData.date || (kn ? 'ಬುಧವಾರ, ೪ ನವೆಂಬರ್ ೨೦೨೬' : 'Wednesday, 4 November 2026'));
  var timeStr = esc(venueData.time || (kn ? 'ಬೆಳಿಗ್ಗೆ ೯:೦೦ ರಿಂದ' : '9:00 AM onwards'));
  var desc = esc(kn ? (venueData.descKn || venueData.descEn) : (venueData.descEn || venueData.descKn));
  var mapsUrl = venueData.mapsUrl ? esc(venueData.mapsUrl) : '';

  box.innerHTML = '<div class="admin-only-control venue-admin-actions" style="display:flex; justify-content:flex-end; gap:10px; margin-bottom:24px; flex-wrap:wrap;">' +
    '<button class="btn btn-dark" type="button" onclick="openVenueForm()">' +
      '✏️ <span class="en">Edit Venue</span><span class="kn">ಸ್ಥಳದ ವಿವರಗಳನ್ನು ಸಂಪಾದಿಸಿ</span>' +
    '</button>' +
    '<button class="btn" type="button" onclick="askDeleteVenue()" style="background:#fff; border:1.5px solid var(--border); color:var(--deepred);">' +
      '🗑️ <span class="en">Delete Venue</span><span class="kn">ಸ್ಥಳದ ವಿವರಗಳನ್ನು ಅಳಿಸಿ</span>' +
    '</button>' +
  '</div>' +
  '<div class="venuegrid">' +
    '<div>' +
      '<h3 style="font-size:1.6rem; margin:0 0 10px; color:var(--ink);">' + name + '</h3>' +
      (desc ? '<p style="color:var(--ink-soft); line-height:1.6; margin:0 0 24px; font-size:.95rem;">' + desc + '</p>' : '') +
      '<div class="infolist">' +
        '<div class="infoline">' +
          '<div class="ic2">📍</div>' +
          '<div>' +
            '<h5>' + (kn ? 'ವಿಳಾಸ' : 'Address') + '</h5>' +
            '<p>' + addr + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="infoline">' +
          '<div class="ic2">📅</div>' +
          '<div>' +
            '<h5>' + (kn ? 'ದಿನಾಂಕ' : 'Date') + '</h5>' +
            '<p>' + dateStr + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="infoline">' +
          '<div class="ic2">⏰</div>' +
          '<div>' +
            '<h5>' + (kn ? 'ಸಮಯ' : 'Time') + '</h5>' +
            '<p>' + timeStr + '</p>' +
          '</div>' +
        '</div>' +
        (mapsUrl ? (
          '<div class="infoline">' +
            '<div class="ic2">🗺️</div>' +
            '<div>' +
              '<h5>' + (kn ? 'ದಿಕ್ಕುಗಳು / ನಕ್ಷೆ' : 'Directions & Map') + '</h5>' +
              '<p><a href="' + mapsUrl + '" target="_blank" rel="noopener noreferrer" style="color:var(--red); font-weight:600; text-decoration:underline;">' +
                (kn ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ ↗' : 'Open in Google Maps ↗') +
              '</a></p>' +
            '</div>' +
          '</div>'
        ) : '') +
      '</div>' +
    '</div>' +
    '<div>' +
      (venueData.image ? (
        '<div class="venue-photo-box">' +
          '<img src="' + venueData.image + '" alt="' + name + '">' +
        '</div>'
      ) : '') +
      '<div class="mapbox">' +
        '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.974950153835!2d77.62254397507753!3d13.037248387284422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae171120021c3b%3A0x679469c3a37fc36!2sHKBK%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Venue Map"></iframe>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function openVenueForm(){
  var v = venueData || {};
  gid('vmTitle').innerHTML = venueData ? lab('Edit Venue Details', 'ಸ್ಥಳದ ವಿವರಗಳನ್ನು ಸಂಪಾದಿಸಿ') : lab('Add Venue Details', 'ಸ್ಥಳದ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ');
  gid('vmSave').innerHTML = venueData ? lab('Save Changes', 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ') : lab('Save Venue', 'ಸ್ಥಳ ಉಳಿಸಿ');
  gid('vmNameEn').value = v.nameEn || '';
  gid('vmNameKn').value = v.nameKn || '';
  gid('vmAddrEn').value = v.addrEn || '';
  gid('vmAddrKn').value = v.addrKn || '';
  gid('vmDate').value = v.date || '';
  gid('vmTime').value = v.time || '';
  gid('vmMapsUrl').value = v.mapsUrl || '';
  gid('vmDescEn').value = v.descEn || '';
  gid('vmDescKn').value = v.descKn || '';
  curVenueImage = v.image || '';
  gid('vmImageFile').value = '';
  if(curVenueImage){
    gid('vmImagePreview').src = curVenueImage;
    gid('vmImagePreviewBox').style.display = 'flex';
    gid('vmImageRemove').style.display = 'inline-block';
  } else {
    gid('vmImagePreview').src = '';
    gid('vmImagePreviewBox').style.display = 'none';
    gid('vmImageRemove').style.display = 'none';
  }
  gid('vmErr').style.display = 'none';
  gid('venueFormModal').classList.add('open');
}

function closeVenueForm(){
  gid('venueFormModal').classList.remove('open');
}

function removeVenueImage(){
  curVenueImage = '';
  gid('vmImageFile').value = '';
  gid('vmImagePreview').src = '';
  gid('vmImagePreviewBox').style.display = 'none';
  gid('vmImageRemove').style.display = 'none';
}

function saveVenueForm(){
  var val = function(id){ return gid(id).value.trim(); };
  var nameEn = val('vmNameEn'), nameKn = val('vmNameKn');
  if(!nameEn && !nameKn){
    var err = gid('vmErr');
    err.textContent = isKN() ? 'ದಯವಿಟ್ಟು ಸ್ಥಳದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter venue name.';
    err.style.display = 'block';
    return;
  }
  var obj = {
    nameEn: nameEn,
    nameKn: nameKn,
    addrEn: val('vmAddrEn'),
    addrKn: val('vmAddrKn'),
    date: val('vmDate'),
    time: val('vmTime'),
    mapsUrl: val('vmMapsUrl'),
    descEn: val('vmDescEn'),
    descKn: val('vmDescKn'),
    image: curVenueImage
  };
  var backup = venueData;
  venueData = obj;
  if(!saveVenue()){
    venueData = backup;
    var errBox = gid('vmErr');
    errBox.textContent = isKN() ? 'ಸಾಧನದಲ್ಲಿ ಸ್ಥಳಾವಕಾಶ ಸಾಲುತ್ತಿಲ್ಲ (ಚಿತ್ರದ ಗಾತ್ರ ಕಡಿಮೆ ಮಾಡಿ).' : 'Storage limit reached. Please use a smaller image.';
    errBox.style.display = 'block';
    return;
  }
  closeVenueForm();
  renderVenue();
}

function askDeleteVenue(){
  gid('venueConfirmModal').classList.add('open');
}

function closeVenueConfirm(){
  gid('venueConfirmModal').classList.remove('open');
}

function confirmDeleteVenue(){
  venueData = null;
  saveVenue();
  closeVenueConfirm();
  renderVenue();
}

var vmImageEl = gid('vmImageFile');
if(vmImageEl){
  vmImageEl.addEventListener('change', function(ev){
    var file = ev.target.files && ev.target.files[0];
    if(!file) return;
    compressImage(file, 800, 0.78, function(dataUrl){
      if(dataUrl){
        curVenueImage = dataUrl;
        gid('vmImagePreview').src = dataUrl;
        gid('vmImagePreviewBox').style.display = 'flex';
        gid('vmImageRemove').style.display = 'inline-block';
      }
    });
  });
}

/* ========================================================
   3. GALLERY CRUD & LOCALSTORAGE
======================================================== */
var DEFAULT_GALLERY = [
  {id:'v1', type:'video', year:'2025', titleEn:'Kannada Vaibhava 2025', titleKn:'ಕನ್ನಡ ವೈಭವ 2025', captionEn:'Highlights from our vibrant 2025 cultural celebration.', captionKn:'೨೦೨೫ರ ಸಾಂಸ್ಕೃತಿಕ ವೈಭವದ ಪ್ರಮುಖ ದೃಶ್ಯಗಳು.', img: VIDEO_POSTER.vaibhava, modal:true, key:'vaibhava'},
  {id:'v2', type:'video', year:'2025', titleEn:'Melam 2025', titleKn:'ಮೇಳಂ 2025', captionEn:'Energetic beats and live rhythms on stage.', captionKn:'ಚೆಂಡಾ ಮೇಳಂ ಉತ್ಸಾಹಭರಿತ ವಾದನ.', img: VIDEO_POSTER.melam, modal:true, key:'melam'},
  {id:'v3', type:'video', year:'2026', titleEn:'Melam 2026', titleKn:'ಮೇಳಂ 2026', captionEn:'Sneak peek of the grand traditional performance.', captionKn:'೨೦೨೬ರ ಸಾಂಪ್ರದಾಯಿಕ ಕಲಾ ಪ್ರದರ್ಶನದ ಮುನ್ನೋಟ.', img: VIDEO_POSTER.melam2026, modal:true, key:'melam2026'},
  {id:'p1', type:'photo', year:'2025', titleEn:'Folk Dance', titleKn:'ಜಾನಪದ ನೃತ್ಯ', captionEn:'Students performing traditional folk routines.', captionKn:'ವಿದ್ಯಾರ್ಥಿಗಳಿಂದ ಸಾಂಪ್ರದಾಯಿಕ ಜಾನಪದ ನೃತ್ಯ.', img:'https://images.unsplash.com/photo-1583225214464-9296029427aa?q=80&w=600&auto=format&fit=crop'},
  {id:'p2', type:'photo', year:'2025', titleEn:'Community Gathering', titleKn:'ಸಮುದಾಯ ಸಮಾಗಮ', captionEn:'Audience and staff celebrating together.', captionKn:'ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಭಾಗವಹಿಸಿದ ಪ್ರೇಕ್ಷಕರು.', img:'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=600&auto=format&fit=crop'},
  {id:'p3', type:'photo', year:'2025', titleEn:'Cultural Stage', titleKn:'ಸಾಂಸ್ಕೃತಿಕ ವೇದಿಕೆ', captionEn:'Main stage decorated in state colors.', captionKn:'ಕರ್ನಾಟಕದ ವರ್ಣಗಳಲ್ಲಿ ಕಂಗೊಳಿಸಿದ ಮುಖ್ಯ ವೇದಿಕೆ.', img:'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=600&auto=format&fit=crop'},
  {id:'p4', type:'photo', year:'2025', titleEn:'Music Performance', titleKn:'ಸಂಗೀತ ಪ್ರದರ್ಶನ', captionEn:'Live musical rendition of classic melodies.', captionKn:'ಜನಪ್ರಿಯ ಕನ್ನಡ ಗೀತೆಗಳ ನೇರ ಗಾಯನ.', img:'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=600&auto=format&fit=crop'}
];

var gallery = (function(){
  try{
    var raw = localStorage.getItem('kv_gallery_v1');
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_GALLERY.slice();
})();

function saveGallery(){
  try{
    localStorage.setItem('kv_gallery_v1', JSON.stringify(gallery));
    return true;
  }catch(e){
    return false;
  }
}

var curGalleryFilter = 'all';
var galIdx = -1, galPending = -1, curGalleryPhoto = '';

function renderGallery(filter){
  if(filter) curGalleryFilter = filter;
  else filter = curGalleryFilter;
  var kn = isKN();
  var gal = gid('galleryGrid');
  if(!gal) return;
  var items = gallery.map(function(it, realIdx){
    return { item: it, index: realIdx };
  }).filter(function(wrapped){
    var it = wrapped.item;
    if(filter === 'all') return true;
    if(filter === 'photo' || filter === 'video') return it.type === filter;
    return it.year === filter;
  });

  if(!items.length){
    gal.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:36px 0;">' +
      (kn ? 'ಯಾವುದೇ ಚಿತ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ.' : 'No gallery items found.') +
      '<div style="margin-top:14px;"><button class="btn btn-dark" type="button" onclick="openGalleryForm(-1)">+ ' +
      (kn ? 'ಭಾವಚಿತ್ರ ಸೇರಿಸಿ' : 'Add Photo') + '</button></div></div>';
    return;
  }

  gal.innerHTML = items.map(function(obj){
    var it = obj.item, i = obj.index;
    var title = esc(kn ? (it.titleKn || it.titleEn || it.h_kn || it.h_en || '') : (it.titleEn || it.titleKn || it.h_en || it.h_kn || ''));
    var caption = esc(kn ? (it.captionKn || it.captionEn || '') : (it.captionEn || it.captionKn || ''));
    var clickAttr = it.type === 'video' && it.key ? ' onclick="openVideo(\'' + it.key + '\')"' : ' onclick="openGalleryLightbox(' + i + ')"';
    var playIcon = it.type === 'video' ? '<div class="gplay"><span><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 5v14l12-7L7 5z" fill="#C8102E"/></svg></span></div>' : '';
    return '<div class="gitem"' + clickAttr + '>' +
      '<img src="' + esc(it.img) + '" alt="' + title + '">' +
      '<div class="gitem-actions">' +
        '<button class="abtn" type="button" onclick="event.stopPropagation(); openGalleryForm(' + i + ')">' + (kn ? 'ಸಂಪಾದಿಸಿ' : 'Edit') + '</button>' +
        '<button class="abtn del" type="button" onclick="event.stopPropagation(); askDeleteGallery(' + i + ')">' + (kn ? 'ಅಳಿಸಿ' : 'Delete') + '</button>' +
      '</div>' +
      playIcon +
      '<div class="gcap">' +
        (title ? '<div style="font-weight:700;">' + title + '</div>' : '') +
        (caption ? '<div style="font-size:.78rem; opacity:.92; margin-top:2px;">' + caption + '</div>' : '') +
      '</div>' +
    '</div>';
  }).join('');
}

function openGalleryForm(i){
  galIdx = i;
  var it = i >= 0 ? gallery[i] : {};
  gid('galTitleModal').innerHTML = i >= 0 ? lab('Edit Gallery Photo', 'ಚಿತ್ರವನ್ನು ಸಂಪಾದಿಸಿ') : lab('Add New Photo', 'ಹೊಸ ಭಾವಚಿತ್ರ ಸೇರಿಸಿ');
  gid('galSave').innerHTML = i >= 0 ? lab('Save Changes', 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ') : lab('Add Photo', 'ಚಿತ್ರ ಸೇರಿಸಿ');
  gid('galTitleEn').value = it.titleEn || it.h_en || '';
  gid('galTitleKn').value = it.titleKn || it.h_kn || '';
  gid('galCaptionEn').value = it.captionEn || '';
  gid('galCaptionKn').value = it.captionKn || '';
  curGalleryPhoto = it.img || '';
  gid('galImageFile').value = '';
  if(curGalleryPhoto){
    gid('galImagePreview').src = curGalleryPhoto;
    gid('galImagePreviewBox').style.display = 'flex';
  } else {
    gid('galImagePreview').src = '';
    gid('galImagePreviewBox').style.display = 'none';
  }
  gid('galErr').style.display = 'none';
  gid('galleryFormModal').classList.add('open');
}

function closeGalleryForm(){
  gid('galleryFormModal').classList.remove('open');
}

function saveGalleryForm(){
  var val = function(id){ return gid(id).value.trim(); };
  var tEn = val('galTitleEn'), tKn = val('galTitleKn');
  if(!curGalleryPhoto){
    var err = gid('galErr');
    err.textContent = isKN() ? 'ದಯವಿಟ್ಟು ಚಿತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Please select an image file.';
    err.style.display = 'block';
    return;
  }
  if(!tEn && !tKn){
    var err2 = gid('galErr');
    err2.textContent = isKN() ? 'ದಯವಿಟ್ಟು ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ.' : 'Please enter an image title.';
    err2.style.display = 'block';
    return;
  }
  var obj = {
    type: (galIdx >= 0 && gallery[galIdx].type) ? gallery[galIdx].type : 'photo',
    year: (galIdx >= 0 && gallery[galIdx].year) ? gallery[galIdx].year : '2026',
    img: curGalleryPhoto,
    titleEn: tEn,
    titleKn: tKn,
    captionEn: val('galCaptionEn'),
    captionKn: val('galCaptionKn')
  };
  if(galIdx >= 0 && gallery[galIdx].modal) {
    obj.modal = gallery[galIdx].modal;
    obj.key = gallery[galIdx].key;
  }
  var backup = JSON.stringify(gallery);
  if(galIdx >= 0) gallery[galIdx] = obj;
  else gallery.unshift(obj);

  if(!saveGallery()){
    gallery = JSON.parse(backup);
    var errBox = gid('galErr');
    errBox.textContent = isKN() ? 'ಸಾಧನದಲ್ಲಿ ಸ್ಥಳಾವಕಾಶ ಸಾಲುತ್ತಿಲ್ಲ (ಚಿತ್ರದ ಗಾತ್ರ ಕಡಿಮೆ ಮಾಡಿ).' : 'Storage limit reached. Please use a smaller image.';
    errBox.style.display = 'block';
    return;
  }
  closeGalleryForm();
  renderGallery(curGalleryFilter);
}

function askDeleteGallery(i){
  galPending = i;
  gid('galleryConfirmModal').classList.add('open');
}

function closeGalleryConfirm(){
  galPending = -1;
  gid('galleryConfirmModal').classList.remove('open');
}

function confirmDeleteGallery(){
  if(galPending >= 0){
    gallery.splice(galPending, 1);
    saveGallery();
    renderGallery(curGalleryFilter);
  }
  closeGalleryConfirm();
}

function openGalleryLightbox(i){
  var it = gallery[i];
  if(!it) return;
  var kn = isKN();
  gid('lightboxImg').src = it.img;
  var title = kn ? (it.titleKn || it.titleEn || it.h_kn || it.h_en || '') : (it.titleEn || it.titleKn || it.h_en || it.h_kn || '');
  var caption = kn ? (it.captionKn || it.captionEn || '') : (it.captionEn || it.captionKn || '');
  gid('lightboxTitle').textContent = title;
  gid('lightboxCaption').textContent = caption;
  gid('lightboxTitle').style.display = title ? 'block' : 'none';
  gid('lightboxCaption').style.display = caption ? 'block' : 'none';
  gid('galleryLightboxModal').classList.add('open');
}

function closeGalleryLightbox(){
  gid('galleryLightboxModal').classList.remove('open');
}

var galImageEl = gid('galImageFile');
if(galImageEl){
  galImageEl.addEventListener('change', function(ev){
    var file = ev.target.files && ev.target.files[0];
    if(!file) return;
    compressImage(file, 900, 0.78, function(dataUrl){
      if(dataUrl){
        curGalleryPhoto = dataUrl;
        gid('galImagePreview').src = dataUrl;
        gid('galImagePreviewBox').style.display = 'flex';
      }
    });
  });
}

/* Modals outside click & ESC handlers */
['guestFormModal', 'guestConfirmModal', 'venueFormModal', 'venueConfirmModal', 'galleryFormModal', 'galleryConfirmModal', 'galleryLightboxModal'].forEach(function(id){
  var el = gid(id);
  if(el){
    el.addEventListener('click', function(ev){
      if(ev.target === this){
        if(id === 'guestFormModal') closeGuestForm();
        else if(id === 'guestConfirmModal') closeGuestConfirm();
        else if(id === 'venueFormModal') closeVenueForm();
        else if(id === 'venueConfirmModal') closeVenueConfirm();
        else if(id === 'galleryFormModal') closeGalleryForm();
        else if(id === 'galleryConfirmModal') closeGalleryConfirm();
        else if(id === 'galleryLightboxModal') closeGalleryLightbox();
      }
    });
  }
});

document.addEventListener('keydown', function(ev){
  if(ev.key === 'Escape'){
    closeGuestForm(); closeGuestConfirm();
    closeVenueForm(); closeVenueConfirm();
    closeGalleryForm(); closeGalleryConfirm();
    closeGalleryLightbox();
  }
});

function isKN(){return document.body.classList.contains('lang-kn');}
function renderData(){
  var kn=isKN();
  var tl=document.getElementById('timelineList');
  if(tl){
    tl.innerHTML = SCHEDULE.map(function(s){
      return '<div class="titem"><div class="time">'+(kn?s.t_kn:s.t_en)+'</div><h4>'+(kn?s.h_kn:s.h_en)+'</h4><p>'+(kn?s.d_kn:s.d_en)+'</p></div>';
    }).join('');
  }
  renderExtra();
}

document.querySelectorAll('.filters button').forEach(function(b){
  b.addEventListener('click', function(){
    document.querySelectorAll('.filters button').forEach(function(x){x.classList.remove('active');});
    b.classList.add('active');
    curGalleryFilter = b.getAttribute('data-filter') || 'all';
    renderGallery(curGalleryFilter);
  });
});


var HERO_SLIDES = [
  "assets/images/hero-uploaded-1.jpg",
  "assets/images/hero-uploaded-2.jpg",
  "assets/images/hero-uploaded-3.jpg"
];
var heroCurrentSlide = 0;
var heroTimer = null;

function initHeroSlideshow(){
  var box = document.getElementById('heroBg');
  var dotsContainer = document.getElementById('heroDots');
  if(!box) return;

  box.innerHTML = '';
  if(dotsContainer) dotsContainer.innerHTML = '';

  HERO_SLIDES.forEach(function(src, idx){
    var slide = document.createElement('div');
    slide.className = 'hero-slide' + (idx === 0 ? ' on' : '');
    slide.style.backgroundImage = 'url(' + src + ')';
    slide.style.backgroundSize = 'cover';
    slide.style.backgroundPosition = 'center center';
    box.appendChild(slide);

    if(dotsContainer){
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
      dot.onclick = function(){ goToHeroSlide(idx); };
      dotsContainer.appendChild(dot);
    }
  });

  startHeroTimer();
}

function showHeroSlide(index){
  var slides = document.querySelectorAll('#heroBg .hero-slide');
  var dots = document.querySelectorAll('#heroDots .hero-dot');
  if(!slides.length) return;

  if(index < 0) index = slides.length - 1;
  if(index >= slides.length) index = 0;
  heroCurrentSlide = index;

  slides.forEach(function(s, idx){
    if(idx === heroCurrentSlide){
      s.classList.add('on');
    } else {
      s.classList.remove('on');
    }
  });

  dots.forEach(function(d, idx){
    if(idx === heroCurrentSlide){
      d.classList.add('active');
    } else {
      d.classList.remove('active');
    }
  });
}

function nextHeroSlide(){
  showHeroSlide(heroCurrentSlide + 1);
  resetHeroTimer();
}

function prevHeroSlide(){
  showHeroSlide(heroCurrentSlide - 1);
  resetHeroTimer();
}

function goToHeroSlide(index){
  showHeroSlide(index);
  resetHeroTimer();
}

function startHeroTimer(){
  clearInterval(heroTimer);
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  heroTimer = setInterval(function(){
    showHeroSlide(heroCurrentSlide + 1);
  }, 4500);
}

function resetHeroTimer(){
  startHeroTimer();
}

/* ========================================================
   SUPABASE PUBLIC DATA SYNCHRONIZATION
======================================================== */
function applyHomeContent(map){
  if(!map) return;
  var hero = map.hero;
  if(hero){
    var knTitle = document.querySelector('.hero-title .kn-title');
    if(knTitle && hero.content_kn) knTitle.textContent = hero.content_kn;
    var enTitle = document.querySelector('.hero-title .en-title');
    if(enTitle && hero.content_en) enTitle.innerHTML = hero.content_en;
    if(hero.extra){
      var dEn = document.querySelector('.hero-date-line .en');
      var dKn = document.querySelector('.hero-date-line .kn');
      if(dEn && hero.extra.date_en) dEn.textContent = hero.extra.date_en;
      if(dKn && hero.extra.date_kn) dKn.textContent = hero.extra.date_kn;
      var subEn = document.querySelector('.hero-content .sub .en');
      var subKn = document.querySelector('.hero-content .sub .kn');
      if(subEn && hero.extra.tagline_en) subEn.textContent = hero.extra.tagline_en;
      if(subKn && hero.extra.tagline_kn) subKn.textContent = hero.extra.tagline_kn;
    }
  }
  var about = map.about_summary;
  if(about){
    var abSec = document.querySelector('#page-home .cream .sec-sub');
    if(abSec){
      var abEn = abSec.querySelector('.en');
      var abKn = abSec.querySelector('.kn');
      if(abEn && about.content_en) abEn.textContent = about.content_en;
      if(abKn && about.content_kn) abKn.textContent = about.content_kn;
    }
  }
}

async function initSupabaseDataOnPublicSite(){
  if(window.SupabaseData && window.SupabaseData.isReady()){
    try{
      var promises = [
        window.SupabaseData.getEvents(),
        window.SupabaseData.getConclaveProfessors(),
        window.SupabaseData.getStudentCommittee(),
        window.SupabaseData.getManagementCommittee(),
        window.SupabaseData.getGuests(),
        window.SupabaseData.getPackages(),
        window.SupabaseData.getSponsors(),
        window.SupabaseData.getGallery(),
        window.SupabaseData.getVenue(),
        window.SupabaseData.getSchedule(),
        window.SupabaseData.getHomeContent()
      ];
      var results = await Promise.allSettled(promises);
      
      if(results[0].status === 'fulfilled' && Array.isArray(results[0].value)){
        events = results[0].value;
        try { localStorage.setItem('kv_events_v2', JSON.stringify(events)); } catch(e){}
      }
      if(results[1].status === 'fulfilled' && Array.isArray(results[1].value)){
        conclaveProfessors = results[1].value;
        try { localStorage.setItem('conclave_professors_v1', JSON.stringify(conclaveProfessors)); } catch(e){}
      }
      if(results[2].status === 'fulfilled' && Array.isArray(results[2].value)){
        members = results[2].value;
        try { localStorage.setItem('studentCommitteeMembers', JSON.stringify(members)); } catch(e){}
      }
      if(results[3].status === 'fulfilled' && Array.isArray(results[3].value)){
        mgmtMembers = results[3].value;
        try { localStorage.setItem('managementCommitteeMembers', JSON.stringify(mgmtMembers)); } catch(e){}
      }
      if(results[4].status === 'fulfilled' && Array.isArray(results[4].value)){
        guests = results[4].value;
        try { localStorage.setItem('kv_guests_v1', JSON.stringify(guests)); } catch(e){}
      }
      if(results[5].status === 'fulfilled' && Array.isArray(results[5].value)){
        packages = results[5].value;
        try { localStorage.setItem('kv_packages_v1', JSON.stringify(packages)); } catch(e){}
      }
      if(results[6].status === 'fulfilled' && Array.isArray(results[6].value)){
        sponsors = results[6].value;
        try { localStorage.setItem('kv_sponsors_v1', JSON.stringify(sponsors)); } catch(e){}
      }
      if(results[7].status === 'fulfilled' && Array.isArray(results[7].value)){
        gallery = results[7].value;
        try { localStorage.setItem('kv_gallery_v1', JSON.stringify(gallery)); } catch(e){}
      }
      if(results[8].status === 'fulfilled' && results[8].value){
        venueData = results[8].value;
        if(venueData){
          if(!venueData.phone || venueData.phone === '+91 98450 00000' || venueData.phone === '[ADD CONTACT NUMBER]') venueData.phone = '9980321527';
          if(!venueData.email || venueData.email === 'info@hkbk.edu.in' || venueData.email === '[ADD EMAIL]') venueData.email = 'jaipalreddy9980321527@gmail.com';
        }
        try { localStorage.setItem('kv_venue_v1', JSON.stringify(venueData)); } catch(e){}
      }
      if(results[9].status === 'fulfilled' && Array.isArray(results[9].value)){
        SCHEDULE = results[9].value;
      }
      if(results[10].status === 'fulfilled' && results[10].value){
        applyHomeContent(results[10].value);
      }
      renderData();
    }catch(e){
      console.warn('Supabase public sync info:', e);
    }
  }
}

initHeroSlideshow();

renderData();
showPage(location.hash.replace('#','')||'home');
initSupabaseDataOnPublicSite();

