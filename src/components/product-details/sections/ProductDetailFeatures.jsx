import React from 'react';
import styled from 'styled-components';
import SanityPortableText from '../../common/SanityPortableText';

const FeaturesSection = styled.div`
  padding: 5rem 0 0 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 400;
  color: #013613;
  margin: 0 0 3rem 0;
  text-align: ${({ $center }) => ($center ? 'center' : 'left')};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }
`;

const FeaturesLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #0a0a0a;
  aspect-ratio: 4/3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.096);

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: -1;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }
`;

const ProductVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FeaturesContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  gap: 1rem;
`;

const FeatureItem = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #00460f52;
  transition: all 0.3s ease;
`;

const FeatureText = styled.p`
  font-size: 1.3rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;

  strong {
    color: #013613;
    font-weight: 600;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: 1.2rem;
  }
`;

export default function ProductDetailFeatures({ product, title, t }) {
  if (!product?.features?.length) return null;

  return (
    <FeaturesSection>
      <SectionTitle>{title}</SectionTitle>

      <FeaturesLayout>
        <VideoWrapper>
          <ProductVideo src={product.video} autoPlay loop muted playsInline />
        </VideoWrapper>

        <FeaturesContent>
          {product.features.map((feature, index) => (
            <FeatureItem key={index}>
              {Array.isArray(feature) ? (
                <FeatureText as="div">
                  <SanityPortableText value={feature} variant="compact" />
                </FeatureText>
              ) : (
                <FeatureText dangerouslySetInnerHTML={{ __html: feature?.text || '' }} />
              )}
            </FeatureItem>
          ))}
        </FeaturesContent>
      </FeaturesLayout>
    </FeaturesSection>
  );
}
