import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  links: any;
}
const Breadcrumb = ({ pageName, links }: BreadcrumbProps) => {
  return (
    <div className="breadcrumb-page-header d-flex align-items-center">
      <h3 className="breadcrumb-page-title">{pageName}</h3>
      <ul className="breadcrumb-page-header-ul d-flex gap-2">
        <li className="breadcrumb-page-header-li">
          <Link href="/" className="m-nav__link m-nav__link--icon">
            <i className="fa-solid fa-house" />
          </Link>
        </li>
        {links &&
          links.length > 0 &&
          links.map((link: any, index: number) => {
            return (
              <li key={index} className="breadcrumb-page-header-li">
                {link.label && <span className="mr-1">-</span>}
                <Link
                  href={link.route}
                  className="m-nav__link m-nav__link--icon"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Breadcrumb;
