import React from 'react';
import styled from 'styled-components';
import { FiPhone } from 'react-icons/fi';
import Section from '../../common/Section';
import { Link } from 'react-router-dom';

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%);
  color: #ffffff;
  padding: 1.1rem 2.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.15rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 3px 10px 0px rgb(13 43 12 / 35%);
  }

  svg {
    font-size: 1.3rem;
  }
`;

const CTASection = styled.div`
  padding: 4rem 0;
  margin: 3rem 0;
  border-top: 1px solid #e5e7eb;
`;

const CTAInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 500;
  color: #013613;
  margin: 0 0 1rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.8rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.7;
`;

const CTANote = styled.span`
  display: block;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #9ca3af;
`;

export default function ProductDetailCTA({ title, description, note, t, contactHref = '/kontakt' }) {
  return (
    <Section>
      <CTASection>
        <CTAInner>
          <CTATitle>{title}</CTATitle>
          <CTADescription>{description}</CTADescription>
          <PrimaryButton to={contactHref}>
            <FiPhone />
            {t('common.contactUs', 'Skontaktuj się z nami')}
          </PrimaryButton>
          <CTANote>{note}</CTANote>
        </CTAInner>
      </CTASection>
    </Section>
  );
}
