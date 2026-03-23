'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * TourOverlay Component
 * 
 * Creates a spotlight effect that highlights specific elements
 * Supports different user roles and custom tour steps
 * 
 * Features:
 * - Animated spotlight highlight without blur
 * - Step-by-step navigation
 * - Fully responsive positioning (mobile/tablet/desktop)
 * - Dark overlay with transparency
 * - Smart tooltip positioning (above/below/left/right)
 * - Prevents overflow on all screen sizes
 */

interface TourStep {
  selector: string;
  title: string;
  description: string;
  padding?: number;
  borderRadius?: string;
  tip?: string;
}

interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
  maxWidth: string;
  maxHeight: string;
}

interface TourOverlayProps {
  steps?: TourStep[];
  currentStep?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
  isVisible?: boolean;
}

export default function TourOverlay({ 
  steps = [], 
  currentStep = 0, 
  onNext, 
  onPrev, 
  onSkip, 
  onComplete,
  isVisible = false 
}: TourOverlayProps) {
  const [highlight, setHighlight] = useState<HighlightPosition | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition>({ top: 0, left: 0, maxWidth: '448px', maxHeight: 'calc(100vh - 24px)' });
  const [viewportWidth, setViewportWidth] = useState(1024);
  const overlayRef = useRef(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * Calculate responsive tooltip position to prevent overflow
   * Prefers below the highlight, but switches to above if needed
   * Handles mobile, tablet, and desktop viewports
   */
  const calculateTooltipPosition = useCallback((highlight: HighlightPosition): TooltipPosition => {
    const TOOLTIP_GAP = 16;
    const SCREEN_PADDING = 12;
    const MIN_WIDTH = 260;
    const MAX_WIDTH = 450;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Determine responsive max-width based on viewport
    let maxWidth: string;
    if (viewportWidth < 480) {
      // Mobile: use 90% of viewport width
      maxWidth = `min(90vw, ${MIN_WIDTH}px)`;
    } else if (viewportWidth < 768) {
      // Tablet: use 85% of viewport width
      maxWidth = `min(85vw, ${MAX_WIDTH - 50}px)`;
    } else {
      // Desktop: use full max-width
      maxWidth = `${MAX_WIDTH}px`;
    }

    // Calculate available space
    const spaceBelow = viewportHeight - (highlight.top + highlight.height + TOOLTIP_GAP);
    const spaceAbove = highlight.top - TOOLTIP_GAP;
    const TOOLTIP_HEIGHT = viewportWidth < 480 ? 300 : 360; // Approximate height of tooltip

    // Determine if tooltip should appear above or below
    const showAbove = spaceBelow < TOOLTIP_HEIGHT && spaceAbove > TOOLTIP_HEIGHT;

    let calculatedTop = highlight.top + highlight.height + TOOLTIP_GAP;
    if (showAbove) {
      calculatedTop = highlight.top - TOOLTIP_HEIGHT - TOOLTIP_GAP;
    }

    // Constrain top position to prevent off-screen
    calculatedTop = Math.max(SCREEN_PADDING, Math.min(calculatedTop, viewportHeight - TOOLTIP_HEIGHT - SCREEN_PADDING));

    // Calculate horizontal position (center on highlight)
    let highlightCenterX = highlight.left + highlight.width / 2;
    const tooltipEstimatedWidth = viewportWidth < 480 ? viewportWidth * 0.9 : 400;
    const tooltipLeftOffset = tooltipEstimatedWidth / 2;

    let calculatedLeft = highlightCenterX - tooltipLeftOffset;

    // Constrain left position to prevent off-screen
    calculatedLeft = Math.max(
      SCREEN_PADDING,
      Math.min(calculatedLeft, viewportWidth - tooltipEstimatedWidth - SCREEN_PADDING)
    );

    return {
      top: calculatedTop,
      left: calculatedLeft,
      maxWidth,
      maxHeight: `calc(100vh - ${SCREEN_PADDING * 2}px)`,
    };
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !steps[currentStep]) return;

    const step = steps[currentStep];
    
    // Function to calculate and update highlight position
    const updateHighlightPosition = (shouldScrollIntoView = false) => {
      const allMatchedElements = Array.from(document.querySelectorAll(step.selector));
      const element = allMatchedElements.find((candidate) => {
        const rect = candidate.getBoundingClientRect();
        const style = window.getComputedStyle(candidate);

        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          style.opacity !== '0'
        );
      });

      if (!element) {
        console.warn(`Tour element not found: ${step.selector}`);
        setHighlight(null);
        setTooltipPos({
          top: 12,
          left: 12,
          maxWidth: 'calc(100vw - 24px)',
          maxHeight: 'min(50vh, 420px)',
        });
        return;
      }

      const measureAndApply = () => {
        const rect = element.getBoundingClientRect();
        const padding = step.padding || 8;
        const currentViewportWidth = window.innerWidth;
        const currentViewportHeight = window.innerHeight;

        // Use viewport-relative coordinates because spotlight is rendered with `position: fixed`.
        const highlightPos: HighlightPosition = {
          top: Math.max(8, rect.top - padding),
          left: Math.max(8, rect.left - padding),
          width: Math.min(rect.width + padding * 2, currentViewportWidth - 16),
          height: Math.min(rect.height + padding * 2, currentViewportHeight - 16),
        };

        setHighlight(highlightPos);

        if (currentViewportWidth < 1024) {
          setTooltipPos({
            top: 12,
            left: 12,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: 'min(50vh, 420px)',
          });
          return;
        }

        setTooltipPos(calculateTooltipPosition(highlightPos));
      };

      if (shouldScrollIntoView) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        window.setTimeout(measureAndApply, 220);
        return;
      }

      measureAndApply();
    };

    // Calculate position immediately when step changes
    updateHighlightPosition(true);

    // Recalculate on window resize and scroll to keep spotlight locked to target.
    const handleResize = () => {
      updateHighlightPosition();
    };

    const handleScroll = () => {
      updateHighlightPosition();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isVisible, currentStep, steps, calculateTooltipPosition]);

  if (!isVisible || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const isCompactViewport = viewportWidth < 1024;

  return (
    <>
      {/* Dark Overlay - No blur to keep highlight clear */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={onSkip}
      />

      {/* Spotlight Highlight */}
      {highlight && (
        <div
          className="fixed z-40 pointer-events-none"
          style={{
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px 0 rgba(195, 95, 70, 0.5)',
            borderRadius: step.borderRadius || '8px',
            animation: 'pulse-highlight 2s ease-in-out infinite',
          }}
        >
          {/* Allow clicks on highlighted element */}
          <div className="absolute inset-0 pointer-events-auto" />
        </div>
      )}

      {/* Info Tooltip - Responsive positioning */}
      {highlight && (
        <div
          ref={tooltipRef}
          className="fixed z-50 overflow-y-auto bg-white p-4 shadow-2xl transition-all duration-300 dark:bg-slate-800 sm:rounded-lg sm:p-6"
          style={{
            top: isCompactViewport ? 'auto' : `${tooltipPos.top}px`,
            left: isCompactViewport ? '12px' : `${tooltipPos.left}px`,
            right: isCompactViewport ? '12px' : 'auto',
            bottom: isCompactViewport ? 'calc(env(safe-area-inset-bottom) + 86px)' : 'auto',
            maxWidth: tooltipPos.maxWidth,
            maxHeight: tooltipPos.maxHeight,
            width: isCompactViewport ? 'auto' : 'calc(100vw - 24px)',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-xs font-semibold text-[#c35f46] uppercase tracking-wide">
                Langkah {currentStep + 1} dari {steps.length}
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 break-words">
                {step.title}
              </h3>
            </div>
            <button
              onClick={onSkip}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Highlight Text (Optional) */}
          {step.tip && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs text-amber-900 dark:text-amber-100">
                💡 <span className="font-medium">{step.tip}</span>
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onPrev}
              disabled={isFirstStep}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm font-medium"
            >
              <ChevronLeft size={16} />
              Sebelumnya
            </button>

            {!isLastStep ? (
              <button
                onClick={onNext}
                className="flex-1 min-w-32 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#c35f46] text-white hover:bg-[#b8533d] transition text-sm font-medium"
              >
                Selanjutnya
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="flex-1 min-w-32 px-4 py-2 rounded-lg bg-[#c35f46] text-white hover:bg-[#b8533d] transition text-sm font-medium"
              >
                Selesai Tutorial
              </button>
            )}

            <button
              onClick={onSkip}
              className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm font-medium"
            >
              Lewati
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-1 justify-center mt-4 flex-wrap">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-[#c35f46] w-6'
                    : index < currentStep
                      ? 'bg-[#c35f46] opacity-50'
                      : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-highlight {
          0%, 100% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px 0 rgba(195, 95, 70, 0.5);
          }
          50% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px 0 rgba(195, 95, 70, 0.8);
          }
        }
      `}</style>
    </>
  );
}
