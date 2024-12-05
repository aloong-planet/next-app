'use client';

import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface BreadcrumbsResult {
    items: React.ReactNode[];
    page: React.ReactNode | null;
}

export function Breadcrumbs() {
    // Get the current pathname from Next.js router
    const pathname = usePathname();

    // Memoize breadcrumb calculation to avoid unnecessary recalculation
    const buildBreadcrumbs = React.useMemo((): BreadcrumbsResult => {
        // Split pathname into segments and remove empty strings
        const segments = pathname.split("/").filter(Boolean);

        // If no segments (we're on homepage), return empty result
        if (segments.length === 0) {
            return {
                items: [],
                page: null
            };
        }

        // Build intermediate breadcrumb items (all but the last segment)
        const items = segments.slice(0, -1).map((segment, index) => {
            // Construct the href for this breadcrumb by joining all segments up to current
            const href = `/${segments.slice(0, index + 1).join("/")}`;

            // Return breadcrumb item with separator
            return (
              <React.Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                      <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                  </BreadcrumbItem>
              </React.Fragment>
            );
        });

        // Create the final page breadcrumb (last segment)
        const page = (
          <React.Fragment key={pathname}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                  <BreadcrumbPage>{segments[segments.length - 1]}</BreadcrumbPage>
              </BreadcrumbItem>
          </React.Fragment>
        );

        return {
            items,
            page
        };
    }, [pathname]); // Only recalculate when pathname changes

    // Render the breadcrumb navigation
    return (
      <Breadcrumb className="flex px-4">
          <BreadcrumbList>
              {/* Home link is always present */}
              <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              {/* Render intermediate breadcrumb items */}
              {buildBreadcrumbs.items}
              {/* Render the final page breadcrumb */}
              {buildBreadcrumbs.page}
          </BreadcrumbList>
      </Breadcrumb>
    );
}