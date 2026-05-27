(function() {
    'use strict';

    const TOTAL_FRAMES = 100;
    const LOOP_DURATION = 4000;

    const inicioSection = document.getElementById('inicio');
    const heroCanvas = document.getElementById('hero-canvas');
    const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;

    const vignetteOverlay = document.querySelector('.vignette-overlay');
    const preloader = document.getElementById('hero-preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    const preloaderText = document.getElementById('preloader-text');

    let frames = [];
    let animFrameId = null;
    let isInitialized = false;
    let isVisible = true;
    let lastTime = 0;
    let accumulatedTime = 0;
    let currentFrameIndex = 0;
    let currentFrameImage = null;

    const colors = {
        dawn: {
            top: { r: 255, g: 160, b: 60, a: 0.20 },
            bottom: { r: 20, g: 10, b: 0, a: 0.45 }
        },
        sunset: {
            top: { r: 100, g: 60, b: 120, a: 0.25 },
            bottom: { r: 10, g: 5, b: 30, a: 0.55 }
        },
        night: {
            top: { r: 5, g: 10, b: 40, a: 0.15 },
            bottom: { r: 0, g: 0, b: 20, a: 0.70 }
        }
    };

    function lerpColor(c1, c2, factor) {
        const r = Math.round(c1.r + factor * (c2.r - c1.r));
        const g = Math.round(c1.g + factor * (c2.g - c1.g));
        const b = Math.round(c1.b + factor * (c2.b - c1.b));
        const a = (c1.a + factor * (c2.a - c1.a)).toFixed(3);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function updateAtmosphere(progress) {
        let topColor, bottomColor;
        if (progress <= 0.5) {
            const factor = progress / 0.5;
            topColor = lerpColor(colors.dawn.top, colors.sunset.top, factor);
            bottomColor = lerpColor(colors.dawn.bottom, colors.sunset.bottom, factor);
        } else {
            const factor = (progress - 0.5) / 0.5;
            topColor = lerpColor(colors.sunset.top, colors.night.top, factor);
            bottomColor = lerpColor(colors.sunset.bottom, colors.night.bottom, factor);
        }

        document.documentElement.style.setProperty('--frame-progress', progress.toFixed(4));

        const atmosphereOverlay = document.querySelector('.atmosphere-overlay');
        if (atmosphereOverlay) {
            atmosphereOverlay.style.setProperty('--atmos-top', topColor);
            atmosphereOverlay.style.setProperty('--atmos-bottom', bottomColor);
        }

        if (vignetteOverlay) {
            if (progress < 0.3) {
                vignetteOverlay.classList.remove('intense');
            } else if (progress > 0.7) {
                vignetteOverlay.classList.add('intense');
            }
        }
    }

    function detectPathPattern() {
        return new Promise((resolve) => {
            const patterns = [
                { path: 'frames/ezgif-frame-', suffix: '.jpg', digits: 3 },
                { path: 'img/frames/frame_', suffix: '.jpg', digits: 3 }
            ];
            let idx = 0;

            function tryNext() {
                if (idx >= patterns.length) {
                    resolve(patterns[0]);
                    return;
                }
                const pattern = patterns[idx];
                const testImg = new Image();
                const numStr = String(1).padStart(pattern.digits, '0');
                testImg.src = pattern.path + numStr + pattern.suffix;

                testImg.onload = () => resolve(pattern);
                testImg.onerror = () => {
                    idx++;
                    tryNext();
                };
            }
            tryNext();
        });
    }

    function drawFrameCover(ctx, canvas, img) {
        if (!ctx || !canvas || !img) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.width;
        const ih = img.height;

        const ir = iw / ih;
        const cr = cw / ch;

        let dw, dh, dx, dy;

        if (cr > ir) {
            dw = cw;
            dh = cw / ir;
            dx = 0;
            dy = (ch - dh) / 2;
        } else {
            dw = ch * ir;
            dh = ch;
            dx = (cw - dw) / 2;
            dy = 0;
        }

        ctx.drawImage(img, dx, dy, dw, dh);
    }

    function resizeCanvas() {
        if (!inicioSection) return;
        const rect = inicioSection.getBoundingClientRect();

        if (heroCanvas) {
            heroCanvas.width = rect.width;
            heroCanvas.height = rect.height;
        }

        if (currentFrameImage && heroCtx && heroCanvas) {
            drawFrameCover(heroCtx, heroCanvas, currentFrameImage);
        }
    }

    let resizeTimer = null;
    function onWindowResize() {
        resizeCanvas();
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {}, 150);
    }

    function tick(timestamp) {
        if (!isVisible) {
            animFrameId = null;
            return;
        }

        if (!lastTime) lastTime = timestamp;
        const elapsed = timestamp - lastTime;
        lastTime = timestamp;

        accumulatedTime += elapsed;

        const loopTime = accumulatedTime % LOOP_DURATION;
        const progress = loopTime / LOOP_DURATION;

        const frameIndex = Math.min(
            Math.floor(progress * frames.length),
            frames.length - 1
        );

        if (frames[frameIndex] && frameIndex !== currentFrameIndex) {
            currentFrameIndex = frameIndex;
            currentFrameImage = frames[frameIndex];
            if (heroCtx && heroCanvas) {
                drawFrameCover(heroCtx, heroCanvas, currentFrameImage);
            }
        }

        updateAtmosphere(progress);

        animFrameId = requestAnimationFrame(tick);
    }

    function dismissPreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }
    }

    function initEngine(loadedFrames) {
        frames = loadedFrames;
        isInitialized = true;

        resizeCanvas();
        window.addEventListener('resize', onWindowResize);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isVisible = entry.isIntersecting;
                if (isVisible && !animFrameId) {
                    lastTime = performance.now();
                    animFrameId = requestAnimationFrame(tick);
                }
            });
        }, { threshold: 0.05 });

        if (inicioSection) {
            observer.observe(inicioSection);
        }
    }

    function runMobileFallback() {
        if (inicioSection) {
            inicioSection.style.backgroundImage = "url('img/BANNERV3.png')";
            inicioSection.style.backgroundSize = "cover";
            inicioSection.style.backgroundPosition = "center";
        }
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.display = 'none';
        }
    }

    function startPreload() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            runMobileFallback();
            return;
        }

        detectPathPattern().then((pattern) => {
            let loadedCount = 0;
            const promises = [];

            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                promises.push(new Promise((resolve) => {
                    const img = new Image();
                    const numStr = String(i).padStart(pattern.digits, '0');
                    img.src = pattern.path + numStr + pattern.suffix;

                    img.onload = () => {
                        loadedCount++;
                        if (preloaderBar) {
                            const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
                            preloaderBar.style.width = percent + '%';
                            if (preloaderText) {
                                preloaderText.textContent = percent + '%';
                            }
                        }
                        resolve(img);
                    };

                    img.onerror = () => {
                        resolve(null);
                    };
                }));
            }

            Promise.all(promises).then((results) => {
                const validFrames = results.filter(item => item !== null);
                dismissPreloader();
                if (validFrames.length > 0) {
                    initEngine(validFrames);
                } else {
                    runMobileFallback();
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startPreload);
    } else {
        startPreload();
    }
})();
