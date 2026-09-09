import React, { useState, useMemo } from 'react';
import {
  Plug, Droplet, Hammer, Paintbrush, Home as HomeIcon, HeartPulse, Car, Flower2,
  Sparkles, Wrench, Bug, Search, MapPin, Star, ChevronLeft, Clock,
  Phone, Camera, Wallet, Users, AlertTriangle, CheckCircle2, FileText,
  LogOut, LayoutDashboard, Briefcase, BadgeCheck, Siren, Bell, Calendar,
  Zap, Building2, GraduationCap, Scale, Activity, Mic, Shield,
  TrendingUp, Map, Sliders, Landmark, ClipboardList, Power,
  ShieldCheck, CalendarClock, Share2, KeyRound, EyeOff, X
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid
} from 'recharts';

/* ============================================================================
   Synapse SahKaar · SIH26089 · Ministry of Cooperation / NCCT
   A cooperative-owned marketplace for household and community services.
   Design metaphor: the open ledger. Money is never one opaque number.
   Built by Synapse.
   ========================================================================== */

const T = {
  paper:'#EDF2EF', card:'#FFFFFF', ink:'#0C1E19', ink2:'#31443D', muted:'#6B7E77',
  line:'#D6E0DB', lineSoft:'#E6EDE9',
  green:'#0A6B4F', greenDeep:'#064B37', greenLt:'#E1EEE8', greenMid:'#0E8A66',
  gold:'#C9921C', goldLt:'#FAF0D6', goldDeep:'#7A5A0C',
  brick:'#B23A2B', brickLt:'#F8E8E5', slate:'#2B3D46',
  // Women-only service carries its own identity so it reads as a guarantee, not a filter
  plum:'#8A3D6B', plumDeep:'#642A4E', plumLt:'#F8EAF2', plumMid:'#A85288',
  // Synapse brand, used only for the maker's credit
  synNavy:'#1C3A5E', synOrange:'#E1703A',
  // Elevation is tied to hierarchy, not applied uniformly
  sh1:'0 1px 2px rgba(12,30,25,.05)',
  sh2:'0 4px 14px rgba(12,30,25,.08)',
  sh3:'0 12px 32px rgba(12,30,25,.14)',
};

/* Each trade gets its own tint so the booking grid reads as a set of distinct
   crafts rather than eleven identical green tiles. */
