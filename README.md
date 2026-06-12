# API를 이용한 협업 웹 제작 프로젝트
<p align="center">
<img width="554" height="117"  alt="logo" src="https://github.com/user-attachments/assets/ee9196c1-a378-453f-a262-ed885714b888" />
</p>

> Next.js, Node.js, Convex를 이용하여 협업 웹 사이트를 제작



---

## 🧠 프로젝트 개요
### 📌 목표
서버사이드 렌더링을 지원하는 Next.js를 사용하여 협업 웹 사이트를 만드는 것을 목표로 했습니다. 기존에 MySQL 등 관계형 데이터 베이스만을 사용해봤기 때문에, Convex로 비관계형 DB를 경험을 하려고 했습니다.
### 🛠️ **사용 기술**
- Next.js 15.2.4v
- Node.js 22.18.0v
- Convex 1.23.0v
- Express 5.1.0v
- WebRTC
### 👉 **환경**
- Window 11 Home
- Visual Studio Code
- AMD Ryzen 7 7735HS with Radeon Graphics
- Ram 32GB

---

<details>
  <summary>## 📁 프로젝트 구조</summary>
  ```
  📦 Coope
  ├─ .gitignore
  ├─ .gitmessage.txt
  ├─ README.md
  ├─ app
  │  ├─ (auth)
  │  │  └─ (routes)
  │  │     ├─ layout.tsx
  │  │     ├─ sign-in
  │  │     │  └─ [[...sign-in]]
  │  │     │     └─ page.tsx
  │  │     └─ sign-up
  │  │        └─ [[...sign-up]]
  │  │           └─ page.tsx
  │  ├─ (main)
  │  │  ├─ (routes)
  │  │  │  ├─ friends
  │  │  │  │  └─ page.tsx
  │  │  │  └─ workspace
  │  │  │     └─ [workspaceId]
  │  │  │        ├─ documents
  │  │  │        │  ├─ [documentId]
  │  │  │        │  │  └─ page.tsx
  │  │  │        │  └─ page.tsx
  │  │  │        └─ friends
  │  │  │           └─ page.tsx
  │  │  ├─ _components
  │  │  │  ├─ WebRtcComponent.tsx
  │  │  │  ├─ addFriend.tsx
  │  │  │  ├─ banner.tsx
  │  │  │  ├─ callModal.tsx
  │  │  │  ├─ callPreJoinModal.tsx
  │  │  │  ├─ document-list.tsx
  │  │  │  ├─ friend.tsx
  │  │  │  ├─ friendRequestList.tsx
  │  │  │  ├─ invite-button.tsx
  │  │  │  ├─ item.tsx
  │  │  │  ├─ menu.tsx
  │  │  │  ├─ messageListenert.tsx
  │  │  │  ├─ miniCallPopup.tsx
  │  │  │  ├─ navbar.tsx
  │  │  │  ├─ navigation.tsx
  │  │  │  ├─ title.tsx
  │  │  │  ├─ trash-box.tsx
  │  │  │  ├─ user-item.tsx
  │  │  │  └─ userList.tsx
  │  │  └─ layout.tsx
  │  ├─ (marketing)
  │  │  ├─ (routes)
  │  │  │  ├─ csAdmin
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ customerService
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ function
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ inquiryPage
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ inquiryWrite
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ introduction
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ notice
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ noticeEditPage
  │  │  │  │  └─ page.tsx
  │  │  │  ├─ noticePage
  │  │  │  │  └─ page.tsx
  │  │  │  └─ support
  │  │  │     └─ page.tsx
  │  │  ├─ _components
  │  │  │  ├─ ScrollToTop.tsx
  │  │  │  ├─ answerWrite.tsx
  │  │  │  ├─ answers.tsx
  │  │  │  ├─ commentForm.tsx
  │  │  │  ├─ commentList.tsx
  │  │  │  ├─ faq.tsx
  │  │  │  ├─ footer.tsx
  │  │  │  ├─ heading.tsx
  │  │  │  ├─ heroes.tsx
  │  │  │  ├─ imageModal.tsx
  │  │  │  ├─ logo.tsx
  │  │  │  ├─ modal.tsx
  │  │  │  ├─ navbar.tsx
  │  │  │  ├─ noticeWrite.tsx
  │  │  │  ├─ policy.tsx
  │  │  │  └─ term.tsx
  │  │  ├─ admin
  │  │  │  ├─ SearchUsers.tsx
  │  │  │  ├─ _actions.ts
  │  │  │  └─ page.tsx
  │  │  ├─ layout.tsx
  │  │  └─ page.tsx
  │  ├─ api
  │  │  ├─ chat
  │  │  │  └─ route.ts
  │  │  ├─ edgestore
  │  │  │  └─ [...edgestore]
  │  │  │     └─ route.ts
  │  │  ├─ stt
  │  │  │  └─ route.ts
  │  │  └─ summary
  │  │     └─ route.ts
  │  ├─ error.tsx
  │  ├─ globals.css
  │  ├─ invite
  │  │  └─ page.tsx
  │  └─ layout.tsx
  ├─ components.json
  ├─ components
  │  ├─ ai-chat-modal.tsx
  │  ├─ chat-context.tsx
  │  ├─ cover.tsx
  │  ├─ editor.tsx
  │  ├─ icon-picker.tsx
  │  ├─ modals
  │  │  ├─ confirm-modal.tsx
  │  │  ├─ cover-image-modal.tsx
  │  │  ├─ invite-modal.tsx
  │  │  └─ settings-modal.tsx
  │  ├─ mode-toggle.tsx
  │  ├─ providers
  │  │  ├─ convex-provider.tsx
  │  │  ├─ modal-provider.tsx
  │  │  └─ theme-provider.tsx
  │  ├─ search-command.tsx
  │  ├─ single-image-dropzone.tsx
  │  ├─ spinner.tsx
  │  ├─ toolbar.tsx
  │  └─ ui
  │     ├─ accordion.tsx
  │     ├─ alert-dialog.tsx
  │     ├─ alert.tsx
  │     ├─ avatar.tsx
  │     ├─ button.tsx
  │     ├─ card.tsx
  │     ├─ command.tsx
  │     ├─ dialog.tsx
  │     ├─ dropdown-menu.tsx
  │     ├─ form.tsx
  │     ├─ input.tsx
  │     ├─ label.tsx
  │     ├─ pagination.tsx
  │     ├─ popover.tsx
  │     ├─ radio-group.tsx
  │     ├─ resizable.tsx
  │     ├─ scroll-area.tsx
  │     ├─ separator.tsx
  │     ├─ skeleton.tsx
  │     ├─ table.tsx
  │     └─ textarea.tsx
  ├─ convex
  │  ├─ README.md
  │  ├─ _generated
  │  │  ├─ api.d.ts
  │  │  ├─ api.js
  │  │  ├─ dataModel.d.ts
  │  │  ├─ server.d.ts
  │  │  └─ server.js
  │  ├─ aiChat.ts
  │  ├─ chat.ts
  │  ├─ client.ts
  │  ├─ comments.ts
  │  ├─ documents.ts
  │  ├─ friends.ts
  │  ├─ http.ts
  │  ├─ inquiries.ts
  │  ├─ notices.ts
  │  ├─ rooms.ts
  │  ├─ schema.ts
  │  ├─ tsconfig.json
  │  ├─ users.ts
  │  └─ workspace.ts
  ├─ coope-stt-637f9fa4c1bb.json
  ├─ dist
  │  └─ server.js
  ├─ eslint.config.mjs
  ├─ hooks
  │  ├─ use-cover-image.tsx
  │  ├─ use-invite.tsx
  │  ├─ use-scroll-top.tsx
  │  ├─ use-search.tsx
  │  ├─ use-settings.tsx
  │  └─ useMoveScroll.tsx
  ├─ lib
  │  ├─ action.ts
  │  ├─ edgestore.ts
  │  ├─ generated
  │  │  └─ prisma
  │  │     ├─ client.d.ts
  │  │     ├─ client.js
  │  │     ├─ default.d.ts
  │  │     ├─ default.js
  │  │     ├─ edge.d.ts
  │  │     ├─ edge.js
  │  │     ├─ index-browser.js
  │  │     ├─ index.d.ts
  │  │     ├─ index.js
  │  │     ├─ package.json
  │  │     ├─ query_engine-windows.dll.node
  │  │     ├─ runtime
  │  │     │  ├─ edge-esm.js
  │  │     │  ├─ edge.js
  │  │     │  ├─ index-browser.d.ts
  │  │     │  ├─ index-browser.js
  │  │     │  ├─ library.d.ts
  │  │     │  ├─ library.js
  │  │     │  ├─ react-native.js
  │  │     │  └─ wasm.js
  │  │     ├─ schema.prisma
  │  │     ├─ wasm.d.ts
  │  │     └─ wasm.js
  │  ├─ pb.ts
  │  └─ utils.ts
  ├─ middleware.ts
  ├─ next.config.ts
  ├─ package-lock.json
  ├─ package.json
  ├─ postcss.config.mjs
  ├─ prisma
  │  └─ schema.prisma
  ├─ public
  │  ├─ chat.png
  │  ├─ documents-dark.png
  │  ├─ documents.png
  │  ├─ empty-dark.png
  │  ├─ empty.png
  │  ├─ error-dark.png
  │  ├─ error.png
  │  ├─ example1.png
  │  ├─ example2.png
  │  ├─ file.svg
  │  ├─ fonts
  │  │  └─ PretendardVariable.woff2
  │  ├─ functionPeople.png
  │  ├─ globe.svg
  │  ├─ icons
  │  │  └─ favicon.ico
  │  ├─ introduction.png
  │  ├─ logo-dark.png
  │  ├─ logo-dark.svg
  │  ├─ logo.png
  │  ├─ logo.svg
  │  ├─ moon.png
  │  ├─ mountain.jpg
  │  ├─ next.svg
  │  ├─ reading-dark.png
  │  ├─ reading.png
  │  ├─ robot.png
  │  ├─ robot_dark.png
  │  ├─ support1.png
  │  ├─ universe.jpg
  │  ├─ vercel.svg
  │  └─ window.svg
  ├─ sampleData.jsonl
  ├─ server
  │  └─ server.ts
  ├─ styles
  │  └─ globals.css
  ├─ tailwind.config.ts
  ├─ tsconfig.json
  ├─ tsconfig.server.json
  ├─ types
  │  └─ globals.d.ts
  └─ utils
     ├─ audioUtils.ts
     └─ roles.ts
  ```
  ©generated by [Project Tree Generator](https://woochanleee.github.io/project-tree-generator)
</details>
---
## 🚀 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. Convex 실행

```bash
npx convex dev
```

### 3. 프로젝트 실행

```bash
npm run dev
npm run server
```

---

## 🧩 구현 내용 요약

### 문서 협업 시스템

* 문서 생성, 수정, 삭제(CRUD) 기능 구현
* 워크스페이스 기반 문서 관리
* 문서 공유 및 협업 환경 제공

### 사용자 관리

* 회원가입 및 로그인 기능
* 친구 추가 및 친구 요청 기능
* 워크스페이스 초대 기능

### 실시간 커뮤니케이션

* 실시간 채팅 기능
* 음성 통화 기능(WebRTC)

### AI 기능

* AI 채팅 기능
* 문서 요약 기능
* STT(Speech To Text) 기능

---

## 🛠️ 개발 중 겪은 문제 & 해결 방법

### Convex 데이터 모델 설계

#### 문제

기존에는 MySQL과 같은 관계형 데이터베이스만 사용해보았기 때문에 NoSQL 기반 데이터 모델 설계 경험이 부족했습니다.

#### 해결

사용자, 문서, 친구, 워크스페이스 데이터를 기능 단위로 분리하여 관리하고 데이터 접근 구조를 단순화하였습니다.

#### 결과

Convex 기반 데이터 관리 구조를 이해하고 NoSQL 데이터베이스 활용 경험을 쌓을 수 있었습니다.

### 프로젝트 구조 관리

#### 문제

프로젝트 규모가 커지면서 컴포넌트와 기능이 증가하여 코드 구조가 복잡해졌습니다.

#### 해결

기능 단위로 폴더를 분리하고 공통 컴포넌트를 재사용하도록 구조를 개선하였습니다.

#### 결과

유지보수성과 확장성을 높일 수 있었습니다.

---

## 🔧 추후 보완점

* 반응형 UI 개선
* 프로젝트 구조 리팩토링
* 예외 처리 및 에러 핸들링 강화
* 성능 최적화
* 사용자 경험(UI/UX) 개선
* 테스트 코드 작성

---

## 📃 라이선스

MIT License
