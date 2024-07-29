import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";

type BreadcrumbOption = { label: string; link: string };
type BreadcrumbSeparator = { separator: true };

export type BreadcrumbItem = BreadcrumbOption | BreadcrumbSeparator;

export interface BreadcrumbProps {
  options: BreadcrumbItem[];
}

const Breadcrumb = ({ options }: BreadcrumbProps) => {
  return (
    <BreadcrumbContainer className="hidden md:flex">
      <BreadcrumbList>
        {options.map((option: BreadcrumbItem, index: number) => {
          const isLast = index === options.length - 1;
          return (
            <Fragment key={index}>
              {"separator" in option ? (
                <BreadcrumbSeparator />
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <a href={option.link}>{option.label}</a>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
