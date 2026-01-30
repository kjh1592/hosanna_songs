@echo off
echo 미디어 파일을 public/media 폴더로 복사하는 중...
echo.

set SOURCE=C:\Users\으니주니최고\Documents\카카오톡 받은 파일
set DEST=public\media

REM 파트별 비디오 복사 (24개)
for %%f in (1-s 1-a 1-t 1-b 2-s 2-a 2-t 2-b 3-s 3-a 3-t 3-b 4-s 4-a 4-t 4-b 5-s 5-a 5-t 5-b 6-s 6-a 6-t 6-b) do (
    if exist "%SOURCE%\%%f.mp4" (
        echo 복사 중: %%f.mp4
        copy "%SOURCE%\%%f.mp4" "%DEST%\" > nul
    ) else (
        echo 경고: %%f.mp4 파일을 찾을 수 없습니다.
    )
)

REM 전체곡 파일 복사
if exist "%SOURCE%\full-movie.mp4" (
    echo 복사 중: full-movie.mp4 (107MB - 시간이 걸릴 수 있습니다)
    copy "%SOURCE%\full-movie.mp4" "%DEST%\" > nul
) else (
    echo 경고: full-movie.mp4 파일을 찾을 수 없습니다.
)

if exist "%SOURCE%\full-audio.mp3" (
    echo 복사 중: full-audio.mp3
    copy "%SOURCE%\full-audio.mp3" "%DEST%\" > nul
) else (
    echo 경고: full-audio.mp3 파일을 찾을 수 없습니다.
)

REM 커버 이미지는 이미 public/res에 있으므로 media에도 복사
if exist "public\res\cover.jpg" (
    echo 복사 중: cover.jpg
    copy "public\res\cover.jpg" "%DEST%\cover.jpg" > nul
)

echo.
echo ✅ 복사 완료!
echo public/media 폴더를 확인하세요.
pause
