(function(){
  "use strict";

  /* ===== 인스타그램 주소: 아래 따옴표 안에 계정 주소를 넣으면 메뉴·푸터·카드뉴스 버튼이 모두 연결됩니다 =====
     예) var INSTAGRAM_URL = "https://www.instagram.com/sonkkeut_docent/";
     비워 두면 "준비 중입니다"가 뜹니다. */
  var INSTAGRAM_URL = "https://www.instagram.com/sonkkeut_docent/";

  var STATE={cardnews:[]};
  var app=document.getElementById("app");
  var VIEWS=["home","project","guide","cardnews","team"];
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
    var k=0,li=0;
    return '<div class="braille '+size+'" role="img" aria-label="점자로 쓴 손끝 도슨트">'+WORD.map(function(w){
      if(!w)return '<span class="gap"></span>';
      return '<span class="syl"><span class="cells">'+Array.from(w.c).map(function(ch){return cellHTML(ch,k++)}).join("")+'</span>'+(labels?'<span class="syl-label" aria-hidden="true" style="--li:'+(li++)+'">'+w.s+'</span>':'')+'</span>';
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
        '<li><a href="#guide" data-nav="guide">전시 정보</a></li>'+
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
      '<div class="braille-wrap">'+braille("lg",true)+
        '<p class="a11y-note"><span class="a11y-dot" aria-hidden="true"></span>이 사이트는 화면낭독기와 키보드만으로도 쓸 수 있도록 만들고 있습니다.</p>'+
      '</div>'+
      '<div class="btn-row">'+
        '<button type="button" class="btn btn-primary"'+soon("웹 도슨트")+'>웹 도슨트 시작하기</button>'+
        '<a class="btn btn-ghost" href="#project">프로젝트 알아보기</a>'+
      '</div>'+
    '</div>'+
    '<section class="stat-band" aria-labelledby="stat-h"><div class="wrap">'+
      '<p class="stat-num" aria-hidden="true">1% 미만</p>'+
      '<div class="stat-text"><strong id="stat-h">시각장애인의 미술전시회 참여율은 1%도 되지 않습니다.</strong>'+
      '<p>관심이 없어서가 아니라, 스스로 이동하고 감상할 환경이 부족하기 때문입니다. 저희는 시각장애인에게 예술에 대한 선택권을 돌려드리고자 합니다.</p>'+
      '<small>출처: 서울연구원 SR 20-06 (웰페어뉴스 2017 재인용) · <a href="#project" style="color:inherit">근거 자료 보기</a></small></div>'+
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
    '<div id="home-guide">'+homeGuide()+'</div>'+
    '<div id="home-cn">'+homeCn()+'</div>'+
    '<section class="section" aria-labelledby="tl-h"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">일정</span><h2 class="h-lg" id="tl-h">이렇게 진행합니다</h2></div>'+
      timeline()+
    '</div></section>';
  }
  function homeCn(){
    var latest=STATE.cardnews.slice(0,3);
    return '<section class="section" aria-labelledby="cn-h"><div class="wrap">'+
      '<div class="cn-toolbar"><div class="sec-head" style="margin:0"><span class="eyebrow">카드뉴스</span><h2 class="h-lg" id="cn-h">최근 소식</h2></div><a class="btn btn-ghost" href="#cardnews">전체 보기</a></div>'+
      (latest.length?'<div class="cn-grid">'+latest.map(cnCard).join("")+'</div>':
        '<div class="empty"><p>첫 카드뉴스를 준비하고 있습니다. 12월 첫 활동 소식부터 이곳에 올라옵니다.</p></div>')+
    '</div></section>';
  }
  function refreshHome(){
    var g=document.getElementById("home-guide"),n=document.getElementById("home-cn");
    if(g)g.innerHTML=homeGuide(); if(n)n.innerHTML=homeCn();
  }
  function feature(n,title,desc){
    return '<button type="button" class="feature"'+soon(title)+'><span class="num" aria-hidden="true">'+n+'</span><span><b>'+title+'</b><span class="desc">'+desc+'</span></span><span class="soon-badge">준비 중</span></button>';
  }
  function timeline(){
    var rows=[["11월","준비","협력 미술관 선정, 참여자 모집",false],["12월","1회차 봉사","동선 실측 답사, 손끝 아틀리에",true],["1월","2회차 봉사","오디오 도슨트 시범 운영, 전시·투어",true],["2~4월","확산","온라인 갤러리 공개, 4월 성과공유회",false]];
    return '<ol class="timeline">'+rows.map(function(r){return '<li'+(r[3]?' class="hot"':'')+'><span class="m">'+r[0]+'</span><span class="t">'+r[1]+'</span><span class="d">'+r[2]+'</span></li>'}).join("")+'</ol>';
  }

  /* ---------- 출처 ---------- */
  var SOURCES=[
    ["서울연구원 SR 20-06, 문화예술 활동 사각지대에 있는 시각장애인을 위한 전시 환경에 대한 연구","https://www.si.re.kr/sites/default/files/SR%2020-06.pdf"],
    ["에이블뉴스(2025.6.11), 2024 서울시민 문화향유 실태조사","https://www.ablenews.co.kr/news/articleView.html?idxno=222159"],
    ["문화+서울(2025.7), 2024 서울시민 문화향유 실태조사","https://magazine.sfac.or.kr/html/view.asp?PubDate=202507&CateMasterCd=300&CateSubCd=3820"],
    ["이양희 외(2019), 시각장애인의 전시예술품 관람 욕구조사","https://koreascience.kr/article/JAKO201913154691497.page?lang=ko"],
    ["권정숙(2023), 시각장애성인의 생애주기별 사회활동 및 문화·여가활동 실태","https://scholar.kyobobook.co.kr/article/detail/4050047476281"],
    ["참여연대 월간복지동향(2023.6.1), 장애인의 문화접근성 실태와 개선 방향","https://peoplepower21.org/welfarenow/1940360"],
    ["뉴스1(2025.10.22), 국립박물관 장애인 지원 현황","https://v.daum.net/v/20251022084714988"],
    ["헤럴드경제(2025.11.2), 2025 장애통계연보","https://www.heraldk.com/article/2025110216080135607"],
    ["파이낸셜뉴스(2025.10.13), 실명 유발 3대 안질환 환자 증가","https://www.fnnews.com/news/202510130940380698"],
    ["이투데이(2025.1.13), 2024 장애인 생활체육조사","https://www.etoday.co.kr/news/view/2437116"],
    ["뉴시스(2025.8.8), 2024 장애인차별금지법 이행 실태조사","https://www.newsis.com/view/NISX20250807_0003282770"],
    ["아주경제(2026.9.30), 국립현대미술관 시각장애인 일일 도슨트","https://www.ajunews.com/view/20260930085816345"],
    ["ZDNet Korea(2025.3.4), 글룩-국립현대미술관 3D 촉각 전시","https://zdnet.co.kr/view/?no=20250304120148"],
    ["문화앤피플(2024.9.30), 국립현대미술관 배리어프리 서비스","https://www.cnpnews.co.kr/news/articleView.html?idxno=3219"],
    ["서울시 미디어허브(2026.4.22), 어두운 미술관","https://mediahub.seoul.go.kr/archives/2017909"],
    ["MIT Technology Review(2019.6.6), NaviLens","https://www.technologyreview.com/2019/06/06/135057/these-colorful-stickers-are-helping-blind-people-find-their-way-around/"],
    ["국가법령정보센터, 장애인차별금지 및 권리구제 등에 관한 법률","https://www.law.go.kr/법령/장애인차별금지및권리구제등에관한법률"],
    ["UN, 장애인권리협약(CRPD)","https://www.un.org/development/desa/disabilities/convention-on-the-rights-of-persons-with-disabilities.html"],
    ["정책브리핑(2025.4.3), 제3차 박물관·미술관 진흥 기본계획","https://www.korea.kr/news/reporterView.do?newsId=148940861"]
  ];
  function src(){return '<sup class="cite">['+Array.prototype.slice.call(arguments).join(", ")+']</sup>'}
  function bars(title,rows,note){
    return '<figure class="card pair"><figcaption class="h-md">'+title+'</figcaption>'+
      rows.map(function(r){return '<div class="bar-row"><span class="bar-label">'+r[0]+'</span><span class="meter'+(r[2]?'':' muted')+'" role="img" aria-label="'+r[0]+' '+r[1]+'%"><i style="width:'+Math.max(r[1],0.6)+'%"></i></span><b class="bar-val">'+r[1]+'%</b></div>'}).join("")+
      '<p class="note">'+note+'</p></figure>';
  }
  function why(no,title,body){return '<div class="card"><span class="no-badge" aria-hidden="true">'+no+'</span><h3 class="h-md">'+title+'</h3><p>'+body+'</p></div>'}

  /* ---------- 화면: 프로젝트 ---------- */
  function viewProject(){
    return ''+
    '<div class="wrap hero" style="padding-bottom:16px"><div class="hero-top"><span class="eyebrow">프로젝트 소개</span><h1 class="h-lg" tabindex="-1" data-focus>수혜자가 아니라, 주체로</h1>'+
    '<p class="lede">시각장애인 참여자가 조사자, 작가, 도슨트가 되어 미술관을 함께 바꿉니다. 아래는 저희가 이 프로젝트를 하는 이유와 근거입니다.</p></div></div>'+

    '<section class="section" aria-labelledby="p0"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">숫자로 보는 격차</span><h2 class="h-lg" id="p0">보고 싶지만, 갈 수 없습니다</h2><p>막대는 모두 0~100% 같은 눈금입니다.</p></div>'+
      '<div class="grid g3">'+
        bars("1년간 문화예술 관람 경험이 전혀 없음",[["장애인",64.5,1],["일반 시민",23.9,0]],"2024 서울시민 문화향유 실태조사"+src(2,3))+
        bars("한 달에 1회 이상 관람",[["장애인",0.7,1],["일반 시민",13.3,0]],"2024 서울시민 문화향유 실태조사"+src(2,3))+
        bars("시각장애인의 문화예술 활동",[["미술전시회",1,1],["영화 관람",23.1,0]],"미술전시회는 ‘1% 미만’으로 보고됨"+src(1))+
      '</div>'+
      '<div class="callout"><p><strong>그런데 71.1%</strong>의 시각장애인이 하고 싶은 문화활동 상위 5개에 ‘전시 감상’을 꼽았습니다'+src(4)+'. 관심이 아니라 환경이 문제입니다.</p></div>'+
    '</div></section>'+

    '<section class="section" aria-labelledby="p1"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">문제</span><h2 class="h-lg" id="p1">있지만, 쓸 수 없는 접근성</h2><p>당사자 인터뷰에서 확인한 장벽입니다.</p></div>'+
      '<div class="grid g3">'+
        '<div class="card"><span class="tag">음성해설 QR</span><h3 class="h-md">있어도 찾을 수 없습니다</h3><p>작품 앞에 QR이 설치되어 있어도, 그 위치를 손으로 찾을 방법이 없습니다.</p></div>'+
        '<div class="card"><span class="tag">화면해설 영화</span><h3 class="h-md">있어도 혼자 갈 수 없습니다</h3><p>무인 발권기와 복잡한 동선 때문에 동행 없이는 어렵습니다. 시각장애인의 72.3%는 키오스크보다 직원 응대를 선호합니다'+src(11)+'.</p></div>'+
        '<div class="card"><span class="tag">오디오 해설</span><h3 class="h-md">정안인 기준으로 만들어졌습니다</h3><p>“이것, 저것” 같은 지시어와 시각 정보 중심이라, 보이지 않으면 따라가기 어렵습니다'+src(1)+'.</p></div>'+
      '</div>'+
    '</div></section>'+

    '<section class="section" aria-labelledby="pw"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">왜 시각장애인, 왜 미술관인가</span><h2 class="h-lg" id="pw">격차가 가장 큰 곳에서 시작합니다</h2></div>'+
      '<div class="grid g3x">'+
        why(1,"미술이 가장 먼 장르입니다","시각장애인의 문화예술 활동 중 영화는 23.1%, 미술전시회는 1% 미만입니다. 안 가는 이유 1위는 ‘시각 위주의 관람 문화’입니다"+src(1,4)+".")+
        why(2,"장벽은 ‘들어가기’가 아니라 ‘안에서 쓰기’입니다","무장애 공간에서 가장 중요한 요소로 지체장애인은 ‘접근’(52%)을, 시각장애인은 ‘이용’(40.5%)을 꼽았습니다"+src(2)+". 촉각 표식과 오디오 해설로 풀 수 있는 문제입니다.")+
        why(3,"혼자 가기 어렵습니다","시각장애 성인의 실외활동 불편은 중년 38.9%, 노년 53.7%이고, 노년층은 10명 중 2명만 혼자 외출합니다"+src(5)+".")+
        why(4,"지원은 국립에 몰려 있습니다","국립중앙박물관 전시품 5,512점 중 촉각 모형은 70점(1%)입니다"+src(7)+". 시민 가까이의 시립·구립 미술관과 ‘찾아가는 길’은 비어 있습니다.")+
        why(5,"체육과 달리 길이 열리지 않았습니다","장애인 생활체육 참여율은 35.2%(2024)로 역대 최고입니다"+src(10)+". 미술전시회 1% 미만과 차이가 큽니다. 체육에서 이어 온 자립을 문화로 넓힙니다.")+
        why(6,"대상은 계속 늘어납니다","시각장애는 등록장애인의 9.4%이고, 장애인의 55.3%가 65세 이상입니다"+src(8)+". 실명 유발 3대 안질환 환자는 4년 새 151만 명에서 217만 명으로 늘었습니다"+src(9)+".")+
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
      '<div class="sec-head"><span class="eyebrow">앞선 시도에서 배웁니다</span><h2 class="h-lg" id="p4">비슷한 시도와 손끝 도슨트</h2><p>시각장애인을 위한 좋은 시도들이 늘고 있습니다. 손끝 도슨트는 그 흐름 위에서 아직 비어 있는 부분을 채웁니다.</p></div>'+
      '<div class="table-scroll"><table class="compare cases"><thead><tr><th scope="col">사례</th><th scope="col">어디서</th><th scope="col">시각장애인의 역할</th><th scope="col">미술관까지 오는 길</th></tr></thead><tbody>'+
        '<tr><td>시각장애인 일일 도슨트 ‘시선 너머의 예술’'+src(12)+'</td><td>국립현대미술관 덕수궁, 2026</td><td>감상단 → 도슨트</td><td>다루지 않음</td></tr>'+
        '<tr><td>3D 촉각 전시'+src(13)+'</td><td>국립현대미술관 청주, 2024~2025</td><td>관람객</td><td>다루지 않음</td></tr>'+
        '<tr><td>배리어프리 키오스크·앱'+src(14)+'</td><td>국립현대미술관 서울·과천, 2024~</td><td>이용자</td><td>관 안 길찾기만</td></tr>'+
        '<tr><td>어두운 미술관'+src(15)+'</td><td>용산문화재단, 2026 (11일)</td><td>사전 관람 참여</td><td>교통 안내만</td></tr>'+
        '<tr><td>NaviLens 인식 코드'+src(16)+'</td><td>바르셀로나·뉴욕 대중교통</td><td>이용자</td><td>12m 거리에서 인식되는 코드</td></tr>'+
        '<tr class="ours"><td><strong>손끝 도슨트</strong></td><td><strong>시립·구립 미술관</strong></td><td><strong>조사자 · 작가 · 도슨트</strong></td><td><strong>당사자가 실측한 보행 안내 + 촉각 표식</strong></td></tr>'+
      '</tbody></table></div>'+
      '<div class="grid g4" style="margin-top:20px">'+
        '<div class="card"><span class="tag blue">찾아가는 길</span><p>관 안이 아니라, 미술관에 도착하는 길부터 시작합니다.</p></div>'+
        '<div class="card"><span class="tag blue">시립·구립</span><p>시민 가까이의 미술관에서 할 수 있는 모델을 만듭니다.</p></div>'+
        '<div class="card"><span class="tag blue">세 가지 역할</span><p>조사하고, 만들고, 안내하는 과정을 한 흐름으로 잇습니다.</p></div>'+
        '<div class="card"><span class="tag blue">남는 결과물</span><p>촉각 표식과 웹 도슨트가 활동 뒤에도 미술관에 남습니다.</p></div>'+
      '</div>'+
    '</div></section>'+

    '<section class="section" aria-labelledby="pr"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">권리와 제도</span><h2 class="h-lg" id="pr">문화를 누리는 것은 권리입니다</h2></div>'+
      '<div class="grid g4">'+
        '<div class="card"><span class="tag">UN 장애인권리협약 제30조</span><p>장애인의 문화생활·여가 참여를 보장합니다. 한국은 2008년에 비준했습니다'+src(18)+'.</p></div>'+
        '<div class="card"><span class="tag">장애인차별금지법 제24조</span><p>문화·예술활동에서의 차별을 금지하고 정당한 편의 제공을 요구합니다'+src(17)+'.</p></div>'+
        '<div class="card"><span class="tag">키오스크 접근성</span><p>2026년 1월 28일부터 키오스크 이용에도 정당한 편의 제공이 전면 적용됩니다'+src(11)+'.</p></div>'+
        '<div class="card"><span class="tag">박물관·미술관 진흥 기본계획</span><p>제3차 계획(2024~2028)의 핵심 방향은 ‘문화로 포용하는 박물관과 미술관’입니다'+src(19)+'.</p></div>'+
      '</div>'+
      '<p class="note" style="margin-top:14px">다만 법은 점자안내판 같은 장치를 ‘설치’하도록 정할 뿐, 실제로 쓸 수 있는지는 묻지 않습니다'+src(1)+'. 손끝 도슨트는 그 차이를 당사자와 함께 확인합니다.</p>'+
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
    '</div></section>'+

    '<section class="section" aria-labelledby="p7"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">앞으로</span><h2 class="h-lg" id="p7">관람 전 과정으로 넓힙니다</h2><p>공연·전시 예매와 키오스크 발권에도 접근성 사각지대가 남아 있습니다. 웹 도슨트를 관람 전 과정의 안내로 키워, 다른 시립·구립 미술관에서도 쓸 수 있는 모델로 만들겠습니다.</p></div>'+
      '<ol class="flow">'+
        '<li><b>예매</b><span>화면낭독기로 할 수 있는 예매 안내</span></li>'+
        '<li><b>이동</b><span>당사자가 실측한 길 안내</span></li>'+
        '<li><b>발권</b><span>키오스크·매표소 이용 안내</span></li>'+
        '<li class="now"><b>관람</b><span>촉각 표식 + 웹 도슨트 (지금 시작)</span></li>'+
      '</ol>'+
    '</div></section>'+

    '<section class="section" aria-labelledby="ps"><div class="wrap">'+
      '<div class="sec-head"><span class="eyebrow">출처</span><h2 class="h-lg" id="ps">근거 자료</h2><p>본문의 [번호]는 아래 자료를 가리킵니다. 링크는 새 창에서 열립니다.</p></div>'+
      '<ol class="sources">'+SOURCES.map(function(s){return '<li><a href="'+esc(s[1])+'" target="_blank" rel="noopener">'+esc(s[0])+'</a></li>'}).join("")+'</ol>'+
      '<p class="note">‘1% 미만’은 서울연구원 보고서가 웰페어뉴스(2017) 기사를 재인용한 수치입니다. 서울시민 문화향유 실태조사는 서울 지역 지체·시각·청각장애인 755명을 조사한 결과입니다.</p>'+
    '</div></section>';
  }
  function step(no,title,items){return '<div class="card step"><span class="no">'+no+'</span><h3 class="h-md">'+title+'</h3><ul>'+items.map(function(i){return '<li>'+i+'</li>'}).join("")+'</ul></div>'}
  function kpi(v,l){return '<div class="card kpi"><span class="v">'+v+'</span><p>'+l+'</p></div>'}

  /* ---------- 화면: 전시 정보 (중계) ---------- */
  var GUIDE={places:[],links:[],updated:"",loaded:false,failed:false};
  var gFilter={sup:[],kind:"all"};
  var SUP_ORDER=["점자","촉각","음성해설","음성안내","길찾기","해설 동행","저시력","감각 키트","체험"];
  function todayStr(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
  function placeStatus(p){
    if(p.kind==="기간"){var t=todayStr();if(p.start&&t<p.start)return {k:"soon",l:"예정 · "+fmtDate(p.start)+" 시작"};if(p.end&&t>p.end)return {k:"ended",l:"종료"};return {k:"on",l:"진행 중 · "+fmtDate(p.end)+"까지"}}
    if(p.kind==="체험")return {k:"always",l:"상시 체험"};
    return {k:"always",l:"상시"};
  }
  function placeCard(p){
    var st=placeStatus(p);
    return '<article class="place">'+
      '<div class="place-top"><span class="status '+st.k+'">'+esc(st.l)+'</span>'+(p.onsite?'<span class="status checked">손끝 도슨트 현장 확인</span>':'')+'</div>'+
      '<h3 class="h-md">'+esc(p.title)+'</h3>'+
      '<p class="place-venue">'+esc(p.venue)+' · '+esc(p.area)+'</p>'+
      '<ul class="sup-list" aria-label="제공되는 지원">'+(p.supports||[]).map(function(s){return '<li>'+esc(s)+'</li>'}).join("")+'</ul>'+
      '<p class="place-desc">'+esc(p.desc)+'</p>'+
      '<dl class="place-meta"><dt>관람료</dt><dd>'+esc(p.fee||"확인 필요")+'</dd><dt>이용 방법</dt><dd>'+esc(p.booking||"확인 필요")+'</dd></dl>'+
      (p.caution?'<p class="place-caution">'+esc(p.caution)+'</p>':'')+
      '<div class="place-links">'+
        (p.url?'<a class="btn btn-primary btn-sm" href="'+esc(p.url)+'" target="_blank" rel="noopener" aria-label="'+esc(p.title)+' 공식 페이지 (새 창에서 열림)">공식 페이지</a>':'')+
        (p.source&&p.source!==p.url?'<a class="btn btn-ghost btn-sm" href="'+esc(p.source)+'" target="_blank" rel="noopener" aria-label="'+esc(p.title)+' 관련 자료: '+esc(p.sourceName||"")+' (새 창에서 열림)">관련 자료</a>':'')+
      '</div>'+
      '<p class="place-src">출처: '+esc(p.sourceName||"")+' · '+esc(fmtDate(p.checked))+' 확인</p>'+
    '</article>';
  }
  function filteredPlaces(){
    var order={on:0,always:1,soon:2,ended:3};
    return GUIDE.places.filter(function(p){
      var st=placeStatus(p).k; if(st==="ended")return false;
      if(gFilter.kind!=="all"&&p.kind!==gFilter.kind)return false;
      return gFilter.sup.every(function(s){return (p.supports||[]).indexOf(s)>=0});
    }).sort(function(a,b){return order[placeStatus(a).k]-order[placeStatus(b).k]});
  }
  function renderGuideList(){
    var box=document.getElementById("guide-list"),cnt=document.getElementById("guide-count");if(!box)return;
    if(!GUIDE.loaded){box.innerHTML='<p class="note">정보를 불러오는 중입니다.</p>';return}
    if(GUIDE.failed){box.innerHTML='<div class="empty"><p>정보를 불러오지 못했습니다. 잠시 뒤 새로고침해 주세요.</p></div>';cnt.textContent="";return}
    var list=filteredPlaces();
    cnt.textContent="조건에 맞는 곳 "+list.length+"곳";
    box.innerHTML=list.length?list.map(placeCard).join(""):'<div class="empty"><p>조건에 맞는 곳이 아직 없습니다. 선택한 지원을 줄여 보세요.</p></div>';
  }
  function viewGuide(){
    var sups=SUP_ORDER.filter(function(s){return GUIDE.places.some(function(p){return (p.supports||[]).indexOf(s)>=0})});
    var kinds=[["all","전체"],["상시","상시 서비스"],["기간","기간 전시"],["체험","체험"]];
    return ''+
    '<div class="wrap hero" style="padding-bottom:8px"><div class="hero-top"><span class="eyebrow">전시 정보</span><h1 class="h-lg" tabindex="-1" data-focus>보고 싶은 전시를 직접 고르세요</h1>'+
    '<p class="lede">점자, 촉각, 음성해설처럼 시각장애인이 이용할 수 있는 지원이 있는 전시와 문화시설을 손끝 도슨트가 조사해 모았습니다. 공식 페이지로 바로 연결됩니다.</p></div></div>'+
    '<section class="section" style="padding-top:24px" aria-label="전시 정보 목록"><div class="wrap">'+
      '<div class="filters">'+
        '<div class="filter-group" role="group" aria-label="필요한 지원 (여러 개 선택)"><span class="filter-label">필요한 지원</span>'+
          sups.map(function(s){return '<button type="button" class="chip" data-gsup="'+esc(s)+'" aria-pressed="'+(gFilter.sup.indexOf(s)>=0)+'">'+esc(s)+'</button>'}).join("")+
        '</div>'+
        '<div class="filter-group" role="group" aria-label="종류"><span class="filter-label">종류</span>'+
          kinds.map(function(k){return '<button type="button" class="chip" data-gkind="'+k[0]+'" aria-pressed="'+(gFilter.kind===k[0])+'">'+k[1]+'</button>'}).join("")+
        '</div>'+
      '</div>'+
      '<p class="note" id="guide-count" role="status" aria-live="polite"></p>'+
      '<div class="place-grid" id="guide-list"></div>'+
      '<div class="callout" style="margin-top:28px"><p><strong>방문 전에 꼭 확인해 주세요.</strong> 운영 시간과 제공 여부는 바뀔 수 있습니다. 각 정보에 출처와 확인한 날짜를 적어 두었고, 공식 페이지에서 최신 내용을 확인할 수 있습니다. 손끝 도슨트 팀이 직접 다녀온 곳에는 ‘현장 확인’ 표시를 붙입니다.</p></div>'+
      (GUIDE.links.length?'<div class="sec-head" style="margin:40px 0 16px"><h2 class="h-md">함께 보면 좋은 정보</h2></div><ul class="link-list">'+GUIDE.links.map(function(l){return '<li><a href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(l.title)+'</a><span>'+esc(l.by)+' · '+esc(l.desc)+'</span></li>'}).join("")+'</ul>':'')+
      (GUIDE.updated?'<p class="note" style="margin-top:16px">마지막 업데이트: '+esc(fmtDate(GUIDE.updated))+'</p>':'')+
    '</div></section>';
  }
  function homeGuide(){
    var list=GUIDE.loaded&&!GUIDE.failed?filteredPlacesAll().slice(0,3):[];
    return '<section class="section" aria-labelledby="gh-h"><div class="wrap">'+
      '<div class="cn-toolbar"><div class="sec-head" style="margin:0"><span class="eyebrow">전시 정보</span><h2 class="h-lg" id="gh-h">지금 갈 수 있는 곳</h2><p>시각장애인이 이용할 수 있는 지원이 있는 전시와 시설을 모았습니다.</p></div><a class="btn btn-ghost" href="#guide">전체 보기</a></div>'+
      (list.length?'<div class="place-grid">'+list.map(placeCard).join("")+'</div>':'<p class="note">'+(GUIDE.failed?'정보를 불러오지 못했습니다.':'정보를 불러오는 중입니다.')+'</p>')+
    '</div></section>';
  }
  function filteredPlacesAll(){var o={on:0,always:1,soon:2,ended:3};return GUIDE.places.filter(function(p){return placeStatus(p).k!=="ended"}).sort(function(a,b){return o[placeStatus(a).k]-o[placeStatus(b).k]})}

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
    main.innerHTML=v==="project"?viewProject():v==="guide"?viewGuide():v==="cardnews"?viewCardnews():v==="team"?viewTeam():viewHome();
    if(v==="guide")renderGuideList();
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
    var gs=t.closest("[data-gsup]");if(gs){var sv2=gs.getAttribute("data-gsup"),i2=gFilter.sup.indexOf(sv2);if(i2>=0)gFilter.sup.splice(i2,1);else gFilter.sup.push(sv2);gs.setAttribute("aria-pressed",i2<0?"true":"false");renderGuideList();return}
    var gk=t.closest("[data-gkind]");if(gk){gFilter.kind=gk.getAttribute("data-gkind");document.querySelectorAll("[data-gkind]").forEach(function(b){b.setAttribute("aria-pressed",b===gk?"true":"false")});renderGuideList();return}
    var o=t.closest("[data-open]");if(o){openViewer(o.getAttribute("data-open"));return}
    var st=t.closest("[data-step]");if(st&&vPost){vIdx=Math.max(0,Math.min(vPost.images.length-1,vIdx+parseInt(st.getAttribute("data-step"),10)));renderViewer();var nb=document.querySelector('#viewer [data-step="'+st.getAttribute("data-step")+'"]');if(nb&&!nb.disabled)nb.focus();return}
    var c=t.closest("[data-close]");if(c){var dl=c.closest("dialog");if(dl)dl.close();return}
  });
  document.addEventListener("keydown",function(e){
    var v=document.getElementById("viewer");
    if(v.open&&vPost&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){var dir=e.key==="ArrowRight"?1:-1;var ni=vIdx+dir;if(ni>=0&&ni<vPost.images.length){vIdx=ni;renderViewer()}}
  });
  /* ---------- 전시 정보 불러오기 ---------- */
  fetch("guide/places.json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(d){
    GUIDE.places=Array.isArray(d.places)?d.places.filter(function(p){return p&&p.title}):[];GUIDE.links=Array.isArray(d.links)?d.links:[];GUIDE.updated=d.updated||"";GUIDE.loaded=true;
    if(current==="guide")route(false);else if(current==="home")refreshHome();
  }).catch(function(){GUIDE.loaded=true;GUIDE.failed=true;if(current==="guide")route(false);else if(current==="home")refreshHome()});
  /* ---------- 카드뉴스 불러오기 ---------- */
  fetch("cardnews/posts.json",{cache:"no-cache"}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()}).then(function(d){
    var list=Array.isArray(d)?d:(d&&d.cardnews)||[];
    STATE.cardnews=list.filter(function(p){return p&&p.title&&Array.isArray(p.images)&&p.images.length}).sort(function(x,y){return String(y.date).localeCompare(String(x.date))});
    loaded=true;if(current==="cardnews")route(false);else if(current==="home")refreshHome();
  }).catch(function(){loadFailed=true;loaded=true;if(current==="cardnews")route(false);else if(current==="home")refreshHome()});
})();
