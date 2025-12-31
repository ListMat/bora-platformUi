@echo off
echo ===================================
echo    Gerando Prisma Client
echo ===================================
echo.

cd packages\db
echo Diretorio: %CD%
echo.

echo Gerando Prisma Client...
npx prisma generate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo    Prisma Client Gerado!
    echo ===================================
    echo.
) else (
    echo.
    echo ===================================
    echo    ERRO ao gerar Prisma Client
    echo ===================================
    echo.
)

cd ..\..
pause

