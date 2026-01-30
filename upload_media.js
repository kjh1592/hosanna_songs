const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Firebase Admin 초기화
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'hosanna-song.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// 로컬 미디어 파일 경로
const MEDIA_SOURCE_PATH = 'C:\\Users\\으니주니최고\\Documents\\카카오톡 받은 파일';

async function uploadMediaFiles() {
    try {
        console.log('미디어 파일 업로드 시작...\n');

        // 업로드할 파일 목록
        const files = [
            // 곡 1-6: 파트별 비디오 (24개)
            '1-s.mp4', '1-a.mp4', '1-t.mp4', '1-b.mp4',
            '2-s.mp4', '2-a.mp4', '2-t.mp4', '2-b.mp4',
            '3-s.mp4', '3-a.mp4', '3-t.mp4', '3-b.mp4',
            '4-s.mp4', '4-a.mp4', '4-t.mp4', '4-b.mp4',
            '5-s.mp4', '5-a.mp4', '5-t.mp4', '5-b.mp4',
            '6-s.mp4', '6-a.mp4', '6-t.mp4', '6-b.mp4',
            // 전체곡: 비디오 + 오디오 (2개)
            'full-movie.mp4',
            'full-audio.mp3',
            // 커버 이미지
            'cover.jpg'
        ];

        let uploaded = 0;
        let total = files.length;

        for (const fileName of files) {
            const localPath = path.join(MEDIA_SOURCE_PATH, fileName);
            const remotePath = `media/${fileName}`;

            // 파일 존재 확인
            if (!fs.existsSync(localPath)) {
                console.log(`⚠️  ${fileName} 파일을 찾을 수 없습니다. 건너뜁니다.`);
                continue;
            }

            // 파일 크기 확인
            const stats = fs.statSync(localPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

            console.log(`업로드 중: ${fileName} (${fileSizeMB}MB)...`);

            // Firebase Storage에 업로드
            await bucket.upload(localPath, {
                destination: remotePath,
                metadata: {
                    contentType: getContentType(fileName),
                    cacheControl: 'public, max-age=31536000', // 1년 캐시
                }
            });

            // 공개 URL 설정
            const file = bucket.file(remotePath);
            await file.makePublic();

            uploaded++;
            console.log(`✓ ${fileName} 업로드 완료 (${uploaded}/${total})\n`);
        }

        console.log(`\n✅ 총 ${uploaded}개 파일 업로드 완료!`);
        console.log('Firebase Storage에서 파일을 확인하세요.');
        process.exit(0);
    } catch (error) {
        console.error('❌ 업로드 중 오류 발생:', error);
        process.exit(1);
    }
}

function getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const types = {
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.m4a': 'audio/mp4',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png'
    };
    return types[ext] || 'application/octet-stream';
}

uploadMediaFiles();
