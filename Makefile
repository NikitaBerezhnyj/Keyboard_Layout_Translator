OUTPUT_DIR := dist
ZIP_FILE := $(OUTPUT_DIR)/keyboard_layout_translator.zip
SRC_DIR := src

all: build

build: $(ZIP_FILE)
	@echo "Extension successfully built: $(ZIP_FILE)"

$(ZIP_FILE): $(OUTPUT_DIR)
	@echo "Creating archive $(ZIP_FILE)..."
	@cd $(SRC_DIR) && zip -r ../$(ZIP_FILE) .

$(OUTPUT_DIR):
	@echo "Creating directory $(OUTPUT_DIR)..."
	@mkdir -p $(OUTPUT_DIR)

clean:
	@echo "Cleaning..."
	@rm -rf $(OUTPUT_DIR)

.PHONY: all clean build
