$url = "https://triple-ts-ahur.vercel.app/api/chat"

$body = @{
    messages = @(
        @{
            role = "user"
            content = "Is the movie database working?"
        }
    )
} | ConvertTo-Json

Write-Host "Testing endpoint: $url" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "Success! Status Code: $($response.StatusCode)" -ForegroundColor Green
    $response.Content
} catch {
    Write-Host "Failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    $_.Exception.Response.GetResponseStream() | %{ New-Object System.IO.StreamReader($_) } | %{ $_.ReadToEnd() }
}