@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [1/3] venv + deps
if not exist .venv (
  python -m venv .venv
)
call .venv\Scripts\activate.bat
pip install -r requirements.txt

echo [2/3] PyInstaller build
pyinstaller --noconfirm --clean ^
  --name "SEO발행" ^
  --windowed ^
  --add-data "templates;templates" ^
  --add-data "sites.json;." ^
  --add-data "sites.example.json;." ^
  --add-data ".env.example;." ^
  app_gui.py

echo [3/3] copy helper files
if not exist dist\SEO발행 mkdir dist\SEO발행
copy /Y .env.example "dist\SEO발행\.env.example" >nul
copy /Y sites.json "dist\SEO발행\sites.json" >nul
copy /Y sites.example.json "dist\SEO발행\sites.example.json" >nul
copy /Y README.md "dist\SEO발행\README.md" >nul 2>nul

echo.
echo 완료: dist\SEO발행\SEO발행.exe
echo sites.json 에 Vercel 도메인을 넣고, .env.example 을 .env 로 복사하세요.
pause
