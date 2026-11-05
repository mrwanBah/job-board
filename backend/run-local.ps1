$ErrorActionPreference = "Stop"
Push-Location $PSScriptRoot
try { & .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
finally { Pop-Location }
