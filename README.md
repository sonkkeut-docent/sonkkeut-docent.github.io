# 손끝 도슨트

스스로 찾아가고, 손으로 감상하고, 직접 안내하는 배리어프리 미술관 프로젝트입니다.
롯데 밸유 for ESG 5기 **썬덕걸즈**(마수민 · 양찬영 · 허윤서)가 운영합니다.

- 사이트: https://sonkkeut-docent.github.io
- 인스타그램: https://www.instagram.com/sonkkeut_docent/

## 메뉴

| 메뉴 | 내용 | 데이터 파일 |
|---|---|---|
| 홈 | 프로젝트 소개, 일정, 최신 소식 | — |
| 프로젝트 | 왜 시각장애인·미술관인지, 근거 자료 | `app.js` 안 `SOURCES` |
| 전시 정보 | 팀이 조사한 배리어프리 전시·시설 | `guide/places.json` |
| 웹 도슨트 | AI 초안을 팀이 검수한 작품 음성해설 | `docent/artworks.json` |
| 카드뉴스 | 인스타그램 카드뉴스와 대체텍스트 | `cardnews/posts.json` |
| 활동 기록 | 행사·봉사활동 기록과 사진 | `activity/records.json` |
| 팀 소개 | 썬덕걸즈 소개 | — |
| 인스타그램 | 외부 링크 (새 창) | `app.js` 안 `INSTAGRAM_URL` |

맨 아래(푸터)에는 제작자 표시와 ‘함께하는 기관’ 로고가 있습니다.

## 폴더 구성

| 파일 | 내용 |
|---|---|
| `index.html` | 사이트 첫 화면 (건드릴 일 거의 없음) |
| `styles.css` | 디자인 |
| `app.js` | 메뉴, 화면, 카드뉴스 뷰어, 웹 도슨트 음성 읽기 |
| `favicon.svg` | 브라우저 탭 아이콘 (로고 확정 후 교체) |
| `guide/places.json` | **전시 정보 목록** — 팀이 조사한 배리어프리 전시·시설 |
| `docent/artworks.json` | **웹 도슨트 작품 목록** — 검수를 마친 작품 해설 |
| `docent/images/` | 웹 도슨트 작품 이미지 (퍼블릭 도메인·공공누리 등 이용 허락된 것만) |
| `activity/records.json` | **활동 기록** — 행사·봉사활동 기록과 사진 |
| `cardnews/posts.json` | **카드뉴스 목록** — 새 카드뉴스는 여기에 추가 |
| `cardnews/posts.example.json` | 카드뉴스 작성 예시 |
| `partner-lotte.png` · `partner-kfhi.png` · `partner-chest.png` | 맨 아래 ‘함께하는 기관’ 로고 (배경 없는 PNG) |
| `robots.txt` · `sitemap.xml` | 검색엔진 안내용 파일 |
| `.gitignore` | GitHub에 올리지 않을 파일 목록 (Mac의 `.DS_Store`) |
| `.nojekyll` | GitHub Pages 설정용 빈 파일 (지우지 마세요) |

## 카드뉴스 올리는 법 (웹 브라우저만으로 가능)

1. **이미지 올리기**
   - 저장소에서 `cardnews` 폴더로 들어가 **Add file → Upload files**를 누릅니다.
   - 카드뉴스마다 폴더를 하나 만듭니다. 예: `2026-12-route`
     (업로드 화면 위쪽 경로 칸에 `2026-12-route/`를 적거나, 그 이름의 폴더째 끌어다 놓으면 됩니다.)
   - 파일 이름은 `01.jpg`, `02.jpg`처럼 순서대로 짓습니다.
   - **Commit changes**를 누릅니다.

2. **목록에 추가하기**
   - `cardnews/posts.json`을 열고 오른쪽 위 연필(✏️) 버튼을 누릅니다.
   - `posts.example.json`의 형식대로 한 묶음을 맨 위에 추가합니다.

