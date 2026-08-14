$WshShell = New-Object -comObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$StartupPath = [Environment]::GetFolderPath("Startup")
$TargetPath = "c:\Users\HP\projects\Vidya-1.7B\webapp\index.html"

# Desktop Shortcut
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\Vidya 1.7B.lnk")
$Shortcut.TargetPath = $TargetPath
$Shortcut.Save()

# Startup Shortcut
$StartupShortcut = $WshShell.CreateShortcut("$StartupPath\Vidya 1.7B.lnk")
$StartupShortcut.TargetPath = $TargetPath
$StartupShortcut.Save()

Write-Host "Shortcuts created successfully on Desktop and in Startup folder!"
