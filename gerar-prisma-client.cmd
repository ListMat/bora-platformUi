@echo off
echo ===================================
echo    Gerando Prisma Client
echo ===================================
echo.

cd packages\db
echo Diretorio: %CD%
echo.

echo Gerando Prisma Client...
call npx prisma generate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo    Prisma Client Gerado!
    echo ===================================
    echo.
    echo Copiando para todas as versoes...
    cd ..\..
    call node packages\db\copy-prisma-client.js
    echo.
    echo ===================================
    echo    Concluido!
    echo ===================================
) else (
    echo.
    echo ===================================
    echo    ERRO ao gerar Prisma Client
    echo ===================================
    echo.
    echo Solucao: Reinicie o computador e execute novamente
    echo.
)

cd ..\..
pause

