option explicit
dim wshShell
set wshShell = createobject("wscript.shell")

wshShell.Run "workRun.bat", 0, vbTrue

set wshShell = nothing
