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
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "Nmap Explorer"
VIAddVersionKey "FileDescription" "Nmap Explorer Installer"
VIAddVersionKey "FileVersion" "1.0.0"
VIAddVersionKey "LegalCopyright" "Copyright hejhdis"

; --- UI Settings ---
!define MUI_ICON "app_icon.ico"
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
    
    ; Define files to be installed
    File "/oname=UI.exe" "ui.exe"
    File "/oname=SERVER.exe" "server.exe"
    File "licenses.7z"
    File "app_icon.ico"
    
    WriteUninstaller "$INSTDIR\uninstall.exe"
    
    ; --- HKLM Registry Entries (Add/Remove Programs) ---
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\NmapExplorer" "DisplayName" "Nmap Explorer"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\NmapExplorer" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\NmapExplorer" "DisplayIcon" "$INSTDIR\app_icon.ico"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\NmapExplorer" "Publisher" "hejhdis"

    ; --- Desktop Shortcuts ---
    CreateShortCut "$DESKTOP\Nmap Explorer UI.lnk" "$INSTDIR\UI.exe" "" "$INSTDIR\app_icon.ico"
    CreateShortCut "$DESKTOP\Nmap Explorer SERVER.lnk" "$INSTDIR\SERVER.exe" "" "$INSTDIR\app_icon.ico"

    ; --- Start Menu Shortcuts ---
    CreateDirectory "$SMPROGRAMS\Nmap Explorer"
    CreateShortCut "$SMPROGRAMS\Nmap Explorer\Nmap Explorer UI.lnk" "$INSTDIR\UI.exe" "" "$INSTDIR\app_icon.ico"
    CreateShortCut "$SMPROGRAMS\Nmap Explorer\Nmap Explorer Server.lnk" "$INSTDIR\SERVER.exe" "" "$INSTDIR\app_icon.ico"
    CreateShortCut "$SMPROGRAMS\Nmap Explorer\Uninstall Nmap Explorer.lnk" "$INSTDIR\uninstall.exe"

SectionEnd

; --------------------------------
; Uninstaller Section
; --------------------------------
Section "Uninstall"
    ; Delete Files
    Delete "$INSTDIR\UI.exe"
    Delete "$INSTDIR\SERVER.exe"
    Delete "$INSTDIR\licenses.7z"
    Delete "$INSTDIR\uninstall.exe"
    Delete "$INSTDIR\app_icon.ico"
    
    ; Remove Registry Keys
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\NmapExplorer"

    ; Delete Shortcuts
    Delete "$DESKTOP\Nmap Explorer UI.lnk"
    Delete "$DESKTOP\Nmap Explorer SERVER.lnk"

    Delete "$SMPROGRAMS\Nmap Explorer\Nmap Explorer UI.lnk"
    Delete "$SMPROGRAMS\Nmap Explorer\Nmap Explorer Server.lnk"
    Delete "$SMPROGRAMS\Nmap Explorer\Uninstall Nmap Explorer.lnk"
    RMDir "$SMPROGRAMS\Nmap Explorer"

    RMDir "$INSTDIR"
SectionEnd