import { useEffect } from "react";

export interface RouteMeta {
  title?: string;
  name?: string;
  content?: string;
  property?: string;
}

export interface RouteHead {
  meta?: RouteMeta[];
}

export interface RouteOptions<TComponent = any> {
  head?: () => RouteHead;
  component: TComponent;
  [key: string]: any;
}

export function createFileRoute(path: string) {
  return function <T extends RouteOptions>(options: T) {
    return {
      path,
      ...options,
      useHead: () => {
        useEffect(() => {
          if (!options.head) return;
          const headData = options.head();
          if (headData.meta) {
            headData.meta.forEach((item) => {
              if (item.title) {
                document.title = item.title;
              }
              if (item.name && item.content) {
                let el = document.querySelector(`meta[name="${item.name}"]`);
                if (!el) {
                  el = document.createElement("meta");
                  el.setAttribute("name", item.name);
                  document.head.appendChild(el);
                }
                el.setAttribute("content", item.content);
              }
              if (item.property && item.content) {
                let el = document.querySelector(`meta[property="${item.property}"]`);
                if (!el) {
                  el = document.createElement("meta");
                  el.setAttribute("property", item.property);
                  document.head.appendChild(el);
                }
                el.setAttribute("content", item.content);
              }
            });
          }
        }, []);
      },
    };
  };
}
