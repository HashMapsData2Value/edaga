import {
  Breadcrumb as BreadcrumbContainer,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";

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
                    <Link to={option.link}>{option.label}</Link>
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
