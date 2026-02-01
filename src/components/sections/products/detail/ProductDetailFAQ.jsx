import React from 'react';
import styled from 'styled-components';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { Trans } from 'react-i18next';
import Section from '../../../ui/Section';
import SanityPortableText from '../../../portable/SanityPortableText';

const FAQSection = styled.div`
  margin: 0 -4rem;
  padding-left: 4rem;
  padding-right: 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const FAQHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const FAQTitleWrapper = styled.h2`
  font-size: 2.8rem;
  font-weight: 400;
  color: #374151;
  margin: 0 0 0.5rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const FAQProductName = styled.span`
  color: #013613;
  font-weight: 500;
`;

const FAQSubtitle = styled.p`
  font-size: 1.3rem;
  color: #6b7280;
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.15rem;
  }
`;

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#1a5618' : '#e5e7eb')};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ $isOpen }) => ($isOpen ? '#1a5618' : '#1a561850')};
    box-shadow: 0 4px 20px rgba(26, 86, 24, 0.08);
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.25rem 1.5rem;
    gap: 1rem;
  }
`;

const FAQQuestionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
`;

const FAQNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%)'
      : 'linear-gradient(135deg, #e8f5e8 0%, #d4ecd4 100%)'};
  color: ${({ $isOpen }) => ($isOpen ? '#ffffff' : '#1a5618')};
  font-size: 1.1rem;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

const FAQQuestionText = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ $isOpen }) => ($isOpen ? '#013613' : '#374151')};
  line-height: 1.4;
  transition: color 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const FAQIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%)'
      : '#f3f4f6'};
  flex-shrink: 0;
  transition: all 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};

  svg {
    font-size: 1.3rem;
    color: ${({ $isOpen }) => ($isOpen ? '#ffffff' : '#6b7280')};
    transition: color 0.3s ease;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    svg { font-size: 1.1rem; }
  }
`;

const FAQAnswerWrapper = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const FAQAnswer = styled.div`
  padding: 0 2rem 1.5rem 5.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1.5rem 1.25rem 1.5rem;
  }
`;

const FAQAnswerText = styled.p`
  font-size: 1.2rem;
  color: #000000;
  line-height: 1.8;
  margin: 0;
  padding-top: 0.5rem;
  border-top: 1px dashed #e5e7eb;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.1rem;
  }
`;

export default function ProductDetailFAQ({ items, productName, t }) {
  const [openFAQIndex, setOpenFAQIndex] = React.useState(null);
  const toggleFAQ = (index) => setOpenFAQIndex((prev) => (prev === index ? null : index));

  const faqItems = Array.isArray(items) ? items : [];

  return (
    <FAQSection>
      <Section>
        <FAQHeader>
          <FAQTitleWrapper>
            <Trans
              i18nKey="productDetail.faq.title"
              defaults="<product>{{product}}</product> – Najczęściej zadawane pytania"
              values={{ product: productName }}
              components={{ product: <FAQProductName /> }}
            />
          </FAQTitleWrapper>
          <FAQSubtitle>
            {t(
              'productDetail.faq.subtitle',
              'Znajdź odpowiedzi na najważniejsze pytania dotyczące naszego produktu'
            )}
          </FAQSubtitle>
        </FAQHeader>

        <FAQContainer>
          {faqItems.map((faq, index) => (
            <FAQItem key={index} $isOpen={openFAQIndex === index}>
              <FAQQuestion onClick={() => toggleFAQ(index)}>
                <FAQQuestionContent>
                  <FAQNumber $isOpen={openFAQIndex === index}>
                    {String(index + 1).padStart(2, '0')}
                  </FAQNumber>
                  <FAQQuestionText $isOpen={openFAQIndex === index}>{faq.question}</FAQQuestionText>
                </FAQQuestionContent>
                <FAQIconWrapper $isOpen={openFAQIndex === index}>
                  {openFAQIndex === index ? <FiMinus /> : <FiPlus />}
                </FAQIconWrapper>
              </FAQQuestion>

              <FAQAnswerWrapper $isOpen={openFAQIndex === index}>
                <FAQAnswer>
                  {Array.isArray(faq?.answer) ? (
                    <FAQAnswerText as="div">
                      <SanityPortableText value={faq.answer} />
                    </FAQAnswerText>
                  ) : (
                    <FAQAnswerText>{faq.answer}</FAQAnswerText>
                  )}
                </FAQAnswer>
              </FAQAnswerWrapper>
            </FAQItem>
          ))}
        </FAQContainer>
      </Section>
    </FAQSection>
  );
}
