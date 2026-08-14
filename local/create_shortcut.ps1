$ws = New-Object -ComObject WScript.Shell
$desktopPath = [System.IO.Path]::Combine($env:USERPROFILE, "Desktop", "Vidya AI.lnk")
$sc = $ws.CreateShortcut($desktopPath)
$sc.TargetPath = "C:\Users\HP\projects\Vidya-1.7B\local\start_vidya.bat"
$sc.WorkingDirectory = "C:\Users\HP\projects\Vidya-1.7B\local"
$sc.Description = "Vidya 1.7B Local AI Assistant"
$sc.Save()
Write-Host "Desktop shortcut created: $desktopPath"
