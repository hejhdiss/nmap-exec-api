; --------------------------------
; Nmap Explorer - Setup Script
; --------------------------------

!include "MUI2.nsh"

; --- General Settings ---
Name "Nmap Explorer"
OutFile "NmapExplorer_Setup.exe"
InstallDir "$PROGRAMFILES\Nmap Explorer"
RequestExecutionLevel admin

; --- Metadata ---
VIProductVersion "0.0.0.0"
VIAddVersionKey "ProductName" "Nmap Explorer"
VIAddVersionKey "FileDescription" "Nmap Explorer Installer"
VIAddVersionKey "FileVersion" "0.0.0"
VIAddVersionKey "LegalCopyright" "Copyright hejhdis"

; --- UI Settings ---
!define MUI_ICON "app_icon.ico"       ; Make sure this file exists in the folder
!define MUI_UNICON "app_icon.ico"
!define MUI_ABORTWARNING

; --- Pages ---
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; --- Uninstaller Pages ---
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

; --------------------------------
; Installation Section
; --------------------------------
Section "Main Components" SEC01
    SetOutPath "$INSTDIR"
    
    File "/oname=UI.exe" "ui.exe"
    File "/oname=SERVER.exe" "server.exe"
    
    ; Include the license zip
    File "licenses.7z"
    
    ; Create Uninstaller
    WriteUninstaller "$INSTDIR\uninstall.exe"
    
    ; Create Desktop Shortcut pointing to the renamed UI.exe
    CreateShortCut "$DESKTOP\Nmap Explorer UI.lnk" "$INSTDIR\UI.exe" "" "$INSTDIR\app_icon.ico"
CreateShortCut "$DESKTOP\Nmap Explorer SERVER.lnk" "$INSTDIR\UI.exe" "" "$INSTDIR\app_icon.ico"

SectionEnd

; --------------------------------
; Uninstaller Section
; --------------------------------
Section "Uninstall"
    ; Delete the renamed files
    Delete "$INSTDIR\UI.exe"
    Delete "$INSTDIR\SERVER.exe"
    Delete "$INSTDIR\licenses.7z"
    Delete "$INSTDIR\uninstall.exe"
    
    ; Delete the shortcut
    Delete "$DESKTOP\Nmap Explorer UI.lnk"
     Delete "$DESKTOP\Nmap Explorer SERVER.lnk"

    RMDir "$INSTDIR"
SectionEnd