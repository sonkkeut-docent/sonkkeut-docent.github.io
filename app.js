(function(){
  "use strict";

  /* ===== 인스타그램 주소: 아래 따옴표 안에 계정 주소를 넣으면 메뉴·푸터·카드뉴스 버튼이 모두 연결됩니다 =====
     예) var INSTAGRAM_URL = "https://www.instagram.com/sonkkeut_docent/";
     비워 두면 "준비 중입니다"가 뜹니다. */
  var INSTAGRAM_URL = "https://www.instagram.com/sonkkeut_docen/";

  var STATE={cardnews:[]};
  var app=document.getElementById("app");
  var VIEWS=["home","project","cardnews","team"];
  var loaded=false, loadFailed=false;

  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function imgSrc(im){return "cardnews/"+String(im.src||"").replace(/^\/+/,"")}
  function fmtDate(d){return d?String(d).replace(/-/g,"."):""}

  /* ---------- 점자 ---------- */
  var WORD=[{s:"손",c:"⠠⠷"},{s:"끝",c:"⠠⠈⠪⠦"},null,{s:"도",c:"⠊⠥"},{s:"슨",c:"⠠⠵"},{s:"트",c:"⠓⠪"}];
  function cellHTML(ch,idx){
    var code=ch.charCodeAt(0)-0x2800, order=[1,4,2,5,3,6], n=0;
    return '<span class="cell">'+order.map(function(d){var on=code&(1<<(d-1));return '<i class="dot'+(on?' on':'')+'"'+(on?' style="--i:'+(idx*3+(n++))+'"':'')+'></i>'}).join("")+'</span>';
  }
  function braille(size,labels){
    var k=0;
    return '<div class="braille '+size+'" role="img" aria-label="점자로 쓴 손끝 도슨트">'+WORD.map(function(w){
      if(!w)return '<span class="gap"></span>';
      return '<span class="syl"><span class="cells">'+Array.from(w.c).map(function(ch){return cellHTML(ch,k++)}).join("")+'</span>'+(labels?'<span class="syl-label" aria-hidden="true">'+w.s+'</span>':'')+'</span>';
    }).join("")+'</div>';
  }

  /* ---------- 레이아웃 ---------- */
  function soon(label,extra){return ' data-soon="'+esc(label)+'"'+(extra||"")}
  function insta(cls,label,style){
    var url=String(INSTAGRAM_URL||"").trim();
    var c=cls?' class="'+cls+'"':'', st=style?' style="'+style+'"':'';
    if(/^https:\/\/(www\.)?instagram\.com\//.test(url))
      return '<a'+c+st+' href="'+esc(url)+'" target="_blank" rel="noopener" aria-label="'+esc(label)+' (새 창에서 열림)">'+esc(label)+'</a>';
    return '<button type="button"'+c+soon("인스타그램")+'>'+esc(label)+'</button>';
  }
  function shell(){
    return ''+
    '<a class="skip" href="#main" data-skip>본문 바로가기</a>'+
    '<header class="site-header"><div class="wrap bar">'+
      '<a class="brand" href="#home" aria-label="손끝 도슨트 홈">'+braille("sm",false)+'<span class="brand-name">손끝 <span>도슨트</span></span></a>'+
      '<nav class="nav" id="nav" aria-label="주 메뉴"><ul>'+
        '<li><a href="#home" data-nav="home">홈</a></li>'+
        '<li><a href="#project" data-nav="project">프로젝트</a></li>'+
        '<li><button type="button" class="docent-link"'+soon("웹 도슨트")+'>웹 도슨트 <span class="soon-badge">준비 중</span></button></li>'+
        '<li><a href="#cardnews" data-nav="cardnews">카드뉴스</a></li>'+
        '<li><button type="button"'+soon("활동 기록")+'>활동 기록</button></li>'+
        '<li><a href="#team" data-nav="team">팀 소개</a></li>'+
        '<li>'+insta("","인스타그램")+'</li>'+
      '</ul></nav>'+
      '<div class="tools" role="group" aria-label="보기 설정">'+
        '<button type="button" class="tool" id="t-size" aria-label="글자 크기 바꾸기"><span aria-hidden="true">가</span><span class="tool-label"> 글자</span></button>'+
        '<button type="button" class="tool" id="t-contrast" aria-pressed="false">고대비</button>'+
        '<button type="button" class="tool menu-btn" id="t-menu" aria-expanded="false" aria-controls="nav">메뉴</button>'+
      '</div>'+
    '</div></header>'+
    '<main id="main" tabindex="-1"></main>'+
    '<footer class="site-footer"><div class="wrap">'+
      '<div class="stack" style="gap:6px"><strong>손끝 도슨트 · 썬덕걸즈</strong><p>롯데 밸유 for ESG 5기 봉사 프로젝트</p><p>이 사이트는 화면낭독기와 키보드만으로도 쓸 수 있도록 만들고 있습니다.</p></div>'+
      '<div class="foot-links">'+insta("tool","인스타그램",'display:inline-flex;align-items:center;text-decoration:none')+'<a class="tool" href="#cardnews" style="display:inline-flex;align-items:center;text-decoration:none">카드뉴스</a></div>'+
    '</div></footer>'+
    '<div class="toast" id="toast" role="status" aria-live="polite"><div><strong id="toast-title"></strong><span id="toast-msg"></span></div></div>'+
    '<dialog id="viewer" aria-labelledby="viewer-title"></dialog>';
  }

  /* ---------- 화면: 홈 ---------- */
  function viewHome(){
    var latest=STATE.cardnews.slice(0,3);
    return ''+
    '<div class="wrap hero">'+
      '<div class="hero-top">'+
        '<span class="eyebrow">롯데 밸유 for ESG 5기 · 썬덕걸즈</span>'+
        '<h1 class="h-xl" tabindex="-1" data-focus>손끝 도슨트</h1>'+
        '<p class="lede">스스로 찾아가고, 손으로 감상하고, 직접 안내하는 배리어프리 미술관 프로젝트입니다.</p>'+
      '</div>'+
      braille("lg",true)+
      '<div class="btn-row">'+
        '<button type="button" class="btn btn-primary"'+soon("웹 도슨트")+'>웹 도슨트 시작하기</button>'+
        '<a class="btn btn-ghost" href="#project">프로젝트 알아보기</a>'+
      '</div>'+
    '</div>'+
    '<section class="stat-band" aria-labelledby="stat-h"><div class="wrap">'+
      '<p class="stat-num" aria-hidden="true">1% 미만</p>'+
      '<div class="stat-text"><strong id="stat-h">시각장애인의 미술전시회 참여율은 1%도 되지 않습니다.</strong>'+
      '<p>관심이 없어서가 아니라, 스스로 이동하고 감상할 환경이 부족하기 때문입니다. 저희는 시각장애인에게 예술에 대한 선택권을 돌려드리고자 합니다.</p>'+
      '<small>출처: 서울연구원(2020)</small></div>'+
    '</div></section>'+
    '<section class="section" aria-labelledby="docent-h"><div class="wrap">'+
      '<div class="docent-panel">'+
        '<div class="stack"><span class="tag blue">2027년 1월 시범 운영 예정</span><h2 class="h-lg" id="docent-h">웹 도슨트</h2>'+
        '<p>미술관 입구와 작품 옆 촉각 표식의 QR을 찍으면, 이 사이트에서 길 안내와 작품 해설을 바로 들을 수 있습니다. 화면낭독기, 큰 글씨, 고대비 화면에 맞춰 만듭니다.</p></div>'+
        '<div class="feature-list">'+
          feature(1,"찾아가는 길","입구에서 작품까지, 걸음 수로 안내합니다")+
          feature(2,"작품 해설 듣기","참여 작가의 목소리로 녹음한 해설")+
          feature(3,"촉각 표식 찾기","손으로 찾는 QR 표식의 위치 안내")+
        '</div>'+
      '</div>'+
    '</div></section>'+
    '<section class="section" aria-labelledby="cn-h"><div class="wrap">'+
      '<div class="cn-toolbar"><div class="sec-head" style="margin:0"><span class="eyebrow">카드뉴스</span><h2 class="h-lg" id="cn-h">최근 소식</h2></div><a class="btn btn-ghost" href="#cardnews">전체 보기</a></div>'+
      (latest.length?'<div class="cn-grid">'+latest.map(cnCard).join("")+'</div>':
        '<div class="empty"><p>첫 카드뉴스를 준비하고 있습니다. 12월 첫 활동 소식부터 이곳에 올라옵니다.</p></div>')+
    '</div></section>'+
    '<section class="section" aria-labelledby="tl-h"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">일정</span><h2 class="h-lg" id="tl-h">이렇게 진행합니다</h2></div>'+
      timeline()+
    '</div></section>';
  }
  function feature(n,title,desc){
    return '<button type="button" class="feature"'+soon(title)+'><span class="num" aria-hidden="true">'+n+'</span><span><b>'+title+'</b><span class="desc">'+desc+'</span></span><span class="soon-badge">준비 중</span></button>';
  }
  function timeline(){
    var rows=[["11월","준비","협력 미술관 선정, 참여자 모집",false],["12월","1회차 봉사","동선 실측 답사, 손끝 아틀리에",true],["1월","2회차 봉사","오디오 도슨트 시범 운영, 전시·투어",true],["2~4월","확산","온라인 갤러리 공개, 4월 성과공유회",false]];
    return '<ol class="timeline">'+rows.map(function(r){return '<li'+(r[3]?' class="hot"':'')+'><span class="m">'+r[0]+'</span><span class="t">'+r[1]+'</span><span class="d">'+r[2]+'</span></li>'}).join("")+'</ol>';
  }

  /* ---------- 화면: 프로젝트 ---------- */
  function viewProject(){
    return ''+
    '<div class="wrap hero" style="padding-bottom:16px"><div class="hero-top"><span class="eyebrow">프로젝트 소개</span><h1 class="h-lg" tabindex="-1" data-focus>수혜자가 아니라, 주체로</h1>'+
    '<p class="lede">시각장애인 참여자가 조사자, 작가, 도슨트가 되어 미술관을 함께 바꿉니다.</p></div></div>'+
    '<section class="section" aria-labelledby="p1"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">문제</span><h2 class="h-lg" id="p1">있지만, 쓸 수 없는 접근성</h2><p>당사자 인터뷰에서 확인한 장벽입니다.</p></div>'+
      '<div class="grid g3">'+
        '<div class="card"><span class="tag">음성해설 QR</span><h3 class="h-md">있어도 찾을 수 없습니다</h3><p>작품 앞에 QR이 설치되어 있어도, 그 위치를 손으로 찾을 방법이 없습니다.</p></div>'+
        '<div class="card"><span class="tag">화면해설 영화</span><h3 class="h-md">있어도 혼자 갈 수 없습니다</h3><p>무인 발권기와 복잡한 동선 때문에 동행 없이는 어렵습니다.</p></div>'+
        '<div class="card"><span class="tag">미술관</span><h3 class="h-md">참여율 1% 미만</h3><p>시각장애인의 미술전시회 참여율은 1%에도 미치지 못합니다. (서울연구원, 2020)</p></div>'+
      '</div>'+
    '</div></section>'+
    '<section class="section" aria-labelledby="p2"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">참여자의 세 가지 역할</span><h2 class="h-lg" id="p2">조사자, 작가, 도슨트</h2></div>'+
      '<div class="grid g3">'+
        '<div class="card"><span class="tag blue">조사자</span><h3 class="h-md">동선을 직접 검증합니다</h3><p>입구, 화장실, 작품 위치를 함께 걸으며 실측하고 안내 문구를 고칩니다.</p></div>'+
        '<div class="card"><span class="tag blue">작가</span><h3 class="h-md">촉각 작품을 만듭니다</h3><p>손으로 느끼는 부조 작품을 만들고, 작가의 목소리로 작품 설명을 녹음합니다.</p></div>'+
        '<div class="card"><span class="tag blue">도슨트</span><h3 class="h-md">관람객을 안내합니다</h3><p>비장애인 관람객의 손을 이끌어 촉각 감상을 안내합니다.</p></div>'+
      '</div>'+
    '</div></section>'+
    '<section class="section" aria-labelledby="p3"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">활동</span><h2 class="h-lg" id="p3">찾아가기 → 만들기 → 함께 보기</h2></div>'+
      '<div class="grid g3 steps">'+
        step("STEP 1 · 12월","찾아가는 길",["입구·화장실·작품 위치를 함께 실측","'열 걸음 직진 후 오른쪽' 같은 보행 안내","손으로 찾는 QR 촉각 표식 부착"])+
        step("STEP 2 · 12월","손끝 아틀리에",["참여자와 팀원이 함께 안대를 쓰고 창작","'겨울의 촉감' 부조 작품 제작","작가 목소리로 녹음한 음성 캡션"])+
        step("STEP 3 · 1월","손으로 보는 시간",["시각장애인 도슨트가 관람객 4~5명씩 안내","안대를 쓰고 감상한 뒤 다시 보기","웹 도슨트로 스스로 입장"])+
      '</div>'+
    '</div></section>'+
    '<section class="section" aria-labelledby="p4"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">차별점</span><h2 class="h-lg" id="p4">기존 접근성과 무엇이 다른가요</h2></div>'+
      '<div class="table-scroll"><table class="compare"><thead><tr><th scope="col">기존 접근성</th><th scope="col">손끝 도슨트</th></tr></thead><tbody>'+
        '<tr><td>위치를 찾을 수 없는 QR</td><td>손으로 찾는 촉각 표식과 보행 안내</td></tr>'+
        '<tr><td>국립 미술관 앱 중심</td><td>시민 가까이의 시립·구립 미술관</td></tr>'+
        '<tr><td>비장애인이 만들어 제공</td><td>당사자와 함께 설계하고 검증 (co-design)</td></tr>'+
      '</tbody></table></div>'+
    '</div></section>'+
    '<section class="section" aria-labelledby="p5"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">목표</span><h2 class="h-lg" id="p5">미술관에 남기는 것</h2></div>'+
      '<div class="grid g4">'+
        kpi("8명","시각장애인 조사자·작가·도슨트")+kpi("100명","비장애인 관람객")+kpi("10점","촉각 미술 작품")+kpi("50개","QR·동선 촉각 표식")+
      '</div>'+
      '<p class="note" style="margin-top:14px">모두 활동 목표치입니다. 결과는 활동이 끝난 뒤 이곳에 공개합니다.</p>'+
    '</div></section>'+
    '<section class="section" aria-labelledby="p6"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">일정과 협력</span><h2 class="h-lg" id="p6">4단계 일정</h2><p>시각장애인복지관, 시립·구립 미술관, 전문 기관과 협력합니다. 협력 기관은 확정되는 대로 안내합니다.</p></div>'+
      timeline()+
    '</div></section>';
  }
  function step(no,title,items){return '<div class="card step"><span class="no">'+no+'</span><h3 class="h-md">'+title+'</h3><ul>'+items.map(function(i){return '<li>'+i+'</li>'}).join("")+'</ul></div>'}
  function kpi(v,l){return '<div class="card kpi"><span class="v">'+v+'</span><p>'+l+'</p></div>'}

  /* ---------- 화면: 팀 ---------- */
  function viewTeam(){
    function m(name,school,role,does){return '<article class="card member"><span class="tag">'+role+'</span><h2 class="name">'+name+'</h2><p class="school">'+school+'</p><dl><dt>담당</dt><dd>'+does+'</dd></dl></article>'}
    return ''+
    '<div class="wrap hero" style="padding-bottom:16px"><div class="hero-top"><span class="eyebrow">팀 소개</span><h1 class="h-lg" tabindex="-1" data-focus>썬덕걸즈</h1>'+
    '<p class="lede">중학교 때부터 이어진 인연으로 모인 세 사람이 데이터로 확인하고, 글로 설계하고, 콘텐츠로 알립니다.</p></div></div>'+
    '<section class="section" aria-label="팀원"><div class="wrap"><div class="grid g3">'+
      m("마수민","동덕여자대학교 데이터사이언스","팀장 · 데이터·웹","실측 데이터 정리, 웹 오디오 도슨트, 전후 설문 분석")+
      m("양찬영","단국대학교 경영학","홍보 · 대외협력","협력 기관 섭외, 관람객 모집, 카드뉴스·SNS")+
      m("허윤서","이화여자대학교 호크마학부","해설 · 대본","보행 안내·작품 해설 원고, 도슨트 대본")+
    '</div></div></section>';
  }

  /* ---------- 화면: 카드뉴스 ---------- */
  function cnCard(p){
    var first=p.images&&p.images[0];
    return '<article class="cn-card">'+
      '<button type="button" class="cn-thumb" data-open="'+esc(p.id)+'" aria-label="'+esc(p.title)+' 카드뉴스 보기, '+(p.images?p.images.length:0)+'장">'+
        (first?'<img src="'+esc(imgSrc(first))+'" alt="" loading="lazy">':'')+
        '<span class="cn-count" aria-hidden="true">'+(p.images?p.images.length:0)+'장</span></button>'+
      '<div class="cn-meta"><time datetime="'+esc(p.date)+'">'+esc(fmtDate(p.date))+'</time><h3>'+esc(p.title)+'</h3>'+(p.summary?'<p class="note">'+esc(p.summary)+'</p>':'')+'</div>'+
    '</article>';
  }
  function viewCardnews(){
    var list=STATE.cardnews;
    return ''+
    '<div class="wrap hero" style="padding-bottom:8px"><div class="hero-top"><span class="eyebrow">카드뉴스</span><h1 class="h-lg" tabindex="-1" data-focus>활동 소식을 카드뉴스로 전합니다</h1>'+
    '<p class="lede">모든 장에 대체텍스트를 함께 올려, 화면낭독기로도 내용을 들을 수 있습니다.</p></div></div>'+
    '<section class="section" style="padding-top:24px" aria-label="카드뉴스 목록"><div class="wrap">'+
      '<div class="cn-toolbar"><p class="note">'+(list.length?'전체 '+list.length+'개':'')+'</p>'+
        insta("btn btn-soft","인스타그램에서 보기")+'</div>'+
      (list.length?'<div class="cn-grid">'+list.map(cnCard).join("")+'</div>':
        '<div class="empty">'+braille("sm",false)+'<h2 class="h-md">아직 올라온 카드뉴스가 없습니다</h2>'+
        '<p>'+(loadFailed?'카드뉴스 목록을 불러오지 못했습니다. 잠시 뒤 새로고침해 주세요.':loaded?'12월 첫 활동 소식부터 이곳에 올라옵니다.':'카드뉴스를 불러오는 중입니다.')+'</p></div>')+
    '</div></section>';
  }

  /* ---------- 라우팅 ---------- */
  var current=null;
  function route(focus){
    var h=(location.hash||"").replace("#","");
    if(h==="main")return;
    var v=VIEWS.indexOf(h)>=0?h:"home";
    current=v;
    var main=document.getElementById("main");
    main.innerHTML=v==="project"?viewProject():v==="cardnews"?viewCardnews():v==="team"?viewTeam():viewHome();
    document.querySelectorAll("[data-nav]").forEach(function(a){if(a.getAttribute("data-nav")===v)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
    document.getElementById("nav").classList.remove("open");
    document.getElementById("t-menu").setAttribute("aria-expanded","false");
    if(focus){window.scrollTo(0,0);var f=main.querySelector("[data-focus]");if(f)f.focus({preventScroll:true})}
  }

  /* ---------- 토스트 ---------- */
  var toastTimer=null;
  function toast(title,msg){
    var t=document.getElementById("toast");
    document.getElementById("toast-title").textContent=title;
    document.getElementById("toast-msg").textContent=msg||"";
    t.classList.add("show");
    clearTimeout(toastTimer);toastTimer=setTimeout(function(){t.classList.remove("show")},3200);
  }

  /* ---------- 보기 설정 ---------- */
  var SIZES=[{p:"100%",l:"보통"},{p:"118.75%",l:"크게"},{p:"137.5%",l:"아주 크게"}], sizeIdx=0;
  function store(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function load(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function applySize(){document.documentElement.style.fontSize=SIZES[sizeIdx].p;document.getElementById("t-size").setAttribute("aria-label","글자 크기: "+SIZES[sizeIdx].l+". 눌러서 바꾸기")}
  function applyContrast(on){
    if(on)document.documentElement.setAttribute("data-contrast","high");else document.documentElement.removeAttribute("data-contrast");
    document.getElementById("t-contrast").setAttribute("aria-pressed",on?"true":"false");
  }

  /* ---------- 카드뉴스 뷰어 ---------- */
  var vPost=null,vIdx=0;
  function openViewer(id){
    vPost=STATE.cardnews.find(function(p){return p.id===id});if(!vPost||!vPost.images||!vPost.images.length)return;
    vIdx=0;renderViewer();var d=document.getElementById("viewer");if(!d.open)d.showModal();
  }
  function renderViewer(){
    var d=document.getElementById("viewer"),im=vPost.images[vIdx],n=vPost.images.length;
    d.innerHTML='<div class="dlg-head"><h2 id="viewer-title">'+esc(vPost.title)+'</h2><button type="button" class="icon-btn" data-close aria-label="닫기">✕</button></div>'+
      '<div class="viewer-stage"><img src="'+esc(imgSrc(im))+'" alt="'+esc(im.alt||(vPost.title+" "+(vIdx+1)+"번째 장"))+'"></div>'+
      '<div class="viewer-nav"><button type="button" class="btn btn-ghost" data-step="-1"'+(vIdx===0?' disabled':'')+'>이전 장</button>'+
      '<span class="pos" aria-live="polite">'+(vIdx+1)+' / '+n+'</span>'+
      '<button type="button" class="btn btn-ghost" data-step="1"'+(vIdx===n-1?' disabled':'')+'>다음 장</button></div>'+
      (im.alt?'<div class="viewer-alt"><h3>이 장의 내용</h3><p>'+esc(im.alt)+'</p></div>':'');
  }

  /* ---------- 이벤트 ---------- */
  app.innerHTML=shell();
  var sv=parseInt(load("sd-size")||"0",10);sizeIdx=(sv>=0&&sv<SIZES.length)?sv:0;applySize();
  applyContrast(load("sd-contrast")==="1");
  route(false);
  window.addEventListener("hashchange",function(){route(true)});

  document.addEventListener("click",function(e){
    var t=e.target;
    var s=t.closest("[data-soon]");
    if(s){e.preventDefault();toast("준비 중입니다",s.getAttribute("data-soon")+" 메뉴는 곧 열립니다.");return}
    if(t.closest("[data-skip]")){e.preventDefault();document.getElementById("main").focus();return}
    if(t.closest("#t-size")){sizeIdx=(sizeIdx+1)%SIZES.length;applySize();store("sd-size",String(sizeIdx));toast("글자 크기: "+SIZES[sizeIdx].l,"");return}
    if(t.closest("#t-contrast")){var on=!document.documentElement.hasAttribute("data-contrast");applyContrast(on);store("sd-contrast",on?"1":"0");return}
    if(t.closest("#t-menu")){var nav=document.getElementById("nav"),open=nav.classList.toggle("open");t.closest("#t-menu").setAttribute("aria-expanded",open?"true":"false");return}
    var o=t.closest("[data-open]");if(o){openViewer(o.getAttribute("data-open"));return}
    var st=t.closest("[data-step]");if(st&&vPost){vIdx=Math.max(0,Math.min(vPost.images.length-1,vIdx+parseInt(st.getAttribute("data-step"),10)));renderViewer();var nb=document.querySelector('#viewer [data-step="'+st.getAttribute("data-step")+'"]');if(nb&&!nb.disabled)nb.focus();return}
    var c=t.closest("[data-close]");if(c){var dl=c.closest("dialog");if(dl)dl.close();return}
  });
  document.addEventListener("keydown",function(e){
    var v=document.getElementById("viewer");
    if(v.open&&vPost&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){var dir=e.key==="ArrowRight"?1:-1;var ni=vIdx+dir;if(ni>=0&&ni<vPost.images.length){vIdx=ni;renderViewer()}}
  });
  /* ---------- 카드뉴스 불러오기 ---------- */
  fetch("cardnews/posts.json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(d){
    var list=Array.isArray(d)?d:(d&&d.cardnews)||[];
    STATE.cardnews=list.filter(function(p){return p&&p.title&&Array.isArray(p.images)&&p.images.length}).sort(function(x,y){return String(y.date).localeCompare(String(x.date))});
    loaded=true;if(current==="home"||current==="cardnews")route(false);
  }).catch(function(){loadFailed=true;loaded=true;if(current==="home"||current==="cardnews")route(false)});
})();