const TINT = {
  electrician:['#FCF3DC','#F5E4B4'], plumber:['#E2EFF6','#C7DFEE'], carpenter:['#F6EADA','#EBD5B8'],
  painter:['#EDE9F7','#DAD2EF'], domestic:['#E4EFE8','#CDE2D6'], caregiver:['#FAE9EC','#F2D2D8'],
  driver:['#E7EDF2','#CFDBE5'], gardener:['#E6F2E2','#CDE5C6'], cleaning:['#E2F1F0','#C4E3E1'],
  appliance:['#EFEDE7','#DDD9CE'], pest:['#F1EBE4','#E0D5C8'],
};
const tintOf = c => TINT[c] || TINT.plumber;

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Inter:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Sans+Gujarati:wght@400;500;600&display=swap');
.dsp{font-family:Archivo,'Noto Sans Devanagari','Noto Sans Gujarati',system-ui,sans-serif;letter-spacing:-0.02em}
.bdy{font-family:Inter,'Noto Sans Devanagari','Noto Sans Gujarati',system-ui,sans-serif}
.num{font-variant-numeric:tabular-nums}
*:focus-visible{outline:2px solid ${T.green};outline-offset:2px}
@keyframes popIn{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.moneybar-seg{transition:width .55s cubic-bezier(.4,0,.2,1)}
.timeline-dot{transition:background-color .45s ease,border-color .45s ease}
.timeline-line{transition:background-color .45s ease}
/* Motion answers an action rather than decorating the page: press, lift, confirm. */
.tap{transition:transform .12s ease, box-shadow .18s ease, border-color .18s ease, background-color .18s ease}
.tap:active{transform:scale(.985)}
.lift:hover{transform:translateY(-2px);box-shadow:${'0 10px 24px rgba(12,30,25,.10)'}}
.lift{transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease}
.btn:hover{filter:brightness(1.06)}
.btn:active{transform:translateY(1px)}
.btn[disabled]{opacity:.45;cursor:not-allowed}
.navscroll{overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.navscroll::-webkit-scrollbar{display:none}
.rowhover:hover{background:#F6F9F7}
input[type=range]{height:22px;cursor:pointer}
@keyframes shimmer{0%{opacity:.55}50%{opacity:1}100%{opacity:.55}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

/* ============================================================== TRANSLATION */
/* Every string in the interface lives here. Order: [English, हिंदी, ગુજરાતી] */
const D = {
  appName:['Synapse SahKaar','सिनैप्स सहकार','સિનેપ્સ સહકાર'],
  heroTitle:['Every rupee, shown.','हर रुपया, सामने।','દરેક રૂપિયો, ખુલ્લેઆમ.'],
  heroBody:['Labour cooperative societies already have lakhs of certified electricians, plumbers and caregivers. Private apps take a third of what they earn. This platform is owned by the societies themselves — so the split is visible on every screen, and the surplus goes back to the members.',
    'श्रम सहकारी समितियों के पास पहले से लाखों प्रमाणित इलेक्ट्रीशियन, प्लंबर और देखभालकर्ता हैं। निजी ऐप उनकी कमाई का एक-तिहाई ले लेते हैं। यह मंच समितियों का अपना है — इसलिए बँटवारा हर स्क्रीन पर दिखता है, और अधिशेष सदस्यों को ही लौटता है।',
    'શ્રમ સહકારી મંડળીઓ પાસે પહેલેથી લાખો પ્રમાણિત ઇલેક્ટ્રિશિયન, પ્લમ્બર અને સંભાળ રાખનારા છે. ખાનગી એપ તેમની કમાણીનો ત્રીજો ભાગ લઈ લે છે. આ પ્લેટફોર્મ મંડળીઓની પોતાની માલિકીનું છે — તેથી વહેંચણી દરેક સ્ક્રીન પર દેખાય છે, અને સરપ્લસ સભ્યોને પાછો મળે છે.'],
  heroJob:['A ₹800 plumbing job','₹800 का प्लंबिंग काम','₹800નું પ્લમ્બિંગ કામ'],
  openAs:['Open the prototype as any of the four roles.','चारों में से किसी भी भूमिका में प्रोटोटाइप खोलें।','ચારમાંથી કોઈપણ ભૂમિકામાં પ્રોટોટાઇપ ખોલો.'],
  rCustomer:['Customer','ग्राहक','ગ્રાહક'],
  rWorker:['Worker','कारीगर','કારીગર'],
  rSociety:['Society admin','समिति प्रशासक','મંડળી સંચાલક'],
  rFederation:['Federation admin','संघ प्रशासक','ફેડરેશન સંચાલક'],
  dCustomer:['Book a verified cooperative worker for your home or institution.','अपने घर या संस्था के लिए प्रमाणित सहकारी कारीगर बुक करें।','તમારા ઘર કે સંસ્થા માટે પ્રમાણિત સહકારી કારીગર બુક કરો.'],
  dWorker:['Accept jobs, track earnings, see your welfare fund grow.','काम स्वीकारें, कमाई देखें, अपना कल्याण कोष बढ़ता देखें।','કામ સ્વીકારો, કમાણી જુઓ, તમારું કલ્યાણ ભંડોળ વધતું જુઓ.'],
  dSociety:['Run one district society — roster, certification, grievances.','एक ज़िला समिति चलाएँ — सूची, प्रमाणन, शिकायतें।','એક જિલ્લા મંડળી ચલાવો — યાદી, પ્રમાણન, ફરિયાદો.'],
  dFederation:['State-level oversight, demand forecasting, policy.','राज्य स्तरीय निगरानी, माँग पूर्वानुमान, नीति।','રાજ્ય કક્ષાની દેખરેખ, માંગ આગાહી, નીતિ.'],
  open:['Open','खोलें','ખોલો'],
  back:['Back','वापस','પાછળ'],
  switchRole:['Switch role','भूमिका बदलें','ભૂમિકા બદલો'],
  poweredBy:['Built by','निर्माता','બનાવનાર'],

  /* money */
  workerEarnings:['Worker earnings','कारीगर की कमाई','કારીગરની કમાણી'],
  welfareFund:['Worker welfare fund','कारीगर कल्याण कोष','કારીગર કલ્યાણ ભંડોળ'],
  societyOps:['Society operations','समिति संचालन','મંડળી સંચાલન'],
  platform:['Platform','मंच','પ્લેટફોર્મ'],
  privateWould:['On a private platform the worker would receive','निजी मंच पर कारीगर को मिलता','ખાનગી પ્લેટફોર્મ પર કારીગરને મળત'],
  moreInHand:['more in the worker\'s hand, at the same price to you.','ज़्यादा कारीगर के हाथ में, आपकी उसी क़ीमत पर।','વધુ કારીગરના હાથમાં, તમારી એ જ કિંમતે.'],
  whereMoney:['Where your money goes','आपका पैसा कहाँ जाता है','તમારા પૈસા ક્યાં જાય છે'],

  /* customer */
  tabBook:['Book','बुक','બુક'],
  tabTrack:['Track','ट्रैक','ટ્રૅક'],
  tabHistory:['History','इतिहास','ઇતિહાસ'],
  tabInst:['Institution','संस्था','સંસ્થા'],
  whatNeeds:['What needs fixing?','क्या ठीक करवाना है?','શું સમારવાનું છે?'],
  nearYou:['verified cooperative members near Adajan, Surat','प्रमाणित सहकारी सदस्य, अडाजण, सूरत के पास','પ્રમાણિત સહકારી સભ્યો, અડાજણ, સુરત નજીક'],
  searchSvc:['Search a service','सेवा खोजें','સેવા શોધો'],
  emergTitle:['Need someone within 2 hours','2 घंटे में कोई चाहिए','2 કલાકમાં કોઈ જોઈએ'],
  emergSub:['Shows only instantly available workers. Surge fee goes entirely to the worker.','सिर्फ़ तुरंत उपलब्ध कारीगर दिखेंगे। अतिरिक्त शुल्क पूरा कारीगर को जाता है।','ફક્ત તરત ઉપલબ્ધ કારીગરો દેખાશે. વધારાની ફી પૂરેપૂરી કારીગરને જાય છે.'],
  availableCount:['available','उपलब्ध','ઉપલબ્ધ'],
  bookAgain:['Book again','फिर से बुक करें','ફરીથી બુક કરો'],
  rebook:['Rebook','दोबारा','ફરી બુક'],
  allServices:['All services','सभी सेवाएँ','બધી સેવાઓ'],
  sortTrust:['Trust','भरोसा','વિશ્વાસ'],
  sortRating:['Rating','रेटिंग','રેટિંગ'],
  sortPrice:['Price','क़ीमत','કિંમત'],
  floorNote:['Society wage floor for this trade','इस काम के लिए समिति की न्यूनतम मज़दूरी','આ કામ માટે મંડળીની લઘુત્તમ મજૂરી'],
  floorNote2:['No booking can be priced below it.','इससे कम पर कोई बुकिंग नहीं हो सकती।','તેનાથી ઓછી કિંમતે કોઈ બુકિંગ ન થઈ શકે.'],
  perHour:['per hour','प्रति घंटा','પ્રતિ કલાક'],
  view:['View','देखें','જુઓ'],
  yrs:['yrs','वर्ष','વર્ષ'],
  jobs:['jobs','काम','કામ'],
  trustScore:['Trust score','भरोसा अंक','વિશ્વાસ સ્કોર'],
  instant:['Instant','तुरंत','તરત'],
  memberOf:['Member of','सदस्य —','સભ્ય —'],
  jobsCompleted:['jobs completed','काम पूरे किए','કામ પૂરાં કર્યાં'],
  certifications:['Certifications','प्रमाणपत्र','પ્રમાણપત્રો'],
  issued:['Issued','जारी','જારી'],
  validTo:['valid to','मान्य तक','માન્ય સુધી'],
  trustBreak:['Trust score breakdown','भरोसा अंक का विवरण','વિશ્વાસ સ્કોરની વિગત'],
  tbVerified:['Identity verified','पहचान सत्यापित','ઓળખ ચકાસાયેલ'],
  tbRatings:['Customer ratings','ग्राहक रेटिंग','ગ્રાહક રેટિંગ'],
  tbJobs:['Jobs completed','पूरे किए काम','પૂરાં કરેલાં કામ'],
  tbYears:['Years as member','सदस्यता के वर्ष','સભ્યપદનાં વર્ષ'],
  recentReviews:['Recent reviews','हाल की समीक्षाएँ','તાજેતરની સમીક્ષાઓ'],
  book:['Book','बुक करें','બુક કરો'],
  stDescribe:['Describe','बताएँ','જણાવો'],
  stSchedule:['Schedule','समय','સમય'],
  stConfirm:['Confirm','पक्का करें','પાકું કરો'],
  whatProblem:['What is the problem?','समस्या क्या है?','સમસ્યા શું છે?'],
  addPhoto:['Add a photo of the problem','समस्या की तस्वीर जोड़ें','સમસ્યાનો ફોટો ઉમેરો'],
  estHours:['Estimated hours','अनुमानित घंटे','અંદાજિત કલાક'],
  cont:['Continue','आगे बढ़ें','આગળ વધો'],
  whenWhere:['When and where?','कब और कहाँ?','ક્યારે અને ક્યાં?'],
  dToday:['Today','आज','આજે'],
  dTomorrow:['Tomorrow','कल','કાલે'],
  youPay:['You pay','आप देते हैं','તમે ચૂકવો છો'],
  upliftNote:['Rate uplifted to the society wage floor.','दर समिति की न्यूनतम मज़दूरी तक बढ़ाई गई।','દર મંડળીની લઘુત્તમ મજૂરી સુધી વધારાયો.'],
  surgeNote:['Emergency surge — paid to the worker in full, not shared with the platform.','आपातकालीन शुल्क — पूरा कारीगर को, मंच के साथ नहीं बँटता।','તાત્કાલિક ફી — પૂરેપૂરી કારીગરને, પ્લેટફોર્મ સાથે વહેંચાતી નથી.'],
  payment:['Payment','भुगतान','ચુકવણી'],
  pUpi:['UPI','यूपीआई','યુપીઆઈ'],
  pCard:['Card','कार्ड','કાર્ડ'],
  pCash:['Cash on completion','काम पूरा होने पर नक़द','કામ પૂરું થયે રોકડ'],
  simPay:['Simulated in this prototype. No gateway is connected.','इस प्रोटोटाइप में नक़ली। कोई गेटवे जुड़ा नहीं है।','આ પ્રોટોટાઇપમાં નકલી. કોઈ ગેટવે જોડાયેલો નથી.'],
  confirmBooking:['Confirm booking','बुकिंग पक्की करें','બુકિંગ પાકી કરો'],
  bookingDone:['Booking confirmed.','बुकिंग पक्की हुई।','બુકિંગ પાકી થઈ.'],
  hasBeenNotified:['has been notified.','को सूचित कर दिया गया।','ને જાણ કરાઈ છે.'],
  yourBooking:['Your booking','आपकी बुकिंग','તમારી બુકિંગ'],
  arriving:['Now · arriving in about 20 minutes','अभी · लगभग 20 मिनट में पहुँचेंगे','હમણાં · લગભગ 20 મિનિટમાં પહોંચશે'],
  kmAway:['km away','किमी दूर','કિમી દૂર'],
  yourBookings:['Your bookings','आपकी बुकिंग','તમારી બુકિંગ'],
  invoice:['Invoice','रसीद','રસીદ'],
  youRated:['You rated','आपने दिया','તમે આપ્યું'],
  rateJob:['Rate this job','इस काम को रेट करें','આ કામને રેટ કરો'],
  thanksRating:['Thanks — your rating helps the whole society.','धन्यवाद — आपकी रेटिंग पूरी समिति की मदद करती है।','આભાર — તમારી રેટિંગ આખી મંડળીને મદદ કરે છે.'],
  reviewDescLabel:['Tell us about the job (optional)','काम के बारे में बताएँ (वैकल्पिक)','કામ વિશે જણાવો (વૈકલ્પિક)'],
  reviewPlaceholder:['What went well, or what could be better?','क्या अच्छा रहा, या क्या बेहतर हो सकता है?','શું સારું રહ્યું, અથવા શું બહેતર થઈ શકે?'],
  submitReview:['Submit review','समीक्षा भेजें','સમીક્ષા મોકલો'],
  selectStarsFirst:['Tap a star to rate','रेट करने के लिए तारा दबाएँ','રેટ કરવા તારો દબાવો'],
  noInstantWorkers:['No workers are instantly available for this right now. Try turning off the 2-hour option.','अभी इसके लिए कोई कारीगर तुरंत उपलब्ध नहीं है। 2 घंटे वाला विकल्प बंद करके देखें।','અત્યારે આ માટે કોઈ કારીગર તરત ઉપલબ્ધ નથી. 2 કલાકનો વિકલ્પ બંધ કરીને જુઓ.'],
  instTitle:['Institutional contracts','संस्थागत अनुबंध','સંસ્થાકીય કરાર'],
  instSub:['For schools, hospitals, offices and housing societies that need recurring work.','स्कूल, अस्पताल, दफ़्तर और सोसाइटी के लिए जिन्हें नियमित काम चाहिए।','શાળા, હૉસ્પિટલ, ઑફિસ અને સોસાયટી માટે જેમને નિયમિત કામ જોઈએ.'],
  amc:['Annual maintenance','वार्षिक रखरखाव','વાર્ષિક જાળવણી'],
  amcDesc:['Fixed monthly retainer, assigned team, guaranteed response time.','तय मासिक शुल्क, नियत टीम, गारंटीड जवाब समय।','નિશ્ચિત માસિક ફી, નક્કી ટીમ, ખાતરીબદ્ધ પ્રતિસાદ સમય.'],
  bulk:['Bulk deployment','सामूहिक तैनाती','સામૂહિક તૈનાતી'],
  bulkDesc:['Ten or more workers for a single scheduled event or shutdown.','एक निर्धारित आयोजन के लिए दस या अधिक कारीगर।','એક નિર્ધારિત આયોજન માટે દસ કે વધુ કારીગરો.'],
  raiseReq:['Raise a request','अनुरोध भेजें','વિનંતી મોકલો'],
  reqSent:['Request sent to the Surat society.','अनुरोध सूरत समिति को भेजा गया।','વિનંતી સુરત મંડળીને મોકલાઈ.'],
  liveContracts:['Live contracts','चालू अनुबंध','ચાલુ કરાર'],
  listening:['Listening…','सुन रहे हैं…','સાંભળી રહ્યા છીએ…'],
  understoodAs:['Understood as','समझा गया','સમજાયું'],
  showThem:['Show plumbers','प्लंबर दिखाएँ','પ્લમ્બર બતાવો'],
  speechSim:['Speech recognition is simulated in this prototype.','इस प्रोटोटाइप में वाणी पहचान नक़ली है।','આ પ્રોટોટાઇપમાં વાણી ઓળખ નકલી છે.'],

  /* statuses + slots */
  sRequested:['Requested','अनुरोधित','વિનંતી કરેલ'],
  sAssigned:['Assigned','सौंपा गया','સોંપાયેલ'],
  sOnTheWay:['On the way','रास्ते में','રસ્તામાં'],
  sInProgress:['In progress','चल रहा है','ચાલુ છે'],
  sCompleted:['Completed','पूरा हुआ','પૂર્ણ'],
  slMorning:['Morning','सुबह','સવાર'],
  slAfternoon:['Afternoon','दोपहर','બપોર'],
  slEvening:['Evening','शाम','સાંજ'],
  slNight:['Night','रात','રાત'],

  /* worker */
  wHome:['Home','होम','હોમ'],
  wJobs:['Jobs','काम','કામ'],
  wEarn:['Earnings','कमाई','કમાણી'],
  wWelfare:['Welfare','कल्याण','કલ્યાણ'],
  wId:['My ID','मेरा आईडी','મારું આઈડી'],
  availableWork:['Available for work','काम के लिए उपलब्ध','કામ માટે ઉપલબ્ધ'],
  offline:['Offline','ऑफ़लाइन','ઑફલાઇન'],
  thisMonth:['This month','इस महीने','આ મહિને'],
  thisWeek:['This week','इस हफ़्ते','આ અઠવાડિયે'],
  jobRequests:['Job requests','काम के अनुरोध','કામની વિનંતીઓ'],
  noJobs:['No requests right now. Stay available and we will send work your way.','अभी कोई अनुरोध नहीं। उपलब्ध रहें, काम भेजा जाएगा।','હમણાં કોઈ વિનંતી નથી. ઉપલબ્ધ રહો, કામ મોકલાશે.'],
  accept:['Accept','स्वीकारें','સ્વીકારો'],
  decline:['Decline','मना करें','ના પાડો'],
  declined:['Declined.','मना कर दिया।','ના પાડી.'],
  accepted:['Job accepted. The customer has been told.','काम स्वीकारा। ग्राहक को बता दिया गया।','કામ સ્વીકાર્યું. ગ્રાહકને જાણ કરાઈ.'],
  youKeep:['You keep','आपको मिलता है','તમને મળે છે'],
  call:['Call','कॉल','કૉલ'],
  navigate:['Navigate','रास्ता','રસ્તો'],
  beforePhoto:['Add "before" photo','पहले की तस्वीर जोड़ें','પહેલાંનો ફોટો ઉમેરો'],
  afterPhoto:['Add "after" photo','बाद की तस्वीर जोड़ें','પછીનો ફોટો ઉમેરો'],
  imOnWay:['I am on the way','मैं रास्ते में हूँ','હું રસ્તામાં છું'],
  startJob:['Start job','काम शुरू करें','કામ શરૂ કરો'],
  finishJob:['Finish job','काम पूरा करें','કામ પૂરું કરો'],
  custCanSee:['The customer can now see you on the map.','ग्राहक अब आपको नक़्शे पर देख सकते हैं।','ગ્રાહક હવે તમને નકશા પર જોઈ શકે છે.'],
  jobStarted:['Job started.','काम शुरू हुआ।','કામ શરૂ થયું.'],
  credited:['credited.','जमा हुए।','જમા થયા.'],
  addedToFund:['added to your welfare fund.','आपके कल्याण कोष में जुड़े।','તમારા કલ્યાણ ભંડોળમાં ઉમેરાયા.'],
  everyJob:['Every job, itemised','हर काम, विस्तार से','દરેક કામ, વિગતવાર'],
  gross:['Gross','कुल','કુલ'],
  yourWelfareFund:['Your welfare fund','आपका कल्याण कोष','તમારું કલ્યાણ ભંડોળ'],
  builtFrom:['Built from','बना','બન્યું'],
  jobsSince:['jobs since','कामों से, तब से','કામોમાંથી, ત્યારથી'],
  yoursNotPlatform:['Yours, not the platform\'s.','आपका, मंच का नहीं।','તમારું, પ્લેટફોર્મનું નહીં.'],
  coverInForce:['Cover in force','चालू सुरक्षा','ચાલુ સુરક્ષા'],
  accidentCover:['Accident cover (PMSBY)','दुर्घटना बीमा (PMSBY)','અકસ્માત વીમો (PMSBY)'],
  lifeCover:['Life cover (PMJJBY)','जीवन बीमा (PMJJBY)','જીવન વીમો (PMJJBY)'],
  pension:['Pension contribution','पेंशन अंशदान','પેન્શન યોગદાન'],
  notEnrolled:['Not enrolled','नामांकित नहीं','નોંધાયેલ નથી'],
  askEnrol:['Ask my society to enrol me','समिति से नामांकन कहें','મંડળીને નોંધણી માટે કહો'],
  enrolSent:['Enrolment request sent to your society.','नामांकन अनुरोध समिति को भेजा गया।','નોંધણી વિનંતી મંડળીને મોકલાઈ.'],
  raiseClaim:['Raise a claim','दावा करें','દાવો કરો'],
  claimSent:['Claim submitted. Society admin will review within 48 hours.','दावा भेजा गया। समिति प्रशासक 48 घंटे में देखेंगे।','દાવો મોકલાયો. મંડળી સંચાલક 48 કલાકમાં જોશે.'],
  memberSince:['since','से','થી'],
  scanNote:['The customer scans this at the door to confirm who you are.','ग्राहक दरवाज़े पर इसे स्कैन कर आपकी पहचान पक्की करते हैं।','ગ્રાહક દરવાજે આ સ્કૅન કરીને તમારી ઓળખ પાકી કરે છે.'],
  addSkill:['Add a skill','नया हुनर जोड़ें','નવું કૌશલ્ય ઉમેરો'],
  addSkillDesc:['Request an assessment from your society to get certified in another trade.','दूसरे काम में प्रमाणपत्र के लिए समिति से परीक्षा माँगें।','બીજા કામમાં પ્રમાણપત્ર માટે મંડળી પાસે પરીક્ષા માંગો.'],
  reqAssessment:['Request assessment','परीक्षा माँगें','પરીક્ષા માંગો'],
  assessSent:['Assessment request sent to the Surat society.','परीक्षा अनुरोध सूरत समिति को भेजा गया।','પરીક્ષા વિનંતી સુરત મંડળીને મોકલાઈ.'],
  emergency:['Emergency','आपातकाल','કટોકટી'],
  sosDesc:['Your society admin will be alerted with your live location right away.','आपकी समिति प्रशासक को तुरंत आपकी जगह के साथ सूचना जाएगी।','તમારા મંડળી સંચાલકને તરત તમારા સ્થાન સાથે જાણ થશે.'],
  sendAlert:['Send alert now','अभी अलर्ट भेजें','હમણાં અલર્ટ મોકલો'],
  cancel:['Cancel','रद्द','રદ'],
  alertSent:['Alert sent. Society admin has your location.','अलर्ट भेजा गया। समिति प्रशासक के पास आपकी जगह है।','અલર્ટ મોકલાયો. મંડળી સંચાલક પાસે તમારું સ્થાન છે.'],
  noActive:['No active job.','कोई चालू काम नहीं।','કોઈ ચાલુ કામ નથી.'],

  /* society */
  overview:['Overview','सारांश','સારાંશ'],
  roster:['Roster','सदस्य सूची','સભ્ય યાદી'],
  liveBookings:['Live bookings','चालू बुकिंग','ચાલુ બુકિંગ'],
  grievances:['Grievances','शिकायतें','ફરિયાદો'],
  wageFloorNav:['Wage floor','न्यूनतम मज़दूरी','લઘુત્તમ મજૂરી'],
  activeWorkers:['Active workers','सक्रिय कारीगर','સક્રિય કારીગરો'],
  verifiedCount:['verified','सत्यापित','ચકાસાયેલ'],
  jobsToday:['Jobs today','आज के काम','આજનાં કામ'],
  revenueMonth:['Revenue this month','इस महीने की आय','આ મહિનાની આવક'],
  openGriev:['Open grievances','खुली शिकायतें','ખુલ્લી ફરિયાદો'],
  sla7:['SLA 7 days','समय सीमा 7 दिन','સમયમર્યાદા 7 દિવસ'],
  emergAlerts:['Emergency alerts','आपातकालीन अलर्ट','કટોકટી અલર્ટ'],
  respond:['Respond','जवाब दें','પ્રતિસાદ'],
  dispatched:['Responder dispatched.','सहायता भेजी गई।','મદદ મોકલાઈ.'],
  byWard:['Bookings by ward, last 30 days','वार्ड अनुसार बुकिंग, पिछले 30 दिन','વૉર્ડ પ્રમાણે બુકિંગ, છેલ્લા 30 દિવસ'],
  onboardQ:['Onboarding queue','नामांकन क़तार','નોંધણી કતાર'],
  queueClear:['Queue is clear. New applications will appear here.','क़तार ख़ाली है। नए आवेदन यहाँ दिखेंगे।','કતાર ખાલી છે. નવી અરજીઓ અહીં દેખાશે.'],
  documents:['documents','दस्तावेज़','દસ્તાવેજો'],
  returnApp:['Return','लौटाएँ','પરત'],
  approve:['Approve','मंज़ूर','મંજૂર'],
  returned:['Application returned for missing documents.','अधूरे दस्तावेज़ों के कारण आवेदन लौटाया।','અધૂરા દસ્તાવેજોને કારણે અરજી પરત.'],
  addedRoster:['verified and added to the roster.','सत्यापित और सूची में जोड़े गए।','ચકાસાયેલ અને યાદીમાં ઉમેરાયા.'],
  colMember:['Member','सदस्य','સભ્ય'],
  colTrade:['Trade','काम','કામ'],
  colWard:['Ward','वार्ड','વૉર્ડ'],
  colRating:['Rating','रेटिंग','રેટિંગ'],
  colFund:['Welfare fund','कल्याण कोष','કલ્યાણ ભંડોળ'],
  colStatus:['Status','स्थिति','સ્થિતિ'],
  verified:['Verified','सत्यापित','ચકાસાયેલ'],
  pending:['Pending','लंबित','બાકી'],
  members:['members','सदस्य','સભ્યો'],
  reassign:['Reassign','बदलें','બદલો'],
  reassignOpened:['Reassignment panel opened for','बदलाव पैनल खुला —','બદલાવ પેનલ ખૂલી —'],
  raised:['raised','दर्ज','નોંધાયેલ'],
  daysLeft:['d left','दिन बचे','દિવસ બાકી'],
  onSla:['on SLA','समय सीमा में','સમયમર્યાદામાં'],
  takeUp:['Take up','हाथ में लें','હાથમાં લો'],
  resolve:['Resolve','निपटाएँ','ઉકેલો'],
  assignedOfficer:['Assigned to the welfare officer.','कल्याण अधिकारी को सौंपा।','કલ્યાણ અધિકારીને સોંપ્યું.'],
  resolved:['Grievance resolved and logged.','शिकायत निपटी और दर्ज हुई।','ફરિયાદ ઉકેલાઈ અને નોંધાઈ.'],
  gWage:['Wage dispute','मज़दूरी विवाद','મજૂરી વિવાદ'],
  gUnsafe:['Unsafe workplace','असुरक्षित कार्यस्थल','અસુરક્ષિત કાર્યસ્થળ'],
  gComplaint:['Customer complaint','ग्राहक शिकायत','ગ્રાહક ફરિયાદ'],
  gDelay:['Payment delay','भुगतान देरी','ચુકવણી વિલંબ'],
  gOpen:['Open','खुली','ખુલ્લી'],
  gReview:['In review','जाँच में','તપાસમાં'],
  gResolved:['Resolved','निपटी','ઉકેલાઈ'],
  wageFloorDesc:['The society sets a minimum hourly rate per trade. Any booking priced below it is uplifted automatically — change a value here and it takes effect in the customer app immediately.',
    'समिति हर काम के लिए न्यूनतम प्रति घंटा दर तय करती है। इससे कम की बुकिंग अपने-आप बढ़ा दी जाती है — यहाँ बदलाव तुरंत ग्राहक ऐप में लागू होता है।',
    'મંડળી દરેક કામ માટે લઘુત્તમ કલાક દર નક્કી કરે છે. તેનાથી ઓછી બુકિંગ આપોઆપ વધારી દેવાય છે — અહીંનો ફેરફાર તરત ગ્રાહક એપમાં લાગુ થાય છે.'],
  welfareAdmin:['Welfare administration','कल्याण प्रशासन','કલ્યાણ વહીવટ'],
  fundBalance:['Fund balance','कोष शेष','ભંડોળ બાકી'],
  enrolledCover:['Enrolled in cover','बीमा में नामांकित','વીમામાં નોંધાયેલ'],
  claimsPending:['Claims pending','लंबित दावे','બાકી દાવા'],
  notEnrolledList:['Members not yet enrolled','अब तक नामांकित नहीं सदस्य','હજી નોંધાયા ન હોય તેવા સભ્યો'],
  enrol:['Enrol','नामांकित करें','નોંધો'],
  enrolled:['enrolled in PMSBY and PMJJBY.','PMSBY और PMJJBY में नामांकित।','PMSBY અને PMJJBYમાં નોંધાયા.'],

  /* federation */
  fedName:['Gujarat State Labour Cooperative Federation','गुजरात राज्य श्रम सहकारी संघ','ગુજરાત રાજ્ય શ્રમ સહકારી ફેડરેશન'],
  societiesN:['societies','समितियाँ','મંડળીઓ'],
  wardsN:['wards','वार्ड','વૉર્ડ'],
  membersStat:['Members','सदस्य','સભ્યો'],
  bookingsStat:['Bookings','बुकिंग','બુકિંગ'],
  rolling30:['rolling 30 days','पिछले 30 दिन','છેલ્લા 30 દિવસ'],
  welfarePooled:['Member welfare pooled','कुल कल्याण कोष','કુલ કલ્યાણ ભંડોળ'],
  grievRate:['Grievance rate','शिकायत दर','ફરિયાદ દર'],
  demand90:['Demand across the state, last 90 days','राज्य भर की माँग, पिछले 90 दिन','રાજ્યભરની માંગ, છેલ્લા 90 દિવસ'],
  colSociety:['Society','समिति','મંડળી'],
  colMembers:['Members','सदस्य','સભ્યો'],
  colBookings:['Bookings','बुकिंग','બુકિંગ'],
  colRevenue:['Revenue','आय','આવક'],
  colOpen:['Open','खुली','ખુલ્લી'],
  forecastNav:['Demand forecast','माँग पूर्वानुमान','માંગ આગાહી'],
  forecastDesc:['Predicted bookings per ward and time slot for the next seven days. The model averages the same ward, weekday and slot over the past twelve weeks, then applies a trend factor drawn from the last fortnight against the fortnight before it.',
    'अगले सात दिनों के लिए वार्ड और समय अनुसार अनुमानित बुकिंग। मॉडल पिछले बारह हफ़्तों में उसी वार्ड, वार और समय का औसत लेता है, फिर पिछले पखवाड़े बनाम उससे पहले वाले पखवाड़े से निकाला प्रवृत्ति गुणांक लगाता है।',
    'આગામી સાત દિવસ માટે વૉર્ડ અને સમય પ્રમાણે અંદાજિત બુકિંગ. મૉડલ છેલ્લા બાર અઠવાડિયાંમાં એ જ વૉર્ડ, વાર અને સમયનો સરેરાશ લે છે, પછી છેલ્લા પખવાડિયા સામે તેની પહેલાંના પખવાડિયામાંથી કાઢેલો પ્રવાહ ગુણાંક લગાવે છે.'],
  predByWard:['Predicted demand by ward and slot','वार्ड और समय अनुसार अनुमानित माँग','વૉર્ડ અને સમય પ્રમાણે અંદાજિત માંગ'],
  ofN:['of','में से','માંથી'],
  withinCapacity:['Demand within capacity','क्षमता के भीतर माँग','ક્ષમતામાં માંગ'],
  exceeds:['Demand exceeds certified workers available','माँग उपलब्ध प्रमाणित कारीगरों से अधिक','માંગ ઉપલબ્ધ પ્રમાણિત કારીગરો કરતાં વધુ'],
  supplyGaps:['Supply gaps, ranked','आपूर्ति की कमी, क्रम से','પુરવઠાની ખાધ, ક્રમમાં'],
  supplyGapsSub:['Where predicted demand outruns the certified workforce','जहाँ अनुमानित माँग प्रमाणित कार्यबल से आगे निकलती है','જ્યાં અંદાજિત માંગ પ્રમાણિત કાર્યબળથી આગળ નીકળે છે'],
  needs:['needs','चाहिए','જોઈએ'],
  has:['has','उपलब्ध','ઉપલબ્ધ'],
  recommended:['Recommended action','सुझाई गई कार्रवाई','સૂચવેલ પગલું'],
  recommendedSub:['Generated from the gaps on the left','बाईं ओर की कमियों से बना','ડાબી બાજુની ખાધમાંથી બનેલ'],
  needsMore:['needs','को चाहिए','ને જોઈએ'],
  moreOn:['more on','और, दिन —','વધુ, દિવસ —'],
  reassignFrom:['Reassign from','यहाँ से भेजें —','અહીંથી મોકલો —'],
  orFastTrack:['or fast-track certification for','या तेज़ प्रमाणन करें','અથવા ઝડપી પ્રમાણન કરો'],
  traineesReg:['trainees already registered there.','प्रशिक्षुओं का, जो वहाँ पंजीकृत हैं।','તાલીમાર્થીઓનું, જે ત્યાં નોંધાયેલા છે.'],
  reallocate:['Reallocate','पुनः तैनात','ફરી તૈનાત'],
  schedTraining:['Schedule training','प्रशिक्षण तय करें','તાલીમ ગોઠવો'],
  reallocPushed:['Reallocation pushed to the society.','पुनःतैनाती समिति को भेजी गई।','ફરી તૈનાતી મંડળીને મોકલાઈ.'],
  batchSched:['Training batch scheduled.','प्रशिक्षण बैच तय हुआ।','તાલીમ બૅચ ગોઠવાઈ.'],
  societiesNav:['Societies','समितियाँ','મંડળીઓ'],
  mapTitle:['Societies across Gujarat','गुजरात भर की समितियाँ','ગુજરાતભરની મંડળીઓ'],
  mapNote:['Circle size shows booking volume. Red marks societies with more than two open grievances.','गोले का आकार बुकिंग दिखाता है। लाल का मतलब दो से अधिक खुली शिकायतें।','વર્તુળનું કદ બુકિંગ દર્શાવે છે. લાલ એટલે બેથી વધુ ખુલ્લી ફરિયાદો.'],
  surplusNav:['Surplus','अधिशेष','સરપ્લસ'],
  surplusTitle:['Surplus and dividend','अधिशेष और लाभांश','સરપ્લસ અને ડિવિડન્ડ'],
  surplusDesc:['A cooperative\'s surplus belongs to its members. This is the arithmetic behind that claim.','सहकारी का अधिशेष उसके सदस्यों का होता है। यह उसी दावे का हिसाब है।','સહકારીનો સરપ્લસ તેના સભ્યોનો હોય છે. આ એ દાવાનું ગણિત છે.'],
  grossValue:['Gross booking value','कुल बुकिंग मूल्य','કુલ બુકિંગ મૂલ્ય'],
  platformShare:['Platform share','मंच का हिस्सा','પ્લેટફોર્મનો હિસ્સો'],
  ofGross:['of gross','कुल का','કુલનો'],
  distributable:['Distributable surplus','वितरण योग्य अधिशेष','વહેંચવાપાત્ર સરપ્લસ'],
  afterCosts:['after running costs','संचालन ख़र्च के बाद','સંચાલન ખર્ચ પછી'],
  dividendPer:['Dividend per society','प्रति समिति लाभांश','મંડળી દીઠ ડિવિડન્ડ'],
  perMember:['per member','प्रति सदस्य','સભ્ય દીઠ'],
  policyNav:['Policy','नीति','નીતિ'],
  policyTitle:['Revenue policy','आय नीति','આવક નીતિ'],
  policyDesc:['Set once at the federation, applied everywhere. Move a slider and the breakdown changes in the customer booking screen and the worker\'s ledger in the same instant.',
    'संघ में एक बार तय, हर जगह लागू। स्लाइडर हिलाइए और ग्राहक बुकिंग स्क्रीन तथा कारीगर के खाते में उसी क्षण बदलाव दिखेगा।',
    'ફેડરેશનમાં એકવાર નક્કી, બધે લાગુ. સ્લાઇડર ખસેડો અને ગ્રાહક બુકિંગ સ્ક્રીન તથા કારીગરના ખાતામાં એ જ ક્ષણે ફેરફાર દેખાશે.'],
  privateComparison:['Private platform commission, for comparison','तुलना के लिए निजी मंच का कमीशन','સરખામણી માટે ખાનગી પ્લેટફોર્મનું કમિશન'],
  previewOn:['Preview on a ₹800 job','₹800 के काम पर झलक','₹800ના કામ પર ઝલક'],

  /* notifications + live */
  notifications:['Notifications','सूचनाएँ','સૂચનાઓ'],
  noNotifs:['Nothing new yet. Updates appear here as they happen.','अभी कुछ नया नहीं। जैसे-जैसे होगा, यहाँ दिखेगा।','હજી કંઈ નવું નથી. જેમ બનશે તેમ અહીં દેખાશે.'],
  markAllRead:['Mark all read','सब पढ़ा हुआ करें','બધું વાંચેલું કરો'],
  live:['Live','लाइव','લાઇવ'],
  paused:['Paused','रुका','થોભેલ'],
  justNow:['just now','अभी','હમણાં'],
  minAgo:['m ago','मि पहले','મિ પહેલાં'],
  nfAssigned:['{name} accepted your booking.','{name} ने आपकी बुकिंग स्वीकार की।','{name}એ તમારી બુકિંગ સ્વીકારી.'],
  nfOnWay:['{name} is on the way to your address.','{name} आपके पते पर आ रहे हैं।','{name} તમારા સરનામે આવી રહ્યા છે.'],
  nfStarted:['{name} has started the work.','{name} ने काम शुरू कर दिया।','{name}એ કામ શરૂ કર્યું.'],
  nfDone:['Job {id} completed. Invoice is ready.','काम {id} पूरा। रसीद तैयार है।','કામ {id} પૂર્ણ. રસીદ તૈયાર છે.'],
  nfNewJob:['New job request in {ward} — {amt} for you.','{ward} में नया काम — आपके लिए {amt}।','{ward}માં નવું કામ — તમારા માટે {amt}.'],
  nfCredited:['{amt} credited. Welfare fund updated.','{amt} जमा हुए। कल्याण कोष अद्यतन।','{amt} જમા થયા. કલ્યાણ ભંડોળ અપડેટ.'],
  nfPolicy:['Federation policy changed: {label} is now {n}%.','संघ नीति बदली: {label} अब {n}%।','ફેડરેશન નીતિ બદલાઈ: {label} હવે {n}%.'],
  nfFloor:['Wage floor for {label} set to {amt} per hour.','{label} की न्यूनतम मज़दूरी {amt} प्रति घंटा।','{label}ની લઘુત્તમ મજૂરી {amt} પ્રતિ કલાક.'],
  nfSos:['Emergency alert from {name} in {ward}.','{ward} में {name} से आपातकालीन अलर्ट।','{ward}માં {name} તરફથી કટોકટી અલર્ટ.'],
  nfGrievance:['New grievance filed by {name}.','{name} ने नई शिकायत दर्ज की।','{name}એ નવી ફરિયાદ નોંધાવી.'],
  nfDemand:['Demand rising in {ward}. Check the forecast.','{ward} में माँग बढ़ रही है। पूर्वानुमान देखें।','{ward}માં માંગ વધી રહી છે. આગાહી જુઓ.'],
  nfEarningsUp:['Your rate changed — this week\'s earnings recalculated.','आपकी दर बदली — इस हफ़्ते की कमाई फिर से गिनी गई।','તમારો દર બદલાયો — આ અઠવાડિયાની કમાણી ફરી ગણાઈ.'],

  /* photos */
  addPhotos:['Add photos','तस्वीरें जोड़ें','ફોટા ઉમેરો'],
  takeOrChoose:['Take a photo or choose from gallery','तस्वीर लें या गैलरी से चुनें','ફોટો લો અથવા ગૅલેરીમાંથી પસંદ કરો'],
  photoAdded:['Photo added.','तस्वीर जुड़ी।','ફોટો ઉમેરાયો.'],
  removePhoto:['Remove','हटाएँ','દૂર કરો'],
  photosAttached:['attached','जुड़ी','જોડાયેલા'],

  /* women-only service */
  womenTab:['Women only','महिला','મહિલા'],
  womenTitle:['Women-only service','महिला-केवल सेवा','મહિલા-માત્ર સેવા'],
  womenLead:['A woman booking for her own home can ask to be matched only with women members of the society. The booking is then visible only to women members, and no one else can accept it.',
    'अपने घर के लिए बुक करती महिला यह कह सकती हैं कि उन्हें समिति की महिला सदस्य ही चाहिए। तब वह बुकिंग सिर्फ़ महिला सदस्यों को दिखती है, और कोई और उसे नहीं ले सकता।',
    'પોતાના ઘર માટે બુક કરતી મહિલા એવું કહી શકે છે કે તેમને મંડળીની મહિલા સભ્ય જ જોઈએ. પછી એ બુકિંગ ફક્ત મહિલા સભ્યોને દેખાય છે, અને બીજું કોઈ તેને લઈ શકતું નથી.'],
  womenToggle:['Match me with women members only','मुझे सिर्फ़ महिला सदस्य दें','મને ફક્ત મહિલા સભ્યો આપો'],
  womenToggleSub:['Same price, same wage floor, same split.','वही क़ीमत, वही न्यूनतम मज़दूरी, वही बँटवारा।','એ જ કિંમત, એ જ લઘુત્તમ મજૂરી, એ જ વહેંચણી.'],
  womenPill:['Women only','महिला-केवल','મહિલા-માત્ર'],
  womanPill:['Woman member','महिला सदस्य','મહિલા સભ્ય'],
  womenMembers:['Women members','महिला सदस्य','મહિલા સભ્યો'],
  womenAcross:['certified women members across all eleven trades','सभी ग्यारह कामों में प्रमाणित महिला सदस्य','અગિયારે કામોમાં પ્રમાણિત મહિલા સભ્યો'],
  womenNoneCat:['No women members are certified in this trade yet. The society runs an assessment batch every month — ask for one.',
    'इस काम में अभी कोई महिला सदस्य प्रमाणित नहीं है। समिति हर महीने परीक्षा बैच चलाती है — कहिए।',
    'આ કામમાં હજી કોઈ મહિલા સભ્ય પ્રમાણિત નથી. મંડળી દર મહિને પરીક્ષા બૅચ ચલાવે છે — કહો.'],
  howItWorks:['How the guarantee works','यह गारंटी कैसे काम करती है','આ ખાતરી કેવી રીતે કામ કરે છે'],
  wg1:['Only women members are shown','सिर्फ़ महिला सदस्य दिखती हैं','ફક્ત મહિલા સભ્યો દેખાય છે'],
  wg1s:['Every one of them is identity-verified and certified by her society.','हर एक की पहचान सत्यापित और समिति से प्रमाणित है।','દરેકની ઓળખ ચકાસાયેલી અને મંડળી દ્વારા પ્રમાણિત છે.'],
  wg2:['The job is hidden from everyone else','काम बाक़ी सबसे छिपा रहता है','કામ બાકી બધાથી છુપાયેલું રહે છે'],
  wg2s:['Men in the roster never see the request, so it cannot be picked up by mistake.','सूची के पुरुष सदस्यों को अनुरोध दिखता ही नहीं, इसलिए ग़लती से नहीं लिया जा सकता।','યાદીના પુરુષ સભ્યોને વિનંતી દેખાતી જ નથી, તેથી ભૂલથી લેવાઈ શકતી નથી.'],
  wg3:['A door code, not a guess','द्वार कोड, अंदाज़ा नहीं','દરવાજા કોડ, અટકળ નહીં'],
  wg3s:['You read a four-digit code to her at the door. It matches this booking only.','आप दरवाज़े पर चार अंकों का कोड बताती हैं। वह सिर्फ़ इसी बुकिंग से मिलता है।','તમે દરવાજે ચાર આંકડાનો કોડ કહો છો. તે ફક્ત આ જ બુકિંગ સાથે મળે છે.'],
  wg4:['The society answers within 48 hours','समिति 48 घंटे में जवाब देती है','મંડળી 48 કલાકમાં જવાબ આપે છે'],
  wg4s:['Complaints on a women-only booking go straight to the women\'s cell.','महिला-केवल बुकिंग की शिकायत सीधे महिला प्रकोष्ठ को जाती है।','મહિલા-માત્ર બુકિંગની ફરિયાદ સીધી મહિલા સેલને જાય છે.'],
  doorCode:['Door code','द्वार कोड','દરવાજા કોડ'],
  doorCodeSub:['Read this to her at the door.','दरवाज़े पर उन्हें यह बताएँ।','દરવાજે તેમને આ કહો.'],
  shareTrip:['Share this booking','यह बुकिंग साझा करें','આ બુકિંગ શેર કરો'],
  shareTripDone:['Booking link copied. Send it to whoever you like.','बुकिंग लिंक कॉपी हुआ। जिसे चाहें भेजें।','બુકિંગ લિંક કૉપી થઈ. જેને ઇચ્છો તેને મોકલો.'],
  womenOnlyBooking:['This is a women-only booking.','यह महिला-केवल बुकिंग है।','આ મહિલા-માત્ર બુકિંગ છે.'],
  browseWomen:['See women members','महिला सदस्य देखें','મહિલા સભ્યો જુઓ'],

  /* women — worker and admin side */
  womenPref:['Take women-only jobs','महिला-केवल काम लें','મહિલા-માત્ર કામ લો'],
  womenPrefSub:['These requests reach you and no one else.','ये अनुरोध सिर्फ़ आप तक आते हैं।','આ વિનંતીઓ ફક્ત તમારા સુધી આવે છે.'],
  safetyPanel:['Your safety','आपकी सुरक्षा','તમારી સલામતી'],
  nightEscort:['Escort for night jobs','रात के काम के लिए साथ','રાત્રિ કામ માટે સાથ'],
  nightEscortSub:['The society pairs two members for any job after 8 pm.','रात 8 बजे के बाद समिति दो सदस्यों को साथ भेजती है।','રાત્રે 8 પછી મંડળી બે સભ્યોને સાથે મોકલે છે.'],
  escortOn:['Escort requested for your next night job.','अगले रात्रि काम के लिए साथ माँगा गया।','આગામી રાત્રિ કામ માટે સાથ માંગ્યો.'],
  requestEscort:['Request escort','साथ माँगें','સાથ માંગો'],
  womenCell:['Women\'s cell','महिला प्रकोष्ठ','મહિલા સેલ'],
  womenCellSub:['Membership, women-only demand and the grievances that come with it.','सदस्यता, महिला-केवल माँग और उससे जुड़ी शिकायतें।','સભ્યપદ, મહિલા-માત્ર માંગ અને તેની સાથે આવતી ફરિયાદો.'],
  womenOnTheRoster:['Women on the roster','सूची में महिलाएँ','યાદીમાં મહિલાઓ'],
  womenOnlyJobs:['Women-only bookings','महिला-केवल बुकिंग','મહિલા-માત્ર બુકિંગ'],
  womenGriev:['Priority grievances','प्राथमिक शिकायतें','પ્રાથમિકતા ફરિયાદો'],
  sla48:['48-hour cell review','48 घंटे में समीक्षा','48 કલાકમાં સમીક્ષા'],
  tradeSpread:['Where the women members are certified','महिला सदस्य किन कामों में प्रमाणित हैं','મહિલા સભ્યો કયા કામોમાં પ્રમાણિત છે'],
  assessBatch:['Assessment batch for women members','महिला सदस्यों के लिए परीक्षा बैच','મહિલા સભ્યો માટે પરીક્ષા બૅચ'],
  assessBatchSub:['Trades where women-only demand runs ahead of certified supply.','जहाँ महिला-केवल माँग प्रमाणित आपूर्ति से आगे है।','જ્યાં મહિલા-માત્ર માંગ પ્રમાણિત પુરવઠાથી આગળ છે.'],
  openBatch:['Open a batch','बैच खोलें','બૅચ ખોલો'],
  batchOpened:['Assessment batch opened. Members will be invited.','परीक्षा बैच खुला। सदस्यों को बुलाया जाएगा।','પરીક્ષા બૅચ ખૂલ્યો. સભ્યોને બોલાવાશે.'],
  womenShare:['Women in the workforce','कार्यबल में महिलाएँ','કાર્યબળમાં મહિલાઓ'],
  colWomen:['Women','महिला','મહિલા'],

  /* rescheduling */
  reschedule:['Reschedule','समय बदलें','સમય બદલો'],
  rescheduleTitle:['Move this booking','यह बुकिंग खिसकाएँ','આ બુકિંગ ખસેડો'],
  rescheduleSub:['Pick a new day and slot. The worker is told straight away.','नया दिन और समय चुनें। कारीगर को तुरंत बता दिया जाएगा।','નવો દિવસ અને સમય પસંદ કરો. કારીગરને તરત જાણ કરાશે.'],
  saveChange:['Save change','बदलाव सहेजें','ફેરફાર સાચવો'],
  rescheduleDone:['Moved to {when}.','{when} पर खिसकाया।','{when} પર ખસેડ્યું.'],
  cannotReschedule:['Work has already started, so the time cannot be changed. Call the worker instead.','काम शुरू हो चुका है, समय नहीं बदल सकते। कारीगर को फ़ोन करें।','કામ શરૂ થઈ ગયું છે, સમય બદલી શકાતો નથી. કારીગરને ફોન કરો.'],
  scheduledFor:['Scheduled for','तय समय','નક્કી સમય'],
  change:['Change','बदलें','બદલો'],
  nfMoved:['Booking {id} moved to {when}.','बुकिंग {id} {when} पर खिसकी।','બુકિંગ {id} {when} પર ખસી.'],

  /* empty states and fixes */
  noBookingYet:['Nothing to track yet','अभी ट्रैक करने को कुछ नहीं','હજી ટ્રૅક કરવા કંઈ નથી'],
  noBookingYetSub:['Book a service and you can follow the worker here, step by step.','सेवा बुक करें, फिर कारीगर को यहाँ क़दम-दर-क़दम देखें।','સેવા બુક કરો, પછી કારીગરને અહીં પગલે-પગલે જુઓ.'],
  bookNow:['Book a service','सेवा बुक करें','સેવા બુક કરો'],
  noHistoryYet:['Your completed and running bookings will be listed here.','आपकी पूरी और चालू बुकिंग यहाँ दिखेंगी।','તમારી પૂરી અને ચાલુ બુકિંગ અહીં દેખાશે.'],
  noMatch:['No service matches that word.','उस शब्द से कोई सेवा नहीं मिली।','એ શબ્દથી કોઈ સેવા મળી નથી.'],
  hiddenFromFeed:['Hidden from your list.','आपकी सूची से हटाया।','તમારી યાદીમાંથી હટાવ્યું.'],
  surgeLine:['Emergency fee','आपातकालीन शुल्क','તાત્કાલિક ફી'],
  yourTake:['Your take-home','आपके हाथ में','તમારા હાથમાં'],
  forYourTrade:['Requests for your trade in your wards.','आपके काम और वार्ड के अनुरोध।','તમારા કામ અને વૉર્ડની વિનંતીઓ.'],
  descPlaceholder:['Tell the worker what is wrong','कारीगर को बताएँ क्या ख़राब है','કારીગરને જણાવો શું બગડ્યું છે'],
};
const LANGS = ['EN', 'हिंदी', 'ગુજરાતી'];

/* ---------------------------------------------------------------- utilities */
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0;
  let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const R = rng(20260906);
const pick = a => a[Math.floor(R() * a.length)];
const hashCode = s => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
const fmt = (s, vars = {}) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

/* Money is derived from live policy + wage floor, never read from a stored total.
   That is what makes an admin change ripple into every other role at once. */
const workerPctOf = p => 100 - p.welfare - p.society - p.platform;

/* ============================================================= TASK ARTWORK */
/* Flat inline illustrations, one per trade. No external assets. */
const ART = {
  electrician: (
    <g>
      <rect x="26" y="18" width="34" height="46" rx="4" fill="#fff" stroke={T.slate} strokeWidth="2.5" />
      <circle cx="36" cy="32" r="4" fill={T.gold} /><circle cx="50" cy="32" r="4" fill={T.green} />
      <rect x="33" y="44" width="20" height="4" rx="2" fill={T.line} />
      <rect x="33" y="52" width="14" height="4" rx="2" fill={T.line} />
      <path d="M76 22 v14 a10 10 0 0 1-20 0 V22" fill="none" stroke={T.green} strokeWidth="2.5" />
      <path d="M62 22 v-8 M70 22 v-8" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M68 50 l-6 10 h6 l-4 10" fill="none" stroke={T.gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>),
  plumber: (
    <g>
      <path d="M20 54 h20 v-20 h18" fill="none" stroke={T.slate} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="54" y="24" width="22" height="12" rx="3" fill={T.green} />
      <circle cx="65" cy="20" r="6" fill={T.slate} />
      <circle cx="65" cy="52" r="6" fill={T.green} opacity="0.35" />
      <path d="M65 42 c4 5 6 8 6 11 a6 6 0 0 1-12 0 c0-3 2-6 6-11z" fill={T.green} />
      <rect x="16" y="60" width="60" height="6" rx="3" fill={T.line} />
    </g>),
  carpenter: (
    <g>
      <rect x="16" y="46" width="64" height="12" rx="2" fill={T.gold} opacity="0.35" />
      <rect x="16" y="58" width="64" height="8" rx="2" fill={T.gold} opacity="0.55" />
      <path d="M22 40 L66 18" stroke={T.slate} strokeWidth="3" />
      <path d="M22 40 L66 18 L70 26 L26 47 Z" fill={T.line} stroke={T.slate} strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 44 l3-4 M35 40 l3-4 M42 36 l3-4 M49 32 l3-4 M56 28 l3-4" stroke={T.slate} strokeWidth="1.5" />
      <rect x="14" y="38" width="12" height="8" rx="2" fill={T.green} transform="rotate(-27 20 42)" />
    </g>),
  painter: (
    <g>
      <rect x="18" y="16" width="42" height="42" rx="3" fill={T.greenLt} stroke={T.line} strokeWidth="2" />
      <rect x="18" y="16" width="42" height="20" rx="3" fill={T.green} opacity="0.5" />
      <rect x="58" y="22" width="18" height="9" rx="3" fill={T.slate} />
      <path d="M67 31 v10" stroke={T.slate} strokeWidth="3" />
      <path d="M67 41 c0 8-8 10-8 18" fill="none" stroke={T.slate} strokeWidth="3" strokeLinecap="round" />
      <rect x="54" y="60" width="12" height="8" rx="2" fill={T.gold} />
    </g>),
  domestic: (
    <g>
      <path d="M56 14 v28" stroke={T.slate} strokeWidth="4" strokeLinecap="round" />
      <path d="M44 42 h24 l-4 22 h-16 z" fill={T.gold} opacity="0.7" />
      <path d="M48 50 h16" stroke={T.slate} strokeWidth="2" />
      <rect x="16" y="40" width="24" height="24" rx="3" fill={T.green} opacity="0.25" stroke={T.green} strokeWidth="2" />
      <path d="M16 48 h24" stroke={T.green} strokeWidth="2" />
      <circle cx="28" cy="36" r="4" fill="none" stroke={T.green} strokeWidth="2" />
    </g>),
  caregiver: (
    <g>
      <circle cx="34" cy="28" r="9" fill={T.greenLt} stroke={T.green} strokeWidth="2.5" />
      <path d="M20 62 c0-9 6-15 14-15 s14 6 14 15" fill={T.greenLt} stroke={T.green} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M64 30 c-4-5-12-3-12 4 c0 6 8 11 12 15 c4-4 12-9 12-15 c0-7-8-9-12-4z" fill={T.brick} opacity="0.75" />
      <path d="M50 54 h22" stroke={T.line} strokeWidth="3" strokeLinecap="round" />
    </g>),
  driver: (
    <g>
      <circle cx="48" cy="40" r="22" fill="none" stroke={T.slate} strokeWidth="5" />
      <circle cx="48" cy="40" r="7" fill={T.slate} />
      <path d="M48 33 V20 M41 45 L28 56 M55 45 L68 56" stroke={T.slate} strokeWidth="4" strokeLinecap="round" />
      <path d="M26 18 h20 l4 8 H22 z" fill={T.green} opacity="0.5" />
    </g>),
  gardener: (
    <g>
      <path d="M44 62 V38" stroke={T.green} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 44 c-12 0-16-8-16-14 c10 0 16 6 16 14z" fill={T.green} opacity="0.8" />
      <path d="M44 38 c12 0 17-8 17-15 c-11 0-17 7-17 15z" fill={T.green} opacity="0.55" />
      <rect x="30" y="60" width="30" height="6" rx="3" fill={T.gold} opacity="0.6" />
      <path d="M66 30 h10 v14 h-14 v-8 z" fill={T.slate} opacity="0.85" />
      <path d="M62 32 l-8-6" stroke={T.slate} strokeWidth="3" strokeLinecap="round" />
    </g>),
  cleaning: (
    <g>
      <rect x="30" y="26" width="20" height="30" rx="4" fill={T.greenLt} stroke={T.green} strokeWidth="2.5" />
      <rect x="34" y="16" width="12" height="10" rx="2" fill={T.slate} />
      <path d="M46 20 h10 l-4 6" fill="none" stroke={T.slate} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 24 l4 4 M68 34 l5 2 M64 44 l4 5" stroke={T.gold} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60 16 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6-4.4 -4.4-1.6 4.4-1.6z" fill={T.gold} />
      <rect x="26" y="60" width="28" height="6" rx="3" fill={T.line} />
    </g>),
  appliance: (
    <g>
      <rect x="22" y="16" width="40" height="48" rx="5" fill="#fff" stroke={T.slate} strokeWidth="2.5" />
      <circle cx="42" cy="42" r="13" fill={T.greenLt} stroke={T.green} strokeWidth="2.5" />
      <circle cx="42" cy="42" r="5" fill={T.green} opacity="0.4" />
      <circle cx="31" cy="24" r="3" fill={T.gold} /><circle cx="41" cy="24" r="3" fill={T.line} />
      <path d="M66 30 a8 8 0 0 0 10 10 l6 10 -6 5 -9-11 a8 8 0 0 0-1-14z" fill={T.slate} opacity="0.8" />
    </g>),
  pest: (
    <g>
      <ellipse cx="40" cy="44" rx="12" ry="15" fill={T.slate} opacity="0.8" />
      <circle cx="40" cy="27" r="7" fill={T.slate} />
      <path d="M28 34 l-9-5 M28 44 h-11 M28 54 l-9 6 M52 34 l9-5 M52 44 h11 M52 54 l9 6" stroke={T.slate} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 22 l-4-7 M44 22 l4-7" stroke={T.slate} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M64 14 l3 4 M72 20 l4 2 M66 28 l4 4" stroke={T.brick} strokeWidth="3" strokeLinecap="round" />
    </g>),
};

function TaskArt({ cat, h = 92, className = '' }) {
  const [a, b] = tintOf(cat);
  return (
    <div className={'rounded-lg overflow-hidden ' + className}
      style={{ background: `linear-gradient(150deg, ${a} 0%, ${b} 100%)`, height: h }}>
      <svg viewBox="0 0 96 80" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {ART[cat] || ART.plumber}
      </svg>
    </div>
  );
}

/* App mark, drawn from the Synapse signal-dots idea: two nodes, one gap. */
function SahKaarMark({ size = 28, radius = 8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ display: 'block' }}>
      <rect width="32" height="32" rx={radius} fill={T.synNavy} />
      <line x1="13.5" y1="16" x2="18.5" y2="16" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.6"
        strokeLinecap="round" strokeDasharray="1.4 2.2" />
      <circle cx="10.5" cy="16" r="3.4" fill="#FFFFFF" />
      <circle cx="21.5" cy="16" r="3.4" fill={T.synOrange} />
    </svg>
  );
}

/* -------------------------------------------------------------- photo input */
/* Optionally controlled: when the parent owns `value`, the attached photos
   survive the parent re-rendering (the live feed re-renders every few seconds). */
function PhotoPicker({ t, label, onAdded, value, onChange }) {
  const [own, setOwn] = useState([]);
  const shots = value ?? own;
  const setShots = onChange ?? setOwn;
  const inputId = useMemo(() => 'ph' + Math.random().toString(36).slice(2, 9), []);
  const handle = e => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => {
      const r = new FileReader();
      r.onload = () => { setShots(s => [...s, { id: f.name + Date.now() + Math.random(), url: r.result }]); if (onAdded) onAdded(); };
      r.readAsDataURL(f);
    });
    e.target.value = '';
  };
  return (
    <div className="mb-4">
      <input id={inputId} type="file" accept="image/*" multiple capture="environment" onChange={handle} className="hidden" />
      <label htmlFor={inputId} className="w-full p-4 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        style={{ border: `1px dashed ${T.line}`, color: T.muted, background: T.card }}>
        <Camera size={17} />
        <span className="bdy text-sm">{label}</span>
      </label>
      {shots.length > 0 && (
        <>
          <div className="flex gap-2 mt-2.5 flex-wrap">
            {shots.map(s => (
              <div key={s.id} className="relative">
                <img src={s.url} alt="" className="rounded-lg object-cover"
                  style={{ width: 64, height: 64, border: `1px solid ${T.line}` }} />
                <button onClick={() => setShots(x => x.filter(y => y.id !== s.id))} aria-label={t('removePhoto')}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full grid place-items-center dsp"
                  style={{ background: T.brick, color: '#fff', fontSize: 13, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
          <div className="bdy text-xs mt-2" style={{ color: T.green }}>
            {shots.length} {t('photosAttached')}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------- Synapse maker mark */
function SynapseMark({ scale = 1, descriptor = true, light = false }) {
  const navy = light ? '#FFFFFF' : T.synNavy;
  return (
    <div className="inline-block leading-none" style={{ verticalAlign: 'middle' }}>
      <div className="dsp inline-flex items-baseline"
        style={{ fontSize: 17 * scale, fontWeight: 600, color: navy, letterSpacing: '-0.03em' }}>
        synapse
        <span className="inline-block"
          style={{ width: 4.2 * scale, height: 4.2 * scale, borderRadius: '50%',
                   background: T.synOrange, marginLeft: 3 * scale }} />
      </div>
      {descriptor && (
        <div className="bdy" style={{ fontSize: 6.4 * scale, letterSpacing: 2.5 * scale,
          color: light ? 'rgba(255,255,255,.65)' : 'rgba(28,58,94,.62)', marginTop: 3 * scale, fontWeight: 500 }}>
          TOWARDS INTELLIGENCE
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- master data */
const CATS = [
  { id: 'electrician', n: ['Electrician','इलेक्ट्रीशियन','ઇલેક્ટ્રિશિયન'], Icon: Plug,       rate: 320 },
  { id: 'plumber',     n: ['Plumber','प्लंबर','પ્લમ્બર'],                    Icon: Droplet,    rate: 300 },
  { id: 'carpenter',   n: ['Carpenter','बढ़ई','સુથાર'],                      Icon: Hammer,     rate: 340 },
  { id: 'painter',     n: ['Painter','पेंटर','રંગારો'],                      Icon: Paintbrush, rate: 280 },
  { id: 'domestic',    n: ['Domestic help','घरेलू सहायक','ઘરકામ મદદ'],       Icon: HomeIcon,   rate: 200 },
  { id: 'caregiver',   n: ['Elder care','वृद्ध देखभाल','વૃદ્ધ સંભાળ'],       Icon: HeartPulse, rate: 260 },
  { id: 'driver',      n: ['Driver','ड्राइवर','ડ્રાઇવર'],                    Icon: Car,        rate: 240 },
  { id: 'gardener',    n: ['Gardener','माली','માળી'],                        Icon: Flower2,    rate: 220 },
  { id: 'cleaning',    n: ['Deep cleaning','गहरी सफ़ाई','ઊંડી સફાઈ'],        Icon: Sparkles,   rate: 300 },
  { id: 'appliance',   n: ['Appliance repair','उपकरण मरम्मत','ઉપકરણ સમારકામ'], Icon: Wrench,   rate: 360 },
  { id: 'pest',        n: ['Pest control','कीट नियंत्रण','જીવાત નિયંત્રણ'],  Icon: Bug,        rate: 380 },
];
const catOf = id => CATS.find(c => c.id === id) || CATS[0];

const SOCIETIES = [
  { id: 'srt', district: ['Surat','सूरत','સુરત'], name: ['Surat Labour Cooperative Society','सूरत श्रम सहकारी समिति','સુરત શ્રમ સહકારી મંડળી'], wards: ['Adajan','Katargam','Varachha'] },
  { id: 'amd', district: ['Ahmedabad','अहमदाबाद','અમદાવાદ'], name: ['Ahmedabad Labour Cooperative Society','अहमदाबाद श्रम सहकारी समिति','અમદાવાદ શ્રમ સહકારી મંડળી'], wards: ['Maninagar','Bopal','Naranpura'] },
  { id: 'rjt', district: ['Rajkot','राजकोट','રાજકોટ'], name: ['Rajkot Labour Cooperative Society','राजकोट श्रम सहकारी समिति','રાજકોટ શ્રમ સહકારી મંડળી'], wards: ['Kalawad Road','Gondal Road','Mavdi'] },
  { id: 'vdd', district: ['Vadodara','वडोदरा','વડોદરા'], name: ['Vadodara Labour Cooperative Society','वडोदरा श्रम सहकारी समिति','વડોદરા શ્રમ સહકારી મંડળી'], wards: ['Alkapuri','Gotri','Waghodia'] },
];
const socOf = id => SOCIETIES.find(s => s.id === id) || SOCIETIES[0];
const WARDS = SOCIETIES.flatMap(s => s.wards.map(w => ({ ward: w, soc: s.id })));

/* Approximate real-world coordinates for each ward, used to place the live
   tracking map. Close enough for a locality-level demo, not for turn-by-turn. */
const WARD_COORDS = {
  Adajan: [21.1959, 72.7933], Katargam: [21.2167, 72.8354], Varachha: [21.2196, 72.8468],
  Maninagar: [22.9968, 72.6047], Bopal: [23.0325, 72.4708], Naranpura: [23.0469, 72.5619],
  'Kalawad Road': [22.2916, 70.7833], 'Gondal Road': [22.2587, 70.7973], Mavdi: [22.2726, 70.7813],
  Alkapuri: [22.3103, 73.1712], Gotri: [22.3149, 73.1489], Waghodia: [22.3335, 73.2400],
};
const haversineKm = (a, b) => {
  const R2 = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b[0] - a[0]), dLng = toRad(b[1] - a[1]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return R2 * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
};
const SLOT_KEYS = ['slMorning', 'slAfternoon', 'slEvening', 'slNight'];
const SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];
const STATUSES = ['Requested', 'Assigned', 'On the way', 'In progress', 'Completed'];
const STATUS_KEYS = { 'Requested': 'sRequested', 'Assigned': 'sAssigned', 'On the way': 'sOnTheWay', 'In progress': 'sInProgress', 'Completed': 'sCompleted' };
const DOW_KEYS = [['Sun','रवि','રવિ'],['Mon','सोम','સોમ'],['Tue','मंगल','મંગળ'],['Wed','बुध','બુધ'],['Thu','गुरु','ગુરુ'],['Fri','शुक्र','શુક્ર'],['Sat','शनि','શનિ']];

const FIRST = ['Rameshbhai','Kiran','Jayesh','Nileshbhai','Dinesh','Hasmukh','Bhavesh','Alpesh','Mahesh','Vipul','Sanjay','Pravin','Ashok','Manoj','Rajesh'];
const FIRST_F = ['Kailashben','Manjula','Ranjanben','Savita','Hansaben','Daxaben','Nirmala','Jyotiben','Shardaben','Bhavna'];
const LAST = ['Patel','Solanki','Rathod','Vaghela','Chauhan','Makwana','Parmar','Desai','Prajapati','Chavda','Zala','Damor'];

/* Women are present in every trade, not only the ones they are stereotyped into.
   The weighting is uneven because the real workforce is uneven, but the
   women-only service must never dead-end, so each trade is topped up below. */
const FEMALE_P = {
  domestic: 0.88, caregiver: 0.82, cleaning: 0.70, gardener: 0.40, painter: 0.34,
  electrician: 0.30, appliance: 0.28, carpenter: 0.26, plumber: 0.26, pest: 0.24, driver: 0.22,
};

const WORKERS = Array.from({ length: 44 }, (_, i) => {
  const cat = CATS[i % CATS.length];
  const female = R() < (FEMALE_P[cat.id] ?? 0.3);
  const w = WARDS[Math.floor(R() * WARDS.length)];
  const jobs = 40 + Math.floor(R() * 460);
  return {
    id: 'W' + (1000 + i), name: (female ? pick(FIRST_F) : pick(FIRST)) + ' ' + pick(LAST),
    gender: female ? 'F' : 'M',
    cat: cat.id, soc: w.soc, ward: w.ward,
    rate: cat.rate + Math.round((R() - 0.5) * 60),
    rating: +(3.8 + R() * 1.2).toFixed(1), jobs, years: 1 + Math.floor(R() * 18),
    verified: R() > 0.12, instant: R() > 0.62,
    certs: [{ cat: cat.id, lvl: R() > 0.5 ? 'II' : 'I', issued: '2024', valid: '2027' }],
    welfare: Math.round(jobs * (18 + R() * 20)), insured: R() > 0.25, joined: 2018 + Math.floor(R() * 7),
    womenPref: true,
  };
});

/* Top up: every trade keeps at least one verified woman member, otherwise the
   women-only filter would show an empty list for that craft. */
CATS.forEach(c => {
  const inTrade = WORKERS.filter(w => w.cat === c.id);
  if (!inTrade.some(w => w.gender === 'F')) {
    const target = inTrade[0];
    target.gender = 'F';
    target.name = pick(FIRST_F) + ' ' + target.name.split(' ')[1];
  }
  const firstF = WORKERS.find(w => w.cat === c.id && w.gender === 'F');
  if (firstF) firstF.verified = true;
  /* Emergency and women-only must be combinable in every trade, otherwise the
     two filters together produce an empty list and look broken. */
  if (!inTrade.some(w => w.gender === 'F' && w.instant) && firstF) firstF.instant = true;
});

/* The worker persona for the demo is a certified woman carpenter in the same
   ward as the customer persona, so a job booked in one role actually reaches
   the other. The women-only rule is then visible from inside the worker app,
   not merely described from the customer's side. */
const DEMO_W = (() => {
  const i = WORKERS.findIndex(w => w.gender === 'F' && w.verified && w.cat === 'carpenter');
  return i >= 0 ? i : WORKERS.findIndex(w => w.gender === 'F' && w.verified);
})();
Object.assign(WORKERS[DEMO_W], { verified: true, insured: true, soc: 'srt', ward: 'Adajan' });
const FEMALE_COUNT = WORKERS.filter(w => w.gender === 'F').length;
const trust = w => Math.min(99, Math.round(
  (w.verified ? 30 : 8) + (w.rating / 5) * 34 + Math.min(20, w.jobs / 25) + Math.min(16, w.years * 1.4)));

const CUSTOMERS = ['Meera Shah','Anil Trivedi','Foram Joshi','Ketan Mehta','Rina Bhatt','Sunil Kapadia','Hetal Doshi','Paresh Amin'];
const REVIEWER_NAMES = ['Meera S.','Anil T.','Foram J.','Ketan M.','Rina B.','Sunil K.','Hetal D.','Paresh A.','Nita V.','Ashwin P.','Komal R.','Yash S.','Bhoomi T.','Rakesh J.'];
const REVIEW_POOL = [
  [['Punctual, explained the fault clearly before starting.','समय पर आए, काम शुरू करने से पहले ख़राबी ठीक से समझाई।','સમયસર આવ્યા, કામ શરૂ કરતાં પહેલાં ખામી બરાબર સમજાવી.'], 5],
  [['Good work, cleaned up after finishing.','अच्छा काम, ख़त्म करने के बाद सफ़ाई भी की।','સારું કામ, પૂરું કર્યા પછી સફાઈ પણ કરી.'], 4],
  [['A bit late but the job itself was solid.','थोड़ा देर से आए पर काम पक्का था।','થોડા મોડા આવ્યા પણ કામ મજબૂત હતું.'], 4],
  [['Fixed it in twenty minutes, fair price.','बीस मिनट में ठीक कर दिया, दाम भी सही।','વીસ મિનિટમાં ઠીક કરી દીધું, ભાવ પણ વ્યાજબી.'], 5],
  [['Had to call back the next day for the same issue.','अगले दिन फिर वही समस्या के लिए बुलाना पड़ा।','બીજા દિવસે ફરી એ જ સમસ્યા માટે બોલાવવા પડ્યા.'], 3],
  [['Very polite, showed the old part before replacing it.','बहुत विनम्र, पुराना पुर्ज़ा बदलने से पहले दिखाया।','ખૂબ નમ્ર, જૂનો ભાગ બદલતાં પહેલાં બતાવ્યો.'], 5],
  [['Work was fine, took a little longer than quoted.','काम ठीक था, बताए गए समय से थोड़ा ज़्यादा लगा।','કામ બરાબર હતું, કહેલા સમય કરતાં થોડું વધારે લાગ્યું.'], 4],
  [['Excellent — would book again without a second thought.','बेहतरीन — बिना सोचे फिर से बुक करूँगी।','ઉત્તમ — ફરી વિચાર્યા વગર બુક કરીશ.'], 5],
  [['Knew the work well, kept the site tidy.','काम की अच्छी समझ थी, जगह साफ़ रखी।','કામની સારી સમજ હતી, જગ્યા સ્વચ્છ રાખી.'], 5],
  [['Reasonable job, nothing extraordinary.','ठीक-ठाक काम, कुछ ख़ास नहीं।','ઠીક-ઠાક કામ, કંઈ ખાસ નહીં.'], 3],
  [['Came within the hour during an emergency call.','आपातकाल में एक घंटे के अंदर आ गए।','કટોકટીમાં એક કલાકની અંદર આવી ગયા.'], 5],
  [['Charged exactly the quoted rate, no surprises.','बताई गई दर ही ली, कोई छिपा खर्च नहीं।','કહેલો દર જ લીધો, કોઈ છુપો ખર્ચ નહીં.'], 5],
  [['Job got done, but arrived without calling first.','काम हो गया, पर बिना फ़ोन किए आ गए।','કામ થઈ ગયું, પણ ફોન કર્યા વગર આવ્યા.'], 3],
  [['Careful with the furniture while working.','काम के दौरान फ़र्नीचर का ध्यान रखा।','કામ દરમિયાન ફર્નિચરનું ધ્યાન રાખ્યું.'], 4],
];
const reviewsFor = w => {
  const r = rng(hashCode(w.id + 'rv'));
  const count = 2 + (r() > 0.5 ? 1 : 0);
  const used = new Set();
  const out = [];
  while (out.length < count && used.size < REVIEW_POOL.length) {
    const i = Math.floor(r() * REVIEW_POOL.length);
    if (used.has(i)) continue;
    used.add(i);
    const [tx, baseStars] = REVIEW_POOL[i];
    const stars = Math.max(3, Math.min(5, Math.round(baseStars * 0.4 + w.rating * 0.6)));
    out.push({ tx, stars, name: REVIEWER_NAMES[Math.floor(r() * REVIEWER_NAMES.length)] });
  }
  return out;
};
const ISSUES = [
  ['Kitchen tap leaking since morning','सुबह से रसोई का नल टपक रहा है','સવારથી રસોડાનો નળ ટપકે છે'],
  ['Two ceiling fans not starting','दो पंखे चालू नहीं हो रहे','બે પંખા ચાલુ થતા નથી'],
  ['Wardrobe door hinge broken','अलमारी का कब्ज़ा टूटा है','કબાટનો મિજાગરો તૂટ્યો છે'],
  ['Bedroom wall repaint, 120 sq ft','बेडरूम की दीवार, 120 वर्गफुट','બેડરૂમની દીવાલ, 120 ચોરસફૂટ'],
  ['Monthly deep clean, 2BHK','मासिक गहरी सफ़ाई, 2BHK','માસિક ઊંડી સફાઈ, 2BHK'],
  ['Elder care, 4 hours daily','वृद्ध देखभाल, रोज़ 4 घंटे','વૃદ્ધ સંભાળ, રોજ 4 કલાક'],
  ['Geyser not heating','गीज़र गर्म नहीं कर रहा','ગીઝર ગરમ કરતું નથી'],
  ['Cockroach treatment, kitchen','रसोई में कॉकरोच उपचार','રસોડામાં વંદા સારવાર'],
];

/* Booking dates are real offsets from today, so the schedule the customer picks
   and the schedule the worker reads are the same object. */
const dayOffsetLabel = (off, lang) => {
  if (off === 0) return D.dToday[lang];
  if (off === 1) return D.dTomorrow[lang];
  const d = new Date(); d.setDate(d.getDate() + off);
  return d.toLocaleDateString(['en-IN', 'hi-IN', 'gu-IN'][lang], { day: 'numeric', month: 'short' });
};
const whenLabel = (b, lang) => dayOffsetLabel(b.dayOff ?? 1, lang) + ' · ' + D[SLOT_KEYS[Math.max(0, SLOTS.indexOf(b.slot))]][lang];
const doorCodeFor = id => String(1000 + (hashCode(id + 'door') % 9000));

let bkSeq = 4200;
const mkBooking = () => {
  const w = WORKERS[Math.floor(R() * WORKERS.length)];
  const hrs = 1 + Math.floor(R() * 3);
  /* Invariant: a women-only booking can only ever sit with a woman member. */
  const womenOnly = w.gender === 'F' && R() > 0.55;
  return { id: 'BK' + (bkSeq++), workerId: w.id, cat: w.cat, soc: w.soc, ward: w.ward,
    customer: pick(CUSTOMERS), issue: pick(ISSUES), hours: hrs, base: w.rate * hrs, surge: 0,
    slot: SLOTS[Math.floor(R() * 4)], dayOff: Math.floor(R() * 5), emergency: R() > 0.85, womenOnly,
    status: STATUSES[Math.floor(R() * 5)], rated: R() > 0.5, stars: 4 + Math.round(R()) };
};
const SEED_BOOKINGS = Array.from({ length: 64 }, () => mkBooking());
SEED_BOOKINGS.forEach((b, i) => {
  if (i % 4 === 1) {
    const w = WORKERS[DEMO_W];
    b.workerId = w.id; b.cat = w.cat; b.soc = w.soc; b.ward = w.ward; b.base = w.rate * b.hours;
    if (b.status === 'Requested') b.status = 'Completed';
  }
});
/* The customer persona starts with a short history of her own, so "Your
   bookings" and "Book again" are truthful rather than showing other people's. */
(() => {
  const mineIdx = [3, 7, 11, 15];
  const wantStatus = ['In progress', 'Completed', 'Completed', 'Completed'];
  mineIdx.forEach((ix, k) => {
    const b = SEED_BOOKINGS[ix];
    if (!b) return;
    const w = WORKERS.find(x => x.id === b.workerId);
    b.mine = true; b.customer = 'You'; b.soc = 'srt'; b.ward = 'Adajan';
    b.status = wantStatus[k];
    b.rated = k > 1; b.dayOff = k === 0 ? 0 : 0;
    b.womenOnly = w ? w.gender === 'F' && k === 1 : false;
  });
})();

const GK = ['gWage', 'gUnsafe', 'gComplaint', 'gDelay'];
const GNOTES = [
  ['Customer paid less than the booked amount.','ग्राहक ने बुक की गई राशि से कम दी।','ગ્રાહકે બુક કરેલી રકમથી ઓછું આપ્યું.'],
  ['No safe ladder access at the site.','साइट पर सुरक्षित सीढ़ी नहीं थी।','સાઇટ પર સુરક્ષિત નિસરણી નહોતી.'],
  ['Asked to work two extra hours without pay.','बिना भुगतान दो अतिरिक्त घंटे काम कराया।','ચુકવણી વગર બે વધારાના કલાક કામ કરાવ્યું.'],
  ['Payment pending for nine days.','नौ दिन से भुगतान लंबित है।','નવ દિવસથી ચુકવણી બાકી છે.'],
];
const SEED_GRIEVANCES = Array.from({ length: 9 }, (_, i) => {
  const w = WORKERS[Math.floor(R() * WORKERS.length)];
  return { id: 'GR' + (300 + i), workerId: w.id, soc: w.soc, kind: pick(GK), note: pick(GNOTES),
    raisedDays: 1 + Math.floor(R() * 9), slaDays: 1 + Math.floor(R() * 6),
    status: pick(['gOpen', 'gOpen', 'gReview', 'gResolved']) };
});

const SEED_ONBOARD = Array.from({ length: 6 }, (_, i) => ({
  id: 'ON' + (700 + i), name: pick(R() > 0.6 ? FIRST_F : FIRST) + ' ' + pick(LAST),
  cat: pick(CATS).id, soc: pick(SOCIETIES).id, ward: pick(WARDS).ward,
  docsOk: 1 + Math.floor(R() * 3), years: 1 + Math.floor(R() * 14),
}));

/* ---------------------------------------- 90 days of demand, then a forecast */
const HIST = (() => {
  const rows = [];
  for (let d = 89; d >= 0; d--) {
    const dow = (d + 3) % 7;
    const weekend = dow === 0 || dow === 6 ? 1.55 : 1;
    const festival = d > 20 && d < 27 ? 1.4 : 1;
    const trend = 1 + (89 - d) * 0.0022;
    WARDS.forEach((w, wi) => SLOTS.forEach((s, si) => {
      const base = 3.1 * [0.9, 0.7, 1.5, 0.35][si] * (0.7 + ((wi * 7) % 10) / 10) * weekend * festival * trend;
      rows.push({ d, dow, ward: w.ward, soc: w.soc, slot: s, n: Math.max(0, Math.round(base + (R() - 0.5) * 2)) });
    }));
  }
  return rows;
})();

const FORECAST = (() => {
  const bucket = {};
  HIST.filter(r => r.d < 84).forEach(r => {
    const k = r.ward + '|' + r.dow + '|' + r.slot; (bucket[k] = bucket[k] || []).push(r.n);
  });
  const recent = HIST.filter(r => r.d < 14).reduce((a, r) => a + r.n, 0) / 14;
  const older = HIST.filter(r => r.d >= 70).reduce((a, r) => a + r.n, 0) / 20;
  const trend = older > 0 ? recent / older : 1;
  const out = [];
  for (let day = 0; day < 7; day++) {
    const dow = (day + 4) % 7;
    WARDS.forEach(w => SLOTS.forEach(s => {
      const arr = bucket[w.ward + '|' + dow + '|' + s] || [0];
      out.push({ day, dow, ward: w.ward, soc: w.soc, slot: s,
        demand: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * trend) });
    }));
  }
  return out;
})();

/* HIST is 4,320 static rows. Both dashboards used to rescan it on every render
   — with the live feed re-rendering every few seconds that was tens of
   thousands of comparisons a tick. It never changes, so roll it up once. */
const WARD_30D = (() => {
  const m = {};
  HIST.forEach(r => { if (r.d < 30) m[r.ward] = (m[r.ward] || 0) + r.n; });
  return m;
})();
const DAY_TOTALS = (() => {
  const m = {};
  HIST.forEach(r => { m[r.d] = (m[r.d] || 0) + r.n; });
  return m;
})();
const DEMAND_SERIES = Array.from({ length: 45 }, (_, i) => {
  const d = 89 - i * 2; return { d: 'D-' + d, n: DAY_TOTALS[d] || 0 };
});

const supplyFor = (ward, slot) => {
  const base = WORKERS.filter(w => w.ward === ward).length * 1.8;
  return Math.max(1, Math.round(base * { Morning: 0.85, Afternoon: 0.75, Evening: 0.6, Night: 0.3 }[slot]));
};

const rateOf = (w, floor) => Math.max(w.rate, floor[w.cat] ?? catOf(w.cat).rate);
const baseOf = (b, floor) => {
  const w = WORKERS.find(x => x.id === b.workerId);
  return w ? rateOf(w, floor) * b.hours : b.base;
};

/* ================================================================ primitives */
const Card = ({ children, className = '', style = {}, raise = 1, ...p }) => (
  <div className={'rounded-xl ' + className}
    style={{ background: T.card, border: `1px solid ${T.line}`, boxShadow: raise === 0 ? 'none' : raise === 2 ? T.sh2 : T.sh1, ...style }} {...p}>{children}</div>
);

const Btn = ({ children, kind = 'primary', size = 'md', className = '', style = {}, disabled, ...p }) => {
  const base = {
    primary: { background: `linear-gradient(180deg, ${T.greenMid}, ${T.green})`, color: '#fff', border: '1px solid ' + T.greenDeep, boxShadow: '0 1px 2px rgba(6,75,55,.28)' },
    gold: { background: `linear-gradient(180deg, #E0A926, ${T.gold})`, color: '#2A2208', border: '1px solid #A87A15', boxShadow: '0 1px 2px rgba(122,90,12,.25)' },
    plum: { background: `linear-gradient(180deg, ${T.plumMid}, ${T.plum})`, color: '#fff', border: '1px solid ' + T.plumDeep, boxShadow: '0 1px 2px rgba(100,42,78,.28)' },
    ghost: { background: T.card, color: T.ink2, border: `1px solid ${T.line}` },
    danger: { background: `linear-gradient(180deg, #C24634, ${T.brick})`, color: '#fff', border: '1px solid #8E2C20' },
  }[kind];
  const pad = size === 'lg' ? 'px-5 py-3.5 text-base' : size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm';
  return <button disabled={disabled} className={`bdy btn rounded-lg font-medium ${pad} ${className}`}
    style={{ ...base, transition: 'filter .15s ease, transform .1s ease, opacity .15s ease', ...style }} {...p}>{children}</button>;
};

const Pill = ({ children, tone = 'green', className = '' }) => {
  const c = { green: [T.greenLt, T.green], gold: [T.goldLt, T.goldDeep], brick: [T.brickLt, T.brick],
    plum: [T.plumLt, T.plum], grey: ['#EBF0ED', T.muted] }[tone];
  return <span className={'bdy text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ' + className}
    style={{ background: c[0], color: c[1] }}>{children}</span>;
};

/* A women-only marker reads the same wherever it appears — customer, worker,
   society and federation all use this one component. */
const WomenTag = ({ label, size = 'sm' }) => (
  <span className="bdy inline-flex items-center gap-1 rounded-md font-medium whitespace-nowrap"
    style={{ background: T.plumLt, color: T.plum, fontSize: size === 'sm' ? 11 : 12, padding: size === 'sm' ? '3px 7px' : '5px 9px' }}>
    <ShieldCheck size={size === 'sm' ? 11 : 13} /> {label}
  </span>
);

const Stat = ({ label, value, sub, tone, accent }) => (
  <Card className="p-4 relative overflow-hidden">
    {accent && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent }} />}
    <div className="bdy text-xs mb-1" style={{ color: T.muted }}>{label}</div>
    <div className="dsp num text-2xl font-bold" style={{ color: tone || T.ink }}>{value}</div>
    {sub && <div className="bdy text-xs mt-1" style={{ color: T.muted }}>{sub}</div>}
  </Card>
);

const Stars = ({ n, size = 12 }) => (
  <span className="inline-flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => <Star key={i} size={size} fill={i <= Math.round(n) ? T.gold : 'none'} color={i <= Math.round(n) ? T.gold : T.line} />)}
  </span>
);

/* A labelled switch. Used for the emergency and women-only filters, which sit
   side by side and must read as equals rather than one being an afterthought. */
const ToggleRow = ({ on, onClick, Icon, title, sub, tone = 'green' }) => {
  const c = { green: [T.greenLt, T.green], brick: [T.brickLt, T.brick], plum: [T.plumLt, T.plum] }[tone];
  return (
    <button onClick={onClick} role="switch" aria-checked={on}
      className="w-full p-3 rounded-xl flex items-center gap-3 text-left tap"
      style={{ background: on ? c[0] : T.card, border: `1px solid ${on ? c[1] : T.line}`, boxShadow: on ? 'none' : T.sh1 }}>
      <Icon size={17} color={on ? c[1] : T.muted} className="shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="bdy text-sm font-medium" style={{ color: on ? c[1] : T.ink }}>{title}</div>
        <div className="bdy text-xs leading-snug" style={{ color: T.muted }}>{sub}</div>
      </div>
      <div className="w-9 h-5 rounded-full p-0.5 shrink-0" style={{ background: on ? c[1] : T.line, transition: 'background .18s ease' }}>
        <div className="w-4 h-4 rounded-full bg-white" style={{ marginLeft: on ? 16 : 0, transition: 'margin .18s ease' }} />
      </div>
    </button>
  );
};

/* Phone-style bottom bar for the customer and worker apps. The active item
   carries a filled marker so the current place is readable at a glance. */
const BottomNav = ({ nav, tab, t, onPick, max = 720 }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-20" style={{ background: T.card, borderTop: `1px solid ${T.line}`, boxShadow: '0 -2px 12px rgba(12,30,25,.06)' }}>
    <div className="flex mx-auto" style={{ maxWidth: max }}>
      {nav.map(n => {
        const on = tab === n.id;
        return (
          <button key={n.id} onClick={() => onPick(n.id)} className="flex-1 py-2 flex flex-col items-center gap-0.5 tap"
            style={{ color: on ? T.green : T.muted }} aria-current={on ? 'page' : undefined}>
            <span className="px-4 py-1 rounded-full" style={{ background: on ? T.greenLt : 'transparent', transition: 'background .18s ease' }}>
              <n.Icon size={18} />
            </span>
            <span className="bdy text-center leading-tight px-0.5" style={{ fontSize: 9.5, fontWeight: on ? 600 : 400 }}>{t(n.k)}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

/* Consistent page header with a back control on every drilled-in screen. */
const PageTop = ({ title, sub, onBack, backLabel, right }) => (
  <div className="mb-4">
    {onBack && (
      <button onClick={onBack} className="bdy text-xs flex items-center gap-1 mb-3 px-2 py-1.5 -ml-2 rounded-lg"
        style={{ color: T.ink2, background: T.card, border: `1px solid ${T.line}` }}>
        <ChevronLeft size={14} /> {backLabel}
      </button>
    )}
    <div className="flex items-start justify-between gap-3">
      <div>
        {title && <h2 className="dsp text-xl font-bold" style={{ color: T.ink }}>{title}</h2>}
        {sub && <p className="bdy text-sm mt-1" style={{ color: T.muted, maxWidth: '70ch' }}>{sub}</p>}
      </div>
      {right}
    </div>
  </div>
);

function MoneyBar({ amount, policy, t, compare = true }) {
  const workerPct = 100 - policy.welfare - policy.society - policy.platform;
  const parts = [
    { k: t('workerEarnings'), pct: workerPct, c: T.green },
    { k: t('welfareFund'), pct: policy.welfare, c: T.gold },
    { k: t('societyOps'), pct: policy.society, c: T.slate },
    { k: t('platform'), pct: policy.platform, c: T.muted },
  ];
  const privWorker = 100 - policy.privateCommission;
  return (
    <div>
      <div className="flex rounded-lg overflow-hidden" style={{ height: 22 }}>
        {parts.map(p => <div key={p.k} className="moneybar-seg" style={{ width: p.pct + '%', background: p.c }} title={p.k} />)}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3">
        {parts.map(p => (
          <div key={p.k} className="flex items-center justify-between gap-2">
            <span className="bdy text-xs flex items-center gap-2" style={{ color: T.ink2 }}>
              <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.c }} />{p.k}
            </span>
            <span className="bdy num text-xs font-semibold shrink-0" style={{ color: T.ink }}>{inr(amount * p.pct / 100)}</span>
          </div>
        ))}
      </div>
      {compare && (
        <div className="mt-4 pt-4" style={{ borderTop: `1px dashed ${T.line}` }}>
          <div className="flex rounded-lg overflow-hidden opacity-60" style={{ height: 14 }}>
            <div className="moneybar-seg" style={{ width: privWorker + '%', background: T.muted }} />
            <div className="moneybar-seg" style={{ width: policy.privateCommission + '%', background: T.brick }} />
          </div>
          <div className="flex items-baseline justify-between gap-3 mt-2">
            <span className="bdy text-xs" style={{ color: T.muted }}>{t('privateWould')}</span>
            <span className="bdy num text-xs font-semibold shrink-0" style={{ color: T.brick }}>{inr(amount * privWorker / 100)}</span>
          </div>
          <div className="bdy text-xs mt-1.5 font-medium" style={{ color: T.green }}>
            {inr(amount * (workerPct - privWorker) / 100)} {t('moreInHand')}
          </div>
        </div>
      )}
    </div>
  );
}

function FakeQR({ text, size = 132 }) {
  const cells = 21;
  const grid = useMemo(() => {
    let h = 7; for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const r = rng(h); const g = [];
    for (let y = 0; y < cells; y++) { const row = [];
      for (let x = 0; x < cells; x++) {
        const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
        if (finder) { const lx = x > 13 ? x - 14 : x, ly = y > 13 ? y - 14 : y;
          row.push((lx === 0 || lx === 6 || ly === 0 || ly === 6) || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4) ? 1 : 0);
        } else row.push(r() > 0.52 ? 1 : 0);
      } g.push(row); } return g;
  }, [text]);
  const s = size / cells;
  return (
    <svg width={size} height={size} role="img" aria-label="Worker identity code">
      <rect width={size} height={size} fill="#fff" />
      {grid.map((row, y) => row.map((v, x) => v ? <rect key={x + '-' + y} x={x * s} y={y * s} width={s} height={s} fill={T.ink} /> : null))}
    </svg>
  );
}

/* A stylised local street map, used only if the live OpenStreetMap tile
   can't be reached (offline judging rooms, blocked network, etc). Seeded
   per-ward so it looks consistent rather than randomly reshuffling. */
function StylizedMap({ seed = 'x' }) {
  const grid = useMemo(() => {
    let h = 11; for (const ch of seed) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
    const r = rng(h);
    const roads = Array.from({ length: 5 }, (_, i) => ({
      y: 18 + i * 32 + (r() - 0.5) * 14, wobble: (r() - 0.5) * 16,
    }));
    const avenues = Array.from({ length: 4 }, (_, i) => ({
      x: 30 + i * 100 + (r() - 0.5) * 20, wobble: (r() - 0.5) * 14,
    }));
    const blocks = Array.from({ length: 22 }, () => ({
      x: r() * 400, y: r() * 176, w: 14 + r() * 22, h: 10 + r() * 16, rot: (r() - 0.5) * 4,
    }));
    const parkX = 60 + r() * 260, parkY = 30 + r() * 100;
    return { roads, avenues, blocks, parkX, parkY };
  }, [seed]);
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 176" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="176" fill="#E7EEE9" />
      {grid.blocks.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2" fill="#D8E3DC"
          transform={`rotate(${b.rot} ${b.x + b.w / 2} ${b.y + b.h / 2})`} />
      ))}
      <ellipse cx={grid.parkX} cy={grid.parkY} rx="34" ry="22" fill="#CFE3D2" />
      {grid.roads.map((rd, i) => (
        <path key={'r' + i} d={`M0,${rd.y} Q200,${rd.y + rd.wobble} 400,${rd.y}`} stroke="#F5F8F6" strokeWidth={i === 2 ? 6 : 4} fill="none" />
      ))}
      {grid.avenues.map((av, i) => (
        <path key={'a' + i} d={`M${av.x},0 Q${av.x + av.wobble},88 ${av.x},176`} stroke="#F5F8F6" strokeWidth={i === 1 ? 6 : 4} fill="none" />
      ))}
    </svg>
  );
}

/* ================================================================== LANDING */
function Landing({ onPick, t, lang, policy }) {
  const roles = [
    { id: 'customer', Icon: HomeIcon, k: 'rCustomer', d: 'dCustomer' },
    { id: 'worker', Icon: Briefcase, k: 'rWorker', d: 'dWorker' },
    { id: 'society', Icon: Building2, k: 'rSociety', d: 'dSociety' },
    { id: 'federation', Icon: Landmark, k: 'rFederation', d: 'dFederation' },
  ];
  return (
    <div className="min-h-screen" style={{ background: T.paper }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2.5 mb-10">
          <SahKaarMark size={36} radius={10} />
          <span className="dsp text-lg font-bold" style={{ color: T.ink }}>{t('appName')}</span>
        </div>

        <div className="grid md:grid-cols-5 gap-10 items-start mb-8">
          <div className="md:col-span-3">
            <h1 className="dsp font-bold leading-none mb-5" style={{ color: T.ink, fontSize: lang === 0 ? 46 : 38 }}>{t('heroTitle')}</h1>
            <p className="bdy text-base leading-relaxed mb-6" style={{ color: T.ink2, maxWidth: '56ch' }}>{t('heroBody')}</p>
            <div className="bdy text-xs" style={{ color: T.muted }}>
              SIH26089 · Ministry of Cooperation · National Council for Cooperative Training
            </div>
          </div>
          {/* The ledger reads from live policy, so a change made in the
              federation role is still true when you come back here. */}
          <Card className="md:col-span-2 p-5" raise={2}>
            <div className="bdy text-xs mb-1" style={{ color: T.muted }}>{t('heroJob')}</div>
            <div className="dsp num text-3xl font-bold mb-4" style={{ color: T.ink }}>₹800</div>
            <MoneyBar amount={800} t={t} policy={policy} />
          </Card>
        </div>

        {/* The women-only guarantee is stated before a role is chosen, because
            it is a property of the platform rather than one screen inside it. */}
        <div className="rounded-xl p-5 mb-12 flex items-start gap-4 flex-wrap"
          style={{ background: `linear-gradient(120deg, ${T.plumLt}, #FFFFFF 80%)`, border: `1px solid ${T.plum}33` }}>
          <div className="w-10 h-10 rounded-lg grid place-items-center shrink-0" style={{ background: T.plum }}>
            <ShieldCheck size={19} color="#fff" />
          </div>
          <div className="flex-1" style={{ minWidth: 260 }}>
            <div className="dsp font-semibold mb-1" style={{ color: T.plumDeep }}>{t('womenTitle')}</div>
            <div className="bdy text-sm leading-relaxed" style={{ color: T.ink2, maxWidth: '62ch' }}>{t('womenLead')}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="dsp num text-3xl font-bold" style={{ color: T.plum }}>{FEMALE_COUNT}</div>
            <div className="bdy text-xs" style={{ color: T.muted }}>{t('womenMembers')}</div>
          </div>
        </div>

        <div className="bdy text-sm mb-4 font-medium" style={{ color: T.ink2 }}>{t('openAs')}</div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {roles.map(r => (
            <button key={r.id} onClick={() => onPick(r.id)} className="text-left rounded-xl p-4 lift"
              style={{ background: T.card, border: `1px solid ${T.line}`, boxShadow: T.sh1 }}>
              <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: T.greenLt }}>
                <r.Icon size={18} color={T.green} />
              </div>
              <div className="dsp font-semibold mt-3 mb-1" style={{ color: T.ink }}>{t(r.k)}</div>
              <div className="bdy text-xs leading-relaxed" style={{ color: T.muted }}>{t(r.d)}</div>
              <div className="bdy text-xs mt-3 font-medium" style={{ color: T.green }}>{t('open')}</div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-6" style={{ borderTop: `1px solid ${T.line}` }}>
          <span className="bdy text-xs" style={{ color: T.muted }}>{t('poweredBy')}</span>
          <SynapseMark scale={1.15} />
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== SHELL */
function Shell({ roleKey, role, nav, tab, setTab, lang, setLang, onExit, children, toast, t, notifs, onReadAll, live, setLive }) {
  const [open, setOpen] = useState(false);
  const mine = notifs.filter(n => n.roles.includes(role));
  const unread = mine.filter(n => !n.read).length;
  const ago = ts => { const m = Math.floor((Date.now() - ts) / 60000); return m < 1 ? t('justNow') : m + t('minAgo'); };
  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.paper }}>
      <header className="flex items-center justify-between gap-3 px-4 py-3 sticky top-0 z-30"
        style={{ background: T.card, borderBottom: `1px solid ${T.line}` }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <SahKaarMark size={28} />
          <span className="dsp font-bold text-sm truncate" style={{ color: T.ink }}>{t('appName')}</span>
          <span className="bdy text-xs px-2 py-0.5 rounded shrink-0" style={{ background: T.greenLt, color: T.green }}>{t(roleKey)}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setLive(!live)} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bdy"
            style={{ border: `1px solid ${T.line}`, color: live ? T.green : T.muted, fontSize: 11 }}>
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: live ? T.green : T.muted }} />
            {live ? t('live') : t('paused')}
          </button>

          <div className="relative">
            <button onClick={() => setOpen(!open)} className="w-8 h-8 rounded-lg grid place-items-center relative"
              style={{ border: `1px solid ${T.line}`, color: T.ink2 }} aria-label={t('notifications')}>
              <Bell size={15} />
              {unread > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full grid place-items-center dsp num"
                  style={{ background: T.brick, color: '#fff', fontSize: 9 }}>{unread}</span>
              )}
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
                <div className="absolute right-0 mt-2 rounded-xl overflow-hidden z-40 shadow-lg"
                  style={{ width: 300, background: T.card, border: `1px solid ${T.line}` }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${T.line}` }}>
                    <span className="dsp text-sm font-semibold" style={{ color: T.ink }}>{t('notifications')}</span>
                    {unread > 0 && <button onClick={onReadAll} className="bdy text-xs" style={{ color: T.green }}>{t('markAllRead')}</button>}
                  </div>
                  <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {mine.length === 0
                      ? <div className="bdy text-xs p-4 text-center" style={{ color: T.muted }}>{t('noNotifs')}</div>
                      : mine.slice(0, 20).map(n => (
                        <div key={n.id} className="px-3 py-2.5 flex gap-2.5"
                          style={{ borderBottom: `1px solid ${T.line}`, background: n.read ? T.card : T.greenLt }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ background: n.read ? T.line : (n.tone === 'brick' ? T.brick : n.tone === 'gold' ? T.gold : T.green) }} />
                          <div className="min-w-0">
                            <div className="bdy text-xs leading-snug" style={{ color: T.ink }}>{fmt(t(n.k), n.v)}</div>
                            <div className="bdy text-xs mt-0.5" style={{ color: T.muted, fontSize: 10 }}>{ago(n.ts)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
            {LANGS.map((l, i) => (
              <button key={l} onClick={() => setLang(i)} className="bdy px-2.5 py-1.5" style={{ fontSize: 11,
                background: lang === i ? T.green : 'transparent', color: lang === i ? '#fff' : T.muted }}>{l}</button>
            ))}
          </div>
          <button onClick={onExit} className="bdy text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ border: `1px solid ${T.line}`, color: T.ink2 }}>
            <LogOut size={13} /><span className="hidden lg:inline">{t('switchRole')}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {nav && (
          <nav className="hidden md:flex flex-col w-56 shrink-0 p-3" style={{ borderRight: `1px solid ${T.line}`, background: T.card }}>
            <div className="flex-1">
              {nav.map(n => (
                <button key={n.id} onClick={() => setTab(n.id)}
                  className="w-full text-left bdy text-sm px-3 py-2.5 rounded-lg mb-1 flex items-center gap-2.5"
                  style={{ background: tab === n.id ? T.greenLt : 'transparent', color: tab === n.id ? T.green : T.ink2, fontWeight: tab === n.id ? 600 : 400 }}>
                  <n.Icon size={16} className="shrink-0" /> {t(n.k)}
                </button>
              ))}
            </div>
            <div className="pt-3 mt-3" style={{ borderTop: `1px solid ${T.line}` }}>
              <div className="bdy mb-1.5" style={{ fontSize: 10, color: T.muted }}>{t('poweredBy')}</div>
              <SynapseMark scale={0.95} />
            </div>
          </nav>
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {nav && (
        /* Scrolls rather than truncating — with slice(0,5) the last admin tabs
           were simply unreachable on a phone. */
        <nav className="md:hidden flex sticky bottom-0 z-20 navscroll" style={{ background: T.card, borderTop: `1px solid ${T.line}` }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} className="py-2 flex flex-col items-center gap-0.5 shrink-0 tap"
              style={{ color: tab === n.id ? T.green : T.muted, minWidth: 74 }} aria-current={tab === n.id ? 'page' : undefined}>
              <span className="px-3.5 py-1 rounded-full" style={{ background: tab === n.id ? T.greenLt : 'transparent' }}>
                <n.Icon size={18} />
              </span>
              <span className="bdy text-center leading-tight px-0.5" style={{ fontSize: 9, fontWeight: tab === n.id ? 600 : 400 }}>{t(n.k)}</span>
            </button>
          ))}
        </nav>
      )}

      {toast && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg bdy text-sm shadow-lg max-w-sm text-center"
          style={{ background: T.ink, color: '#fff' }}>{toast}</div>
      )}
    </div>
  );
}

/* ================================================================= CUSTOMER */
/* All volatile state lives on this component rather than inside the screens.
   The screens are re-created whenever the live feed ticks, so anything held
   inside them (a sort order, a half-typed review, an attached photo) would be
   thrown away every few seconds. */
function CustomerApp({ st, set, t, lang, toastFn, notify }) {
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([{ s: 'cats' }]);
  const view = stack[stack.length - 1];
  const push = v => setStack(s => [...s, v]);
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(null);
  const [emergency, setEmergency] = useState(false);
  const [womenOnly, setWomenOnly] = useState(false);
  const [voice, setVoice] = useState(false);
  const [payMethod, setPayMethod] = useState(0);
  const [reviewFor, setReviewFor] = useState(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('trust');
  const [mapFailed, setMapFailed] = useState(false);
  const [rating, setRating] = useState({ stars: 0, text: '' });
  const [reschedFor, setReschedFor] = useState(null);

  const nav = [
    { id: 'home', k: 'tabBook', Icon: Search }, { id: 'women', k: 'womenTab', Icon: ShieldCheck },
    { id: 'active', k: 'tabTrack', Icon: Activity },
    { id: 'history', k: 'tabHistory', Icon: FileText }, { id: 'inst', k: 'tabInst', Icon: Building2 },
  ];
  const floorFor = c => st.wageFloor[c] ?? catOf(c).rate;
  const effRate = w => rateOf(w, st.wageFloor);
  const val = b => baseOf(b, st.wageFloor);
  const cn = c => catOf(c).n[lang];
  const myBookings = st.bookings.filter(b => b.mine);

  /* One rule, used everywhere a worker list is built. */
  const eligible = w => (!emergency || w.instant) && (!womenOnly || w.gender === 'F');
  const countFor = c => WORKERS.filter(w => w.cat === c.id && eligible(w)).length;

  const startBooking = (w, hours = 2) => {
    setDraft({ w, hours, desc: '', photos: [], dayOff: 1, slot: 'Morning' });
    push({ s: 'book' }); setStep(1);
  };

  /* ------------------------------------------------------------------ home */
  const catsMatching = CATS.filter(c => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return c.n.some(n => n.toLowerCase().includes(q)) || c.id.includes(q);
  });

  const Home = () => (
    <div className="p-5 max-w-4xl mx-auto">
      <PageTop title={t('whatNeeds')} sub={WORKERS.filter(w => w.verified).length + ' ' + t('nearYou')} />
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: T.card, border: `1px solid ${T.line}`, boxShadow: T.sh1 }}>
          <Search size={16} color={T.muted} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('searchSvc')}
            className="bdy text-sm flex-1 outline-none" style={{ background: 'transparent', color: T.ink }} />
          {query && <button onClick={() => setQuery('')} aria-label={t('cancel')} style={{ color: T.muted }}><X size={14} /></button>}
        </div>
        <button onClick={() => setVoice(true)} className="px-3.5 rounded-lg grid place-items-center tap"
          style={{ background: T.goldLt, border: `1px solid ${T.gold}` }} aria-label={t('listening')}>
          <Mic size={17} color={T.goldDeep} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-2.5 mb-5">
        <ToggleRow on={emergency} onClick={() => setEmergency(!emergency)} Icon={Zap} tone="brick"
          title={t('emergTitle')} sub={t('emergSub')} />
        <ToggleRow on={womenOnly} onClick={() => setWomenOnly(!womenOnly)} Icon={ShieldCheck} tone="plum"
          title={t('womenToggle')} sub={t('womenToggleSub')} />
      </div>

      {catsMatching.length === 0 ? (
        <Card className="p-8 text-center mb-7">
          <Search size={22} color={T.muted} className="mx-auto mb-3" />
          <div className="bdy text-sm" style={{ color: T.ink2 }}>{t('noMatch')}</div>
          <Btn size="sm" kind="ghost" className="mt-3" onClick={() => setQuery('')}>{t('allServices')}</Btn>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-7">
          {catsMatching.map(c => {
            const n = countFor(c);
            return (
              <button key={c.id} onClick={() => push({ s: 'list', cat: c.id })} className="rounded-xl overflow-hidden text-left lift"
                style={{ background: T.card, border: `1px solid ${T.line}`, boxShadow: T.sh1, opacity: n === 0 ? 0.55 : 1 }}>
                <TaskArt cat={c.id} h={84} />
                <div className="p-3">
                  <div className="bdy text-sm font-medium leading-tight" style={{ color: T.ink }}>{c.n[lang]}</div>
                  <div className="bdy num flex items-center gap-1.5" style={{ color: n === 0 ? T.brick : T.muted, fontSize: 11, marginTop: 3 }}>
                    {womenOnly && <ShieldCheck size={11} color={n === 0 ? T.brick : T.plum} />}
                    {n} {t('availableCount')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="dsp text-sm font-semibold mb-2.5" style={{ color: T.ink }}>{t('bookAgain')}</div>
      {myBookings.filter(b => b.status === 'Completed').length === 0 ? (
        <Card className="p-5 bdy text-sm" style={{ color: T.muted }}>{t('noHistoryYet')}</Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-2.5">
          {myBookings.filter(b => b.status === 'Completed').slice(0, 2).map(b => {
            const w = WORKERS.find(x => x.id === b.workerId);
            if (!w) return null;
            return (
              <Card key={b.id} className="p-3 flex items-center gap-3">
                <TaskArt cat={b.cat} h={44} className="w-14 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="bdy text-sm font-medium truncate" style={{ color: T.ink }}>{w.name}</div>
                  <div className="bdy text-xs" style={{ color: T.muted }}>{cn(b.cat)}</div>
                </div>
                <Btn size="sm" kind="ghost" onClick={() => startBooking(w, b.hours)}>{t('rebook')}</Btn>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  /* --------------------------------------------------- women-only explainer */
  const Women = () => {
    const women = WORKERS.filter(w => w.gender === 'F' && w.verified);
    const byTrade = CATS.map(c => ({ c, n: women.filter(w => w.cat === c.id).length })).filter(x => x.n > 0);
    const guarantees = [[EyeOff, 'wg1', 'wg1s'], [Shield, 'wg2', 'wg2s'], [KeyRound, 'wg3', 'wg3s'], [Siren, 'wg4', 'wg4s']];
    return (
      <div className="p-5 max-w-3xl mx-auto">
        <Card className="overflow-hidden mb-4" raise={2}>
          <div className="p-6" style={{ background: `linear-gradient(135deg, ${T.plumDeep} 0%, ${T.plum} 55%, ${T.plumMid} 100%)` }}>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={20} color="#fff" />
              <span className="bdy text-xs" style={{ color: 'rgba(255,255,255,.82)' }}>{t('womenTitle')}</span>
            </div>
            <div className="dsp font-bold leading-none mb-3" style={{ color: '#fff', fontSize: lang === 0 ? 34 : 28 }}>
              {FEMALE_COUNT}
            </div>
            <div className="bdy text-sm" style={{ color: 'rgba(255,255,255,.9)', maxWidth: '46ch' }}>{t('womenAcross')}</div>
          </div>
          <div className="p-5">
            <p className="bdy text-sm leading-relaxed mb-4" style={{ color: T.ink2, maxWidth: '68ch' }}>{t('womenLead')}</p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Btn kind="plum" onClick={() => { setWomenOnly(true); setTab('home'); setStack([{ s: 'cats' }]); }}>{t('browseWomen')}</Btn>
              <span className="bdy text-xs" style={{ color: T.muted }}>{t('womenToggleSub')}</span>
            </div>
          </div>
        </Card>

        <div className="dsp text-sm font-semibold mb-2.5" style={{ color: T.ink }}>{t('howItWorks')}</div>
        <div className="grid sm:grid-cols-2 gap-2.5 mb-4">
          {guarantees.map(([I, k, s]) => (
            <Card key={k} className="p-4">
              <div className="w-8 h-8 rounded-lg grid place-items-center mb-3" style={{ background: T.plumLt }}>
                <I size={16} color={T.plum} />
              </div>
              <div className="bdy text-sm font-semibold mb-1" style={{ color: T.ink }}>{t(k)}</div>
              <div className="bdy text-xs leading-relaxed" style={{ color: T.muted }}>{t(s)}</div>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('tradeSpread')}</div>
          {byTrade.map(({ c, n }) => (
            <button key={c.id} onClick={() => { setWomenOnly(true); setTab('home'); setStack([{ s: 'cats' }, { s: 'list', cat: c.id }]); }}
              className="w-full flex items-center gap-3 py-2.5 text-left rowhover rounded-lg px-1" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              <c.Icon size={16} color={T.plum} className="shrink-0" />
              <span className="bdy text-sm flex-1" style={{ color: T.ink }}>{c.n[lang]}</span>
              <div className="flex-1 h-1.5 rounded-full hidden sm:block" style={{ background: T.lineSoft, maxWidth: 160 }}>
                <div className="h-full rounded-full" style={{ width: (n / 4 * 100) + '%', background: T.plum }} />
              </div>
              <span className="bdy num text-sm font-semibold w-6 text-right" style={{ color: T.plum }}>{n}</span>
            </button>
          ))}
        </Card>
      </div>
    );
  };

  /* ------------------------------------------------------------ worker list */
  const List = ({ cat }) => {
    let ws = WORKERS.filter(w => w.cat === cat && eligible(w));
    ws = [...ws].sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'price' ? effRate(a) - effRate(b) : trust(b) - trust(a));
    const emptyMsg = womenOnly && WORKERS.filter(w => w.cat === cat && w.gender === 'F').length === 0
      ? t('womenNoneCat') : t('noInstantWorkers');
    return (
      <div className="p-5 max-w-4xl mx-auto">
        <PageTop onBack={back} backLabel={t('allServices')} title={cn(cat)}
          right={<div className="flex gap-1.5">
            {[['trust', 'sortTrust'], ['rating', 'sortRating'], ['price', 'sortPrice']].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} className="bdy text-xs px-2.5 py-1.5 rounded-lg tap"
                style={{ background: sort === k ? T.green : T.card, color: sort === k ? '#fff' : T.ink2, border: `1px solid ${sort === k ? T.green : T.line}` }}>{t(l)}</button>
            ))}
          </div>} />

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="bdy text-xs flex items-start gap-1.5 px-3 py-2 rounded-lg" style={{ background: T.greenLt, color: T.green }}>
            <Scale size={13} className="mt-0.5 shrink-0" /><span>{t('floorNote')}: {inr(floorFor(cat))}/hr. {t('floorNote2')}</span>
          </div>
          {womenOnly && (
            <button onClick={() => setWomenOnly(false)} className="bdy text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg tap"
              style={{ background: T.plumLt, color: T.plum, border: `1px solid ${T.plum}33` }}>
              <ShieldCheck size={13} /> {t('womenPill')} <X size={12} />
            </button>
          )}
          {emergency && (
            <button onClick={() => setEmergency(false)} className="bdy text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg tap"
              style={{ background: T.brickLt, color: T.brick, border: `1px solid ${T.brick}33` }}>
              <Zap size={13} /> {t('instant')} <X size={12} />
            </button>
          )}
        </div>

        {ws.length === 0 && (
          <Card className="p-8 text-center">
            <Users size={22} color={T.muted} className="mx-auto mb-3" />
            <div className="bdy text-sm mx-auto" style={{ color: T.ink2, maxWidth: '46ch' }}>{emptyMsg}</div>
          </Card>
        )}

        <div className="space-y-2.5" style={{ animation: 'fadeIn .3s ease' }}>
          {ws.map(w => (
            <Card key={w.id} className="p-3.5 flex items-center gap-3.5 lift">
              <div className="w-11 h-11 rounded-full grid place-items-center dsp font-bold shrink-0"
                style={{ background: w.gender === 'F' ? T.plumLt : T.greenLt, color: w.gender === 'F' ? T.plum : T.green }}>{w.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="bdy text-sm font-semibold" style={{ color: T.ink }}>{w.name}</span>
                  {w.verified && <BadgeCheck size={14} color={T.green} />}
                  {w.gender === 'F' && <WomenTag label={t('womanPill')} />}
                  {w.instant && <Pill tone="gold">{t('instant')}</Pill>}
                </div>
                <div className="bdy text-xs mt-0.5" style={{ color: T.muted }}>{socOf(w.soc).district[lang]} · {w.ward} · {w.years} {t('yrs')}</div>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="bdy text-xs flex items-center gap-1" style={{ color: T.ink2 }}><Stars n={w.rating} /><span className="num">{w.rating}</span></span>
                  <span className="bdy num text-xs" style={{ color: T.muted }}>{w.jobs} {t('jobs')}</span>
                  <span className="bdy num text-xs font-medium" style={{ color: T.green }}>{t('trustScore')} {trust(w)}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="dsp num text-base font-bold" style={{ color: T.ink }}>{inr(effRate(w))}</div>
                <div className="bdy text-xs mb-2" style={{ color: T.muted }}>{t('perHour')}</div>
                <Btn size="sm" onClick={() => push({ s: 'profile', w })}>{t('view')}</Btn>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  /* --------------------------------------------------------------- profile */
  const Profile = ({ w }) => (
    <div className="p-5 max-w-3xl mx-auto">
      <PageTop onBack={back} backLabel={cn(w.cat)} />
      <Card className="overflow-hidden mb-3" raise={2}>
        <TaskArt cat={w.cat} h={110} className="rounded-none" />
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full grid place-items-center dsp text-xl font-bold shrink-0"
              style={{ background: w.gender === 'F' ? T.plumLt : T.greenLt, color: w.gender === 'F' ? T.plum : T.green }}>{w.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="dsp text-xl font-bold" style={{ color: T.ink }}>{w.name}</h2>
                {w.verified && <BadgeCheck size={17} color={T.green} />}
                {w.gender === 'F' && <WomenTag label={t('womanPill')} size="md" />}
              </div>
              <div className="bdy text-sm" style={{ color: T.muted }}>{t('memberOf')} {socOf(w.soc).name[lang]}</div>
              <div className="flex flex-wrap items-center gap-3 mt-2.5">
                <span className="bdy text-sm flex items-center gap-1.5" style={{ color: T.ink }}><Stars n={w.rating} size={14} /><span className="num font-medium">{w.rating}</span></span>
                <span className="bdy num text-sm" style={{ color: T.muted }}>{w.jobs} {t('jobsCompleted')}</span>
                <Pill>{t('trustScore')} {trust(w)}</Pill>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-2.5" style={{ color: T.ink }}>{t('certifications')}</div>
          {w.certs.map(c => (
            <div key={c.cat} className="flex items-center gap-2 mb-2">
              <GraduationCap size={15} color={T.green} className="shrink-0" />
              <div>
                <div className="bdy text-xs font-medium" style={{ color: T.ink }}>{catOf(c.cat).n[lang]} — {c.lvl}</div>
                <div className="bdy num text-xs" style={{ color: T.muted }}>{t('issued')} {c.issued} · {t('validTo')} {c.valid}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-2.5" style={{ color: T.ink }}>{t('trustBreak')}</div>
          {[[t('tbVerified'), w.verified ? 30 : 8, 30], [t('tbRatings'), Math.round(w.rating / 5 * 34), 34],
            [t('tbJobs'), Math.min(20, Math.round(w.jobs / 25)), 20], [t('tbYears'), Math.min(16, Math.round(w.years * 1.4)), 16]].map(([k, v, max]) => (
            <div key={k} className="mb-2">
              <div className="flex justify-between bdy text-xs mb-1" style={{ color: T.ink2 }}><span>{k}</span><span className="num">{v}/{max}</span></div>
              <div className="h-1.5 rounded-full" style={{ background: T.lineSoft }}>
                <div className="h-full rounded-full" style={{ width: (v / max * 100) + '%', background: T.green }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card className="p-4 mb-3">
        <div className="dsp text-sm font-semibold mb-2.5" style={{ color: T.ink }}>{t('recentReviews')}</div>
        {reviewsFor(w).map((rv, i) => (
          <div key={i} className="mb-3 last:mb-0">
            <div className="flex items-center gap-2 mb-1"><Stars n={rv.stars} /><span className="bdy text-xs" style={{ color: T.muted }}>{rv.name}</span></div>
            <div className="bdy text-sm" style={{ color: T.ink2 }}>{rv.tx[lang]}</div>
          </div>
        ))}
      </Card>

      <Btn size="lg" className="w-full" kind={w.gender === 'F' && womenOnly ? 'plum' : 'primary'} onClick={() => startBooking(w, 2)}>
        {t('book')} · {inr(effRate(w))}/{t('perHour')}
      </Btn>
    </div>
  );

  /* ---------------------------------------------------------- booking flow */
  const DayGrid = ({ value, onPick }) => (
    <div className="grid grid-cols-4 gap-2">
      {[0, 1, 2, 3].map(off => (
        <button key={off} onClick={() => onPick(off)} className="bdy text-xs py-2.5 rounded-lg tap"
          style={{ background: value === off ? T.green : T.card, color: value === off ? '#fff' : T.ink2, border: `1px solid ${value === off ? T.green : T.line}` }}>
          {dayOffsetLabel(off, lang)}
        </button>
      ))}
    </div>
  );

  const SlotGrid = ({ value, onPick }) => (
    <div className="grid grid-cols-4 gap-2">
      {SLOTS.map((s, i) => (
        <button key={s} onClick={() => onPick(s)} className="bdy text-xs py-2.5 rounded-lg tap"
          style={{ background: value === s ? T.green : T.card, color: value === s ? '#fff' : T.ink2, border: `1px solid ${value === s ? T.green : T.line}` }}>
          {t(SLOT_KEYS[i])}
        </button>
      ))}
    </div>
  );

  const Book = () => {
    const w = draft.w;
    const rate = effRate(w);
    const uplifted = rate > w.rate;
    const surge = emergency ? Math.round(rate * draft.hours * 0.15) : 0;
    const total = rate * draft.hours + surge;
    const isWomenOnly = womenOnly && w.gender === 'F';
    return (
      <div className="p-5 max-w-2xl mx-auto">
        <PageTop onBack={() => step > 1 ? setStep(step - 1) : back()} backLabel={t('back')} />
        <div className="flex gap-1.5 mb-5">
          {['stDescribe', 'stSchedule', 'stConfirm'].map((s, i) => (
            <button key={s} onClick={() => i + 1 < step && setStep(i + 1)} className="flex-1 text-left">
              <div className="h-1 rounded-full mb-1.5" style={{ background: i < step ? T.green : T.line, transition: 'background .25s ease' }} />
              <div className="bdy text-xs" style={{ color: i < step ? T.green : T.muted }}>{t(s)}</div>
            </button>
          ))}
        </div>

        {step === 1 && (
          <Card className="overflow-hidden" raise={2}>
            <TaskArt cat={w.cat} h={100} className="rounded-none" />
            <div className="p-5">
              <div className="dsp text-lg font-bold mb-4" style={{ color: T.ink }}>{t('whatProblem')}</div>
              <textarea rows={3} value={draft.desc} onChange={e => setDraft({ ...draft, desc: e.target.value })}
                placeholder={t('descPlaceholder')} className="bdy text-sm w-full p-3 rounded-lg outline-none mb-3"
                style={{ border: `1px solid ${T.line}`, background: T.paper, color: T.ink, resize: 'none' }} />
              <PhotoPicker t={t} label={t('addPhoto')} value={draft.photos}
                onChange={fn => setDraft(d => ({ ...d, photos: typeof fn === 'function' ? fn(d.photos) : fn }))}
                onAdded={() => toastFn(t('photoAdded'))} />
              <div className="flex items-center justify-between mb-4">
                <span className="bdy text-sm" style={{ color: T.ink }}>{t('estHours')}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDraft({ ...draft, hours: Math.max(1, draft.hours - 1) })} className="w-8 h-8 rounded-lg dsp tap" style={{ border: `1px solid ${T.line}`, color: T.ink }}>−</button>
                  <span className="dsp num text-lg font-bold w-6 text-center" style={{ color: T.ink }}>{draft.hours}</span>
                  <button onClick={() => setDraft({ ...draft, hours: Math.min(8, draft.hours + 1) })} className="w-8 h-8 rounded-lg dsp tap" style={{ border: `1px solid ${T.line}`, color: T.ink }}>+</button>
                </div>
              </div>
              <Btn size="lg" className="w-full" onClick={() => setStep(2)}>{t('cont')}</Btn>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-5" raise={2}>
            <div className="dsp text-lg font-bold mb-4" style={{ color: T.ink }}>{t('whenWhere')}</div>
            <div className="mb-4"><DayGrid value={draft.dayOff} onPick={off => setDraft({ ...draft, dayOff: off })} /></div>
            <div className="mb-4"><SlotGrid value={draft.slot} onPick={s => setDraft({ ...draft, slot: s })} /></div>
            <div className="p-3 rounded-lg flex items-start gap-2.5 mb-4" style={{ background: T.paper }}>
              <MapPin size={16} color={T.green} className="mt-0.5 shrink-0" />
              <div><div className="bdy text-sm font-medium" style={{ color: T.ink }}>B-402, Shreeji Residency</div>
                <div className="bdy text-xs" style={{ color: T.muted }}>Adajan Gam Road, Surat 395009</div></div>
            </div>
            <Btn size="lg" className="w-full" onClick={() => setStep(3)}>{t('cont')}</Btn>
          </Card>
        )}

        {step === 3 && (
          <>
            <Card className="p-5 mb-3" raise={2}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="bdy text-xs" style={{ color: T.muted }}>{t('youPay')}</div>
                  <div className="dsp num text-3xl font-bold" style={{ color: T.ink }}>{inr(total)}</div>
                </div>
                <div className="text-right">
                  <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{w.name}</div>
                  <div className="bdy num text-xs" style={{ color: T.muted }}>{inr(rate)} × {draft.hours}h</div>
                </div>
              </div>

              {/* The chosen schedule is shown back, and can still be changed from here. */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg mb-4" style={{ background: T.paper }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <CalendarClock size={16} color={T.green} className="shrink-0" />
                  <div className="min-w-0">
                    <div className="bdy text-xs" style={{ color: T.muted }}>{t('scheduledFor')}</div>
                    <div className="bdy text-sm font-medium truncate" style={{ color: T.ink }}>
                      {dayOffsetLabel(draft.dayOff, lang)} · {t(SLOT_KEYS[SLOTS.indexOf(draft.slot)])}
                    </div>
                  </div>
                </div>
                <Btn size="sm" kind="ghost" className="shrink-0" onClick={() => setStep(2)}>{t('change')}</Btn>
              </div>

              {isWomenOnly && (
                <div className="bdy text-xs px-3 py-2.5 rounded-lg mb-4 flex items-start gap-2" style={{ background: T.plumLt, color: T.plum }}>
                  <ShieldCheck size={14} className="mt-0.5 shrink-0" /><span>{t('womenOnlyBooking')} {t('wg2s')}</span>
                </div>
              )}
              {uplifted && <div className="bdy text-xs px-3 py-2 rounded-lg mb-4 flex items-start gap-2" style={{ background: T.goldLt, color: T.goldDeep }}>
                <Scale size={13} className="mt-0.5 shrink-0" /><span>{t('upliftNote')} {inr(w.rate)} → {inr(rate)}</span></div>}
              {surge > 0 && <div className="bdy text-xs px-3 py-2 rounded-lg mb-4 flex items-start gap-2" style={{ background: T.brickLt, color: T.brick }}>
                <Zap size={13} className="mt-0.5 shrink-0" /><span>{inr(surge)} — {t('surgeNote')}</span></div>}
              <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('whereMoney')}</div>
              <MoneyBar amount={rate * draft.hours} policy={st.policy} t={t} />
            </Card>
            <Card className="p-4 mb-3">
              <div className="dsp text-sm font-semibold mb-2.5" style={{ color: T.ink }}>{t('payment')}</div>
              {['pUpi', 'pCard', 'pCash'].map((m, i) => (
                <button key={m} onClick={() => setPayMethod(i)} className="flex items-center gap-2.5 py-2 w-full text-left">
                  <div className="w-4 h-4 rounded-full grid place-items-center shrink-0" style={{ border: `1.5px solid ${payMethod === i ? T.green : T.line}` }}>
                    {payMethod === i && <div className="w-2 h-2 rounded-full" style={{ background: T.green }} />}
                  </div>
                  <span className="bdy text-sm" style={{ color: payMethod === i ? T.ink : T.ink2 }}>{t(m)}</span>
                </button>
              ))}
              <div className="bdy text-xs mt-2" style={{ color: T.muted }}>{t('simPay')}</div>
            </Card>
            <Btn size="lg" className="w-full" kind={isWomenOnly ? 'plum' : 'primary'} onClick={() => {
              const id = 'BK' + (bkSeq++);
              const issue = draft.desc.trim()
                ? [draft.desc.trim(), draft.desc.trim(), draft.desc.trim()]
                : ISSUES[0];
              set(s => ({ ...s, bookings: [{ id, workerId: w.id, cat: w.cat, soc: w.soc, ward: w.ward,
                customer: 'You', issue, hours: draft.hours, base: rate * draft.hours, surge,
                slot: draft.slot, dayOff: draft.dayOff, emergency, womenOnly: isWomenOnly,
                photos: draft.photos.length, status: 'Requested', rated: false, mine: true }, ...s.bookings] }));
              notify(['worker'], 'nfNewJob', { ward: w.ward, amt: inr(rate * draft.hours * workerPctOf(st.policy) / 100 + surge) }, 'gold');
              toastFn(t('bookingDone') + ' ' + w.name.split(' ')[0] + ' ' + t('hasBeenNotified'));
              setTab('active'); setStack([{ s: 'cats' }]); setStep(1);
            }}>{t('confirmBooking')} · {inr(total)}</Btn>
          </>
        )}
      </div>
    );
  };

  /* ----------------------------------------------------------------- track */
  const Track = () => {
    const b = myBookings.find(x => x.status !== 'Completed') || myBookings[0];
    const w = b && WORKERS.find(x => x.id === b.workerId);
    if (!b || !w) return (
      <div className="p-5 max-w-2xl mx-auto">
        <PageTop title={t('yourBooking')} />
        <Card className="p-10 text-center">
          <Activity size={24} color={T.muted} className="mx-auto mb-3" />
          <div className="dsp font-semibold mb-1" style={{ color: T.ink }}>{t('noBookingYet')}</div>
          <div className="bdy text-sm mb-4 mx-auto" style={{ color: T.muted, maxWidth: '42ch' }}>{t('noBookingYetSub')}</div>
          <Btn onClick={() => { setTab('home'); setStack([{ s: 'cats' }]); }}>{t('bookNow')}</Btn>
        </Card>
      </div>
    );
    const idx = STATUSES.indexOf(b.status);

    /* Real ward-level coordinates, with small deterministic offsets so the
       customer and worker sit at plausible nearby points rather than on
       top of each other. Distance shown is genuine haversine distance. */
    const center = WARD_COORDS[b.ward] || WARD_COORDS.Adajan;
    const kmPerLat = 111.32, kmPerLng = 111.32 * Math.cos(center[0] * Math.PI / 180);
    const seededOffsetKm = (seedStr, kmRadius) => {
      const r = rng(hashCode(seedStr));
      const ang = r() * Math.PI * 2, dist = kmRadius * (0.4 + r() * 0.6);
      return [dist * Math.sin(ang), dist * Math.cos(ang)];
    };
    const [cdLat, cdLng] = seededOffsetKm(b.id + 'cust', 0.8);
    const cust = [center[0] + cdLat / kmPerLat, center[1] + cdLng / kmPerLng];
    const travelled = Math.min(idx, 3) / 3;
    const [wdLat, wdLng] = seededOffsetKm(b.id + 'wrk', 2.3);
    const workerFar = [center[0] + wdLat / kmPerLat, center[1] + wdLng / kmPerLng];
    const worker = idx >= 3 ? cust : [
      workerFar[0] + (cust[0] - workerFar[0]) * travelled,
      workerFar[1] + (cust[1] - workerFar[1]) * travelled,
    ];
    const distKm = haversineKm(worker, cust);
    const midLat = (worker[0] + cust[0]) / 2, midLng = (worker[1] + cust[1]) / 2;
    const spanKm = Math.max(haversineKm(workerFar, cust) * 1.7, 1);
    const zoom = spanKm < 1 ? 16 : spanKm < 2.2 ? 15 : spanKm < 4.5 ? 14 : 13;
    const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${midLat.toFixed(5)},${midLng.toFixed(5)}&zoom=${zoom}&size=640x260&maptype=mapnik`;
    const scalePx = 300 / spanKm;
    const project = (lat, lng) => [
      200 + (lng - midLng) * kmPerLng * scalePx,
      88 - (lat - midLat) * kmPerLat * scalePx,
    ];
    const [wx, wy] = project(worker[0], worker[1]);
    const [cx, cy] = project(cust[0], cust[1]);
    const [fx, fy] = project(workerFar[0], workerFar[1]);
    const bendX = (fx + cx) / 2 + (fy - cy) * 0.18, bendY = (fy + cy) / 2 + (cx - fx) * 0.18;
    const canMove = idx <= 1;

    return (
      <div className="p-5 max-w-2xl mx-auto">
        <PageTop title={t('yourBooking')} />
        <Card className="p-5 mb-3" raise={2}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full grid place-items-center dsp font-bold shrink-0"
              style={{ background: w.gender === 'F' ? T.plumLt : T.greenLt, color: w.gender === 'F' ? T.plum : T.green }}>{w.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="bdy text-sm font-semibold" style={{ color: T.ink }}>{w.name}</div>
              <div className="bdy text-xs" style={{ color: T.muted }}>{cn(b.cat)} · {b.id}</div>
            </div>
            <button className="w-9 h-9 rounded-lg grid place-items-center shrink-0 tap" style={{ background: T.greenLt }} aria-label={t('call')}><Phone size={15} color={T.green} /></button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {b.womenOnly && <WomenTag label={t('womenPill')} size="md" />}
            {b.emergency && <Pill tone="brick">{t('emergency')}</Pill>}
          </div>

          {/* Schedule strip — the reschedule action lives with the schedule. */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg mb-4" style={{ background: T.paper }}>
            <div className="flex items-center gap-2.5 min-w-0">
              <CalendarClock size={16} color={T.green} className="shrink-0" />
              <div className="min-w-0">
                <div className="bdy text-xs" style={{ color: T.muted }}>{t('scheduledFor')}</div>
                <div className="bdy text-sm font-medium truncate" style={{ color: T.ink }}>{whenLabel(b, lang)}</div>
              </div>
            </div>
            <Btn size="sm" kind="ghost" className="shrink-0" disabled={!canMove}
              onClick={() => canMove ? setReschedFor(b.id) : toastFn(t('cannotReschedule'))}>
              <CalendarClock size={12} className="inline mr-1.5" />{t('reschedule')}
            </Btn>
          </div>
          {!canMove && <div className="bdy text-xs mb-4" style={{ color: T.muted }}>{t('cannotReschedule')}</div>}

          {STATUSES.map((s, i) => (
            <div key={s} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full grid place-items-center timeline-dot" style={{ background: i <= idx ? T.green : T.card, border: `1.5px solid ${i <= idx ? T.green : T.line}` }}>
                  {i <= idx && <CheckCircle2 size={12} color="#fff" style={{ animation: i === idx ? 'popIn .3s ease' : 'none' }} />}
                </div>
                {i < 4 && <div className="w-0.5 flex-1 timeline-line" style={{ background: i < idx ? T.green : T.line, minHeight: 22 }} />}
              </div>
              <div className="pb-4">
                <div className="bdy text-sm" style={{ color: i <= idx ? T.ink : T.muted, fontWeight: i === idx ? 600 : 400, transition: 'color .4s ease' }}>{t(STATUS_KEYS[s])}</div>
                {i === idx && idx < 4 && <div className="bdy text-xs mt-0.5" style={{ color: T.green, animation: 'fadeIn .4s ease' }}>{t('arriving')}</div>}
              </div>
            </div>
          ))}
        </Card>

        {/* Safety strip: a door code and a shareable booking, shown for every
            booking and given the women-only colour when that rule applies. */}
        <Card className="p-4 mb-3" style={{ borderColor: b.womenOnly ? T.plum + '44' : T.line }}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={15} color={b.womenOnly ? T.plum : T.green} />
            <span className="dsp text-sm font-semibold" style={{ color: T.ink }}>{t('safetyPanel')}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-2 rounded-lg" style={{ background: b.womenOnly ? T.plumLt : T.greenLt }}>
              <div className="bdy text-xs" style={{ color: b.womenOnly ? T.plum : T.green }}>{t('doorCode')}</div>
              <div className="dsp num text-xl font-bold tracking-widest" style={{ color: b.womenOnly ? T.plum : T.green }}>{doorCodeFor(b.id)}</div>
            </div>
            <div className="bdy text-xs flex-1" style={{ color: T.muted, minWidth: 150 }}>{t('doorCodeSub')}</div>
            <Btn size="sm" kind="ghost" onClick={() => toastFn(t('shareTripDone'))}>
              <Share2 size={12} className="inline mr-1.5" />{t('shareTrip')}
            </Btn>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden mb-3">
          <div className="h-44 relative" style={{ background: '#DCE7E1' }}>
            {!mapFailed ? (
              <img src={mapUrl} alt="" onError={() => setMapFailed(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.92) contrast(.98)' }} />
            ) : (
              <StylizedMap seed={b.ward} />
            )}
            <svg width="100%" height="100%" viewBox="0 0 400 176" className="absolute inset-0" style={{ pointerEvents: 'none' }}>
              <path d={`M${fx},${fy} Q${bendX},${bendY} ${cx},${cy}`} stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.65" />
              <path d={`M${fx},${fy} Q${bendX},${bendY} ${cx},${cy}`} stroke={T.line} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="1 8" opacity="0.9" />
              <path d={`M${fx},${fy} Q${bendX},${bendY} ${wx},${wy}`} stroke={b.womenOnly ? T.plum : T.green} strokeWidth="4" fill="none" strokeLinecap="round"
                style={{ transition: 'd .8s ease' }} />
              <circle cx={cx} cy={cy} r="9" fill={T.gold} stroke="#fff" strokeWidth="3" />
              <circle cx={wx} cy={wy} r="7.5" fill={b.womenOnly ? T.plum : T.green} stroke="#fff" strokeWidth="2.5" style={{ transition: 'cx .8s ease, cy .8s ease' }}>
                {idx < 3 && <animate attributeName="opacity" values="1;0.55;1" dur="1.8s" repeatCount="indefinite" />}
              </circle>
            </svg>
            <div className="absolute bottom-2 left-3 bdy num text-xs px-2 py-1 rounded" style={{ background: T.card, color: T.ink2 }}>{distKm.toFixed(1)} {t('kmAway')}</div>
            <div className="absolute top-2 right-2 bdy text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,.82)', color: T.muted, fontSize: 10 }}>© OpenStreetMap</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('whereMoney')}</div>
          <MoneyBar amount={val(b)} policy={st.policy} t={t} />
          {b.surge > 0 && (
            <div className="flex items-baseline justify-between gap-3 mt-3 pt-3 bdy text-xs" style={{ borderTop: `1px dashed ${T.line}`, color: T.brick }}>
              <span>{t('surgeLine')} — {t('surgeNote')}</span><span className="num font-semibold shrink-0">{inr(b.surge)}</span>
            </div>
          )}
        </Card>
      </div>
    );
  };

  /* --------------------------------------------------------------- history */
  const History = () => (
    <div className="p-5 max-w-3xl mx-auto">
      <PageTop title={t('yourBookings')} />
      {myBookings.length === 0 ? (
        <Card className="p-10 text-center">
          <FileText size={24} color={T.muted} className="mx-auto mb-3" />
          <div className="bdy text-sm mb-4 mx-auto" style={{ color: T.muted, maxWidth: '42ch' }}>{t('noHistoryYet')}</div>
          <Btn onClick={() => { setTab('home'); setStack([{ s: 'cats' }]); }}>{t('bookNow')}</Btn>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {myBookings.slice(0, 14).map(b => {
            const w = WORKERS.find(x => x.id === b.workerId);
            const canMove = STATUSES.indexOf(b.status) <= 1;
            return (
              <Card key={b.id} className="p-3.5">
                <div className="flex items-center gap-3">
                  <TaskArt cat={b.cat} h={42} className="w-12 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="bdy text-sm font-medium truncate" style={{ color: T.ink }}>{w?.name} · {cn(b.cat)}</div>
                    <div className="bdy text-xs" style={{ color: T.muted }}>{b.id} · {whenLabel(b, lang)}</div>
                    {b.womenOnly && <div className="mt-1.5"><WomenTag label={t('womenPill')} /></div>}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="dsp num text-sm font-bold" style={{ color: T.ink }}>{inr(val(b) + (b.surge || 0))}</div>
                    <Pill tone={b.status === 'Completed' ? 'green' : b.status === 'Requested' ? 'gold' : 'grey'}>{t(STATUS_KEYS[b.status])}</Pill>
                  </div>
                </div>
                {b.status === 'Completed' ? (
                  <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${T.lineSoft}` }}>
                    <div className="flex items-center justify-between gap-2">
                      <button className="bdy text-xs flex items-center gap-1.5" style={{ color: T.green }}><FileText size={13} /> {t('invoice')}</button>
                      {b.rated ? <span className="bdy text-xs flex items-center gap-1.5" style={{ color: T.muted }}>{t('youRated')} <Stars n={b.stars} /></span>
                        : <Btn size="sm" kind="ghost" onClick={() => { setRating({ stars: 0, text: '' }); setReviewFor(b.id); }}>{t('rateJob')}</Btn>}
                    </div>
                    {b.rated && b.reviewText && (
                      <div className="bdy text-xs mt-2 italic" style={{ color: T.ink2 }}>“{b.reviewText}”</div>
                    )}
                  </div>
                ) : canMove && (
                  <div className="mt-3 pt-3 flex justify-end" style={{ borderTop: `1px solid ${T.lineSoft}` }}>
                    <Btn size="sm" kind="ghost" onClick={() => setReschedFor(b.id)}>
                      <CalendarClock size={12} className="inline mr-1.5" />{t('reschedule')}
                    </Btn>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const Inst = () => (
    <div className="p-5 max-w-3xl mx-auto">
      <PageTop title={t('instTitle')} sub={t('instSub')} />
      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {[[t('amc'), t('amcDesc'), Calendar], [t('bulk'), t('bulkDesc'), Users]].map(([ti, d, I]) => (
          <Card key={ti} className="p-4 lift">
            <I size={19} color={T.green} />
            <div className="dsp text-sm font-semibold mt-3 mb-1" style={{ color: T.ink }}>{ti}</div>
            <div className="bdy text-xs leading-relaxed mb-3" style={{ color: T.muted }}>{d}</div>
            <Btn size="sm" kind="ghost" onClick={() => toastFn(t('reqSent'))}>{t('raiseReq')}</Btn>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('liveContracts')}</div>
        {[['Shree Vidya School', 'cleaning', 6, '₹84,000'], ['Sunrise Hospital', 'domestic', 9, '₹1,26,000']].map(([n, c, k, v]) => (
          <div key={n} className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
            <TaskArt cat={c} h={36} className="w-11 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{n}</div>
              <div className="bdy text-xs" style={{ color: T.muted }}>{cn(c)} · {k} {t('members')}</div>
            </div>
            <div className="dsp num text-sm font-bold shrink-0" style={{ color: T.ink }}>{v}</div>
          </div>
        ))}
      </Card>
    </div>
  );

  const body = tab === 'women' ? <Women /> : tab === 'active' ? <Track /> : tab === 'history' ? <History /> : tab === 'inst' ? <Inst />
    : view.s === 'list' ? <List cat={view.cat} /> : view.s === 'profile' ? <Profile w={view.w} />
    : view.s === 'book' && draft ? <Book /> : <Home />;

  /* ------------------------------------------------------------ two modals */
  const reviewBooking = st.bookings.find(x => x.id === reviewFor);
  const reviewWorker = reviewBooking && WORKERS.find(x => x.id === reviewBooking.workerId);
  const submitReview = () => {
    if (!rating.stars || !reviewBooking) return;
    set(s => ({ ...s, bookings: s.bookings.map(x => x.id === reviewBooking.id
      ? { ...x, rated: true, stars: rating.stars, reviewText: rating.text.trim() } : x) }));
    toastFn(t('thanksRating'));
    setReviewFor(null); setRating({ stars: 0, text: '' });
  };

  const reschedBooking = st.bookings.find(x => x.id === reschedFor);

  return (
    <>
      {body}

      {reviewBooking && (
        <div className="fixed inset-0 z-40 grid place-items-center p-6" style={{ background: 'rgba(12,30,25,.55)' }}>
          <Card className="p-6 max-w-sm w-full" raise={2} style={{ animation: 'popIn .25s ease' }}>
            <div className="dsp text-lg font-bold mb-1" style={{ color: T.ink }}>{t('rateJob')}</div>
            <div className="bdy text-xs mb-4" style={{ color: T.muted }}>{reviewWorker?.name} · {cn(reviewBooking.cat)} · {reviewBooking.id}</div>
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setRating(r => ({ ...r, stars: i }))} className="p-1" aria-label={i + ' star'} style={{ background: 'none', border: 'none' }}>
                  <Star size={32} fill={i <= rating.stars ? T.gold : 'none'} color={i <= rating.stars ? T.gold : T.line}
                    style={{ transition: 'transform .15s ease, fill .15s ease, color .15s ease', transform: i <= rating.stars ? 'scale(1.1)' : 'scale(1)' }} />
                </button>
              ))}
            </div>
            {!rating.stars && <div className="bdy text-xs text-center mb-3" style={{ color: T.muted }}>{t('selectStarsFirst')}</div>}
            <div className="bdy text-xs font-medium mb-1.5 mt-3" style={{ color: T.ink2 }}>{t('reviewDescLabel')}</div>
            <textarea value={rating.text} onChange={e => setRating(r => ({ ...r, text: e.target.value }))} placeholder={t('reviewPlaceholder')} rows={3}
              className="bdy text-sm w-full p-3 rounded-lg mb-5 outline-none" style={{ background: T.paper, border: `1px solid ${T.line}`, color: T.ink, resize: 'none' }} />
            <div className="flex gap-2">
              <Btn kind="ghost" className="flex-1" onClick={() => setReviewFor(null)}>{t('cancel')}</Btn>
              <Btn className="flex-1" disabled={!rating.stars} onClick={submitReview}>{t('submitReview')}</Btn>
            </div>
          </Card>
        </div>
      )}

      {reschedBooking && (
        <div className="fixed inset-0 z-40 grid place-items-center p-6" style={{ background: 'rgba(12,30,25,.55)' }}>
          <Card className="p-6 max-w-sm w-full" raise={2} style={{ animation: 'popIn .25s ease' }}>
            <div className="dsp text-lg font-bold mb-1" style={{ color: T.ink }}>{t('rescheduleTitle')}</div>
            <div className="bdy text-xs mb-4" style={{ color: T.muted }}>{t('rescheduleSub')}</div>
            <div className="mb-3">
              <DayGrid value={reschedBooking.dayOff ?? 1}
                onPick={off => set(s => ({ ...s, bookings: s.bookings.map(x => x.id === reschedBooking.id ? { ...x, dayOff: off } : x) }))} />
            </div>
            <div className="mb-5">
              <SlotGrid value={reschedBooking.slot}
                onPick={sl => set(s => ({ ...s, bookings: s.bookings.map(x => x.id === reschedBooking.id ? { ...x, slot: sl } : x) }))} />
            </div>
            <div className="flex gap-2">
              <Btn kind="ghost" className="flex-1" onClick={() => setReschedFor(null)}>{t('cancel')}</Btn>
              <Btn className="flex-1" onClick={() => {
                const when = whenLabel(reschedBooking, lang);
                notify(['worker'], 'nfMoved', { id: reschedBooking.id, when }, 'gold');
                toastFn(fmt(t('rescheduleDone'), { when }));
                setReschedFor(null);
              }}>{t('saveChange')}</Btn>
            </div>
          </Card>
        </div>
      )}

      {voice && (
        <div className="fixed inset-0 z-40 grid place-items-center p-6" style={{ background: 'rgba(12,30,25,.5)' }} onClick={() => setVoice(false)}>
          <Card className="p-6 max-w-sm w-full text-center" raise={2} onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full grid place-items-center mx-auto mb-4" style={{ background: T.goldLt, animation: 'shimmer 1.6s ease-in-out infinite' }}><Mic size={22} color={T.goldDeep} /></div>
            <div className="dsp font-semibold mb-1" style={{ color: T.ink }}>{t('listening')}</div>
            <div className="bdy text-sm mb-5" style={{ color: T.ink2 }}>
              {['“I need a plumber tomorrow morning”','“मुझे कल सुबह प्लंबर चाहिए”','“મને કાલે સવારે પ્લમ્બર જોઈએ છે”'][lang]}
            </div>
            <div className="p-3 rounded-lg mb-4 text-left" style={{ background: T.paper }}>
              <div className="bdy text-xs mb-1" style={{ color: T.muted }}>{t('understoodAs')}</div>
              <div className="bdy text-sm" style={{ color: T.ink }}>{cn('plumber')} · {t('dTomorrow')} · {t('slMorning')}</div>
            </div>
            <Btn className="w-full" onClick={() => { setVoice(false); setTab('home'); setStack([{ s: 'cats' }, { s: 'list', cat: 'plumber' }]); }}>{t('showThem')}</Btn>
            <div className="bdy text-xs mt-3" style={{ color: T.muted }}>{t('speechSim')}</div>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 pb-4 pt-2">
        <span className="bdy text-xs" style={{ color: T.muted }}>{t('poweredBy')}</span>
        <SynapseMark scale={0.85} descriptor={false} />
      </div>
      <div style={{ height: 70 }} />
      <BottomNav nav={nav} tab={tab} t={t} onPick={id => { setTab(id); if (id === 'home') setStack([{ s: 'cats' }]); }} />
    </>
  );
}

/* =================================================================== WORKER */
function WorkerApp({ st, set, t, lang, toastFn, notify }) {
  const me = WORKERS[DEMO_W];
  const wPct = workerPctOf(st.policy) / 100;
  const val = b => baseOf(b, st.wageFloor);
  /* The emergency fee is promised to the worker in full, so it is added on top
     of her share rather than being split like the base amount. */
  const keep = b => val(b) * wPct + (b.surge || 0);
  const [stack, setStack] = useState(['home']);
  const tab = stack[stack.length - 1];
  const go = v => setStack(s => [...s, v]);
  const back = () => setStack(s => s.length > 1 ? s.slice(0, -1) : s);
  const [online, setOnline] = useState(true);
  const [takeWomenOnly, setTakeWomenOnly] = useState(true);
  const [sos, setSos] = useState(false);
  const [hidden, setHidden] = useState([]);
  const [shots, setShots] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const cn = c => catOf(c).n[lang];

  const myJobs = st.bookings.filter(b => b.workerId === me.id);
  const done = myJobs.filter(b => b.status === 'Completed');

  /* Who may see a request:
     - it was booked with her by name, or it is open work in her trade and society
     - a women-only request never reaches a member who is not a woman
     - she can also switch women-only work off for herself                     */
  const canSee = b => {
    if (b.status !== 'Requested') return false;
    if (hidden.includes(b.id)) return false;
    if (b.womenOnly && me.gender !== 'F') return false;
    if (b.womenOnly && !takeWomenOnly) return false;
    return b.workerId === me.id || (b.cat === me.cat && b.soc === me.soc);
  };
  const requests = st.bookings.filter(canSee).slice(0, 4);

  /* Status changes are written to the shared booking, not held locally, so the
     customer's tracker and the society's monitor move at the same moment. */
  const advance = (b, status) => {
    set(s => ({ ...s, bookings: s.bookings.map(x => x.id === b.id ? { ...x, status } : x) }));
  };
  const activeJob = st.bookings.find(b => b.id === activeId && b.status !== 'Completed')
    || myJobs.find(b => b.status !== 'Completed' && b.status !== 'Requested');

  const Home = () => (
    <div className="p-4 max-w-md mx-auto">
      <Card className="p-4 mb-3" raise={2}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full grid place-items-center dsp font-bold shrink-0"
            style={{ background: me.gender === 'F' ? T.plumLt : T.greenLt, color: me.gender === 'F' ? T.plum : T.green }}>{me.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="bdy font-semibold flex items-center gap-1.5" style={{ color: T.ink }}>
              {me.name}{me.verified && <BadgeCheck size={14} color={T.green} />}
            </div>
            <div className="bdy text-xs" style={{ color: T.muted }}>{cn(me.cat)} · {me.ward}</div>
          </div>
        </div>
        <button onClick={() => setOnline(!online)} role="switch" aria-checked={online}
          className="w-full mt-4 p-3.5 rounded-xl flex items-center justify-between gap-2 tap"
          style={{ background: online ? T.greenLt : T.paper, border: `1px solid ${online ? T.green : T.line}` }}>
          <span className="bdy font-medium flex items-center gap-2.5 text-left" style={{ color: online ? T.green : T.muted, fontSize: 15 }}>
            <Power size={19} className="shrink-0" /> {online ? t('availableWork') : t('offline')}
          </span>
          <div className="w-12 h-7 rounded-full p-1 shrink-0" style={{ background: online ? T.green : T.line, transition: 'background .18s ease' }}>
            <div className="w-5 h-5 rounded-full bg-white" style={{ marginLeft: online ? 20 : 0, transition: 'margin .18s ease' }} />
          </div>
        </button>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Stat label={t('dToday')} value={inr(done.slice(0, 3).reduce((a, b) => a + keep(b), 0))} tone={T.green} accent={T.green} />
        <Stat label={t('thisMonth')} value={inr(done.reduce((a, b) => a + keep(b), 0))} />
      </div>

      {/* A woman member controls whether women-only work reaches her. */}
      {me.gender === 'F' && (
        <div className="mb-3">
          <ToggleRow on={takeWomenOnly} onClick={() => setTakeWomenOnly(!takeWomenOnly)} Icon={ShieldCheck} tone="plum"
            title={t('womenPref')} sub={t('womenPrefSub')} />
        </div>
      )}

      <div className="dsp font-semibold mb-1 flex items-center gap-2" style={{ color: T.ink, fontSize: 15 }}>
        <Bell size={16} color={T.gold} /> {t('jobRequests')}
      </div>
      <div className="bdy text-xs mb-2.5" style={{ color: T.muted }}>{t('forYourTrade')}</div>

      {!online || requests.length === 0 ? (
        <Card className="p-6 text-center">
          <Clock size={26} color={T.muted} className="mx-auto mb-3" />
          <div className="bdy text-sm mx-auto" style={{ color: T.muted, maxWidth: '38ch' }}>{t('noJobs')}</div>
        </Card>
      ) : requests.map(b => (
        <Card key={b.id} className="mb-2.5 overflow-hidden" raise={2} style={{ borderColor: b.womenOnly ? T.plum : T.gold }}>
          <div className="flex">
            <TaskArt cat={b.cat} h={116} className="w-24 shrink-0 rounded-none" />
            <div className="p-3.5 flex-1 min-w-0">
              <div className="bdy font-semibold" style={{ color: T.ink, fontSize: 15 }}>{cn(b.cat)}</div>
              <div className="bdy text-sm" style={{ color: T.ink2 }}>{b.issue[lang]}</div>
              <div className="bdy text-xs mt-1.5 flex items-center gap-3 flex-wrap" style={{ color: T.muted }}>
                <span className="flex items-center gap-1"><MapPin size={11} />{b.ward}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{whenLabel(b, lang)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {b.womenOnly && <WomenTag label={t('womenPill')} />}
                {b.emergency && <Pill tone="brick">{t('emergency')}</Pill>}
              </div>
              <div className="dsp num text-xl font-bold mt-1.5" style={{ color: T.green }}>{inr(keep(b))}
                <span className="bdy text-xs font-normal ml-1.5" style={{ color: T.muted }}>{t('youKeep')}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 p-3 pt-0">
            <Btn kind="ghost" size="lg" onClick={() => { setHidden(h => [...h, b.id]); toastFn(t('hiddenFromFeed')); }}>{t('decline')}</Btn>
            <Btn size="lg" kind={b.womenOnly ? 'plum' : 'primary'} onClick={() => {
              /* Guard, not just a filter: a women-only job can never be taken
                 by a member who is not a woman, whatever reached the screen. */
              if (b.womenOnly && me.gender !== 'F') { toastFn(t('wg2s')); return; }
              set(s => ({ ...s, bookings: s.bookings.map(x => x.id === b.id
                ? { ...x, status: 'Assigned', workerId: me.id, soc: me.soc } : x) }));
              setActiveId(b.id); setShots([]); go('active');
              notify(['customer'], 'nfAssigned', { name: me.name.split(' ')[0] }, 'green');
              toastFn(t('accepted'));
            }}>{t('accept')}</Btn>
          </div>
        </Card>
      ))}
    </div>
  );

  const Active = () => {
    const b = activeJob;
    if (!b) return (
      <div className="p-4 max-w-md mx-auto">
        <PageTop onBack={back} backLabel={t('back')} title={t('wJobs')} />
        <Card className="p-10 text-center">
          <Briefcase size={24} color={T.muted} className="mx-auto mb-3" />
          <div className="bdy text-sm" style={{ color: T.muted }}>{t('noActive')}</div>
        </Card>
      </div>
    );
    const stage = b.status === 'In progress' ? 2 : b.status === 'On the way' ? 1 : 0;
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTop onBack={back} backLabel={t('back')} />
        <Card className="overflow-hidden" raise={2}>
          <TaskArt cat={b.cat} h={110} className="rounded-none" />
          <div className="p-4">
            <div className="bdy text-xs mb-1" style={{ color: T.muted }}>{b.id}</div>
            <div className="dsp text-lg font-bold mb-1" style={{ color: T.ink }}>{cn(b.cat)}</div>
            <div className="bdy text-sm mb-3" style={{ color: T.ink2 }}>{b.issue[lang]}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {b.womenOnly && <WomenTag label={t('womenPill')} size="md" />}
              {b.emergency && <Pill tone="brick">{t('emergency')}</Pill>}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg mb-3" style={{ background: T.paper }}>
              <CalendarClock size={15} color={T.green} className="shrink-0" />
              <div className="bdy text-sm" style={{ color: T.ink }}>{whenLabel(b, lang)}</div>
            </div>
            <div className="p-3 rounded-lg mb-4" style={{ background: T.paper }}>
              <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{b.customer}</div>
              <div className="bdy text-xs" style={{ color: T.muted }}>B-402, Shreeji Residency, {b.ward}</div>
              <div className="flex gap-2 mt-3">
                <Btn size="sm" kind="ghost" className="flex-1"><Phone size={13} className="inline mr-1.5" />{t('call')}</Btn>
                <Btn size="sm" kind="ghost" className="flex-1"><MapPin size={13} className="inline mr-1.5" />{t('navigate')}</Btn>
              </div>
            </div>
            <div className="p-3 rounded-lg mb-4" style={{ background: T.greenLt }}>
              <div className="flex items-center justify-between gap-2">
                <span className="bdy text-sm" style={{ color: T.green }}>{t('yourTake')}</span>
                <span className="dsp num text-lg font-bold" style={{ color: T.green }}>{inr(keep(b))}</span>
              </div>
              {b.surge > 0 && (
                <div className="flex items-center justify-between gap-2 mt-1.5 bdy text-xs" style={{ color: T.goldDeep }}>
                  <span>{t('surgeLine')}</span><span className="num">+{inr(b.surge)}</span>
                </div>
              )}
            </div>
            <PhotoPicker t={t} value={shots} onChange={fn => setShots(s => typeof fn === 'function' ? fn(s) : fn)}
              label={stage < 2 ? t('beforePhoto') : t('afterPhoto')} onAdded={() => toastFn(t('photoAdded'))} />
            {stage === 0 && <Btn size="lg" className="w-full" onClick={() => { advance(b, 'On the way');
              notify(['customer'], 'nfOnWay', { name: me.name.split(' ')[0] }, 'green'); toastFn(t('custCanSee')); }}>{t('imOnWay')}</Btn>}
            {stage === 1 && <Btn size="lg" className="w-full" onClick={() => { advance(b, 'In progress'); setShots([]);
              notify(['customer'], 'nfStarted', { name: me.name.split(' ')[0] }, 'green'); toastFn(t('jobStarted')); }}>{t('startJob')}</Btn>}
            {stage === 2 && <Btn kind="gold" size="lg" className="w-full" onClick={() => {
              advance(b, 'Completed');
              setActiveId(null); setShots([]); setStack(['home', 'earnings']);
              notify(['customer'], 'nfDone', { id: b.id }, 'green');
              notify(['worker'], 'nfCredited', { amt: inr(keep(b)) }, 'green');
              toastFn(inr(keep(b)) + ' ' + t('credited') + ' ' + inr(val(b) * st.policy.welfare / 100) + ' ' + t('addedToFund'));
            }}>{t('finishJob')}</Btn>}
          </div>
        </Card>
      </div>
    );
  };

  const Earnings = () => {
    const rows = done.slice(0, 9);
    const wk = [0.12, 0.16, 0.08, 0.2, 0.14, 0.22, 0.08];
    const total = done.reduce((a, b) => a + keep(b), 0);
    const weekly = wk.map((f, i) => ({ d: DOW_KEYS[(i + 1) % 7][lang], v: Math.round(total * f) }));
    return (
      <div className="p-4 max-w-md mx-auto">
        <PageTop onBack={stack.length > 1 ? back : null} backLabel={t('back')} title={t('wEarn')} />
        <Card className="p-4 mb-3" raise={2}>
          <div className="bdy text-xs mb-1" style={{ color: T.muted }}>{t('thisWeek')}</div>
          <div className="dsp num text-2xl font-bold mb-3" style={{ color: T.ink }}>{inr(total)}</div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <defs>
                  <linearGradient id="gradWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.greenMid} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={T.green} stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: T.paper }} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.line}` }} />
                <Bar dataKey="v" radius={[5, 5, 0, 0]} fill="url(#gradWeekly)" animationDuration={700} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <div className="dsp font-semibold mb-2.5" style={{ color: T.ink, fontSize: 15 }}>{t('everyJob')}</div>
        {rows.length === 0 && <Card className="p-6 bdy text-sm text-center" style={{ color: T.muted }}>{t('noJobs')}</Card>}
        {rows.map(b => (
          <Card key={b.id} className="p-3.5 mb-2">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <TaskArt cat={b.cat} h={34} className="w-10 shrink-0" />
                <div className="min-w-0">
                  <div className="bdy text-sm font-medium truncate" style={{ color: T.ink }}>{cn(b.cat)}</div>
                  <div className="bdy text-xs" style={{ color: T.muted }}>{b.id}</div>
                </div>
              </div>
              <div className="dsp num font-bold shrink-0" style={{ color: T.green }}>{inr(keep(b))}</div>
            </div>
            <div className="space-y-1">
              {[[t('gross'), val(b), T.ink2], [t('welfareFund'), -val(b) * st.policy.welfare / 100, T.gold],
                [t('societyOps'), -val(b) * st.policy.society / 100, T.muted],
                [t('platform'), -val(b) * st.policy.platform / 100, T.muted],
                ...(b.surge > 0 ? [[t('surgeLine'), b.surge, T.green]] : [])].map(([k, v, c]) => (
                <div key={k} className="flex justify-between gap-2 bdy text-xs">
                  <span style={{ color: T.muted }}>{k}</span>
                  <span className="num shrink-0" style={{ color: c }}>{v < 0 ? '−' : ''}{inr(Math.abs(v))}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const Welfare = () => (
    <div className="p-4 max-w-md mx-auto">
      <PageTop onBack={stack.length > 1 ? back : null} backLabel={t('back')} title={t('wWelfare')} />
      <Card className="p-5 mb-3" raise={2} style={{ background: `linear-gradient(140deg, ${T.greenDeep}, ${T.green})`, borderColor: T.greenDeep }}>
        <div className="bdy text-xs mb-1" style={{ color: '#BFE0D3' }}>{t('yourWelfareFund')}</div>
        <div className="dsp num text-3xl font-bold mb-1" style={{ color: '#fff' }}>{inr(me.welfare)}</div>
        <div className="bdy text-xs" style={{ color: '#BFE0D3' }}>{t('builtFrom')} {me.jobs} {t('jobsSince')} {me.joined}. {t('yoursNotPlatform')}</div>
      </Card>
      <Card className="p-4 mb-3">
        <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('coverInForce')}</div>
        {[[t('accidentCover'), '₹2,00,000', true], [t('lifeCover'), '₹2,00,000', me.insured], [t('pension'), inr(me.welfare * 0.4), true]].map(([k, v, ok]) => (
          <div key={k} className="flex items-center justify-between gap-2 py-2.5" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
            <div className="flex items-center gap-2.5 min-w-0">
              {ok ? <CheckCircle2 size={16} color={T.green} className="shrink-0" /> : <AlertTriangle size={16} color={T.gold} className="shrink-0" />}
              <span className="bdy text-sm" style={{ color: T.ink }}>{k}</span>
            </div>
            <span className="bdy num text-sm font-medium shrink-0" style={{ color: ok ? T.ink : T.gold }}>{ok ? v : t('notEnrolled')}</span>
          </div>
        ))}
        {!me.insured && <Btn size="sm" className="mt-3 w-full" onClick={() => toastFn(t('enrolSent'))}>{t('askEnrol')}</Btn>}
      </Card>

      {/* Safety sits with welfare: both are things the society owes its members. */}
      <Card className="p-4 mb-3" style={{ borderColor: me.gender === 'F' ? T.plum + '44' : T.line }}>
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={15} color={me.gender === 'F' ? T.plum : T.green} />
          <span className="dsp text-sm font-semibold" style={{ color: T.ink }}>{t('safetyPanel')}</span>
        </div>
        <div className="bdy text-sm font-medium mb-1" style={{ color: T.ink }}>{t('nightEscort')}</div>
        <div className="bdy text-xs mb-3" style={{ color: T.muted }}>{t('nightEscortSub')}</div>
        <Btn size="sm" kind={me.gender === 'F' ? 'plum' : 'ghost'} onClick={() => toastFn(t('escortOn'))}>{t('requestEscort')}</Btn>
      </Card>

      <Btn kind="ghost" className="w-full" onClick={() => toastFn(t('claimSent'))}>{t('raiseClaim')}</Btn>
    </div>
  );

  const IdCard = () => (
    <div className="p-4 max-w-md mx-auto">
      <PageTop onBack={stack.length > 1 ? back : null} backLabel={t('back')} title={t('wId')} />
      <Card className="p-5 mb-3" raise={2}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="bdy text-xs" style={{ color: T.muted }}>{socOf(me.soc).name[lang]}</div>
            <div className="dsp text-lg font-bold mt-1" style={{ color: T.ink }}>{me.name}</div>
            <div className="bdy num text-xs" style={{ color: T.muted }}>{me.id} · {t('memberSince')} {me.joined}</div>
          </div>
          <div className="w-14 h-14 rounded-lg grid place-items-center dsp text-xl font-bold shrink-0"
            style={{ background: me.gender === 'F' ? T.plumLt : T.greenLt, color: me.gender === 'F' ? T.plum : T.green }}>{me.name[0]}</div>
        </div>
        <div className="flex justify-center p-3 rounded-lg mb-3" style={{ background: T.paper }}><FakeQR text={me.id + me.name} /></div>
        <div className="bdy text-xs text-center mb-4" style={{ color: T.muted }}>{t('scanNote')}</div>
        <div className="flex flex-wrap gap-1.5">
          {me.certs.map(c => <Pill key={c.cat}>{catOf(c.cat).n[lang]} — {c.lvl}</Pill>)}
          {me.verified && <Pill tone="gold">{t('tbVerified')}</Pill>}
          {me.gender === 'F' && <WomenTag label={t('womanPill')} />}
        </div>
      </Card>
      <Card className="p-4">
        <div className="dsp text-sm font-semibold mb-2" style={{ color: T.ink }}>{t('addSkill')}</div>
        <div className="bdy text-xs mb-3" style={{ color: T.muted }}>{t('addSkillDesc')}</div>
        <Btn size="sm" kind="ghost" onClick={() => toastFn(t('assessSent'))}>{t('reqAssessment')}</Btn>
      </Card>
    </div>
  );

  const nav = [
    { id: 'home', k: 'wHome', Icon: HomeIcon }, { id: 'active', k: 'wJobs', Icon: Briefcase },
    { id: 'earnings', k: 'wEarn', Icon: Wallet }, { id: 'welfare', k: 'wWelfare', Icon: Shield },
    { id: 'id', k: 'wId', Icon: BadgeCheck },
  ];

  return (
    <div className="relative">
      {tab === 'home' ? <Home /> : tab === 'active' ? <Active /> : tab === 'earnings' ? <Earnings /> : tab === 'welfare' ? <Welfare /> : <IdCard />}

      <button onClick={() => setSos(true)} className="fixed right-4 bottom-24 w-14 h-14 rounded-full grid place-items-center z-30 tap"
        style={{ background: `linear-gradient(160deg, #C24634, ${T.brick})`, boxShadow: '0 8px 22px rgba(178,58,43,.42)' }} aria-label={t('emergency')}><Siren size={24} color="#fff" /></button>

      {sos && (
        <div className="fixed inset-0 z-40 grid place-items-center p-6" style={{ background: 'rgba(12,30,25,.55)' }}>
          <Card className="p-6 max-w-sm w-full text-center" raise={2} style={{ animation: 'popIn .25s ease' }}>
            <Siren size={30} color={T.brick} className="mx-auto mb-3" />
            <div className="dsp text-lg font-bold mb-2" style={{ color: T.ink }}>{t('emergency')}</div>
            <div className="bdy text-sm mb-5" style={{ color: T.ink2 }}>{t('sosDesc')}</div>
            <Btn kind="danger" size="lg" className="w-full mb-2" onClick={() => {
              set(s => ({ ...s, alerts: [{ id: 'AL' + Date.now(), worker: me.name, ward: me.ward, soc: me.soc, women: me.gender === 'F' }, ...s.alerts] }));
              notify(['society', 'federation'], 'nfSos', { name: me.name, ward: me.ward }, 'brick');
              setSos(false); toastFn(t('alertSent'));
            }}>{t('sendAlert')}</Btn>
            <Btn kind="ghost" className="w-full" onClick={() => setSos(false)}>{t('cancel')}</Btn>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 pb-4 pt-2">
        <span className="bdy text-xs" style={{ color: T.muted }}>{t('poweredBy')}</span>
        <SynapseMark scale={0.85} descriptor={false} />
      </div>
      <div style={{ height: 76 }} />
      <BottomNav nav={nav} tab={tab} t={t} max={480} onPick={id => setStack([id])} />
    </div>
  );
}

/* =========================================================== SOCIETY ADMIN */
function SocietyApp({ st, set, tab, setTab, t, lang, toastFn, notify }) {
  const soc = SOCIETIES[0];
  const roster = WORKERS.filter(w => w.soc === soc.id);
  const women = roster.filter(w => w.gender === 'F');
  const bookings = st.bookings.filter(b => b.soc === soc.id);
  const womenBookings = bookings.filter(b => b.womenOnly);
  const homeBack = tab !== 'overview' ? () => setTab('overview') : null;

  if (tab === 'overview') return (
    <div className="p-5">
      <PageTop title={soc.name[lang]} sub={soc.wards.join(' · ')} />
      {st.alerts.length > 0 && (
        <Card className="p-4 mb-4" style={{ background: T.brickLt, borderColor: T.brick }}>
          <div className="flex items-center gap-2.5 mb-2"><Siren size={17} color={T.brick} />
            <span className="dsp font-semibold text-sm" style={{ color: T.brick }}>{t('emergAlerts')}</span></div>
          {st.alerts.map(a => (
            <div key={a.id} className="flex items-center justify-between gap-2 py-1.5 flex-wrap">
              <span className="bdy text-sm flex items-center gap-2" style={{ color: T.ink }}>
                {a.worker} — {a.ward}
                {a.women && <WomenTag label={t('womanPill')} />}
              </span>
              <Btn size="sm" kind="danger" onClick={() => { set(s => ({ ...s, alerts: s.alerts.filter(x => x.id !== a.id) })); toastFn(t('dispatched')); }}>{t('respond')}</Btn>
            </div>
          ))}
        </Card>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label={t('activeWorkers')} value={roster.length} sub={roster.filter(w => w.verified).length + ' ' + t('verifiedCount')} />
        <Stat label={t('womenOnTheRoster')} value={women.length} tone={T.plum} accent={T.plum}
          sub={Math.round(women.length / (roster.length || 1) * 100) + '% ' + t('membersStat').toLowerCase()} />
        <Stat label={t('jobsToday')} value={bookings.filter(b => b.status !== 'Completed').length} />
        <Stat label={t('revenueMonth')} value={inr(bookings.reduce((a, b) => a + baseOf(b, st.wageFloor), 0))} />
        <Stat label={t('openGriev')} value={st.grievances.filter(g => g.soc === soc.id && g.status !== 'gResolved').length} tone={T.brick} sub={t('sla7')} />
      </div>
      <div className="grid lg:grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('byWard')}</div>
          <div style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={soc.wards.map(w => ({ w, n: WARD_30D[w] || 0 }))}>
                <defs>
                  <linearGradient id="gradWard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.green} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={T.green} stopOpacity={0.55} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={T.line} strokeDasharray="3 4" />
                <XAxis dataKey="w" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.line}` }} />
                <Bar dataKey="n" radius={[5, 5, 0, 0]} fill="url(#gradWard)" animationDuration={700} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('onboardQ')}</div>
          {st.onboard.filter(o => o.soc === soc.id).length === 0
            ? <div className="bdy text-sm py-6 text-center" style={{ color: T.muted }}>{t('queueClear')}</div>
            : st.onboard.filter(o => o.soc === soc.id).map(o => (
              <div key={o.id} className="flex items-center justify-between gap-2 py-2.5" style={{ borderBottom: `1px solid ${T.line}` }}>
                <div className="min-w-0">
                  <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{o.name}</div>
                  <div className="bdy text-xs" style={{ color: T.muted }}>{catOf(o.cat).n[lang]} · {o.years} {t('yrs')} · {o.docsOk}/3 {t('documents')}</div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Btn size="sm" kind="ghost" onClick={() => { set(s => ({ ...s, onboard: s.onboard.filter(x => x.id !== o.id) })); toastFn(t('returned')); }}>{t('returnApp')}</Btn>
                  <Btn size="sm" onClick={() => { set(s => ({ ...s, onboard: s.onboard.filter(x => x.id !== o.id) })); toastFn(o.name + ' ' + t('addedRoster')); }}>{t('approve')}</Btn>
                </div>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );

  if (tab === 'workers') return (
    <div className="p-5">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('roster') + ' · ' + roster.length + ' ' + t('members')} />
      <Card className="overflow-x-auto">
        <div style={{ minWidth: 620 }}>
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bdy text-xs" style={{ background: T.paper, color: T.muted }}>
            <div className="col-span-3">{t('colMember')}</div><div className="col-span-2">{t('colTrade')}</div><div className="col-span-2">{t('colWard')}</div>
            <div className="col-span-1">{t('colRating')}</div><div className="col-span-2">{t('colFund')}</div><div className="col-span-2">{t('colStatus')}</div>
          </div>
          {roster.map(w => (
            <div key={w.id} className="grid grid-cols-12 gap-2 px-4 py-3 items-center rowhover" style={{ borderTop: `1px solid ${T.lineSoft}` }}>
              <div className="col-span-3 bdy text-sm font-medium flex items-center gap-2" style={{ color: T.ink }}>
                {w.name}{w.gender === 'F' && <ShieldCheck size={13} color={T.plum} aria-label={t('womanPill')} />}
              </div>
              <div className="col-span-2 bdy text-xs" style={{ color: T.ink2 }}>{catOf(w.cat).n[lang]}</div>
              <div className="col-span-2 bdy text-xs" style={{ color: T.muted }}>{w.ward}</div>
              <div className="col-span-1 bdy num text-xs" style={{ color: T.ink }}>{w.rating}</div>
              <div className="col-span-2 bdy num text-xs" style={{ color: T.ink }}>{inr(w.welfare)}</div>
              <div className="col-span-2">{w.verified ? <Pill>{t('verified')}</Pill> : <Pill tone="gold">{t('pending')}</Pill>}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  if (tab === 'monitor') return (
    <div className="p-5">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('liveBookings')} />
      <div className="space-y-2.5">
        {bookings.slice(0, 12).map(b => {
          const w = WORKERS.find(x => x.id === b.workerId);
          return (
            <Card key={b.id} className="p-3 flex items-center gap-3 flex-wrap">
              <TaskArt cat={b.cat} h={40} className="w-12 shrink-0" />
              <div className="flex-1 min-w-0" style={{ minWidth: 180 }}>
                <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{b.id} · {catOf(b.cat).n[lang]}</div>
                <div className="bdy text-xs" style={{ color: T.muted }}>{w?.name} → {b.customer} · {b.ward}</div>
              </div>
              {b.womenOnly && <WomenTag label={t('womenPill')} />}
              {b.emergency && <Pill tone="brick">{t('emergency')}</Pill>}
              <Pill tone={b.status === 'Completed' ? 'green' : b.status === 'Requested' ? 'gold' : 'grey'}>{t(STATUS_KEYS[b.status])}</Pill>
              <Btn size="sm" kind="ghost" onClick={() => toastFn(t('reassignOpened') + ' ' + b.id)}>{t('reassign')}</Btn>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if (tab === 'grievances') return (
    <div className="p-5">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('grievances')} />
      <div className="space-y-2.5">
        {st.grievances.map(g => {
          const w = WORKERS.find(x => x.id === g.workerId);
          const late = g.slaDays <= 2 && g.status !== 'gResolved';
          return (
            <Card key={g.id} className="p-4" style={{ borderColor: late ? T.brick : T.line }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bdy text-sm font-semibold" style={{ color: T.ink }}>{t(g.kind)}</span>
                    <Pill tone={g.status === 'gResolved' ? 'green' : g.status === 'gOpen' ? 'brick' : 'gold'}>{t(g.status)}</Pill>
                  </div>
                  <div className="bdy text-xs mt-0.5" style={{ color: T.muted }}>{g.id} · {w?.name} · {t('raised')} {g.raisedDays}d</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="bdy num text-xs font-semibold" style={{ color: late ? T.brick : T.muted }}>{g.slaDays}{t('daysLeft')}</div>
                  <div className="bdy text-xs" style={{ color: T.muted }}>{t('onSla')}</div>
                </div>
              </div>
              <div className="bdy text-sm mb-3" style={{ color: T.ink2 }}>{g.note[lang]}</div>
              {g.status !== 'gResolved' && (
                <div className="flex gap-2">
                  <Btn size="sm" kind="ghost" onClick={() => { set(s => ({ ...s, grievances: s.grievances.map(x => x.id === g.id ? { ...x, status: 'gReview' } : x) })); toastFn(t('assignedOfficer')); }}>{t('takeUp')}</Btn>
                  <Btn size="sm" onClick={() => { set(s => ({ ...s, grievances: s.grievances.map(x => x.id === g.id ? { ...x, status: 'gResolved' } : x) })); toastFn(t('resolved')); }}>{t('resolve')}</Btn>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );

  if (tab === 'wagefloor') return (
    <div className="p-5 max-w-2xl">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('wageFloorNav')} sub={t('wageFloorDesc')} />
      <Card className="p-5">
        {CATS.slice(0, 7).map(c => {
          const v = st.wageFloor[c.id] ?? c.rate;
          return (
            <div key={c.id} className="flex items-center gap-3 py-3 flex-wrap" style={{ borderBottom: `1px solid ${T.line}` }}>
              <c.Icon size={17} color={T.green} className="shrink-0" />
              <span className="bdy text-sm flex-1" style={{ color: T.ink, minWidth: 120 }}>{c.n[lang]}</span>
              <input type="range" min={150} max={600} step={10} value={v}
                onChange={e => set(s => ({ ...s, wageFloor: { ...s.wageFloor, [c.id]: +e.target.value } }))}
                onPointerUp={e => notify(['worker', 'customer', 'federation'], 'nfFloor',
                  { label: c.n[0], amt: inr(+e.target.value) }, 'gold')}
                className="w-36" style={{ accentColor: T.green }} />
              <span className="dsp num text-sm font-bold w-16 text-right" style={{ color: T.ink }}>{inr(v)}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );

  /* The women's cell is where the women-only promise is actually administered:
     who is certified, how much women-only work is coming in, and whether the
     society has enough certified women to meet it. */
  if (tab === 'mahila') {
    const womenGriev = st.grievances.filter(g => {
      const w = WORKERS.find(x => x.id === g.workerId);
      return g.soc === soc.id && w && w.gender === 'F' && g.status !== 'gResolved';
    });
    const spread = CATS.map(c => ({
      c,
      certified: women.filter(w => w.cat === c.id).length,
      demand: womenBookings.filter(b => b.cat === c.id).length,
    }));
    const short = spread.filter(x => x.demand > x.certified).sort((a, b) => (b.demand - b.certified) - (a.demand - a.certified));
    const maxSpread = Math.max(1, ...spread.map(x => Math.max(x.certified, x.demand)));
    return (
      <div className="p-5 max-w-3xl">
        <PageTop onBack={homeBack} backLabel={t('overview')} title={t('womenCell')} sub={t('womenCellSub')} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Stat label={t('womenOnTheRoster')} value={women.length} tone={T.plum} accent={T.plum}
            sub={women.filter(w => w.verified).length + ' ' + t('verifiedCount')} />
          <Stat label={t('womenOnlyJobs')} value={womenBookings.length} sub={t('rolling30')} />
          <Stat label={t('womenGriev')} value={womenGriev.length} tone={womenGriev.length ? T.brick : T.ink} sub={t('sla48')} />
          <Stat label={t('enrolledCover')} value={women.filter(w => w.insured).length + '/' + women.length} />
        </div>

        <Card className="p-4 mb-3">
          <div className="dsp text-sm font-semibold mb-1" style={{ color: T.ink }}>{t('tradeSpread')}</div>
          <div className="bdy text-xs mb-3" style={{ color: T.muted }}>{t('assessBatchSub')}</div>
          {spread.map(({ c, certified, demand }) => (
            <div key={c.id} className="flex items-center gap-3 py-2" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              <c.Icon size={15} color={demand > certified ? T.brick : T.plum} className="shrink-0" />
              <span className="bdy text-xs flex-1 min-w-0 truncate" style={{ color: T.ink }}>{c.n[lang]}</span>
              <div className="flex items-center gap-1 shrink-0" style={{ width: 128 }}>
                <div className="h-2 rounded-full" style={{ width: (certified / maxSpread * 100) + '%', background: T.plum, minWidth: certified ? 6 : 0 }} />
                <div className="h-2 rounded-full" style={{ width: (demand / maxSpread * 100) + '%', background: demand > certified ? T.brick : T.lineSoft, minWidth: demand ? 6 : 0 }} />
              </div>
              <span className="bdy num text-xs shrink-0 w-14 text-right" style={{ color: T.muted }}>{certified} / {demand}</span>
            </div>
          ))}
          <div className="flex items-center gap-4 mt-3 bdy text-xs flex-wrap" style={{ color: T.muted }}>
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm" style={{ background: T.plum }} />{t('womenMembers')}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm" style={{ background: T.brick }} />{t('womenOnlyJobs')}</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-1" style={{ color: T.ink }}>{t('assessBatch')}</div>
          <div className="bdy text-xs mb-3" style={{ color: T.muted }}>{t('assessBatchSub')}</div>
          {short.length === 0
            ? <div className="bdy text-sm py-5 text-center" style={{ color: T.muted }}>{t('withinCapacity')}</div>
            : short.slice(0, 4).map(({ c, certified, demand }) => (
              <div key={c.id} className="flex items-center justify-between gap-3 py-2.5 flex-wrap" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
                <div className="min-w-0">
                  <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{c.n[lang]}</div>
                  <div className="bdy num text-xs" style={{ color: T.muted }}>{t('needs')} {demand}, {t('has')} {certified}</div>
                </div>
                <Btn size="sm" kind="plum" onClick={() => toastFn(t('batchOpened'))}>{t('openBatch')}</Btn>
              </div>
            ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-2xl">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('welfareAdmin')} />
      <div className="grid sm:grid-cols-3 gap-3 mb-4">
        <Stat label={t('fundBalance')} value={inr(roster.reduce((a, w) => a + w.welfare, 0))} />
        <Stat label={t('enrolledCover')} value={roster.filter(w => w.insured).length + '/' + roster.length} />
        <Stat label={t('claimsPending')} value="3" tone={T.gold} />
      </div>
      <Card className="p-4">
        <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('notEnrolledList')}</div>
        {roster.filter(w => !w.insured).slice(0, 6).map(w => (
          <div key={w.id} className="flex items-center justify-between gap-2 py-2.5" style={{ borderBottom: `1px solid ${T.line}` }}>
            <div className="min-w-0">
              <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{w.name}</div>
              <div className="bdy num text-xs" style={{ color: T.muted }}>{inr(w.welfare)} · {w.jobs} {t('jobs')}</div>
            </div>
            <Btn size="sm" onClick={() => toastFn(w.name + ' ' + t('enrolled'))}>{t('enrol')}</Btn>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ======================================================== FEDERATION ADMIN */
function FederationApp({ st, set, tab, setTab, t, lang, toastFn, notify }) {
  const [day, setDay] = useState(0);
  const homeBack = tab !== 'overview' ? () => setTab('overview') : null;

  const socStats = SOCIETIES.map(s => {
    const ws = WORKERS.filter(w => w.soc === s.id);
    const bs = st.bookings.filter(b => b.soc === s.id);
    return { ...s, workers: ws.length, jobs: bs.length, revenue: bs.reduce((a, b) => a + baseOf(b, st.wageFloor), 0),
      women: ws.filter(w => w.gender === 'F').length,
      womenJobs: bs.filter(b => b.womenOnly).length,
      rating: +(ws.reduce((a, w) => a + w.rating, 0) / (ws.length || 1)).toFixed(2),
      grievances: st.grievances.filter(g => g.soc === s.id && g.status !== 'gResolved').length };
  });
  const dayRows = FORECAST.filter(f => f.day === day);
  const maxD = Math.max(...FORECAST.map(f => f.demand), 1);
  const gaps = useMemo(() => FORECAST.map(f => ({ ...f, supply: supplyFor(f.ward, f.slot) }))
    .map(f => ({ ...f, gap: f.demand - f.supply })).filter(f => f.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 6), []);

  if (tab === 'overview') return (
    <div className="p-5">
      <PageTop title={t('fedName')} sub={`${SOCIETIES.length} ${t('societiesN')} · ${WORKERS.length} ${t('members')} · 12 ${t('wardsN')}`} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <Stat label={t('membersStat')} value={WORKERS.length} sub={WORKERS.filter(w => w.verified).length + ' ' + t('verifiedCount')} />
        <Stat label={t('womenShare')} value={Math.round(FEMALE_COUNT / WORKERS.length * 100) + '%'} tone={T.plum} accent={T.plum}
          sub={FEMALE_COUNT + ' ' + t('womenMembers').toLowerCase()} />
        <Stat label={t('bookingsStat')} value={st.bookings.length} sub={t('rolling30')} />
        <Stat label={t('welfarePooled')} value={inr(WORKERS.reduce((a, w) => a + w.welfare, 0))} tone={T.gold} />
        <Stat label={t('grievRate')} value={(st.grievances.filter(g => g.status !== 'gResolved').length / WORKERS.length * 100).toFixed(1) + '%'} />
      </div>
      <Card className="p-4 mb-4">
        <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('demand90')}</div>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={DEMAND_SERIES}>
              <CartesianGrid vertical={false} stroke={T.line} strokeDasharray="3 4" />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} interval={8} />
              <YAxis tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${T.line}` }} />
              <Line type="monotone" dataKey="n" stroke={T.green} strokeWidth={2.5} dot={false}
                activeDot={{ r: 5, fill: T.green, stroke: '#fff', strokeWidth: 2 }}
                animationDuration={900} animationEasing="ease-in-out" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="overflow-x-auto">
        <div style={{ minWidth: 660 }}>
          {(() => { const COLS = '2.4fr .9fr .9fr 1fr 1.4fr .8fr .8fr'; return (<>
          <div className="grid gap-2 px-4 py-2.5 bdy text-xs" style={{ gridTemplateColumns: COLS, background: T.paper, color: T.muted }}>
            <div>{t('colSociety')}</div><div className="text-right">{t('colMembers')}</div>
            <div className="text-right" style={{ color: T.plum }}>{t('colWomen')}</div>
            <div className="text-right">{t('colBookings')}</div><div className="text-right">{t('colRevenue')}</div>
            <div className="text-right">{t('colRating')}</div><div className="text-right">{t('colOpen')}</div>
          </div>
          {socStats.map(s => (
            <div key={s.id} className="grid gap-2 px-4 py-3 items-center rowhover" style={{ gridTemplateColumns: COLS, borderTop: `1px solid ${T.lineSoft}` }}>
              <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{s.district[lang]}</div>
              <div className="bdy num text-sm text-right" style={{ color: T.ink2 }}>{s.workers}</div>
              <div className="bdy num text-sm text-right font-medium" style={{ color: T.plum }}>{s.women}</div>
              <div className="bdy num text-sm text-right" style={{ color: T.ink2 }}>{s.jobs}</div>
              <div className="bdy num text-sm text-right" style={{ color: T.ink }}>{inr(s.revenue)}</div>
              <div className="bdy num text-sm text-right" style={{ color: T.ink2 }}>{s.rating}</div>
              <div className="bdy num text-sm text-right" style={{ color: s.grievances > 2 ? T.brick : T.muted }}>{s.grievances}</div>
            </div>
          ))}
          </>); })()}
        </div>
      </Card>
    </div>
  );

  if (tab === 'forecast') return (
    <div className="p-5">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('forecastNav')} sub={t('forecastDesc')} />
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {Array.from({ length: 7 }, (_, i) => (
          <button key={i} onClick={() => setDay(i)} className="bdy text-xs px-3 py-2 rounded-lg"
            style={{ background: day === i ? T.green : T.card, color: day === i ? '#fff' : T.ink2, border: `1px solid ${day === i ? T.green : T.line}` }}>
            {DOW_KEYS[(i + 4) % 7][lang]}{i === 0 ? ' · ' + t('dToday') : ''}
          </button>
        ))}
      </div>

      <Card className="p-4 mb-4 overflow-x-auto">
        <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('predByWard')}</div>
        <div style={{ minWidth: 580 }}>
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '140px repeat(4, 1fr)' }}>
            <div />{SLOT_KEYS.map(s => <div key={s} className="bdy text-xs text-center pb-1" style={{ color: T.muted }}>{t(s)}</div>)}
          </div>
          {WARDS.map(w => (
            <div key={w.ward} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '140px repeat(4, 1fr)' }}>
              <div className="bdy text-xs flex items-center gap-1.5" style={{ color: T.ink2 }}>
                {w.ward}<span style={{ color: T.muted, fontSize: 10 }}>{socOf(w.soc).district[lang]}</span>
              </div>
              {SLOTS.map((s, si) => {
                const f = dayRows.find(x => x.ward === w.ward && x.slot === s) || { demand: 0 };
                const sup = supplyFor(w.ward, s);
                const short = f.demand > sup, a = Math.min(1, f.demand / maxD);
                return (
                  <div key={s} className="rounded-md grid place-items-center py-2.5"
                    style={{ background: short ? `rgba(178,58,43,${0.16 + a * 0.7})` : `rgba(11,107,79,${0.10 + a * 0.7})` }}
                    title={`${w.ward} · ${t(SLOT_KEYS[si])}: ${f.demand} / ${sup}`}>
                    <span className="dsp num text-sm font-bold" style={{ color: a > 0.5 ? '#fff' : T.ink }}>{f.demand}</span>
                    <span className="bdy num" style={{ fontSize: 9, color: a > 0.5 ? 'rgba(255,255,255,.8)' : T.muted }}>{t('ofN')} {sup}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 bdy text-xs flex-wrap" style={{ color: T.muted }}>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: T.green }} />{t('withinCapacity')}</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: T.brick }} />{t('exceeds')}</span>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-1" style={{ color: T.ink }}>{t('supplyGaps')}</div>
          <div className="bdy text-xs mb-3" style={{ color: T.muted }}>{t('supplyGapsSub')}</div>
          {gaps.map((g, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: `1px solid ${T.line}` }}>
              <div className="w-8 h-8 rounded-lg grid place-items-center dsp num text-sm font-bold shrink-0" style={{ background: T.brickLt, color: T.brick }}>{g.gap}</div>
              <div className="flex-1 min-w-0">
                <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{g.ward} · {t(SLOT_KEYS[SLOTS.indexOf(g.slot)])}</div>
                <div className="bdy num text-xs" style={{ color: T.muted }}>{DOW_KEYS[g.dow][lang]} · {t('needs')} {g.demand}, {t('has')} {g.supply}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-1" style={{ color: T.ink }}>{t('recommended')}</div>
          <div className="bdy text-xs mb-3" style={{ color: T.muted }}>{t('recommendedSub')}</div>
          {gaps.slice(0, 3).map((g, i) => {
            const donor = WARDS.find(w => w.soc === g.soc && w.ward !== g.ward);
            const trainees = 3 + i * 2;
            return (
              <div key={i} className="p-3 rounded-lg mb-2.5" style={{ background: T.paper }}>
                <div className="bdy text-sm mb-2" style={{ color: T.ink }}>
                  <strong style={{ fontWeight: 600 }}>{g.ward}</strong> {t('needsMore')} {g.gap} {CATS[i % CATS.length].n[lang]} — {DOW_KEYS[g.dow][lang]} {t(SLOT_KEYS[SLOTS.indexOf(g.slot)])}
                </div>
                <div className="bdy text-xs mb-2.5" style={{ color: T.ink2 }}>
                  {t('reassignFrom')} {donor?.ward}, {t('orFastTrack')} {trainees} {t('traineesReg')}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Btn size="sm" onClick={() => toastFn(t('reallocPushed'))}>{t('reallocate')}</Btn>
                  <Btn size="sm" kind="ghost" onClick={() => toastFn(t('batchSched'))}>{t('schedTraining')}</Btn>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );

  if (tab === 'map') return (
    <div className="p-5">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('mapTitle')} />
      <Card className="p-4 mb-3">
        <svg viewBox="0 0 400 300" className="w-full" style={{ maxHeight: 340 }}>
          <path d="M120 40 L200 30 L260 70 L280 140 L240 210 L170 260 L110 230 L70 160 L80 90 Z" fill={T.greenLt} stroke={T.line} strokeWidth="2" />
          {[[1, 175, 95], [3, 205, 150], [0, 195, 215], [2, 110, 130]].map(([si, x, y]) => {
            const s = socStats[si];
            return (
              <g key={s.id}>
                <circle cx={x} cy={y} r={10 + s.jobs / 3} fill={s.grievances > 2 ? T.brick : T.green} opacity="0.22" />
                <circle cx={x} cy={y} r="6" fill={s.grievances > 2 ? T.brick : T.green} />
                <text x={x + 12} y={y + 4} className="bdy" fontSize="11" fill={T.ink}>{s.district[lang]}</text>
                <text x={x + 12} y={y + 16} className="bdy num" fontSize="9" fill={T.muted}>{s.workers} {t('members')}</text>
              </g>
            );
          })}
        </svg>
      </Card>
      <div className="bdy text-xs" style={{ color: T.muted }}>{t('mapNote')}</div>
    </div>
  );

  if (tab === 'surplus') {
    const gross = st.bookings.reduce((a, b) => a + baseOf(b, st.wageFloor), 0);
    const platform = gross * st.policy.platform / 100;
    const surplus = platform - platform * 0.42;
    return (
      <div className="p-5 max-w-3xl">
        <PageTop onBack={homeBack} backLabel={t('overview')} title={t('surplusTitle')} sub={t('surplusDesc')} />
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <Stat label={t('grossValue')} value={inr(gross)} />
          <Stat label={t('platformShare')} value={inr(platform)} sub={st.policy.platform + '% ' + t('ofGross')} />
          <Stat label={t('distributable')} value={inr(surplus)} tone={T.green} sub={t('afterCosts')} />
        </div>
        <Card className="p-4">
          <div className="dsp text-sm font-semibold mb-3" style={{ color: T.ink }}>{t('dividendPer')}</div>
          {socStats.map(s => {
            const share = surplus * (s.jobs / (st.bookings.length || 1));
            return (
              <div key={s.id} className="flex items-center justify-between gap-2 py-2.5" style={{ borderBottom: `1px solid ${T.line}` }}>
                <div className="min-w-0">
                  <div className="bdy text-sm font-medium" style={{ color: T.ink }}>{s.district[lang]}</div>
                  <div className="bdy num text-xs" style={{ color: T.muted }}>{s.workers} {t('members')} · {inr(share / (s.workers || 1))} {t('perMember')}</div>
                </div>
                <div className="dsp num text-sm font-bold shrink-0" style={{ color: T.green }}>{inr(share)}</div>
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-2xl">
      <PageTop onBack={homeBack} backLabel={t('overview')} title={t('policyTitle')} sub={t('policyDesc')} />
      <Card className="p-5 mb-3">
        {[['welfare', 'welfareFund'], ['society', 'societyOps'], ['platform', 'platform']].map(([k, l]) => (
          <div key={k} className="flex items-center gap-3 py-3 flex-wrap" style={{ borderBottom: `1px solid ${T.line}` }}>
            <span className="bdy text-sm flex-1" style={{ color: T.ink, minWidth: 140 }}>{t(l)}</span>
            <input type="range" min={0} max={15} value={st.policy[k]}
              onChange={e => set(s => ({ ...s, policy: { ...s.policy, [k]: +e.target.value } }))}
              onPointerUp={e => notify(['worker', 'customer', 'society'], 'nfPolicy', { label: t(l), n: e.target.value }, 'gold')}
              className="w-40" style={{ accentColor: T.green }} />
            <span className="dsp num text-sm font-bold w-10 text-right" style={{ color: T.ink }}>{st.policy[k]}%</span>
          </div>
        ))}
        <div className="flex items-center gap-3 py-3 flex-wrap">
          <span className="bdy text-sm flex-1" style={{ color: T.ink, minWidth: 140 }}>{t('privateComparison')}</span>
          <input type="range" min={15} max={40} value={st.policy.privateCommission}
            onChange={e => set(s => ({ ...s, policy: { ...s.policy, privateCommission: +e.target.value } }))}
            className="w-40" style={{ accentColor: T.brick }} />
          <span className="dsp num text-sm font-bold w-10 text-right" style={{ color: T.brick }}>{st.policy.privateCommission}%</span>
        </div>
      </Card>
      <Card className="p-5">
        <div className="bdy text-xs mb-1" style={{ color: T.muted }}>{t('previewOn')}</div>
        <div className="dsp num text-2xl font-bold mb-4" style={{ color: T.ink }}>₹800</div>
        <MoneyBar amount={800} policy={st.policy} t={t} />
      </Card>
    </div>
  );
}

/* ===================================================================== APP */
export default function App() {
  const [role, setRole] = useState(null);
  const [lang, setLang] = useState(0);
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [live, setLive] = useState(true);
  const [st, set] = useState({
    bookings: SEED_BOOKINGS, grievances: SEED_GRIEVANCES, onboard: SEED_ONBOARD, alerts: [],
    wageFloor: {}, policy: { welfare: 5, society: 5, platform: 5, privateCommission: 28 },
    notifs: [],
  });

  const t = k => (D[k] ? D[k][lang] : k);
  const toastFn = m => { setToast(m); setTimeout(() => setToast(null), 2800); };

  const notify = React.useCallback((roles, k, v = {}, tone = 'green') => {
    set(s => ({ ...s, notifs: [{ id: 'N' + Date.now() + Math.random(), roles, k, v, tone, ts: Date.now(), read: false },
      ...s.notifs].slice(0, 40) }));
  }, []);
  const readAll = () => set(s => ({ ...s, notifs: s.notifs.map(n => role && n.roles.includes(role) ? { ...n, read: true } : n) }));

  /* Live tick — the world keeps moving while you look at it. Jobs advance
     through their statuses, new requests arrive, and each change fans out
     to whichever roles would actually hear about it. */
  React.useEffect(() => {
    if (!live) return;
    let n = 0;
    const id = setInterval(() => {
      n++;
      set(s => {
        const next = { ...s };
        if (n % 3 === 0) {
          const w = WORKERS[Math.floor(Math.random() * WORKERS.length)];
          const hours = 1 + Math.floor(Math.random() * 3);
          const b = { id: 'BK' + (bkSeq++), workerId: w.id, cat: w.cat, soc: w.soc, ward: w.ward,
            customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
            issue: ISSUES[Math.floor(Math.random() * ISSUES.length)], hours,
            base: w.rate * hours, surge: 0, slot: SLOTS[Math.floor(Math.random() * 4)],
            dayOff: Math.floor(Math.random() * 4),
            /* Same invariant as the seed data: women-only work only ever
               attaches to a woman member. */
            womenOnly: w.gender === 'F' && Math.random() > 0.6,
            emergency: false, status: 'Requested', rated: false };
          next.bookings = [b, ...s.bookings].slice(0, 90);
          next.notifs = [{ id: 'N' + Date.now() + Math.random(), roles: ['worker'], k: 'nfNewJob',
            v: { ward: w.ward, amt: inr(baseOf(b, s.wageFloor) * workerPctOf(s.policy) / 100) },
            tone: 'gold', ts: Date.now(), read: false }, ...s.notifs].slice(0, 40);
          return next;
        }
        const movable = s.bookings.filter(b => b.status !== 'Completed');
        if (!movable.length) return s;
        const pickB = movable[Math.floor(Math.random() * movable.length)];
        const ni = STATUSES.indexOf(pickB.status) + 1;
        const w = WORKERS.find(x => x.id === pickB.workerId);
        next.bookings = s.bookings.map(b => b.id === pickB.id ? { ...b, status: STATUSES[ni] } : b);
        if (pickB.mine && w) {
          const key = ['nfAssigned', 'nfOnWay', 'nfStarted', 'nfDone'][ni - 1];
          next.notifs = [{ id: 'N' + Date.now() + Math.random(), roles: ['customer'], k: key,
            v: { name: w.name.split(' ')[0], id: pickB.id }, tone: 'green', ts: Date.now(), read: false },
            ...s.notifs].slice(0, 40);
        } else if (n % 5 === 0) {
          next.notifs = [{ id: 'N' + Date.now() + Math.random(), roles: ['federation'], k: 'nfDemand',
            v: { ward: pickB.ward }, tone: 'gold', ts: Date.now(), read: false }, ...s.notifs].slice(0, 40);
        }
        return next;
      });
    }, 6000);
    return () => clearInterval(id);
  }, [live]);

  const enter = r => { setRole(r); setTab(r === 'society' || r === 'federation' ? 'overview' : 'home'); };

  const socNav = [
    { id: 'overview', k: 'overview', Icon: LayoutDashboard }, { id: 'workers', k: 'roster', Icon: Users },
    { id: 'monitor', k: 'liveBookings', Icon: Activity }, { id: 'mahila', k: 'womenCell', Icon: ShieldCheck },
    { id: 'grievances', k: 'grievances', Icon: ClipboardList },
    { id: 'wagefloor', k: 'wageFloorNav', Icon: Scale }, { id: 'welfare', k: 'wWelfare', Icon: Shield },
  ];
  const fedNav = [
    { id: 'overview', k: 'overview', Icon: LayoutDashboard }, { id: 'forecast', k: 'forecastNav', Icon: TrendingUp },
    { id: 'map', k: 'societiesNav', Icon: Map }, { id: 'surplus', k: 'surplusNav', Icon: Landmark },
    { id: 'policy', k: 'policyNav', Icon: Sliders },
  ];
  const roleKey = { customer: 'rCustomer', worker: 'rWorker', society: 'rSociety', federation: 'rFederation' }[role];

  return (
    <>
      <style>{FONTS}</style>
      <div className="bdy">
        {!role ? <Landing onPick={enter} t={t} lang={lang} policy={st.policy} /> : (
          <Shell roleKey={roleKey} role={role} lang={lang} setLang={setLang} onExit={() => setRole(null)} toast={toast} t={t}
            tab={tab} setTab={setTab} nav={role === 'society' ? socNav : role === 'federation' ? fedNav : null}
            notifs={st.notifs} onReadAll={readAll} live={live} setLive={setLive}>
            {role === 'customer' && <CustomerApp st={st} set={set} t={t} lang={lang} toastFn={toastFn} notify={notify} />}
            {role === 'worker' && <WorkerApp st={st} set={set} t={t} lang={lang} toastFn={toastFn} notify={notify} />}
            {role === 'society' && <SocietyApp st={st} set={set} tab={tab} setTab={setTab} t={t} lang={lang} toastFn={toastFn} notify={notify} />}
            {role === 'federation' && <FederationApp st={st} set={set} tab={tab} setTab={setTab} t={t} lang={lang} toastFn={toastFn} notify={notify} />}
          </Shell>
        )}
      </div>
    </>
  );
}
