import React from "react";

import { Common } from "../../common";

import "./styles.scss";

export interface IFooterProps {
  year?: string;
  copyright?: string;
}

export const Footer = (props: IFooterProps) => {
  let { year, copyright } = props;
  
  copyright ??= Common.appCompany;
  year ??= `${new Date().getFullYear()}`;

  return (
    <>
      <div className="footer-wrapper">
        <footer>
          <span className="copyright">&copy;{year} - {copyright} - all rights reserved</span>
        </footer>
      </div>
    </>
  );

}