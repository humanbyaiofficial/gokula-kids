// Drawing & Tracing Canvas Module
(function() {
    let canvas, ctx;
    let isDrawing = false;
    let currentTool = 'brush'; // brush, bucket, eraser
    let currentColor = '#000000';
    let currentSize = 8;
    let templateOpacity = 40;
    let selectedTemplate = 'blank';
    
    // Track previous positions for drawing smooth curves
    let lastX = 0;
    let lastY = 0;

    function initCanvasStudio() {
        canvas = document.getElementById('drawing-canvas');
        if (!canvas) return;
        
        ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        setupCanvasSettings();
        setupEventListeners();
        loadTemplate(selectedTemplate);
    }

    function setupCanvasSettings() {
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Brush default style
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function setupEventListeners() {
        // Drawing events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch support for tablets/mobiles
        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }, { passive: true });

        canvas.addEventListener('touchend', () => {
            const mouseEvent = new MouseEvent('mouseup', {});
            canvas.dispatchEvent(mouseEvent);
        });

        // Tools selector
        document.getElementById('tool-brush').onclick = () => selectTool('brush');
        document.getElementById('tool-bucket').onclick = () => selectTool('bucket');
        document.getElementById('tool-eraser').onclick = () => selectTool('eraser');

        // Size slider
        const sizeSlider = document.getElementById('brush-size');
        const sizeDisplay = document.getElementById('brush-size-display');
        sizeSlider.oninput = (e) => {
            currentSize = e.target.value;
            sizeDisplay.textContent = `${currentSize}px`;
        };

        // Color Palette Swatches
        const swatches = document.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            swatch.onclick = () => {
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                currentColor = swatch.getAttribute('data-color');
                document.getElementById('custom-color-picker').value = currentColor;
                
                // Switch back to brush if eraser was selected
                if (currentTool === 'eraser') {
                    selectTool('brush');
                }
            };
        });

        // Custom Color Picker
        const customColor = document.getElementById('custom-color-picker');
        customColor.oninput = (e) => {
            currentColor = e.target.value;
            swatches.forEach(s => s.classList.remove('active'));
            if (currentTool === 'eraser') {
                selectTool('brush');
            }
        };

        // Templates panel selector
        const templates = document.querySelectorAll('.template-item');
        templates.forEach(temp => {
            temp.onclick = () => {
                templates.forEach(t => t.classList.remove('active'));
                temp.classList.add('active');
                selectedTemplate = temp.getAttribute('data-template');
                loadTemplate(selectedTemplate);
            };
        });

        // Opacity slider
        const opacitySlider = document.getElementById('tracing-opacity');
        const opacityDisplay = document.getElementById('tracing-opacity-display');
        opacitySlider.oninput = (e) => {
            templateOpacity = e.target.value;
            opacityDisplay.textContent = `${templateOpacity}%`;
            updateTemplateOpacityStyle();
        };

        // Actions
        document.getElementById('clear-canvas-btn').onclick = () => {
            window.playSynthSound('tap');
            if (confirm("Are you sure you want to clear your artwork?")) {
                setupCanvasSettings();
                // Redraw base outline if a vector outline template was selected
                if (selectedTemplate === 'peacock') {
                    drawPeacockOutline();
                }
            }
        };

        document.getElementById('save-canvas-btn').onclick = saveArtwork;
    }

    function selectTool(tool) {
        window.playSynthSound('tap');
        currentTool = tool;
        
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`tool-${tool}`).classList.add('active');
    }

    function updateTemplateOpacityStyle() {
        if (selectedTemplate === 'blank') {
            canvas.style.backgroundImage = 'none';
            return;
        }
        
        let url = '';
        if (selectedTemplate === 'krishna_butter') {
            url = 'assets/krishna_butter_coloring.jpg';
        } else if (selectedTemplate === 'krishna_flute') {
            url = 'assets/krishna_flute_coloring.jpg';
        } else {
            canvas.style.backgroundImage = 'none';
            return;
        }

        // Apply styled background overlay style
        canvas.style.backgroundImage = `url('${url}')`;
        canvas.style.backgroundSize = 'contain';
        canvas.style.backgroundPosition = 'center';
        canvas.style.backgroundRepeat = 'no-repeat';
        canvas.style.backgroundColor = `rgba(255, 255, 255, ${1 - (templateOpacity / 100)})`;
    }

    function loadTemplate(templateType) {
        window.playSynthSound('tap');
        selectedTemplate = templateType;
        
        // Reset base canvas
        setupCanvasSettings();
        
        // Reset tracing CSS background
        canvas.style.backgroundImage = 'none';
        canvas.style.backgroundColor = 'white';

        if (templateType === 'peacock') {
            drawPeacockOutline();
        } else if (templateType !== 'blank') {
            // This is a picture template. Update CSS background for tracing
            updateTemplateOpacityStyle();
        }
    }

    // Drawing Helpers
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        
        // Support mouse or touch screen coordinates
        let clientX = e.clientX;
        let clientY = e.clientY;
        
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        // Scale coordinates to fit canvas backing store
        return {
            x: ((clientX - rect.left) / rect.width) * canvas.width,
            y: ((clientY - rect.top) / rect.height) * canvas.height
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        const pos = getMousePos(e);
        lastX = pos.x;
        lastY = pos.y;

        if (currentTool === 'bucket') {
            // Run Flood Fill
            runFloodFill(Math.round(pos.x), Math.round(pos.y));
        } else {
            draw(e);
        }
    }

    function draw(e) {
        if (!isDrawing || currentTool === 'bucket') return;

        const pos = getMousePos(e);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        
        if (currentTool === 'eraser') {
            ctx.strokeStyle = '#ffffff'; // White out
            ctx.lineWidth = currentSize * 1.5;
        } else {
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentSize;
        }
        
        ctx.stroke();
        
        lastX = pos.x;
        lastY = pos.y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // OPTIMIZED BFS FLOOD FILL ALGORITHM
    function runFloodFill(startX, startY) {
        const fillHex = currentColor;
        const fillRGB = hexToRgb(fillHex);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        const startIdx = (startY * width + startX) * 4;
        const startR = data[startIdx];
        const startG = data[startIdx+1];
        const startB = data[startIdx+2];
        const startA = data[startIdx+3];

        // Verify color isn't already the target color (to prevent infinite loop)
        if (matchColor(startR, startG, startB, startA, fillRGB)) return;

        // BFS loop using a flat array as stack/queue for speed
        const stack = [startX, startY];
        const targetColor = [startR, startG, startB, startA];
        
        while (stack.length > 0) {
            const currY = stack.pop();
            const currX = stack.pop();
            
            const idx = (currY * width + currX) * 4;

            if (matchColor(data[idx], data[idx+1], data[idx+2], data[idx+3], targetColor)) {
                // Color it
                data[idx] = fillRGB[0];
                data[idx+1] = fillRGB[1];
                data[idx+2] = fillRGB[2];
                data[idx+3] = 255; // opaque

                // Add neighbors to stack
                if (currX > 0) { stack.push(currX - 1); stack.push(currY); }
                if (currX < width - 1) { stack.push(currX + 1); stack.push(currY); }
                if (currY > 0) { stack.push(currX); stack.push(currY - 1); }
                if (currY < height - 1) { stack.push(currX); stack.push(currY + 1); }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        window.playSynthSound('collect');
    }

    function matchColor(r, g, b, a, target) {
        // Allow a small threshold of similarity to account for anti-aliasing
        const threshold = 12;
        return Math.abs(r - target[0]) < threshold &&
               Math.abs(g - target[1]) < threshold &&
               Math.abs(b - target[2]) < threshold;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return [
            (bigint >> 16) & 255,
            (bigint >> 8) & 255,
            bigint & 255
        ];
    }

    // DRAW PEACOCK FEATHER OUTLINE (Vector template fallback)
    function drawPeacockOutline() {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Central quill (stem)
        ctx.beginPath();
        ctx.moveTo(cx, cy + 180);
        ctx.quadraticCurveTo(cx - 30, cy + 60, cx, cy - 80);
        ctx.stroke();

        // Main outer fan loop (the eye boundary)
        ctx.beginPath();
        ctx.ellipse(cx, cy - 80, 70, 95, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner eye loop 1
        ctx.beginPath();
        ctx.ellipse(cx, cy - 65, 45, 60, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Inner eye loop 2
        ctx.beginPath();
        ctx.ellipse(cx, cy - 50, 25, 35, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Feathery side strands
        ctx.lineWidth = 1.5;
        // Right side strands
        for (let i = 0; i < 15; i++) {
            const py = cy + 160 - (i * 18);
            const factor = i / 15;
            const size = 30 + Math.sin(factor * Math.PI) * 70;
            
            ctx.beginPath();
            ctx.moveTo(cx - 10, py);
            ctx.quadraticCurveTo(cx + size, py - 30, cx + size * 0.9, py - 60);
            ctx.stroke();
        }

        // Left side strands
        for (let i = 0; i < 15; i++) {
            const py = cy + 160 - (i * 18);
            const factor = i / 15;
            const size = 30 + Math.sin(factor * Math.PI) * 70;
            
            ctx.beginPath();
            ctx.moveTo(cx - 10, py);
            ctx.quadraticCurveTo(cx - size, py - 30, cx - size * 0.9, py - 60);
            ctx.stroke();
        }
    }

    // SAVE ARTWORK (Merges canvas drawing with background template and triggers download)
    function saveArtwork() {
        window.playSynthSound('win');
        
        // Create an offline canvas to merge drawing with background template (if selected)
        const mergeCanvas = document.createElement('canvas');
        mergeCanvas.width = canvas.width;
        mergeCanvas.height = canvas.height;
        const mctx = mergeCanvas.getContext('2d');

        // 1. Fill base white
        mctx.fillStyle = '#ffffff';
        mctx.fillRect(0, 0, mergeCanvas.width, mergeCanvas.height);

        // 2. If a tracing template is active, draw it first with low opacity in the background
        if (selectedTemplate !== 'blank' && selectedTemplate !== 'peacock') {
            const img = new Image();
            
            // Set source
            if (selectedTemplate === 'krishna_butter') {
                img.src = 'assets/krishna_butter_coloring.jpg';
            } else if (selectedTemplate === 'krishna_flute') {
                img.src = 'assets/krishna_flute_coloring.jpg';
            }

            img.onload = () => {
                // Draw background template matching the container size
                mctx.globalAlpha = templateOpacity / 100;
                
                // Draw template image centered and scaled aspect ratio
                const hRatio = mergeCanvas.width / img.width;
                const vRatio = mergeCanvas.height / img.height;
                const ratio = Math.min(hRatio, vRatio);
                const shiftX = (mergeCanvas.width - img.width * ratio) / 2;
                const shiftY = (mergeCanvas.height - img.height * ratio) / 2;
                
                mctx.drawImage(img, 0, 0, img.width, img.height, shiftX, shiftY, img.width * ratio, img.height * ratio);
                
                // Restore alpha and draw user drawing on top
                mctx.globalAlpha = 1.0;
                mctx.drawImage(canvas, 0, 0);
                triggerDownload(mergeCanvas);
            };

            img.onerror = () => {
                // Fallback: draw user drawing anyway
                mctx.drawImage(canvas, 0, 0);
                triggerDownload(mergeCanvas);
            };
        } else {
            // Blank canvas or vector template, just draw canvas
            mctx.drawImage(canvas, 0, 0);
            triggerDownload(mergeCanvas);
        }
    }

    function triggerDownload(targetCanvas) {
        // Trigger download
        const imageURL = targetCanvas.toDataURL("image/png");
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = `gokula-kids-painting-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Award score and unlock badge
        window.incrementScore(25);
        window.unlockBadge('artist');
    }

    // Expose resize trigger for tab switching safety
    window.resizeDrawingCanvas = () => {
        // Canvas width handling if wrapper changes, but 600x450 is static layout
    };

    // Bind to DOM
    document.addEventListener('DOMContentLoaded', () => {
        initCanvasStudio();
    });

    document.addEventListener('tabChanged', (e) => {
        if (e.detail.tab === 'art') {
            initCanvasStudio();
        }
    });

})();
