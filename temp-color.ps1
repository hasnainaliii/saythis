Add-Type -AssemblyName System.Drawing
$dir = 'd:\Projects\saythis\src\assets\images\emoji'
$files = Get-ChildItem -Path $dir -Filter *.png
foreach ($f in $files) {
    $img = [System.Drawing.Bitmap]::FromFile($f.FullName)
    $x = [int]($img.Width / 2)
    $y = [int]($img.Height * 0.15)
    $color = $img.GetPixel($x, $y)
    $hex = '#{0:X2}{1:X2}{2:X2}' -f $color.R, $color.G, $color.B
    Write-Host ($f.Name + ': ' + $hex)
    $img.Dispose()
}
