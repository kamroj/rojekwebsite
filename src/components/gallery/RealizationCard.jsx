import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CardWrapper = styled.div`
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  background-color: #000;

  &:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,0.4);
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const Title = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.bottleGreen}dd;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  max-width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
`;

const TagsWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 8px;
  z-index: 3;
  pointer-events: none;
`;

const Tag = styled.span`
  background-color: ${({ theme }) => theme.colors.bottleGreenLight};
  color: ${({ theme }) => theme.colors.textLight};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
  white-space: nowrap;
`;

const RealizationCard = ({ id, src, title, tags = {} }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/realizations/${id}`);
  };

  // stable order for display
  const tagOrder = ['produkt', 'typ', 'kolor'];
  const tagValues = tagOrder.map((k) => tags[k]).filter(Boolean);

  return (
    <CardWrapper
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      <Image src={src} alt={title} draggable={false} />
      {tagValues.length > 0 && (
        <TagsWrapper>
          {tagValues.map((t, i) => (
            <Tag key={i}>#{t.replace(/_/g, ' ')}</Tag>
          ))}
        </TagsWrapper>
      )}
      <Title>{title}</Title>
    </CardWrapper>
  );
};

export default RealizationCard;
