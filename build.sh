#!/bin/bash

# Script to process glb and gltf files with gltfjsx
# Scans public/models folder and converts models to JSX components

set -e  # Exit on any error

# Define directories
MODELS_DIR="public/models"
OUTPUT_DIR="public/models_build"
JSX_OUTPUT_DIR="src/models_build"

echo "Starting model processing..."

# Create output directory if it doesn't exist
if [ ! -d "$OUTPUT_DIR" ]; then
    echo "Creating output directory: $OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR"
fi

# Check if models directory exists
if [ ! -d "$MODELS_DIR" ]; then
    echo "Error: Models directory $MODELS_DIR not found!"
    exit 1
fi

# Find and process all .glb and .gltf files
find "$MODELS_DIR" -type f \( -name "*.glb" -o -name "*.gltf" \) | while read -r model_file; do
    echo "Processing: $model_file"

    # Get just the filename without path and extension
    filename=$(basename "$model_file")
    name_without_ext="${filename%.*}"

    # Convert to PascalCase for component name
    component_name=$(echo "$name_without_ext" | sed 's/[-_]/ /g' | sed 's/\b\w/\u&/g' | sed 's/ //g')

    # Create output filename
    output_file="$OUTPUT_DIR/${component_name}.jsx"

    # Run gltfjsx command
    npx gltfjsx "$model_file" --transform --exportdefault -o "$output_file"

    if [ $? -eq 0 ]; then
        echo "✅ Successfully processed: $filename → ${component_name}.jsx"
    else
        echo "❌ Failed to process: $filename"
    fi
done

# Create JSX output directory if it doesn't exist
if [ ! -d "$JSX_OUTPUT_DIR" ]; then
    echo "Creating JSX output directory: $JSX_OUTPUT_DIR"
    mkdir -p "$JSX_OUTPUT_DIR"
fi

# Move processed files to JSX output directory
mv "$OUTPUT_DIR"/*.jsx "$JSX_OUTPUT_DIR"

# Patch new JSX files
# Replace "useGLTF('/" with "useGLTF('/models_build/"
# Replace "preload('/" with "preload('/models_build/"
for jsx_file in "$JSX_OUTPUT_DIR"/*.jsx; do
    echo "Patching: $jsx_file"
    sed -i '' "s|useGLTF('/|useGLTF('/models_build/|g" "$jsx_file"
    sed -i '' "s|preload('/|preload('/models_build/|g" "$jsx_file"
done

echo "Model processing complete!"