"use client";

import { createContext, useContext } from "react";

export type PageMeta = {
  pageId: string;
  businessId: string;
  slug: string;
  shareUrl: string;
};

export const PageMetaContext = createContext<PageMeta>({
  pageId: "",
  businessId: "",
  slug: "",
  shareUrl: "",
});

export function usePageMeta() {
  return useContext(PageMetaContext);
}
