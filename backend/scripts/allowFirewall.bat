@echo off
echo ========================================
echo Adding Node.js Firewall Rules
echo ========================================
echo.

echo Adding inbound rule...
netsh advfirewall firewall add rule name="Node.js Email - Inbound" dir=in action=allow program="%ProgramFiles%\nodejs\node.exe" enable=yes

echo Adding outbound rule...
netsh advfirewall firewall add rule name="Node.js Email - Outbound" dir=out action=allow program="%ProgramFiles%\nodejs\node.exe" enable=yes

echo.
echo ========================================
echo Firewall rules added successfully!
echo ========================================
echo.
echo Now restart your backend server
pause
