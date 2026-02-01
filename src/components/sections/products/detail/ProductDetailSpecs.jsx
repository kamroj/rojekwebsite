import React from 'react';
import styled, { css } from 'styled-components';
import { BsQuestionCircle } from 'react-icons/bs';

const SpecsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-radius: 12px;
  background: #ffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.096);
  align-items: stretch;
`;

const SpecCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  min-height: 96px;
  z-index: 1;

  ${({ $isTooltipOpen }) =>
    $isTooltipOpen &&
    css`
      z-index: 999999;
    `}
`;

const SpecIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background-color: #f0f4f0;
  border: 1px solid #e0e5e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 1.8rem;
    color: #1a5618;
  }
`;

const SpecContent = styled.div`
  flex: 1;
`;

const SpecValue = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #013613;
  margin-bottom: 0.25rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
  }
`;

const SpecLabel = styled.div`
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.4;
`;

const TooltipBubble = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  max-width: min(75vw, 320px);
  background: #ffffff;
  color: #374151;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  line-height: 1.5;
  z-index: 999999;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;

  opacity: 0;
  transform: translateY(-4px);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 10px;
    width: 14px;
    height: 14px;
    background: #ffffff;
    border-left: 1px solid #e5e7eb;
    border-top: 1px solid #e5e7eb;
    transform: rotate(45deg);
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;

  &:hover ${TooltipBubble},
  &:focus-within ${TooltipBubble} {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  &[data-open='true'] ${TooltipBubble} {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`;

const TooltipButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #014f1b55;
  background: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: #1a5618;
    border-color: rgba(6, 86, 3, 0.586);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 86, 24, 0.25);
    border-color: rgba(26, 86, 24, 0.65);
  }

  svg {
    font-size: 1.2rem;
    color: #004505;
  }
`;

export default function ProductDetailSpecs({
  product,
  specsDefs,
  specsOrderList,
  tooltipKeyMap,
  t,
}) {
  const [openSpecTooltip, setOpenSpecTooltip] = React.useState(null);

  React.useEffect(() => {
    if (!openSpecTooltip) return;
    const onDocClick = () => setOpenSpecTooltip(null);
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [openSpecTooltip]);

  return (
    <SpecsSection>
      {specsOrderList.map((specKey) => {
        const def = specsDefs?.[specKey];
        const value = product?.specs?.[specKey];
        if (!def || !value) return null;

        const IconComponent = def.icon;
        const isTooltipOpen = openSpecTooltip === specKey;

        return (
          <SpecCard key={specKey} $isTooltipOpen={isTooltipOpen}>
            <SpecIconWrapper>
              <IconComponent />
            </SpecIconWrapper>
            <SpecContent>
              <SpecValue>{value}</SpecValue>
              <SpecLabel>{def?.labelKey ? t(def.labelKey, def.label) : def.label}</SpecLabel>
            </SpecContent>

            {tooltipKeyMap?.[specKey] && (
              <TooltipWrapper
                data-open={isTooltipOpen ? 'true' : 'false'}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <TooltipButton
                  type="button"
                  aria-label={t('productSpecs.tooltipAria', {
                    spec: def?.labelKey ? t(def.labelKey, def.label) : def.label,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenSpecTooltip((prev) => (prev === specKey ? null : specKey));
                  }}
                  onBlur={() => setOpenSpecTooltip(null)}
                >
                  <BsQuestionCircle />
                </TooltipButton>

                <TooltipBubble role="tooltip">{t(tooltipKeyMap[specKey])}</TooltipBubble>
              </TooltipWrapper>
            )}
          </SpecCard>
        );
      })}
    </SpecsSection>
  );
}