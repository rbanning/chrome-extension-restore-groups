import React from "react";

import { Common } from "../../common";

import "./styles.scss";

export interface IHeaderProps {
  title?: string;
  brand?: string;
}

export const Header = (props: IHeaderProps) => {
  let { title, brand } = props;
  if (!title) {
    title = Common.appName;
  } else if (title.startsWith('+')) {
    title = `${Common.appName} ${title.substr(1)}`;
  } else if (title.startsWith('-')) {
    title = `${title.substr(1)} ${Common.appName}`;
  }

  
  brand ??= Common.appCompany;

  return (
    <>
      <header>
        <span className="title flex">{title}</span>
        <span className="brand">{brand}</span>
      </header>
    </>
  );

}