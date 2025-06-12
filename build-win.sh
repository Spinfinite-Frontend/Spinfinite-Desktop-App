#!/bin/bash

electron-packager . Spinfinite \
  --platform=win32 \
  --arch=x64 \
  --icon=icon.ico \
  --app-version=1.0.3 \
  --build-version=1.0.3 \
  --executable-name="Spinfinite" \
  --win32metadata.ProductName="Spinfinite Desktop" \
  --win32metadata.CompanyName="Spinfinite Ltd" \
  --win32metadata.FileDescription="Official Spinfinite Desktop App" \
  --win32metadata.InternalName="SpinfiniteApp" \
  --win32metadata.OriginalFilename="Spinfinite.exe" \
  --out=dist \
  --overwrite
