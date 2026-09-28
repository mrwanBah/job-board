$ErrorActionPreference = "Stop"

$jdkPath = "C:\Users\mrwan\.jdks\ms-17.0.19"
$mavenPath = "C:\Users\mrwan\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd"

if (Test-Path $jdkPath) {
    $env:JAVA_HOME = $jdkPath
    $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}

& $mavenPath spring-boot:run "-Dspring-boot.run.profiles=local"
