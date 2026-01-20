import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

// Visuals intentionally match the old ProductDetail breadcrumbs (no visual change)
const BreadcrumbsNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  font-size: 1.1rem;
  color: #6b7280;
  flex-wrap: wrap;

  a {
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #1a5618;
    }
  }

  span {
    color: #1a5618;
    font-weight: 500;
  }

  svg {
    font-size: 0.85rem;
    color: #9ca3af;
  }
`;

/**
 * @param {{ items: Array<{ label: string, to?: string }> }} props
 */
const Breadcrumbs = ({ items }) => {
  if (!items || items.length <= 1) return null;

  return (
    <BreadcrumbsNav aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && <IoIosArrowForward />}
            {!isLast && item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </BreadcrumbsNav>
  );
};

export default Breadcrumbs;

