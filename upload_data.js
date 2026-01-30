const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase Admin 초기화 (Service Account Key 필요)
// Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성
// serviceAccountKey.json 파일을 프로젝트 루트에 저장
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadData() {
  try {
    // song_data.json 읽기
    const songData = JSON.parse(fs.readFileSync('./song_data.json', 'utf8'));
    
    console.log('곡 데이터 업로드 시작...');
    
    // 각 곡을 Firestore에 업로드
    for (const song of songData) {
      await db.collection('songs').doc(song.id).set(song);
      console.log(`✓ ${song.title} 업로드 완료`);
    }
    
    // 초기 공지사항 설정
    await db.collection('announcements').doc('latest').set({
      content: '부활절 칸타타 총연습: 3월 29일(주일) 5PM',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✓ 공지사항 초기화 완료');
    
    // 관리자 비밀번호 설정 (기본값: admin)
    await db.collection('config').doc('admin').set({
      password: 'admin'  // 나중에 변경 가능
    });
    console.log('✓ 관리자 설정 완료 (기본 비밀번호: admin)');
    
    console.log('\n✅ 모든 데이터 업로드 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 업로드 중 오류 발생:', error);
    process.exit(1);
  }
}

uploadData();
