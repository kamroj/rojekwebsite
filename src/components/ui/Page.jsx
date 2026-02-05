import React from 'react';
import PageHeader from './PageHeader';
import MaxWidthContainer from './MaxWidthContainer';
import AppBreadcrumbs from './AppBreadcrumbs';
import styles from './Page.module.css';

/**
 * Reusable Page component
 * Usage:
 * <Page imageSrc="/path/to/img.jpg" title="Page title">
 *   ...page content...
 * </Page>
 *
 * Props passthrough to PageHeader:
 * - imageSrc, title, height, id, overlayColor, contentBg, contentColor
 * - headerProps: optional object to pass any extra props to PageHeader
 *
 * Notes:
 * - HeaderContent is rendered inside MaxWidthContainer via PageHeader's contentInMaxWidth
 * - Children are rendered as-is; use Section/MaxWidthContainer inside if needed
 */
const Page = ({
    imageSrc,
    headerImage,
    title,
    height = 500,
    id,
    overlayColor,
    contentBg,
    contentColor,
    headerProps,
    children,
    ...rest
}) => {
    return (
        <div className={styles.wrapper} {...rest}>
            <PageHeader
                imageSrc={imageSrc}
                image={headerImage}
                title={title}
                id={id}
                height={height}
                overlayColor={overlayColor}
                contentBg={contentBg}
                contentColor={contentColor}
                contentInMaxWidth
                {...(headerProps || {})}
            />
            <MaxWidthContainer>
                <AppBreadcrumbs />
                {children}
            </MaxWidthContainer>
        </div>
    );
};

export default Page;
