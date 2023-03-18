@echo off
setlocal enabledelayedexpansion
set command=python -m waitress "$*"
%command%