# CARDS

## 사용법
1. `npm install` 의존성 패키지들을 설치합니다
2. `node bin/www` 서버를 실행합니다.
---

## 개발 보조 문서 실행
1. `npm install apidoc` apidoc 패키지를 설치합니다.
2. `npm run doc` apidoc을 통해 문서를 생성합니다.
3. `serve APIDOC` `http://localhost:3000`에 접속하여 문서를 확인할 수 있습니다.

---

### 응답코드

**Success Code**

Code|설명
---|---
200|요청 처리에 성공했습니다.

**Failed Code**

Code|설명
---|---
400|잘못된 요청
403|권한 부족
409|해당하는 데이터가 없습니다.
---|
50X|서버 문제로 서버 관리자에게 문의하세요