```json
{
  "cardnews": [
    {
      "id": "2026-12-route",
      "title": "12월 찾아가는 길 답사 후기",
      "date": "2026-12-06",
      "summary": "목록에 보이는 한 줄 소개",
      "images": [
        { "src": "2026-12-route/01.jpg", "alt": "1장에 적힌 글과 그림을 문장으로" },
        { "src": "2026-12-route/02.jpg", "alt": "2장에 적힌 글과 그림을 문장으로" }
      ]
    }
  ]
}
```

   - 카드뉴스가 두 개 이상이면 묶음 사이에 쉼표(`,`)를 넣습니다.
   - **Commit changes**를 누르면 1~2분 뒤 사이트에 나타납니다.

### 꼭 지켜 주세요

- **`alt`(대체텍스트)는 반드시 적습니다.** 화면낭독기를 쓰는 시각장애인은 이 문장으로 카드뉴스를 읽습니다. 이미지 속 글자는 빠짐없이, 사진은 무엇이 보이는지 한두 문장으로 적습니다.
- `src`는 `cardnews/` 다음 경로입니다. 폴더 이름과 파일 이름의 대소문자까지 똑같아야 합니다 (`01.JPG` ≠ `01.jpg`).
- 날짜는 `2026-12-06` 형식으로 적습니다. 최신 날짜가 자동으로 맨 앞에 옵니다.
- 쉼표나 따옴표가 하나라도 빠지면 목록 전체가 안 보입니다. 저장 전에 [jsonlint.com](https://jsonlint.com) 같은 곳에 붙여 넣어 확인하면 안전합니다.
- 참여자 얼굴이 나온 사진은 촬영·공개에 동의한 분만 올립니다.

## 전시 정보 추가하는 법

`guide/places.json`을 열고 연필(✏️) 버튼을 눌러 `places` 안에 한 묶음을 추가합니다.

```json
{
  "id": "영문-짧은-이름",
  "title": "전시·서비스 이름",
  "venue": "장소 이름",
  "area": "서울 ○○구",
  "kind": "기간",
  "start": "2026-12-01",
  "end": "2027-01-31",
  "supports": ["점자", "촉각", "음성해설"],
  "desc": "어떤 지원이 있는지 두세 문장으로",
  "fee": "무료",
  "booking": "예약 방법",
  "url": "공식 페이지 주소",
  "source": "조사한 자료 주소",
  "sourceName": "자료 이름(날짜)",
  "checked": "2026-11-13",
  "onsite": false,
  "caution": "주의할 점 (없으면 이 줄 삭제)"
}
```

- `kind`는 `상시`, `기간`, `체험` 중 하나입니다. `기간`이면 `start`, `end`를 꼭 적습니다. 끝난 전시는 자동으로 목록에서 빠집니다.
- `supports`는 `점자`, `촉각`, `음성해설`, `음성안내`, `길찾기`, `해설 동행`, `저시력`, `감각 키트`, `체험` 중에서 고릅니다. 이 값이 그대로 필터 버튼이 됩니다.
- 팀이 직접 다녀와서 확인한 곳은 `"onsite": true`로 바꾸면 '손끝 도슨트 현장 확인' 표시가 붙습니다.
- `checked`(확인한 날짜)와 `updated`(맨 위 마지막 업데이트 날짜)를 함께 고쳐 주세요.

## 활동 기록 추가하는 법

1. **사진 올리기:** `activity/새폴더이름/.keep` 파일을 만들어 폴더를 만든 뒤, 그 폴더 안에서 사진(`01.jpg`, `02.jpg` …)을 올립니다. 아이폰 사진(HEIC)은 JPG로 바꿔서 올려 주세요.
2. **기록 추가:** `activity/records.json`의 `records` 안에 한 묶음을 추가합니다.

```json
{
  "id": "2026-12-session1",
  "title": "1회차 봉사활동",
  "date": "2026-12-06",
  "end": "2026-12-06",
  "place": "장소",
  "summary": "한두 문장 요약",
  "photos": [
    { "src": "2026-12-session1/01.jpg", "caption": "사진 아래 짧은 설명", "alt": "사진에 보이는 내용을 문장으로" }
  ],
  "items": [
    { "title": "한 일 제목", "text": "자세한 내용" }
  ],
  "next": ["다음 일정"]
}
```

- `alt`(사진 설명)는 꼭 적습니다. 화면낭독기가 읽고, 사이트에서 ‘사진 설명 보기’를 누르면 화면에도 보입니다.
- 최신 기록이 자동으로 맨 위에 옵니다.
- 참여자 얼굴이 나온 사진은 공개에 동의한 경우에만 올립니다.

## 웹 도슨트 해설 바꾸는 법

웹 도슨트의 작품 해설은 [docent-lab](https://github.com/suminalliema/docent-lab)에서 만들고 검수한 뒤 `docent/artworks.json`으로 내보냅니다.

1. docent-lab에서 AI로 해설 초안을 만들고, 팀원이 그림과 한 줄씩 대조해 고칩니다.
2. 승인한 해설만 `data/reviewed.csv`에 `status=approved`로 표시합니다.
3. docent-lab 폴더에서 아래 명령을 실행하면 이 사이트의 `docent/artworks.json`과 이미지가 만들어집니다.

```bash
python src/export_site.py --site ../sonkkeut-docent.github.io
```

`docent/artworks.json`의 작품 한 묶음은 아래와 같습니다.

```json
{
  "id": "moll-karlskirche-winter",
  "title": "작품 제목",
  "artist": "작가",
  "year": "1902",
  "image": "docent/images/파일이름.jpg",
  "alt": "그림을 한 문장으로 설명한 대체텍스트",
  "description": "음성으로 읽을 해설 (문단은 \n\n으로 나눔)",
  "license": "퍼블릭 도메인",
  "source": "이미지 출처 주소",
  "ai": { "model": "모델 이름", "prompt": "프롬프트 버전", "edited": true },
  "reviewedBy": "썬덕걸즈",
  "reviewedAt": "2026-11-26"
}
```

### 꼭 지켜 주세요

- **AI 초안은 검수 없이 올리지 않습니다.** 시각장애인 관람객은 해설이 틀려도 그림을 보고 확인할 수 없습니다.
- `ai.edited`는 사람이 고친 경우 `true`입니다. 사이트에 ‘사람이 고침’ 표시가 붙습니다.
- 이미지는 이용이 허락된 것만 쓰고, `license`와 `source`를 반드시 적습니다.
- 웹 도슨트 화면의 ‘찾아가는 길’, ‘작품 해설 듣기’, ‘촉각 표식 찾기’ 버튼은 아직 준비 중입니다. 누르면 “준비 중입니다”가 뜹니다(`app.js`의 `data-soon`).

## 함께하는 기관 로고

맨 아래 로고는 누르면 각 기관 홈페이지가 새 창으로 열립니다. 순서와 주소는 `app.js`의 `partner-logos` 부분에서 바꿉니다.

| 순서 | 기관 | 파일 | 연결 주소 |
|---|---|---|---|
| 1 | 롯데지주 | `partner-lotte.png` | https://www.lotte.co.kr |
| 2 | 희망친구 기아대책 | `partner-kfhi.png` | https://www.kfhi.or.kr |
| 3 | 사랑의열매 사회복지공동모금회 | `partner-chest.png` | https://chest.or.kr |

## 사이트에 올리는 법 (내 컴퓨터에서 고친 경우)

이 폴더(`~/Documents/sonkkeut-docent.github.io`)에서 고친 내용은 GitHub에 올려야 사이트에 반영됩니다.

**방법 1. 더블클릭:** 문서 폴더의 `손끝도슨트_사이트_올리기.command`를 더블클릭하고 안내를 따릅니다.

**방법 2. 터미널:** 아래를 복사해 붙여 넣습니다. `"..."` 안에는 바꾼 내용을 적습니다.

```bash
cd ~/Documents/sonkkeut-docent.github.io && git add -A && git commit -m "바꾼 내용" && git pull --rebase && git push
```

- 1~2분 뒤 사이트에 반영됩니다. 안 보이면 Cmd+Shift+R로 새로고침합니다.
- 충돌 메시지가 나오면 더 진행하지 말고 화면을 캡처해 공유합니다.
- GitHub 웹에서 직접 고친 경우에는 이 과정이 필요 없습니다.

## 내 컴퓨터에서 미리 보기

`index.html`을 더블클릭하면 카드뉴스 목록을 불러오지 못합니다. 폴더에서 아래 명령을 실행한 뒤 브라우저에서 `http://localhost:8000`을 엽니다.

```bash
cd ~/Documents/sonkkeut-docent.github.io && python3 -m http.server 8000
```
