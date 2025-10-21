#! /usr/bin/bash

# Clean up local folder
rm -r client
rm -r server
rm -r __MACOSX

# Process zip with site files
unzip dist.zip

# Copy client and server to root directory
cp -r client ..
cp -r server ..

# Clean up local folder
rm -r client
rm -r server
rm -r __MACOSX