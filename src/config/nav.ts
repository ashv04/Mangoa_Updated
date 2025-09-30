export interface NavLink {
  label: string;
  href: string;
  auth?: boolean;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Browse Series",
    href: "/browse"
  },
  {
    label: "Discover",
    href: "/discover"
  },
  {
    label: "Your Dashboard",
    href: "/dashboard",
    auth: true
  },
  {
    label: "Contribute",
    href: "/contribute"
  },
  {
    label: "About Us",
    href: "/about"
  },
  {
    label: "Get in Touch",
    href: "/contact"
  }
];

export const FOOTER_LINKS: FooterSection[] = [
  {
    title: "Community",
    links: [
      {
        label: "Browse Series",
        href: "/browse"
      },
      {
        label: "Discover",
        href: "/discover"
      },
      {
        label: "Fan Guidelines",
        href: "/guidelines"
      },
      {
        label: "Contribute",
        href: "/contribute"
      }
    ]
  },
  {
    title: "Resources",
    links: [
      {
        label: "About Us",
        href: "/about"
      },
      {
        label: "Get in Touch",
        href: "/contact"
      },
      {
        label: "Your Dashboard",
        href: "/dashboard",
        auth: true
      }
    ]
  },
  {
    title: "Support",
    links: [
      {
        label: "Help Center",
        href: "/help"
      },
      {
        label: "Privacy Policy",
        href: "/privacy"
      },
      {
        label: "Terms of Service",
        href: "/terms"
      }
    ]
  }
];