@echo off
echo Starting ngrok tunnel...
start /B ngrok http 3000
timeout /t 3
echo.
echo Ngrok should be running now.
echo Check http://localhost:4040 to see your public URL
echo.
echo Copy the HTTPS URL and update your .env.local:
echo NEXTAUTH_URL=https://your-ngrok-url.ngrok.io
echo.
pause